// Predictions Routes
const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { verifyAuth, authorizeRole } = require('../middlewares/authMiddleware');

// Generate prediction for a specific bin (Admin/System)
router.post('/:binId', verifyAuth, authorizeRole('admin'), predictionController.generateBinPrediction);

// Get critical predictions (Admin/Workers)
router.get('/critical', verifyAuth, authorizeRole('admin', 'worker'), predictionController.getCriticalPredictions);

// Generate predictions for all bins (Admin - usually scheduled)
router.post('/', verifyAuth, authorizeRole('admin'), predictionController.generateAllPredictions);

module.exports = router;
