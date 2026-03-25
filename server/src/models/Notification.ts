import mongoose, { Schema, Document } from 'mongoose';

/**
 * Notification interface representing the structure of a Notification record.
 */
export interface INotification {
    employeeId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'attendance' | 'leave' | 'hr' | 'system';
    isRead: boolean;
    createdAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}

/**
 * Notification Schema for Mongoose.
 * This model stores all user-specific notifications.
 */
const NotificationSchema: Schema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['attendance', 'leave', 'hr', 'system'],
        default: 'system',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Index for performance when fetching notifications for an employee
NotificationSchema.index({ employeeId: 1, createdAt: -1 });

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);
