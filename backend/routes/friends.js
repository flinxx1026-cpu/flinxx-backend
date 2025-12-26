import express from 'express';
import db from '../db.js';
import { validate as isUUID } from 'uuid';

const router = express.Router();

router.get('/friends', async (req, res) => {
  try {
    const userId = req.query.userId;

    // 1️⃣ Validate UUID format (must be valid UUID, not numeric)
    if (!userId || !isUUID(userId)) {
      return res.status(400).json({ error: 'Invalid userId: must be valid UUID' });
    }

    console.log('👥 Fetching friends for userId:', userId);

    // 2️⃣ Query using correct SQL with CASE statement
    const query = `
      SELECT 
        u.id,
        u.display_name,
        u.photo_url
      FROM friend_requests f
      JOIN users u 
        ON u.id = CASE 
          WHEN f.sender_id = $1 THEN f.receiver_id
          ELSE f.sender_id
        END
      WHERE 
        (f.sender_id = $1 OR f.receiver_id = $1)
        AND f.status = 'accepted'
    `;

    const { rows } = await db.query(query, [userId]);

    console.log('✅ Found', rows.length, 'friends for userId:', userId);
    res.json(rows);

  } catch (err) {
    console.error('❌ Friends API error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
