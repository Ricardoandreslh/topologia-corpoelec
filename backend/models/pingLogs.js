const { getPool, query } = require('../db');

async function logPing({ device_id, success, latency_ms = null }) {
  const [r] = await getPool().execute(
    'INSERT INTO ping_logs (device_id, success, latency_ms) VALUES (?,?,?)',
    [device_id, success ? 1 : 0, latency_ms]
  );
  return { id: r.insertId };
}

async function listRecentByDevice(device_id, limit = 50) {
  return await query(
    'SELECT id, device_id, success, latency_ms, ran_at FROM ping_logs WHERE device_id=? ORDER BY ran_at DESC LIMIT ?',
    [device_id, limit]
  );
}

module.exports = { logPing, listRecentByDevice };