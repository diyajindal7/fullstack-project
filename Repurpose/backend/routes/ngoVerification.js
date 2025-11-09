// routes/ngoVerification.js - NGO verification management
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// GET - Get all pending NGOs (Admin only)
// ======================
router.get('/pending', auth('admin'), async (req, res, next) => {
  try {
    const query = `
      SELECT id, name, email, location, documents, verification_status, remarks, created_at
      FROM users
      WHERE user_type = 'ngo' AND verification_status != 'Approved'
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(query);
    res.json({
      success: true,
      ngos: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get all NGOs (Admin only)
// ======================
router.get('/', auth('admin'), async (req, res, next) => {
  try {
    const query = `
      SELECT id, name, email, location, documents, verification_status, remarks, created_at
      FROM users
      WHERE user_type = 'ngo'
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(query);
    res.json({
      success: true,
      ngos: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// PUT - Approve/Reject NGO (Admin only)
// ======================
router.put('/:id/verify', auth('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verification_status, remarks } = req.body;

    if (!verification_status || !['Pending', 'Approved', 'Rejected'].includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid verification_status is required (Pending, Approved, Rejected)'
      });
    }

    // Verify NGO exists
    const [ngoCheck] = await db.query('SELECT id, email, name FROM users WHERE id = ? AND user_type = ?', [id, 'ngo']);
    if (ngoCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    const ngo = ngoCheck[0];

    // Update verification status
    const updates = ['verification_status = ?'];
    const values = [verification_status];

    if (remarks !== undefined) {
      updates.push('remarks = ?');
      values.push(remarks);
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // TODO: Send email notification
    // For now, we'll just log it
    console.log(`📧 Email notification would be sent to ${ngo.email} about verification status: ${verification_status}`);

    res.json({
      success: true,
      message: `NGO ${verification_status === 'Approved' ? 'approved' : 'rejected'} successfully`,
      email: ngo.email // Return email for frontend confirmation
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

