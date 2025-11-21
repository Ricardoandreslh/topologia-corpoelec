
(function (global) {
  const RETRY_MAX = 4;
  const RETRY_BASE_MS = 250;

  async function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

  async function fetchJson(path, init = {}) {
    let attempt = 0;
    let lastErr = null;
    while (attempt <= RETRY_MAX) {
      try {
        const res = await Auth.apiFetch(path, init);
        if (!res.ok) {
          if (res.status === 429 || res.status === 503) {
            lastErr = await safeMsg(res) || `HTTP ${res.status}`;
            const wait = RETRY_BASE_MS * Math.pow(2, attempt);
            await delay(wait + Math.floor(Math.random() * 80));
            attempt++;
            continue;
          }
          const msg = await safeMsg(res);
          throw new Error(msg || ('Error HTTP ' + res.status));
        }
        return res.json();
      } catch (err) {
        lastErr = err;
        if (attempt < RETRY_MAX) {
          const wait = RETRY_BASE_MS * Math.pow(2, attempt);
          await delay(wait + Math.floor(Math.random() * 80));
          attempt++;
          continue;
        }
        throw (lastErr instanceof Error) ? lastErr : new Error(String(lastErr));
      }
    }
    throw new Error(lastErr && lastErr.message ? lastErr.message : 'Error en fetchJson');
  }

  async function safeMsg(res) {
    try { const j = await res.json(); return j && (j.error || j.message); } catch (_e) { return ''; }
  }

  const _portsCache = new Map(); // deviceId -> { ts, data }
  const _portsInflight = new Map(); // deviceId -> Promise
  const PORTS_TTL_MS = 15 * 1000; // 15s cache (ajustable)

  async function getPorts(deviceId) {
    if (!deviceId) return [];
    const key = String(deviceId);

    if (_portsInflight.has(key)) return _portsInflight.get(key);

    const cached = _portsCache.get(key);
    if (cached && (Date.now() - cached.ts) < PORTS_TTL_MS) {
      return cached.data;
    }

    const p = (async () => {
      try {
        const json = await fetchJson('/devices/' + encodeURIComponent(deviceId) + '/ports');
        const data = json.data || [];
        _portsCache.set(key, { ts: Date.now(), data });
        return data;
      } finally {
        _portsInflight.delete(key);
      }
    })();

    _portsInflight.set(key, p);
    return p;
  }

  async function getDevices(networkId) {
    const json = await fetchJson(`/devices?network_id=${encodeURIComponent(networkId)}`);
    return json.data || [];
  }

  async function getConnections(networkId) {
    const data = await fetchJson('/connections?network_id=' + encodeURIComponent(networkId));
    return data.data || [];
  }

  async function getDevice(id) {
    const json = await fetchJson(`/devices/${encodeURIComponent(id)}`);
    return json.data;
  }
  
  async function getConnection(id) {
    const json = await fetchJson(`/connections/${encodeURIComponent(id)}`);
    return json.data;  
  }

  async function getGraph(networkId, opts = {}) {
    const params = new URLSearchParams();
    if (opts.kind) params.set('kind', opts.kind);
    if (opts.site_id) params.set('site_id', String(opts.site_id)); 
    const qs = params.toString();
    const path = '/networks/' + encodeURIComponent(networkId) + '/graph' + (qs ? ('?' + qs) : '');
    return fetchJson(path);
  }

  async function createDevice(data) {
    const res = await Auth.apiFetch('/devices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Error creando dispositivo');
    return res.json();
  }
  
  async function updateDevice(id, data) {
    const res = await Auth.apiFetch(`/devices/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Error actualizando dispositivo');
    return res.json();
  }
  
  async function deleteDevice(id) {
    const res = await Auth.apiFetch(`/devices/${encodeURIComponent(id)}`, { 
      method: 'DELETE',
      headers: { 'Cache-Control': 'no-cache' } 
    });
    if (!res.ok) throw new Error('Error eliminando dispositivo');
    return res.json();
  }
  
  async function createConnection(data) {
    const res = await Auth.apiFetch('/connections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Error creando conexión');
    return res.json();
  }

  async function upsertPorts(deviceId, ports) {
    const data = await fetchJson('/devices/' + encodeURIComponent(deviceId) + '/ports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ports })
    });
    return data.data || [];
  }

  async function updateConnection(id, data) {
    const res = await Auth.apiFetch(`/connections/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Error actualizando conexión');
    return res.json();
  }
  
  async function deleteConnection(id) {
    const res = await Auth.apiFetch(`/connections/${encodeURIComponent(id)}`, { 
      method: 'DELETE',
      headers: { 'Cache-Control': 'no-cache' } 
    });
    if (!res.ok) throw new Error('Error eliminando conexión');
    return res.json();
  }

  async function getSites(networkId) {
    const data = await fetchJson('/sites?network_id=' + encodeURIComponent(networkId));
    return data.data || [];
  }

  global.API = { getDevices, getConnections, getGraph, 
    createDevice, updateDevice, deleteDevice, 
    createConnection, updateConnection, deleteConnection, 
    getDevice, getConnection, getPorts, 
    upsertPorts, getSites };
})(window);