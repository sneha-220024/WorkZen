import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HR from '../models/HR';
import Employee from '../models/Employee';
import User from '../models/User';

/**
 * Middleware to protect routes and ensure user is authenticated.
 */
export const protect = async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            const userId = decoded.userId;

            // 1. Try finding explicitly in HR or Employee by ID (most common)
            let user: any = await HR.findById(userId).select('-password');
            let role = 'hr';

            if (!user) {
                user = await Employee.findById(userId).select('-password');
                role = 'employee';
            }

            // 2. Fallback: If not found by ID, it might be a ID from the 'User' collection
            if (!user) {
                const authUser = await User.findById(userId).select('-password');
                if (authUser) {
                    role = authUser.role;
                    // Find the actual profile by email
                    if (role === 'hr') {
                        user = await HR.findOne({ email: authUser.email }).select('-password');
                    } else {
                        user = await Employee.findOne({ email: authUser.email }).select('-password');
                    }
                    
                    // If no profile yet, use the authUser as the base
                    if (!user) {
                        user = authUser;
                    }
                }
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found or profile missing' });
            }

            req.user = user;
            // Ensure role is normalized and present
            req.user.role = (user as any).role?.toLowerCase() || role;

            return next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
    }

    if (!token) {
        // Also check for session-based user (Google Auth)
        if (req.user) {
            return next();
        }
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
