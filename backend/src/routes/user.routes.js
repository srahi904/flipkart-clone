const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { getCurrentUser, getUserById } = require('../controllers/user.controller');

const router = Router();

router.use(authMiddleware);
router.get('/me', getCurrentUser);
router.get('/:id', getUserById);

module.exports = router;
