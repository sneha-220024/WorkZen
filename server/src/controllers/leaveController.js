const Leave = require('../models/Leave');

// Leave allowances per employee (can be made configurable later)
const LEAVE_ALLOWANCES = {
    annual: 12,
    sick: 10,
};

// Count calendar days between two YYYY-MM-DD strings (inclusive)
const countDays = (start, end) => {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
};

// @desc    Get all leave requests for logged-in employee
// @route   GET /api/leaves
// @access  Private (Employee)
exports.getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Submit a new leave request
// @route   POST /api/leaves
// @access  Private (Employee)
exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
        }

        const leave = await Leave.create({
            employeeId: req.user._id,
            employeeName: req.user.name,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending'
        });

        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get leave balance for logged-in employee
// @route   GET /api/leaves/balance
// @access  Private (Employee)
exports.getLeaveBalance = async (req, res) => {
    try {
        // Fetch all approved leaves for this employee
        const approvedLeaves = await Leave.find({
            employeeId: req.user._id,
            status: 'Approved'
        });

        // Tally used days per leave type
        const usedDays = { annual: 0, sick: 0, unpaid: 0 };

        approvedLeaves.forEach(leave => {
            const days = countDays(leave.startDate, leave.endDate);
            if (leave.leaveType === 'annual') usedDays.annual += days;
            else if (leave.leaveType === 'sick') usedDays.sick += days;
            else if (leave.leaveType === 'unpaid') usedDays.unpaid += days;
        });

        const balance = {
            annual: {
                total: LEAVE_ALLOWANCES.annual,
                used: usedDays.annual,
                remaining: Math.max(0, LEAVE_ALLOWANCES.annual - usedDays.annual)
            },
            sick: {
                total: LEAVE_ALLOWANCES.sick,
                used: usedDays.sick,
                remaining: Math.max(0, LEAVE_ALLOWANCES.sick - usedDays.sick)
            },
            unpaid: {
                taken: usedDays.unpaid
            }
        };

        res.status(200).json({ success: true, data: balance });
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

