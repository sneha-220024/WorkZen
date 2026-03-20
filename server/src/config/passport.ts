import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import HR from '../models/HR';
import Employee from '../models/Employee';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: process.env.GOOGLE_REDIRECT_URI || "/api/auth/google/callback"
},
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            const email = profile.emails?.[0]?.value;
            const googleId = profile.id;
            if (!email) return done(new Error('No email found in Google profile'), null);

            // Check HR by email
            let user = await HR.findOne({ email });
            let role = 'hr';

            if (!user) {
                // Check Employee by email
                user = await Employee.findOne({ email }) as any;
                role = 'employee';
            }

            if (user) {
                return done(null, { ...user.toObject(), role });
            } else {
                // New user via Google — create HR account without a password
                const newUser = await HR.create({
                    name: profile.displayName,
                    email: email,
                    googleId: googleId,
                    role: 'hr'
                });
                return done(null, { ...newUser.toObject(), role: 'hr' });
            }
        } catch (err) {
            console.error('Passport Google Strategy Error:', err);
            done(err, null);
        }
    }
));

passport.serializeUser((user: any, done: any) => {
    done(null, { id: user._id, role: user.role });
});

passport.deserializeUser(async (data: any, done: any) => {
    try {
        let user;
        if (data.role === 'hr') {
            user = await HR.findById(data.id);
        } else {
            user = await Employee.findById(data.id);
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
