// Error Handling Middleware
// Centralized error handling for all routes

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Determine status code
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: process.env.NODE_ENV === 'development' ? err.details : null,
    timestamp: new Date()
  });
}

// Async error wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  asyncHandler
};
