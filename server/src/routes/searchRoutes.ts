import express from 'express';
import { globalSearch } from '../controllers/SearchController';

const router = express.Router();

/**
 * @route   GET /api/hr/search
 * @desc    Global unified search for Leave, Payroll, and Payslips.
 * @access  Private (HR)
 */
router.get('/', globalSearch);

export default router;
