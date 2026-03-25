import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * HR interface representing the structure of an HR user.
 */
export interface IHR extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: 'hr';
    companyId?: string;
    createdAt?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const hrSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: false,   // optional — Google OAuth users have no password
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ['hr'],
        default: 'hr'
    },
    companyId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt (skip for Google OAuth users who have no password)
hrSchema.pre('save', async function (this: any, next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match hr entered password to hashed password in database
hrSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IHR>('HR', hrSchema);
