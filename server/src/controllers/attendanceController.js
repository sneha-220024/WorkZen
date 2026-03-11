const Attendance = require('../models/Attendance');

// Helper: get today's date string in local timezone (YYYY-MM-DD)
const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// @desc    Get attendance for logged in employee
// @route   GET /api/attendance
// @access  Private (Employee only)
exports.getAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ employeeId: req.user._id }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: attendanceRecords.length,
            data: attendanceRecords
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Check in an employee
// @route   POST /api/attendance/check-in
// @access  Private (Employee only)
exports.checkIn = async (req, res) => {
    try {
        const today = getTodayLocal();

        // Prevent duplicate check-in on the same day
        const existingRecord = await Attendance.findOne({ employeeId: req.user._id, date: today });
        if (existingRecord) {
            return res.status(400).json({ success: false, message: 'Already checked in for today' });
        }

        const now = new Date();
        const checkInHour = now.getHours();
        const checkInMinutes = now.getMinutes();

        // Mark as Late if checking in after 9:00 AM
        let status = 'Working';
        if (checkInHour > 9 || (checkInHour === 9 && checkInMinutes > 0)) {
            status = 'Late';
        }

        const newAttendance = await Attendance.create({
            employeeId: req.user._id,
            employeeName: req.user.name,
            date: today,
            checkIn: now,
            checkOut: null,
            hoursWorked: 0,
            status: status
        });

        res.status(201).json({
            success: true,
            data: newAttendance
        });
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Check out an employee
// @route   POST /api/attendance/check-out
// @access  Private (Employee only)
exports.checkOut = async (req, res) => {
    try {
        const today = getTodayLocal();

        const record = await Attendance.findOne({ employeeId: req.user._id, date: today });
        if (!record) {
            return res.status(404).json({ success: false, message: 'No check-in record found for today. Please check in first.' });
        }

        if (record.checkOut) {
            return res.status(400).json({ success: false, message: 'Already checked out for today' });
        }

        const now = new Date();
        record.checkOut = now;

        // Calculate hours worked (rounded to 2 decimal places)
        const diffMs = now - record.checkIn;
        const diffHrs = diffMs / (1000 * 60 * 60);
        record.hoursWorked = Number(diffHrs.toFixed(2));

        record.status = 'Present';
        await record.save();

        res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
