const { getPool } = require('../db');

class Images {
  static async createImage(data) {
    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO images (file_name, mime_type, size_bytes, path) VALUES (?, ?, ?, ?)',
      [data.file_name, data.mime_type, data.size_bytes, data.path]
    );
    return { id: result.insertId };
  }

  static async getImageById(id) {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM images WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async deleteImage(id) {
    const pool = getPool();
    await pool.execute('DELETE FROM images WHERE id = ?', [id]);
  }
}

module.exports = Images;
