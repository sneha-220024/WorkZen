import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';

const router = Router();

/**
 * Routes for Notifications
 * Base route: /api/notifications
 */

router.get('/:employeeId', NotificationController.getNotifications);
router.patch('/read-all/:employeeId', NotificationController.markAllAsRead);

export default router;
