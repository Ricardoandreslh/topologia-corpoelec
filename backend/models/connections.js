const { getPool, query } = require('../db');

async function listConnectionsByNetwork(networkId) {
  return await query(
    'SELECT id, network_id, from_device_id, to_device_id, link_type, status, created_at FROM connections WHERE network_id=? ORDER BY id',
    [networkId]
  );
}

async function createConnection({ network_id, from_device_id, to_device_id, link_type = null, status = 'unknown' }) {
  const [r] = await getPool().execute(
    'INSERT INTO connections (network_id, from_device_id, to_device_id, link_type, status) VALUES (?,?,?,?,?)',
    [network_id, from_device_id, to_device_id, link_type, status]
  );
  return { id: r.insertId };
}

async function deleteConnection(id) {
  await getPool().execute('DELETE FROM connections WHERE id=?', [id]);
}

module.exports = { listConnectionsByNetwork, createConnection, deleteConnection };