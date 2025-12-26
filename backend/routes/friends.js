import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/friends', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    console.log('👥 Fetching friends for userId:', userId);

    const query = `
      SELECT 
        u.id,
        u.display_name,
        u.photo_url
      FROM friend_requests fr
      JOIN users u
        ON (
          (fr.sender_id = $1 AND fr.receiver_id = u.id)
          OR
          (fr.receiver_id = $1 AND fr.sender_id = u.id)
        )
      WHERE fr.status = 'accepted'
    `;

    const { rows } = await db.query(query, [userId]);

    console.log('✅ Found', rows.length, 'friends for userId:', userId);
    return res.json(rows);
  } catch (err) {
    console.error('Friends API error:', err);
    return res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;
