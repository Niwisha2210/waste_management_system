// JWT Token utilities for authentication
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT Token
function generateToken(userId, userRole, userEmail) {
  try {
    const payload = {
      id: userId,
      role: userRole,
      email: userEmail
    };
    
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });
    
    return token;
  } catch (err) {
    console.error('Error generating token:', err);
    throw err;
  }
}

// Verify JWT Token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error('Error verifying token:', err);
    throw err;
  }
}

// Decode Token without verification (for debugging)
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
