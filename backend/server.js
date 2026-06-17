// Main Server Setup
// Express.js server configuration and initialization

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/config');
const { testConnection } = require('./config/database');
const { errorHandler, asyncHandler } = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const binRoutes = require('./routes/binRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const routeRoutes = require('./routes/routeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// Initialize express app
const app = express();

// Security middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
const apiVersion = config.API_VERSION;

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/bins`, binRoutes);
app.use(`${apiVersion}/complaints`, complaintRoutes);
app.use(`${apiVersion}/routes`, routeRoutes);
app.use(`${apiVersion}/analytics`, analyticsRoutes);
app.use(`${apiVersion}/predictions`, predictionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('✗ Cannot start server without database connection');
      process.exit(1);
    }

    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(config.UPLOAD_DIR)) {
      fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
      console.log('✓ Uploads directory created');
    }

    // Start listening
    app.listen(config.PORT, () => {
      console.log(`\n╔════════════════════════════════════════════╗`);
      console.log(`║ Smart Waste Management System - Backend     ║`);
      console.log(`║ Server running on port ${config.PORT}                   ║`);
      console.log(`║ Environment: ${config.NODE_ENV}              ║`);
      console.log(`║ API Version: ${config.API_VERSION}                   ║`);
      console.log(`╚════════════════════════════════════════════╝\n`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = app;
