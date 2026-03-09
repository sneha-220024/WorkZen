const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

require('./config/passport');

const app = express();

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
