import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

class NotificationController {
    /**
     * Get all notifications for an employee.
     */
    static async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = req.params;
            
            if (!employeeId) {
                return res.status(400).json({ success: false, message: 'Employee ID is required' });
            }

            const notifications = await Notification.find({ employeeId })
                .sort({ createdAt: -1 })
                .limit(50); // Limit to last 50 notifications

            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all notifications as read for an employee.
     */
    static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = req.params;

            if (!employeeId) {
                return res.status(400).json({ success: false, message: 'Employee ID is required' });
            }

            await Notification.updateMany(
                { employeeId, isRead: false },
                { isRead: true }
            );

            res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default NotificationController;
