// profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController'); // No changes needed here
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, profileController.getProfile);

module.exports = router;
