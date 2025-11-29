import React, { useState } from 'react';
import { submitOnboarding } from '../api/onboard';

/**
 * RegistrationForm Component
 * Handles user registration with real-time validation and feedback
 */
const RegistrationForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState(null);

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate phone number (numeric, 10-15 digits)
   * @param {string} phone
   * @returns {boolean}
   */
  const isValidPhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d{10,15}$/.test(cleanPhone);
  };

  /**
   * Validate form before submission
   * @returns {object} - Validation errors object
   */
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    return newErrors;
  };

  /**
   * Handle input changes
   * @param {object} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   * @param {object} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResponse(null);
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      console.log('Submitting form data:', formData);

      // Call backend API
      const result = await submitOnboarding(formData);

      console.log('Success response:', result);

      // Show success message
      setResponse({
        type: 'success',
        title: 'Success!',
        message: 'Your account has been created successfully. We\'re setting everything up for you!',
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        });
        setErrors({});
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);

      // Build detailed error message
      let errorMessage = error.message || 'An error occurred during onboarding';
      if (error.details && Array.isArray(error.details)) {
        errorMessage = error.details.join(', ');
      } else if (error.details && typeof error.details === 'object') {
        errorMessage = JSON.stringify(error.details);
      }

      setResponse({
        type: 'error',
        title: 'Onboarding Failed',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-icon">👤</div>
        <h1>Welcome Aboard!</h1>
        <p className="subtitle">Complete your registration to get started with our platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {/* First Name Field */}
          <div className="form-group">
            <label htmlFor="firstName">
              First Name
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              disabled={loading}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="lastName">
              Last Name
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              disabled={loading}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group full">
          <label htmlFor="email">
            Email Address
            <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            disabled={loading}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="form-group full">
          <label htmlFor="phone">
            Phone Number
            <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (234) 567-8900"
            disabled={loading}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>

      {/* Response Toast */}
      {response && (
        <div className={`toast ${response.type}`}>
          <div>
            <strong>{response.title}</strong>
            {response.message}
          </div>
        </div>
      )}

      <div className="footer">
        <p>Your data is secure and will never be shared</p>
      </div>
    </div>
  );
};

export default RegistrationForm;
