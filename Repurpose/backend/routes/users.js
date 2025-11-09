// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==========================
// CREATE a new user
// ==========================
router.post('/', async (req, res) => {
  console.log('📩 Received POST /api/users');
  const { name, email, password, user_type, documents } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered. Please use a different email or login.' });
    }

    const finalUserType = user_type || 'individual';
    const isNgo = finalUserType === 'ngo';
    
    // For NGOs, set verification_status to 'Pending' and store documents
    const verificationStatus = isNgo ? 'Pending' : null;
    const documentsValue = isNgo ? (documents || null) : null;

    // Build query dynamically based on whether it's an NGO
    let query, params;
    if (isNgo) {
      query = 'INSERT INTO users (name, email, password, user_type, documents, verification_status) VALUES (?, ?, ?, ?, ?, ?)';
      params = [name, email, password, finalUserType, documentsValue, verificationStatus];
    } else {
      query = 'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)';
      params = [name, email, password, finalUserType];
    }

    const [result] = await db.query(query, params);
    
    res.status(201).json({ 
      success: true,
      message: isNgo 
        ? 'Your registration request has been submitted. Please wait for admin verification. You\'ll be notified via your registered email once approved.'
        : 'User created successfully', 
      id: result.insertId,
      requiresVerification: isNgo
    });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({ message: 'Email already registered. Please use a different email or login.' });
    }
    
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
// GET individual users for NGO reporting (NGO-only) - MUST come before /:id route
// ==========================
const auth = require('../middleware/auth');
router.get('/for-reporting', auth(), async (req, res) => {
  try {
    const userType = req.user.role || req.user.user_type;
    
    // Only NGOs can access this endpoint
    if (userType !== 'ngo') {
      return res.status(403).json({ 
        success: false,
        message: 'Only NGOs can access this endpoint' 
      });
    }

    const [rows] = await db.query(
      'SELECT id, name, email FROM users WHERE user_type = ?', 
      ['individual']
    );
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('❌ Error fetching users for reporting:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// ==========================
// GET users by role (admin-only) - MUST come before /:id route
// ==========================
router.get('/role/:role', auth('admin'), async (req, res) => {
  const { role } = req.params;
  try {
    const [rows] = await db.query('SELECT id, name, email, user_type FROM users WHERE user_type = ?', [role]);
    res.json({ users: rows });
  } catch (error) {
    console.error('❌ Error fetching users by role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// GET user by ID (for chat - get other user info)
// ==========================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Check if it's a number to avoid conflicts with 'role' route
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const [rows] = await db.query('SELECT id, name, email, user_type FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ==========================
// UPDATE a user
// ==========================
router.put('/:id', auth(), async (req, res) => {
  const { id } = req.params;
  const { name, email, password, user_type, location } = req.body;
  const currentUserId = req.user.id;
  // Check if user is admin - role can be 'admin' or user_type can be 'admin'
  const isAdmin = req.user.role === 'admin' || req.user.user_type === 'admin';

  // Users can only update their own profile (unless admin)
  if (parseInt(id) !== currentUserId && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to update this user' });
  }

  try {
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password !== undefined) {
      updates.push('password = ?');
      values.push(password);
    }
    if (user_type !== undefined && isAdmin) {
      updates.push('user_type = ?');
      values.push(user_type);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    console.log('Update query:', query);
    console.log('Update values:', values);
    
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Provide more specific error messages
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ 
        message: 'Database schema error: ' + (error.sqlMessage || 'Column not found') 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal Server Error: ' + (error.message || 'Unknown error'),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
  const { email, password, userType } = req.body;

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

    // Optional: Validate userType matches if provided (for better UX)
    if (userType && user.user_type !== userType) {
      return res.status(403).json({ 
        message: `This account is registered as ${user.user_type}, not ${userType}. Please select the correct user type.` 
      });
    }

    // Block NGO login if not approved
    if (user.user_type === 'ngo') {
      const verificationStatus = user.verification_status || 'Pending';
      if (verificationStatus !== 'Approved') {
        return res.status(403).json({
          message: `Your NGO account is ${verificationStatus}. Please wait for admin approval. You'll be notified via email once approved.`
        });
      }
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
