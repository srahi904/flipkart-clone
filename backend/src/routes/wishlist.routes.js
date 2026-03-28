const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addWishlistSchema,
} = require('../controllers/wishlist.controller');

const router = Router();

router.use(authMiddleware);
router.get('/', getWishlist);
router.post('/', validate(addWishlistSchema), addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
