const express = require('express');
const router = express.Router();

// Endpoints placeholder para que la app no rompa
router.get('/networks', (_req, res) => res.json([]));
router.get('/devices', (_req, res) => res.json([]));
router.get('/connections', (_req, res) => res.json([]));

module.exports = router;