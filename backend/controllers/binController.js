// Smart Bins Controller
// Handles all smart bin operations

const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create new smart bin
async function createBin(req, res) {
  try {
    const { bin_id, location_name, location_latitude, location_longitude, bin_type = 'medium', capacity_liters = 1000 } = req.body;

    const connection = await pool.getConnection();

    // Check if bin already exists
    const [existingBin] = await connection.execute(
      'SELECT id FROM smart_bins WHERE bin_id = ?',
      [bin_id]
    );

    if (existingBin.length > 0) {
      await connection.release();
      return res.status(409).json(errorResponse(409, 'Bin ID already exists'));
    }

    // Insert new bin
    const [result] = await connection.execute(
      'INSERT INTO smart_bins (bin_id, location_name, location_latitude, location_longitude, bin_type, capacity_liters) VALUES (?, ?, ?, ?, ?, ?)',
      [bin_id, location_name, location_latitude, location_longitude, bin_type, capacity_liters]
    );

    await connection.release();

    return res.status(201).json(successResponse(
      { id: result.insertId, bin_id, location_name, bin_type },
      'Smart bin created successfully',
      201
    ));
  } catch (err) {
    console.error('Create bin error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to create bin', err.message));
  }
}

// Get all smart bins with pagination
async function getAllBins(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM smart_bins');
    const total = countResult[0].total;

    // Get bins with pagination
    const [bins] = await connection.execute(
      'SELECT * FROM smart_bins ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        bins,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'Bins retrieved successfully'
    ));
  } catch (err) {
    console.error('Get bins error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get bins', err.message));
  }
}

// Get bin details by ID
async function getBinById(req, res) {
  try {
    const { binId } = req.params;

    const connection = await pool.getConnection();

    const [bins] = await connection.execute(
      'SELECT * FROM smart_bins WHERE id = ?',
      [binId]
    );

    await connection.release();

    if (bins.length === 0) {
      return res.status(404).json(errorResponse(404, 'Bin not found'));
    }

    return res.status(200).json(successResponse(bins[0], 'Bin details retrieved'));
  } catch (err) {
    console.error('Get bin error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get bin', err.message));
  }
}

// Update bin fill level
async function updateBinFillLevel(req, res) {
  try {
    const { binId } = req.params;
    const { fill_level } = req.body;

    // Determine status based on fill level
    let status = 'empty';
    if (fill_level >= 90) {
      status = 'full';
    } else if (fill_level >= 50) {
      status = 'half_full';
    }

    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE smart_bins SET fill_level = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [fill_level, status, binId]
    );

    const [updatedBin] = await connection.execute(
      'SELECT * FROM smart_bins WHERE id = ?',
      [binId]
    );

    await connection.release();

    if (updatedBin.length === 0) {
      return res.status(404).json(errorResponse(404, 'Bin not found'));
    }

    return res.status(200).json(successResponse(updatedBin[0], 'Bin fill level updated'));
  } catch (err) {
    console.error('Update bin error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to update bin', err.message));
  }
}

// Get bins by status
async function getBinsByStatus(req, res) {
  try {
    const { status } = req.params;

    const connection = await pool.getConnection();

    const [bins] = await connection.execute(
      'SELECT * FROM smart_bins WHERE status = ? ORDER BY fill_level DESC',
      [status]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      { status, count: bins.length, bins },
      'Bins retrieved by status'
    ));
  } catch (err) {
    console.error('Get bins by status error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get bins', err.message));
  }
}

// Get nearby bins (within radius)
async function getNearbyBins(req, res) {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json(errorResponse(400, 'Latitude and longitude are required'));
    }

    const connection = await pool.getConnection();

    // Using Haversine formula to calculate distance
    const [bins] = await connection.execute(
      `SELECT id, bin_id, location_name, location_latitude, location_longitude, status, fill_level,
              (6371 * acos(cos(radians(?)) * cos(radians(location_latitude)) * cos(radians(location_longitude) - radians(?)) + sin(radians(?)) * sin(radians(location_latitude)))) AS distance
       FROM smart_bins
       WHERE is_active = TRUE
       HAVING distance <= ?
       ORDER BY distance ASC`,
      [latitude, longitude, latitude, radius]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      { nearby_bins_count: bins.length, bins },
      'Nearby bins retrieved'
    ));
  } catch (err) {
    console.error('Get nearby bins error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get nearby bins', err.message));
  }
}

module.exports = {
  createBin,
  getAllBins,
  getBinById,
  updateBinFillLevel,
  getBinsByStatus,
  getNearbyBins
};
