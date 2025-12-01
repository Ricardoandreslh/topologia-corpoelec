const Connections = require('../models/connections');
const Devices = require('../models/devices');
const { query } = require('../db');
const Audit = require('../models/auditLogs');

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
      a_port_id: body.a_port_id || null,
      b_port_id: body.b_port_id || null,
      a_port_name: body.a_port_name || null,
      b_port_name: body.b_port_name || null,
      link_type: body.link_type || null,
      status: body.status || 'unknown',
      vlan: body.vlan === undefined ? null : body.vlan
    };

    if (payload.a_port_id) {
      const aPort = await query('SELECT device_id FROM ports WHERE id=?', [payload.a_port_id]);
      if (!aPort[0] || aPort[0].device_id != payload.from_device_id) return res.status(400).json({ error: 'Puerto A no pertenece al dispositivo origen' });
    }
    if (payload.b_port_id) {
      const bPort = await query('SELECT device_id FROM ports WHERE id=?', [payload.b_port_id]);
      if (!bPort[0] || bPort[0].device_id != payload.to_device_id) return res.status(400).json({ error: 'Puerto B no pertenece al dispositivo destino' });
    }

    if (payload.vlan !== null) {
      if (Array.isArray(payload.vlan)) {
        if (payload.vlan.length === 0) payload.vlan = null;
        else {
          const parsed = payload.vlan.map(v => Number(v));
          if (parsed.some(v => !Number.isInteger(v) || v < 1 || v > 4094)) {
            return res.status(400).json({ error: 'VLAN inválida en lista. Rango 1..4094' });
          }
          payload.vlan = parsed;
        }
      } else {
        const v = Number(payload.vlan);
        if (!Number.isInteger(v) || v < 1 || v > 4094) {
          return res.status(400).json({ error: 'VLAN inválida. Rango 1..4094' });
        }
        payload.vlan = v;
      }
    }

    const result = await Connections.createConnection(payload);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'create',
        resource_type: 'connection',
        resource_id: result.id,
        payload: payload
      });
    } catch (e) {
      console.warn('Audit log failed (connection.create):', e);
    }

    return res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('connections.create error', err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Conexión duplicada (mismo par y mismos puertos)' });
    }
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const allowed = ['from_device_id', 'to_device_id', 'a_port_id', 'b_port_id', 'a_port_name', 'b_port_name', 'link_type', 'status', 'vlan'];
    const fields = {};
    for (const k of allowed) {
      if (body[k] !== undefined) fields[k] = body[k];
    }
    if (!Object.keys(fields).length) return res.status(400).json({ error: 'Nada para actualizar' });

    const conn = await Connections.getConnectionById(id);
    if (!conn) return res.status(404).json({ error: 'No encontrado' });

    if (fields.from_device_id || fields.to_device_id || fields.a_port_id || fields.b_port_id) {
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

      if (fields.a_port_id !== undefined && fields.a_port_id) {
        const aPort = await query('SELECT device_id FROM ports WHERE id=?', [fields.a_port_id]);
        if (!aPort[0] || aPort[0].device_id != fromId) return res.status(400).json({ error: 'Puerto A no pertenece al dispositivo origen actualizado' });
      }
      if (fields.b_port_id !== undefined && fields.b_port_id) {
        const bPort = await query('SELECT device_id FROM ports WHERE id=?', [fields.b_port_id]);
        if (!bPort[0] || bPort[0].device_id != toId) return res.status(400).json({ error: 'Puerto B no pertenece al dispositivo destino actualizado' });
      }
    }

    if (fields.vlan !== undefined) {
      if (fields.vlan === null || fields.vlan === '') {
        fields.vlan = null;
      } else if (Array.isArray(fields.vlan)) {
        const parsed = fields.vlan.map(v => Number(v));
        if (parsed.some(v => !Number.isInteger(v) || v < 1 || v > 4094)) {
          return res.status(400).json({ error: 'VLAN inválida en lista. Rango 1..4094' });
        }
        fields.vlan = parsed;
      } else {
        const v = Number(fields.vlan);
        if (!Number.isInteger(v) || v < 1 || v > 4094) {
          return res.status(400).json({ error: 'VLAN inválida. Rango 1..4094' });
        }
        fields.vlan = v;
      }
    }

    await Connections.updateConnection(id, fields);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'update',
        resource_type: 'connection',
        resource_id: id,
        payload: fields
      });
    } catch (e) {
      console.warn('Audit log failed (connection.update):', e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('connections.update error', err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Actualización causa duplicado de conexión (mismo par y mismos puertos)' });
    }
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    await Connections.deleteConnection(id);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'delete',
        resource_type: 'connection',
        resource_id: id,
        payload: null
      });
    } catch (e) {
      console.warn('Audit log failed (connection.delete):', e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('connections.delete error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove };