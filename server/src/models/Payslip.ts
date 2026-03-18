import mongoose, { Schema, Document } from 'mongoose';

/**
 * Payslip interface representing the structure of a Payslip record.
 */
export interface IPayslip extends Document {
    payrollId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    pdfUrl: string;
    createdAt?: Date;
}

const PayslipSchema: Schema = new Schema(
    {
        payrollId: {
            type: Schema.Types.ObjectId,
            ref: 'Payroll',
            required: [true, 'Payroll reference is required'],
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Employee reference is required'],
        },
        pdfUrl: {
            type: String,
            required: [true, 'PDF URL is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

export default mongoose.model<IPayslip>('Payslip', PayslipSchema);
