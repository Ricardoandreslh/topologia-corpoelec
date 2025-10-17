const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { Networks, Devices, Connections } = require('../models');

const router = Router();

// Lectura (cualquier usuario autenticado)
router.get('/networks', requireAuth, async (req, res) => {
  const type = req.query.type || undefined;
  const data = await Networks.listNetworks({ type });
  res.json(data);
});

// Crear red (solo admin)
router.post('/networks', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, type, description = null } = req.body || {};
  if (!name || !type) return res.status(400).json({ error: 'name y type requeridos' });
  const { id } = await Networks.createNetwork({ name, type, description });
  res.status(201).json({ id });
});

// Crear dispositivo (admin)
router.post('/networks/:networkId/devices', requireAuth, requireRole('admin'), async (req, res) => {
  const { networkId } = req.params;
  const { name, device_type, ip_address, mac_address, location } = req.body || {};
  if (!name || !device_type) return res.status(400).json({ error: 'name y device_type requeridos' });
  const { id } = await Devices.createDevice({ network_id: Number(networkId), name, device_type, ip_address, mac_address, location });
  res.status(201).json({ id });
});

module.exports = router;