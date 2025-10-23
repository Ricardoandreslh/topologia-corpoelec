(function (global) {
  function currentView() {
    const rWifi = document.getElementById('tab-wifi');
    return rWifi && rWifi.checked ? 'wifi' : 'switches';
  }

  function containerFor(kind) {
    const k = kind || currentView();
    return document.getElementById(k === 'wifi' ? 'canvas-wifi' : 'canvas-switches');
  }

  function clear(el) { if (!el) return; while (el.firstChild) el.removeChild(el.firstChild); }

  function renderGraph(graph) {
    const mount = containerFor(graph.kind);
    if (!mount) return console.warn('No hay contenedor de canvas para', graph.kind);
    clear(mount);

    // Render mínimo: resumen y listas
    const summary = document.createElement('div');
    summary.style.marginBottom = '8px';
    summary.textContent = `Vista: ${graph.kind || currentView()} • Nodos: ${graph.counts.nodes} • Enlaces: ${graph.counts.edges}`;
    mount.appendChild(summary);

    const nodesTitle = document.createElement('h4');
    nodesTitle.textContent = 'Nodos';
    mount.appendChild(nodesTitle);

    const ulN = document.createElement('ul');
    graph.nodes.forEach(n => {
      const li = document.createElement('li');
      li.textContent = `${n.id} • ${n.label} [${n.type}] ${n.ip || ''}`;
      ulN.appendChild(li);
    });
    mount.appendChild(ulN);

    const edgesTitle = document.createElement('h4');
    edgesTitle.textContent = 'Enlaces';
    mount.appendChild(edgesTitle);

    const ulE = document.createElement('ul');
    graph.edges.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `${e.id} • ${e.source} → ${e.target} (${e.type || 'link'})`;
      ulE.appendChild(li);
    });
    mount.appendChild(ulE);
  }

  global.Canvas = { renderGraph };

  // Si app.js emite el evento en lugar de llamar directo
  document.addEventListener('graph:loaded', (ev) => {
    if (ev?.detail) renderGraph(ev.detail);
  });

  // Si cambias de tab sin recargar grafo, OPTIONAL: emitir re-render con último dato cacheado
  // Puedes guardar el último 'graph' y re-renderizar aquí si lo deseas.
})(window);