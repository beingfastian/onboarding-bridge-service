// Express app setup and middleware configuration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const onboardRoutes = require('./routes/onboardRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', onboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
