const { getPool, query } = require('../db');

async function listNetworks({ type } = {}) {
  if (type) return await query('SELECT * FROM networks WHERE type=? ORDER BY id', [type]);
  return await query('SELECT * FROM networks ORDER BY id');
}

async function getNetworkById(id) {
  const rows = await query('SELECT * FROM networks WHERE id=?', [id]);
  return rows[0] || null;
}

async function createNetwork({ name, type, description = null }) {
  const [r] = await getPool().execute(
    'INSERT INTO networks (name, type, description) VALUES (?,?,?)',
    [name, type, description]
  );
  return { id: r.insertId };
}

async function updateNetwork(id, { name, type, description = null }) {
  await getPool().execute(
    'UPDATE networks SET name=?, type=?, description=? WHERE id=?',
    [name, type, description, id]
  );
}

async function deleteNetwork(id) {
  await getPool().execute('DELETE FROM networks WHERE id=?', [id]);
}

module.exports = { listNetworks, getNetworkById, createNetwork, updateNetwork, deleteNetwork };