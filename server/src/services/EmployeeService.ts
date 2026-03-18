import Employee, { IEmployee, IEmployeeDocument } from '../models/Employee';
import { generateEmployeeId } from '../utils/helpers';

/**
 * Service class for Employee related business logic.
 */
class EmployeeService {
    /**
     * Create a new employee in the system.
     * @param {Partial<IEmployee>} employeeData Data for the new employee.
     * @returns {Promise<IEmployee>} The created employee.
     */
    static async createEmployee(employeeData: Partial<IEmployee>): Promise<IEmployeeDocument> {
        const employeeId = await generateEmployeeId();
        
        // Ensure name is present as combined firstName and lastName if not provided
        if (!employeeData.name) {
            employeeData.name = `${employeeData.firstName} ${employeeData.lastName}`.trim();
        }

        // Set mandatory password if missing (default to employeeId or welcome123)
        if (!employeeData.password) {
            employeeData.password = "welcome123"; 
        }

        const employee = new Employee({
            ...employeeData,
            employeeId,
        });
        return await employee.save();
    }

    /**
     * Retrieve all employees with pagination and search support.
     * @param {number} page Page number for pagination.
     * @param {number} limit Number of records per page.
     * @param {string} search Search term (name or department).
     * @returns {Promise<{ employees: IEmployee[], total: number }>}
     */
    static async getAllEmployees(page: number = 1, limit: number = 10, search: string = '', hrId?: any): Promise<{ employees: IEmployeeDocument[], total: number }> {
        const query: any = { status: { $ne: 'Inactive' } };
        
        if (hrId) {
            query.$or = [{ hrId: hrId }, { addedBy: hrId }];
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const searchFilter = {
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { department: searchRegex },
                    { employeeId: searchRegex },
                ]
            };

            // Combine filters using $and to ensure both status/addedBy AND search match
            const finalQuery = {
                $and: [
                    { ...query },
                    searchFilter
                ]
            };

            const total = await Employee.countDocuments(finalQuery);
            const employees = await Employee.find(finalQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            return { employees, total };
        }

        const total = await Employee.countDocuments(query);
        const employees = await Employee.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return { employees, total };
    }

    /**
     * Get an employee by their email address.
     * @param {string} email The email of the employee.
     * @returns {Promise<IEmployee | null>} The employee document.
     */
    static async getEmployeeByEmail(email: string): Promise<IEmployeeDocument | null> {
        return await Employee.findOne({ email });
    }

    /**
     * Get an employee by their MongoDB ObjectId.
     * @param {string} id The ObjectId of the employee.
     * @returns {Promise<IEmployee | null>} The employee document.
     */
    static async getEmployeeById(id: string): Promise<IEmployeeDocument | null> {
        return await Employee.findById(id);
    }

    /**
     * Update an employee's details.
     * @param {string} id The ObjectId of the employee.
     * @param {Partial<IEmployee>} updateData Data to update.
     * @returns {Promise<IEmployee | null>} The updated employee.
     */
    static async updateEmployee(id: string, updateData: Partial<IEmployee>): Promise<IEmployeeDocument | null> {
        return await Employee.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    /**
     * Soft delete an employee by setting their status to Inactive.
     * @param {string} id The ObjectId of the employee.
     * @returns {Promise<IEmployee | null>}
     */
    static async softDeleteEmployee(id: string): Promise<IEmployeeDocument | null> {
        return await Employee.findByIdAndUpdate(id, { status: 'Inactive' }, { new: true });
    }
}

export default EmployeeService;
