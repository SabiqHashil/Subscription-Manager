const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, adminOnly, checkPermission } = require('../middleware/auth');
const router = express.Router();

// Get Staff List (Admin or anyone with staff_manage permission)
router.get('/', auth, checkPermission('staff_manage'), async (req, res) => {
    try {
        const staff = await User.find({});
        res.json(staff);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Get Staff by ID
router.get('/:id', auth, checkPermission('staff_manage'), async (req, res) => {
    try {
        const staff = await User.findOne({ id: req.params.id });
        if (!staff) {
            return res.status(404).json({ detail: 'Staff not found' });
        }
        res.json(staff);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Update Staff
router.put('/:id', auth, checkPermission('staff_manage'), async (req, res) => {
    try {
        const staff = await User.findOne({ id: req.params.id });
        if (!staff) {
            return res.status(404).json({ detail: 'Staff not found' });
        }

        const { name, email, phone, password, access_level, role, permissions } = req.body;

        if (name) staff.name = name;
        if (phone) staff.phone = phone;
        if (role) staff.role = role;
        if (access_level) staff.access_level = access_level;
        if (permissions) staff.permissions = permissions;
        if (email && email !== staff.email) {
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(400).json({ detail: 'Email already registered' });
            }
            staff.email = email;
        }
        if (password) {
            staff.password_hash = await bcrypt.hash(password, 10);
        }

        staff.updated_at = new Date().toISOString();
        await staff.save();
        res.json(staff);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Delete Staff
router.delete('/:id', auth, checkPermission('staff_manage'), async (req, res) => {
    try {
        const staff = await User.findOneAndDelete({ id: req.params.id });
        if (!staff) {
            return res.status(404).json({ detail: 'Staff not found' });
        }
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

module.exports = router;
