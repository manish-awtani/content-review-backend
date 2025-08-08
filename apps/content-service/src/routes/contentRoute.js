const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateToken } = require('../../../auth-service/src/middleware/authMiddleware');

// Protected route - Only logged in users can upload content
router.post('/upload', authenticateToken, contentController.uploadContent);
router.post('/:id/approve', authenticateToken, contentController.approveContent);
router.post('/:id/reject', authenticateToken, contentController.rejectContent);

module.exports = router;
