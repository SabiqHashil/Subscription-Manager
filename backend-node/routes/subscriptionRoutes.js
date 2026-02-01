const express = require('express');
const Subscription = require('../models/Subscription');
const { auth, adminOnly, checkPermission } = require('../middleware/auth');
const { calculate_subscription_status } = require('../utils/helpers');
const router = express.Router();

// Create Subscription
router.post('/', auth, checkPermission('subscriptions_create'), async (req, res) => {
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
router.get('/', auth, checkPermission('subscriptions_view'), async (req, res) => {
    try {
        // Limit 'Personal' subscriptions to owners only (Even for Admins)
        query = {
            $or: [
                { type: { $ne: 'Personal' } },
                { created_by: req.user.id }
            ]
        };

        const subscriptions = await Subscription.find(query);

        // Recalculate status on fetch
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
router.get('/:id', auth, checkPermission('subscriptions_view'), async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }

        // Privacy check: If personal and not owner (Admins also restricted for Personal)
        if (subscription.type === 'Personal' &&
            subscription.created_by !== req.user.id) {
            return res.status(403).json({ detail: 'Access denied to this personal subscription' });
        }

        if (subscription.renewal_date) {
            subscription.status = calculate_subscription_status(subscription.renewal_date);
        }
        res.json(subscription);
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

// Update Subscription
router.put('/:id', auth, checkPermission('subscriptions_edit'), async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }

        // Permission check
        const isOwner = subscription.created_by === req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Strict Personal Privacy: Only owner can update Personal
        if (subscription.type === 'Personal') {
            if (!isOwner) {
                return res.status(403).json({ detail: 'Only the owner can update this personal subscription' });
            }
        } else {
            // Non-personal: Admin or Owner can update
            if (!isAdmin && !isOwner) {
                return res.status(403).json({ detail: 'Not authorized to update this subscription' });
            }
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

// Delete Subscription
router.delete('/:id', auth, checkPermission('subscriptions_delete'), async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ id: req.params.id });
        if (!subscription) {
            return res.status(404).json({ detail: 'Subscription not found' });
        }

        // Permission check
        const isOwner = subscription.created_by === req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Strict Personal Privacy: Only owner can delete Personal
        if (subscription.type === 'Personal') {
            if (!isOwner) {
                return res.status(403).json({ detail: 'Only the owner can delete this personal subscription' });
            }
        } else {
            // Non-personal: Admin or Owner can delete
            if (!isAdmin && !isOwner) {
                return res.status(403).json({ detail: 'Not authorized to delete this subscription' });
            }
        }

        await Subscription.deleteOne({ id: req.params.id });
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

module.exports = router;
