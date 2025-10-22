(function (global) {
    var API_BASE = (function () {
      var meta = document.querySelector('meta[name="api-base"]');
      if (meta && meta.content) return meta.content.replace(/\/$/, '');
      return location.origin.replace(/\/$/, '') + '/api';
    })();
  
    var PERSIST_KEY = 'auth_persist'; // '1' localStorage, '0' sessionStorage
    var KEYS = { access: 'accessToken', refresh: 'refreshToken', user: 'user' };
  
    function getPersist() {
      try { return localStorage.getItem(PERSIST_KEY) === '1'; } catch (e) { return true; }
    }
    function setPersist(persist) {
      try { localStorage.setItem(PERSIST_KEY, persist ? '1' : '0'); } catch (e) {}
    }
    function storage() {
      return getPersist() ? localStorage : sessionStorage;
    }
    function setTokens(accessToken, refreshToken, user, persist) {
      if (typeof persist === 'boolean') setPersist(persist);
      var s = storage();
      try {
        s.setItem(KEYS.access, accessToken || '');
        s.setItem(KEYS.refresh, refreshToken || '');
        s.setItem(KEYS.user, user ? JSON.stringify(user) : '');
      } catch (e) {}
    }
    function clearAuth() {
      try {
        localStorage.removeItem(KEYS.access);
        localStorage.removeItem(KEYS.refresh);
        localStorage.removeItem(KEYS.user);
        sessionStorage.removeItem(KEYS.access);
        sessionStorage.removeItem(KEYS.refresh);
        sessionStorage.removeItem(KEYS.user);
      } catch (e) {}
    }
    function getAccessToken() {
      return (storage().getItem(KEYS.access) || localStorage.getItem(KEYS.access) || sessionStorage.getItem(KEYS.access) || '');
    }
    function getRefreshToken() {
      return (storage().getItem(KEYS.refresh) || localStorage.getItem(KEYS.refresh) || sessionStorage.getItem(KEYS.refresh) || '');
    }
    function getUser() {
      var raw = storage().getItem(KEYS.user) || localStorage.getItem(KEYS.user) || sessionStorage.getItem(KEYS.user) || '';
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
  
    function parseJwt(token) {
      try {
        var base = token.split('.')[1];
        var json = atob(base.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeURIComponent(escape(json)));
      } catch (e) { return {}; }
    }
    function isExpired(token, leewaySec) {
      if (!token) return true;
      var leeway = typeof leewaySec === 'number' ? leewaySec : 30;
      var payload = parseJwt(token);
      var now = Math.floor(Date.now() / 1000);
      if (!payload || !payload.exp) return true;
      return (payload.exp < (now + leeway));
    }
  
    var refreshing = null;
    async function refreshAccessToken() {
      if (refreshing) return refreshing;
      refreshing = (async function () {
        try {
          var rt = getRefreshToken();
          if (!rt || isExpired(rt, 0)) return false;
          var res = await fetch(API_BASE + '/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: rt })
          });
          if (!res.ok) return false;
          var data = await res.json();
          if (!data || !data.accessToken) return false;
          // Mantener persist y user
          var user = getUser();
          var persist = getPersist();
          setTokens(data.accessToken, rt, user, persist);
          return true;
        } catch (e) {
          return false;
        } finally {
          refreshing = null;
        }
      })();
      return refreshing;
    }
  
    async function apiFetch(path, init) {
      var access = getAccessToken();
      var headers = (init && init.headers) ? new Headers(init.headers) : new Headers();
      if (access && !headers.has('Authorization')) {
        headers.set('Authorization', 'Bearer ' + access);
      }
      var opts = Object.assign({}, init, { headers: headers });
  
      var res = await fetch(API_BASE + path, opts);
      if (res.status !== 401) return res;
  
      // Si 401, intentamos refrescar y reintentar una vez
      var ok = await refreshAccessToken();
      if (!ok) return res;
  
      var newAccess = getAccessToken();
      headers.set('Authorization', 'Bearer ' + newAccess);
      opts.headers = headers;
      return fetch(API_BASE + path, opts);
    }
  
    async function requireAuthOnPage() {
      var a = getAccessToken();
      var r = getRefreshToken();
      if (a && !isExpired(a, 10)) return true;
      if (!r || isExpired(r, 0)) {
        location.replace('./login.html');
        return false;
      }
      var ok = await refreshAccessToken();
      if (!ok) {
        location.replace('./login.html');
        return false;
      }
      return true;
    }
  
    global.Auth = {
      API_BASE: API_BASE,
      setTokens: setTokens,
      clearAuth: clearAuth,
      getAccessToken: getAccessToken,
      getRefreshToken: getRefreshToken,
      getUser: getUser,
      parseJwt: parseJwt,
      isExpired: isExpired,
      apiFetch: apiFetch,
      requireAuthOnPage: requireAuthOnPage,
      setPersist: setPersist,
      getPersist: getPersist
    };
  })(window);