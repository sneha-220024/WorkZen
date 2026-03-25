import mongoose, { Schema, Document } from 'mongoose';

/**
 * Activity interface representing the structure of an HR Activity record.
 */
export interface IActivity {
    type: string;
    message: string;
    employeeName?: string;
    hrId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

export interface IActivityDocument extends IActivity, Document {}

/**
 * Activity Schema for Mongoose.
 * This model stores all HR-wide activities for the dashboard and notifications.
 */
const ActivitySchema: Schema = new Schema({
    type: {
        type: String,
        required: [true, 'Activity type is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    employeeName: {
        type: String,
        trim: true,
    },
    hrId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
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

// Index for performance
ActivitySchema.index({ createdAt: -1 });

export default mongoose.model<IActivityDocument>('Activity', ActivitySchema);
