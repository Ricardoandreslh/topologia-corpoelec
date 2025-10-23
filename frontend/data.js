(function (global) {
  async function fetchJson(path) {
    const res = await Auth.apiFetch(path, { method: 'GET' });
    if (!res.ok) {
      const msg = await safeMsg(res);
      throw new Error(msg || ('Error HTTP ' + res.status));
    }
    return res.json();
  }

  async function safeMsg(res) {
    try { const j = await res.json(); return j && (j.error || j.message); } catch (_e) { return ''; }
  }

  async function getDevices(networkId) {
    const data = await fetchJson('/devices?network_id=' + encodeURIComponent(networkId));
    return data.data || [];
  }

  async function getConnections(networkId) {
    const data = await fetchJson('/connections?network_id=' + encodeURIComponent(networkId));
    return data.data || [];
  }

  async function getGraph(networkId, opts = {}) {
    const params = new URLSearchParams();
    if (opts.kind) params.set('kind', opts.kind);
    const qs = params.toString();
    const path = '/networks/' + encodeURIComponent(networkId) + '/graph' + (qs ? ('?' + qs) : '');
    return fetchJson(path);
  }

  global.API = { getDevices, getConnections, getGraph };
})(window);