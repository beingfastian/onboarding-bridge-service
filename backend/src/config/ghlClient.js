// GoHighLevel (GHL) API client configuration
require('dotenv').config();
const axios = require('axios');

const ghlClient = axios.create({
  baseURL: process.env.GHL_API_BASE_URL || 'https://services.leadconnectorhq.com/api',
  headers: {
    'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Error interceptor for GHL API
ghlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('GHL API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

module.exports = ghlClient;
