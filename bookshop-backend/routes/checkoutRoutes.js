const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkoutController');

// User routes
router.post('/', authenticateToken, checkoutController.createCheckout);
router.get('/orders', authenticateToken, checkoutController.getOrders);
router.get('/invoices/:orderId', authenticateToken, checkoutController.getInvoice);

// Admin route (assumes admin middleware exists)
router.post('/settings', authenticateToken, checkoutController.toggleCheckout);

module.exports = router;