const express = require('express');
const router = express.Router();
const Devices = require('../controllers/devicesController');
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createDevice, updateDevice } = require('../validators/deviceSchemas');

// Lectura (listar/obtener) → admin y normal
router.get('/',    requireAuth, requirePermission('devices:read'), Devices.list);
router.get('/:id', requireAuth, requirePermission('devices:read'), Devices.getById);

// Escritura (crear/actualizar/borrar) → solo admin
router.post('/',      requireAuth, requirePermission('devices:write'), validate(createDevice), Devices.create);
router.put('/:id',    requireAuth, requirePermission('devices:write'), validate(updateDevice), Devices.update);
router.delete('/:id', requireAuth, requirePermission('devices:write'), Devices.remove);

module.exports = router;