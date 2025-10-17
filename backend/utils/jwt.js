const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev_secret_access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_secret_refresh';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || process.env.JWT_EXPIRES || '8h';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function signAccessToken(payload, options = {}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES, ...options });
}

function signRefreshToken(payload, options = {}) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES, ...options });
}

function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh };