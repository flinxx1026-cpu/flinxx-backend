import express from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// GET unread message count for a user (count of UNIQUE senders with unread messages)
router.get('/unread-count/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId || userId.length !== 36) {
      return res.status(400).json({ error: 'Invalid UUID' });
    }

    const result = await db.query(
      `SELECT COUNT(DISTINCT sender_id)::int AS count
       FROM messages
       WHERE receiver_id = $1
       AND is_read = false`,
      [userId]
    );

    console.log('📬 Unread users count:', result.rows[0].count, 'for user:', userId.substring(0, 8) + '...');
    res.json({ unreadCount: result.rows[0].count || 0 });
  } catch (error) {
    console.error('❌ Unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// POST mark ALL messages as read (when message panel opens)
router.post('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id; // UUID from auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.query(
      `UPDATE messages
       SET is_read = true
       WHERE receiver_id = $1
       AND is_read = false`,
      [userId]
    );

    res.json({ success: true, message: 'All messages marked as read' });
  } catch (error) {
    console.error('❌ Error marking all messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST mark messages as read (from specific sender when chat opens)
// Kept for backward compatibility but return updated unreadCount
router.post('/mark-read', authMiddleware, async (req, res) => {
  try {
    const receiverId = req.user?.id; // UUID from auth middleware
    const { senderId } = req.body;

    if (!receiverId || !senderId) {
      return res.status(400).json({ error: 'senderId and receiverId required' });
    }

    await db.query(
      `UPDATE messages
       SET is_read = true
       WHERE sender_id = $1
       AND receiver_id = $2
       AND is_read = false`,
      [senderId, receiverId]
    );

    const result = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM messages
       WHERE receiver_id = $1
       AND is_read = false`,
      [receiverId]
    );

    res.json({ success: true, unreadCount: result.rows[0].count || 0 });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT mark messages as read by chatId (recommended)
router.put('/mark-read/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!chatId || !userId) {
      return res.status(400).json({ error: 'chatId and authenticated user required' });
    }

    // chatId format: '{uuid1}_{uuid2}' (deterministic ordering)
    const parts = chatId.split('_');
    if (parts.length !== 2) {
      return res.status(400).json({ error: 'Invalid chatId format' });
    }

    const otherId = parts[0] === userId ? parts[1] : parts[1] === userId ? parts[0] : (parts.includes(userId) ? parts.find(p => p !== userId) : null);

    if (!otherId) {
      return res.status(400).json({ error: 'Authenticated user not part of chatId' });
    }

    // Mark messages sent by the other user to the authenticated user as read
    await db.query(
      `UPDATE messages
       SET is_read = true
       WHERE sender_id = $1
       AND receiver_id = $2
       AND is_read = false`,
      [otherId, userId]
    );

    // Return updated unread count for this user
    const result = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM messages
       WHERE receiver_id = $1
       AND is_read = false`,
      [userId]
    );

    res.json({ success: true, unreadCount: result.rows[0].count || 0 });
  } catch (error) {
    console.error('❌ Error marking messages by chatId as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
