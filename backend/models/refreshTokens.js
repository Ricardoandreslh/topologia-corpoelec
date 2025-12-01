const { getPool, query } = require('../db');
const crypto = require('crypto');

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

async function createSession({ user_id, jti, refresh_hash, ip = null, user_agent = null, expires_at = null }) {
  const pool = getPool();
  const [r] = await pool.execute(
    'INSERT INTO sessions (user_id, jti, refresh_hash, ip, user_agent, expires_at) VALUES (?,?,?,?,?,?)',
    [user_id, jti, refresh_hash, ip, user_agent, expires_at]
  );
  return { id: r.insertId };
}

async function getSessionByJti(jti) {
  const rows = await query('SELECT * FROM sessions WHERE jti = ? LIMIT 1', [jti]);
  return rows[0] || null;
}

async function getSessionById(id) {
  const rows = await query('SELECT * FROM sessions WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function listSessionsByUser(user_id) {
  return await query('SELECT id, user_id, jti, ip, user_agent, expires_at, created_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
}

async function deleteSessionByJti(jti) {
  await getPool().execute('DELETE FROM sessions WHERE jti = ?', [jti]);
}

async function deleteSessionById(id) {
  await getPool().execute('DELETE FROM sessions WHERE id = ?', [id]);
}

async function deleteSessionsByUser(user_id) {
  await getPool().execute('DELETE FROM sessions WHERE user_id = ?', [user_id]);
}

async function validateSessionToken(jti, token) {
  const s = await getSessionByJti(jti);
  if (!s) return false;
  const h = hashToken(token);
  return s.refresh_hash === h;
}

module.exports = {
  hashToken,
  createSession,
  getSessionByJti,
  getSessionById,
  listSessionsByUser,
  deleteSessionByJti,
  deleteSessionById,
  deleteSessionsByUser,
  validateSessionToken
};