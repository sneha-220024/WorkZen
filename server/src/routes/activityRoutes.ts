import express from 'express';
import ActivityController from '../controllers/ActivityController';
import { protect } from '../middlewares/authMiddleware';
import { checkHR } from '../middlewares/roleMiddleware';

const router = express.Router();

/**
 * @route   GET /api/activities
 * @desc    Get recent activities (HR only)
 * @access  Private/HR
 */
router.get('/', protect, checkHR, ActivityController.getActivities);

/**
 * @route   PATCH /api/activities/read-all
 * @desc    Mark all activities as read (HR only)
 * @access  Private/HR
 */
router.patch('/read-all', protect, checkHR, ActivityController.markAllAsRead);

export default router;
