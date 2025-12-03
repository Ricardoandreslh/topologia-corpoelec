const { getPool, query } = require('../db');

async function listSitesByNetwork(networkId) {
  const rows = await query('SELECT id, network_id, name, description, parent_id, created_at FROM sites WHERE network_id=? ORDER BY name', [networkId]);
  
  for (const row of rows) {
    row.site_path = await getSitePath(row.id);
  }
  return rows;
}

async function getSiteById(id) {
  const rows = await query('SELECT * FROM sites WHERE id=?', [id]);
  return rows[0] || null;
}

async function createSite({ network_id, name, description = null, parent_id = null }) {
  const [r] = await getPool().execute(
    'INSERT INTO sites (network_id, name, description, parent_id) VALUES (?,?,?,?)',
    [network_id, name, description, parent_id]
  );
  return { id: r.insertId };
}

async function updateSite(id, fields) {
  const cols = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) { cols.push(`${k}=?`); vals.push(v); }
  if (!cols.length) return;
  vals.push(id);
  await getPool().execute(`UPDATE sites SET ${cols.join(', ')} WHERE id=?`, vals);
}

async function deleteSite(id) {
  await getPool().execute('DELETE FROM sites WHERE id=?', [id]);
}

async function getSiteSummary(siteId) {
  const site = await getSiteById(siteId);
  if (!site) return null;

  const cteSql = `
    WITH RECURSIVE cte AS (
      SELECT id FROM sites WHERE id = ?
      UNION ALL
      SELECT s.id FROM sites s JOIN cte ON s.parent_id = cte.id
    )
    SELECT id FROM cte
  `;
  const rows = await query(cteSql, [siteId]);
  const ids = (rows || []).map(r => Number(r.id)).filter(Boolean);

  let devicesInTree = 0;
  if (ids.length) {
    const placeholders = ids.map(() => '?').join(',');
    const devRows = await query(`SELECT COUNT(*) AS n FROM devices WHERE site_id IN (${placeholders})`, ids);
    devicesInTree = devRows[0].n || 0;
  }

  const directRows = await query('SELECT COUNT(*) AS n FROM devices WHERE site_id=?', [siteId]);
  const devicesDirect = directRows[0].n || 0;

  const childRows = await query('SELECT COUNT(*) AS n FROM sites WHERE parent_id=?', [siteId]);
  const childSites = childRows[0].n || 0;

  const descendantSites = Math.max(0, ids.length - 1);

  return {
    site: {
      id: site.id,
      name: site.name,
      network_id: site.network_id,
      parent_id: site.parent_id,
      description: site.description || null
    },
    devices_direct: devicesDirect,
    devices_in_tree: devicesInTree,
    child_sites: childSites,
    descendant_sites: descendantSites
  };
}

async function getDescendantSiteIds(siteId) {
  if (!siteId) return [];
  const cteSql = `
    WITH RECURSIVE cte AS (
      SELECT id FROM sites WHERE id = ?
      UNION ALL
      SELECT s.id FROM sites s JOIN cte ON s.parent_id = cte.id
    )
    SELECT id FROM cte
  `;
  const rows = await query(cteSql, [siteId]);
  return (rows || []).map(r => Number(r.id)).filter(Boolean);
}

async function getSitePath(siteId, path = []) {
  const site = await getSiteById(siteId);
  if (!site) return path.reverse().join(' > ');
  path.push(site.name);
  if (site.parent_id) return getSitePath(site.parent_id, path);
  return path.reverse().join(' > ');
}

module.exports = { listSitesByNetwork, getSiteById, createSite, updateSite, deleteSite, getSitePath, getSiteSummary, getDescendantSiteIds  };