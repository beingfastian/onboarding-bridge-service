// Global error handling middleware
const { sendError } = require('../utils/response');

/**
 * Global error handler middleware
 * Catches any unhandled errors in the application
 */
const errorHandler = (err, req, res, next) => {
  console.error('[GLOBAL ERROR]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

/**
 * 404 Not Found middleware
 */
const notFound = (req, res) => {
  sendError(res, 'Endpoint not found', 404);
};

module.exports = {
  errorHandler,
  notFound,
};
