/**
 * Checks if a user has a specific permission, with fallback for legacy access_level.
 * @param {Object} user - The user object
 * @param {string} permission - The permission key to check
 * @returns {boolean} - True if allowed, false otherwise
 */
export const hasPermission = (user, permission) => {
    if (!user) return false;

    // Admins have all permissions
    if (user.role === "admin") return true;

    // Check specific permissions object if it exists
    if (user.permissions && typeof user.permissions[permission] === "boolean") {
        return user.permissions[permission];
    }

    // Fallback for legacy access_level
    if (user.access_level) {
        const isFull = user.access_level === "full";

        // view_only allows viewing subscriptions, nothing else
        if (permission === "subscriptions_view") return true;

        // full allows everything (mapped to old system)
        if (isFull) return true;
    }

    return false;
};
