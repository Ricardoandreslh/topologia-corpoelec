const { Users } = require('../models');
const { signAccessToken, signRefreshToken, verifyRefresh, verifyAccess } = require('../utils/jwt');
const {
  recordAttempt,
  countRecentFailures,
  getActiveLock,
  lockUser,
  clearLocks,
  MAX_FAILED,
  WINDOW_MIN,
  LOCK_MIN
} = require('../models/authSecurity');

const Sessions = require('../models/refreshTokens');
const Blacklist = require('../models/blacklistedTokens');
const crypto = require('crypto');

function genJti() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString('hex');
}

async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    const ip = req.ip;
    const userAgent = req.get('user-agent') || null;

    if (!username || !password) {
      return res.status(400).json({ error: 'username y password son requeridos' });
    }

    const user = await Users.findByUsername(username);

    if (user) {
      const lock = await getActiveLock(user.id);
      if (lock) {
        const msLeft = new Date(lock.until).getTime() - Date.now();
        const minutesLeft = Math.ceil(msLeft / 60000);
        return res.status(423).json({ error: `Cuenta bloqueada. Intenta en ~${minutesLeft} min.` });
      }
    }

    let success = false;
    if (user && user.status === 'active') {
      const ok = await Users.verifyPassword(password, user.password_hash);
      success = !!ok;
    }

    await recordAttempt({
      user_id: user ? user.id : null,
      username,
      ip,
      success
    });

    if (!success) {
      if (user) {
        const fails = await countRecentFailures({ user_id: user.id });
        if (fails >= MAX_FAILED) {
          await lockUser({ user_id: user.id });
          return res.status(423).json({ error: `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCK_MIN} min.` });
        }
      }
      return res.status(400).json({ error: 'Usuario/clave inválidos' });
    }

    await clearLocks(user.id);
    await Users.updateLastLogin(user.id);
    const payload = { id: user.id, username: user.username, role: user.role, status: user.status };

    const accessToken = signAccessToken(payload);

    const jti = genJti();
    const refreshToken = signRefreshToken({ id: user.id, jti });

    let decoded;
    try {
      decoded = verifyRefresh(refreshToken);
    } catch (e) {
      console.error('Error verificando refresh token firmado:', e);
      return res.status(500).json({ error: 'Error generando tokens' });
    }
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

    try {
      const refreshHash = Sessions.hashToken(refreshToken);
      await Sessions.createSession({
        user_id: user.id,
        jti,
        refresh_hash: refreshHash,
        ip,
        user_agent: userAgent,
        expires_at: expiresAt
      });
    } catch (err) {
      console.error('Error guardando sesión refresh token:', err);
    }

    return res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('auth.login error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });

    let decoded;
    try {
      decoded = verifyRefresh(refreshToken);
    } catch (e) {
      return res.status(401).json({ error: 'refreshToken inválido o expirado' });
    }

    const userId = decoded.id;
    const jti = decoded.jti;
    if (!userId || !jti) return res.status(401).json({ error: 'refreshToken inválido' });

    const session = await Sessions.getSessionByJti(jti);
    if (!session) return res.status(401).json({ error: 'Refresh token revocado o no encontrado' });

    const hash = Sessions.hashToken(refreshToken);
    if (hash !== session.refresh_hash) return res.status(401).json({ error: 'Refresh token inválido' });

    await Sessions.deleteSessionByJti(jti);

    const newJti = genJti();
    const newRefreshToken = signRefreshToken({ id: userId, jti: newJti });
    const newDecoded = verifyRefresh(newRefreshToken);
    const expiresAt = newDecoded && newDecoded.exp ? new Date(newDecoded.exp * 1000) : null;

    try {
      await Sessions.createSession({
        user_id: userId,
        jti: newJti,
        refresh_hash: Sessions.hashToken(newRefreshToken),
        ip: req.ip,
        user_agent: req.get('user-agent') || null,
        expires_at: expiresAt
      });
    } catch (err) {
      console.error('Error creando nueva sesión en refresh:', err);
    }

    const user = await Users.findById(userId);
    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'Usuario inválido o deshabilitado' });
    }
    const payload = { id: user.id, username: user.username, role: user.role, status: user.status };
    const accessToken = signAccessToken(payload);

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('auth.refresh error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function logout(req, res) {
  try {
    const body = req.body || {};

    try {
      const authHeader = req.headers && req.headers.authorization;
      if (authHeader && typeof authHeader === 'string') {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
          const accessToken = parts[1];
          try {
            const decoded = verifyAccess(accessToken);
            const exp = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
            const uid = decoded && decoded.id ? decoded.id : (req.user && req.user.id ? req.user.id : null);
            await Blacklist.addBlacklistedToken({ token: accessToken, user_id: uid, expires_at: exp, reason: 'logout' });
          } catch (e) {
          }
        }
      }
    } catch (e) {
      console.warn('Error al intentar blacklistear access token en logout:', e);
    }

    if (body.refreshToken) {
      try {
        const decoded = verifyRefresh(body.refreshToken);
        if (decoded && decoded.jti) {
          await Sessions.deleteSessionByJti(decoded.jti);
        }
      } catch (_e) {
      }
      return res.json({ ok: true });
    }

    if (req.user && (body.all === true || !body.refreshToken)) {
      await Sessions.deleteSessionsByUser(req.user.id);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'refreshToken requerido o autenticar para revocar sesiones' });
  } catch (err) {
    console.error('auth.logout error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function listSessions(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    const rows = await Sessions.listSessionsByUser(req.user.id);
    return res.json({ data: rows });
  } catch (err) {
    console.error('auth.listSessions error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function revokeSession(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    const sess = await Sessions.getSessionById(id);
    if (!sess) return res.status(404).json({ error: 'No encontrada' });

    const isOwner = String(sess.user_id) === String(req.user.id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'No autorizado' });

    await Sessions.deleteSessionById(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('auth.revokeSession error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { login, me, refresh, logout, listSessions, revokeSession };