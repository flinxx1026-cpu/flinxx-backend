import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/friends', async (req, res) => {
  try {
    const { userId } = req.query; // THIS IS public_id (8-digit)

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    console.log('👥 Fetching friends for PUBLIC ID:', userId);

    // 🔴 STEP 1: Convert public_id → UUID
    const userResult = await db.query(
      'SELECT id FROM users WHERE public_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userUUID = userResult.rows[0].id;

    console.log('✅ UUID resolved:', userUUID);

    // 🔴 STEP 2: Use UUID in friend query
    const friendsQuery = `
      SELECT 
        u.public_id,
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

    const { rows } = await db.query(friendsQuery, [userUUID]);

    console.log('✅ Found', rows.length, 'friends');
    res.json(rows);

  } catch (err) {
    console.error('❌ Friends API error:', err);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

export default router;
