const express = require('express');
const Subscription = require('../models/Subscription');
const { auth, adminOnly } = require('../middleware/auth');
const { calculate_subscription_status } = require('../utils/helpers');
const router = express.Router();

// Create Subscription (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { client_name, business_name, client_email, client_phone, price, paid_date, renewal_date, duration, type, category, notes } = req.body;

        const statusVal = calculate_subscription_status(renewal_date);

        const subscription = new Subscription({
            client_name,
            business_name,
            client_email,
            client_phone,
            price,
            paid_date,
            renewal_date,
            duration,
            type,
            category,
            notes,
            status: statusVal,
            created_by: req.user.id,
            created_by_name: req.user.name,
            updated_by: req.user.id,
            updated_by_name: req.user.name
        });

        await subscription.save();
        res.status(201).json(subscription);
    } catch (e) {
        res.status(400).json({ detail: e.message });
    }
});

// Get All Subscriptions
router.get('/', auth, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({});

        // Recalculate status on fetch (to match Python behavior)
        const updatedSubscriptions = subscriptions.map(sub => {
            if (sub.renewal_date) {
                const newStatus = calculate_subscription_status(sub.renewal_date);
                if (sub.status !== newStatus) {
                    sub.status = newStatus;
                }
            }
            return sub;
        });

        res.json(updatedSubscriptions);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Get Subscription by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }

        if (subscription.renewal_date) {
            subscription.status = calculate_subscription_status(subscription.renewal_date);
        }
        res.json(subscription);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Update Subscription (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }

        const allowedUpdates = [
            'client_name', 'business_name', 'client_email', 'client_phone',
            'price', 'paid_date', 'renewal_date', 'duration', 'type',
            'category', 'notes'
        ];

        allowedUpdates.forEach(key => {
            if (req.body[key] !== undefined) {
                subscription[key] = req.body[key];
            }
        });

        if (req.body.renewal_date) {
            subscription.status = calculate_subscription_status(req.body.renewal_date);
        }

        subscription.updated_by = req.user.id;
        subscription.updated_by_name = req.user.name;
        subscription.updated_at = new Date().toISOString();

        await subscription.save();
        res.json(subscription);
    } catch (e) {
        res.status(400).json({ detail: e.message });
    }
});

// Delete Subscription (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndDelete({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

module.exports = router;
