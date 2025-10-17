const { Users } = require('../models');
const { signAccessToken, signRefreshToken, verifyRefresh } = require('../utils/jwt');
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

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const { username, password } = req.body || {};
  const ip = req.ip;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  // Buscar usuario (puede ser null)
  const user = await Users.findByUsername(username);

  // Si existe, revisar lock activo
  if (user) {
    const lock = await getActiveLock(user.id);
    if (lock) {
      const msLeft = new Date(lock.until).getTime() - Date.now();
      const minutesLeft = Math.ceil(msLeft / 60000);
      return res.status(423).json({ error: `Cuenta bloqueada. Intenta en ~${minutesLeft} min.` });
    }
  }

  // Validar credenciales
  let success = false;
  if (user && user.status === 'active') {
    const ok = await Users.verifyPassword(password, user.password_hash);
    success = !!ok;
  }

  // Registrar intento
  await recordAttempt({
    user_id: user ? user.id : null,
    username,
    ip,
    success
  });

  // Si falla: contar recientes y bloquear si supera umbral
  if (!success) {
    if (user) {
      const fails = await countRecentFailures({ user_id: user.id });
      if (fails >= MAX_FAILED) {
        await lockUser({ user_id: user.id });
        return res.status(423).json({ error: `Demasiados intentos fallidos. Cuenta bloqueada por ${LOCK_MIN} min.` });
      }
    }
    // Mensaje genérico para no filtrar existencia de usuario
    return res.status(400).json({ error: 'Usuario/clave inválidos' });
  }

  // Éxito: limpiar locks pendientes y emitir tokens
  await clearLocks(user.id);
  await Users.updateLastLogin(user.id);
  const payload = { id: user.id, username: user.username, role: user.role, status: user.status };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });

  return res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role }
  });
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  res.json({ user: req.user });
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });
  try {
    const decoded = verifyRefresh(refreshToken);
    const user = await Users.findById(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'Usuario inválido o deshabilitado' });
    }
    const payload = { id: user.id, username: user.username, role: user.role, status: user.status };
    const accessToken = signAccessToken(payload);
    return res.json({ accessToken });
  } catch (_e) {
    return res.status(401).json({ error: 'refreshToken inválido o expirado' });
  }
}

async function logout(_req, res) {
  return res.json({ ok: true });
}

module.exports = { login, me, refresh, logout };