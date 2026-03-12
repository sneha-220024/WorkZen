const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const passport = require('passport');

const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3001/login' }),
    (req, res) => {
        // Successful authentication, redirect to dashboard or home with token
        // In a real app, you might want to send the token in a cookie or redirect with it
        res.redirect('http://localhost:3001/dashboard'); // Update with frontend URL
    }
);
router.get('/me', protect, getMe);

module.exports = router;
