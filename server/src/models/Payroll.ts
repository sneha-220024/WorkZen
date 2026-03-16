import mongoose, { Schema, Document } from 'mongoose';

/**
 * Payroll interface representing the structure of a Payroll record.
 */
export interface IPayroll {
    employeeId: mongoose.Types.ObjectId;
    hrId: mongoose.Types.ObjectId; // New: reference to HR who generated it
    month: string; // e.g., "January"
    year: number;
    workingDays: number;
    presentDays: number;
    absentDays: number;
    baseSalary: number;
    bonus: number;
    deductions: number;
    tax: number;
    grossSalary: number;
    netSalary: number;
    status: 'Paid' | 'Unpaid'; // Changed from 'Pending' as requested
    generatedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPayrollDocument extends IPayroll, Document {}

/**
 * Payroll Schema for Mongoose.
 * This model stores the payroll records for employees for each month.
 */
const PayrollSchema: Schema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Employee reference is required'],
        },
        hrId: {
            type: Schema.Types.ObjectId,
            ref: 'HR',
            required: [true, 'HR reference is required'],
        },
        month: {
            type: String,
            required: [true, 'Month is required'],
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
        },
        workingDays: {
            type: Number,
            required: true,
            default: 0,
        },
        presentDays: {
            type: Number,
            required: true,
            default: 0,
        },
        absentDays: {
            type: Number,
            required: true,
            default: 0,
        },
        baseSalary: {
            type: Number,
            required: [true, 'Base salary is required'],
        },
        bonus: {
            type: Number,
            default: 0,
        },
        deductions: {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        grossSalary: {
            type: Number,
            required: true,
            default: 0,
        },
        netSalary: {
            type: Number,
            required: [true, 'Net salary is required'],
        },
        status: {
            type: String,
            enum: ['Paid', 'Unpaid'],
            default: 'Unpaid',
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// netSalary is calculated in the service, but we can have it here too if needed.
// However, the rule netSalary = grossSalary + bonus - deductions - tax
PayrollSchema.pre('save', function(this: any, next) {
    this.netSalary = this.grossSalary + this.bonus - this.deductions - this.tax;
    next();
});

// Ensure a payroll record is unique for an employee, month, and year
PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayrollDocument>('Payroll', PayrollSchema);
