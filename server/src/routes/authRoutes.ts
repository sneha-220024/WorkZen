import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import passport from 'passport';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * Authentication Routes
 * Base route: /api/auth
 */

router.post('/register', register);
router.post('/login', login);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
    (req, res) => {
        // Successful authentication, redirect to dashboard or home with token
        res.redirect('http://localhost:3000/dashboard'); 
    }
);

router.get('/me', protect, getMe);

export default router;
