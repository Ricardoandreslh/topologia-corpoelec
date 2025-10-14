const { getPool, query } = require('../db');

async function createImage({ file_name, mime_type, size_bytes, path }) {
  const [r] = await getPool().execute(
    'INSERT INTO images (file_name, mime_type, size_bytes, path) VALUES (?,?,?,?)',
    [file_name, mime_type, size_bytes, path]
  );
  return { id: r.insertId };
}

async function getImageById(id) {
  const rows = await query('SELECT * FROM images WHERE id=?', [id]);
  return rows[0] || null;
}

module.exports = { createImage, getImageById };