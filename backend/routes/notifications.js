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
        f.id,
        f.sender_id,
        f.receiver_id,
        f.status,
        f.created_at,
        u.id as user_id,
        u.public_id,
        u.display_name,
        u.photo_url
      FROM friend_requests f
      JOIN users u
        ON u.id = CASE
          WHEN f.sender_id = $1 THEN f.receiver_id
          ELSE f.sender_id
        END
      WHERE 
        f.sender_id = $1
        OR f.receiver_id = $1
      ORDER BY f.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    
    console.log('[NOTIFICATIONS API] ✅ Found', rows.length, 'notifications (sent + received + accepted)');
    res.json(rows);

  } catch (err) {
    console.error('[NOTIFICATIONS API] ❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
