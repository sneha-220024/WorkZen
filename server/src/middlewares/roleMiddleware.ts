import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authorize specific roles.
 */
export const authorize = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

export const checkHR = authorize('hr');
export const checkEmployee = authorize('employee');
