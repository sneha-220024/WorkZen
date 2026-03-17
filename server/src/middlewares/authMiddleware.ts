import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HR from '../models/HR';
import Employee from '../models/Employee';

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

            // Get user from the token - Check both collections
            let user = await HR.findById(decoded.userId).select('-password');
            let actualRole = 'hr';

            if (!user) {
                user = await Employee.findById(decoded.userId).select('-password') as any;
                actualRole = 'employee';
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = user;
            // Set role from database record or fallback to collection type
            req.user.role = (user as any).role?.toLowerCase() || actualRole;

            return next();
        } catch (error) {
            console.error(error);
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
