import { Request, Response, NextFunction } from 'express';
import LeaveService from '../services/LeaveService';
import Employee from '../models/Employee';
import Leave from '../models/Leave';
import Notification from '../models/Notification';

/**
 * Controller class to handle Leave related HTTP requests.
 */
class LeaveController {
    /**
     * Employee applies for leave.
     */
    static async applyLeave(req: any, res: Response, next: NextFunction) {
        try {
            const leaveData = req.body;
            if (!leaveData.employeeId && req.user) {
                const employee = await Employee.findOne({ email: req.user.email });
                if (!employee) {
                    return res.status(404).json({ success: false, message: 'Employee profile not found. Please contact your HR to add your professional details.' });
                }
                leaveData.employeeId = employee._id;
            }
            if (!leaveData.employeeId) {
                return res.status(400).json({ success: false, message: 'Employee ID is required' });
            }
            const leave = await LeaveService.applyLeave(leaveData);

            // Create Notification
            await Notification.create({
                employeeId: leave.employeeId,
                title: 'Leave Applied',
                message: `Your ${leave.leaveType} leave request for ${new Date(leave.startDate).toLocaleDateString()} is applied and pending approval.`,
                type: 'leave'
            });

            res.status(201).json({ success: true, data: leave });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Get all leave requests.
     */
    static async getLeaves(req: any, res: Response, next: NextFunction) {
        try {
            const userRole = req.user?.role?.toLowerCase();
            const hrId = userRole === 'hr' ? req.user._id : undefined;
            const leaves = await LeaveService.getAllLeaves(hrId);
            res.status(200).json({ success: true, data: leaves });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get leaves of currently logged in employee.
     */
    static async getMyLeaves(req: any, res: Response, next: NextFunction) {
        try {
            const employee = await Employee.findOne({ email: req.user.email });
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            const leaves = await Leave.find({ employeeId: employee._id }).sort({ appliedAt: -1 });
            res.status(200).json({ success: true, data: leaves });
        } catch (error) {
            next(error);
        }
    }

    /**
     * HR approves a leave request.
     */
    static async approveLeave(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const hrId = req.body.hrId || (req as any).user?._id; 
            const leave = await LeaveService.approveLeave(id as string, hrId as string);
            if (!leave) {
                return res.status(404).json({ success: false, message: 'Leave request not found' });
            }

            // Create Notification for Employee
            await Notification.create({
                employeeId: leave.employeeId,
                title: 'Leave Approved',
                message: `Your ${leave.leaveType} leave request for ${new Date(leave.startDate).toLocaleDateString()} has been approved.`,
                type: 'leave'
            });

            res.status(200).json({ success: true, data: leave });
        } catch (error) {
            next(error);
        }
    }

    /**
     * HR rejects a leave request.
     */
    static async rejectLeave(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const hrId = req.body.hrId || (req as any).user?._id;
            const leave = await LeaveService.rejectLeave(id as string, hrId as string);
            if (!leave) {
                return res.status(404).json({ success: false, message: 'Leave request not found' });
            }

            // Create Notification for Employee
            await Notification.create({
                employeeId: leave.employeeId,
                title: 'Leave Rejected',
                message: `Your ${leave.leaveType} leave request for ${new Date(leave.startDate).toLocaleDateString()} has been rejected.`,
                type: 'leave'
            });

            res.status(200).json({ success: true, data: leave });
        } catch (error) {
            next(error);
        }
    }
}

export default LeaveController;
