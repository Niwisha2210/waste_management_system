// Complaints Controller
// Handles complaint creation, tracking, and management

const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create new complaint
async function createComplaint(req, res) {
  try {
    const userId = req.user.id;
    const { title, description, category, waste_dumped = 'dumped', material_type = 'biodegradable', location_latitude, location_longitude } = req.body;
    
    // Get image filename if uploaded
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Generate complaint ID
    const complaint_id = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      `INSERT INTO complaints (complaint_id, user_id, title, description, image_url, category, 
       waste_dumped, material_type, location_latitude, location_longitude, status, priority) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [complaint_id, userId, title, description, image_url, category, waste_dumped, material_type, location_latitude, 
       location_longitude, 'pending', 'medium']
    );

    await connection.release();

    return res.status(201).json(successResponse(
      { id: result.insertId, complaint_id },
      'Complaint filed successfully',
      201
    ));
  } catch (err) {
    console.error('Create complaint error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to create complaint', err.message));
  }
}

// Get all complaints for user
async function getUserComplaints(req, res) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    // Get total count
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM complaints WHERE user_id = ?',
      [userId]
    );

    // Get complaints
    const [complaints] = await connection.execute(
      `SELECT c.*, u.name as reported_by FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    await connection.release();

    return res.status(200).json(successResponse(
      {
        complaints,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      },
      'User complaints retrieved'
    ));
  } catch (err) {
    console.error('Get user complaints error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get complaints', err.message));
  }
}

// Get all complaints (Admin only)
async function getAllComplaints(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, priority } = req.query;

    const connection = await pool.getConnection();

    let query = 'SELECT COUNT(*) as total FROM complaints WHERE 1=1';
    let countValues = [];
    let dataQuery = `SELECT c.*, u.name as reported_by, w.user_id as worker_id FROM complaints c
                    JOIN users u ON c.user_id = u.id
                    LEFT JOIN workers w ON c.assigned_worker_id = w.id
                    WHERE 1=1`;
    let dataValues = [];

    if (status) {
      query += ' AND status = ?';
      dataQuery += ' AND c.status = ?';
      countValues.push(status);
      dataValues.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      dataQuery += ' AND c.priority = ?';
      countValues.push(priority);
      dataValues.push(priority);
    }

    query += ' ORDER BY created_at DESC';
    dataQuery += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';

    const [countResult] = await connection.execute(query, countValues);
    dataValues.push(limit, offset);
    const [complaints] = await connection.execute(dataQuery, dataValues);

    await connection.release();

    return res.status(200).json(successResponse(
      {
        complaints,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      },
      'All complaints retrieved'
    ));
  } catch (err) {
    console.error('Get all complaints error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to get complaints', err.message));
  }
}

// Update complaint status
async function updateComplaintStatus(req, res) {
  try {
    const { complaintId } = req.params;
    const { status, resolution_notes } = req.body;

    const connection = await pool.getConnection();

    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (resolution_notes && status === 'resolved') {
      updateFields.push('resolution_notes = ?');
      updateFields.push('resolved_at = CURRENT_TIMESTAMP');
      updateValues.push(resolution_notes);
    }

    updateValues.push(complaintId);

    await connection.execute(
      `UPDATE complaints SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updatedComplaint] = await connection.execute(
      'SELECT * FROM complaints WHERE id = ?',
      [complaintId]
    );

    await connection.release();

    if (updatedComplaint.length === 0) {
      return res.status(404).json(errorResponse(404, 'Complaint not found'));
    }

    return res.status(200).json(successResponse(updatedComplaint[0], 'Complaint status updated'));
  } catch (err) {
    console.error('Update complaint error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to update complaint', err.message));
  }
}

// Assign complaint to worker
async function assignComplaint(req, res) {
  try {
    const { complaintId } = req.params;
    const { assigned_worker_id } = req.body;

    const connection = await pool.getConnection();

    await connection.execute(
      'UPDATE complaints SET assigned_worker_id = ?, status = ? WHERE id = ?',
      [assigned_worker_id, 'in_progress', complaintId]
    );

    const [updatedComplaint] = await connection.execute(
      'SELECT * FROM complaints WHERE id = ?',
      [complaintId]
    );

    await connection.release();

    return res.status(200).json(successResponse(updatedComplaint[0], 'Complaint assigned to worker'));
  } catch (err) {
    console.error('Assign complaint error:', err);
    return res.status(500).json(errorResponse(500, 'Failed to assign complaint', err.message));
  }
}

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint
};
