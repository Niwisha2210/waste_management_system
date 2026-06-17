// Predictions Controller
// AI-based prediction for bin fill levels

const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const config = require('../config/config');

// Simple linear regression for prediction (can be replaced with ML model)
function predictFillLevel(historicalData) {
  if (historicalData.length < 2) {
    return historicalData[historicalData.length - 1]?.fill_level || 0;
  }

  // Calculate average daily increase
  let totalIncrease = 0;
  for (let i = 1; i < historicalData.length; i++) {
    totalIncrease += (historicalData[i].fill_level - historicalData[i - 1].fill_level);
  }

  const avgDailyIncrease = totalIncrease / (historicalData.length - 1);
  const currentFill = historicalData[historicalData.length - 1].fill_level;

  // Predict when it will reach 100%
  let daysToFull = 0;
  if (avgDailyIncrease > 0) {
    daysToFull = Math.ceil((100 - currentFill) / avgDailyIncrease);
  }

  return {
    predictedFill: Math.min(currentFill + (avgDailyIncrease * 1), 100), // 1 day prediction
    daysToFull: Math.max(daysToFull, 1),
    confidence: Math.min(historicalData.length * 10, 95) // Higher confidence with more data
  };
}

// Generate predictions for a bin
async function generateBinPrediction(req, res) {
  try {
    const { binId } = req.params;

    const connection = await pool.getConnection();

    // Get bin details
    const [bins] = await connection.execute(
      'SELECT * FROM smart_bins WHERE id = ?',
      [binId]
    );

    if (bins.length === 0) {
      await connection.release();
      return res.status(404).json(errorResponse(404, 'Bin not found'));
    }

    const bin = bins[0];

    // Get historical collection data for prediction
    const [historicalData] = await connection.execute(
      `SELECT cl.fill_level_before as fill_level, cl.collection_time as date
       FROM collection_logs cl
       WHERE cl.bin_id = ?
       ORDER BY cl.collection_time DESC
       LIMIT 30`,
      [binId]
    );

    // Get current fill level trend
    const prediction = predictFillLevel(historicalData.length > 0 ? historicalData : [{ fill_level: bin.fill_level }]);

    // Determine alert status
    let alertStatus = 'no_alert';
    if (prediction.predictedFill >= config.MIN_FILL_LEVEL_CRITICAL) {
      alertStatus = 'critical';
    } else if (prediction.predictedFill >= config.MIN_FILL_LEVEL_WARNING) {
      alertStatus = 'warning';
    }

    const predictionDate = new Date();
    predictionDate.setDate(predictionDate.getDate() + prediction.daysToFull);

    // Store prediction
    await connection.execute(
      `INSERT INTO predictions (bin_id, prediction_date, predicted_fill_level, predicted_collection_date, confidence_score, alert_status)
       VALUES (?, CURDATE(), ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       predicted_fill_level = ?, predicted_collection_date = ?, confidence_score = ?, alert_status = ?`,
      [
        binId,
        prediction.predictedFill,
        predictionDate.toISOString().split('T')[0],
        prediction.confidence,
        alertStatus,
        prediction.predictedFill,
        predictionDate.toISOString().split('T')[0],
        prediction.confidence,
        alertStatus
      ]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        bin_id: bin.bin_id,
        current_fill_level: bin.fill_level,
        predicted_fill_level: Math.round(prediction.predictedFill * 100) / 100,
        days_to_full: prediction.daysToFull,
        predicted_collection_date: predictionDate.toISOString().split('T')[0],
        confidence_score: prediction.confidence,
        alert_status: alertStatus
      },
      'Prediction generated successfully'
    ));
  } catch (err) {
    console.error('Generate prediction error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to generate prediction', err.message));
  }
}

// Get all critical predictions
async function getCriticalPredictions(req, res) {
  try {
    const connection = await pool.getConnection();

    const [predictions] = await connection.execute(
      `SELECT p.*, sb.bin_id, sb.location_name, sb.fill_level
       FROM predictions p
       JOIN smart_bins sb ON p.bin_id = sb.id
       WHERE p.alert_status IN ('critical', 'warning')
       AND p.prediction_date = CURDATE()
       ORDER BY p.alert_status DESC, p.predicted_fill_level DESC`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      { predictions, count: predictions.length },
      'Critical predictions retrieved'
    ));
  } catch (err) {
    console.error('Get critical predictions error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get predictions', err.message));
  }
}

// Generate predictions for all bins
async function generateAllPredictions(req, res) {
  try {
    const connection = await pool.getConnection();

    // Get all active bins
    const [bins] = await connection.execute(
      'SELECT id FROM smart_bins WHERE is_active = TRUE'
    );

    let successCount = 0;
    let errorCount = 0;

    // Generate prediction for each bin
    for (let bin of bins) {
      try {
        // Get historical data
        const [historicalData] = await connection.execute(
          `SELECT cl.fill_level_before as fill_level
           FROM collection_logs cl
           WHERE cl.bin_id = ?
           ORDER BY cl.collection_time DESC
           LIMIT 30`,
          [bin.id]
        );

        // Get current bin data
        const [currentBin] = await connection.execute(
          'SELECT fill_level FROM smart_bins WHERE id = ?',
          [bin.id]
        );

        const prediction = predictFillLevel(historicalData.length > 0 ? historicalData : [{ fill_level: currentBin[0].fill_level }]);

        let alertStatus = 'no_alert';
        if (prediction.predictedFill >= config.MIN_FILL_LEVEL_CRITICAL) {
          alertStatus = 'critical';
        } else if (prediction.predictedFill >= config.MIN_FILL_LEVEL_WARNING) {
          alertStatus = 'warning';
        }

        const predictionDate = new Date();
        predictionDate.setDate(predictionDate.getDate() + prediction.daysToFull);

        await connection.execute(
          `INSERT INTO predictions (bin_id, prediction_date, predicted_fill_level, predicted_collection_date, confidence_score, alert_status)
           VALUES (?, CURDATE(), ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           predicted_fill_level = ?, predicted_collection_date = ?, confidence_score = ?, alert_status = ?`,
          [
            bin.id,
            prediction.predictedFill,
            predictionDate.toISOString().split('T')[0],
            prediction.confidence,
            alertStatus,
            prediction.predictedFill,
            predictionDate.toISOString().split('T')[0],
            prediction.confidence,
            alertStatus
          ]
        );

        successCount++;
      } catch (err) {
        console.error(`Error predicting for bin ${bin.id}:`, err);
        errorCount++;
      }
    }

    await connection.release();

    return res.status(200).json(successResponse(
      { success_count: successCount, error_count: errorCount, total_bins: bins.length },
      'Predictions generated for all bins'
    ));
  } catch (err) {
    console.error('Generate all predictions error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to generate predictions', err.message));
  }
}

module.exports = {
  generateBinPrediction,
  getCriticalPredictions,
  generateAllPredictions
};
