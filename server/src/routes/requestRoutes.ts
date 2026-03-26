import express from 'express';
import { getEmployeeRequests, createRequest, getAllRequests, updateRequestStatus } from '../controllers/requestController';
import { protect } from '../middlewares/authMiddleware';
import { checkHR } from '../middlewares/roleMiddleware';

const router = express.Router();

// --------------------------------------------------------------------------
// Note: This router is mounted at TWO places in app.ts:
// 1) /api/employee/requests
// 2) /api/hr/requests
// We'll separate HR and Employee routes cleanly, or just use one router for both.
// Given checkHR might need to be applied selectively, let's create two separate routers.
// --------------------------------------------------------------------------

// Employee Routes (mounted at /api/employee/requests)
export const employeeRequestRoutes = express.Router();
employeeRequestRoutes.route('/')
    .get(getEmployeeRequests)
    .post(createRequest);

// HR Routes (mounted at /api/hr/requests)
export const hrRequestRoutes = express.Router();
hrRequestRoutes.route('/')
    .get(getAllRequests);
    
hrRequestRoutes.route('/:id/status')
    .patch(updateRequestStatus);

export default { employeeRequestRoutes, hrRequestRoutes };
