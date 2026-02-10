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

// ✅ INCOMING REQUESTS - Requests RECEIVED by user (for popup only)
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.userId;

    // Validate UUID format (36 chars with hyphens)
    if (!userId || userId.length !== 36) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    console.log('[NOTIFICATIONS API] Fetching INCOMING requests for user:', userId);

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
        ON u.id = f.sender_id
      WHERE 
        f.receiver_id = $1
        AND f.status IN ('pending', 'accepted')
      ORDER BY f.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    
    console.log('[NOTIFICATIONS API] ✅ Found', rows.length, 'incoming requests');
    res.json(rows);

  } catch (err) {
    console.error('[NOTIFICATIONS API] ❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ SENT REQUESTS - Requests SENT by user (for SearchFriendsModal list)
router.get('/sent-requests', async (req, res) => {
  try {
    const userId = req.query.userId;

    // Validate UUID format (36 chars with hyphens)
    if (!userId || userId.length !== 36) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    console.log('[SENT-REQUESTS API] Fetching SENT requests from user:', userId);

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
        ON u.id = f.receiver_id
      WHERE 
        f.sender_id = $1
        AND f.status IN ('pending', 'accepted')
      ORDER BY f.created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    
    console.log('[SENT-REQUESTS API] ✅ Found', rows.length, 'sent requests');
    res.json(rows);

  } catch (err) {
    console.error('[SENT-REQUESTS API] ❌ Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
