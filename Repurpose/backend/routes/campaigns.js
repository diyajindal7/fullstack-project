// routes/campaigns.js - NGO Campaigns management
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// GET - Get all active/approved campaigns (public)
// ======================
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT c.*, u.name AS ngo_name, u.email AS ngo_email, u.location AS ngo_location
      FROM ngo_campaigns c
      JOIN users u ON c.ngo_id = u.id
      WHERE c.approval_status IN ('Approved', 'Pending')
        AND (c.end_date IS NULL OR c.end_date >= CURDATE())
    `;
    const params = [];

    if (category) {
      query += ' AND c.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY c.created_at DESC';

    const [results] = await db.query(query, params);
    res.json({
      success: true,
      campaigns: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get campaign by ID (public)
// ======================
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT c.*, u.name AS ngo_name, u.email AS ngo_email, u.location AS ngo_location
      FROM ngo_campaigns c
      JOIN users u ON c.ngo_id = u.id
      WHERE c.id = ? AND c.approval_status IN ('Approved', 'Pending')
    `;

    const [results] = await db.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      campaign: results[0]
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// POST - Create a new campaign (NGO only)
// ======================
router.post('/', auth(), async (req, res, next) => {
  try {
    const { title, description, category, image_url, start_date, end_date, contact_link } = req.body;
    const ngo_id = req.user.id;
    const userType = req.user.role || req.user.user_type;

    // Only NGOs can create campaigns
    if (userType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can create campaigns'
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const query = `
      INSERT INTO ngo_campaigns 
      (ngo_id, title, description, category, image_url, start_date, end_date, contact_link, approval_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    const [result] = await db.query(query, [
      ngo_id,
      title,
      description,
      category || null,
      image_url || null,
      start_date || null,
      end_date || null,
      contact_link || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully. It will be reviewed by admin before going live.',
      campaignId: result.insertId
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get campaigns by NGO (NGO only)
// ======================
router.get('/ngo/my-campaigns', auth(), async (req, res, next) => {
  try {
    const ngo_id = req.user.id;
    const userType = req.user.role || req.user.user_type;

    if (userType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can access this endpoint'
      });
    }

    const query = `
      SELECT * FROM ngo_campaigns
      WHERE ngo_id = ?
      ORDER BY created_at DESC
    `;

    const [results] = await db.query(query, [ngo_id]);
    res.json({
      success: true,
      campaigns: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get all campaigns for admin review (Admin only)
// ======================
router.get('/admin/pending', auth('admin'), async (req, res, next) => {
  try {
    const query = `
      SELECT c.*, u.name AS ngo_name, u.email AS ngo_email
      FROM ngo_campaigns c
      JOIN users u ON c.ngo_id = u.id
      WHERE c.approval_status = 'Pending'
      ORDER BY c.created_at DESC
    `;

    const [results] = await db.query(query);
    res.json({
      success: true,
      campaigns: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// PUT - Approve/Reject campaign (Admin only)
// ======================
router.put('/:id/approve', auth('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approval_status } = req.body;

    if (!approval_status || !['Pending', 'Approved', 'Rejected'].includes(approval_status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid approval_status is required (Pending, Approved, Rejected)'
      });
    }

    const query = 'UPDATE ngo_campaigns SET approval_status = ? WHERE id = ?';
    const [result] = await db.query(query, [approval_status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: `Campaign ${approval_status === 'Approved' ? 'approved' : 'rejected'} successfully`
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

