import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorMiddleware';
import { protect } from './middlewares/authMiddleware';
import { checkHR } from './middlewares/roleMiddleware';

// Import Routes
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import employeeRoutes from './routes/employeeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRoutes from './routes/leaveRoutes';
import payrollRoutes from './routes/payrollRoutes';
import employeeDashboardRoutes from './routes/employeeDashboardRoutes';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

// Passport config
import './config/passport';

import payslipRoutes from './routes/payslipRoutes';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // Serve uploads

// Express Session
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Employee Personal Dashboard Routes
app.use('/api/employee', protect, employeeDashboardRoutes);
app.use('/api/notifications', protect, notificationRoutes);

// HR Dashboard Routes (Protected)
app.use('/api/hr/dashboard', protect, checkHR, dashboardRoutes);
app.use('/api/hr/employees', protect, checkHR, employeeRoutes);
app.use('/api/hr/attendance', protect, checkHR, attendanceRoutes);
app.use('/api/hr/leaves', protect, checkHR, leaveRoutes);
app.use('/api/hr/payroll', protect, checkHR, payrollRoutes);
app.use('/api/hr/payslip', protect, checkHR, payslipRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('WorkZen HR Dashboard API is running...');
});

// Global Error Handler
app.use(errorHandler);

export default app;
