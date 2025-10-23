const Connections = require('../models/connections');
const Devices = require('../models/devices');

async function list(req, res) {
  try {
    const networkId = req.query.network_id;
    if (!networkId) return res.status(400).json({ error: 'network_id requerido' });
    const rows = await Connections.listConnectionsByNetwork(networkId);
    return res.json({ data: rows });
  } catch (err) {
    console.error('connections.list error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    const conn = await Connections.getConnectionById(id);
    if (!conn) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ data: conn });
  } catch (err) {
    console.error('connections.getById error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function create(req, res) {
  try {
    const body = req.body || {};
    if (!body.network_id || !body.from_device_id || !body.to_device_id) {
      return res.status(400).json({ error: 'network_id, from_device_id y to_device_id son requeridos' });
    }

    // Validar existencia
    const fromDev = await Devices.getDeviceById(body.from_device_id);
    const toDev = await Devices.getDeviceById(body.to_device_id);
    if (!fromDev || !toDev) return res.status(400).json({ error: 'Dispositivo origen o destino no encontrado' });
    if (String(fromDev.network_id) !== String(body.network_id) || String(toDev.network_id) !== String(body.network_id)) {
      return res.status(400).json({ error: 'Los dispositivos no pertenecen a la red indicada' });
    }

    const payload = {
      network_id: body.network_id,
      from_device_id: body.from_device_id,
      to_device_id: body.to_device_id,
      link_type: body.link_type || null,
      status: body.status || 'unknown'
    };

    const result = await Connections.createConnection(payload);
    return res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('connections.create error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const allowed = ['from_device_id', 'to_device_id', 'link_type', 'status'];
    const fields = {};
    for (const k of allowed) {
      if (body[k] !== undefined) fields[k] = body[k];
    }
    if (!Object.keys(fields).length) return res.status(400).json({ error: 'Nada para actualizar' });

    // Verificar existencia
    const conn = await Connections.getConnectionById(id);
    if (!conn) return res.status(404).json({ error: 'No encontrado' });


    if (fields.from_device_id || fields.to_device_id) {
      const fromId = fields.from_device_id || conn.from_device_id;
      const toId = fields.to_device_id || conn.to_device_id;
      const [fromDev, toDev] = await Promise.all([
        Devices.getDeviceById(fromId),
        Devices.getDeviceById(toId)
      ]);
      if (!fromDev || !toDev) return res.status(400).json({ error: 'Dispositivo origen o destino no encontrado' });
      if (String(fromDev.network_id) !== String(conn.network_id) || String(toDev.network_id) !== String(conn.network_id)) {
        return res.status(400).json({ error: 'Los dispositivos no pertenecen a la misma red de la conexión' });
      }
    }

    await Connections.updateConnection(id, fields);
    return res.json({ ok: true });
  } catch (err) {
    console.error('connections.update error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    await Connections.deleteConnection(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('connections.delete error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove };