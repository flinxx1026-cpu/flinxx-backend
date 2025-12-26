import express from 'express';
import pool from '../db/pool.js';
// TODO: Add auth middleware when available in server.js
// import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get accepted friends for message panel
// TODO: Add authMiddleware back when available
router.get('/friends', async (req, res) => {
  try {
    // TODO: Get userId from authMiddleware when available
    // For now, accept userId from query or header
    const userId = req.query.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    console.log('👥 Fetching accepted friends for user:', userId);

    const { rows } = await pool.query(
      `
      SELECT
        u.id,
        u.public_id,
        u.display_name,
        u.photo_url
      FROM users u
      JOIN friend_requests fr
        ON (
          (fr.sender_id = $1 AND fr.receiver_id = u.id)
          OR
          (fr.receiver_id = $1 AND fr.sender_id = u.id)
        )
      WHERE fr.status = 'accepted'
      ORDER BY u.display_name ASC
      `,
      [userId]
    );

    console.log('✅ Found', rows.length, 'accepted friends for user');
    res.json(rows);
  } catch (err) {
    console.error('❌ Friends API error:', err);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;
