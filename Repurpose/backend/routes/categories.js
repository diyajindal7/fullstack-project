const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categorySchema } = require('../validators/category');

// ======================
// GET all categories (public)
// ======================
router.get('/', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM categories');
    res.json({ success: true, categories: results });
  } catch (err) {
    next(err);
  }
});

// ======================
// Add a new category (admin only)
// ======================
router.post('/add', auth('admin'), validate(categorySchema), async (req, res, next) => {
  try {
    const { name, description } = req.validated;

    if (!name) {
      return res.status(400).json({ success: false, message: 'name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      categoryId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// Delete a category (admin only)
// ======================
router.delete('/:id', auth('admin'), async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// ======================
// Add a new category (admin-only)
// ======================
// (duplicate add route removed)

// ======================
// DELETE a category (admin-only)
// ======================
// (duplicate delete route removed)

module.exports = router;
