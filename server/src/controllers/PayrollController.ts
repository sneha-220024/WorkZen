import { Request, Response, NextFunction } from 'express';
import PayrollService from '../services/PayrollService';
import PayslipService from '../services/PayslipService';
import Employee from '../models/Employee';
import emailService from '../services/email.service';
import path from 'path';
import ActivityService from '../services/ActivityService';

class PayrollController {
    /**
     * Get HR payroll records with pagination.
     */
    static async getHRPayroll(req: any, res: Response, next: NextFunction) {
        try {
            const hrId = req.user._id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const { payrolls, total } = await PayrollService.getHRPayroll(hrId, page, limit);
            
            res.status(200).json({ 
                success: true, 
                data: payrolls,
                total,
                page,
                limit
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate payroll for all employees.
     */
    static async generateAllPayroll(req: any, res: Response, next: NextFunction) {
        try {
            const { month, year } = req.body;
            const hrId = req.user._id;

            if (!month || !year) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Month and year are required' 
                });
            }

            const results = await PayrollService.generatePayroll(hrId, month, parseInt(year));

            // Log Activity
            await ActivityService.logActivity(
                'payroll_generated',
                `Payroll generated for ${month} ${year}`,
                undefined,
                hrId
            );
            
            // Background task: Async send payslips to employees for the newly generated records.
            (async () => {
                for (const payroll of results) {
                    try {
                        const employee: any = await Employee.findById(payroll.employeeId);
                        if (!employee || !employee.email) continue;
                        
                        // Ensure PDF is generated/fetched
                        await PayslipService.generatePayslip(payroll._id.toString());
                        
                        // Construct file path for attachment
                        const fileName = `Payslip_${employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;
                        const pdfPath = path.join(process.cwd(), 'uploads', 'payslips', fileName);
                        
                        const subject = `Your Payslip for ${payroll.month} ${payroll.year}`;
                        const html = `
                            <p>Hi ${employee.firstName},</p>
                            <p>Your payroll for <strong>${payroll.month} ${payroll.year}</strong> has been generated.</p>
                            <div style="border: 1px solid #ccc; padding: 10px; margin-top: 10px; margin-bottom: 20px;">
                                <h3>Salary Summary</h3>
                                <p><strong>Base Salary:</strong> $${payroll.baseSalary.toLocaleString()}</p>
                                <p><strong>Net Salary:</strong> $${payroll.netSalary.toLocaleString()}</p>
                            </div>
                            <p>Please find your detailed payslip attached to this email.</p>
                            <br/>
                            <p>Best regards,</p>
                            <p>WorkZen HR Team</p>
                        `;

                        await emailService.sendEmail({
                            to: employee.email,
                            subject,
                            html,
                            attachments: [
                                {
                                    filename: fileName,
                                    path: pdfPath
                                }
                            ]
                        });
                    } catch (error) {
                        console.error(`[PayrollController] Failed to send email for payroll ${payroll._id}:`, error);
                    }
                }
            })();

            res.status(201).json({ 
                success: true, 
                message: `Payroll generation complete. ${results.length} records created.`,
                data: results 
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Mark a payroll record as paid.
     */
    static async markAsPaid(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const payroll = await PayrollService.markAsPaid(id as string);
            if (!payroll) {
                return res.status(404).json({ success: false, message: 'Payroll record not found' });
            }

            // Log Activity
            const emp = await Employee.findById(payroll.employeeId);
            await ActivityService.logActivity(
                'payroll_paid',
                `${emp?.name || 'Employee'} — Payroll marked as paid`,
                emp?.name,
                (req as any).user?._id
            );

            res.status(200).json({ success: true, data: payroll });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get employee payroll history.
     */
    static async getEmployeePayroll(req: any, res: Response, next: NextFunction) {
        try {
            const employeeId = req.user._id; // Assuming req.user is the employee
            const payrolls = await PayrollService.getEmployeePayroll(employeeId);
            res.status(200).json({ success: true, data: payrolls });
        } catch (error) {
            next(error);
        }
    }
}

export default PayrollController;
