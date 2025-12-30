// App-wide constants
export const APP_NAME = 'Subscription Manager';
export const APP_VERSION = '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

// Notification Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in',
    LOGOUT: 'Successfully logged out',
    CREATE: 'Successfully created',
    UPDATE: 'Successfully updated',
    DELETE: 'Successfully deleted',
  },
  ERROR: {
    LOGIN: 'Failed to login. Please check your credentials.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Unauthorized. Please login again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
};

// Toast Duration (milliseconds)
export const TOAST_DURATION = 3000;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};
