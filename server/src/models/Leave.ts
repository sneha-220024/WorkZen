import mongoose, { Schema, Document } from 'mongoose';

/**
 * Leave interface representing the structure of a Leave request.
 */
export interface ILeave {
    employeeId: mongoose.Types.ObjectId;
    leaveType: 'Casual' | 'Sick' | 'Work From Home' | 'Vacation' | 'Sick Leave' | 'Personal Leave' | 'Maternity Leave' | 'Paternity Leave';
    startDate: Date;
    endDate: Date;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt?: Date;
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
}

export interface ILeaveDocument extends ILeave, Document {}

/**
 * Leave Schema for Mongoose.
 * This model stores all leave applications and their status.
 */
const LeaveSchema: Schema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
    },
    leaveType: {
        type: String,
        enum: ['Casual', 'Sick', 'Work From Home', 'Vacation', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave'],
        required: [true, 'Leave type is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    days: {
        type: Number,
        required: [true, 'Number of days is required'],
    },
    reason: {
        type: String,
        required: [true, 'Reason for leave is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Referencing the HR/Admin who approved/rejected
    },
    approvedAt: {
        type: Date,
    }
});

export default mongoose.model<ILeaveDocument>('Leave', LeaveSchema);
