// Custom App API client configuration
require('dotenv').config();
const axios = require('axios');

const customAppClient = axios.create({
  baseURL: process.env.CUSTOM_APP_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor for Custom App API
customAppClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Custom App API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = customAppClient;
