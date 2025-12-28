import express from 'express';
import pg from 'pg';

const { Pool } = pg;

// Import pool from server.js or create connection
let pool;

const router = express.Router();

// Set pool reference (will be passed from server.js)
export const setPool = (dbPool) => {
  pool = dbPool;
};

router.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.userId;

    // Validate UUID format (36 chars with hyphens)
    if (!userId || userId.length !== 36) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    console.log('[NOTIFICATIONS API] Fetching notifications for user:', userId);

    const query = `
      SELECT 
        fr.id,
        fr.sender_id,
        fr.receiver_id,
        fr.status,
        fr.created_at,
        u.public_id AS sender_public_id,
        u.display_name AS sender_name,
        u.photo_url AS sender_avatar
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = $1
      ORDER BY fr.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    
    console.log('[NOTIFICATIONS API] ✅ Found', rows.length, 'notifications');
    res.json(rows);

  } catch (err) {
    console.error('[NOTIFICATIONS API] ❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
