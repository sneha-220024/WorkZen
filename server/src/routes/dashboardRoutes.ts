import { Router } from 'express';
import DashboardController from '../controllers/DashboardController';

const router = Router();

/**
 * Routes for HR Dashboard Overview
 * Base route: /api/hr/dashboard
 */

// GET /api/hr/dashboard - Return summary statistics
router.get('/', DashboardController.getDashboardStats);

export default router;
