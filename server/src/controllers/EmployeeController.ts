import { Request, Response, NextFunction } from 'express';
import EmployeeService from '../services/EmployeeService';
import { IEmployee } from '../models/Employee';
import emailService from '../services/email.service';
import ActivityService from '../services/ActivityService';

/**
 * Controller class to handle Employee related HTTP requests.
 */
class EmployeeController {
    /**
     * Get paginated and searchable list of employees.
     */
    static async getEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || '';
            const userRole = (req as any).user?.role?.toLowerCase();
            const hrId = userRole === 'hr' ? (req as any).user._id : undefined;

            const { employees, total } = await EmployeeService.getAllEmployees(page, limit, search, hrId);

            res.status(200).json({
                success: true,
                data: {
                    employees,
                    total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get employee details by ID.
     */
    static async getEmployeeById(req: any, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id as string);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }
            
            // HR can only see employees they added
            if (req.user.role === 'hr') {
                const isOwner = employee.addedBy?.toString() === req.user._id.toString() || employee.hrId?.toString() === req.user._id.toString();
                if (!isOwner) {
                    return res.status(403).json({ success: false, message: 'Access denied. You can only manage employees you added.' });
                }
            }

            res.status(200).json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get profile of currently logged in employee.
     */
    static async getProfile(req: any, res: Response, next: NextFunction) {
        try {
            const email = req.user.email;
            const employee = await EmployeeService.getEmployeeByEmail(email);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }
            res.status(200).json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update profile of currently logged in employee.
     */
    static async updateProfile(req: any, res: Response, next: NextFunction) {
        try {
            const email = req.user.email;
            const employee = await EmployeeService.getEmployeeByEmail(email);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee profile not found' });
            }

            const employeeData = req.body;
            // Fields allowed to be updated by the employee themselves
            const allowedUpdates: any = {
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                name: employeeData.name,
                phone: employeeData.phone,
                address: employeeData.address,
            };

            // Only update password if provided
            if (employeeData.password) {
                allowedUpdates.password = employeeData.password;
            }

            const updatedEmployee = await EmployeeService.updateEmployee(employee._id.toString(), allowedUpdates);

            // Also update Auth user record if necessary. WorkZen auth routes might be using User model
            // But from EmployeeService create, it seems Employee model might handle login 
            // In case there is an underlying User model, we might need a UserService but let's stick to Employee for now.

            res.status(200).json({ success: true, data: updatedEmployee });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new employee.
     */
    static async createEmployee(req: any, res: Response, next: NextFunction) {
        try {
            const employeeData: Partial<IEmployee> = req.body;
            const userRole = req.user?.role?.toLowerCase();
            let hrName = "HR Team";
            let companyName = "WorkZen";

            if (req.user && userRole === 'hr') {
                employeeData.addedBy = req.user._id;
                employeeData.hrId = req.user._id;
                if (req.user.firstName) {
                    hrName = `${req.user.firstName} ${req.user.lastName || ''}`.trim();
                }
            }
            const employee = await EmployeeService.createEmployee(employeeData);

            // Trigger Welcome Email asynchronously (non-blocking)
            if (employee.email) {
                const subject = `Welcome to ${companyName}`;
                const html = `
                    <h2>Welcome, ${employee.name || employee.firstName}!</h2>
                    <p>You have been successfully added to our system.</p>
                    <p><strong>Role:</strong> ${employee.designation || 'Employee'}</p>
                    <br/>
                    <p>Best regards,</p>
                    <p>${hrName} / ${companyName}</p>
                `;
                emailService.sendEmail({
                    to: employee.email,
                    subject,
                    html
                }); // Fire and forget
            }
            // Log Activity
            const hrName = req.user?.name || 'HR';
            await ActivityService.logActivity(
                'employee_added',
                `${employee.name} — Added to the system by ${hrName}`,
                employee.name,
                req.user?._id
            );

            res.status(201).json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update employee details.
     */
    static async updateEmployee(req: any, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id as string);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            // HR can only update employees they added
            if (req.user.role === 'hr') {
                const isOwner = employee.addedBy?.toString() === req.user._id.toString() || employee.hrId?.toString() === req.user._id.toString();
                if (!isOwner) {
                    return res.status(403).json({ success: false, message: 'Access denied. You can only manage employees you added.' });
                }
            }

            const employeeData: Partial<IEmployee> = req.body;
            const updatedEmployee = await EmployeeService.updateEmployee(req.params.id as string, employeeData);

            // Log Activity
            const hrNameU = req.user?.name || 'HR';
            await ActivityService.logActivity(
                'employee_updated',
                `${updatedEmployee?.name || 'Employee'} — Details updated by ${hrNameU}`,
                updatedEmployee?.name,
                req.user?._id
            );

            res.status(200).json({ success: true, data: updatedEmployee });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Soft delete an employee.
     */
    static async deleteEmployee(req: any, res: Response, next: NextFunction) {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id as string);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Employee not found' });
            }

            // HR can only delete employees they added
            if (req.user.role === 'hr') {
                const isOwner = employee.addedBy?.toString() === req.user._id.toString() || employee.hrId?.toString() === req.user._id.toString();
                if (!isOwner) {
                    return res.status(403).json({ success: false, message: 'Access denied. You can only manage employees you added.' });
                }
            }

            await EmployeeService.softDeleteEmployee(req.params.id as string);

            // Log Activity
            const hrNameD = req.user?.name || 'HR';
            await ActivityService.logActivity(
                'employee_deleted',
                `${employee.name} — Account deactivated by ${hrNameD}`,
                employee.name,
                req.user?._id
            );

            res.status(200).json({ success: true, message: 'Employee deactivated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;
