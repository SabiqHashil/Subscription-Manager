// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',

  // Staff
  STAFF_LIST: '/staff',
  STAFF_GET: (id) => `/staff/${id}`,
  STAFF_UPDATE: (id) => `/staff/${id}`,
  STAFF_DELETE: (id) => `/staff/${id}`,

  // Subscriptions
  SUBSCRIPTIONS_CREATE: '/subscriptions',
  SUBSCRIPTIONS_LIST: '/subscriptions',
  SUBSCRIPTIONS_GET: (id) => `/subscriptions/${id}`,
  SUBSCRIPTIONS_UPDATE: (id) => `/subscriptions/${id}`,
  SUBSCRIPTIONS_DELETE: (id) => `/subscriptions/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
};

// Subscription Constants
export const SUBSCRIPTION_TYPES = [
  'Personal',
  'Client',
  'Official',
];

export const SUBSCRIPTION_CATEGORIES = [
  'Domain',
  'Hosting Platform',
  'WhatsApp API',
  'SSL',
  'Cloud Service',
  'Others',
];

export const SUBSCRIPTION_DURATIONS = [
  'Monthly',
  '3 Months',
  '6 Months',
  '1 Year',
  '2 Years',
  '3 Years',
];

export const SUBSCRIPTION_STATUSES = {
  UPCOMING: 'Upcoming',
  ACTIVE: 'Active',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRING_TODAY: 'Expiring Today',
  EXPIRED: 'Expired',
};
