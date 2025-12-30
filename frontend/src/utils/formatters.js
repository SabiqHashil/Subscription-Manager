/**
 * Utility functions for formatting and data manipulation
 */

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string}
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get status color
 * @param {string} status - Status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const statusColorMap = {
    Active: 'bg-green-100 text-green-800',
    'Upcoming': 'bg-blue-100 text-blue-800',
    'Expiring Soon': 'bg-yellow-100 text-yellow-800',
    'Expiring Today': 'bg-orange-100 text-orange-800',
    'Expired': 'bg-red-100 text-red-800',
  };
  return statusColorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string}
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Copy to clipboard
 * @param {string} text - Text to copy
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Generate query string
 * @param {Object} params - Parameters
 * @returns {string}
 */
export const generateQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

/**
 * Parse query string
 * @param {string} queryString - Query string
 * @returns {Object}
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};
