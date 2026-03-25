import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router = Router();

/**
 * Routes for Schedule Management
 * Base route: /api/hr/schedules
 */

// POST / - Create a new schedule
router.post('/', ScheduleController.createSchedule);

// GET / - Get all schedules (optional)
router.get('/', ScheduleController.getSchedules);

export default router;
