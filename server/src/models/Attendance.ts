import mongoose, { Schema, Document } from 'mongoose';

/**
 * Attendance interface representing the structure of an Attendance record.
 */
export interface IAttendance {
    employeeId: mongoose.Types.ObjectId;
    date: Date;
    checkInTime: Date;
    checkOutTime?: Date;
    totalHours?: number;
    status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Working';
    createdAt?: Date;
}

export interface IAttendanceDocument extends IAttendance, Document {}

/**
 * Attendance Schema for Mongoose.
 * Each document represents a single day's attendance for an employee.
 */
const AttendanceSchema: Schema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    checkInTime: {
        type: Date,
        required: [true, 'Check-in time is required'],
    },
    checkOutTime: {
        type: Date,
    },
    totalHours: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Half Day', 'Working'],
        default: 'Present',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

/**
 * Pre-save middleware to calculate total hours if check-out time is provided.
 */
AttendanceSchema.pre('save', function(next) {
    if (this.checkInTime && this.checkOutTime) {
        const diffMs = this.checkOutTime.getTime() - this.checkInTime.getTime();
        this.totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2)); // Convert ms to hours
    }
    next();
});

// Ensure an employee has only one attendance record per day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);
