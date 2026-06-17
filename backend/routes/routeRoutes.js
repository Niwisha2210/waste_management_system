// Routes - Collection Routes Management
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { verifyAuth, authorizeRole } = require('../middlewares/authMiddleware');
const { handleValidationErrors, validationRules } = require('../utils/validators');

// Create route (Admin only)
router.post('/', verifyAuth, authorizeRole('admin'), validationRules.routeValidation, 
  handleValidationErrors, routeController.createRoute);

// Get all routes (Admin only)
router.get('/', verifyAuth, authorizeRole('admin'), routeController.getAllRoutes);

// Get worker routes (Workers)
router.get('/worker/:workerId', verifyAuth, authorizeRole('worker', 'admin'), routeController.getWorkerRoutes);

// Update route status (Admin/Workers)
router.put('/:routeId/status', verifyAuth, authorizeRole('admin', 'worker'), routeController.updateRouteStatus);

// Mark bin as collected (Workers)
router.put('/:routeId/bins/:binId/collect', verifyAuth, authorizeRole('worker'), routeController.markBinCollected);

module.exports = router;
