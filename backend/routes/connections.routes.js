const express = require('express');
const router = express.Router();
const Connections = require('../controllers/connectionsController');
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createConnection, updateConnection } = require('../validators/connectionSchemas');

// Lectura
router.get('/', requireAuth, requirePermission('connections:read'), Connections.list);
router.get('/:id', requireAuth, requirePermission('connections:read'), Connections.getById);

// Escritura
router.post('/', requireAuth, requirePermission('connections:write'), validate(createConnection), Connections.create);
router.put('/:id', requireAuth, requirePermission('connections:write'), validate(updateConnection), Connections.update);
router.delete('/:id', requireAuth, requirePermission('connections:write'), Connections.remove);

module.exports = router;