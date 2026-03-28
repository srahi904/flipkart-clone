const { Router } = require('express');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth.middleware');
const {
  register,
  login,
  getAuthUser,
  registerSchema,
  loginSchema,
} = require('../controllers/auth.controller');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authMiddleware, getAuthUser);

module.exports = router;
