// Authentication Controller
// Handles user registration, login, and token refresh

const { pool } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');
const { successResponse, errorResponse, ApiError } = require('../utils/responseHandler');

// Register new user
async function register(req, res) {
  try {
    const { name, email, password, phone, role = 'citizen', address, city } = req.body;

    const connection = await pool.getConnection();

    // Check if user already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.release();
      return res.status(409).json(errorResponse(409, 'Email already registered'));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, phone, role, address, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role, address, city]
    );

    // If registering as a worker, also create their worker profile row.
    // This is required so complaints/routes can be assigned to them later.
    if (role === 'worker') {
      const employee_id = `EMP-${Date.now()}`;
      await connection.execute(
        'INSERT INTO workers (user_id, employee_id) VALUES (?, ?)',
        [result.insertId, employee_id]
      );
    }

    await connection.release();

    // Generate token
    const token = generateToken(result.insertId, role, email);

    return res.status(201).json(successResponse(
      {
        id: result.insertId,
        name,
        email,
        role,
        token
      },
      'User registered successfully',
      201
    ));
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json(errorResponse(500, 'Registration failed', err.message));
  }
}

// Login user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const connection = await pool.getConnection();

    // Find user by email
    const [users] = await connection.execute(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );

    await connection.release();

    if (users.length === 0) {
      return res.status(401).json(errorResponse(401, 'Invalid email or password'));
    }

    const user = users[0];

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json(errorResponse(401, 'Invalid email or password'));
    }

    // Generate token
    const token = generateToken(user.id, user.role, user.email);

    return res.status(200).json(successResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      },
      'Login successful'
    ));
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json(errorResponse(500, 'Login failed', err.message));
  }
}

// Get current user profile
async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      'SELECT id, name, email, phone, role, address, city, avatar_url, is_active, is_verified FROM users WHERE id = ?',
      [userId]
    );

    await connection.release();

    if (users.length === 0) {
      return res.status(404).json(errorResponse(404, 'User not found'));
    }

    return res.status(200).json(successResponse(users[0], 'User profile retrieved'));
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get user profile', err.message));
  }
}

// Update user profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, phone, address, city } = req.body;

    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE users SET name = ?, phone = ?, address = ?, city = ? WHERE id = ?',
      [name, phone, address, city, userId]
    );

    const [updatedUser] = await connection.execute(
      'SELECT id, name, email, phone, role, address, city, avatar_url FROM users WHERE id = ?',
      [userId]
    );

    await connection.release();

    return res.status(200).json(successResponse(updatedUser[0], 'Profile updated successfully'));
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to update profile', err.message));
  }
}

// Change password
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const connection = await pool.getConnection();

    // Get current user password
    const [users] = await connection.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      await connection.release();
      return res.status(404).json(errorResponse(404, 'User not found'));
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, users[0].password);

    if (!isPasswordValid) {
      await connection.release();
      return res.status(401).json(errorResponse(401, 'Old password is incorrect'));
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    await connection.release();

    return res.status(200).json(successResponse(null, 'Password changed successfully'));
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to change password', err.message));
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
};