(function () {
  const THEME_KEY = 'theme';
  const root = document.documentElement;
  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }
  function getSystemTheme() { const m = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null; return (m && m.matches) ? 'dark' : 'light'; }

  (function initThemeFromStorage() {
    const stored = getStoredTheme();
    const theme = stored || getSystemTheme();
    try { root.dataset.theme = theme; root.style.colorScheme = theme; } catch (e) {}
  })();

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      initThemeToggle();         
      bindLogoutButton();       
      bindUIControls(); 
  
      const page = detectPage();
      if (page === 'login') {
        setStatus('Listo para iniciar sesión');
        return;
      }
  
      const ok = await Auth.requireAuthOnPage();
      if (!ok) return; 
  
      populateUserBadge();
      bindTabsSafely();
      await initViewFromQuerySafely();
    } catch (err) {
      console.error('app init error', err);
      setStatus('Error inicializando la página', true);
    }
  });

  function bindUIControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const fitBtn = document.getElementById('fit-view');
    const backgroundBtn = document.getElementById('toggle-background');
    const searchInput = document.getElementById('device-search');
  
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', handleZoomIn);
    }
  
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', handleZoomOut);
    }
  
    if (fitBtn) {
      fitBtn.addEventListener('click', handleFitView);
    }
  
    if (backgroundBtn) {
      backgroundBtn.addEventListener('click', handleToggleBackground);
    }
  
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          handleSearch(e);
        }
      });
    }
  }
  
  function handleZoomIn() {
    const containerId = getActiveContainerId();
    if (window.Canvas?.zoomIn) {
      window.Canvas.zoomIn(containerId);
    }
  }
  
  function handleZoomOut() {
    const containerId = getActiveContainerId();
    if (window.Canvas?.zoomOut) {
      window.Canvas.zoomOut(containerId);
    }
  }
  
  function handleFitView() {
    const containerId = getActiveContainerId();
    if (window.Canvas?.fitView) {
      window.Canvas.fitView(containerId);
    }
  }
  
  function handleToggleBackground() {
    const containerId = getActiveContainerId();
    if (window.Canvas?.toggleBackground) {
      window.Canvas.toggleBackground(containerId);
    }
  }
  
  function handleSearch(event) {
    const containerId = getActiveContainerId();
    const query = event.target.value;
    if (window.Canvas?.searchNodes) {
      window.Canvas.searchNodes(containerId, query);
    }
  }
  
