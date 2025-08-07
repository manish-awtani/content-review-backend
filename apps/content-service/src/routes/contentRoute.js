const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected route - Only logged in users can upload content
router.post('/upload', authenticateToken, contentController.uploadContent);

module.exports = router;
