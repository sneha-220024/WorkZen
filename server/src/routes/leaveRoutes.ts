import { Router } from 'express';
import LeaveController from '../controllers/LeaveController';
import { leaveValidationRules, validate } from '../middlewares/validate';

const router = Router();

/**
 * Routes for Leave Management
 * Base route: /api/hr/leaves
 */

// POST /leaves/apply - Employee applies for leave
router.post('/apply', leaveValidationRules, validate, LeaveController.applyLeave);

// GET /leaves - Return all leave requests
router.get('/', LeaveController.getLeaves);

// PUT /leaves/:id/approve - HR approves leave
router.put('/:id/approve', LeaveController.approveLeave);

// PUT /leaves/:id/reject - HR rejects leave
router.put('/:id/reject', LeaveController.rejectLeave);

export default router;
