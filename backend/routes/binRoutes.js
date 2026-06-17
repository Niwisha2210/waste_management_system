// Smart Bins Routes
const express = require('express');
const router = express.Router();
const binController = require('../controllers/binController');
const { verifyAuth, authorizeRole } = require('../middlewares/authMiddleware');
const { handleValidationErrors, validationRules } = require('../utils/validators');

// Create bin (Admin only)
router.post('/', verifyAuth, authorizeRole('admin'), validationRules.binValidation, handleValidationErrors, binController.createBin);

// Get all bins (Everyone)
router.get('/', verifyAuth, binController.getAllBins);

// Get bin by ID (Everyone)
router.get('/:binId', verifyAuth, binController.getBinById);

// Update bin fill level (Admin/System)
router.put('/:binId/fill-level', verifyAuth, authorizeRole('admin'), binController.updateBinFillLevel);

// Get bins by status (Everyone)
router.get('/status/:status', verifyAuth, binController.getBinsByStatus);

// Get nearby bins (Everyone - Citizen/Worker)
router.get('/nearby/list', verifyAuth, binController.getNearbyBins);

module.exports = router;
