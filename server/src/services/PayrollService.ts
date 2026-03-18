import Payroll, { IPayrollDocument } from '../models/Payroll';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';
import mongoose from 'mongoose';

class PayrollService {
    /**
     * Generate payroll for all employees under an HR for a given month and year.
     */
    static async generatePayroll(hrId: string, month: string, year: number) {
        // Step 1: Fetch all employees under that HR
        // Note: addedBy is used in the current system, hrId is requested in the new system.
        // I'll check both or just use addedBy for now as it's existing.
        const employees = await Employee.find({ hrId: new mongoose.Types.ObjectId(hrId), status: 'Active' });
        
        if (!employees.length) {
            throw new Error('No active employees found for this HR');
        }

        const workingDays = this.getWorkingDays(month, year);
        const results = [];

        for (const employee of employees) {
            // Step 2: Fetch attendance records for the selected month
            const { start, end } = this.getMonthDateRange(month, year);
            
            const attendanceRecords = await Attendance.find({
                employeeId: employee._id,
                date: { $gte: start, $lte: end },
                status: { $in: ['Present', 'Late'] }
            });

            const presentDays = attendanceRecords.length;
            const absentDays = workingDays - presentDays;

            // Step 3: Calculation Logic
            // Handle missing salaryStructure by defaulting or skipping
            const salary = employee.salaryStructure || {
                baseSalary: employee.baseSalary || 0,
                hra: 0,
                allowance: 0,
                taxPercent: 0
            };
            
            const baseSalary = salary.baseSalary;
            const hra = salary.hra || 0;
            const allowance = salary.allowance || 0;
            const taxPercent = salary.taxPercent || 0;

            const perDaySalary = workingDays > 0 ? baseSalary / workingDays : 0;
            
            // If no attendance records found, we might want to check if it's the current month
            // For now, if presentDays is 0, we still calculate deductions but cap them to baseSalary
            const deductions = Math.min(baseSalary, perDaySalary * Math.max(0, absentDays));
            
            const tax = (taxPercent / 100) * baseSalary;
            const grossSalary = baseSalary + hra + allowance;
            const bonus = 0; 
            
            // Ensure net salary is not negative
            const rawNetSalary = grossSalary + bonus - deductions - tax;
            const netSalary = Math.max(0, rawNetSalary);

            // Step 4: Save or Update Payroll Record
            const existingPayroll = await Payroll.findOne({
                employeeId: employee._id,
                month,
                year
            });

            if (existingPayroll) {
                // Duplicate prevention: skip
                continue; 
            }

            const payroll = new Payroll({
                employeeId: employee._id,
                hrId: new mongoose.Types.ObjectId(hrId),
                month,
                year,
                workingDays,
                presentDays,
                absentDays,
                baseSalary,
                bonus,
                deductions,
                tax,
                grossSalary,
                netSalary,
                status: 'Unpaid'
            });

            await payroll.save();
            results.push(payroll);
        }

        return results;
    }

    /**
     * Get payroll records for HR dashboard.
     */
    static async getHRPayroll(hrId: string, page: number = 1, limit: number = 20) {
        const query = { hrId: new mongoose.Types.ObjectId(hrId) };
        const total = await Payroll.countDocuments(query);
        const payrolls = await Payroll.find(query)
            .populate('employeeId', 'firstName lastName department designation employeeId')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        return { payrolls, total };
    }

    /**
     * Mark payroll as Paid.
     */
    static async markAsPaid(payrollId: string) {
        return await Payroll.findByIdAndUpdate(payrollId, { status: 'Paid' }, { new: true });
    }

    /**
     * Get payroll history for employee dashboard.
     */
    static async getEmployeePayroll(employeeId: string) {
        return await Payroll.find({ employeeId }).sort({ year: -1, month: -1 });
    }

    // Helper functions
    private static getWorkingDays(month: string, year: number): number {
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const date = new Date(year, monthIndex, 1);
        let count = 0;
        while (date.getMonth() === monthIndex) {
            const day = date.getDay();
            if (day !== 0 && day !== 6) {
                count++;
            }
            date.setDate(date.getDate() + 1);
        }
        return count;
    }

    private static getMonthDateRange(month: string, year: number) {
        const months: { [key: string]: number } = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
            'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        const monthIndex = months[month] !== undefined ? months[month] : new Date(`${month} 1, ${year}`).getMonth();
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
        return { start, end };
    }
}

export default PayrollService;
