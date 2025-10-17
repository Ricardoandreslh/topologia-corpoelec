const { verifyAccess } = require('../utils/jwt');

function getTokenFromHeader(req) {
  const h = req.headers.authorization || '';
  const parts = h.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    const payload = verifyAccess(token);
    req.user = payload;
    if (req.user.status && req.user.status !== 'active') {
      return res.status(403).json({ error: 'Usuario deshabilitado' });
    }
    next();
  } catch (_e) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(...roles) {
  const allowed = new Set(roles);
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (allowed.has(req.user.role) || req.user.role === 'admin') return next();
    return res.status(403).json({ error: 'Acceso denegado' });
  };
}

module.exports = { requireAuth, requireRole, getTokenFromHeader };