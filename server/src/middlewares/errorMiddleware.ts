import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware.
 * Catches all errors and returns a consistent JSON response.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error occurred:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    }

    // Handle Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found with id of ${err.value}`;
    }

    // Handle Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
