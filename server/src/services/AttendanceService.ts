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
        const savedAttendance = await attendance.save();

        // Calculate attendance % and notify if critically low
        await AttendanceService.updateAttendanceAndNotify(employeeId);

        return savedAttendance;
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

    /**
     * Calculates the employee's attendance percentage for the current month and sends alerts if low.
     * @param {string} employeeId MongoDB ID of the employee
     */
    static async updateAttendanceAndNotify(employeeId: string): Promise<void> {
        try {
            const employee = await Employee.findById(employeeId);
            if (!employee) return;

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            // Calculate total expected working days (Mon-Fri) from start of month till today
            let workingDays = 0;
            for (let d = new Date(startOfMonth); d <= now; d.setDate(d.getDate() + 1)) {
                if (d.getDay() !== 0 && d.getDay() !== 6) { // 0 = Sunday, 6 = Saturday
                    workingDays++;
                }
            }
            if (workingDays === 0) workingDays = 1;

            // Total present instances this month
            const presentDays = await Attendance.countDocuments({
                employeeId,
                date: { $gte: startOfMonth },
                status: { $in: ['Present', 'Late', 'Half Day'] }
            });

            // Calculate percentage
            const attendancePercentage = Number(((presentDays / workingDays) * 100).toFixed(2));
            
            // Update the Employee document
            employee.attendancePercentage = attendancePercentage;

            await employee.save();
        } catch (error) {
            console.error('[AttendanceService] updateAttendanceAndNotify Error:', error);
        }
    }

    /**
     * Gets all attendance records for analytical purposes.
     * @param {string} hrId Optional HR ID to filter by.
     * @returns {Promise<IAttendance[]>}
     */
    static async getAllAttendance(hrId?: string): Promise<any[]> {
        let query: any = {};
        
        if (hrId) {
            const employees = await Employee.find({ hrId: hrId }, '_id');
            const employeeIds = employees.map(e => e._id);
            query.employeeId = { $in: employeeIds };
        }

        return await Attendance.find(query)
            .populate('employeeId', 'firstName lastName employeeId department designation')
            .sort({ date: -1 });
    }
}

export default AttendanceService;
