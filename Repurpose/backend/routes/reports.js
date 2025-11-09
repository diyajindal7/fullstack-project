// routes/reports.js - User reporting system
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// POST - Create a report (NGO only)
// ======================
router.post('/', auth(), async (req, res, next) => {
  try {
    const { reported_user_id, reason, description } = req.body;
    const reporter_id = req.user.id;
    const reporterType = req.user.role || req.user.user_type;

    // Only NGOs can report users
    if (reporterType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can report users'
      });
    }

    if (!reported_user_id || !reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'reported_user_id, reason, and description are required'
      });
    }

    // Verify reported user exists
    const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [reported_user_id]);
    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reported user not found'
      });
    }

    // Prevent self-reporting
    if (reporter_id === reported_user_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report yourself'
      });
    }

    const query = `
      INSERT INTO user_reports (reported_user_id, reporter_id, reason, description, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    const [result] = await db.query(query, [reported_user_id, reporter_id, reason, description]);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      reportId: result.insertId
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get all reports (Admin only)
// ======================
router.get('/', auth('admin'), async (req, res, next) => {
  try {
    const query = `
      SELECT r.*, 
        u1.name AS reported_user_name, u1.email AS reported_user_email,
        u2.name AS reporter_name, u2.email AS reporter_email
      FROM user_reports r
      JOIN users u1 ON r.reported_user_id = u1.id
      JOIN users u2 ON r.reporter_id = u2.id
      ORDER BY r.created_at DESC
    `;

    const [results] = await db.query(query);
    res.json({
      success: true,
      reports: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// PUT - Update report status (Admin only)
// ======================
router.put('/:id/status', auth('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_remarks } = req.body;

    if (!status || !['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, reviewed, resolved, dismissed)'
      });
    }

    const updates = ['status = ?'];
    const values = [status];

    if (admin_remarks !== undefined) {
      updates.push('admin_remarks = ?');
      values.push(admin_remarks);
    }

    values.push(id);

    const query = `UPDATE user_reports SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

