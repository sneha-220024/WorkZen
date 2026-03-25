import { Request, Response, NextFunction } from 'express';
import PayslipService from '../services/PayslipService';
import ActivityService from '../services/ActivityService';
import Payroll from '../models/Payroll';
import Employee from '../models/Employee';
import path from 'path';
import fs from 'fs';

class PayslipController {
    /**
     * Generate payslip for a specific payroll record.
     */
    static async generatePayslip(req: any, res: Response, next: NextFunction) {
        try {
            const { payrollId } = req.params;
            const payslip = await PayslipService.generatePayslip(payrollId);

            // Log Activity
            const payroll = await Payroll.findById(payrollId);
            const emp = await Employee.findById(payroll?.employeeId);
            await ActivityService.logActivity(
                'payslip_generated',
                `${emp?.name || 'Employee'} — Payslip generated`,
                emp?.name,
                (req as any).user?._id
            );

            res.status(201).json({ success: true, data: payslip });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Generate all payslips for a month.
     */
    static async generateAllPayslips(req: any, res: Response, next: NextFunction) {
        try {
            const { month, year } = req.body;
            const hrId = req.user._id;
            
            if (!month || !year) {
                return res.status(400).json({ success: false, message: 'Month and year are required' });
            }

            const results = await PayslipService.generateAllPayslips(hrId, month, parseInt(year));

            // Log Activity
            await ActivityService.logActivity(
                'payslip_generated_all',
                `All payslips generated for ${month} ${year}`,
                undefined,
                hrId
            );

            res.status(201).json({ success: true, message: `${results.length} payslips generated.`, data: results });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Download payslip PDF.
     */
    static async downloadPayslip(req: any, res: Response, next: NextFunction) {
        try {
            const { id } = req.params; // payrollId
            const payslip = await PayslipService.getPayslipByPayrollId(id);
            
            if (!payslip) {
                return res.status(404).json({ success: false, message: 'Payslip not found' });
            }

            const filePath = path.join(process.cwd(), payslip.pdfUrl);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'File not found on server' });
            }

            res.download(filePath);
        } catch (error) {
            next(error);
        }
    }
}

export default PayslipController;
