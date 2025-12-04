const express = require('express');
const router = express.Router();
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');
const Positions = require('../models/positions');
const Broadcaster = require('../utils/broadcaster');

router.post('/positions', requireAuth, requirePermission('devices:write'), async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.view || !Array.isArray(body.positions)) return res.status(400).json({ error: 'view y positions[] requeridos' });
    await Positions.upsertPositionsBatch(body);

    if (body.network_id) {
      try {
        Broadcaster.broadcast({ type: 'graph:update', network_id: body.network_id, affected: { positions: true } });
      } catch (e) { console.warn('Broadcast failed (positions):', e); }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('positions.batch error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;