import { Router } from 'express';
import AttendanceController from '../controllers/AttendanceController';

const router = Router();

/**
 * Routes for Attendance Management
 * Base route: /api/hr/attendance
 */

// POST /attendance/checkin - Employee check-in
router.post('/checkin', AttendanceController.checkIn);

// POST /attendance/checkout - Employee check-out
router.post('/checkout', AttendanceController.checkOut);

// GET /attendance/today - Return today's attendance list
router.get('/today', AttendanceController.getTodaysAttendance);

// GET /attendance/employee/:employeeId - Return attendance history of employee
router.get('/employee/:employeeId', AttendanceController.getEmployeeAttendanceHistory);

export default router;
