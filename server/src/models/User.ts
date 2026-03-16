import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User interface for authentication.
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    role: 'hr' | 'employee';
    salaryDetails?: {
        basicSalary: number;
        housingAllowance: number;
        transportAllowance: number;
        taxDeduction: number;
    };
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
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
        required: function (this: any) { return !this.googleId; },
        minlength: 6,
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ['hr', 'employee'],
        default: 'employee'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    salaryDetails: {
        basicSalary: { type: Number, default: 4000 },
        housingAllowance: { type: Number, default: 800 },
        transportAllowance: { type: Number, default: 200 },
        taxDeduction: { type: Number, default: 500 }
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (this: any, next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
