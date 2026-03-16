import Leave, { ILeave, ILeaveDocument } from '../models/Leave';
import Employee from '../models/Employee';
import mongoose from 'mongoose';

/**
 * Service class for Leave management business logic.
 */
class LeaveService {
    /**
     * Applied for leave by an employee.
     * @param {Partial<ILeave>} leaveData
     * @returns {Promise<ILeave>}
     */
    static async applyLeave(leaveData: Partial<ILeave>): Promise<ILeaveDocument> {
        const leave = new Leave(leaveData);
        // Calculate days if not provided
        if (leave.startDate && leave.endDate && !leave.days) {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            leave.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
        return await leave.save();
    }

    /**
     * Get all leave requests.
     * @returns {Promise<ILeave[]>}
     */
    static async getAllLeaves(hrId?: string): Promise<any[]> {
        let query: any = {};
        if (hrId) {
            const employees = await Employee.find({ hrId: hrId }, '_id');
            const employeeIds = employees.map(e => e._id);
            query.employeeId = { $in: employeeIds };
        }

        return await Leave.find(query)
            .populate('employeeId', 'firstName lastName employeeId department avatar')
            .sort({ appliedAt: -1 });
    }

    /**
     * Approve a leave request.
     * @param {string} leaveId MongoDB ID of the leave.
     * @param {string} hrId MongoDB ID of the HR/Admin who approved.
     * @returns {Promise<ILeave | null>}
     */
    static async approveLeave(leaveId: string, hrId: string): Promise<ILeaveDocument | null> {
        return await Leave.findByIdAndUpdate(
            leaveId,
            {
                status: 'Approved',
                approvedBy: new mongoose.Types.ObjectId(hrId),
                approvedAt: new Date(),
            },
            { new: true }
        );
    }

    /**
     * Reject a leave request.
     * @param {string} leaveId MongoDB ID of the leave.
     * @param {string} hrId MongoDB ID of the HR/Admin who rejected.
     * @returns {Promise<ILeave | null>}
     */
    static async rejectLeave(leaveId: string, hrId: string): Promise<ILeaveDocument | null> {
        return await Leave.findByIdAndUpdate(
            leaveId,
            {
                status: 'Rejected',
                approvedBy: new mongoose.Types.ObjectId(hrId),
                approvedAt: new Date(),
            },
            { new: true }
        );
    }
}

export default LeaveService;
