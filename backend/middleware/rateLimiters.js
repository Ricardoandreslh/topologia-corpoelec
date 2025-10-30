const rateLimit = require('express-rate-limit');

const RATE_WINDOW_MIN = parseInt(process.env.RATE_WINDOW_MIN || '15', 10);
const RATE_MAX_REQUESTS = parseInt(process.env.RATE_MAX_REQUESTS || '100', 10);
const RATE_LOGIN_MAX = parseInt(process.env.RATE_LOGIN_MAX_REQUESTS || '10', 10);

const windowMs = RATE_WINDOW_MIN * 60 * 1000;

const apiLimiter = rateLimit({
  windowMs,
  max: RATE_MAX_REQUESTS,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' }
});

const loginLimiter = rateLimit({
  windowMs,
  max: RATE_LOGIN_MAX,
  message: { error: 'Demasiados intentos de login, intenta más tarde.' },
  keyGenerator: (req) => req.ip
});

module.exports = { apiLimiter, loginLimiter };