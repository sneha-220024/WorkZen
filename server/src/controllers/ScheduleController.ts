import { Request, Response, NextFunction } from 'express';
import ScheduleService from '../services/ScheduleService';

/**
 * Controller class to handle Schedule related HTTP requests.
 */
class ScheduleController {
    /**
     * Create a new schedule.
     */
    static async createSchedule(req: any, res: Response, next: NextFunction) {
        try {
            const { employeeId, employeeName, employeeEmail, date, time, reason, meetingLink } = req.body;

            // Basic validation
            if (!employeeId || !employeeName || !employeeEmail || !date || !time || !reason || !meetingLink) {
                return res.status(400).json({ success: false, message: 'Please provide all required fields' });
            }

            const hrName = req.user?.name || 'HR Manager';
            const hrId = req.user?._id;

            const schedule = await ScheduleService.createSchedule({
                employeeId,
                employeeName,
                employeeEmail,
                date: new Date(date),
                time,
                reason,
                meetingLink
            }, hrName, hrId);

            res.status(201).json({
                success: true,
                message: 'Schedule created successfully and notification sent.',
                data: schedule
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all schedules.
     */
    static async getSchedules(req: Request, res: Response, next: NextFunction) {
        try {
            const schedules = await ScheduleService.getAllSchedules();
            res.status(200).json({ success: true, data: schedules });
        } catch (error) {
            next(error);
        }
    }
}

export default ScheduleController;