function getActiveContainerId() {
  const tabWifi = document.getElementById('tab-wifi');
  const tabSwitches = document.getElementById('tab-switches');
  
  if (tabWifi && tabWifi.checked) {
    return 'canvas-wifi';
  }
  if (tabSwitches && tabSwitches.checked) {
    return 'canvas-switches';
  }
  
  const viewWifi = document.getElementById('view-wifi');
  const viewSwitches = document.getElementById('view-switches');
  
  if (viewWifi && viewWifi.style.display !== 'none') {
    return 'canvas-wifi';
  }
  if (viewSwitches && viewSwitches.style.display !== 'none') {
    return 'canvas-switches';
  }
  
  return 'canvas-wifi'; 
}
  // --- helpers ---
  function detectPage() {
    const dp = document.body?.dataset?.page;
    if (dp) return dp.toLowerCase();
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return file.replace('.html', '') || 'index';
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const isDark = (document.documentElement.dataset.theme || '').toLowerCase() === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const current = (document.documentElement.dataset.theme || 'light').toLowerCase();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  function bindLogoutButton() {
    const logout = document.getElementById('logout-btn');
    if (!logout) return;
    logout.addEventListener('click', () => {
      Auth.clearAuth();
      location.replace('./login.html');
    });
  }

  function populateUserBadge() {
    const badge = document.getElementById('user-badge');
    if (!badge) return;
    try {
      const user = Auth.getUser() || {};
      if (user.username) {
        badge.textContent = user.username + (user.role ? ' (' + user.role + ')' : '');
        badge.title = 'Sesión activa';
      } else {
        badge.textContent = 'Usuario';
      }
    } catch (_) { badge.textContent = 'Usuario'; }
  }

  function bindTabsSafely() {
    const rWifi = document.getElementById('tab-wifi');
    const rSw   = document.getElementById('tab-switches');
    if (!rWifi && !rSw) return;
    if (rWifi) rWifi.addEventListener('change', () => { if (rWifi.checked) setViewAndLoad('wifi'); });
    if (rSw)   rSw.addEventListener('change',   () => { if (rSw.checked)   setViewAndLoad('switches'); });
  }

  async function initViewFromQuerySafely() {
    const hasViewControls = document.querySelector('input[name="view"]') ||
                            document.querySelector('#canvas-wifi') ||
                            document.querySelector('#canvas-switches') ||
                            document.getElementById('canvas');
    if (!hasViewControls) return;

    const params = new URLSearchParams(location.search);
    const view = params.get('view') || 'all';
    const tabId = view === 'switches' ? 'tab-switches' : 'tab-wifi'; const target = document.getElementById(tabId);    if (target) target.checked = true;
    if (view === 'all') {
      await loadGraphFor('all');
    } else {
      await loadGraphFor(view === 'switches' ? 'switches' : 'wifi');
    }
  }

  function setViewAndLoad(view) {
    const params = new URLSearchParams(location.search);
    if (view === 'all') params.delete('view'); else params.set('view', view);
    const url = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState({}, '', url);
    loadGraphFor(view);
  }

const GRAPH_CACHE = new Map();

async function fetchFullGraph(networkId) {
  if (GRAPH_CACHE.has(networkId)) return GRAPH_CACHE.get(networkId);
  const full = await API.getGraph(networkId, {}); 
  GRAPH_CACHE.set(networkId, full);
  return full;
}

function bindLogoutButton() {
  const logout = document.getElementById('logout-btn');
  if (!logout) return;
  logout.addEventListener('click', () => {
    GRAPH_CACHE.clear();
    Auth.clearAuth();
    location.replace('./login.html');
  });
}

async function loadGraphFor(view) {
  try {
    const params = new URLSearchParams(location.search);
    const networkId = params.get('network_id') || '1';
    const label = view === 'wifi' ? 'WiFi' : (view === 'switches' ? 'Red Corporativa' : 'Todo');
    setStatus(`Cargando red ${networkId} (${label})…`);

    const full = await fetchFullGraph(networkId);

    const projected = projectGraphForView(full, view);

    const containerId = view === 'switches' ? 'canvas-switches' : 'canvas-wifi';
    const otherId = containerId === 'canvas-wifi' ? 'canvas-switches' : 'canvas-wifi';
    if (document.getElementById(otherId)) {
      if (window.Canvas?.destroy) window.Canvas.destroy(otherId);
      document.getElementById(otherId).innerHTML = '';
    }

    if (window.Canvas?.renderGraph) {
      window.Canvas.renderGraph(projected, { 
        containerId: containerId,
        viewType: view // Pasar el tipo de vista
      });
    } else {
      document.dispatchEvent(new CustomEvent('graph:loaded', { detail: { ...projected, _containerId: containerId } }));
    }

    const counts = projected.counts || { nodes: projected.nodes?.length || 0, edges: projected.edges?.length || 0 };
    setStatus(`Red ${networkId} cargada (${label}): ${counts.nodes} nodos, ${counts.edges} enlaces`);
  } catch (e) {
    console.error(e);
    setStatus('Error al cargar grafo: ' + (e?.message || 'desconocido'), true);
  }
}

function isWifiType(t) {
  t = String(t || '').toLowerCase().trim();
  return ['ap','wifi','router','gateway','controller','repeater','access_point','ap_wifi','wireless_ap','wifi_ap','ap-bridge'].includes(t);
}
function isSwitchType(t) {
  t = String(t || '').toLowerCase().trim();
  return ['switch','core_switch','distribution_switch','access_switch','layer2_switch','layer3_switch','l2_switch','l3_switch'].includes(t);
}
function nodeCategory(type) {
  if (isWifiType(type)) return 'wifi';
  if (isSwitchType(type)) return 'switch';
  return 'other';
}

function projectGraphForView(full, view) {
  if (view === 'all') {
    const counts = full.counts || {
      nodes: (full.nodes || []).length,
      edges: (full.edges || []).length
    };
    return { ...full, counts, kind: 'all' };
  }

  const desired = view === 'wifi' ? 'wifi' : 'switch';
  const nodes = full.nodes || [];
  const edges = full.edges || [];

  const primaryNodes = nodes.filter(n => nodeCategory(n.type) === desired);
  const primaryIds = new Set(primaryNodes.map(n => String(n.id)));

  const viewEdges = edges
    .filter(e => primaryIds.has(String(e.source)) || primaryIds.has(String(e.target)))
    .map(e => {
      const sIn = primaryIds.has(String(e.source));
      const tIn = primaryIds.has(String(e.target));
      return { ...e, cross: (sIn && !tIn) || (!sIn && tIn) }; 
    });

  const neededIds = new Set();
  viewEdges.forEach(e => { neededIds.add(String(e.source)); neededIds.add(String(e.target)); });
  const ghostNodes = nodes
    .filter(n => neededIds.has(String(n.id)) && !primaryIds.has(String(n.id)))
    .map(n => ({ ...n, ghost: true }));

  const viewNodes = [...primaryNodes, ...ghostNodes];

  return {
    network_id: full.network_id,
    kind: desired,
    nodes: viewNodes,
    edges: viewEdges,
    counts: { nodes: viewNodes.length, edges: viewEdges.length }
  };
}

  function setStatus(text, isError) {
    const dot = document.querySelector('.status-dot');
    const t = document.querySelector('.status-text') || document.querySelector('.status');
    if (dot) {
      dot.classList.remove('status--ok', 'status--error', 'status--unknown', 'status--danger');
      dot.classList.add(isError ? 'status--error' : 'status--ok');
    }
    if (t) t.textContent = text;
  }

})();


