const express = require('express');
const router = express.Router();
const { changePassword, setStatus } = require('../controllers/usersController');
const { requireAuth, requireRole, requireSelfOrRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const Joi = require('joi');

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

router.put(
  '/:id/password',
  requireAuth,
  requireSelfOrRole((req) => req.params.id, 'admin'),
  validate(passwordSchema),
  changePassword
);

const statusSchema = Joi.object({
  status: Joi.string().valid('active', 'disabled').required()
});
router.patch('/:id/status', requireAuth, requireRole('admin'), validate(statusSchema), setStatus);

module.exports = router;