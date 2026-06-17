// Analytics Routes
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyAuth, authorizeRole } = require('../middlewares/authMiddleware');

// Get dashboard analytics (Admin/Workers)
router.get('/dashboard', verifyAuth, authorizeRole('admin', 'worker'), analyticsController.getDashboardAnalytics);

// Get waste trends (Admin)
router.get('/waste-trends', verifyAuth, authorizeRole('admin'), analyticsController.getWasteTrends);

// Get complaint analytics (Admin)
router.get('/complaints', verifyAuth, authorizeRole('admin'), analyticsController.getComplaintAnalytics);

// Get worker metrics (Admin)
router.get('/worker-metrics', verifyAuth, authorizeRole('admin'), analyticsController.getWorkerMetrics);

// Generate monthly report (Admin)
router.get('/report/monthly', verifyAuth, authorizeRole('admin'), analyticsController.generateMonthlyReport);

module.exports = router;
