const express = require('express');
const router = express.Router();
const { getMyPayslip } = require('../controllers/payrollController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/my-payslip', protect, getMyPayslip);

module.exports = router;
