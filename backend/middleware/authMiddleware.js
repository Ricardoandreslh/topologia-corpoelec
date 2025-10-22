// backend/middleware/authMiddleware.js
const { verifyAccess } = require('../utils/jwt');

const ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'normal'
});

// Mapa de permisos básicos (ajústalo a tus recursos reales)
const PERMISSIONS = Object.freeze({
  'devices:read':   [ROLES.ADMIN, ROLES.USER],
  'devices:write':  [ROLES.ADMIN],

  'connections:read':  [ROLES.ADMIN, ROLES.USER],
  'connections:write': [ROLES.ADMIN],

  // Ejemplos (por si más adelante gestionas usuarios)
  'users:read':    [ROLES.ADMIN],
  'users:write':   [ROLES.ADMIN],
});

function getTokenFromHeader(req) {
  const h = req.headers.authorization || '';
  const parts = h.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

// Normaliza la forma del error
function jsonError(res, status, message, code) {
  return res.status(status).json({ error: message, code });
}

function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return jsonError(res, 401, 'Token requerido', 'AUTH_REQUIRED');

    const payload = verifyAccess(token);
    // Normaliza campos críticos
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

// Autorización por roles (admin siempre pasa)
function requireRole(...roles) {
  const allowed = new Set(roles.map(r => String(r).toLowerCase()));
  return (req, res, next) => {
    if (!req.user) return jsonError(res, 401, 'No autenticado', 'AUTH_REQUIRED');

    const role = req.user.role || '';
    if (role === ROLES.ADMIN || allowed.has(role)) return next();

    return jsonError(res, 403, 'Acceso denegado', 'FORBIDDEN');
  };
}

// Autorización por permisos (RBAC simple). Admin siempre pasa.
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

    // Si cualquiera de los permisos es válido, permitir
    const ok = perms.some(p => hasPermission(req.user, p));
    if (ok) return next();

    return jsonError(res, 403, 'Permiso insuficiente', 'INSUFFICIENT_PERMISSION');
  };
}

// Patrón útil: permitir si es el propio recurso o si tiene rol permitido (p.ej., admin)
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
      // ignorar y caer al deny
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