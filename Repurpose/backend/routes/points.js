// routes/points.js - Gamification system
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// ======================
// GET - Get user points (authenticated)
// ======================
router.get('/my-points', auth(), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [results] = await db.query(
      'SELECT points FROM donor_points WHERE user_id = ?',
      [userId]
    );

    const points = results.length > 0 ? results[0].points : 0;
    const badge = getBadgeLevel(points);

    res.json({
      success: true,
      points,
      badge,
      nextBadge: getNextBadge(points)
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// POST - Add points (called when donation is completed)
// ======================
router.post('/add', auth(), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { points: pointsToAdd = 10 } = req.body;

    // Check if user has points record
    const [existing] = await db.query(
      'SELECT points FROM donor_points WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // Update existing points
      const [result] = await db.query(
        'UPDATE donor_points SET points = points + ? WHERE user_id = ?',
        [pointsToAdd, userId]
      );
      const [updated] = await db.query(
        'SELECT points FROM donor_points WHERE user_id = ?',
        [userId]
      );
      res.json({
        success: true,
        points: updated[0].points,
        badge: getBadgeLevel(updated[0].points)
      });
    } else {
      // Create new points record
      const [result] = await db.query(
        'INSERT INTO donor_points (user_id, points) VALUES (?, ?)',
        [userId, pointsToAdd]
      );
      res.json({
        success: true,
        points: pointsToAdd,
        badge: getBadgeLevel(pointsToAdd)
      });
    }
  } catch (err) {
    next(err);
  }
});

// ======================
// GET - Leaderboard (public)
// ======================
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const query = `
      SELECT 
        dp.user_id,
        dp.points,
        u.name,
        u.email,
        COUNT(DISTINCT i.id) AS total_donations
      FROM donor_points dp
      JOIN users u ON dp.user_id = u.id
      LEFT JOIN items i ON i.user_id = u.id
      WHERE u.user_type = 'individual'
      GROUP BY dp.user_id, dp.points, u.name, u.email
      ORDER BY dp.points DESC
      LIMIT ?
    `;

    const [results] = await db.query(query, [parseInt(limit)]);
    
    // Add badge info to each user
    const leaderboard = results.map(user => ({
      ...user,
      badge: getBadgeLevel(user.points)
    }));

    res.json({
      success: true,
      leaderboard
    });
  } catch (err) {
    next(err);
  }
});

// Helper functions
function getBadgeLevel(points) {
  if (points >= 150) return 'Gold';
  if (points >= 50) return 'Silver';
  return 'Bronze';
}

function getNextBadge(points) {
  if (points < 50) return { name: 'Silver', required: 50, remaining: 50 - points };
  if (points < 150) return { name: 'Gold', required: 150, remaining: 150 - points };
  return { name: 'Max Level', required: null, remaining: 0 };
}

module.exports = router;

