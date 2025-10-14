const express = require('express');
const router = express.Router();

const { Networks, Devices, Connections, Positions } = require('../models');

// Listar redes (opcional ?type=wifi|switch)
router.get('/networks', async (req, res) => {
  try {
    const type = req.query.type;
    const nets = await Networks.listNetworks({ type });
    res.json(nets);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear red
router.post('/networks', async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const out = await Networks.createNetwork({ name, type, description });
    res.status(201).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Dispositivos por red
router.get('/networks/:networkId/devices', async (req, res) => {
  try {
    const networkId = Number(req.params.networkId);
    const devs = await Devices.listDevicesByNetwork(networkId);
    res.json(devs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear dispositivo
router.post('/networks/:networkId/devices', async (req, res) => {
  try {
    const network_id = Number(req.params.networkId);
    const { name, device_type, ip_address, mac_address, location, image_id, metadata } = req.body;
    const out = await Devices.createDevice({ network_id, name, device_type, ip_address, mac_address, location, image_id, metadata });
    res.status(201).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Conexiones por red
router.get('/networks/:networkId/connections', async (req, res) => {
  try {
    const networkId = Number(req.params.networkId);
    const rows = await Connections.listConnectionsByNetwork(networkId);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear conexión
router.post('/networks/:networkId/connections', async (req, res) => {
  try {
    const network_id = Number(req.params.networkId);
    const { from_device_id, to_device_id, link_type, status } = req.body;
    const out = await Connections.createConnection({ network_id, from_device_id, to_device_id, link_type, status });
    res.status(201).json(out);
  } catch (e) {
    // Si choca por conexión duplicada (uq_conn_pair) también caerá aquí
    res.status(500).json({ error: e.message });
  }
});

// Obtener posiciones de una red/vista (?view=wifi|switch)
router.get('/networks/:networkId/positions', async (req, res) => {
  try {
    const networkId = Number(req.params.networkId);
    const view = String(req.query.view || 'wifi');
    const rows = await Positions.listPositionsByNetworkView(networkId, view);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Guardar posiciones (batch) de una red/vista
router.put('/networks/:networkId/positions', async (req, res) => {
  try {
    const { view, positions, zoom, pan } = req.body;
    await Positions.upsertPositionsBatch({ view, positions, zoom, pan });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;