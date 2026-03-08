import express from 'express'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

let pool = null

// Set pool function
export function setMatchesPool(dbPool) {
  pool = dbPool
}

// GET /api/matches - Get match history for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Try to get userId from auth middleware first, then fallback to query param
    let userId = req.user?.id
    
    // If authMiddleware didn't set req.user.id, try query parameter
    if (!userId) {
      userId = req.query.userId
    }
    
    if (!userId) {
      console.error('❌ [GET /api/matches] No userId found in auth or query params')
      return res.status(401).json({ error: 'Unauthorized - missing userId' })
    }

    console.log(`📋 [GET /api/matches] Fetching match history for user ${userId}`)

    const { rows } = await pool.query(
      `SELECT 
        m.id,
        m.matched_user_id,
        m.matched_user_name,
        m.matched_user_country,
        m.duration_seconds,
        m.is_liked,
        m.created_at,
        COALESCE(u.profileImage, u.photo_url) as profileImage,
        u.photo_url,
        COALESCE(u.public_id, '') as matched_user_public_id,
        u.has_blue_tick,
        u.blue_tick_expires_at
       FROM matches m
       LEFT JOIN users u ON m.matched_user_id = u.id
       WHERE m.user_id = $1
       ORDER BY m.created_at DESC
       LIMIT 50`,
      [userId]
    )

    console.log(`✅ Found ${rows.length} matches for user ${userId}`)
    
    res.json({
      success: true,
      data: rows
    })
  } catch (error) {
    console.error('❌ Error fetching matches:', error)
    res.status(500).json({ error: 'Failed to fetch match history' })
  }
})

// POST /api/matches/like - Like a matched user
router.post('/like', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId
    const matchId = req.body.matchId
    
    if (!userId || !matchId) {
      return res.status(400).json({ error: 'Missing userId or matchId' })
    }

    console.log(`❤️ [POST /api/matches/like] User ${userId} liked match ${matchId}`)

    await pool.query(
      `UPDATE matches
       SET is_liked = true
       WHERE id = $1 AND user_id = $2`,
      [matchId, userId]
    )

    console.log(`✅ Match ${matchId} liked by user ${userId}`)
    
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Error liking match:', error)
    res.status(500).json({ error: 'Failed to like match' })
  }
})

// DELETE /api/matches/:id - Delete a match from history
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId
    const matchId = req.params.id
    
    if (!userId || !matchId) {
      return res.status(400).json({ error: 'Missing userId or matchId' })
    }

    console.log(`🗑️ [DELETE /api/matches/:id] User ${userId} deleting match ${matchId}`)

    const result = await pool.query(
      `DELETE FROM matches
       WHERE id = $1 AND user_id = $2`,
      [matchId, userId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Match not found' })
    }

    console.log(`✅ Match ${matchId} deleted by user ${userId}`)
    
    res.json({ success: true })
  } catch (error) {
    console.error('❌ Error deleting match:', error)
    res.status(500).json({ error: 'Failed to delete match' })
  }
})

export default router
