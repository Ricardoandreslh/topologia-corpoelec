# Topología CORPOELEC

Proyecto: visualizador/gestor de topología de red (WiFi / Switches) usando Node.js + MySQL (phpMyAdmin compatible) y frontend con Cytoscape.

Resumen
- Backend: Express, MySQL (mysql2), JWT para auth (access + refresh), sesiones persistidas en tabla `sessions`.
- Frontend: HTML/JS con Cytoscape para el canvas.
- Auditoría: tabla `audit_logs` para registrar operaciones críticas.
- Revocación tokens:
  - Refresh tokens: persisten en `sessions` (jti + hash) y se rotan en cada refresh.
  - Access tokens: se pueden revocar usando `blacklisted_tokens` (hash del access token). El middleware comprueba la blacklist en cada request.

Estructura principal
- backend/: código servidor (controllers, models, middleware, routes)
- frontend/: UI (HTML, JS, CSS)
- uploads/: archivos subidos (imágenes)

Cambios recientes importantes
- Se añadió persistencia y rotación de refresh tokens (sessions).
- Se implementó blacklist para access tokens (tabla `blacklisted_tokens`) y verificación en el middleware de autenticación.
- Se añadió `audit_logs` y se generan entradas en create/update/delete para sitios, dispositivos y conexiones.

Cómo ejecutar localmente
1. Clonar repo
2. Crear base de datos MySQL (ej. `topologia`) e importar `topologia.sql` (o `topologia (2).sql`) desde `./sql` o phpMyAdmin.
3. Aplicar migración adicional (audit_logs + blacklisted_tokens) — ver `docs/deploy.md` o ejecutar las sentencias SQL allí.
4. Crear archivo `.env` con la configuración de DB y JWT (ver `.env.example`).
5. Instalar dependencias:
   ```
   cd backend
   npm install
   ```
6. Arrancar servidor:
   ```
   node backend/server.js
   ```
7. Abrir `http://localhost:3000/` (si no hay token válido, serás redirigido a login).

Endpoints de interés
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/sessions
- DELETE /api/auth/sessions/:id
- GET /api/networks/:networkId/graph

Notas de seguridad
- En producción configura variables JWT secrets y usa HTTPS.
- Las entradas en `blacklisted_tokens` almacenan hash del token, no el token en texto plano.
- Para invalidar accesos inmediatamente usa logout (client debe enviar access token en Authorization header o refresh token en body).