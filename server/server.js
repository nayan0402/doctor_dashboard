const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5174', // Adjust this if your client is served from a different URL
    credentials: true
}));

// Session configuration
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/incare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Load credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: credentials.web.client_id,
    clientSecret: credentials.web.client_secret,
    callbackURL: credentials.web.redirect_uris[0], // Ensure this matches the redirect URI in Google Console
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                accessToken: accessToken,
                refreshToken: refreshToken || null,
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('http://localhost:5174/dashboard');
    }
);

app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        // Send user info including the displayName
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.get('/auth/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true });
    });
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
