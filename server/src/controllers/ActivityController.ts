import { Request, Response, NextFunction } from 'express';
import ActivityService from '../services/ActivityService';

/**
 * Controller class to handle activity tracking related HTTP requests.
 */
class ActivityController {
    /**
     * Get recent activities for the dashboard or notifications.
     */
    static async getActivities(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 50;
            const activities = await ActivityService.getActivities(limit);
            
            res.status(200).json({
                success: true,
                data: activities
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all activities as read.
     */
    static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
        try {
            await ActivityService.markAllAsRead();
            
            res.status(200).json({
                success: true,
                message: 'All activities marked as read'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ActivityController;
