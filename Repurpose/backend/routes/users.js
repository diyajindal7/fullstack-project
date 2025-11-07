// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==========================
// CREATE a new user
// ==========================
router.post('/', async (req, res) => {
  console.log('📩 Received POST /api/users');
  const { name, email, password, user_type } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
      [name, email, password, user_type || 'individual']
    );
    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// GET all users
// ==========================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// GET users by role (admin-only)
// ==========================
const auth = require('../middleware/auth');
router.get('/role/:role', auth('admin'), async (req, res) => {
  const { role } = req.params;
  try {
    const [rows] = await db.query('SELECT id, name, email, user_type FROM users WHERE user_type = ?', [role]);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching users by role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// UPDATE a user
// ==========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, user_type } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, password = ?, user_type = ? WHERE id = ?',
      [name, email, password, user_type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// DELETE a user
// ==========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// ==========================
// LOGIN (Authenticate User)
// ==========================
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // (Optional) Use bcrypt.compare() if you hash passwords later
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.user_type }, // Payload
      process.env.JWT_SECRET || 'mysecretkey', // Secret key
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error('❌ Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
