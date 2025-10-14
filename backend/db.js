const mysql = require('mysql2/promise');

let pool;

/**
 * Inicializa el pool de MySQL usando variables de entorno.
 * Llama a esta función antes de levantar el servidor (server.js).
 */
async function initDb() {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'topologia',
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10_000,
    // Opcionales útiles en desarrollo:
    multipleStatements: false
  });

  // Prueba de conexión
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log('[DB] Pool conectado y listo');
  } finally {
    conn.release();
  }

  return pool;
}

/**
 * Devuelve el pool ya inicializado.
 */
function getPool() {
  if (!pool) {
    throw new Error('DB pool no inicializado. Llama primero a initDb()');
  }
  return pool;
}

/**
 * Helper simple para consultas con execute.
 */
async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

/**
 * Ejecuta una transacción. Recibe una función async con el objeto "conn".
 */
async function withTransaction(workFn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await workFn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Cierra el pool (para apagado limpio).
 */
async function closeDb() {
  if (pool) {
    await pool.end();
    pool = undefined;
    console.log('[DB] Pool cerrado');
  }
}

module.exports = {
  initDb,
  getPool,
  query,
  withTransaction,
  closeDb
};