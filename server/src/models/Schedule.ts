import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule {
    employeeId: mongoose.Types.ObjectId;
    employeeName: string;
    employeeEmail: string;
    date: Date;
    time: string;
    reason: 'Meeting' | 'Discussion' | 'Review' | 'Other';
    meetingLink: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IScheduleDocument extends ISchedule, Document {}

const ScheduleSchema: Schema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: [true, 'Employee ID is required'],
        },
        employeeName: {
            type: String,
            required: [true, 'Employee name is required'],
        },
        employeeEmail: {
            type: String,
            required: [true, 'Employee email is required'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        reason: {
            type: String,
            enum: ['Meeting', 'Discussion', 'Review', 'Other'],
            required: [true, 'Reason is required'],
        },
        meetingLink: {
            type: String,
            required: [true, 'Meeting link is required'],
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IScheduleDocument>('Schedule', ScheduleSchema);
