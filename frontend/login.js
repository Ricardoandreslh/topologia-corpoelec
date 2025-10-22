(function () {
    var form = document.getElementById('login-form');
    var btn = document.getElementById('login-btn');
    var err = document.getElementById('login-error');
    var remember = document.getElementById('remember');
  
    function showError(message) {
      if (!err) return;
      err.textContent = message || 'Error de autenticación';
      err.hidden = false;
    }
    function clearError() {
      if (!err) return;
      err.textContent = '';
      err.hidden = true;
    }
  
    async function handleSubmit(e) {
      e.preventDefault();
      clearError();
  
      var u = document.getElementById('username').value.trim();
      var p = document.getElementById('password').value;
      var persist = !!remember.checked;
  
      if (!u || !p) {
        showError('Completa usuario y contraseña');
        return;
      }
  
      btn.disabled = true;
      btn.textContent = 'Ingresando...';
  
      try {
        var res = await fetch(Auth.API_BASE + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
  
        if (!res.ok) {
          var msg = 'Usuario/clave inválidos';
          if (res.status === 423) msg = 'Cuenta bloqueada por intentos fallidos. Intenta más tarde.';
          if (res.status === 429) msg = 'Demasiados intentos. Espera un momento.';
          try { var data = await res.json(); if (data && data.error) msg = data.error; } catch (_e) {}
          showError(msg);
          return;
        }
  
        var data = await res.json();
        if (!data || !data.accessToken || !data.refreshToken) {
          showError('Respuesta inválida del servidor');
          return;
        }
  
        Auth.setTokens(data.accessToken, data.refreshToken, data.user || null, persist);
        // Redirige a la app
        location.replace('./index.html');
      } catch (e) {
        showError('No se pudo conectar con el servidor');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Ingresar';
      }
    }
  
    if (form) form.addEventListener('submit', handleSubmit);
  })();