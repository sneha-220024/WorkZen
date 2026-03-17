import { Request, Response, NextFunction } from 'express';
import AttendanceService from '../services/AttendanceService';
import Employee from '../models/Employee';

/**
 * Controller class to handle Attendance related HTTP requests.
 */
class AttendanceController {
    /**
     * Employee check-in.
     */
    static async checkIn(req: any, res: Response, next: NextFunction) {
        try {
            let { employeeId } = req.body;
            if (!employeeId && req.user) {
                const employee = await Employee.findOne({ email: req.user.email });
                if (!employee) {
                    return res.status(404).json({ success: false, message: 'Employee profile not found. Please contact your HR to add your professional details.' });
                }
                employeeId = employee._id;
            }
            if (!employeeId) {
                return res.status(400).json({ success: false, message: 'Employee ID is required' });
            }
            const attendance = await AttendanceService.checkIn(employeeId.toString());
            res.status(201).json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Employee check-out.
     */
    static async checkOut(req: any, res: Response, next: NextFunction) {
        try {
            let { employeeId } = req.body;
            if (!employeeId && req.user) {
                const employee = await Employee.findOne({ email: req.user.email });
                if (!employee) {
                    return res.status(404).json({ success: false, message: 'Employee profile not found. Please contact your HR to add your professional details.' });
                }
                employeeId = employee._id;
            }
            if (!employeeId) {
                return res.status(400).json({ success: false, message: 'Employee ID is required' });
            }
            const attendance = await AttendanceService.checkOut(employeeId.toString());
            res.status(200).json({ success: true, data: attendance });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Get today's attendance records.
     */
    static async getTodaysAttendance(req: any, res: Response, next: NextFunction) {
        try {
            const userRole = req.user?.role?.toLowerCase();
            const hrId = userRole === 'hr' ? req.user._id : undefined;
            const attendance = await AttendanceService.getTodaysAttendance(hrId);
            res.status(200).json({ success: true, data: attendance });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get attendance history for a specific employee.
     */
    static async getEmployeeAttendanceHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = req.params;
            const attendance = await AttendanceService.getEmployeeAttendanceHistory(employeeId as string);
            res.status(200).json({ success: true, data: attendance });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get attendance history for the currently logged in employee.
     */
    static async getMyAttendanceHistory(req: any, res: Response, next: NextFunction) {
        try {
            const employee = await Employee.findOne({ email: req.user.email });
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            const attendance = await AttendanceService.getEmployeeAttendanceHistory(employee._id.toString());
            res.status(200).json({ success: true, data: attendance });
        } catch (error) {
            next(error);
        }
    }
}

export default AttendanceController;
