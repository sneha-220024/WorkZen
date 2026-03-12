const express = require('express');
const router = express.Router();
const { getAttendance, checkIn, checkOut } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');
const { checkEmployee } = require('../middlewares/roleMiddleware');

// Base path: /api/attendance
// All routes protected and employee-only for now
router.use(protect);
router.use(checkEmployee);

router.route('/')
    .get(getAttendance);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

module.exports = router;
