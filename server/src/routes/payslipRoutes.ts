import { Router } from 'express';
import PayslipController from '../controllers/PayslipController';

const router = Router();

// Base route: /api/hr/payslip or /api/payslip
// Let's use /api/hr/payslip for consistency in app.ts

router.post('/generate/:payrollId', PayslipController.generatePayslip);
router.post('/generate-all', PayslipController.generateAllPayslips);
router.get('/download/:id', PayslipController.downloadPayslip);

export default router;
