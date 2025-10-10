// backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const { initDb, getPool, closeDb } = require('./db');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Servir archivos estáticos del frontend
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// (Opcional) Servir también carpeta de uploads si la usarás más adelante
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Healthcheck con verificación de DB
app.get('/health', async (_req, res) => {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    res.json({
      ok: true,
      db: 'up',
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      db: 'down',
      error: err.message
    });
  }
});

// Montaje de rutas (si ya existen). Si no, no se rompe el arranque.
try {
  const topologyRoutes = require('./routes/topology');
  app.use('/api', topologyRoutes);
} catch (e) {
  console.log('[WARN] routes/topology no disponible aún (OK para Día 2)');
}
try {
  const diagnosticsRoutes = require('./routes/diagnostics');
  app.use('/api', diagnosticsRoutes);
} catch (e) {
  console.log('[WARN] routes/diagnostics no disponible aún (OK para Día 2)');
}

// Enviar index.html por defecto
app.get('*', (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Inicialización: DB + servidor HTTP
const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor listo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error inicializando DB:', err);
    process.exit(1);
  });

// Apagado limpio
async function shutdown() {
  console.log('\nCerrando servidor...');
  try {
    await closeDb();
  } catch (e) {
    console.error('Error cerrando DB:', e);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);