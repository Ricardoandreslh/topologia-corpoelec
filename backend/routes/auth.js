const { Router } = require('express');
const { login, me, refresh, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { loginValidator, refreshValidator } = require('../validators/authValidators');
const { errors } = require('celebrate');
const { loginLimiter } = require('../middleware/rateLimiters');

const router = Router();

router.post('/auth/login', loginLimiter, loginValidator, login);
router.get('/auth/me', requireAuth, me);
router.post('/auth/refresh', refreshValidator, refresh);
router.post('/auth/logout', requireAuth, logout);

router.use(errors());

module.exports = router;