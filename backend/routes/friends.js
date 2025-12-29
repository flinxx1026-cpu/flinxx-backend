import express from 'express';
import db from '../db.js';
import { validate as isUUID } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/friends', async (req, res) => {
  try {
    const userId = req.query.userId;

    // 1️⃣ Validate UUID format (must be valid UUID, not numeric)
    if (!userId || !isUUID(userId)) {
      return res.status(400).json({ error: 'Invalid userId: must be valid UUID' });
    }

    console.log('👥 Fetching friends for userId:', userId);

    // 2️⃣ Query using correct SQL with CASE statement and last message time
    const query = `
      SELECT 
        u.id,
        u.display_name,
        u.photo_url,
        MAX(m.created_at) AS last_message_at
      FROM friend_requests f
      JOIN users u 
        ON u.id = CASE 
          WHEN f.sender_id = $1 THEN f.receiver_id
          ELSE f.sender_id
        END
      LEFT JOIN messages m 
        ON (m.sender_id = $1 AND m.receiver_id = u.id)
        OR (m.sender_id = u.id AND m.receiver_id = $1)
      WHERE 
        (f.sender_id = $1 OR f.receiver_id = $1)
        AND f.status = 'accepted'
      GROUP BY u.id, u.display_name, u.photo_url
      ORDER BY last_message_at DESC NULLS LAST
    `;

    const { rows } = await db.query(query, [userId]);

    // 3️⃣ Get unread message counts for each friend
    const unreadCountsResult = await db.query(
      `SELECT sender_id, COUNT(*)::int AS unread_count
       FROM messages
       WHERE receiver_id = $1 AND is_read = false
       GROUP BY sender_id`,
      [userId]
    );

    console.log('📬 Unread message counts:', unreadCountsResult.rows);

    // Build unread count map
    const unreadMap = {};
    unreadCountsResult.rows.forEach(row => {
      unreadMap[row.sender_id] = row.unread_count;
    });

    // 4️⃣ Add unreadCount to each friend
    const friendsWithUnread = rows.map(friend => ({
      ...friend,
      unreadCount: unreadMap[friend.id] || 0
    }));

    console.log('✅ Friends list with unread counts:', friendsWithUnread.map(f => ({
      id: f.id.substring(0, 8) + '...',
      display_name: f.display_name,
      unreadCount: f.unreadCount
    })));

    console.log('✅ Found', friendsWithUnread.length, 'friends for userId:', userId);
    res.json(friendsWithUnread);

  } catch (err) {
    console.error('❌ Friends API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Unfriend a user
router.post('/unfriend', authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user?.id; // From auth middleware

    // Validate UUIDs
    if (!userId || !isUUID(userId)) {
      return res.status(400).json({ error: 'Invalid current user ID' });
    }

    if (!friendId || !isUUID(friendId)) {
      return res.status(400).json({ error: 'Invalid friendId: must be valid UUID' });
    }

    if (userId === friendId) {
      return res.status(400).json({ error: 'Cannot unfriend yourself' });
    }

    console.log('🔄 Unfriending:', { userId, friendId });

    // Delete the friend request (works both ways)
    const result = await db.query(
      `DELETE FROM friend_requests
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       RETURNING id`,
      [userId, friendId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    console.log('✅ Unfriended successfully');
    res.json({ success: true, message: 'Unfriended successfully' });

  } catch (err) {
    console.error('❌ Unfriend error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
