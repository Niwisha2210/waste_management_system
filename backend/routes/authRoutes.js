// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAuth } = require('../middlewares/authMiddleware');
const { handleValidationErrors, validationRules } = require('../utils/validators');

// Public routes
router.post('/register', validationRules.registerValidation, handleValidationErrors, authController.register);
router.post('/login', validationRules.loginValidation, handleValidationErrors, authController.login);

// Protected routes
router.get('/profile', verifyAuth, authController.getCurrentUser);
router.put('/profile', verifyAuth, authController.updateProfile);
router.post('/change-password', verifyAuth, authController.changePassword);

module.exports = router;
