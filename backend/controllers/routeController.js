// Routes Controller
// Handles waste collection route management

const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create new route
async function createRoute(req, res) {
  try {
    const { route_name, assigned_worker_id, assigned_date, scheduled_time, estimated_duration_minutes, bins } = req.body;

    // Generate route ID
    const route_id = `ROUTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const connection = await pool.getConnection();

    // Insert route
    const [routeResult] = await connection.execute(
      `INSERT INTO routes (route_id, route_name, assigned_worker_id, assigned_date, scheduled_time, 
       estimated_duration_minutes, total_bins_in_route)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [route_id, route_name, assigned_worker_id, assigned_date, scheduled_time, estimated_duration_minutes, bins.length]
    );

    // Add bins to route
    if (bins && bins.length > 0) {
      for (let i = 0; i < bins.length; i++) {
        await connection.execute(
          `INSERT INTO route_bins (route_id, bin_id, sequence_order, collection_status)
           VALUES (?, ?, ?, ?)`,
          [routeResult.insertId, bins[i], i + 1, 'pending']
        );
      }
    }

    await connection.release();

    return res.status(201).json(successResponse(
      { id: routeResult.insertId, route_id },
      'Route created successfully',
      201
    ));
  } catch (err) {
    console.error('Create route error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to create route', err.message));
  }
}

// Get routes for worker
async function getWorkerRoutes(req, res) {
  try {
    const { workerId } = req.params;
    const { status, date } = req.query;

    const connection = await pool.getConnection();

    let query = `SELECT r.*, COUNT(rb.id) as total_bins, 
                 SUM(CASE WHEN rb.collection_status = 'completed' THEN 1 ELSE 0 END) as completed_bins
                 FROM routes r
                 LEFT JOIN route_bins rb ON r.id = rb.route_id
                 WHERE r.assigned_worker_id = ?`;
    let values = [workerId];

    if (status) {
      query += ' AND r.status = ?';
      values.push(status);
    }

    if (date) {
      query += ' AND DATE(r.assigned_date) = ?';
      values.push(date);
    }

    query += ' GROUP BY r.id ORDER BY r.assigned_date DESC, r.scheduled_time ASC';

    const [routes] = await connection.execute(query, values);

    // Get bins for each route
    for (let route of routes) {
      const [routeBins] = await connection.execute(
        `SELECT rb.*, sb.bin_id, sb.location_name, sb.fill_level, sb.status
         FROM route_bins rb
         JOIN smart_bins sb ON rb.bin_id = sb.id
         WHERE rb.route_id = ?
         ORDER BY rb.sequence_order ASC`,
        [route.id]
      );
      route.bins = routeBins;
    }

    await connection.release();

    return res.status(200).json(successResponse(
      { routes, total: routes.length },
      'Worker routes retrieved'
    ));
  } catch (err) {
    console.error('Get worker routes error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get routes', err.message));
  }
}

// Update route status
async function updateRouteStatus(req, res) {
  try {
    const { routeId } = req.params;
    const { status } = req.body;

    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE routes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, routeId]
    );

    const [updatedRoute] = await connection.execute(
      'SELECT * FROM routes WHERE id = ?',
      [routeId]
    );

    await connection.release();

    if (updatedRoute.length === 0) {
      return res.status(404).json(errorResponse(404, 'Route not found'));
    }

    return res.status(200).json(successResponse(updatedRoute[0], 'Route status updated'));
  } catch (err) {
    console.error('Update route error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to update route', err.message));
  }
}

// Mark bin as collected in route
async function markBinCollected(req, res) {
  try {
    const { routeId, binId } = req.params;
    const { waste_weight_kg } = req.body;

    const connection = await pool.getConnection();

    // Update route bin status
    await connection.execute(
      `UPDATE route_bins SET collection_status = ?, collection_time = CURRENT_TIMESTAMP, waste_weight_kg = ?
       WHERE route_id = ? AND bin_id = ?`,
      ['completed', waste_weight_kg, routeId, binId]
    );

    // Get the bin record
    const [bins] = await connection.execute(
      'SELECT id FROM smart_bins WHERE id = ?',
      [binId]
    );

    if (bins.length > 0) {
      // Create collection log
      const [workerData] = await connection.execute(
        'SELECT assigned_worker_id FROM routes WHERE id = ?',
        [routeId]
      );

      await connection.execute(
        `INSERT INTO collection_logs (bin_id, worker_id, route_id, waste_weight_kg, fill_level_after)
         VALUES (?, ?, ?, ?, ?)`,
        [binId, workerData[0].assigned_worker_id, routeId, waste_weight_kg, 0]
      );

      // Update bin status to empty
      await connection.execute(
        'UPDATE smart_bins SET fill_level = 0, status = ?, last_collection_time = CURRENT_TIMESTAMP WHERE id = ?',
        ['empty', binId]
      );
    }

    await connection.release();

    return res.status(200).json(successResponse(null, 'Bin marked as collected'));
  } catch (err) {
    console.error('Mark bin collected error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to mark bin', err.message));
  }
}

// Get all routes (Admin)
async function getAllRoutes(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM routes');

    const [routes] = await connection.execute(
      `SELECT r.*, u.name as worker_name FROM routes r
       JOIN workers w ON r.assigned_worker_id = w.id
       JOIN users u ON w.user_id = u.id
       ORDER BY r.assigned_date DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        routes,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      },
      'Routes retrieved'
    ));
  } catch (err) {
    console.error('Get all routes error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get routes', err.message));
  }
}

module.exports = {
  createRoute,
  getWorkerRoutes,
  updateRouteStatus,
  markBinCollected,
  getAllRoutes
};
