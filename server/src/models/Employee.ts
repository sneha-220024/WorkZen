import mongoose, { Schema, Document } from 'mongoose';

/**
 * Employee interface representing the structure of an Employee.
 */
export interface IEmployee {
    employeeId: string;
    firstName: string;
    lastName: string;
    name: string; // Combined name as requested
    email: string;
    password?: string; // New: for login
    phone: string;
    department: string;
    role: 'admin' | 'hr' | 'employee';
    designation: string;
    baseSalary: number; // For backward compatibility or just keeping it
    salaryStructure: {
        baseSalary: number;
        hra: number;
        allowance: number;
        taxPercent: number;
    };
    joinDate: Date;
    status: 'Active' | 'On Leave' | 'Inactive';
    avatar?: string;
    address: string;
    emergencyContact: string;
    addedBy?: mongoose.Types.ObjectId; // HR who added this employee
    hrId?: mongoose.Types.ObjectId; // Consistent with requirement
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IEmployeeDocument extends IEmployee, Document {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

/**
 * Employee Schema for Mongoose.
 * This model stores all details related to an employee.
 */
const EmployeeSchema: Schema = new Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'hr', 'employee'],
            default: 'employee',
        },
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
        },
        salaryStructure: {
            baseSalary: { type: Number, required: true, default: 0 },
            hra: { type: Number, required: true, default: 0 },
            allowance: { type: Number, required: true, default: 0 },
            taxPercent: { type: Number, required: true, default: 0 },
        },
        baseSalary: {
            type: Number,
            required: [true, 'Base salary is required'],
            min: [0, 'Salary cannot be negative'],
        },
        joinDate: {
            type: Date,
            required: [true, 'Join date is required'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Active', 'On Leave', 'Inactive'],
            default: 'Active',
        },
        avatar: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        emergencyContact: {
            type: String,
            required: [true, 'Emergency contact is required'],
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        hrId: {
            type: Schema.Types.ObjectId,
            ref: 'HR', // Will point to new HR model if created, or User
            index: true,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

import bcrypt from 'bcryptjs';

// Encrypt password using bcrypt
EmployeeSchema.pre('save', async function (this: any, next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
EmployeeSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
export default mongoose.model<IEmployeeDocument>('Employee', EmployeeSchema);
