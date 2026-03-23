import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Leave from '../models/Leave';
import Payroll from '../models/Payroll';
import Payslip from '../models/Payslip';

/**
 * Searches Leaves, Payrolls, and Payslips based on a provided keyword.
 */
export const globalSearch = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string' || q.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please provide a search keyword.' });
        }

        const keyword = q.trim();
        const regex = new RegExp(keyword, 'i');

        // 1. Find matching Employees by name, employeeId, or department
        const matchingEmployees = await Employee.find({
            $or: [
                { name: regex },
                { employeeId: regex },
                { department: regex }
            ]
        }).select('_id name employeeId department');
        
        const employeeIds = matchingEmployees.map(emp => emp._id);

        // 2. Search Leaves
        const leaveResults = await Leave.find({
            $or: [
                { employeeId: { $in: employeeIds } },
                { leaveType: regex },
                { status: regex }
            ]
        }).populate<{employeeId: any}>('employeeId', 'name employeeId department');

        // Format Leave Results
        const formattedLeaves = leaveResults.map((leave) => ({
            module: 'Leave Management',
            employeeName: leave.employeeId?.name || 'Unknown',
            employeeId: leave.employeeId?.employeeId || 'Unknown',
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            status: leave.status
        }));

        // 3. Search Payrolls
        const isNumericYear = !isNaN(Number(keyword)) && keyword.length === 4;
        const payrollQuery: any = {
            $or: [
                { employeeId: { $in: employeeIds } },
                { month: regex }
            ]
        };
        if (isNumericYear) {
            payrollQuery.$or.push({ year: Number(keyword) });
        }

        const payrollResults = await Payroll.find(payrollQuery)
            .populate<{employeeId: any}>('employeeId', 'name employeeId department');

        const formattedPayrolls = payrollResults.map((payroll) => ({
            module: 'Payroll',
            employeeName: payroll.employeeId?.name || 'Unknown',
            employeeId: payroll.employeeId?.employeeId || 'Unknown',
            department: payroll.employeeId?.department || 'Unknown',
            month: payroll.month,
            year: payroll.year,
            baseSalary: payroll.baseSalary,
            deductions: payroll.deductions,
            bonus: payroll.bonus,
            netSalary: payroll.netSalary
        }));

        // 4. Search Payslips
        const payslipResults = await Payslip.find({
            $or: [
                { employeeId: { $in: employeeIds } }
            ]
        })
        .populate<{employeeId: any}>('employeeId', 'name employeeId')
        .populate<{payrollId: any}>('payrollId', 'month year netSalary');

        // Match Payslips by month and year using fetched Payrolls 
        const payrollIds = payrollResults.map(p => p._id);
        const additionalPayslips = await Payslip.find({
            payrollId: { $in: payrollIds },
            _id: { $nin: payslipResults.map(p => p._id) } // avoid duplicates
        })
        .populate<{employeeId: any}>('employeeId', 'name employeeId')
        .populate<{payrollId: any}>('payrollId', 'month year netSalary');

        const allPayslipDocs = [...payslipResults, ...additionalPayslips];

        const formattedPayslips = allPayslipDocs.map((payslip) => ({
            module: 'Payslip',
            employeeName: payslip.employeeId?.name || 'Unknown',
            employeeId: payslip.employeeId?.employeeId || 'Unknown',
            month: payslip.payrollId?.month || 'Unknown',
            year: payslip.payrollId?.year || 'Unknown',
            pdfUrl: payslip.pdfUrl
        }));

        // Combine all results
        const combinedResults = {
            leaves: formattedLeaves,
            payrolls: formattedPayrolls,
            payslips: formattedPayslips
        };

        const totalResults = formattedLeaves.length + formattedPayrolls.length + formattedPayslips.length;

        if (totalResults === 0) {
            return res.status(200).json({ success: true, message: 'No matching records found', data: combinedResults, totalResults: 0 });
        }

        return res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: combinedResults,
            totalResults
        });

    } catch (error: any) {
        console.error('Search error:', error);
        return res.status(500).json({ success: false, message: 'Server error during search' });
    }
};
