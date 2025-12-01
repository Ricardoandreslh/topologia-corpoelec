const { verifyAccess } = require('../utils/jwt');
const Blacklist = require('../models/blacklistedTokens');
const Sessions = require('../models/refreshTokens'); 

const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'normal'
});

const PERMISSIONS = Object.freeze({
  'devices:read':   [ROLES.ADMIN, ROLES.USER],
  'devices:write':  [ROLES.ADMIN],

  'connections:read':  [ROLES.ADMIN, ROLES.USER],
  'connections:write': [ROLES.ADMIN],

  'users:read':    [ROLES.ADMIN],
  'users:write':   [ROLES.ADMIN],
});

function getTokenFromHeader(req) {
  const h = req.headers.authorization || '';
  const parts = h.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

function jsonError(res, status, message, code) {
  return res.status(status).json({ error: message, code });
}

async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return jsonError(res, 401, 'Token requerido', 'AUTH_REQUIRED');

    const payload = verifyAccess(token);

    try {
      const isBlack = await Blacklist.isBlacklisted(token);
      if (isBlack) return jsonError(res, 401, 'Token revocado', 'TOKEN_REVOKED');
    } catch (e) {
      console.warn('Blacklist check failed', e);
    }

    try {
      const tokenJti = payload && payload.jti ? payload.jti : null;
      if (tokenJti) {
        const ses = await Sessions.getSessionByJti(tokenJti);
        if (!ses) return jsonError(res, 401, 'Sesión inválida o cerrada', 'SESSION_REVOKED');
      }
    } catch (e) {
      console.warn('Session check failed', e);
    }

    const role = String(payload.role || '').toLowerCase();
    const status = String(payload.status || 'active').toLowerCase();

    req.user = { ...payload, role, status };

    if (req.user.status !== 'active') {
      return jsonError(res, 403, 'Usuario deshabilitado', 'USER_DISABLED');
    }

    next();
  } catch (_e) {
    return jsonError(res, 401, 'Token inválido o expirado', 'TOKEN_INVALID');
  }
}

function requireRole(...roles) {
  const allowed = new Set(roles.map(r => String(r).toLowerCase()));
  return (req, res, next) => {
    if (!req.user) return jsonError(res, 401, 'No autenticado', 'AUTH_REQUIRED');

    const role = req.user.role || '';
    if (role === ROLES.ADMIN || allowed.has(role)) return next();

    return jsonError(res, 403, 'Acceso denegado', 'FORBIDDEN');
  };
}

function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(user.role);
}

function requirePermission(...permissions) {
  const perms = permissions.flat().filter(Boolean);
  return (req, res, next) => {
    if (!req.user) return jsonError(res, 401, 'No autenticado', 'AUTH_REQUIRED');

    const ok = perms.some(p => hasPermission(req.user, p));
    if (ok) return next();

    return jsonError(res, 403, 'Permiso insuficiente', 'INSUFFICIENT_PERMISSION');
  };
}

function requireSelfOrRole(getOwnerIdFromReq, ...roles) {
  const allowed = new Set(roles.map(r => String(r).toLowerCase()));
  return (req, res, next) => {
    if (!req.user) return jsonError(res, 401, 'No autenticado', 'AUTH_REQUIRED');

    const role = req.user.role || '';
    if (role === ROLES.ADMIN || allowed.has(role)) return next();

    try {
      const ownerId = getOwnerIdFromReq(req);
      if (ownerId && String(ownerId) === String(req.user.id)) return next();
    } catch (_e) {
    }
    return jsonError(res, 403, 'Acceso denegado', 'FORBIDDEN');
  };
}

module.exports = {
  requireAuth,
  requireRole,
  requirePermission,
  requireSelfOrRole,
  getTokenFromHeader,
  ROLES,
  PERMISSIONS
};