import { Router } from 'express';
import PayrollController from '../controllers/PayrollController';
import { payrollValidationRules, validate } from '../middlewares/validate';

const router = Router();

/**
 * Routes for Payroll Management
 * Base route: /api/hr/payroll
 */

// GET /api/hr/payroll - Return payroll list for HR
router.get('/', PayrollController.getHRPayroll);

// POST /api/hr/payroll/generate - Generate payroll for all employees
router.post('/generate', PayrollController.generateAllPayroll);

// PATCH /api/hr/payroll/pay/:id - Mark payroll as Paid (requirement says PATCH)
router.patch('/pay/:id', PayrollController.markAsPaid);

export default router;
