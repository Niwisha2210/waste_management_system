// Authentication Middleware
// Verifies JWT token and adds user info to request object

const { verifyToken } = require('../utils/tokenUtils');

// Middleware to verify JWT token
function verifyAuth(req, res, next) {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in first'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Middleware to check user role
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
}

module.exports = {
  verifyAuth,
  authorizeRole
};
