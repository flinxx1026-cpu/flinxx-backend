/**
 * Skip limit validator for matchmaking.
 *
 * UPDATED CONTRACT (per latest requirement):
 * - Free users: only 1 skip per day. After first skip → block further skips.
 * - Premium (Unlimited Skip): has_unlimited_skip === true AND unlimited_skip_expires_at > now
 *   => ALWAYS bypass limit.
 * - Always check premium first (DB) before evaluating daily skip count.
 * - Daily reset: compare `last_skip_reset_date` against today's date with UTC-safe keys.
 * - Concurrency: prevent race conditions with a per-user Redis lock.
 *
 * Response shape (for frontend/socket):
 * {
 *   canSkip: boolean,
 *   isPremium: boolean,
 *   skipCount: number,
 *   limit: 1
 * }
 */

function toDateKey(date) {
  // UTC key (YYYY-MM-DD). Using UTC avoids timezone off-by-one for @db.Date values.
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function safeMillis(date) {
  if (!date) return null;
  const d = new Date(date);
  const ms = d.getTime();
  return Number.isNaN(ms) ? null : ms;
}

async function safeUnlock(redis, lockKey, lockValue) {
  if (!redis || !lockKey || !lockValue) return;
  // Unlock only if we still hold the same value (prevents deleting another worker's lock).
  const releaseScript = `
    if redis.call('get', KEYS[1]) == ARGV[1] then
      return redis.call('del', KEYS[1])
    else
      return 0
    end
  `;
  try {
    await redis.eval(releaseScript, 1, lockKey, lockValue);
  } catch {
    // Non-critical: lock will expire anyway.
  }
}

export async function validateSkipLimit({
  userId,
  prisma,
  redis,
  increment = false,
  lockTtlSeconds = 3,
  now = new Date(),
  source = 'unknown'
}) {
  // Contract: 1 skip limit per day for free users
  const limit = 1;
  const nowMs = now.getTime();
  
  // Convert 'now' to IST (+5:30) to compute logical midnight properly for Indian time users
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(nowMs + istOffsetMs);
  
  // Create a UTC midnight representing the current IST day
  const todayUtc = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
  const todayKey = toDateKey(todayUtc);

  const lockKey = userId ? `skip:lock:${userId}` : null;
  const lockValue = lockKey ? `${process.pid}:${nowMs}:${Math.random().toString(16).slice(2)}` : null;
  let lockAcquired = false;

  try {
    if (!userId) {
      return {
        canSkip: false,
        isPremium: false,
        skipCount: 0,
        limit,
        reason: 'missing_user_id',
        source
      };
    }

    if (redis && lockKey) {
      lockAcquired = await redis.set(lockKey, lockValue, { NX: true, EX: lockTtlSeconds });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        // Unlimited Skip (hard bypass, expiry strict)
        has_unlimited_skip: true,
        unlimited_skip_expires_at: true,

        // General Premium status
        is_premium: true,
        premium_expiry: true,

        // Daily limit tracking
        daily_skip_count: true,
        last_skip_reset_date: true
      }
    });

    if (!user) {
      return {
        canSkip: false,
        isPremium: false,
        skipCount: 0,
        limit,
        reason: 'user_not_found',
        source
      };
    }

    // ----------------------------
    // 1) PREMIUM / UNLIMITED SKIP CHECK FIRST (DB)
    // ----------------------------
    const hasUnlimitedSkip = user.has_unlimited_skip === true;
    const rawUnlimitedSkipExpiresAt = user.unlimited_skip_expires_at;
    const unlimitedSkipExpiresMs = safeMillis(rawUnlimitedSkipExpiresAt);
    
    const isGeneralPremium = user.is_premium === true;
    const premiumExpiryMs = safeMillis(user.premium_expiry);
    
    const nowMs = now.getTime();
    const serverNowIso = new Date(nowMs).toISOString();

    // Unlimited Skip is active if flag is true AND (no expiry OR not expired)
    const isUnlimitedSkipActive =
      hasUnlimitedSkip &&
      (!unlimitedSkipExpiresMs || unlimitedSkipExpiresMs > nowMs);
      
    // General Premium is active if flag is true AND (no expiry OR not expired)
    const isPremiumActive = 
      isGeneralPremium && 
      (!premiumExpiryMs || premiumExpiryMs > nowMs);

    const isAnyPremiumActive = isUnlimitedSkipActive || isPremiumActive;

    // Debug logs to diagnose premium detection failures
    if (hasUnlimitedSkip || isGeneralPremium) {
      console.log('[SKIP-VALIDATION][PREMIUM DEBUG]', {
        source,
        userId,
        has_unlimited_skip: user.has_unlimited_skip,
        unlimited_skip_expires_at: rawUnlimitedSkipExpiresAt,
        is_premium: user.is_premium,
        premium_expiry: user.premium_expiry,
        server_time_iso: serverNowIso,
        isUnlimitedSkipActive,
        isPremiumActive,
        isAnyPremiumActive
      });
    }

    // If user is premium (Unlimited Skip or General Premium), bypass limit completely.
    if (isAnyPremiumActive) {
      console.log('[SKIP-VALIDATION] Unlimited skip bypass (premium)', {
        source,
        userId,
        unlimited_skip_expires_at: user.unlimited_skip_expires_at,
        now: new Date(nowMs).toISOString(),
        daily_skip_count: user.daily_skip_count
      });

      return {
        canSkip: true,
        isPremium: true,
        skipCount: user.daily_skip_count ?? 0,
        limit,
        reason: 'premium_bypass'
      };
    }

    // ----------------------------
    // 2) FREE DAILY COUNT CHECK
    // ----------------------------
    const lastResetKey = toDateKey(user.last_skip_reset_date);
    const shouldReset = !lastResetKey || lastResetKey !== todayKey;

    const rawSkipCount = user.daily_skip_count ?? 0;
    const effectiveSkipCount = shouldReset ? 0 : rawSkipCount;

    // If we couldn't acquire the lock and this request wants to consume a skip,
    // treat it as a concurrent attempt and block (race prevention).
    if (!lockAcquired && increment) {
      console.log('[SKIP-VALIDATION] Blocked by lock (free user concurrent skip)', {
        source,
        userId,
        skipCount: effectiveSkipCount,
        limit
      });
      return {
        canSkip: false,
        isPremium: false,
        skipCount: effectiveSkipCount,
        limit,
        reason: 'locked'
      };
    }

    if (!increment) {
      // For start-matching checks, normalize DB state to today's date.
      if (shouldReset) {
        await prisma.users.update({
          where: { id: userId },
          data: { daily_skip_count: 0, last_skip_reset_date: todayUtc }
        });
      }

      const canSkip = effectiveSkipCount < limit;
      if (!canSkip) {
        console.log('[SKIP-VALIDATION] Limit reached (start check)', {
          source,
          userId,
          skipCount: effectiveSkipCount,
          limit,
          last_skip_reset_date: user.last_skip_reset_date,
          todayKey
        });
      }

      return {
        canSkip,
        isPremium: false,
        skipCount: effectiveSkipCount,
        limit,
        reason: canSkip ? 'ok' : 'limit_reached'
      };
    }

    // increment === true => this skip consumes one count
    if (shouldReset) {
      // Consume first skip after reset.
      await prisma.users.update({
        where: { id: userId },
        data: { daily_skip_count: 1, last_skip_reset_date: todayUtc }
      });
      return {
        canSkip: true,
        isPremium: false,
        skipCount: 1,
        limit,
        reason: 'reset_then_increment',
        didReset: true
      };
    }

    if (effectiveSkipCount >= limit) {
      console.log('[SKIP-VALIDATION] Limit reached (increment check)', {
        source,
        userId,
        skipCount: effectiveSkipCount,
        limit,
        last_skip_reset_date: user.last_skip_reset_date,
        todayKey
      });

      return {
        canSkip: false,
        isPremium: false,
        skipCount: effectiveSkipCount,
        limit,
        reason: 'limit_reached'
      };
    }

    // Free user, not reset, and effectiveSkipCount < limit (handled above).
    // Consume one skip for the day.
    const newCount = effectiveSkipCount + 1;
    await prisma.users.update({
      where: { id: userId },
      data: { daily_skip_count: newCount }
    });

    return {
      canSkip: true,
      isPremium: false,
      skipCount: newCount,
      limit,
      reason: 'increment',
      didReset: false
    };
  } finally {
    await safeUnlock(redis, lockKey, lockValue);
  }
}

