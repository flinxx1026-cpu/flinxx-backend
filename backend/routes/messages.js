import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

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

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
