import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET unread message count
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `SELECT COUNT(*)::int AS unread_count
       FROM messages
       WHERE receiver_id = $1
       AND is_read = false`,
      [userId]
    );

    res.json({ unreadCount: result.rows[0].unread_count });
  } catch (error) {
    console.error('❌ Error fetching unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST mark messages as read
router.post('/mark-read', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
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

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
