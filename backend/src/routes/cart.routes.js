const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  addToCartSchema,
  updateCartItemSchema,
} = require('../controllers/cart.controller');

const router = Router();

router.use(authMiddleware);
router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addToCart);
router.put('/items/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);

module.exports = router;
