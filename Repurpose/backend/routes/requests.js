const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { requestSchema } = require('../validators/request');

// ======================
// GET all requests (public, or protect if needed)
// ======================
router.get('/', async (req, res, next) => {
    try {
        const query = `
            SELECT r.*, u.name AS requester_name, i.title AS item_title
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            JOIN items i ON r.item_id = i.id
        `;
        const [results] = await db.query(query);
        res.json({ success: true, requests: results });
    } catch (err) {
        next(err);
    }
});

// ======================
// GET only pending requests (admin)
// ======================
router.get('/pending', auth('admin'), async (req, res, next) => {
    try {
        const query = `
            SELECT r.*, u.name AS requester_name, i.title AS item_title
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            JOIN items i ON r.item_id = i.id
            WHERE r.status = 'pending'
        `;
        const [results] = await db.query(query);
        res.json({ success: true, requests: results });
    } catch (err) {
        next(err);
    }
});

// ======================
// GET requests for current user (NGO or individual)
// ======================
router.get('/my-requests', auth(), async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const query = `
            SELECT r.*, u.name AS requester_name, i.title AS item_title, 
                   i.description AS item_description, 
                   COALESCE(i.location, '') AS item_location
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            JOIN items i ON r.item_id = i.id
            WHERE r.requester_id = ?
            ORDER BY r.created_at DESC
        `;
        const [results] = await db.query(query, [currentUserId]);
        res.json({ success: true, requests: results });
    } catch (err) {
        next(err);
    }
});

// ======================
// Add a new request (any logged-in user)
// ======================
router.post('/add', auth(), validate(requestSchema), async (req, res, next) => {
    try {
        const { item_id } = req.validated;

        if (!item_id) {
            return res.status(400).json({ success: false, message: 'item_id is required' });
        }

        // Insert request without quantity_needed (column may not exist in all databases)
        const query = `
            INSERT INTO requests 
            (item_id, requester_id, status)
            VALUES (?, ?, 'pending')
        `;

        const [results] = await db.query(query, [item_id, req.user.id]);
        
        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            requestId: results.insertId
        });
    } catch (err) {
        next(err);
    }
});

// ======================
// Admin-only: Update request status (approve/reject/complete)
// ======================
router.put('/:id/status', auth('admin'), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;

        const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Optional: check if request exists before updating
        const [checkResults] = await db.query('SELECT * FROM requests WHERE id = ?', [requestId]);
        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
        await db.query(updateQuery, [status, requestId]);
        
        res.json({ success: true, message: `Request status updated to ${status}` });
    } catch (err) {
        next(err);
    }
});

// ======================
// Admin shortcuts for status updates
// ======================
router.put('/:id/approve', auth('admin'), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const status = 'approved';

        // Check if request exists before updating
        const [checkResults] = await db.query('SELECT * FROM requests WHERE id = ?', [requestId]);
        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
        await db.query(updateQuery, [status, requestId]);
        
        res.json({ success: true, message: `Request approved successfully` });
    } catch (err) {
        next(err);
    }
});

router.put('/:id/reject', auth('admin'), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const status = 'rejected';

        // Check if request exists before updating
        const [checkResults] = await db.query('SELECT * FROM requests WHERE id = ?', [requestId]);
        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
        await db.query(updateQuery, [status, requestId]);
        
        res.json({ success: true, message: `Request rejected successfully` });
    } catch (err) {
        next(err);
    }
});

router.put('/:id/complete', auth('admin'), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const status = 'completed';

        // Check if request exists before updating
        const [checkResults] = await db.query('SELECT * FROM requests WHERE id = ?', [requestId]);
        if (checkResults.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
        await db.query(updateQuery, [status, requestId]);
        
        // Award points to the donor (item owner)
        try {
            const [itemCheck] = await db.query('SELECT user_id FROM items WHERE id = ?', [checkResults[0].item_id]);
            if (itemCheck.length > 0) {
                const donorId = itemCheck[0].user_id;
                const [pointsCheck] = await db.query('SELECT points FROM donor_points WHERE user_id = ?', [donorId]);
                
                if (pointsCheck.length > 0) {
                    await db.query('UPDATE donor_points SET points = points + 10 WHERE user_id = ?', [donorId]);
                } else {
                    await db.query('INSERT INTO donor_points (user_id, points) VALUES (?, 10)', [donorId]);
                }
            }
        } catch (pointsErr) {
            console.error('Error awarding points:', pointsErr);
            // Don't fail the request if points fail
        }
        
        res.json({ success: true, message: `Request marked as completed successfully` });
    } catch (err) {
        next(err);
    }
});

// ======================
// DELETE a request (requester or admin)
// ======================
router.delete('/:id', auth(), async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const currentUserId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        // Get the request to check ownership
        const [requestCheck] = await db.query('SELECT requester_id FROM requests WHERE id = ?', [requestId]);
        
        if (requestCheck.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const requesterId = requestCheck[0].requester_id;
        
        // Only requester or admin can delete
        if (currentUserId !== requesterId && !isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this request' 
            });
        }

        const [results] = await db.query('DELETE FROM requests WHERE id = ?', [requestId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
