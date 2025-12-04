const Sites = require('../models/sites');
const Audit = require('../models/auditLogs');
const Broadcaster = require('../utils/broadcaster');

async function list(req, res) {
  try {
    const networkId = req.query.network_id;
    if (!networkId) return res.status(400).json({ error: 'network_id requerido' });
    const rows = await Sites.listSitesByNetwork(networkId);
    return res.json({ data: rows });
  } catch (err) {
    console.error('sites.list error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const site = await Sites.getSiteById(id);
    if (!site) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ data: site });
  } catch (err) {
    console.error('sites.getById error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function create(req, res) {
  try {
    const body = req.body || {};
    if (!body.network_id || !body.name) {
      return res.status(400).json({ error: 'network_id y name son requeridos' });
    }
    const result = await Sites.createSite(body);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'create',
        resource_type: 'site',
        resource_id: result.id,
        payload: body
      });
    } catch (e) {
      console.warn('Audit log failed (site.create):', e);
    }

    try {
      Broadcaster.broadcast({ type: 'graph:update', network_id: body.network_id, site_ids: [result.id], affected: { sites: [result.id] } });
    } catch (e) { console.warn('Broadcast failed (site.create):', e); }

    return res.status(201).json({ id: result.id });
  } catch (err) {
    console.error('sites.create error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const site = await Sites.getSiteById(id);
    if (!site) return res.status(404).json({ error: 'No encontrado' });
    const allowed = ['name', 'description', 'parent_id'];
    const fields = {};
    for (const k of allowed) {
      if (body[k] !== undefined) fields[k] = body[k];
    }
    if (!Object.keys(fields).length) return res.status(400).json({ error: 'Nada para actualizar' });
    await Sites.updateSite(id, fields);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'update',
        resource_type: 'site',
        resource_id: id,
        payload: fields
      });
    } catch (e) {
      console.warn('Audit log failed (site.update):', e);
    }

    try {
      Broadcaster.broadcast({ type: 'graph:update', network_id: site.network_id, site_ids: [id], affected: { sites: [id] } });
    } catch (e) { console.warn('Broadcast failed (site.update):', e); }

    return res.json({ ok: true });
  } catch (err) {
    console.error('sites.update error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const site = await Sites.getSiteById(id);
    if (!site) return res.status(404).json({ error: 'No encontrado' });
    await Sites.deleteSite(id);

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'delete',
        resource_type: 'site',
        resource_id: id,
        payload: { name: site.name, parent_id: site.parent_id }
      });
    } catch (e) {
      console.warn('Audit log failed (site.delete):', e);
    }

    try {
      Broadcaster.broadcast({ type: 'graph:update', network_id: site.network_id, site_ids: [id], affected: { sites: [id], deleted: true } });
    } catch (e) { console.warn('Broadcast failed (site.delete):', e); }

    return res.json({ ok: true });
  } catch (err) {
    console.error('sites.delete error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function summary(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'id requerido' });
    const sum = await Sites.getSiteSummary(id);
    if (!sum) return res.status(404).json({ error: 'No encontrado' });
    return res.json({ data: sum });
  } catch (err) {
    console.error('sites.summary error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { list, getById, create, update, remove, summary };