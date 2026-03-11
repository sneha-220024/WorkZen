const express = require('express');
const router = express.Router();
const { getLeaves, applyLeave, getLeaveBalance } = require('../controllers/leaveController');
const { protect } = require('../middlewares/authMiddleware');
const { checkEmployee } = require('../middlewares/roleMiddleware');

// Base path: /api/leaves
router.use(protect);
router.use(checkEmployee);

// NOTE: /balance must be declared BEFORE the '/:id' pattern (if any) to avoid conflicts
router.get('/balance', getLeaveBalance);

router.route('/')
    .get(getLeaves)
    .post(applyLeave);

module.exports = router;
