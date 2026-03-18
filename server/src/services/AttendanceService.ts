import Attendance, { IAttendance, IAttendanceDocument } from '../models/Attendance';
import Employee from '../models/Employee';
import mongoose from 'mongoose';

/**
 * Service class for Attendance related business logic.
 */
class AttendanceService {
    /**
     * Records check-in for an employee today.
     * @param {string} employeeId MongoDB ID of the employee.
     * @returns {Promise<IAttendance>}
     */
    static async checkIn(employeeId: string): Promise<IAttendanceDocument> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existingRecord = await Attendance.findOne({
            employeeId,
            date: { $gte: today },
        });

        if (existingRecord) {
            throw new Error('Already checked in for today');
        }

        const attendance = new Attendance({
            employeeId,
            date: today,
            checkInTime: new Date(),
            status: 'Present' // Default to present, logic can be added for 'Late'
        });

        // Simple 'Late' logic: if checked in after 9:30 AM
        const now = new Date();
        if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
            attendance.status = 'Late';
        }

        return await attendance.save();
    }

    /**
     * Records check-out for an employee today.
     * @param {string} employeeId MongoDB ID of the employee.
     * @returns {Promise<IAttendance>}
     */
    static async checkOut(employeeId: string): Promise<IAttendanceDocument> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeId,
            date: { $gte: today },
        });

        if (!attendance) {
            throw new Error('No check-in record found for today');
        }

        if (attendance.checkOutTime) {
            throw new Error('Already checked out for today');
        }

        attendance.checkOutTime = new Date();
        // pre-save hook in model will calculate totalHours
        return await attendance.save();
    }

    /**
     * Gets today's attendance for all employees.
     * @returns {Promise<IAttendance[]>}
     */
    static async getTodaysAttendance(hrId?: string): Promise<any[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let query: any = { date: { $gte: today } };
        
        if (hrId) {
            const employees = await Employee.find({ hrId: hrId }, '_id');
            const employeeIds = employees.map(e => e._id);
            query.employeeId = { $in: employeeIds };
        }

        return await Attendance.find(query).populate('employeeId', 'firstName lastName employeeId department designation');
    }

    /**
     * Gets attendance history for a specific employee.
     * @param {string} employeeId MongoDB ID of the employee.
     * @returns {Promise<IAttendance[]>}
     */
    static async getEmployeeAttendanceHistory(employeeId: string): Promise<IAttendanceDocument[]> {
        return await Attendance.find({ employeeId }).sort({ date: -1 });
    }
}

export default AttendanceService;
