// routes/impact.js - Impact tracking system
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// GET - Get all impact updates (public)
// ======================
router.get('/', async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;
    const query = `
      SELECT 
        iu.*,
        u.name AS ngo_name,
        u.location AS ngo_location,
        it.title AS item_title,
        it.description AS item_description
      FROM impact_updates iu
      JOIN users u ON iu.ngo_id = u.id
      JOIN items it ON iu.item_id = it.id
      ORDER BY iu.created_at DESC
      LIMIT ?
    `;

    const [results] = await db.query(query, [parseInt(limit)]);
    res.json({
      success: true,
      updates: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get top impact updates for homepage (public)
// ======================
router.get('/top', async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;
    const query = `
      SELECT 
        iu.*,
        u.name AS ngo_name,
        u.location AS ngo_location,
        it.title AS item_title
      FROM impact_updates iu
      JOIN users u ON iu.ngo_id = u.id
      JOIN items it ON iu.item_id = it.id
      ORDER BY iu.created_at DESC
      LIMIT ?
    `;

    const [results] = await db.query(query, [parseInt(limit)]);
    res.json({
      success: true,
      updates: results
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// POST - Create impact update (NGO only)
// ======================
router.post('/', auth(), async (req, res, next) => {
  try {
    const { item_id, message, image_url } = req.body;
    const ngo_id = req.user.id;
    const userType = req.user.role || req.user.user_type;

    // Only NGOs can create impact updates
    if (userType !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only NGOs can create impact updates'
      });
    }

    if (!item_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'item_id and message are required'
      });
    }

    // Verify item exists and request was completed
    const [itemCheck] = await db.query(
      'SELECT id FROM items WHERE id = ?',
      [item_id]
    );

    if (itemCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if there's a completed request for this item by this NGO
    const [requestCheck] = await db.query(
      'SELECT id FROM requests WHERE item_id = ? AND requester_id = ? AND status = ?',
      [item_id, ngo_id, 'completed']
    );

    if (requestCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You can only post impact updates for completed requests'
      });
    }

    const query = `
      INSERT INTO impact_updates (item_id, ngo_id, message, image_url)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      item_id,
      ngo_id,
      message,
      image_url || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Impact update created successfully',
      updateId: result.insertId
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Get impact updates by NGO (NGO only)
// ======================
router.get('/my-updates', auth(), async (req, res, next) => {
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
      SELECT 
        iu.*,
        it.title AS item_title
      FROM impact_updates iu
      JOIN items it ON iu.item_id = it.id
      WHERE iu.ngo_id = ?
      ORDER BY iu.created_at DESC
    `;

    const [results] = await db.query(query, [ngo_id]);
    res.json({
      success: true,
      updates: results
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

