const express = require('express');
const router = express.Router();
const db = require('../config/db'); // make sure your db connection file is here
const auth = require('../middleware/auth');

// ✅ 1. GET all admins
router.get('/', (req, res) => {
  const query = 'SELECT * FROM admin';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admins:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// ✅ 2. POST - Add new admin
router.post('/', (req, res) => {
  console.log('📩 Received POST /api/admins');
  console.log('🧠 Request Body:', req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      console.error('Error inserting admin:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.status(201).json({ message: 'Admin added successfully', id: result.insertId });
  });
});

// ✅ 3. PUT - Update admin by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'UPDATE admin SET name = ?, email = ?, password = ? WHERE id = ?';
  db.query(query, [name, email, password, id], (err, result) => {
    if (err) {
      console.error('Error updating admin:', err);
      return res.status(500).json({ error: 'Database update failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully' });
  });
});

// ✅ 4. DELETE - Remove admin by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM admin WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting admin:', err);
      return res.status(500).json({ error: 'Database delete failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  });
});

module.exports = router;

// ======================
// Admin stats (admin-only)
// ======================
router.get('/stats', auth('admin'), async (req, res) => {
  try {
    const [[{ userCount }]] = await db.query('SELECT COUNT(*) AS userCount FROM users');
    const [[{ itemCount }]] = await db.query('SELECT COUNT(*) AS itemCount FROM items');
    const [[{ requestCount }]] = await db.query('SELECT COUNT(*) AS requestCount FROM requests');
    const [byRole] = await db.query(
      'SELECT user_type AS role, COUNT(*) AS count FROM users GROUP BY user_type'
    );
    const [requestsByStatus] = await db.query(
      'SELECT status, COUNT(*) AS count FROM requests GROUP BY status'
    );

    res.json({
      success: true,
      users: { total: userCount, byRole },
      items: { total: itemCount },
      requests: { total: requestCount, byStatus: requestsByStatus },
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
