const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const staffRoutes = require('./routes/staffRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*'
}));
app.use(helmet());
app.use(morgan('dev'));

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Database Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'subscription_manager';

mongoose.connect(MONGO_URL, { dbName: DB_NAME })
    .then(async () => {
        console.log('Connected to MongoDB');
        await createDefaultAdmin();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function createDefaultAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@subscriptionmanager.com';
        const adminPassword = process.env.ADMIN_PASSWORD;
        const debug = process.env.DEBUG === 'true';

        if (!adminPassword) {
            console.log('No ADMIN_PASSWORD set, skipping default admin creation/update');
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const logPassword = debug ? adminPassword : '<hidden>';

        // Find any admin user to update, or create a new one
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            await User.updateOne({ id: existingAdmin.id }, {
                $set: {
                    email: adminEmail,
                    password_hash: hashedPassword
                }
            });
            console.log(`Default admin updated: ${adminEmail} / ${logPassword}`);
        } else {
            const admin = new User({
                name: 'Admin',
                email: adminEmail,
                phone: '9999999999',
                password_hash: hashedPassword,
                role: 'admin',
                access_level: 'full'
            });
            await admin.save();
            console.log(`Default admin created: ${adminEmail} / ${logPassword}`);
        }
    } catch (e) {
        console.warn('Error in createDefaultAdmin:', e.message);
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Subscription Manager API',
        version: '1.0.0',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ detail: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
