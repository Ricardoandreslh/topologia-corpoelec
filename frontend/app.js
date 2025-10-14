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