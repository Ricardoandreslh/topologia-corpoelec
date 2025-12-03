(function () {
  const THEME_KEY = 'theme';
  const root = document.documentElement;
  window.connectMode = false;
  window.selectedPortA = null;
  let tooltipEl = null;

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    
    if (window.Canvas?.updateTheme) {
      window.Canvas.updateTheme('canvas-wifi', theme);
      window.Canvas.updateTheme('canvas-switches', theme);
    }
  }
  
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }
  function getSystemTheme() { const m = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null; return (m && m.matches) ? 'dark' : 'light'; }


  function setStatus(text, isError) {
    try {
      const dot = document.querySelector('.status-dot');
      const t = document.querySelector('.status-text') || document.querySelector('.status');
      if (dot) {
        dot.classList.remove('status--ok', 'status--error', 'status--unknown', 'status--danger');
        dot.classList.add(isError ? 'status--error' : 'status--ok');
      }
      if (t) t.textContent = text;
    } catch (e) {
      console.error('setStatus error:', e);
    }
  }
  try { window.setStatus = setStatus; } catch (e) {}

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      initThemeToggle();
      bindLogoutButton();
      bindUIControls();
      bindCRUDButtons();
      bindModals();
      bindContextMenuActions();

      const page = detectPage();
      if (page === 'login') {
        if (typeof setStatus === 'function') setStatus('Listo para iniciar sesión');
        return;
      }
  
      const ok = await Auth.requireAuthOnPage();
      if (!ok) return; 
  
      populateUserBadge();
      bindTabsSafely();
      await initViewFromQuerySafely();
    } catch (err) {
      console.error('app init error', err);
      if (typeof setStatus === 'function') setStatus('Error inicializando la página', true);
    }
  });
  

  function bindUIControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const fitBtn = document.getElementById('fit-view');
    const backgroundBtn = document.getElementById('toggle-background');
    const searchInput = document.getElementById('device-search');
    const exportBtn = document.getElementById('export-excel');
    const exportPngBtn = document.getElementById('export-png');

    if (exportBtn) {
      exportBtn.addEventListener('click', handleExportExcel);
    }
    if (exportPngBtn) exportPngBtn.addEventListener('click', handleExportPNG);

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
      const debouncedSearch = debounce(handleSearch, 280);
      searchInput.addEventListener('input', debouncedSearch);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          handleSearch({ target: searchInput });
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('vlan-filter-apply');
    const clearBtn = document.getElementById('vlan-filter-clear');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const v = (document.getElementById('vlan-filter')?.value || '').trim();
        try { sessionStorage.setItem('vlan_filter', v); } catch (_) {}
        GRAPH_CACHE.clear();
        loadGraphFor(getCurrentView(), getCurrentSiteId(), { vlanFilter: v ? v.split(',').map(s => s.trim()) : null });
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        try { sessionStorage.removeItem('vlan_filter'); } catch (_) {}
        const el = document.getElementById('vlan-filter');
        if (el) el.value = '';
        GRAPH_CACHE.clear();
        loadGraphFor(getCurrentView(), getCurrentSiteId(), { vlanFilter: null });
      });
    }
  });

  function initSitePanel() {
    const networkId = new URLSearchParams(location.search).get('network_id') || '1';
    const panel = document.createElement('div');
    panel.id = 'site-panel';
    panel.innerHTML = `
      <h3>Vista por Sede</h3>
      <div style="display:flex; gap:8px; margin-bottom:8px;">
        <button id="add-site" class="btn btn--primary" title="Agregar Sede">Agregar Sede</button>
        <button id="edit-site" class="btn" title="Editar Sede">Editar Sede</button>
        <button id="delete-site" class="btn btn--danger" title="Eliminar Sede">Eliminar Sede</button>
      </div>
      <div id="site-tree"></div>
      <label style="margin-top: 10px; display: block;">
        <input type="checkbox" id="show-inter-site" checked> Mostrar conexiones inter-sede
      </label>
    `;
  
    panel.style.backgroundColor = 'var(--surface-1)'; 
    panel.style.border = '1px solid var(--border)';
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
  
    const main = document.querySelector('.app-main');
    main.insertBefore(panel, main.firstElementChild);
  
    async function reloadTree(selectedSiteId = null) {
      try {
        const sites = await API.getSites(networkId);
        const treeData = [
          { id: 'general', text: 'General', parent: '#', data: { site_id: null } },
          ...sites.map(s => ({
            id: s.id.toString(),
            text: s.name,
            parent: s.parent_id ? s.parent_id.toString() : '#',
            data: { site_id: s.id }
          }))
        ];
  
        try { const inst = $('#site-tree').jstree(true); if (inst) $('#site-tree').jstree('destroy'); } catch (_) {}
  
        $('#site-tree').jstree({
          core: { data: treeData, themes: { responsive: true } },
          plugins: ['types', 'state', 'search'],
          types: { default: { icon: 'jstree-folder' }, leaf: { icon: 'jstree-file' } },
          state: { key: 'site-tree' }
        });
  
        $('#site-tree').on('ready.jstree', function() {
          $('#site-tree').jstree('open_all');
          if (selectedSiteId) {
            try { $('#site-tree').jstree('select_node', String(selectedSiteId)); } catch (_) {}
          }
        });
  
        $('#site-tree').off('select_node');
        $('#site-tree').on('select_node.jstree', function(e, data) {
          const selectedId = data.node.data.site_id;
          GRAPH_CACHE.clear();
          const showInter = document.getElementById('show-inter-site').checked;
          loadGraphFor(getCurrentView(), selectedId, { showInterSite: showInter });
        });
  
      } catch (err) {
        console.error('Error cargando sedes:', err);
        alert('Error cargando sedes: ' + (err?.message || 'desconocido'));
      }
    }
  
    reloadTree();
  
    async function openSiteModal(mode = 'create', site = null) {
      const modal = document.getElementById('site-modal');
      const form = document.getElementById('site-form');
      const title = document.getElementById('site-title');
      const nameEl = document.getElementById('site-name');
      const descEl = document.getElementById('site-description');
      const idEl = document.getElementById('site-id');
      const parentHidden = document.getElementById('site-parent-hidden');
      const parentTree = document.getElementById('site-parent-tree');
      const parentSearch = document.getElementById('site-parent-search');
      const errorBox = document.getElementById('site-error');
  
      errorBox.hidden = true; errorBox.textContent = '';
      try {
        const sites = await API.getSites(networkId);
        const excludeId = site ? String(site.id) : null;
        const treeData = [
          { id: 'none', text: '(ninguno)', parent: '#', data: { site_id: null } },
          ...sites
            .filter(s => String(s.id) !== excludeId)
            .map(s => ({ id: String(s.id), text: s.name, parent: s.parent_id ? String(s.parent_id) : '#', data: { site_id: s.id } }))
        ];
  
        try { const inst = $('#site-parent-tree').jstree(true); if (inst) $('#site-parent-tree').jstree('destroy'); } catch (_) {}
  
        $('#site-parent-tree').jstree({
          core: { data: treeData, themes: { responsive: true } },
          plugins: ['search'],
          search: { show_only_matches: true, show_only_matches_children: true }
        });
  
        parentSearch.addEventListener('keyup', function() { $('#site-parent-tree').jstree('search', this.value); });
  
        $('#site-parent-tree').off('select_node');
        $('#site-parent-tree').on('select_node.jstree', function(_e, data) {
          const id = data.node && data.node.id;
          if (!id || id === 'none') parentHidden.value = '';
          else parentHidden.value = id;
        });
  
      } catch (err) {
        console.error('openSiteModal load sites error', err);
        alert('No se pudieron cargar las sedes. Intenta más tarde.');
        return;
      }
  
      if (mode === 'create') {
        title.textContent = 'Agregar Sede';
        idEl.value = '';
        nameEl.value = '';
        descEl.value = '';
        parentHidden.value = '';
        try { $('#site-parent-tree').one('ready.jstree', function() { $('#site-parent-tree').jstree('select_node', 'none'); }); } catch (_) {}
      } else {
        title.textContent = 'Editar Sede';
        idEl.value = site.id;
        nameEl.value = site.name || '';
        descEl.value = site.description || '';
        parentHidden.value = site.parent_id || '';
        try {
          $('#site-parent-tree').one('ready.jstree', function() {
            if (site.parent_id) {
              try { $('#site-parent-tree').jstree('select_node', String(site.parent_id)); } catch (_) {}
            } else {
              try { $('#site-parent-tree').jstree('select_node', 'none'); } catch (_) {}
            }
          });
        } catch (_) {}
      }
  
      form.dataset.mode = mode;
      if (modal) { modal.hidden = false; modal.setAttribute('aria-hidden', 'false'); }
    }
  
    document.getElementById('add-site').addEventListener('click', async () => {
      await openSiteModal('create', null);
    });
  
    document.getElementById('edit-site').addEventListener('click', async () => {
      try {
        const inst = $('#site-tree').jstree(true);
        const sel = inst ? inst.get_selected(true)[0] : null;
        if (!sel || !sel.data || sel.id === 'general') {
          alert('Selecciona una sede válida para editar (no la categoría "General").');
          return;
        }
        const siteId = sel.data.site_id;
        const site = await (async () => {
          try {
            const json = await fetch(`/api/sites/${encodeURIComponent(siteId)}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}` }});
            if (!json.ok) return null;
            const j = await json.json();
            return j.data || null;
          } catch (e) { return null; }
        })();
        await openSiteModal('edit', site || { id: siteId, name: sel.text, parent_id: null });
      } catch (err) {
        console.error('edit-site error', err);
        alert('Error preparando edición de sede: ' + (err?.message || err));
      }
    });
  
    document.getElementById('delete-site').addEventListener('click', async () => {
      try {
        const inst = $('#site-tree').jstree(true);
        const sel = inst ? inst.get_selected(true)[0] : null;
        if (!sel || !sel.data || sel.id === 'general') {
          alert('Selecciona una sede válida para eliminar (no la categoría "General").');
          return;
        }
        const siteId = sel.data.site_id;
        let summary = null;
        try {
          summary = await API.getSiteSummary(siteId);
        } catch (err) {
          console.warn('No se pudo obtener resumen de la sede:', err);
        }
    
        if (summary) {
          const siteName = summary.site?.name || sel.text || String(siteId);
          openConfirmModal('site', { id: siteId, name: siteName, summary: summary });
        } else {
          openConfirmModal('site', { id: siteId, name: sel.text, message: `Eliminar la sede "${sel.text}" (ID: ${siteId})` });
        }
      } catch (err) {
        console.error('delete-site error', err);
        alert('Error intentando eliminar sede: ' + (err?.message || err));
      }
    });

    document.addEventListener('submit', async function(e) {
      if (e.target && e.target.id === 'site-form') {
        e.preventDefault();
        const form = e.target;
        const mode = form.dataset.mode || 'create';
        const id = document.getElementById('site-id').value;
        const name = document.getElementById('site-name').value.trim();
        const description = document.getElementById('site-description').value.trim() || null;
        const parentVal = document.getElementById('site-parent-hidden').value;
        const parent_id = parentVal ? Number(parentVal) : null;
        const errorBox = document.getElementById('site-error');
        errorBox.hidden = true; errorBox.textContent = '';
  
        if (!name) {
          errorBox.hidden = false;
          errorBox.textContent = 'El nombre de la sede es requerido.';
          return;
        }
  
        try {
          if (mode === 'create') {
            await API.createSite({ network_id: Number(networkId), name: name, description: description, parent_id: parent_id });
            setStatus('Sede creada', false);
          } else {
            await API.updateSite(id, { name: name, description: description, parent_id: parent_id });
            setStatus('Sede actualizada', false);
          }
          const modal = document.getElementById('site-modal');
          if (modal) { modal.hidden = true; modal.setAttribute('aria-hidden', 'true'); }
          await reloadTree(mode === 'create' ? null : id);
        } catch (err) {
          console.error('site submit error', err);
          let msg = (err && err.message) ? err.message : String(err);
          try {
            msg = msg.replace(/^"|"$/g, '');
          } catch (_) {}
          errorBox.hidden = false;
          errorBox.textContent = msg || 'Error en la operación.';
        }
      }
    });
  
    document.getElementById('site-cancel').addEventListener('click', () => {
      const modal = document.getElementById('site-modal');
      if (modal) { modal.hidden = true; modal.setAttribute('aria-hidden', 'true'); }
    });
    document.getElementById('site-close').addEventListener('click', () => {
      const modal = document.getElementById('site-modal');
      if (modal) { modal.hidden = true; modal.setAttribute('aria-hidden', 'true'); }
    });
  
    document.getElementById('show-inter-site').addEventListener('change', (e) => {
      GRAPH_CACHE.clear();
      const showInter = e.target.checked;
      loadGraphFor(getCurrentView(), getCurrentSiteId(), { showInterSite: showInter });
    });
  }
  
  
  async function handleExportExcel() {
    try {
      const networkId = new URLSearchParams(location.search).get('network_id') || '1';
      const view = getCurrentView(); 
      const currentSiteId = getCurrentSiteId();
      const full = await fetchFullGraph(networkId, currentSiteId); 
      const projected = projectGraphForView(full, view);
      
      // Si se está exportando para una sede concreta, filtrar para incluir solo nodos con site_id == currentSiteId
      let nodesToExport = projected.nodes || [];
      if (currentSiteId) {
        nodesToExport = (nodesToExport || []).filter(n => String(n.site_id) === String(currentSiteId));
      }

      const nodesData = await Promise.all((nodesToExport || []).map(async (n) => {
        let ports = n.ports || [];
        if ((!ports || ports.length === 0) && n.id) {
          try { ports = await API.getPorts(n.id); } catch (_) { ports = []; }
        }
        const portsDetail = (ports || []).map(p => `${p.name}${p.connected ? ' (U)' : ''}${p.kind ? ' '+p.kind : ''}`).join('; ');
        return {
          ID: n.id,
          Nombre: n.label || n.id,
          Tipo: n.type,
          Categoría: n.category || nodeCategory(n.type),
          IP: n.ip || '',
          MAC: n.mac || '',
          Ubicación: n.location || '',
          Sede: n.site_path || '',
          Red_ID: n.network_id,
          Fantasma: n.ghost ? 'Sí' : 'No',
          Puertos_Total: (ports || []).length,
          Puertos_Detalle: portsDetail
        };
      }));

      const exportedNodeIds = new Set((nodesData || []).map(r => String(r.ID)));

      const edgesData = (projected.edges || []).filter(e => {
        // solo incluir edges donde ambos extremos estén en exportedNodeIds
        return exportedNodeIds.has(String(e.source)) && exportedNodeIds.has(String(e.target));
      }).map(e => {
        const vlanVal = Array.isArray(e.vlan) ? e.vlan.join(',') : (e.vlan || '');
        return {
          ID: e.id,
          Origen: e.source,
          Destino: e.target,
          Tipo_Enlace: e.link_type || '',
          Estado: e.status || '',
          VLANs: vlanVal,
          Cruzado: e.cross ? 'Sí' : 'No',
          Red_ID: e.network_id,
          Puerto_Origen: e.a_port_name || '',
          Puerto_Destino: e.b_port_name || '',
          Etiqueta: e.label || ''
        };
      });

      const wb = XLSX.utils.book_new();
      const wsNodes = XLSX.utils.json_to_sheet(nodesData);
      const wsEdges = XLSX.utils.json_to_sheet(edgesData);
      XLSX.utils.book_append_sheet(wb, wsNodes, 'Nodos');
      XLSX.utils.book_append_sheet(wb, wsEdges, 'Enlaces');

      const fileName = `grafo_red_${networkId}_${view}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      if (typeof setStatus === 'function') setStatus('Archivo Excel exportado: ' + fileName);
    } catch (err) {
      console.error('Error exportando a Excel:', err);
      if (typeof setStatus === 'function') setStatus('Error al exportar: ' + err.message, true);
    }
  }
  
  async function handleExportPNG() {
    try {
      const containerId = getActiveContainerId();
      await Canvas.exportPNG(containerId);
      setStatus('PNG exportado', false);
    } catch (err) {
      console.error('Error exportando PNG', err);
      setStatus('Error exportando PNG: ' + (err?.message || 'desconocido'), true);
    }
  }



  function bindCRUDButtons() {
    const addDeviceBtn = document.getElementById('add-device');
    const addConnectionBtn = document.getElementById('add-connection');
    const connectBtn = document.getElementById('connect-ports-btn'); 
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        window.connectMode = true;
        window.selectedPortA = null;
        setStatus('Modo conectar: selecciona dispositivo origen (puerto libre)', false);
      });
    }
  
    if (addDeviceBtn) addDeviceBtn.addEventListener('click', () => openDeviceModal());
    if (addConnectionBtn) addConnectionBtn.addEventListener('click', () => openConnectionModal());
  }
  
  function bindModals() {
    const deviceForm = document.getElementById('device-form');
    const deviceModal = document.getElementById('device-modal');
    const deviceClose = document.getElementById('device-close');
    const deviceCancel = document.getElementById('device-cancel');
    if (deviceForm) deviceForm.addEventListener('submit', handleDeviceSubmit);
    [deviceClose, deviceCancel].forEach(btn => btn?.addEventListener('click', () => closeModal(deviceModal)));
  
    
    const connectionForm = document.getElementById('connection-form');
    const connectionModal = document.getElementById('connection-modal');
    const connectionClose = document.getElementById('connection-close');
    const connectionCancel = document.getElementById('connection-cancel');
    if (connectionForm) connectionForm.addEventListener('submit', handleConnectionSubmit);
    [connectionClose, connectionCancel].forEach(btn => btn?.addEventListener('click', () => closeModal(connectionModal)));
  
    const confirmModal = document.getElementById('confirm-modal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const confirmClose = document.getElementById('confirm-close');
    confirmYes?.addEventListener('click', handleConfirmYes);
    confirmNo?.addEventListener('click', () => closeModal(confirmModal));
    confirmClose?.addEventListener('click', () => closeModal(confirmModal))
  
    const detailsModal = document.getElementById('details-modal');
    const detailsClose = document.getElementById('details-close');
    const detailsClose2 = document.getElementById('details-close-2');
    detailsClose?.addEventListener('click', () => closeModal(detailsModal));
    detailsClose2?.addEventListener('click', () => closeModal(detailsModal));
    const detailsBackdrop = detailsModal?.querySelector('.modal-backdrop');
    detailsBackdrop?.addEventListener('click', (ev) => {
      closeModal(detailsModal);
    });
  }

  function bindLogoutButton() {
    const logout = document.getElementById('logout-btn');
    if (!logout) return;
    logout.addEventListener('click', async () => {
      try {
        const access = Auth.getAccessToken();
        const refresh = Auth.getRefreshToken();
        try {
          await fetch(Auth.API_BASE + '/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(access ? { 'Authorization': 'Bearer ' + access } : {})
            },
            body: JSON.stringify({ refreshToken: refresh || null, all: false })
          });
        } catch (e) {
          console.warn('Logout request failed:', e);
        }
      } finally {
        GRAPH_CACHE.clear();
        Auth.clearAuth();
        location.replace('./login.html');
      }
    });
  }

  function bindContextMenuActions() {
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const detailsBtn = document.getElementById('details-btn'); 

    if (editBtn) {
      editBtn.addEventListener('click', async function() {
        const menu = document.getElementById('context-menu');
        const type = menu?.dataset?.type;
        const id = menu?.dataset?.id;
        hideContextMenu();
        if (!type || !id) {
          alert('Tipo o ID no definidos en el menú de contexto');
          return;
        }

        if (type === 'device') {
          try {
            const device = await API.getDevice(id);  
            openDeviceModal(device);
          } catch (err) {
            alert('Error obteniendo dispositivo: ' + err.message);
          }
        } else if (type === 'connection') {
          try {
            const connection = await API.getConnection(id);  
            openConnectionModal(connection);
          } catch (err) {
            alert('Error obteniendo conexión: ' + err.message);
          }
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', async function() {
        const menu = document.getElementById('context-menu');
        const type = menu?.dataset?.type;
        const id = menu?.dataset?.id;
        hideContextMenu();
        if (!type || !id) {
          alert('Error: Tipo o ID no definidos. Revisa la consola.');
          return;
        }
      
        if (confirm(`¿Estás seguro de eliminar este ${type === 'device' ? 'dispositivo' : 'conexión'}?`)) {
          try {
            if (type === 'device') {
              await API.deleteDevice(id);
            } else if (type === 'connection') {
              await API.deleteConnection(id);
            }
            GRAPH_CACHE.clear();
            await loadGraphFor(getCurrentView(), getCurrentSiteId())
          } catch (err) {
            alert('Error eliminando: ' + err.message);
          }
        }
      });
    }
    
    if (detailsBtn) {
      detailsBtn.addEventListener('click', async function() {
        const menu = document.getElementById('context-menu');
        const type = menu?.dataset?.type;
        const id = menu?.dataset?.id;
        hideContextMenu();
        if (!type || !id) {
          alert('Tipo o ID no definidos en el menú de contexto');
          return;
        }
        if (type !== 'device') {
          alert('Detalles sólo disponibles para dispositivos');
          return;
        }
        try {
          await openDetailsModal(id);
        } catch (err) {
          console.error('Error mostrando detalles:', err);
          alert('Error cargando detalles: ' + (err?.message || 'desconocido'));
        }
      });
    }
  }

  async function openDetailsModal(deviceId) {
    const modal = document.getElementById('details-modal');
    const imageWrap = document.getElementById('details-image');
    const generalWrap = document.getElementById('details-general');
    const summaryWrap = document.getElementById('details-ports-summary');
    const listWrap = document.getElementById('details-ports-list');
  
    if (imageWrap) imageWrap.innerHTML = '';
    if (generalWrap) generalWrap.innerHTML = '';
    if (summaryWrap) summaryWrap.innerHTML = '';
    if (listWrap) listWrap.innerHTML = '';
  
    try {
      const device = await API.getDevice(deviceId);
      const ports = await API.getPorts(deviceId);
  
      const networkId = parseInt(new URLSearchParams(location.search).get('network_id') || '1', 10);
      let connections = [];
      try { connections = await API.getConnections(networkId); } catch (e) { console.warn('getConnections failed', e); }
  
      const portConnMap = new Map();
      (connections || []).forEach(conn => {
        if (conn.a_port_id) {
          portConnMap.set(Number(conn.a_port_id), {
            peerDeviceId: conn.to_device_id,
            peerPortName: conn.b_port_name || null,
            vlan: conn.vlan || null
          });
        }
        if (conn.b_port_id) {
          portConnMap.set(Number(conn.b_port_id), {
            peerDeviceId: conn.from_device_id,
            peerPortName: conn.a_port_name || null,
            vlan: conn.vlan || null
          });
        }
      });
  
      const peerDeviceIds = new Set();
      const portsEnhanced = (ports || []).map(p => {
        const copy = Object.assign({}, p);
        const pm = portConnMap.get(Number(p.id));
        if (pm) {
          copy.connected = true;
          copy.peerDeviceId = pm.peerDeviceId;
          copy.peerPortName = pm.peerPortName;
          copy.vlan = pm.vlan;
          if (pm.peerDeviceId) peerDeviceIds.add(pm.peerDeviceId);
        } else {
          copy.connected = !!p.connected;
        }
        return copy;
      });
  
      const deviceNameById = {};
      if (peerDeviceIds.size > 0) {
        await Promise.all(Array.from(peerDeviceIds).map(async (id) => {
          try { const d = await API.getDevice(id); deviceNameById[id] = d?.name || String(id); }
          catch (e) { deviceNameById[id] = String(id); }
        }));
      }
  
      const total = portsEnhanced.length;
      const used = portsEnhanced.filter(p => p.connected === true).length;
      const free = total - used;
  
      if (imageWrap) {
        if (device.image_id) {
          const img = document.createElement('img');
          img.src = `/api/images/${device.image_id}`;
          img.alt = device.name || 'Imagen dispositivo';
          img.style.maxWidth = '100%';
          img.style.borderRadius = '8px';
          img.style.border = '1px solid var(--border)';
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', () => openImageLightbox(img.src, device.name));
          imageWrap.appendChild(img);
        } else {
          imageWrap.innerHTML = '<div style="color:var(--muted); font-size:13px;">Sin imagen</div>';
        }
      }
  
      // General
      if (generalWrap) {
        const nameEl = `<div style="font-weight:700; font-size:16px;">${escapeHtml(device.name || '—')}</div>`;
        const ipEl = `<div style="color:var(--muted)">IP: ${escapeHtml(device.ip_address || '—')}</div>`;
        const other = `<div style="margin-top:6px; font-size:13px;">
          Tipo: ${escapeHtml(device.device_type || '—')} • MAC: ${escapeHtml(device.mac_address || '—')}
          <div style="margin-top:4px;">Ubicación: ${escapeHtml(device.location || '—')}</div>
        </div>`;
        generalWrap.innerHTML = nameEl + ipEl + other;
      }
  
      if (summaryWrap) {
        summaryWrap.innerHTML = `<strong>Puertos</strong>: ${total} total • ${used} conectados • ${free} libres`;
      }
  
      if (listWrap) {
        if (!portsEnhanced || portsEnhanced.length === 0) {
          listWrap.innerHTML = `<div style="color:var(--muted)">No hay puertos registrados.</div>`;
        } else {
          const ul = document.createElement('ul');
          ul.style.listStyle = 'none';
          ul.style.padding = '0';
          ul.style.margin = '0';
          portsEnhanced.forEach(p => {
            const li = document.createElement('li');
            li.style.padding = '6px 0';
            li.style.borderBottom = '1px dashed rgba(0,0,0,0.06)';
            const status = p.connected ? 'Usado' : 'Libre';
            let connInfo = '';
            if (p.connected) {
              if (p.peerDeviceId) {
                const peerName = deviceNameById[p.peerDeviceId] || String(p.peerDeviceId);
                const peerPort = p.peerPortName ? ` — ${escapeHtml(p.peerPortName)}` : '';
                connInfo = ` • Conectado a ${escapeHtml(peerName)}${peerPort}`;
                  if (p.vlan) {
                    const vtxt = Array.isArray(p.vlan) ? p.vlan.join(', ') : String(p.vlan);
                    connInfo += ` • VLAN ${escapeHtml(vtxt)}`;
                  }
                } else {
                if (p.connection_to) connInfo = ` • Conectado a ${escapeHtml(String(p.connection_to))}`;
                else if (p.remote_device) connInfo = ` • Conectado a ${escapeHtml(String(p.remote_device))}`;
                else if (p.peer) connInfo = ` • Conectado a ${escapeHtml(String(p.peer))}`;
              }
            }
            li.innerHTML = `<strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.kind || '')} — ${status}${connInfo}`;
            ul.appendChild(li);
          });
          listWrap.appendChild(ul);
        }
      }
  
      if (modal) { modal.hidden = false; modal.setAttribute('aria-hidden', 'false'); }
  
    } catch (err) {
      console.error('openDetailsModal error', err);
      alert('No se pudo obtener detalles del dispositivo: ' + (err?.message || 'error'));
    }
  }
  
  function openImageLightbox(src, title) {
    const overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    overlay.tabIndex = -1;
  
    const img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
  
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => closeImageLightbox(overlay));
  
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
  
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) closeImageLightbox(overlay);
    });
  
    document.body.appendChild(overlay);
  
    const onKey = (e) => { if (e.key === 'Escape') closeImageLightbox(overlay); };
    overlay._onKey = onKey;
    document.addEventListener('keydown', onKey);
  }
  
  function closeImageLightbox(overlay) {
    if (!overlay) return;
    const onKey = overlay._onKey;
    if (onKey) document.removeEventListener('keydown', onKey);
    overlay.remove();
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function openDeviceModal(device = null) {
    const modal = document.getElementById('device-modal');
    const form = document.getElementById('device-form');
    const title = document.getElementById('device-title');
    const networkId = new URLSearchParams(location.search).get('network_id') || '1';
    const imageInput = document.getElementById('device-image');
    const previewDiv = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeBtn = document.getElementById('remove-image');
    
    const existingContainer = document.getElementById('site-selector-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    let sites = [];
    try {
      sites = await API.getSites(networkId);
    } catch (err) {
      console.error('Error cargando sedes para el modal:', err);
      alert('No se pudo cargar las sedes. Intenta más tarde.');
      return;
    }
  
    const siteContainer = document.createElement('div');
    siteContainer.id = 'site-selector-container';
    const siteLabel = document.createElement('label');
    siteLabel.textContent = 'Sede (con búsqueda y árbol)';
    const siteDiv = document.createElement('div');
    siteDiv.id = 'device-site-tree'; 
    siteContainer.appendChild(siteLabel);
    siteContainer.appendChild(siteDiv);
  
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar sede...';
    searchInput.style.marginBottom = '10px';
    siteContainer.insertBefore(searchInput, siteDiv);
  
    const locationEl = document.getElementById('device-location');
    if (locationEl && locationEl.parentNode) {
      locationEl.insertAdjacentElement('afterend', siteContainer);
    } else {
      form.appendChild(siteContainer);
    }
  
    const treeData = sites.map(s => ({
      id: String(s.id),
      text: s.name,
      parent: s.parent_id ? String(s.parent_id) : '#',
      data: { site_id: s.id }
    }));
  
    try {
      const inst = $('#device-site-tree').jstree(true);
      if (inst) {
        $('#device-site-tree').jstree('destroy');
      }
    } catch (e) {
    }
  
    $('#device-site-tree').jstree({
      core: {
        data: treeData,
        themes: { responsive: true }
      },
      plugins: ['search'],
      search: {
        show_only_matches: true,
        show_only_matches_children: true
      }
    });
  
    searchInput.addEventListener('keyup', function() {
      $('#device-site-tree').jstree('search', this.value);
    });
  
    $('#device-site-tree').on('select_node.jstree', function(e, data) {
      const selectedId = data.node.id;
      let hiddenField = document.getElementById('device-site-hidden');
      if (!hiddenField) {
        hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.id = 'device-site-hidden';
        hiddenField.name = 'site_id';
        form.appendChild(hiddenField);
      }
      hiddenField.value = selectedId;
    });
  
    if (device && device.site_id) {
      $('#device-site-tree').on('ready.jstree', function() {
        try {
          $('#device-site-tree').jstree('select_node', String(device.site_id));
        } catch (_) {}
      });
    }
  
    if (device && device.image_id) {
      previewImg.src = `/api/images/${device.image_id}`;
      previewDiv.style.display = 'block';
      if (imageInput) imageInput.value = '';
    } else {
      previewDiv.style.display = 'none';
    }
  
    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => { previewImg.src = reader.result; previewDiv.style.display = 'block'; };
          reader.readAsDataURL(file);
        }
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (imageInput) imageInput.value = '';
        previewDiv.style.display = 'none';
      });
    }
  
    if (device) {
      if (title) title.textContent = 'Editar Dispositivo';
      document.getElementById('device-id').value = device.id;
      document.getElementById('device-name').value = device.name;
      document.getElementById('device-type').value = device.device_type;
      document.getElementById('device-ip').value = device.ip_address || '';
      document.getElementById('device-mac').value = device.mac_address || '';
      document.getElementById('device-location').value = device.location || '';
      try {
        const ports = device ? await API.getPorts(device.id).catch(()=>[]) : [];
        let giCount = 0, feCount = 0, sfpCount = 0;
        if (ports && ports.length) {
          ports.forEach(p => {
            const k = (p.kind || '').toLowerCase();
            if (k.includes('gigabit')) giCount++;
            else if (k.includes('fast')) feCount++;
            else if (k.includes('sfp')) sfpCount++;
          });
        }
        const gigEl = document.getElementById('device-ports-gigabit');
        const fastEl = document.getElementById('device-ports-fast');
        const sfpEl = document.getElementById('device-ports-sfp');
        if (gigEl) gigEl.value = giCount || '';
        if (fastEl) fastEl.value = feCount || '';
        if (sfpEl) sfpEl.value = sfpCount || '';
      } catch (err) {
        console.error('Error cargando puertos:', err);
      }
    } else {
      if (title) title.textContent = 'Agregar Dispositivo';
      if (form) form.reset();
      const idEl = document.getElementById('device-id'); if (idEl) idEl.value = '';
    }
  
    if (modal) { modal.hidden = false; modal.setAttribute('aria-hidden', 'false'); }
  }
  
  async function openConnectionModal(connection = null) {
    const modal = document.getElementById('connection-modal');
    const form = document.getElementById('connection-form');
    const title = document.getElementById('connection-title');
    const networkId = new URLSearchParams(location.search).get('network_id') || '1';
    
    try {
      const devices = await API.getDevices(networkId);
      const fromSelect = document.getElementById('connection-from');
      const toSelect = document.getElementById('connection-to');
      if (!fromSelect || !toSelect) throw new Error('Selects de conexión no encontrados en el DOM');
      fromSelect.innerHTML = '<option value="">Seleccionar dispositivo...</option>';
      toSelect.innerHTML = '<option value="">Seleccionar dispositivo...</option>';
      devices.forEach(d => {
        const opt = `<option value="${d.id}">${d.name} (ID: ${d.id})</option>`;
        fromSelect.innerHTML += opt;
        toSelect.innerHTML += opt;
      });
    } catch (err) {
      alert('Error cargando dispositivos: ' + err.message);
      return;
    }
    
    if (connection) {
      if (title) title.textContent = 'Editar Conexión';
      document.getElementById('connection-id').value = connection.id;
      document.getElementById('connection-from').value = connection.from_device_id;  
      document.getElementById('connection-to').value = connection.to_device_id;  
      document.getElementById('connection-link-type').value = connection.link_type || '';  
      document.getElementById('connection-status').value = connection.status || 'unknown';
      const vlanEl = document.getElementById('connection-vlan');
      if (vlanEl) vlanEl.value = connection.vlan || '';
    } else {
      if (title) title.textContent = 'Agregar Conexión';
      if (form) form.reset();
      const idEl = document.getElementById('connection-id'); if (idEl) idEl.value = '';
      const vlanEl = document.getElementById('connection-vlan'); if (vlanEl) vlanEl.value = '';
    }
    if (modal) { modal.hidden = false; modal.setAttribute('aria-hidden', 'false'); }
  }
  
  async function handleConnectionSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('connection-id')?.value;
    const fromId = parseInt(document.getElementById('connection-from')?.value);
    const toId = parseInt(document.getElementById('connection-to')?.value);
    
    const networkIdStr = new URLSearchParams(location.search).get('network_id') || '1';
    const networkId = parseInt(networkIdStr);
    
    if (isNaN(networkId) || isNaN(fromId) || isNaN(toId)) {
      alert('Datos inválidos: verifica la red y los dispositivos seleccionados.');
      return;
    }
    if (fromId === toId) {
      alert('No puedes conectar un dispositivo a sí mismo.');
      return;
    }
    
    const vlanStr = document.getElementById('connection-vlan')?.value;
    let vlanVal = null;
    if (vlanStr !== undefined && vlanStr !== null && vlanStr !== '') {
      const v = parseInt(vlanStr, 10);
      if (isNaN(v) || v < 1 || v > 4094) {
        alert('VLAN inválida. Debe ser un número entre 1 y 4094.');
        return;
      }
      vlanVal = v;
    }
  
    const data = {
      network_id: networkId, 
      from_device_id: fromId,
      to_device_id: toId,
      link_type: document.getElementById('connection-link-type')?.value || null,
      status: document.getElementById('connection-status')?.value,
      vlan: vlanVal
    };
    try {
      if (id) await API.updateConnection(id, data);
      else await API.createConnection(data);
      GRAPH_CACHE.clear();
      await loadGraphFor(getCurrentView(), getCurrentSiteId())
      closeModal(document.getElementById('connection-modal'));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }
  
  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }
  
  async function handleDeviceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('device-id')?.value;
    const imageInput = document.getElementById('device-image');
    const networkIdStr = new URLSearchParams(location.search).get('network_id') || '1';
    const networkId = parseInt(networkIdStr);
  
    if (isNaN(networkId)) {
      alert('ID de red inválido. Verifica la URL.');
      return;
    }
  
    const gigCount = parseInt(document.getElementById('device-ports-gigabit')?.value) || 0;
    const fastCount = parseInt(document.getElementById('device-ports-fast')?.value) || 0;
    const sfpCount = parseInt(document.getElementById('device-ports-sfp')?.value) || 0;

    let data = {};

    const ports = [];
    for (let i = 1; i <= gigCount; i++) {
      ports.push({
        name: `Gi0/${i}`,
        kind: 'gigabit-ethernet',
        speed_mbps: 1000,
        position: ports.length + 1
      });
    }
    for (let i = 1; i <= fastCount; i++) {
      ports.push({
        name: `Fa0/${i}`,
        kind: 'fast-ethernet',
        speed_mbps: 100,
        position: ports.length + 1
      });
    }
    for (let i = 1; i <= sfpCount; i++) {
      ports.push({
        name: `SFP${i}`,
        kind: 'sfp',
        speed_mbps: null,
        position: ports.length + 1
      });
    }
    if (ports.length) data.ports = ports;

    let imageId = null;
    if (imageInput.files[0]) {
      const formData = new FormData();
      formData.append('image', imageInput.files[0]);
      try {
        const res = await fetch('/api/images', {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (!res.ok) throw new Error('Error subiendo imagen');
        const imgData = await res.json();
        imageId = imgData.id;
      } catch (err) {
        alert('Error subiendo imagen: ' + err.message);
        return;
      }
    }
  
    data.network_id = networkId;
    data.name = document.getElementById('device-name')?.value;
    data.device_type = document.getElementById('device-type')?.value;
    data.ip_address = document.getElementById('device-ip')?.value || null;
    data.mac_address = document.getElementById('device-mac')?.value || null;
    data.location = document.getElementById('device-location')?.value || null;
    data.image_id = imageId;
    data.site_id = document.getElementById('device-site-hidden')?.value ? parseInt(document.getElementById('device-site-hidden').value, 10) : null;
    try {
      if (id) await API.updateDevice(id, data);
      else await API.createDevice(data);
      GRAPH_CACHE.clear();
      await loadGraphFor(getCurrentView(), getCurrentSiteId())
      closeModal(document.getElementById('device-modal'));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  function openConfirmModal(type, item) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const summaryEl = document.getElementById('confirm-summary');
    const descEl = document.getElementById('confirm-description');
    if (!modal || !titleEl || !summaryEl || !descEl) return;
  
    summaryEl.innerHTML = '';
    descEl.innerHTML = '';
  
    const displayName = item && item.name ? `${item.name} (ID: ${item.id})` : String(item.id || '');
  
    if (type === 'site') titleEl.textContent = 'Confirmar eliminación de sede';
    else if (type === 'device') titleEl.textContent = 'Confirmar eliminación de dispositivo';
    else if (type === 'connection') titleEl.textContent = 'Confirmar eliminación de conexión';
    else titleEl.textContent = 'Confirmar Acción';
  
    if (type === 'site' && item && item.summary && typeof item.summary === 'object') {
      const s = item.summary;
      const site = s.site || {};
      const head = document.createElement('div');
      head.className = 'confirm-head';
      const hname = document.createElement('div');
      hname.className = 'confirm-title-strong';
      hname.textContent = `Eliminar "${site.name || displayName}"`;
      head.appendChild(hname);
      summaryEl.appendChild(head);
  
      const badges = document.createElement('div');
      badges.className = 'confirm-badges';
      const bDirect = document.createElement('div');
      bDirect.className = 'confirm-badge confirm-badge--direct';
      bDirect.textContent = `Directos: ${s.devices_direct || 0}`;
      const bTree = document.createElement('div');
      bTree.className = 'confirm-badge confirm-badge--tree';
      bTree.textContent = `En árbol: ${s.devices_in_tree || 0}`;
      const bChild = document.createElement('div');
      bChild.className = 'confirm-badge confirm-badge--sites';
      bChild.textContent = `Hijas directas: ${s.child_sites || 0}`;
      const bDesc = document.createElement('div');
      bDesc.className = 'confirm-badge confirm-badge--sites';
      bDesc.textContent = `Descendientes: ${s.descendant_sites || 0}`;
      badges.appendChild(bDirect);
      badges.appendChild(bTree);
      badges.appendChild(bChild);
      badges.appendChild(bDesc);
      summaryEl.appendChild(badges);
  
      const p = document.createElement('div');
      p.className = 'confirm-description';
      const direct = s.devices_direct || 0;
      p.textContent = `Si confirma, los ${direct} dispositivo${direct === 1 ? '' : 's'} asignado${direct === 1 ? '' : 's'} DIRECTAMENTE a "${site.name || displayName}" quedarán sin sede (site_id = NULL). Las sedes hijas (si existen) mantendrán sus dispositivos.`;
      descEl.appendChild(p);
  
    } else {
      let text = item && item.message ? String(item.message) : `¿Eliminar ${displayName}?`;
      const parts = text.split('\n');
      parts.forEach((line, idx) => {
        const tnode = document.createElement('div');
        tnode.textContent = line;
        descEl.appendChild(tnode);
        if (idx < parts.length - 1) descEl.appendChild(document.createElement('br'));
      });
    }
  
    modal.dataset.type = type;
    modal.dataset.id = item && item.id ? item.id : '';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }
  
  async function handleConfirmYes() {
    const modal = document.getElementById('confirm-modal');
    const type = modal?.dataset?.type;
    const id = modal?.dataset?.id;
    try {
      if (type === 'device') await API.deleteDevice(id);
      else if (type === 'connection') await API.deleteConnection(id);
      else if (type === 'site') await API.deleteSite(id);
      GRAPH_CACHE.clear();
      await loadGraphFor(getCurrentView(), getCurrentSiteId());
      closeModal(modal);
    } catch (err) {
      alert('Error: ' + (err?.message || err));
    }
  }
  
  function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  function getCurrentView() {
    const tabWifi = document.getElementById('tab-wifi');
    return tabWifi && tabWifi.checked ? 'wifi' : 'switches';
  }

  function getCurrentSiteId() {
    const selector = document.getElementById('site-selector');
    return selector ? (selector.value || null) : null;
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
    const raw = (event && event.target && event.target.value !== undefined) ? event.target.value : (typeof event === 'string' ? event : '');
    const query = String(raw || '').trim();
  
    if (!query) {
      GRAPH_CACHE.clear();
      loadGraphFor(getCurrentView(), getCurrentSiteId(), { vlanFilter: null });
      if (window.Canvas?.searchNodes) window.Canvas.searchNodes(containerId, '');
      return;
    }
  
    const vlanCandidate = query.replace(/\s+/g, '');
    const isVlanLike = /^[0-9]+(,[0-9]+)*$/.test(vlanCandidate);
  
    if (isVlanLike) {
      const vlans = vlanCandidate.split(',').map(s => s.trim()).filter(Boolean);
      GRAPH_CACHE.clear();
      loadGraphFor(getCurrentView(), getCurrentSiteId(), { vlanFilter: vlans });
      return;
    }
  
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

  function populateUserBadge() {
    const badge = document.getElementById('user-badge');
    if (!badge) return;
    try {
      const user = Auth.getUser() || {};
      if (user.username) {
        badge.textContent = user.username + (user.role ? ' (' + user.role + ')' : '');
        badge.title = 'Sesión activa — hacer clic para ver sesiones';
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', (e) => {
          e.preventDefault();
          openSessionsModal();
        });
      } else {
        badge.textContent = 'Usuario';
      }
    } catch (_) { badge.textContent = 'Usuario'; }
  }


  function openSessionsModal() {
    const existing = document.getElementById('sessions-modal');
    if (existing) {
      existing.hidden = false;
      existing.setAttribute('aria-hidden', 'false');
      return;
    }
  
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'sessions-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.hidden = true;
  
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog" style="min-width:420px; max-width:720px;">
        <button class="modal-close" id="sessions-close" aria-label="Cerrar">×</button>
        <h2>Sesiones activas</h2>
        <div id="sessions-list" style="max-height:360px; overflow:auto; margin-top:8px;"></div>
        <div style="margin-top:12px; display:flex; gap:8px; justify-content: flex-end;">
          <button id="revoke-all-sessions" class="btn btn--danger">Cerrar todas</button>
          <button id="sessions-dismiss" class="btn">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    async function loadSessions() {
      const list = document.getElementById('sessions-list');
      list.innerHTML = '<div style="color:var(--muted)">Cargando…</div>';
      try {
        const sessions = await Auth.getSessions();
        if (!sessions || sessions.length === 0) {
          list.innerHTML = '<div style="color:var(--muted)">No hay sesiones activas</div>';
          return;
        }
        const rows = sessions.map(s => {
          const created = s.created_at || s.createdAt || '';
          const expires = s.expires_at || s.expiresAt || '';
          const ua = s.user_agent || s.userAgent || '';
          const ip = s.ip || '';
          return `
            <div class="session-row" data-id="${s.id}" style="display:flex; justify-content:space-between; gap:12px; padding:8px; border-bottom:1px solid var(--border)">
              <div style="flex:1">
                <div style="font-weight:700">${escapeHtml(ua || 'Agente desconocido')}</div>
                <div style="font-size:13px; color:var(--muted)">${escapeHtml(ip)} • Creado: ${escapeHtml(created)} ${expires ? '• Expira: ' + escapeHtml(expires) : ''}</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                <button class="btn revoke-session" data-id="${s.id}" style="padding:6px 10px;">Revocar</button>
              </div>
            </div>
          `;
        }).join('');
        list.innerHTML = rows;
        Array.from(list.querySelectorAll('.revoke-session')).forEach(btn => {
          btn.addEventListener('click', async (ev) => {
            const id = btn.dataset.id;
            if (!confirm('Revocar esta sesión?')) return;
            try {
              await Auth.revokeSessionById(id);
              btn.textContent = 'Revocada';
              btn.disabled = true;
              const row = btn.closest('.session-row');
              if (row) row.remove();
            } catch (e) {
              alert('No se pudo revocar: ' + (e.message || e));
            }
          });
        });
      } catch (err) {
        list.innerHTML = '<div style="color:var(--danger)">Error cargando sesiones</div>';
      }
    }
  
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });
    modal.querySelector('#sessions-dismiss').addEventListener('click', () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });
    modal.querySelector('#sessions-close').addEventListener('click', () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    });
    modal.querySelector('#revoke-all-sessions').addEventListener('click', async () => {
      if (!confirm('Cerrar TODAS las sesiones de este usuario? Esto forzará a re-login en todos los dispositivos.')) return;
      try {
        await Auth.revokeAllSessions();
        alert('Todas las sesiones han sido revocadas.');
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
      } catch (e) {
        alert('No se pudieron revocar todas las sesiones: ' + (e.message || e));
      }
    });
  
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    loadSessions();
  }

  initSitePanel();


  

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
    const tabId = view === 'switches' ? 'tab-switches' : 'tab-wifi'; 
    const target = document.getElementById(tabId);    
    if (target) target.checked = true;
    if (view === 'all') {
      await loadGraphFor('all', getCurrentSiteId());
    } else {
      await loadGraphFor(view === 'switches' ? 'switches' : 'wifi', getCurrentSiteId());
    }
  }
  

  function setViewAndLoad(view) {
    const params = new URLSearchParams(location.search);
    if (view === 'all') params.delete('view'); else params.set('view', view);
    const url = location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState({}, '', url);
    loadGraphFor(view, getCurrentSiteId());
  }

const GRAPH_CACHE = new Map();

async function fetchFullGraph(networkId, siteId = null) {
  const cacheKey = `${networkId}_${siteId || 'general'}`; 
  if (GRAPH_CACHE.has(cacheKey)) return GRAPH_CACHE.get(cacheKey);
  const full = await API.getGraph(networkId, { site_id: siteId }); 
  GRAPH_CACHE.set(cacheKey, full);
  return full;
}

async function computeNodePortsSummary(deviceId) {
  try {
    const ports = await API.getPorts(deviceId);
    const total = ports.length;
    const used = ports.filter(p => p.connected === true).length;
    return { ports, ports_summary: { total, used } };
  } catch (e) {
    return { ports: [], ports_summary: { total: 0, used: 0 } };
  }
}


function nodeCategory(type) {
  if (window.Canvas && typeof window.Canvas.nodeCategory === 'function') {
    return window.Canvas.nodeCategory(type);
  }
  const t = String(type || '').toLowerCase().trim();
  if (['ap','wifi','router','gateway','controller','repeater','access_point','ap_wifi','wireless_ap','wifi_ap','ap-bridge'].includes(t)) return 'wifi';
  if (['switch','core_switch','distribution_switch','access_switch','layer2_switch','layer3_switch','l2_switch','l3_switch'].includes(t)) return 'switch';
  return 'other';
}

function projectGraphForView(full, view, opts = {}) {
  if (!full) return { network_id: null, nodes: [], edges: [], counts: { nodes: 0, edges: 0 }, kind: 'all' };

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

  const alwaysIncludeTypes = new Set(['router', 'other']);

  const primaryNodes = nodes.filter(n => {
    const cat = nodeCategory(n.type);
    if (cat === desired) return true;
    const t = String(n.type || '').toLowerCase().trim();
    if (alwaysIncludeTypes.has(t)) return true;
    return false;
  });
  const primaryIds = new Set(primaryNodes.map(n => String(n.id)));

  let viewEdges = edges
    .filter(e => primaryIds.has(String(e.source)) || primaryIds.has(String(e.target)))
    .map(e => {
      const sIn = primaryIds.has(String(e.source));
      const tIn = primaryIds.has(String(e.target));
      return { ...e, cross: (sIn && !tIn) || (!sIn && tIn) };
    });

  if (opts && opts.vlanFilter && Array.isArray(opts.vlanFilter) && opts.vlanFilter.length) {
    const wanted = new Set(opts.vlanFilter.map(x => String(x)));
    viewEdges = viewEdges.filter(e => {
      if (!e.vlan) return false;
      const arr = Array.isArray(e.vlan) ? e.vlan.map(v => String(v)) : [String(e.vlan)];
      return arr.some(v => wanted.has(v));
    });
  }

  if (opts.showInterSite === false) {
    viewEdges = viewEdges.filter(e => e.cross !== true);
  }

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


async function loadGraphFor(view, siteId, opts = {}) {
  try {
    if (!siteId) siteId = getCurrentSiteId();  
    if (siteId === undefined) siteId = getCurrentSiteId(); 
    const params = new URLSearchParams(location.search);
    const networkId = params.get('network_id') || '1';
    const label = view === 'wifi' ? 'WiFi' : (view === 'switches' ? 'Red Corporativa' : 'Todo');
    if (typeof setStatus === 'function') setStatus(`Cargando red ${networkId} (${label})…`);

    const full = await fetchFullGraph(networkId, siteId); 
    let projected = projectGraphForView(full, view, opts);  
    const containerId = view === 'switches' ? 'canvas-switches' : 'canvas-wifi';
    const otherId = containerId === 'canvas-wifi' ? 'canvas-switches' : 'canvas-wifi';
    if (document.getElementById(otherId)) {
      if (window.Canvas?.destroy) window.Canvas.destroy(otherId);
      document.getElementById(otherId).innerHTML = '';
    }

    if (window.Canvas?.renderGraph) {
      window.Canvas.renderGraph(projected, { 
        containerId: containerId,
        viewType: view,
        siteId: siteId
      });
    } else {
      document.dispatchEvent(new CustomEvent('graph:loaded', { detail: { ...projected, _containerId: containerId } }));
    }

    const counts = projected.counts || { nodes: projected.nodes?.length || 0, edges: projected.edges?.length || 0 };
    if (typeof setStatus === 'function') setStatus(`Red ${networkId} cargada (${label}): ${counts.nodes} nodos, ${counts.edges} enlaces`);
  } catch (e) {
    console.error(e);
    if (typeof setStatus === 'function') setStatus('Error al cargar grafo: ' + (e?.message || 'desconocido'), true);
  }
}



function showContextMenu(x, y, type, id) {
  const menu = document.getElementById('context-menu');
  if (!menu) {
    console.error('Menú de contexto no encontrado');
    return;
  }
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.display = 'block';
  menu.dataset.type = type;
  menu.dataset.id = id;

  document.addEventListener('click', hideContextMenu, { once: true });
}
function hideContextMenu() {
  const menu = document.getElementById('context-menu');
  if (menu) menu.style.display = 'none';
}


document.addEventListener('node:contextmenu', function(evt) {
  const nodeData = evt.detail.node;
  if (!nodeData || !nodeData.id) {
    console.error('Datos del nodo inválidos:', nodeData);
    return;
  }
  const rect = document.body.getBoundingClientRect();
  const position = {
    x: evt.detail.clientX - rect.left,
    y: evt.detail.clientY - rect.top
  };
  showContextMenu(position.x, position.y, 'device', nodeData.id);
});
  
  document.addEventListener('edge:contextmenu', function(evt) {
    const edgeData = evt.detail.edge;
    if (!edgeData || !edgeData.id) {
      console.error('Datos del edge inválidos:', edgeData);
      return;
    }
    const rect = document.body.getBoundingClientRect();
    const position = {
      x: evt.detail.clientX - rect.left,
      y: evt.detail.clientY - rect.top
    };
    showContextMenu(position.x, position.y, 'connection', edgeData.id);
  });
  
  async function openPortSelectionModal(deviceId, portType) {
    const ports = await API.getPorts(deviceId);
    const freePorts = ports.filter(p => !p.connected);
  
    if (freePorts.length === 0) {
      alert('No hay puertos libres en este dispositivo.');
      return;
    }
  
    const isA = portType === 'A';
    const vlanInputHtml = isA ? `
        <div style="margin-top:10px;">
          <label for="port-vlan">VLAN(s) (opcional). CSV, ej: 10,20,30</label>
          <input id="port-vlan" type="text" placeholder="Ej: 10,20,30" />
        </div>` : '';
  
    const modal = document.createElement('div');
    modal.id = 'port-modal';
    modal.innerHTML = `
      <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:20px; border:1px solid #ccc; z-index:10000;">
        <h3>Seleccionar Puerto ${portType} para Dispositivo ${deviceId}</h3>
        <select id="port-select">
          ${freePorts.map(p => `<option value="${p.id}">${p.name} (${p.kind})</option>`).join('')}
        </select>
        ${vlanInputHtml}
        <div style="margin-top:12px; text-align:right;">
          <button id="port-ok" class="btn btn--primary">OK</button>
          <button id="port-cancel" class="btn">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    function parseVlanInput(txt) {
      if (!txt) return null;
      const parts = txt.split(',').map(s => s.trim()).filter(Boolean);
      const nums = parts.map(p => parseInt(p, 10)).filter(n => !Number.isNaN(n));
      if (nums.length === 0) return null;
      if (nums.some(v => v < 1 || v > 4094)) return { error: 'VLAN inválida. Rango 1..4094' };
      return nums;
    }
  
    document.getElementById('port-ok').addEventListener('click', async () => {
      const selectedPortIdStr = document.getElementById('port-select').value;
      const selectedPort = freePorts.find(p => String(p.id) === String(selectedPortIdStr));
      if (portType === 'A') {
        let vlanVal = null;
        const vlanEl = document.getElementById('port-vlan');
        if (vlanEl && vlanEl.value !== '') {
          const parsed = parseVlanInput(vlanEl.value);
          if (parsed && parsed.error) { alert(parsed.error); return; }
          vlanVal = parsed;
        }
  
        window.selectedPortA = {
          deviceId: parseInt(deviceId, 10),
          portId: parseInt(selectedPortIdStr, 10),
          portName: selectedPort?.name || null,
          vlan: vlanVal
        };
        setStatus('Puerto origen seleccionado. Selecciona dispositivo destino.', false);
      } else {
        const networkId = parseInt(new URLSearchParams(location.search).get('network_id') || '1', 10);
        const bPortId = parseInt(selectedPortIdStr, 10);
        const bPortName = selectedPort?.name || null;
  
        let vlanVal = null;
        if (window.selectedPortA && window.selectedPortA.vlan) vlanVal = window.selectedPortA.vlan;
  
        const data = {
          network_id: networkId,
          from_device_id: parseInt(window.selectedPortA.deviceId, 10),
          to_device_id: parseInt(deviceId, 10),
          a_port_id: parseInt(window.selectedPortA.portId, 10),
          b_port_id: bPortId,
          a_port_name: window.selectedPortA.portName || null,
          b_port_name: bPortName,
          link_type: 'ethernet',
          status: 'up',
          vlan: vlanVal
        };
        try {
          await API.createConnection(data);
          GRAPH_CACHE.clear();
          await loadGraphFor(getCurrentView(), getCurrentSiteId());
          window.connectMode = false;
          window.selectedPortA = null;
          setStatus('Conexión creada.', false);
        } catch (err) {
          alert('Error creando conexión: ' + err.message);
        }
      }
      document.body.removeChild(modal);
    });
    document.getElementById('port-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }

window.openPortSelectionModal = openPortSelectionModal;

})();