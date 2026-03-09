const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI || "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google Profile:', profile.emails?.[0]?.value);
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            } else {
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value
                };

                if (!newUser.email) {
                    return done(new Error('No email found in Google profile'), null);
                }

                user = await User.create(newUser);
                return done(null, user);
            }
        } catch (err) {
            console.error('Passport Google Strategy Error:', err);
            done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
