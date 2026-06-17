// Custom error handling class
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Success response formatter
function successResponse(data, message = 'Success', statusCode = 200) {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date()
  };
}

// Error response formatter
function errorResponse(statusCode, message, details = null) {
  return {
    success: false,
    statusCode,
    message,
    details,
    timestamp: new Date()
  };
}

module.exports = {
  ApiError,
  successResponse,
  errorResponse
};
