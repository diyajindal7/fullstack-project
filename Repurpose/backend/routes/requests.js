const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { requestSchema } = require('../validators/request');

// ======================
// GET all requests (public, or protect if needed)
// ======================
router.get('/', (req, res, next) => {
    const query = `
        SELECT r.*, u.name AS requester_name, i.title AS item_title
        FROM requests r
        JOIN users u ON r.requester_id = u.id
        JOIN items i ON r.item_id = i.id
    `;
    db.query(query, (err, results) => {
        if (err) return next(err);
        res.json({ success: true, requests: results });
    });
});

// ======================
// GET only pending requests (admin)
// ======================
router.get('/pending', auth('admin'), (req, res, next) => {
    const query = `
        SELECT r.*, u.name AS requester_name, i.title AS item_title
        FROM requests r
        JOIN users u ON r.requester_id = u.id
        JOIN items i ON r.item_id = i.id
        WHERE r.status = 'pending'
    `;
    db.query(query, (err, results) => {
        if (err) return next(err);
        res.json({ success: true, requests: results });
    });
});

// ======================
// Add a new request (any logged-in user)
// ======================
router.post('/add', auth(), validate(requestSchema), (req, res, next) => {
    const { item_id, quantity_needed } = req.validated;

    if (!item_id) {
        return res.status(400).json({ success: false, message: 'item_id is required' });
    }

    const query = `
        INSERT INTO requests 
        (item_id, requester_id, quantity_needed, status)
        VALUES (?, ?, ?, 'pending')
    `;

    db.query(
        query,
        [item_id, req.user.id, quantity_needed || 1],
        (err, results) => {
            if (err) return next(err);
            res.status(201).json({
                success: true,
                message: 'Request created successfully',
                requestId: results.insertId
            });
        }
    );
});

// ======================
// Admin-only: Update request status (approve/reject/complete)
// ======================
router.put('/:id/status', auth('admin'), (req, res, next) => {
    const requestId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Optional: check if request exists before updating
    const checkQuery = 'SELECT * FROM requests WHERE id = ?';
    db.query(checkQuery, [requestId], (err, results) => {
        if (err) return next(err);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
        db.query(updateQuery, [status, requestId], (err, results) => {
            if (err) return next(err);
            res.json({ success: true, message: `Request status updated to ${status}` });
        });
    });
});

// ======================
// Admin shortcuts for status updates
// ======================
router.put('/:id/approve', auth('admin'), (req, res, next) => {
    req.body.status = 'approved';
    return router.handle({ ...req, url: `/${req.params.id}/status`, method: 'PUT' }, res, next);
});

router.put('/:id/reject', auth('admin'), (req, res, next) => {
    req.body.status = 'rejected';
    return router.handle({ ...req, url: `/${req.params.id}/status`, method: 'PUT' }, res, next);
});

router.put('/:id/complete', auth('admin'), (req, res, next) => {
    req.body.status = 'completed';
    return router.handle({ ...req, url: `/${req.params.id}/status`, method: 'PUT' }, res, next);
});

module.exports = router;
