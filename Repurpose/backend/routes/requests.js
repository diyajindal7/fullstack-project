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
        
        res.json({ success: true, message: `Request marked as completed successfully` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
