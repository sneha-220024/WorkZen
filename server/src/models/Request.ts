import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest {
    employeeId: mongoose.Types.ObjectId;
    type: string;
    subject: string;
    description: string;
    priority?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: Date;
    resolvedBy?: mongoose.Types.ObjectId;
    resolvedAt?: Date;
}

export interface IRequestDocument extends IRequest, Document {}

const RequestSchema: Schema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'Employee reference is required'],
    },
    type: {
        type: String,
        required: [true, 'Request type is required'],
        trim: true,
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
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
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    resolvedAt: {
        type: Date,
    }
});

export default mongoose.model<IRequestDocument>('Request', RequestSchema);
