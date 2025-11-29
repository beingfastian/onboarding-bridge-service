// Email and phone validation service
const validator = require('validator');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate phone number (numeric only, 10-15 digits)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid
 */
const isValidPhone = (phone) => {
  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  // Check if numeric and proper length
  return /^\d{10,15}$/.test(cleanPhone);
};

/**
 * Validate onboarding payload
 * @param {object} payload - Data to validate
 * @returns {object} - { isValid: boolean, errors: array }
 */
const validateOnboardingPayload = (payload) => {
  const errors = [];

  // Check required fields
  if (!payload.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!payload.lastName?.trim()) {
    errors.push('Last name is required');
  }
  if (!payload.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(payload.email)) {
    errors.push('Invalid email format');
  }
  if (!payload.phone?.trim()) {
    errors.push('Phone is required');
  } else if (!isValidPhone(payload.phone)) {
    errors.push('Phone must be numeric and 10-15 digits');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidEmail,
  isValidPhone,
  validateOnboardingPayload,
};
