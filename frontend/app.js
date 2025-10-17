(async function() {
    const s = document.getElementById('status');
    try {
      const res = await fetch('/health');
      const data = await res.json();
      if (data.ok) {
        s.textContent = `Servidor OK • ${new Date(data.time).toLocaleString()}`;
        s.style.color = '#22c55e';
      } else {
        s.textContent = 'Servidor respondió, pero no OK';
        s.style.color = '#f59e0b';
      }
    } catch (e) {
      s.textContent = 'Servidor no disponible';
      s.style.color = '#ef4444';
    }
  })();

  async function loadNetworks() {
    const ul = document.getElementById('networks');
    ul.innerHTML = 'Cargando...';
    try {
      const res = await fetch('/api/networks');
      const nets = await res.json();
      ul.innerHTML = '';
      nets.forEach(n => {
        const li = document.createElement('li');
        li.textContent = `${n.name} (${n.type})`;
        ul.appendChild(li);
      });
    } catch (e) {
      ul.innerHTML = 'Error cargando redes';
    }
  }
  loadNetworks();

  (function() {
    const KEY = 'theme';
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
  
    function applyTheme(theme, persist) {
      root.dataset.theme = theme;
      root.style.colorScheme = theme; // Ajusta formularios nativos al tema
      if (persist) {
        try { localStorage.setItem(KEY, theme); } catch (e) {}
      }
      // Accesibilidad: refleja estado del botón
      if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  
    function getStoredTheme() {
      try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
  
    function getSystemTheme() {
      const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      return (mql && mql.matches) ? 'dark' : 'light';
    }
  
    // Inicializa estado del botón
    function syncButton() {
      if (!btn) return;
      const theme = root.dataset.theme || getStoredTheme() || getSystemTheme();
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  
    // Toggle manual del usuario
    if (btn) {
      btn.addEventListener('click', () => {
        const current = root.dataset.theme || getStoredTheme() || getSystemTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }
  
    // Si el usuario NO ha elegido, sigue los cambios del sistema
    const hasUserPref = !!getStoredTheme();
    if (!hasUserPref && window.matchMedia) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light', false);
      try {
        // Chrome/Edge/Firefox modernos
        mql.addEventListener('change', handler);
      } catch (_) {
        // Safari viejo
        mql.addListener(handler);
      }
    }
  
    // Sincroniza el botón al cargar
    syncButton();
  })();