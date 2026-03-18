import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import { employeeValidationRules, validate } from '../middlewares/validate';

const router = Router();

/**
 * Routes for Employee Management
 * Base route: /api/hr/employees
 */

// GET /employees - Return paginated list of employees with search support
router.get('/', EmployeeController.getEmployees);

// GET /employees/:id - Return employee details
router.get('/:id', EmployeeController.getEmployeeById);

// POST /employees - Create a new employee
router.post('/', employeeValidationRules, validate, EmployeeController.createEmployee);

// PUT /employees/:id - Update employee details
router.put('/:id', employeeValidationRules, validate, EmployeeController.updateEmployee);

// DELETE /employees/:id - Soft delete (set status = Inactive)
router.delete('/:id', EmployeeController.deleteEmployee);

export default router;
