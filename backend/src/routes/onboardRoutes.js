// Onboarding routes
const express = require('express');
const router = express.Router();
const { onboard } = require('../controllers/onboardController');

/**
 * POST /api/onboard
 * Main webhook receiver for form submissions
 * Body: { firstName, lastName, email, phone, tags[] }
 */
router.post('/api/onboard', onboard);

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
