const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { itemSchema } = require('../validators/item');

// ======================
// GET all items (public)
// ======================
router.get('/', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM items');
    res.json({ success: true, items: results });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET items by category (public)
// ======================
router.get('/category/:id', async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const [results] = await db.query('SELECT * FROM items WHERE category_id = ?', [categoryId]);
    res.json({ success: true, items: results });
  } catch (err) {
    next(err);
  }
});

// ======================
// Get items uploaded by a specific user (place before '/:id' to avoid conflicts)
// ======================
router.get('/user/:userId', auth(), async (req, res, next) => {
  try {
    const requestedUserId = parseInt(req.params.userId, 10);
    const requester = req.user; // { id, role }

    if (!requestedUserId) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const isOwner = requester && requester.id === requestedUserId;
    const isAdmin = requester && requester.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const [results] = await db.query('SELECT * FROM items WHERE user_id = ?', [requestedUserId]);
    res.json({ success: true, items: results });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET single item by ID (public)
// ======================
router.get('/:id', async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const [results] = await db.query('SELECT * FROM items WHERE id = ?', [itemId]);
    if (results.length === 0)
      return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item: results[0] });
  } catch (err) {
    next(err);
  }
});

// ======================
// Add a new item (logged-in users)
// ======================
router.post('/add', auth(), validate(itemSchema), async (req, res, next) => {
  try {
    const { title, description, category_id, location, image_url } = req.validated;

    if (!title || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title and category_id are required',
      });
    }

    const query = `
      INSERT INTO items 
      (title, description, category_id, user_id, location, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [results] = await db.query(query, [
      title,
      description || '',
      category_id,
      req.user.id,
      location || '',
      image_url || '',
    ]);

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      itemId: results.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// UPDATE an item (owner only)
// ======================
router.put('/:id', auth(), async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { title, description, category_id, location, image_url } = req.body;

    const [check] = await db.query('SELECT * FROM items WHERE id = ? AND user_id = ?', [
      itemId,
      req.user.id,
    ]);

    if (check.length === 0) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to update this item' });
    }

    const updateQuery = `
      UPDATE items 
      SET title = ?, description = ?, category_id = ?, location = ?, image_url = ?
      WHERE id = ? AND user_id = ?
    `;

    await db.query(updateQuery, [
      title,
      description,
      category_id,
      location,
      image_url,
      itemId,
      req.user.id,
    ]);

    res.json({ success: true, message: 'Item updated successfully' });
  } catch (err) {
    next(err);
  }
});

// ======================
// DELETE an item (owner only)
// ======================
router.delete('/:id', auth(), async (req, res, next) => {
  try {
    const itemId = req.params.id;

    const [results] = await db.query('DELETE FROM items WHERE id = ? AND user_id = ?', [
      itemId,
      req.user.id,
    ]);

    if (results.affectedRows === 0)
      return res.status(403).json({ success: false, message: 'Not authorized or item not found' });

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ======================
// GET all items (admin only)
// ======================
router.get('/admin/all', auth('admin'), async (req, res, next) => {
  try {
    const [results] = await db.query(`
      SELECT items.*, users.name AS owner
      FROM items
      JOIN users ON items.user_id = users.id
    `);
    res.json({ success: true, items: results });
  } catch (err) {
    next(err);
  }
});

// ======================
// Get items uploaded by a specific user
// ======================
router.get('/user/:userId', auth(), async (req, res, next) => {
  try {
    const requestedUserId = parseInt(req.params.userId, 10);
    const requester = req.user; // { id, role }

    if (!requestedUserId) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    // Allow owner or admin
    const isOwner = requester && requester.id === requestedUserId;
    const isAdmin = requester && requester.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const [results] = await db.query('SELECT * FROM items WHERE user_id = ?', [requestedUserId]);
    res.json({ success: true, items: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
