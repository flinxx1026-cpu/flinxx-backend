import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.get('/friends', async (req, res) => {
  try {
    const userId = req.query.userId; // MUST BE UUID

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const query = `
      SELECT 
        u.id,
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
    `;

    const { rows } = await pool.query(query, [userId]);

    return res.json(rows);
  } catch (err) {
    console.error('Friends API error:', err);
    return res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;
