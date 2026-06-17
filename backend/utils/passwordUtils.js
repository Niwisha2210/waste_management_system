// Utility functions for password hashing and verification
// Using bcryptjs for secure password hashing

const bcrypt = require('bcryptjs');

// Hash password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

// Compare password with hash
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error('Error comparing password:', err);
    throw err;
  }
}

module.exports = {
  hashPassword,
  comparePassword
};
