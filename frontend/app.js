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