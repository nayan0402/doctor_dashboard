const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const Retell = require('retell-sdk');
const stripe = require('stripe')('sk_test_51QZ4MfAoi0w8LfPMtqtpsrJw3pehm2RVn0ZE4hFk7c7QWIIgiVJg0TDb2A9PoTCPx42RgGRMLScioVETdbMaViri001oCUBBR5');


const User = require('./models/User');
const Patient = require('./models/Patient');

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

// Retell AI client setup
const retellClient = new Retell({
    apiKey: "Bearer key_f72f9805830615815aec13579cf5", // Replace with your Retell API key
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

app.post('/api/patients', async (req, res) => {
    console.log('Received patient data:', req.body); // Debug log
    console.log('Auth status:', req.isAuthenticated()); // Debug log

    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const patient = new Patient({
            ...req.body,
            doctorId: req.user._id
        });

        await patient.save();
        console.log('Patient saved:', patient); // Debug log
        res.status(201).json(patient);
    } catch (err) {
        console.error('Error creating patient:', err);
        res.status(500).json({ error: 'Error creating patient', details: err.message });
    }
});

app.get('/api/patients', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const patients = await Patient.find({ doctorId: req.user._id });
        res.json(patients);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ error: 'Error fetching patients' });
    }
});

// Retell Web Call API Endpoint

app.post('/create-web-call', async (req, res) => {
    const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;

    // Prepare the payload for the API request
    const payload = { agent_id };

    // Conditionally add optional fields if they are provided
    if (metadata) {
        payload.metadata = metadata;
    }

    if (retell_llm_dynamic_variables) {
        payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;
    }

    try {
        const response = await axios.post(
            'https://api.retellai.com/v2/create-web-call',
            payload,
            {
                headers: {
                    'Authorization': 'Bearer key_f72f9805830615815aec13579cf5', // Replace with your actual Bearer token
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating web call:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create web call' });
    }
});

app.post('/create-checkout-session', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Platform Payement',
              },
              unit_amount: 10000, 
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5174/dashboard?success=true`,
        cancel_url: `http://localhost:5174/dashboard?canceled=true`,
      });
  
      res.json({ url: session.url });
    } catch (err) {
      console.error('Stripe Error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/payment-intents', async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({ limit: 20 }); // Adjust the limit as needed
        res.json(paymentIntents.data); // Send payment intents data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment intents' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
