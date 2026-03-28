import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';
import Payroll from '../models/Payroll';
import Request from '../models/Request';

/**
 * Service class for Dashboard overview statistics.
 */
class DashboardService {
    /**
     * Get statistics for the HR dashboard overview.
     * @returns {Promise<any>}
     */
    static async getDashboardStats(hrId?: string): Promise<any> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentMonth = today.toLocaleString('default', { month: 'long' });
        const currentYear = today.getFullYear();

        let employeeQuery: any = { status: { $ne: 'Inactive' } };
        if (hrId) {
            employeeQuery.hrId = hrId;
        }

        // 1. Total Employees
        const totalEmployees = await Employee.countDocuments(employeeQuery);
        
        // Get relevant employee IDs for other queries if filtering by HR
        let targetEmployeeQuery = {};
        if (hrId) {
            const employees = await Employee.find({ hrId: hrId }, '_id');
            const employeeIds = employees.map(e => e._id);
            targetEmployeeQuery = { employeeId: { $in: employeeIds } };
        }

        // 2. Today's Attendance Percentage
        const presentToday = await Attendance.countDocuments({
            ...targetEmployeeQuery,
            date: { $gte: today },
            status: { $in: ['Present', 'Late', 'Half Day'] }
        });

        const todaysAttendancePercentage = totalEmployees > 0 
            ? parseFloat(((presentToday / totalEmployees) * 100).toFixed(2)) 
            : 0;

        // 3. Pending Leave Requests
        const pendingLeaveRequests = await Leave.countDocuments({ 
            ...targetEmployeeQuery,
            status: 'Pending' 
        });

        // 4. Total Payroll for Current Month
        const payrollRecords = await Payroll.find({
            ...targetEmployeeQuery,
            month: currentMonth,
            year: currentYear
        });

        const totalPayrollForCurrentMonth = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);

        // 5. Pending Employee Requests
        const pendingRequestsCount = await Request.countDocuments({
            ...targetEmployeeQuery,
            status: 'Pending'
        });

        return {
            totalEmployees,
            todaysAttendancePercentage,
            pendingLeaveRequests,
            totalPayrollForCurrentMonth,
            pendingRequestsCount
        };
    }

    /**
     * Get statistics for a specific employee's dashboard.
     * @param {string} email Email of the employee.
     * @returns {Promise<any>}
     */
    static async getEmployeeDashboardStats(email: string): Promise<any> {
        const employee = await Employee.findOne({ email });
        if (!employee) return null;

        const employeeId = employee._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Present Days (this month)
        const presentDays = await Attendance.countDocuments({
            employeeId,
            date: { $gte: startOfMonth },
            status: { $in: ['Present', 'Late'] }
        });

        // 2. Leave Balance
        // Assuming every employee gets 20 leaves per year
        const totalLeavesAllowed = 20;
        const leavesTaken = await Leave.find({
            employeeId,
            status: 'Approved'
        });
        const totalLeavesTaken = leavesTaken.reduce((sum, l) => sum + (l.days || 0), 0);
        const leaveBalance = Math.max(0, totalLeavesAllowed - totalLeavesTaken);

        // 3. Overtime Hours (this month)
        const attendanceThisMonth = await Attendance.find({
            employeeId,
            date: { $gte: startOfMonth }
        });
        const totalHours = attendanceThisMonth.reduce((sum, a) => sum + (a.totalHours || 0), 0);
        // Assuming 8 hours is standard. Overtime = totalHours - (8 * daysPresent)
        const overtimeHours = Math.max(0, totalHours - (8 * attendanceThisMonth.length));

        return {
            presentDays,
            leaveBalance,
            overtimeHours,
            notificationsCount: 3, // Placeholder
            attendancePercentage: employee.attendancePercentage || 100
        };
    }
}

export default DashboardService;
