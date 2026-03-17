import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation results.
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({ field: (err as any).path, message: err.msg }))
        });
    }
    next();
};

/**
 * Validation rules for Employee creation/update.
 */
export const employeeValidationRules = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('baseSalary').isNumeric().withMessage('Base salary must be a number'),
    body('address').notEmpty().withMessage('Address is required'),
    body('emergencyContact').notEmpty().withMessage('Emergency contact is required'),
];

/**
 * Validation rules for Leave application.
 */
export const leaveValidationRules = [
    body('employeeId').optional().isMongoId().withMessage('Invalid employee ID'),
    body('leaveType').isIn(['Casual', 'Sick', 'Work From Home', 'Vacation', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave']).withMessage('Invalid leave type'),
    body('startDate').isISO8601().toDate().withMessage('Invalid start date'),
    body('endDate').isISO8601().toDate().withMessage('Invalid end date'),
    body('reason').notEmpty().withMessage('Reason is required'),
];

/**
 * Validation rules for Payroll generation.
 */
export const payrollValidationRules = [
    body('employeeId').isMongoId().withMessage('Invalid employee ID'),
    body('month').notEmpty().withMessage('Month is required'),
    body('year').isNumeric().withMessage('Year must be a number'),
];
