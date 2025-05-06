// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCartItems);
router.delete('/:id', authenticateToken, cartController.removeCartItem);
router.put('/:id', authenticateToken, cartController.updateCartItem);

module.exports = router;
