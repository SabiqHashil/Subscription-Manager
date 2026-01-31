const express = require('express');
const Subscription = require('../models/Subscription');
const { auth, adminOnly } = require('../middleware/auth');
const { calculate_subscription_status } = require('../utils/helpers');
const router = express.Router();

// Create Subscription (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const statusVal = calculate_subscription_status(req.body.renewal_date);

        const subscription = new Subscription({
            ...req.body,
            status: statusVal,
            created_by: req.user.id
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
            const newStatus = calculate_subscription_status(sub.renewal_date);
            if (sub.status !== newStatus) {
                // Ideally we update it in DB or just return calculated.
                // Python code recalculates and updates the object in memory before returning.
                sub.status = newStatus;
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

        subscription.status = calculate_subscription_status(subscription.renewal_date);
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

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            subscription[key] = updates[key];
        });

        if (updates.renewal_date) {
            subscription.status = calculate_subscription_status(updates.renewal_date);
        }

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
