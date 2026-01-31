const express = require('express');
const Subscription = require('../models/Subscription');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get Dashboard Stats (Admin only)
router.get('/stats', auth, adminOnly, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({}, 'renewal_date');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let upcoming = 0;
        let due_today = 0;
        let expired = 0;

        subscriptions.forEach(sub => {
            if (!sub.renewal_date) return;

            const renewalDate = new Date(sub.renewal_date);
            if (isNaN(renewalDate.getTime())) return;

            renewalDate.setHours(0, 0, 0, 0);

            const diffTime = renewalDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                expired += 1;
            } else if (diffDays === 0) {
                due_today += 1;
            } else if (diffDays <= 30) {
                upcoming += 1;
            }
        });

        res.json({
            total_subscriptions: subscriptions.length,
            upcoming_renewals: upcoming,
            renewals_due_today: due_today,
            expired_subscriptions: expired
        });
    } catch (e) {
        res.status(500).json({ detail: e.message });
    }
});

module.exports = router;
