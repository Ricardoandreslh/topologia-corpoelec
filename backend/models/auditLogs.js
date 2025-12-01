const { getPool } = require('../db');

async function createAudit({ user_id = null, action = null, resource_type = null, resource_id = null, payload = null }) {
  const pool = getPool();
  const payloadJson = payload ? JSON.stringify(payload) : null;
  const [r] = await pool.execute(
    'INSERT INTO audit_logs (user_id, action, resource_type, resource_id, payload) VALUES (?,?,?,?,?)',
    [user_id, action, resource_type, resource_id, payloadJson]
  );
  return { id: r.insertId };
}

module.exports = { createAudit };