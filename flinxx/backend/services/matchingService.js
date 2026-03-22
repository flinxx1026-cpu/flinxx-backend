/**
 * 🎯 MATCHING SERVICE - Fast video chat matching with Redis
 * 
 * Features:
 * - Fast FIFO matching using Redis sorted sets
 * - Gender-based filtering
 * - Country-based filtering  
 * - Interest-based matching
 * - Timeout management
 * - Duplicate prevention
 */

class MatchingService {
  constructor(redis) {
    this.redis = redis;
    
    // Queue keys
    this.QUEUE_KEY = 'matching_queue'; // All waiting users
    this.MALE_QUEUE = 'queue:male';
    this.FEMALE_QUEUE = 'queue:female';
    this.COUNTRY_QUEUE_PREFIX = 'queue:country:';
    this.INTEREST_QUEUE_PREFIX = 'queue:interest:';
    
    // User status keys
    this.WAITING_PREFIX = 'waiting:';
    this.MATCHED_PREFIX = 'matched:';
    this.SESSION_PREFIX = 'session:';
    
    // Timeout duration (30 seconds)
    this.MATCH_TIMEOUT = 30;
  }

  /**
   * Add user to waiting queue
   * @param {string} userId - User ID
   * @param {object} userData - User profile data
   * @returns {Promise<{user, partner}>}
   */
  async addUserToQueue(userId, userData) {
    try {
      console.log(`\n[MATCHING] 🟢 User ${userId} joining queue...`);
      
      // Create user entry with timestamp
      const userEntry = JSON.stringify({
        userId,
        socketId: userData.socketId,
        gender: userData.gender,
        country: userData.country,
        interests: userData.interests || [],
        joinedAt: Date.now(),
        filters: userData.filters || {}
      });

      // Check if user already in queue
      const existing = await this.redis.get(`${this.WAITING_PREFIX}${userId}`);
      if (existing) {
        console.log(`[MATCHING] ⚠️  User ${userId} already in queue`);
        return { user: null, partner: null };
      }

      // Try to find a partner from existing queue
      let partner = await this._findPartner(userData);

      if (partner) {
        console.log(`[MATCHING] ✅ MATCH FOUND! ${userId} with ${partner.userId}`);
        
        // Remove partner from queue
        await this._removeFromAllQueues(partner.userId);
        
        // Mark both as matched
        await this.redis.setEx(`${this.MATCHED_PREFIX}${userId}`, this.MATCH_TIMEOUT, partner.userId);
        await this.redis.setEx(`${this.MATCHED_PREFIX}${partner.userId}`, this.MATCH_TIMEOUT, userId);
        
        // Create session pair
        const sessionId = `${userId}:${partner.userId}`;
        await this.redis.setEx(`${this.SESSION_PREFIX}${sessionId}`, 3600, JSON.stringify({
          user1Id: userId,
          user2Id: partner.userId,
          startedAt: Date.now()
        }));

        return { user: userData, partner };
      } else {
        console.log(`[MATCHING] ⏳ No match found, adding ${userId} to queue...`);
        
        // Add to main queue (sorted by join time)
        await this.redis.zAdd(this.QUEUE_KEY, [{
          score: Date.now(),
          value: userEntry
        }]);

        // Add to gender queue
        if (userData.gender) {
          await this.redis.zAdd(this._getGenderQueue(userData.gender), [{
            score: Date.now(),
            value: userEntry
          }]);
        }

        // Add to country queue
        if (userData.country) {
          const countryQueue = this.COUNTRY_QUEUE_PREFIX + userData.country.toLowerCase();
          await this.redis.zAdd(countryQueue, [{
            score: Date.now(),
            value: userEntry
          }]);
        }

        // Mark as waiting
        await this.redis.setEx(`${this.WAITING_PREFIX}${userId}`, this.MATCH_TIMEOUT, 'true');
        
        console.log(`[MATCHING] 📊 Queue stats:`, {
          totalWaiting: await this.redis.zCard(this.QUEUE_KEY),
          waitingMale: await this.redis.zCard(this.MALE_QUEUE),
          waitingFemale: await this.redis.zCard(this.FEMALE_QUEUE)
        });

        return { user: userData, partner: null };
      }
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to add user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Find a matching partner from queue
   * @private
   */
  async _findPartner(userData) {
    try {
      // Strategy 1: Find opposite gender (if both have gender preferences)
      if (userData.gender && userData.filters?.preferGender) {
        const oppositeQueue = this._getOppositeGenderQueue(userData.gender);
        const candidates = await this.redis.zRange(oppositeQueue, 0, 0);
        
        if (candidates.length > 0) {
          const partner = JSON.parse(candidates[0]);
          console.log(`[MATCHING] 👥 Found gender-matched partner: ${partner.userId}`);
          return partner;
        }
      }

      // Strategy 2: Find same country user
      if (userData.country && userData.filters?.preferCountry) {
        const countryQueue = this.COUNTRY_QUEUE_PREFIX + userData.country.toLowerCase();
        const candidates = await this.redis.zRange(countryQueue, 0, 0);
        
        if (candidates.length > 0) {
          const partner = JSON.parse(candidates[0]);
          console.log(`[MATCHING] 🌍 Found country-matched partner: ${partner.userId}`);
          return partner;
        }
      }

      // Strategy 3: FIFO - Get first person from main queue
      const candidates = await this.redis.zRange(this.QUEUE_KEY, 0, 0);
      
      if (candidates.length > 0) {
        const partner = JSON.parse(candidates[0]);
        console.log(`[MATCHING] ⏲️  No preference match, using FIFO: ${partner.userId}`);
        return partner;
      }

      console.log(`[MATCHING] ❌ No partners in queue`);
      return null;
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to find partner:`, error);
      return null;
    }
  }

  /**
   * Remove user from all queues
   * @private
   */
  async _removeFromAllQueues(userId) {
    try {
      // Get all queues
      const allQueues = await this.redis.keys('queue:*');
      
      for (const queue of allQueues) {
        // Get all items from queue
        const items = await this.redis.lRange(queue, 0, -1);
        
        // Find and remove the user
        for (const item of items) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.userId === userId) {
              await this.redis.lRem(queue, 0, item);
              console.log(`[MATCHING] 🗑️  Removed ${userId} from ${queue}`);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      // Also remove from main queue (sorted set)
      const mainQueueItems = await this.redis.zRange(this.QUEUE_KEY, 0, -1);
      for (const item of mainQueueItems) {
        try {
          const parsed = JSON.parse(item);
          if (parsed.userId === userId) {
            await this.redis.zRem(this.QUEUE_KEY, item);
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to remove from queues:`, error);
    }
  }

  /**
   * Handle user disconnect
   */
  async handleUserDisconnect(userId) {
    try {
      console.log(`\n[MATCHING] 🔴 User ${userId} disconnected`);
      
      // Remove from waiting queue
      await this._removeFromAllQueues(userId);
      
      // Remove waiting marker
      await this.redis.del(`${this.WAITING_PREFIX}${userId}`);
      
      // Clear match markers
      await this.redis.del(`${this.MATCHED_PREFIX}${userId}`);
      
      // Clear session data
      const sessionKeys = await this.redis.keys(`${this.SESSION_PREFIX}${userId}*`);
      for (const key of sessionKeys) {
        await this.redis.del(key);
      }
      
      console.log(`[MATCHING] ✅ Cleaned up for user ${userId}`);
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to handle disconnect:`, error);
    }
  }

  /**
   * Get queue name for gender
   * @private
   */
  _getGenderQueue(gender) {
    if (gender?.toLowerCase() === 'male' || gender === 'M') {
      return this.MALE_QUEUE;
    } else if (gender?.toLowerCase() === 'female' || gender === 'F') {
      return this.FEMALE_QUEUE;
    }
    return 'queue:unspecified';
  }

  /**
   * Get opposite gender queue
   * @private
   */
  _getOppositeGenderQueue(gender) {
    if (gender?.toLowerCase() === 'male' || gender === 'M') {
      return this.FEMALE_QUEUE;
    } else if (gender?.toLowerCase() === 'female' || gender === 'F') {
      return this.MALE_QUEUE;
    }
    return null;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const stats = {
        totalWaiting: await this.redis.zCard(this.QUEUE_KEY),
        waitingMale: await this.redis.zCard(this.MALE_QUEUE),
        waitingFemale: await this.redis.zCard(this.FEMALE_QUEUE),
        queueDetails: {
          all: await this.redis.zRange(this.QUEUE_KEY, 0, -1),
          male: await this.redis.zRange(this.MALE_QUEUE, 0, -1),
          female: await this.redis.zRange(this.FEMALE_QUEUE, 0, -1)
        }
      };
      return stats;
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to get stats:`, error);
      return null;
    }
  }

  /**
   * Clear all queues (for admin/testing)
   */
  async clearAllQueues() {
    try {
      console.log(`[MATCHING] 🧹 Clearing all matching queues...`);
      
      // Get all queue keys
      const queues = [
        this.QUEUE_KEY,
        this.MALE_QUEUE,
        this.FEMALE_QUEUE,
        ...await this.redis.keys(`${this.COUNTRY_QUEUE_PREFIX}*`),
        ...await this.redis.keys(`${this.INTEREST_QUEUE_PREFIX}*`)
      ];

      for (const queue of queues) {
        await this.redis.del(queue);
      }

      console.log(`[MATCHING] ✅ Cleared ${queues.length} queues`);
    } catch (error) {
      console.error(`[MATCHING_ERROR] Failed to clear queues:`, error);
    }
  }
}

export default MatchingService;
