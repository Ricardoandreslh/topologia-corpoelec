const Devices = require('../models/devices');
const Audit = require('../models/auditLogs');

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

    return res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('devices.create error', err);
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

    return res.json({ ok: true });
  } catch (err) {
    console.error('devices.assignSite error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove, assignSite };