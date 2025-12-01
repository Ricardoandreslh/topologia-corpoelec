const Ports = require('../models/ports');
const Devices = require('../models/devices');
const { query } = require('../db');

async function list(req, res) {
  try {
    const deviceId = req.params.id;
    if (!deviceId) return res.status(400).json({ error: 'device_id requerido' });
    const device = await Devices.getDeviceById(deviceId);
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

    // Obtener puertos
    const rows = await Ports.listPortsByDevice(deviceId);

    if (!rows || rows.length === 0) {
      return res.json({ data: [] });
    }

    const portIds = rows.map(r => r.id);
    const placeholders = portIds.map(() => '?').join(',');
    const sql = `SELECT a_port_id AS pid FROM connections WHERE a_port_id IN (${placeholders})
                 UNION
                 SELECT b_port_id AS pid FROM connections WHERE b_port_id IN (${placeholders})`;
    const params = [...portIds, ...portIds];
    const connRows = await query(sql, params);

    const connectedSet = new Set((connRows || []).map(r => r.pid));

    const enhanced = rows.map(p => ({ ...p, connected: connectedSet.has(p.id) }));

    return res.json({ data: enhanced });
  } catch (err) {
    console.error('ports.list error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function upsert(req, res) {
  try {
    const deviceId = req.params.id;
    const body = req.body || {};
    const ports = body.ports || [];
    if (!Array.isArray(ports)) return res.status(400).json({ error: 'ports debe ser array' });
    const device = await Devices.getDeviceById(deviceId);
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });
    await Ports.upsertPorts(deviceId, ports);
    return res.json({ ok: true });
  } catch (err) {
    console.error('ports.upsert error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, upsert };