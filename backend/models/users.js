const bcrypt = require('bcryptjs');
const { getPool, query } = require('../db');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

async function createUserWithPassword({ username, email, password, roleId, status = 'active' }) {
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  return await createUserWithHash({ username, email, password_hash, roleId, status });
}

async function createUserWithHash({ username, email, password_hash, roleId, status = 'active' }) {
  const [r] = await getPool().execute(
    'INSERT INTO users (username, email, password_hash, role_id, status) VALUES (?,?,?,?,?)',
    [username, email, password_hash, roleId, status]
  );
  return { id: r.insertId };
}

async function findByUsername(username) {
  const rows = await query(
    'SELECT u.id, u.username, u.email, u.password_hash, u.role_id, u.status, r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.username=?',
    [username]
  );
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(
    'SELECT u.id, u.username, u.email, u.role_id, u.status, r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=?',
    [id]
  );
  return rows[0] || null;
}

async function verifyPassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}

async function updateLastLogin(id) {
  await getPool().execute('UPDATE users SET last_login=NOW() WHERE id=?', [id]);
}

async function setStatus(id, status) {
  await getPool().execute('UPDATE users SET status=? WHERE id=?', [status, id]);
}

module.exports = {
  createUserWithPassword,
  createUserWithHash,
  findByUsername,
  findById,
  verifyPassword,
  updateLastLogin,
  setStatus
};