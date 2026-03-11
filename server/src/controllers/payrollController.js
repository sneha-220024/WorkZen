const Leave = require('../models/Leave');
const User = require('../models/User');

// Helper to calculate working days (Mon-Fri) in a given month
const getWorkingDaysInMonth = (year, month) => {
    let count = 0;
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) count++;
        date.setDate(date.getDate() + 1);
    }
    return count;
};

// Helper to count days between dates
const countDays = (start, end) => {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
};

// @desc    Get my payslip data with unpaid leave deduction
// @route   GET /api/payroll/my-payslip
// @access  Private
exports.getMyPayslip = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { basicSalary, housingAllowance, transportAllowance, taxDeduction } = user.salaryDetails;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed

        const totalWorkingDays = getWorkingDaysInMonth(year, month);
        const perDaySalary = basicSalary / totalWorkingDays;

        // Fetch approved unpaid leaves for this month
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        const unpaidLeaves = await Leave.find({
            employeeId: req.user._id,
            leaveType: 'unpaid',
            status: 'Approved',
            startDate: { $gte: startOfMonth.toISOString().split('T')[0] },
            endDate: { $lte: endOfMonth.toISOString().split('T')[0] }
        });

        let unpaidDays = 0;
        unpaidLeaves.forEach(leave => {
            unpaidDays += countDays(leave.startDate, leave.endDate);
        });

        const unpaidDeduction = perDaySalary * unpaidDays;
        const totalAdditions = basicSalary + housingAllowance + transportAllowance;
        const totalDeductions = taxDeduction + unpaidDeduction;
        const netSalary = totalAdditions - totalDeductions;

        res.status(200).json({
            success: true,
            data: {
                month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
                breakdown: {
                    basicSalary,
                    housingAllowance,
                    transportAllowance,
                    taxDeduction,
                    unpaidLeaveDeduction: unpaidDeduction,
                    unpaidDays
                },
                netSalary
            }
        });
    } catch (error) {
        console.error('Error calculating payslip:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
