(function (global) {
  const WIFI_TYPES = new Set(['ap','wifi','router','gateway','controller','repeater','access_point','ap_wifi','wireless_ap']);
  const SWITCH_TYPES = new Set(['switch','core_switch','distribution_switch','access_switch','layer2_switch','layer3_switch']);

  const instances = new Map();

  function nodeCategory(type) {
    const t = String(type || '').toLowerCase().trim();
    if (WIFI_TYPES.has(t)) return 'wifi';
    if (SWITCH_TYPES.has(t)) return 'switch';
    return 'other';
  }

  function hasNum(n){ return Number.isFinite(n); }

  function zoomIn(containerId, factor = 1.2) {
    const cy = instances.get(containerId);
    if (cy) {
      cy.zoom({
        level: cy.zoom() * factor,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    }
  }

  function zoomOut(containerId, factor = 1.2) {
    const cy = instances.get(containerId);
    if (cy) {
      cy.zoom({
        level: cy.zoom() / factor,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    }
  }

  function fitView(containerId, padding = 60) {
    const cy = instances.get(containerId);
    if (cy) {
      const elements = cy.elements();
      
      if (elements.length === 0) return;
      
      cy.animate({
        fit: {
          eles: elements,
          padding: padding
        },
        duration: 600
      });
    }
  }

  function toggleBackground(containerId) {
    const cy = instances.get(containerId);
    if (cy) {
      const container = cy.container();
      const currentBg = container.style.backgroundColor;
      
      if (!currentBg || currentBg === 'white' || currentBg === 'rgb(255, 255, 255)' || currentBg === '') {
        container.style.backgroundColor = '#111522';
      } else {
        container.style.backgroundColor = 'white';
      }
    }
  }

  function searchNodes(containerId, query) {
    const cy = instances.get(containerId);
    if (!cy) return;
  
    cy.elements().removeClass('highlighted-search');
    
    if (!query.trim()) {
      return;
    }
  
    const searchTerm = query.toLowerCase().trim();
    const matchingNodes = cy.nodes().filter(node => {
      const data = node.data();
      const searchableText = [
        data.label,
        data.ip,
        data.mac,
        data.type
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  
    matchingNodes.addClass('highlighted-search');
    
    if (matchingNodes.length > 0) {
      cy.animate({
        fit: {
          eles: matchingNodes,
          padding: 80
        },
        duration: 600
      });
    }
  }

  function getEnhancedStyles(theme) {
    const base = baseStyle(theme);
    base.push(
      {
        selector: 'node.highlighted-search',
        style: {
          'border-width': 4,
          'border-color': '#e74c3c',
          'background-color': '#e67e22',
          'width': 50,
          'height': 50
        }
      }
    );
    return base;
  }

  function mapElements(graph) {
    const nodeVlanMap = {}; // nodeId -> Set(vlan)
    const vlanGroups = new Set();
  
    (graph.edges || []).forEach(e => {
      let ev = e.vlan;
      let arr = null;
      if (Array.isArray(ev)) arr = ev.map(x => String(x));
      else if (ev !== undefined && ev !== null) arr = [String(ev)];
      if (arr && arr.length) {
        arr.forEach(v => vlanGroups.add(v));
        nodeVlanMap[e.source] = nodeVlanMap[e.source] || new Set();
        arr.forEach(v => nodeVlanMap[e.source].add(v));
        nodeVlanMap[e.target] = nodeVlanMap[e.target] || new Set();
        arr.forEach(v => nodeVlanMap[e.target].add(v));
      }
    });
  
    // Crear nodos-compuesto para cada VLAN
    const vlanNodes = Array.from(vlanGroups).map(v => ({
      group: 'nodes',
      data: {
        id: `vlan-group-${v}`,
        label: `VLAN ${v}`,
        type: 'vlan-group',
        isVlanGroup: 'true',
        network_id: graph.network_id,
        vlanId: v
      }
    }));
  
    // Mapear dispositivos (y asignar parent si tienen al menos una VLAN - la primera)
    const nodes = (graph.nodes || []).map(n => {
      let meta = {};
      if (n.metadata) {
        try {
          meta = typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata;
        } catch (e) {
          console.warn('Error parsing metadata for node', n.id, e);
        }
      }
      const p = meta.pos || meta.position || (hasNum(n.x) && hasNum(n.y) ? { x: n.x, y: n.y } : null);
      const portsArr = Array.isArray(n.ports) ? n.ports : [];
      const derivedSummary = {
        total: portsArr.length,
        used: portsArr.filter(p => p.connected === true).length
      };
      const finalSummary = n.ports_summary || (portsArr.length ? derivedSummary : { total: 0, used: 0 });
  
      // elegir primera VLAN si hay varias
      const vlansForNode = Array.from((nodeVlanMap[n.id] && nodeVlanMap[n.id].size) ? nodeVlanMap[n.id] : []);
      const parent = vlansForNode.length ? `vlan-group-${vlansForNode[0]}` : undefined;
  
      return {
        group: 'nodes',
        data: {
          id: String(n.id),
          label: n.label || String(n.id),
          type: n.type || 'device',
          category: nodeCategory(n.type),
          ip: n.ip || '',
          mac: n.mac || '',
          network_id: n.network_id,
          image_id: n.image_id || null,
          ports: portsArr.length ? portsArr : undefined,
          ports_summary: finalSummary,
          site_path: n.site_path || null,
          site_id: n.site_id || null,
          ghost: n.ghost ? 'true' : 'false',
          invisible: n.invisible ? 'true' : 'false',
          parent: parent, // si undefined, no se setea
          // indicador para saber si ya tenía pos guardada
          _hasPos: !!p
        },
        position: p && hasNum(p.x) && hasNum(p.y) ? { x: Number(p.x), y: Number(p.y) } : undefined
      };
    });
  
    // Helper para label de VLAN(s)
    function vlanLabelFrom(eVlan) {
      if (!eVlan && eVlan !== 0) return '';
      if (Array.isArray(eVlan)) return eVlan.join(', ');
      return String(eVlan);
    }
  
    // Mapear edges incluyendo vlan en data y mostrandola en el label
    const edges = (graph.edges || []).map(e => {
      const arr = Array.isArray(e.vlan) ? e.vlan.map(v => String(v)) : (e.vlan !== undefined && e.vlan !== null ? [String(e.vlan)] : []);
      const vlanStr = arr.length ? arr.join(',') : null;
      const vlanKey = arr.length ? arr[0] : null; // primera vlan para color / grouping
      const vlanLabel = vlanStr ? ` • VLAN ${vlanStr}` : '';
      return {
        group: 'edges',
        data: {
          id: String(e.id || (e.source + '->' + e.target)),
          source: String(e.source),
          target: String(e.target),
          label: ((e.type || '') + vlanLabel).trim(),
          link_type: e.type || '',
          status: e.status || '',
          network_id: e.network_id,
          cross: e.cross === true ? 'true' : 'false',
          vlan: arr.length ? arr : null,
          vlanStr: vlanStr,
          vlanKey: vlanKey
        }
      };
    });
  
    // devolver: primero los vlanNodes (padres), luego dispositivos y edges
    return { nodes: [...vlanNodes, ...nodes], edges };
  }

  function baseStyle(theme = 'light') {
    const isDark = theme === 'dark';
    return [
      { selector: 'node',
        style: {
          'width': 36, 'height': 36, 'shape': 'ellipse',
          'background-color': '#bdc3c7', 'border-width': 2, 'border-color': '#95a5a6',
          'label': 'data(label)', 'font-size': 10, 'font-weight': 600, 'color': isDark ? '#ffffff' : '#2c3e50',
          'text-wrap': 'wrap', 'text-max-width': 100, 'text-valign': 'bottom', 'text-halign': 'center', 'text-margin-y': 8,
        }
      },
      { selector: 'node[category = "wifi"]',
        style: { 'shape': 'hexagon', 'background-color': '#3498db', 'border-color': '#2980b9' }
      },
      { selector: 'node[category = "switch"]',
        style: { 'shape': 'round-rectangle', 'background-color': '#2ecc71', 'border-color': '#27ae60' }
      },
      { selector: 'node[isVlanGroup = "true"]',
      style: {
        'shape': 'round-rectangle',
        'background-color': '#8e44ad',       // color distintivo para grupo VLAN
        'background-opacity': 0.08,
        'border-color': '#8e44ad',
        'border-style': 'dashed',
        'border-width': 1,
        'label': 'data(label)',
        'font-size': 12,
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': 8,
        'padding': 12,
        'width': 'label',
        'height': 'label'
      }
    },
    // además, para distinguir mejor las edges con VLAN, podrías añadir:
    { selector: 'edge[label]',
      style: {
        'label': 'data(label)',
        'font-size': 10,
        'text-margin-y': -8
      }
    },
      { selector: 'node[type = "router"]',
        style: { 'shape': 'diamond', 'background-color': '#e67e22', 'border-color': '#d35400' }
      },
      { selector: 'node:selected', style: { 'border-color': '#e74c3c', 'border-width': 3 } },
      { selector: 'node:hover',    style: { 'cursor': 'pointer' } },
      {
        selector: 'edge',
        style: {
          'width': 2,
          // color dinámico según vlanKey (usar primer VLAN si existe)
          'line-color': (ele) => {
            try {
              const key = ele.data && ele.data('vlanKey');
              if (!key) return (theme === 'dark' ? '#bdc3c7' : '#95a5a6');
              const vid = Number(key);
              if (Number.isNaN(vid)) return (theme === 'dark' ? '#bdc3c7' : '#95a5a6');
              // función simple de color: mapa por hue
              const hue = (vid * 37) % 360; // 37 es constante para mezclar bien
              return `hsl(${hue}, 70%, ${theme === 'dark' ? '70%' : '40%'})`;
            } catch (e) { return (theme === 'dark' ? '#bdc3c7' : '#95a5a6'); }
          },
          'curve-style': 'bezier', 'target-arrow-shape': 'none',
          'label': 'data(label)', 'font-size': 8, 'text-rotation': 'autorotate', 'color': theme === 'dark' ? '#ffffff' : '#34495e',
          'text-margin-y': -5
        }
      },
      { selector: 'node[invisible = "true"]',
      style: {'opacity': 0, 
              'width': 0, 
              'height': 0 
    }},

      { selector: 'node[image_id]',
        style: {
          'background-image': (ele) => `/api/images/${ele.data('image_id')}`,
          'background-fit': 'cover',
          'background-clip': 'node',
          'shape': 'rectangle', 
          'width': 40, 'height': 40
        }
      }, 
      { selector: 'node[ghost = "true"]',
        style: { 
          'opacity': 0.35,
          'border-style': 'dashed',
          'border-color': '#7f8c8d',
          'background-color': '#95a5a6'
        }
      }, 
      { selector: 'edge[cross = "true"]',
        style: {
          'line-style': 'dashed',
          'opacity': 0.55
        }
      }, 
      { selector: 'edge:selected', 
        style: { 
          'line-color': '#3498db', 
          'width': 3 
        } }
    ];
  }

  function hasPreset(elements) {
    return (elements.nodes || []).some(n => n.position && hasNum(n.position.x) && hasNum(n.position.y));
  }

  function layoutFor(elements, viewType = 'all') {
    if (hasPreset(elements)) return { name: 'preset', fit: false, padding: 30 };
    
    const nodeCount = elements.nodes ? elements.nodes.length : 0;

    // Para redes de switches
    if (viewType === 'switches') {
      return {
        name: 'breadthfirst',
        animate: 'end',
        animationDuration: 1000,
        fit: true,
        padding: 60,
        directed: true,
        circle: false,
        spacingFactor: 1.1,
        avoidOverlap: true
      };
    }
    
    // Para redes WiFi
    if (viewType === 'wifi') {
      return {
        name: 'breadthfirst',
        animate: 'end',
        animationDuration: 1200,
        fit: true,
        padding: 60,
        nodeRepulsion: 6000,
        idealEdgeLength: 120,
        edgeElasticity: 0.3,
        nestingFactor: 0.2,
        gravity: 0.1,
        numIter: 3000
      };
    }
    
    return {
      name: 'breadthfirst',
      animate: 'end',
      animationDuration: 1000,
      fit: true,
      padding: 60,
      nodeRepulsion: 4500,
      idealEdgeLength: 100,
      edgeElasticity: 0.45,
      nestingFactor: 0.1,
      gravity: 0.25,
      numIter: 2500
    };
  }

  function ensure(containerId) {
    const el = document.getElementById(containerId);
    if (!el) { console.warn('Canvas: no existe #' + containerId); return null; }
    
    let cy = instances.get(containerId);
    if (cy && cy.destroyed()) { cy = null; instances.delete(containerId); }
    
    if (!cy) {
      const theme = document.documentElement.dataset.theme || 'light'; 
      cy = cytoscape({
        container: el,
        style: getEnhancedStyles(theme),  
        wheelSensitivity: 0.2,
        boxSelectionEnabled: true,
        selectionType: 'single',
        pixelRatio: 1,
        minZoom: 0.1,
        maxZoom: 5,
        userPanningEnabled: true,
        userZoomingEnabled: true,
        panningEnabled: true,
        zoomingEnabled: true
      });

      cy.on('grab', 'node', function(evt) {
        evt.target.trigger('grabon');
      });
  
      cy.on('free', 'node', function(evt) {
        evt.target.trigger('graboff');
      });
  
      const onResize = () => { 
        try { 
          cy.resize(); 
          cy.fit(cy.elements(), 40); 
        } catch (_) {} 
      };
      const debounced = debounce(onResize, 120);
      window.addEventListener('resize', debounced);

      try { cy.scratch('_cleanup', { debounced }); } catch (_) {}
  
      cy.on('tap', 'node', ev => {
        const d = ev.target.data();
        //console.log('Nodo clickeado:', d);
        if (window.connectMode) {
          const summary = d.ports_summary || { total: 0, used: 0 };
          const free = summary.total - summary.used;
          if (free > 0) {
            if (!window.selectedPortA) {
              window.openPortSelectionModal(d.id, 'A');
            } else {
              window.openPortSelectionModal(d.id, 'B');
            }
          } else {
            alert('Este dispositivo no tiene puertos libres.');
          }
          return;
        }
      });      

      cy.on('cxttap', 'node', ev => {
        ev.originalEvent.preventDefault();
        document.dispatchEvent(new CustomEvent('node:contextmenu', { 
          detail: { 
            node: ev.target.data(), 
            clientX: ev.originalEvent.clientX, 
            clientY: ev.originalEvent.clientY 
          } 
        }));
      });
      
      cy.on('cxttap', 'edge', ev => {
        ev.originalEvent.preventDefault();
        document.dispatchEvent(new CustomEvent('edge:contextmenu', { 
          detail: { 
            edge: ev.target.data(), 
            clientX: ev.originalEvent.clientX, 
            clientY: ev.originalEvent.clientY 
          } 
        }));
      });    

      cy.on('dbltap', 'node', ev => {
        cy.animate({
          center: { eles: ev.target },
          duration: 400
        });
      });

      cy.on('dragfree', 'node', function(evt) {
        const node = evt.target;
        const id = node.id();
        const position = node.position();
        const siteId = cy.scratch('_graphMeta')?.siteId; 
        const posKey = siteId ? `pos_site_${siteId}` : 'pos'; 
        API.updateDevice(id, { metadata: { [posKey]: { x: position.x, y: position.y } } })
          .then(() => {
            console.log(`Posición guardada para nodo ${id} en sede ${siteId || 'general'}: (${position.x}, ${position.y})`);
          })
          .catch(err => {
            console.error('Error guardando posición:', err);
          });
      });

      wireTooltips(cy);
      instances.set(containerId, cy);
    }
    return cy;
  }

  function updateTheme(containerId, theme) {
    const cy = instances.get(containerId);
    if (cy) {
      const newStyle = getEnhancedStyles(theme);
      cy.style(newStyle); 
    }
  }

  function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(null,a), wait); }; }

  function wireTooltips(cy) {
    cy.on('mouseover', 'node', (ev) => {
      const node = ev.target;
      if (node.data('ghost') === 'true' || node.data('invisible') === 'true') return; 
      const tooltip = portsSummary(node);
      showTooltip(tooltip, ev.originalEvent.clientX, ev.originalEvent.clientY);
    });
    cy.on('mouseout', 'node', () => hideTooltip());
  }

  function portsSummary(node) {
    const d = node.data() || {};
    const ports = d.ports || [];
    let summary = d.ports_summary || { total: ports.length, used: ports.filter(p => p.connected === true).length };
    const free = (summary.total || 0) - (summary.used || 0);
  
    // Buscar VLANs en los edges conectados a este nodo (extraer valores únicos)
    const connectedEdges = node.connectedEdges ? node.connectedEdges() : [];
    const vlans = new Set();
    if (connectedEdges && connectedEdges.length) {
      connectedEdges.forEach(e => {
        try {
          const ve = e.data && e.data('vlan');
          if (ve !== undefined && ve !== null && String(ve) !== 'null' && String(ve) !== '') vlans.add(String(ve));
        } catch (_) {}
      });
    }
  
    let lines = [`${d.label || d.name || node.id()}`];
    if (d.site_path) lines.push(`Sede: ${d.site_path}`);
    else lines.push('Sin sede');
  
    lines.push(`Puertos: ${summary.total} total • ${summary.used || 0} usados • ${free} libres`);
    if (vlans.size) lines.push(`VLANs: ${Array.from(vlans).join(', ')}`);
  
    if (ports && ports.length) {
      const topPorts = ports.slice(0, 10).map(p => {
        const used = (p.connected === true) ? 'usado' : 'libre';
        const kind = p.kind?.replace(/-/g, ' ') || '';
        return `• ${p.name} (${kind}) — ${used}`;
      });
      lines = lines.concat(topPorts);
      if (ports.length > 10) lines.push(`… +${ports.length - 10} más`);
    }
    return lines.join('\n');
  }
  
  
  
  function showTooltip(text, x, y) {
    let tip = document.getElementById('tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'tooltip';
      tip.style.position = 'fixed';
      tip.style.zIndex = '9999';
      tip.style.padding = '8px 12px';
      tip.style.background = 'rgba(0,0,0,0.8)';
      tip.style.color = '#fff';
      tip.style.borderRadius = '4px';
      tip.style.fontSize = '12px';
      tip.style.pointerEvents = 'none';
      tip.style.whiteSpace = 'pre-line';
      document.body.appendChild(tip);
    }
    tip.textContent = text;
    tip.style.left = (x + 10) + 'px';
    tip.style.top = (y + 10) + 'px';
    tip.style.display = 'block';
  }
  
  function hideTooltip() {
    const tip = document.getElementById('tooltip');
    if (tip) tip.remove();
  }

  function computeConvexHull(points) {
    // points: array de {x,y}
    if (!points || points.length <= 2) return points.slice();
    const pts = points.slice().sort((a,b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
    const lower = [];
    for (let p of pts) {
      while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop();
      upper.push(p);
    }
    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }
  
  // --- UTIL: punto dentro de polígono (ray-casting) ---
  function pointInPolygon(pt, poly) {
    if (!poly || poly.length < 3) return false;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y;
      const xj = poly[j].x, yj = poly[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi + 0.0000001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
  
  // --- Dibuja overlays SVG de VLANs dentro del contenedor del canvas ---
  function drawVlanHulls(cy) {
    try {
      // limpiar overlay previo
      const container = cy.container();
      let overlay = container.querySelector('.vlan-hull-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'vlan-hull-overlay';
        overlay.style.position = 'absolute';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = 1; // detrás de nodos (cy canvas es z-index: auto)
        container.appendChild(overlay);
      }
      // crear SVG
      overlay.innerHTML = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"></svg>`;
      const svg = overlay.querySelector('svg');
  
      // Agrupar nodos por VLAN (leer edges)
      const edges = cy.edges().toArray();
      const vlanMap = new Map(); // vlanId -> Set(nodeIds)
      edges.forEach(e => {
        const ev = e.data('vlan');
        if (!ev) return;
        const arr = Array.isArray(ev) ? ev : [ev];
        arr.forEach(v => {
          try {
            const key = String(v);
            if (!vlanMap.has(key)) vlanMap.set(key, new Set());
            vlanMap.get(key).add(String(e.data('source')));
            vlanMap.get(key).add(String(e.data('target')));
          } catch (err) {}
        });
      });
  
      // Por cada VLAN, calcular hull y dibujar
      let idx = 0;
      for (const [vlanId, nodeSet] of vlanMap.entries()) {
        const pts = [];
        nodeSet.forEach(id => {
          const node = cy.getElementById(String(id));
          if (node && node.isNode()) {
            const p = node.renderedPosition ? node.renderedPosition() : node.position();
            pts.push({ x: p.x, y: p.y });
          }
        });
        if (pts.length < 2) continue;
        const hull = computeConvexHull(pts);
        if (!hull || hull.length < 3) {
          // dibujar rectángulo mínimo alrededor si solo 2 puntos
          const xs = pts.map(p => p.x); const ys = pts.map(p => p.y);
          const minx = Math.min(...xs) - 24, miny = Math.min(...ys) - 24, maxx = Math.max(...xs) + 24, maxy = Math.max(...ys) + 24;
          const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
          const hue = (Number(vlanId) * 37) % 360;
          rect.setAttribute('x', minx);
          rect.setAttribute('y', miny);
          rect.setAttribute('width', Math.max(40, maxx - minx));
          rect.setAttribute('height', Math.max(40, maxy - miny));
          rect.setAttribute('rx', 12);
          rect.setAttribute('ry', 12);
          rect.setAttribute('fill', `hsla(${hue},70%,55%,0.06)`);
          rect.setAttribute('stroke', `hsla(${hue},70%,45%,0.9)`);
          rect.setAttribute('stroke-dasharray', '6,6');
          rect.setAttribute('stroke-width', '1');
          svg.appendChild(rect);
        } else {
          const path = hull.map(p => `${p.x},${p.y}`).join(' ');
          const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
          const hue = (Number(vlanId) * 37) % 360;
          poly.setAttribute('points', path);
          poly.setAttribute('fill', `hsla(${hue},70%,55%,0.06)`);
          poly.setAttribute('stroke', `hsla(${hue},70%,45%,0.9)`);
          poly.setAttribute('stroke-dasharray', '6,6');
          poly.setAttribute('stroke-width', '1');
          svg.appendChild(poly);
        }
  
        // Etiqueta VLAN (top-left de hull bounding box)
        const xs2 = pts.map(p => p.x); const ys2 = pts.map(p => p.y);
        const minx2 = Math.min(...xs2); const miny2 = Math.min(...ys2);
        const labelG = document.createElementNS('http://www.w3.org/2000/svg','g');
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg','rect');
        const labelText = document.createElementNS('http://www.w3.org/2000/svg','text');
        labelText.textContent = `VLAN ${vlanId}`;
        labelText.setAttribute('x', minx2 + 8);
        labelText.setAttribute('y', miny2 - 8);
        labelText.setAttribute('fill', '#222');
        labelText.setAttribute('font-size', '12');
        labelText.setAttribute('font-weight', '600');
        labelText.setAttribute('text-anchor', 'start');
        const bboxX = minx2 + 4, bboxY = miny2 - 24;
        labelBg.setAttribute('x', bboxX);
        labelBg.setAttribute('y', bboxY);
        labelBg.setAttribute('width', Math.max(50, 8 * String(vlanId).length + 30));
        labelBg.setAttribute('height', 20);
        labelBg.setAttribute('rx', 8);
        labelBg.setAttribute('fill', 'white');
        labelBg.setAttribute('fill-opacity', '0.88');
        labelBg.setAttribute('stroke', '#ddd');
        labelBg.setAttribute('stroke-width', '1');
        labelG.appendChild(labelBg);
        labelG.appendChild(labelText);
        svg.appendChild(labelG);
        idx++;
      }
    } catch (err) {
      console.warn('drawVlanHulls error', err);
    }
  }
  
  // --- Aplazar nodos que queden dentro de hulls pero no pertenecen a la VLAN ---
  function separateIntrudingNodes(cy) {
    try {
      const edges = cy.edges().toArray();
      const vlanMap = new Map(); // vlanId -> Set(nodeIds)
      edges.forEach(e => {
        const ev = e.data('vlan');
        if (!ev) return;
        const arr = Array.isArray(ev) ? ev : [ev];
        arr.forEach(v => {
          const key = String(v);
          if (!vlanMap.has(key)) vlanMap.set(key, new Set());
          vlanMap.get(key).add(String(e.data('source')));
          vlanMap.get(key).add(String(e.data('target')));
        });
      });
  
      // Para cada vlan: construir hull y para cada nodo no perteneciente, si está dentro => empujar hacia afuera
      for (const [vlanId, nodeSet] of vlanMap.entries()) {
        const pts = [];
        nodeSet.forEach(id => {
          const node = cy.getElementById(String(id));
          if (node && node.isNode()) { const p = node.renderedPosition ? node.renderedPosition() : node.position(); pts.push({ x: p.x, y: p.y }); }
        });
        if (pts.length < 3) continue;
        const hull = computeConvexHull(pts);
        if (!hull || hull.length < 3) continue;
  
        // centroid approx
        const centroid = hull.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        centroid.x /= hull.length; centroid.y /= hull.length;
  
        // verificar nodos que no pertenecen al set
        cy.nodes().forEach(n => {
          const nid = String(n.id());
          if (nodeSet.has(nid)) return; // pertenece
          const pos = n.renderedPosition ? n.renderedPosition() : n.position();
          if (pointInPolygon({ x: pos.x, y: pos.y }, hull)) {
            // vector desde centroid al nodo, mover fuerawards
            const vx = pos.x - centroid.x;
            const vy = pos.y - centroid.y;
            const mag = Math.sqrt(vx*vx + vy*vy) || 0.0001;
            const normX = vx / mag; const normY = vy / mag;
            const step = 36; // pixels a empujar (ajustable)
            const newX = pos.x + normX * step;
            const newY = pos.y + normY * step;
            // aplicar nueva posición (rendered)
            try {
              n.position({ x: newX, y: newY });
            } catch (e) {
              // fallback: use scratch + animate if needed
              console.warn('Error moviendo nodo', nid, e);
            }
          }
        });
      }
    } catch (err) {
      console.warn('separateIntrudingNodes error', err);
    }
  }

  function renderGraph(graph, opts = {}) {  
    const containerId = opts.containerId || 'canvas';
    const viewType = opts.viewType || 'all';
    const cy = ensure(containerId);
    if (!cy) return;
  
    const elements = mapElements(graph);
    cy.stop();
    cy.elements().remove();
    cy.add(elements.nodes);
    cy.add(elements.edges);
  
    const layout = layoutFor(elements, viewType);
    const layoutInstance = cy.layout(layout);
    
    const nodesWithoutPos = [];
    elements.nodes.forEach(n => {
      if (n.data && !n.data._hasPos && n.data.type !== 'vlan-group') {
        nodesWithoutPos.push(String(n.data.id));
      }
    });

    layoutInstance.run();

    const onLayoutStop = async () => {
      try {
        // persistir posiciones
        const siteId = opts.siteId;
        const posKey = siteId ? `pos_site_${siteId}` : 'pos';
        for (const nid of nodesWithoutPos) {
          try {
            const node = cy.getElementById(nid);
            if (!node || !node.isNode()) continue;
            const pos = node.position();
            const payload = { metadata: { [posKey]: { x: pos.x, y: pos.y } } };
            // no await en serie para no bloquear demasiado pero manejar errores
            API.updateDevice(nid, payload).catch(e => console.warn('Error guardando posición nodo', nid, e));
            node.data('_hasPos', true);
          } catch (err) {
            console.warn('persist position error', err);
          }
        }

        // Separar nodos intrusos entre VLANs y redibujar hull overlays
        separateIntrudingNodes(cy);
        // pequeña espera para que posiciones aplicadas tomen efecto en el canvas render
        setTimeout(() => {
          drawVlanHulls(cy);
        }, 80);

      } catch (err) {
        console.warn('layoutstop handler error', err);
      }
    };

    if (typeof layoutInstance.promiseOn === 'function') {
      layoutInstance.promiseOn('layoutstop').then(onLayoutStop).catch(() => {});
    } else {
      cy.one('layoutstop', onLayoutStop);
    }

    // al final seguir con el ajuste de zoom/fit como antes
    setTimeout(() => {
      cy.fit(cy.elements(), 60);
      if (cy.zoom() > 2) cy.zoom(2);
      if (cy.zoom() < 0.5) cy.zoom(0.5);
    }, 100);

  
    cy.scratch('_graphMeta', { 
      network_id: graph.network_id, 
      kind: graph.kind || 'all',
      viewType: viewType,
      siteId: opts.siteId 
    });
  }

  function fit(containerId, padding = 40) {
    const cy = instances.get(containerId);
    if (cy) cy.fit(cy.elements(), padding);
  }

  function destroy(containerId) {
    const cy = instances.get(containerId);
    if (!cy) return;
    try {
      const c = cy.scratch('_cleanup');
      if (c?.debounced) window.removeEventListener('resize', c.debounced);
    } catch (_) {}
    cy.destroy();
    instances.delete(containerId);
  }

  global.Canvas = { 
    renderGraph, 
    fit, 
    destroy, 
    zoomIn, 
    zoomOut, 
    fitView, 
    toggleBackground, 
    searchNodes,
    updateTheme,
    nodeCategory 
  };
})(window);