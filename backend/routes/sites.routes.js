const express = require('express');
const router = express.Router();
const Sites = require('../controllers/sitesController');
const { requireAuth, requirePermission } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createSite: createSiteSchema, updateSite: updateSiteSchema } = require('../validators/sitesSchemas');

// Lectura
router.get('/:id/summary', requireAuth, requirePermission('devices:read'), Sites.summary);
router.get('/', requireAuth, requirePermission('devices:read'), Sites.list);
router.get('/:id', requireAuth, requirePermission('devices:read'), Sites.getById);

// Escritura (solo admin)
router.post('/', requireAuth, requirePermission('devices:write'), validate(createSiteSchema), Sites.create);
router.put('/:id', requireAuth, requirePermission('devices:write'), validate(updateSiteSchema), Sites.update);
router.delete('/:id', requireAuth, requirePermission('devices:write'), Sites.remove);

module.exports = router;