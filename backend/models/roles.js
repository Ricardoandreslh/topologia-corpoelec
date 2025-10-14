const { query } = require('../db');

async function listRoles() {
  return await query('SELECT id, name, permissions FROM roles ORDER BY id');
}

async function getRoleByName(name) {
  const rows = await query('SELECT id, name, permissions FROM roles WHERE name=?', [name]);
  return rows[0] || null;
}

async function getRoleById(id) {
  const rows = await query('SELECT id, name, permissions FROM roles WHERE id=?', [id]);
  return rows[0] || null;
}

module.exports = { listRoles, getRoleByName, getRoleById };