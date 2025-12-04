const Devices = require('../models/devices');
const Audit = require('../models/auditLogs');
const Broadcaster = require('../utils/broadcaster');

function serializeMeta(v) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  return typeof v === 'object' ? JSON.stringify(v) : v;
}

async function list(req, res) {
  try {
    const networkId = req.query.network_id;
    if (!networkId) return res.status(400).json({ error: 'network_id requerido' });
    const rows = await Devices.listDevicesByNetwork(networkId);
    return res.json({ data: rows });
  } catch (err) {
    console.error('devices.list error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const device = await Devices.getDeviceById(id);
    if (!device) return res.status(404).json({ error: 'No encontrado' });

    return res.json({ data: device });
  } catch (err) {
    console.error('devices.getById error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function create(req, res) {
  try {
    const body = req.body || {};
    if (!body.network_id || !body.name || !body.device_type) {
      return res.status(400).json({ error: 'network_id, name y device_type son requeridos' });
    }

    if (body.site_id !== null && body.site_id !== undefined) {
      const Sites = require('../models/sites');
      const site = await Sites.getSiteById(body.site_id);
      if (!site || site.network_id !== body.network_id) {
        return res.status(400).json({ error: 'Sede inválida: no existe o network_id no coincide' });
      }
    }

    const payload = {
      network_id: body.network_id,
      name: body.name,
      device_type: body.device_type,
      ip_address: body.ip_address || null,
      mac_address: body.mac_address || null,
      location: body.location || null,
      image_id: body.image_id || null,
      site_id: body.site_id || null,
      metadata: serializeMeta(body.metadata) !== null && serializeMeta(body.metadata) !== undefined ? serializeMeta(body.metadata) : null
    };

    const result = await Devices.createDevice(payload);
    if (body.ports && Array.isArray(body.ports)) {
      const Ports = require('../models/ports');
      for (const p of body.ports) {
        await Ports.createPort({ device_id: result.id, ...p });
      }
    }

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'create',
        resource_type: 'device',
        resource_id: result.id,
        payload: payload
      });
    } catch (e) {
      console.warn('Audit log failed (device.create):', e);
    }

    // Broadcast change
    try {
      Broadcaster.broadcast({
        type: 'graph:update',
        network_id: payload.network_id,
        site_ids: payload.site_id ? [payload.site_id] : null,
        affected: { devices: [result.id] }
      });
    } catch (e) { console.warn('Broadcast failed (device.create):', e); }

    return res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('devices.create error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function batchCreate(req, res) {
  try {
    const body = req.body || {};
    const devices = Array.isArray(body.devices) ? body.devices : null;
    if (!devices || !devices.length) return res.status(400).json({ error: 'devices array requerido' });

    const createdIds = [];
    for (const dev of devices) {
      const payload = {
        network_id: dev.network_id,
        name: dev.name,
        device_type: dev.device_type,
        ip_address: dev.ip_address || null,
        mac_address: dev.mac_address || null,
        location: dev.location || null,
        image_id: dev.image_id || null,
        site_id: dev.site_id || null,
        metadata: dev.metadata || null
      };
      const result = await Devices.createDevice(payload);
      const Ports = require('../models/ports');
      if (dev.ports && Array.isArray(dev.ports)) {
        for (const p of dev.ports) {
          await Ports.createPort({ device_id: result.id, ...p });
        }
      }
      createdIds.push(result.id);
    }

    try {
      Broadcaster.broadcast({
        type: 'graph:update',
        network_id: devices[0].network_id,
        site_ids: devices.map(d => d.site_id).filter(Boolean),
        affected: { devices: createdIds }
      });
    } catch (e) { console.warn('Broadcast failed (devices.batchCreate):', e); }

    return res.status(201).json({ ids: createdIds });
  } catch (err) {
    console.error('devices.batchCreate error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const allowed = ['name', 'device_type', 'ip_address', 'mac_address', 'location', 'image_id', 'site_id', 'metadata'];
    const fields = {};
    for (const k of allowed) {
      if (body[k] !== undefined) {
        if (k === 'metadata') {
          const device = await Devices.getDeviceById(id);
          let currentMeta = {};
          if (device.metadata) {
            try {
              currentMeta = JSON.parse(device.metadata);
            } catch (e) {
              console.warn('Error parsing existing metadata:', e);
            }
          }
          const newMeta = { ...currentMeta, ...body[k] };
          fields[k] = serializeMeta(newMeta);
        } else if (k === 'site_id') {
          if (body[k] !== null && body[k] !== undefined) {
            const Sites = require('../models/sites');
            const site = await Sites.getSiteById(body[k]);
            const device = await Devices.getDeviceById(id);
            if (!site || site.network_id !== device.network_id) {
              return res.status(400).json({ error: 'Sede inválida: no existe o network_id no coincide' });
            }
          }
          fields[k] = body[k] === '' ? null : body[k];
        } else {
          fields[k] = body[k];
        }
      }
    }
    if (!Object.keys(fields).length) return res.status(400).json({ error: 'Nada para actualizar' });

    const device = await Devices.getDeviceById(id);
    if (!device) return res.status(404).json({ error: 'No encontrado' });

    await Devices.updateDevice(id, fields);

    if (body.ports && Array.isArray(body.ports)) {
      const Ports = require('../models/ports');
      await require('../db').query('DELETE FROM ports WHERE device_id=?', [id]);
      for (const p of body.ports) {
        await Ports.createPort({ device_id: id, ...p });
      }
    }

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'update',
        resource_type: 'device',
        resource_id: id,
        payload: fields
      });
    } catch (e) {
      console.warn('Audit log failed (device.update):', e);
    }

    // Broadcast update
    try {
      const updatedDevice = await Devices.getDeviceById(id);
      Broadcaster.broadcast({
        type: 'graph:update',
        network_id: updatedDevice.network_id,
        site_ids: updatedDevice.site_id ? [updatedDevice.site_id] : null,
        affected: { devices: [id] }
      });
    } catch (e) { console.warn('Broadcast failed (device.update):', e); }

    return res.json({ ok: true });
  } catch (err) {
    console.error('devices.update error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });

    const device = await Devices.getDeviceById(id);
    if (!device) return res.status(404).json({ error: 'No encontrado' });

    await Devices.deleteDevice(id);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'delete',
        resource_type: 'device',
        resource_id: id,
        payload: { name: device.name, network_id: device.network_id }
      });
    } catch (e) {
      console.warn('Audit log failed (device.delete):', e);
    }

    // Broadcast delete
    try {
      Broadcaster.broadcast({
        type: 'graph:update',
        network_id: device.network_id,
        site_ids: device.site_id ? [device.site_id] : null,
        affected: { devices: [id], deleted: true }
      });
    } catch (e) { console.warn('Broadcast failed (device.delete):', e); }

    return res.json({ ok: true });
  } catch (err) {
    console.error('devices.delete error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function assignSite(req, res) {
  try {
    const id = req.params.id;
    const { site_id } = req.body;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    const device = await Devices.getDeviceById(id);
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });
    if (site_id !== null && site_id !== undefined) {
      const Sites = require('../models/sites');
      const site = await Sites.getSiteById(site_id);
      if (!site || site.network_id !== device.network_id) {
        return res.status(400).json({ error: 'Sede inválida: network_id no coincide' });
      }
    }
    await Devices.updateDevice(id, { site_id: site_id === undefined ? null : site_id });

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'assign_site',
        resource_type: 'device',
        resource_id: id,
        payload: { site_id: site_id === undefined ? null : site_id }
      });
    } catch (e) {
      console.warn('Audit log failed (device.assignSite):', e);
    }

    try {
      const updated = await Devices.getDeviceById(id);
      Broadcaster.broadcast({
        type: 'graph:update',
        network_id: updated.network_id,
        site_ids: updated.site_id ? [updated.site_id] : null,
        affected: { devices: [id] }
      });
    } catch (e) { console.warn('Broadcast failed (device.assignSite):', e); }

    return res.json({ ok: true });
  } catch (err) {
    console.error('devices.assignSite error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove, assignSite, batchCreate };