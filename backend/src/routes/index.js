const { Router } = require('express');
const ApiResponse = require('../utils/ApiResponse');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const wishlistRoutes = require('./wishlist.routes');

const router = Router();

router.get('/health', (_req, res) => {
  res.json(
    new ApiResponse(200, {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }),
  );
});

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;
