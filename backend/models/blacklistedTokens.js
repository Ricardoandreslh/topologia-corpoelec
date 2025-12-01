const { getPool, query } = require('../db');
const crypto = require('crypto');

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

async function addBlacklistedToken({ token = null, access_hash = null, user_id = null, expires_at = null, reason = null }) {
  const pool = getPool();
  const hash = access_hash || (token ? hashToken(token) : null);
  if (!hash) throw new Error('token o access_hash requerido para blacklisting');
  const expVal = expires_at instanceof Date ? expires_at.toISOString().slice(0,19).replace('T',' ') : expires_at;
  await pool.execute(
    'INSERT INTO blacklisted_tokens (access_hash, user_id, expires_at, reason) VALUES (?, ?, ?, ?) ' +
    'ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), expires_at = VALUES(expires_at), reason = VALUES(reason)',
    [hash, user_id, expVal, reason]
  );
}

async function isBlacklistedByHash(access_hash) {
  if (!access_hash) return false;
  const rows = await query(
    'SELECT id FROM blacklisted_tokens WHERE access_hash = ? AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1',
    [access_hash]
  );
  return (rows && rows.length) ? true : false;
}

async function isBlacklisted(token) {
  if (!token) return false;
  const h = hashToken(token);
  return await isBlacklistedByHash(h);
}

async function pruneExpired() {
  await getPool().execute('DELETE FROM blacklisted_tokens WHERE expires_at IS NOT NULL AND expires_at <= NOW()');
}

module.exports = {
  hashToken,
  addBlacklistedToken,
  isBlacklisted,
  isBlacklistedByHash,
  pruneExpired
};