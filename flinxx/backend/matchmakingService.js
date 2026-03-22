/**
 * Advanced WebRTC Matchmaking Service
 * Handles user matching with smart algorithms
 */

class MatchmakingService {
  constructor() {
    this.waitingQueue = []
    this.activeSessions = new Map()
    this.userMetadata = new Map()
  }

  /**
   * Add user to waiting queue
   */
  addToQueue(user) {
    this.waitingQueue.push(user)
    this.userMetadata.set(user.id, {
      addedAt: Date.now(),
      attempts: 0,
      interests: []
    })
  }

  /**
   * Find next match from queue
   */
  findMatch() {
    if (this.waitingQueue.length < 2) {
      return null
    }

    // FIFO matching (simplest algorithm)
    const user1 = this.waitingQueue.shift()
    const user2 = this.waitingQueue.shift()

    return { user1, user2 }
  }

  /**
   * Create a session for matched users
   */
  createSession(sessionId, user1Id, user2Id) {
    const session = {
      id: sessionId,
      user1: user1Id,
      user2: user2Id,
      createdAt: Date.now(),
      duration: 0,
      messages: [],
      stats: {
        videoQuality: 'hd',
        audioQuality: 'good',
        latency: 0
      }
    }

    this.activeSessions.set(sessionId, session)
    return session
  }

  /**
   * End session
   */
  endSession(sessionId) {
    this.activeSessions.delete(sessionId)
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      waitingUsers: this.waitingQueue.length,
      activeSessions: this.activeSessions.size,
      totalUsers: this.waitingQueue.length + (this.activeSessions.size * 2),
      avgWaitTime: this.calculateAvgWaitTime()
    }
  }

  /**
   * Calculate average wait time
   */
  calculateAvgWaitTime() {
    if (this.waitingQueue.length === 0) return 0

    const now = Date.now()
    const totalWaitTime = this.waitingQueue.reduce((sum, user) => {
      const metadata = this.userMetadata.get(user.id)
      return sum + (now - metadata.addedAt)
    }, 0)

    return totalWaitTime / this.waitingQueue.length
  }

  /**
   * Remove user from queue
   */
  removeFromQueue(userId) {
    const index = this.waitingQueue.findIndex(u => u.id === userId)
    if (index > -1) {
      this.waitingQueue.splice(index, 1)
    }
    this.userMetadata.delete(userId)
  }
}

export default MatchmakingService
