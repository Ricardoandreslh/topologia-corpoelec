const express = require('express');
const router = express.Router();
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');
const Graph = require('../controllers/graphController');

router.get('/:networkId/graph',
  requireAuth,
  //Ambos roles (admin/normal) tienen lectura.
  requirePermission('devices:read', 'connections:read'),
  Graph.getGraphByNetwork
);

module.exports = router;