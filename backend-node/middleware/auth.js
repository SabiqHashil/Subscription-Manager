const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // Python stored "sub": user.id
        const user = await User.findOne({ id: decoded.sub });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ detail: 'Not authenticated' });
    }
};

const adminOnly = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ detail: 'Not authorized' });
    }
};

const checkPermission = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        // Admins have all permissions
        if (user.role === 'admin') {
            return next();
        }

        // Check if user has the specific permission
        if (user.permissions && typeof user.permissions[permission] === 'boolean') {
            if (user.permissions[permission]) {
                return next();
            }
        }
        // Fallback for legacy users (backward compatibility)
        else if (user.access_level) {
            // Map legacy access_level to permissions
            const isFull = user.access_level === 'full';

            // View permission allowed for everyone (both full and view_only)
            if (permission === 'subscriptions_view') return next();

            // Full access allows everything else
            if (isFull) return next();
        }

        res.status(403).json({ detail: `Permission denied: ${permission}` });
    };
};

module.exports = { auth, adminOnly, checkPermission };
