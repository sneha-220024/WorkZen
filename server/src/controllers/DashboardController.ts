import { Request, Response, NextFunction } from 'express';
import DashboardService from '../services/DashboardService';

/**
 * Controller class to handle HR Dashboard statistics.
 */
class DashboardController {
    /**
     * Get statistics for the HR dashboard overview.
     */
    static async getDashboardStats(req: any, res: Response, next: NextFunction) {
        try {
            const userRole = req.user?.role?.toLowerCase();
            const hrId = userRole === 'hr' ? req.user._id : undefined;
            const stats = await DashboardService.getDashboardStats(hrId);
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get statistics for the employee dashboard overview.
     */
    static async getEmployeeDashboardStats(req: any, res: Response, next: NextFunction) {
        try {
            const email = req.user.email;
            const stats = await DashboardService.getEmployeeDashboardStats(email);
            if (!stats) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

export default DashboardController;
