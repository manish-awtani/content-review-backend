// content-service/src/routes/moderationRoutes.js
const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');
const { authenticateToken } = require('../../../auth-service/src/middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.put('/:id/approve', authenticateToken, requireRole('moderator'), moderationController.approveContent);
router.put('/:id/reject', authenticateToken, requireRole('moderator'), moderationController.rejectContent);

module.exports = router;
