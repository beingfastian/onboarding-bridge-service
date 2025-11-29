// API client for onboarding endpoint
import axios from 'axios';

// Get API base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Submit onboarding form to backend
 * @param {object} formData - { firstName, lastName, email, phone, tags }
 * @returns {Promise<object>} - Response data
 */
export const submitOnboarding = async (formData) => {
  try {
    const response = await apiClient.post('/api/onboard', formData);
    return response.data;
  } catch (error) {
    // Re-throw with detailed error message
    const errorMessage = error.response?.data?.message || error.message;
    const errorDetails = error.response?.data?.error;
    
    throw {
      message: errorMessage,
      details: errorDetails,
      status: error.response?.status,
    };
  }
};

/**
 * Check API health
 * @returns {Promise<object>} - Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    throw new Error(`API health check failed: ${error.message}`);
  }
};

export default apiClient;
