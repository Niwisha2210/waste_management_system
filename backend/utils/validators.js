// Validation utility functions
const { body, validationResult } = require('express-validator');

// Validation middleware to handle errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
}

// Common validation rules
const validationRules = {
  // User validation
  registerValidation: [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().matches(/^\d{10}$/).withMessage('Phone must be 10 digits')
  ],

  loginValidation: [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],

  // Complaint validation
  complaintValidation: [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['garbage_overflow', 'bin_damage', 'collection_delay', 'other']).withMessage('Invalid category'),
    body('waste_dumped').isIn(['dumped', 'not_dumped']).withMessage('Waste dumped must be dumped or not_dumped'),
    body('material_type').isIn(['biodegradable', 'non_biodegradable']).withMessage('Material type must be biodegradable or non_biodegradable'),
    body('location_latitude').optional().isDecimal().withMessage('Invalid latitude'),
    body('location_longitude').optional().isDecimal().withMessage('Invalid longitude')
  ],

  // Bin validation
  binValidation: [
    body('bin_id').trim().notEmpty().withMessage('Bin ID is required'),
    body('location_name').trim().notEmpty().withMessage('Location name is required'),
    body('location_latitude').isDecimal().withMessage('Valid latitude is required'),
    body('location_longitude').isDecimal().withMessage('Valid longitude is required'),
    body('bin_type').isIn(['small', 'medium', 'large']).withMessage('Invalid bin type'),
    body('capacity_liters').isInt({ min: 100 }).withMessage('Capacity must be at least 100 liters')
  ],

  // Route validation
  routeValidation: [
    body('route_name').trim().notEmpty().withMessage('Route name is required'),
    body('assigned_worker_id').isInt().withMessage('Valid worker ID is required'),
    body('assigned_date').isISO8601().withMessage('Valid date is required'),
    body('estimated_duration_minutes').optional().isInt({ min: 1 }).withMessage('Invalid duration')
  ]
};

module.exports = {
  handleValidationErrors,
  validationRules
};
