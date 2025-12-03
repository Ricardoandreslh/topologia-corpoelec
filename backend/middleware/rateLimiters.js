const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const RATE_WINDOW_MIN = parseInt(process.env.RATE_WINDOW_MIN || '15', 10);
const RATE_MAX_REQUESTS = parseInt(process.env.RATE_MAX_REQUESTS || '100', 10);
const RATE_LOGIN_MAX = parseInt(process.env.RATE_LOGIN_MAX_REQUESTS || '10', 10);

const windowMs = RATE_WINDOW_MIN * 60 * 1000;


function keyFromReq(req) {
  try {
    const h = req.headers && req.headers.authorization;
    if (h && typeof h === 'string') {
      const parts = h.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        const token = parts[1];
        const payload = jwt.decode(token);
        if (payload) {
          if (payload.id) return String(payload.id);
          if (payload.jti) return String(payload.jti);
          if (payload.username) return 'u:' + String(payload.username);
        }
      }
    }
  } catch (e) {
  }
  return req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
}

const apiLimiter = rateLimit({
  windowMs,
  keyGenerator: keyFromReq,
  max: (req /*, res*/) => {
    try {
      const method = (req && req.method) ? req.method.toUpperCase() : 'GET';
      if (method === 'GET' || method === 'HEAD') {
        return parseInt(process.env.RATE_MAX_REQUESTS_GET || '500', 10);
      }
      return RATE_MAX_REQUESTS;
    } catch (e) {
      return RATE_MAX_REQUESTS;
    }
  },
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs,
  max: RATE_LOGIN_MAX,
  message: { error: 'Demasiados intentos de login, intenta más tarde.' },
  keyGenerator: (req) => req.ip
});

module.exports = { apiLimiter, loginLimiter };