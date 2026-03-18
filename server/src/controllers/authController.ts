import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HR from '../models/HR';
import Employee from '../models/Employee';

// Generate JWT
const generateToken = (id: any, role: string) => {
    return jwt.sign({ userId: id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

/**
 * Register user
 */
export const register = async (req: Request, res: Response) => {
    try {
        let { name, email, password, companyId, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        
        email = email.toLowerCase().trim();
        const targetRole = role?.toLowerCase() || 'hr';

        // 1. Check if user exists in HR collection
        const hrExists = await HR.findOne({ email });
        if (hrExists) {
            return res.status(400).json({ success: false, message: 'User already exists as HR' });
        }

        // 2. Check if user exists in Employee collection
        const empExists = await Employee.findOne({ email });

        if (targetRole === 'employee') {
            if (empExists) {
                // UPDATE existing employee
                empExists.password = password;
                if (name) empExists.name = name.trim();
                empExists.role = 'employee';
                await empExists.save();

                return res.status(200).json({
                    success: true,
                    _id: empExists._id,
                    name: empExists.name || (name || '').trim(),
                    email: empExists.email,
                    role: 'employee',
                    token: generateToken(empExists._id, 'employee')
                });
            } else {
                // CREATE new standalone employee
                const nameParts = (name || '').trim().split(' ');
                const firstName = nameParts[0] || 'New';
                const lastName = nameParts.slice(1).join(' ') || 'Employee';

                const employee = await Employee.create({
                    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                    firstName,
                    lastName,
                    name: (name || '').trim(),
                    email,
                    password,
                    phone: 'Not Provided',
                    department: 'Onboarding',
                    designation: 'Staff',
                    address: 'Not Provided',
                    emergencyContact: 'Not Provided',
                    role: 'employee',
                    baseSalary: 0,
                    salaryStructure: {
                        baseSalary: 0,
                        hra: 0,
                        allowance: 0,
                        taxPercent: 0
                    }
                });

                return res.status(201).json({
                    success: true,
                    _id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    role: 'employee',
                    token: generateToken(employee._id, 'employee')
                });
            }
        } else {
            // Registering as HR
            if (empExists) {
                return res.status(400).json({ success: false, message: 'This email is already registered as an Employee' });
            }

            const hr = await HR.create({
                name: (name || '').trim(),
                email,
                password,
                companyId,
                role: 'hr'
            });

            if (hr) {
                return res.status(201).json({
                    success: true,
                    _id: hr._id,
                    name: hr.name,
                    email: hr.email,
                    role: 'hr',
                    token: generateToken(hr._id, 'hr')
                });
            }
        }
        
        res.status(400).json({ success: false, message: 'Invalid registration data' });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Authenticate user
 */
export const login = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        email = email.toLowerCase().trim();

        // Check HR first
        let user = await HR.findOne({ email }).select('+password');
        let role = 'hr';

        if (!user) {
            // Check Employee
            user = await Employee.findOne({ email }).select('+password') as any;
            role = 'employee';
        }

        if (user && (await (user as any).matchPassword(password))) {
            const userName = (user as any).name || (user as any).firstName + ' ' + (user as any).lastName;
            const finalRole = (user as any).role?.toLowerCase() || role;

            res.json({
                success: true,
                _id: user._id,
                name: userName,
                email: user.email,
                role: finalRole,
                token: generateToken(user._id, finalRole)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get current user
 */
export const getMe = async (req: any, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
