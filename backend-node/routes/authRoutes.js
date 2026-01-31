const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Register (Admin only)
router.post('/register', auth, adminOnly, async (req, res) => {
    try {
        const { name, email, phone, password, role, access_level } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ detail: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phone,
            password_hash: hashedPassword,
            role: role || 'staff',
            access_level: access_level || 'full'
        });

        await user.save();
        res.status(201).json(user);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ detail: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ detail: 'Invalid email or password' });
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '24h' // 60 * 24 minutes
        });

        res.json({
            access_token: token,
            token_type: 'bearer',
            user: user
        });
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

// Update Current User
router.put('/me', auth, async (req, res) => {
    try {
        const { name, email, phone, password, role, access_level } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (role && user.role === 'admin') user.role = role; // Only admin can change their own role? Usually logic prevents self-demotion but let's allow all fields as requested.
        if (access_level && user.role === 'admin') user.access_level = access_level;

        if (email && email !== user.email) {
            // Check if email taken by someone else
            const existing = await User.findOne({ email, id: { $ne: user.id } });
            if (existing) {
                return res.status(400).json({ detail: 'Email already registered' });
            }
            user.email = email;
        }

        if (password) {
            user.password_hash = await bcrypt.hash(password, 10);
        }

        user.updated_at = new Date().toISOString();
        await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

module.exports = router;
