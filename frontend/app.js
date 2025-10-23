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
    const target = view === 'wifi' ? document.getElementById('tab-wifi') : document.getElementById('tab-switches');
    if (target) target.checked = true;
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

  async function loadGraphFor(view) {
    try {
      const params = new URLSearchParams(location.search);
      const networkId = params.get('network_id') || '1';
      const label = view === 'wifi' ? 'WiFi' : (view === 'switches' ? 'Switches' : 'Todo');
      setStatus(`Cargando red ${networkId} (${label})…`);
      const opts = (view === 'all' ? {} : { kind: view === 'switches' ? 'switches' : 'wifi' });
      const graph = await API.getGraph(networkId, opts);
      if (window.Canvas && typeof window.Canvas.renderGraph === 'function') {
        window.Canvas.renderGraph(graph);
      } else {
        document.dispatchEvent(new CustomEvent('graph:loaded', { detail: graph }));
      }
      setStatus(`Red ${networkId} cargada (${label}): ${graph.counts.nodes} nodos, ${graph.counts.edges} enlaces`);
    } catch (e) {
      console.error('loadGraphFor error', e);
      setStatus('Error al cargar grafo: ' + (e?.message || 'desconocido'), true);
    }
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