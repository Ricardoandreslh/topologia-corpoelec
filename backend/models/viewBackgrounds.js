const { getPool, query } = require('../db');

async function setBackground({ network_id, view, image_id }) {
  await getPool().execute(
    `INSERT INTO view_backgrounds (network_id, view, image_id)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE image_id=VALUES(image_id)`,
    [network_id, view, image_id]
  );
}

async function getBackground(network_id, view) {
  const rows = await query(
    'SELECT id, network_id, view, image_id, created_at FROM view_backgrounds WHERE network_id=? AND view=?',
    [network_id, view]
  );
  return rows[0] || null;
}

module.exports = { setBackground, getBackground };