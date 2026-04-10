const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
  placeOrder,
  getOrderById,
  getUserOrders,
  initRazorpay,
  placeOrderSchema,
} = require('../controllers/order.controller');

const router = Router();

router.use(authMiddleware);
router.get('/', getUserOrders);
router.post('/razorpay-init', initRazorpay);
router.get('/:id', getOrderById);
router.post('/', validate(placeOrderSchema), placeOrder);

module.exports = router;
