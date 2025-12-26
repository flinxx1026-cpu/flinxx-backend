import express from 'express';
import pool from '../db/pool.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get accepted friends for message panel
router.get('/friends', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const publicId = req.user.publicId;

    console.log('👥 Fetching accepted friends for user:', { userId, publicId });

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

    console.log('✅ Found', rows.length, 'accepted friends for user', publicId);
    res.json(rows);
  } catch (err) {
    console.error('❌ Friends API error:', err);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;
