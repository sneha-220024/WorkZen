import Activity from '../models/Activity';
import mongoose from 'mongoose';

/**
 * Service class for Activity tracking.
 */
class ActivityService {
    /**
     * Log a new HR activity.
     * @param {string} type Type of activity (e.g., 'leave_approved')
     * @param {string} message Descriptive message for the activity
     * @param {string} employeeName Name of the employee involved
     * @param {string} hrId ID of the HR who performed the action
     */
    static async logActivity(type: string, message: string, employeeName?: string, hrId?: string) {
        try {
            await Activity.create({
                type,
                message,
                employeeName,
                hrId: hrId ? new mongoose.Types.ObjectId(hrId) : undefined,
                createdAt: new Date()
            });
        } catch (error) {
            console.error('Error logging activity:', error);
            // We don't throw here to avoid breaking the main HR action if logging fails
        }
    }

    /**
     * Get recent activities.
     * @param {number} limit Number of activities to fetch
     * @returns {Promise<any[]>}
     */
    static async getActivities(limit: number = 50) {
        return await Activity.find()
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * Mark all activities as read.
     */
    static async markAllAsRead() {
        return await Activity.updateMany({ isRead: false }, { isRead: true });
    }
}

export default ActivityService;
