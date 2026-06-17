// Analytics Controller
// Handles analytics and reporting data

const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get dashboard analytics
async function getDashboardAnalytics(req, res) {
  try {
    const connection = await pool.getConnection();

    // Get count of bins by status
    const [binStats] = await connection.execute(
      `SELECT status, COUNT(*) as count FROM smart_bins GROUP BY status`
    );

    // Get complaint stats
    const [complaintStats] = await connection.execute(
      `SELECT status, COUNT(*) as count FROM complaints GROUP BY status`
    );

    // Get today's collection stats
    const [collectionStats] = await connection.execute(
      `SELECT COUNT(*) as total_collections, SUM(waste_weight_kg) as total_waste
       FROM collection_logs WHERE DATE(collection_time) = CURDATE()`
    );

    // Get total bins
    const [totalBinsResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM smart_bins WHERE is_active = TRUE`
    );

    // Get full bins count
    const [fullBinsResult] = await connection.execute(
      `SELECT COUNT(*) as count FROM smart_bins WHERE status = 'full'`
    );

    // Get total users by role
    const [userStats] = await connection.execute(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        total_bins: totalBinsResult[0].total,
        full_bins: fullBinsResult[0].count,
        bin_stats: binStats,
        complaint_stats: complaintStats,
        collection_stats: {
          today_collections: collectionStats[0].total_collections || 0,
          today_waste_kg: collectionStats[0].total_waste || 0
        },
        user_stats: userStats
      },
      'Dashboard analytics retrieved'
    ));
  } catch (err) {
    console.error('Dashboard analytics error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get analytics', err.message));
  }
}

// Get waste trends (past 7 days)
async function getWasteTrends(req, res) {
  try {
    const connection = await pool.getConnection();

    const [trends] = await connection.execute(
      `SELECT DATE(collection_time) as date, SUM(waste_weight_kg) as total_waste, COUNT(*) as collections
       FROM collection_logs
       WHERE collection_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(collection_time)
       ORDER BY date ASC`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      { trends },
      'Waste trends retrieved'
    ));
  } catch (err) {
    console.error('Waste trends error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get trends', err.message));
  }
}

// Get complaints analytics
async function getComplaintAnalytics(req, res) {
  try {
    const connection = await pool.getConnection();

    // Complaints by category
    const [byCategory] = await connection.execute(
      `SELECT category, COUNT(*) as count FROM complaints GROUP BY category`
    );

    // Complaints by status
    const [byStatus] = await connection.execute(
      `SELECT status, COUNT(*) as count FROM complaints GROUP BY status`
    );

    // Average resolution time
    const [resolutionTime] = await connection.execute(
      `SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours
       FROM complaints WHERE status = 'resolved'`
    );

    // This month's complaints
    const [thisMonth] = await connection.execute(
      `SELECT COUNT(*) as count FROM complaints 
       WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        by_category: byCategory,
        by_status: byStatus,
        avg_resolution_hours: resolutionTime[0].avg_hours || 0,
        this_month: thisMonth[0].count
      },
      'Complaint analytics retrieved'
    ));
  } catch (err) {
    console.error('Complaint analytics error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get complaint analytics', err.message));
  }
}

// Get worker performance metrics
async function getWorkerMetrics(req, res) {
  try {
    const connection = await pool.getConnection();

    const [metrics] = await connection.execute(
      `SELECT 
        w.id, u.name as worker_name, w.total_collections, w.rating,
        COUNT(DISTINCT c.id) as completed_collections,
        SUM(c.waste_weight_kg) as total_waste_collected,
        AVG(TIMESTAMPDIFF(MINUTE, r.assigned_date, c.collection_time)) as avg_time_per_collection
       FROM workers w
       JOIN users u ON w.user_id = u.id
       LEFT JOIN collection_logs c ON w.id = c.worker_id
       LEFT JOIN routes r ON c.route_id = r.id
       GROUP BY w.id, u.name
       ORDER BY completed_collections DESC`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      { worker_metrics: metrics },
      'Worker metrics retrieved'
    ));
  } catch (err) {
    console.error('Worker metrics error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get metrics', err.message));
  }
}

// Generate monthly report
async function generateMonthlyReport(req, res) {
  try {
    const { month, year } = req.query;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const reportMonth = parseInt(month) || currentMonth;
    const reportYear = parseInt(year) || currentYear;

    const connection = await pool.getConnection();

    // Collections this month
    const [collections] = await connection.execute(
      `SELECT COUNT(*) as total, SUM(waste_weight_kg) as total_waste
       FROM collection_logs
       WHERE MONTH(collection_time) = ? AND YEAR(collection_time) = ?`,
      [reportMonth, reportYear]
    );

    // Complaints this month
    const [complaints] = await connection.execute(
      `SELECT COUNT(*) as total, SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) as resolved
       FROM complaints
       WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?`,
      [reportMonth, reportYear]
    );

    // Average bin fullness
    const [binStats] = await connection.execute(
      `SELECT AVG(fill_level) as avg_fill_level FROM smart_bins`
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        period: `${reportMonth}/${reportYear}`,
        collections: collections[0],
        complaints: complaints[0],
        avg_bin_fill_level: binStats[0].avg_fill_level
      },
      'Monthly report generated'
    ));
  } catch (err) {
    console.error('Generate report error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to generate report', err.message));
  }
}

module.exports = {
  getDashboardAnalytics,
  getWasteTrends,
  getComplaintAnalytics,
  getWorkerMetrics,
  generateMonthlyReport
};
