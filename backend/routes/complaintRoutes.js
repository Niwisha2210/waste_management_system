// Complaints Routes
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { verifyAuth, authorizeRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { handleValidationErrors, validationRules } = require('../utils/validators');

// Create complaint (Citizens)
router.post('/', verifyAuth, authorizeRole('citizen'), upload.single('image'), 
  validationRules.complaintValidation, handleValidationErrors, complaintController.createComplaint);

// Get user's complaints (Citizens)
router.get('/my-complaints', verifyAuth, authorizeRole('citizen'), complaintController.getUserComplaints);

// Get all complaints (Admin and workers)
router.get('/', verifyAuth, authorizeRole('admin', 'worker'), complaintController.getAllComplaints);

// Update complaint status (Admin only)
router.put('/:complaintId/status', verifyAuth, authorizeRole('admin'), complaintController.updateComplaintStatus);

// Assign complaint to worker (Admin only)
router.put('/:complaintId/assign', verifyAuth, authorizeRole('admin'), complaintController.assignComplaint);

module.exports = router;
