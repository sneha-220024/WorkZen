import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import AttendanceController from '../controllers/AttendanceController';
import LeaveController from '../controllers/LeaveController';
import DashboardController from '../controllers/DashboardController';
import { leaveValidationRules, validate } from '../middlewares/validate';

const router = Router();

/**
 * Routes for Employee Personal Dashboard
 * Base route: /api/employee
 */

// Profile
router.get('/profile', EmployeeController.getProfile);
router.put('/profile', EmployeeController.updateProfile);

// Dashboard Stats
router.get('/dashboard-stats', DashboardController.getEmployeeDashboardStats);

// Attendance
router.post('/attendance/check-in', AttendanceController.checkIn);
router.post('/attendance/check-out', AttendanceController.checkOut);
router.get('/attendance/history', AttendanceController.getMyAttendanceHistory);

// Leaves
router.post('/leaves/apply', leaveValidationRules, validate, LeaveController.applyLeave);
router.get('/leaves/history', LeaveController.getMyLeaves);

// Payroll & Payslips
import PayrollController from '../controllers/PayrollController';
import PayslipController from '../controllers/PayslipController';
router.get('/payroll', PayrollController.getEmployeePayroll);
router.get('/payslip/download/:id', PayslipController.downloadPayslip);

export default router;
