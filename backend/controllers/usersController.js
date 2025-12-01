const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const Sessions = require('../models/refreshTokens');
const Audit = require('../models/auditLogs');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

async function changePassword(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const newPassword = body.password;
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'password requerido (mínimo 6 caracteres)' });
    }

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await Users.setPasswordHash(id, hash);

    try {
      await Sessions.deleteSessionsByUser(id);
    } catch (e) {
      console.warn('Error borrando sesiones tras cambio de contraseña:', e);
    }

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'password_change',
        resource_type: 'user',
        resource_id: Number(id),
        payload: { by: req.user ? req.user.id : null }
      });
    } catch (e) {
      console.warn('Audit log failed (password_change):', e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('users.changePassword error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function setStatus(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const status = body.status;
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ error: 'status inválido. Valores: active|disabled' });
    }

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await Users.setStatus(id, status);

    try {
      await Sessions.deleteSessionsByUser(id);
    } catch (e) {
      console.warn('Error borrando sesiones tras setStatus:', e);
    }

    try {
      await Audit.createAudit({
        user_id: req.user ? req.user.id : null,
        action: 'status_update',
        resource_type: 'user',
        resource_id: Number(id),
        payload: { status }
      });
    } catch (e) {
      console.warn('Audit log failed (status_update):', e);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('users.setStatus error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { changePassword, setStatus };