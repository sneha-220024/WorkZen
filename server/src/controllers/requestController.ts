import { Request, Response } from 'express';
import RequestModel from '../models/Request';

// @desc    Get all requests for logged-in employee
// @route   GET /api/employee/requests
// @access  Private/Employee
export const getEmployeeRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as any;
        const requests = await RequestModel.find({ employeeId: user._id })
            .sort({ appliedAt: -1 });
            
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching employee requests:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a new request
// @route   POST /api/employee/requests
// @access  Private/Employee
export const createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user as any;
        const { type, subject, description, priority } = req.body;

        if (!type || !subject || !description) {
            res.status(400).json({ success: false, message: 'Please provide all required fields' });
            return;
        }

        const newRequest = await RequestModel.create({
            employeeId: user._id,
            type,
            subject,
            description,
            priority: priority || 'Medium',
            status: 'Pending'
        });

        res.status(201).json({
            success: true,
            data: newRequest
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all active requests for HR
// @route   GET /api/hr/requests
// @access  Private/HR
export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch requests and populate employee name and ID
        const requests = await RequestModel.find()
            .populate('employeeId', 'employeeId firstName lastName department')
            .sort({ appliedAt: -1 });
            
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update request status
// @route   PATCH /api/hr/requests/:id/status
// @access  Private/HR
export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user as any; // HR User ID

        if (!['Approved', 'Rejected'].includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }

        const request = await RequestModel.findById(id);

        if (!request) {
            res.status(404).json({ success: false, message: 'Request not found' });
            return;
        }

        request.status = status;
        request.resolvedBy = user._id;
        request.resolvedAt = new Date();

        await request.save();

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
