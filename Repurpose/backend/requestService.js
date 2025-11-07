// backend/services/requestService.js
const db = require('../config/db');

/**
 * Get all requests (optionally filter by status)
 */
exports.getAllRequests = (status = null) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT r.*, u.name AS requester_name, i.title AS item_title
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            JOIN items i ON r.item_id = i.id
        `;
        const params = [];

        if (status) {
            query += ' WHERE r.status = ?';
            params.push(status);
        }

        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Get a request by ID
 */
exports.getRequestById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, u.name AS requester_name, i.title AS item_title
            FROM requests r
            JOIN users u ON r.requester_id = u.id
            JOIN items i ON r.item_id = i.id
            WHERE r.id = ?
        `;
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

/**
 * Create a new request
 */
exports.createRequest = (item_id, requester_id, quantity_needed = 1) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO requests 
            (item_id, requester_id, quantity_needed, status)
            VALUES (?, ?, ?, 'pending')
        `;
        db.query(query, [item_id, requester_id, quantity_needed], (err, results) => {
            if (err) return reject(err);
            resolve(results.insertId);
        });
    });
};

/**
 * Update request status (admin only)
 */
exports.updateRequestStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return reject(new Error('Invalid status'));
        }

        // First check if request exists
        const checkQuery = 'SELECT * FROM requests WHERE id = ?';
        db.query(checkQuery, [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Request not found'));

            const updateQuery = 'UPDATE requests SET status = ? WHERE id = ?';
            db.query(updateQuery, [status, id], (err2) => {
                if (err2) return reject(err2);

                // Return the updated record
                const fetchQuery = `
                    SELECT r.*, u.name AS requester_name, i.title AS item_title
                    FROM requests r
                    JOIN users u ON r.requester_id = u.id
                    JOIN items i ON r.item_id = i.id
                    WHERE r.id = ?
                `;
                db.query(fetchQuery, [id], (err3, updated) => {
                    if (err3) return reject(err3);
                    resolve(updated[0]);
                });
            });
        });
    });
};
