const { getPool, query } = require('../db');

function tryParseVlan(v) {
  if (v === null || v === undefined) return null;
  try {
    if (typeof v === 'string') {
      const parsed = JSON.parse(v);
      return parsed;
    }
    return v;
  } catch (e) {
    return v;
  }
}

async function listConnectionsByNetwork(networkId) {
  const rows = await query(
    'SELECT id, network_id, from_device_id, to_device_id, a_port_id, b_port_id, a_port_name, b_port_name, link_type, status, vlan, created_at FROM connections WHERE network_id=? ORDER BY id',
    [networkId]
  );
  return rows.map(r => ({ ...r, vlan: tryParseVlan(r.vlan) }));
}

async function getConnectionById(id) {
  const rows = await query(
    'SELECT id, network_id, from_device_id, to_device_id, a_port_id, b_port_id, a_port_name, b_port_name, link_type, status, vlan, created_at FROM connections WHERE id=?',
    [id]
  );
  const row = rows[0] || null;
  if (!row) return null;
  row.vlan = tryParseVlan(row.vlan);
  return row;
}

async function createConnection({ network_id, from_device_id, to_device_id, a_port_id = null, b_port_id = null, a_port_name = null, b_port_name = null, link_type = null, status = 'unknown', vlan = null }) {
  const vlanToStore = Array.isArray(vlan) ? JSON.stringify(vlan) : (vlan === undefined ? null : vlan);

  const [r] = await getPool().execute(
    'INSERT INTO connections (network_id, from_device_id, to_device_id, a_port_id, b_port_id, a_port_name, b_port_name, link_type, status, vlan) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [network_id, from_device_id, to_device_id, a_port_id, b_port_id, a_port_name, b_port_name, link_type, status, vlanToStore]
  );
  return { id: r.insertId };
}

async function updateConnection(id, fields) {
  const cols = [];
  const vals = [];
  if (fields.vlan !== undefined && Array.isArray(fields.vlan)) {
    fields.vlan = JSON.stringify(fields.vlan);
  }
  for (const [k, v] of Object.entries(fields)) {
    cols.push(`${k}=?`);
    vals.push(v);
  }
  if (!cols.length) return;
  vals.push(id);
  await getPool().execute(`UPDATE connections SET ${cols.join(', ')} WHERE id=?`, vals);
}

async function deleteConnection(id) {
  await getPool().execute('DELETE FROM connections WHERE id=?', [id]);
}

module.exports = {
  listConnectionsByNetwork,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection
};