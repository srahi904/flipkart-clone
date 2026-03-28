const { Router } = require('express');
const { getAllProducts, getProductById } = require('../controllers/product.controller');

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
