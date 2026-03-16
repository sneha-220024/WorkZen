import PDFDocument from 'pdfkit';
import fs from 'fs-extra';
import path from 'path';
import Payroll from '../models/Payroll';
import Payslip from '../models/Payslip';
import Employee from '../models/Employee';

class PayslipService {
    /**
     * Generate a single payslip PDF and save record.
     */
    static async generatePayslip(payrollId: string) {
        const payroll = await Payroll.findById(payrollId).populate('employeeId');
        if (!payroll) throw new Error('Payroll record not found');

        const employee = payroll.employeeId as any;
        const uploadDir = path.join(process.cwd(), 'uploads', 'payslips');
        await fs.ensureDir(uploadDir);

        const fileName = `Payslip_${employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;
        const filePath = path.join(uploadDir, fileName);
        const relativePath = `/uploads/payslips/${fileName}`;

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- PDF Generation Logic ---
        doc.fontSize(25).text('WorkZen', { align: 'center' });
        doc.fontSize(15).text('Employee Payslip', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Month: ${payroll.month} ${payroll.year}`, { align: 'right' });
        doc.moveDown();

        // Employee Info
        doc.fontSize(12).text(`Employee Name: ${employee.firstName} ${employee.lastName}`);
        doc.text(`Employee ID: ${employee.employeeId}`);
        doc.text(`Department: ${employee.department}`);
        doc.text(`Designation: ${employee.designation}`);
        doc.moveDown();

        doc.rect(doc.x, doc.y, 500, 1).fill('#000'); // HR line
        doc.moveDown();

        // Salary Breakdown Table
        const tableTop = doc.y;
        doc.font('Helvetica-Bold').text('Description', 50, tableTop);
        doc.text('Amount ($)', 400, tableTop);
        doc.font('Helvetica');

        let y = tableTop + 20;
        const rows = [
            { label: 'Base Salary', amount: payroll.baseSalary },
            { label: 'HRA', amount: employee.salaryStructure?.hra || 0 },
            { label: 'Allowances', amount: employee.salaryStructure?.allowance || 0 },
            { label: 'Bonus', amount: payroll.bonus || 0 },
            { label: 'Deductions (Absence)', amount: -payroll.deductions },
            { label: 'Tax', amount: -payroll.tax },
        ];

        rows.forEach(row => {
            doc.text(row.label, 50, y);
            doc.text(row.amount.toLocaleString(), 400, y);
            y += 20;
        });

        doc.moveDown();
        doc.rect(50, y, 450, 1).fill('#000');
        y += 10;
        doc.font('Helvetica-Bold').text('Net Salary', 50, y);
        doc.text(payroll.netSalary.toLocaleString(), 400, y);

        doc.moveDown(5);
        doc.fillColor('#888').fontSize(10).text('This is a computer generated document and does not require a signature.', { align: 'center' });

        doc.end();

        // Wait for stream to finish
        await new Promise<void>((resolve) => stream.on('finish', () => resolve()));

        // Save record
        let payslip = await Payslip.findOne({ payrollId });
        if (payslip) {
            payslip.pdfUrl = relativePath;
            await payslip.save();
        } else {
            payslip = new Payslip({
                payrollId,
                employeeId: employee._id,
                pdfUrl: relativePath
            });
            await payslip.save();
        }

        return payslip;
    }

    /**
     * Generate all payslips for a list of payroll records.
     */
    static async generateAllPayslips(hrId: string, month: string, year: number) {
        const payrolls = await Payroll.find({ hrId, month, year });
        const results = [];
        for (const p of payrolls) {
            try {
                const payslip = await this.generatePayslip(p._id.toString());
                results.push(payslip);
            } catch (err) {
                console.error(`Error generating payslip for ${p._id}:`, err);
            }
        }
        return results;
    }

    /**
     * Download payslip.
     */
    static async getPayslipByPayrollId(payrollId: string) {
        return await Payslip.findOne({ payrollId });
    }
}

export default PayslipService;
