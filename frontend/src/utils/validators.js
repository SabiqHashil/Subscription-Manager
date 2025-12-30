/**
 * Validation functions
 */

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
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
 * Validate phone
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object}
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
  };
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {boolean}
 */
export const isValidDateRange = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate);
};

/**
 * Validate subscription data
 * @param {Object} data - Subscription data
 * @returns {Object}
 */
export const validateSubscriptionData = (data) => {
  const errors = {};

  if (!isRequired(data.client_name)) errors.client_name = 'Client name is required';
  if (!isRequired(data.business_name)) errors.business_name = 'Business name is required';
  if (!isRequired(data.price) || data.price <= 0) errors.price = 'Valid price is required';
  if (!isRequired(data.paid_date)) errors.paid_date = 'Paid date is required';
  if (!isRequired(data.renewal_date)) errors.renewal_date = 'Renewal date is required';
  if (!isValidDateRange(data.paid_date, data.renewal_date)) {
    errors.renewal_date = 'Renewal date must be after paid date';
  }
  if (!isRequired(data.duration)) errors.duration = 'Duration is required';
  if (!isRequired(data.type)) errors.type = 'Type is required';
  if (!isRequired(data.category)) errors.category = 'Category is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate user data
 * @param {Object} data - User data
 * @returns {Object}
 */
export const validateUserData = (data) => {
  const errors = {};

  if (!isRequired(data.name)) errors.name = 'Name is required';
  if (!isValidEmail(data.email)) errors.email = 'Valid email is required';
  if (!isValidPhone(data.phone)) errors.phone = 'Valid phone is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
