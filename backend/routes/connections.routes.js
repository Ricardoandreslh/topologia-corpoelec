const express = require('express');
const router = express.Router();
const Connections = require('../controllers/connectionsController');
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');

// Lectura → admin y normal
router.get('/',    requireAuth, requirePermission('connections:read'), Connections.list);
router.get('/:id', requireAuth, requirePermission('connections:read'), Connections.getById);

// Escritura → solo admin
router.post('/',      requireAuth, requirePermission('connections:write'), Connections.create);
router.put('/:id',    requireAuth, requirePermission('connections:write'), Connections.update);
router.delete('/:id', requireAuth, requirePermission('connections:write'), Connections.remove);

module.exports = router;