/**
 * Skip limit validator for matchmaking.
 *
 * CONTRACT:
 * - Free users: 120 skips per day. After 120 → block.
 * - Premium (Unlimited Skip): has_unlimited_skip === true AND unlimited_skip_expires_at > now
 *   => ALWAYS bypass limit. Never block. Never show popup.
 * - Always check premium first (DB) before evaluating daily skip count.
 * - Daily reset: at midnight (12:00 AM server time, date change).
 *   Compare last_skip_reset_date toDateString() vs now.toDateString().
 * - Concurrency: prevent race conditions with a per-user Redis lock.
 * - Premium users do NOT have their skip count incremented.
 *
 * Response shape (for frontend/socket):
 * {
 *   canSkip: boolean,
 *   isPremium: boolean,
 *   skipCount: number,
 *   limit: 120
 * }
 */

const DAILY_SKIP_LIMIT = 120;

function safeMillis(date) {
  if (!date) return null;
  const d = new Date(date);
  const ms = d.getTime();
  return Number.isNaN(ms) ? null : ms;
}

// Convert any Date to IST (Asia/Kolkata) Date object
function toIST(date) {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}

function shouldResetSkips(lastReset) {
  const nowIST = toIST(new Date());
  if (!lastReset) return true;
  const last = new Date(lastReset);
  if (Number.isNaN(last.getTime())) return true;
  const lastIST = toIST(last);
  // Reset if the IST calendar date has changed
  return nowIST.toDateString() !== lastIST.toDateString();
}

async function safeUnlock(redis, lockKey, lockValue) {
  if (!redis || !lockKey || !lockValue) return;
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
  const limit = DAILY_SKIP_LIMIT;
  const nowMs = now.getTime();

  const lockKey = userId ? `skip:lock:${userId}` : null;
  const lockValue = lockKey ? `${process.pid}:${nowMs}:${Math.random().toString(16).slice(2)}` : null;
  let lockAcquired = false;

  try {
    if (!userId) {
      return { canSkip: false, isPremium: false, skipCount: 0, limit, reason: 'missing_user_id', source };
    }

    if (redis && lockKey) {
      lockAcquired = await redis.set(lockKey, lockValue, { NX: true, EX: lockTtlSeconds });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        has_unlimited_skip: true,
        unlimited_skip_expires_at: true,
        is_premium: true,
        premium_expiry: true,
        daily_skip_count: true,
        last_skip_reset_date: true
      }
    });

    if (!user) {
      return { canSkip: false, isPremium: false, skipCount: 0, limit, reason: 'user_not_found', source };
    }

    // ----------------------------
    // 1) PREMIUM / UNLIMITED SKIP CHECK FIRST (DB)
    // ----------------------------
    const hasUnlimitedSkip = user.has_unlimited_skip === true;
    const unlimitedSkipExpiresMs = safeMillis(user.unlimited_skip_expires_at);
    
    const isGeneralPremium = user.is_premium === true;
    const premiumExpiryMs = safeMillis(user.premium_expiry);

    const isUnlimitedSkipActive = hasUnlimitedSkip && (!unlimitedSkipExpiresMs || unlimitedSkipExpiresMs > nowMs);
    const isPremiumActive = isGeneralPremium && (!premiumExpiryMs || premiumExpiryMs > nowMs);
    const isAnyPremiumActive = isUnlimitedSkipActive || isPremiumActive;

    if (isAnyPremiumActive) {
      return {
        canSkip: true,
        isPremium: true,
        skipCount: user.daily_skip_count ?? 0,
        limit,
        reason: 'premium_bypass'
      };
    }

    // ----------------------------
    // 2) MIDNIGHT DATE-CHANGE RESET (12:00 AM)
    // ----------------------------
    let currentUser = user;
    let didReset = false;

    if (shouldResetSkips(currentUser.last_skip_reset_date)) {
      console.log("🔄 [RESET] BEFORE RESET (Validator):", {
        skip: currentUser.daily_skip_count,
        lastReset: currentUser.last_skip_reset_date
      });

      currentUser = await prisma.users.update({
        where: { id: userId },
        data: {
          daily_skip_count: 0,
          last_skip_reset_date: new Date()
        }
      });
      
      console.log("🔄 [RESET] AFTER RESET (Validator):", {
        skip: currentUser.daily_skip_count,
        lastReset: currentUser.last_skip_reset_date
      });
      
      didReset = true;
    }

    // Recalculate AFTER reset
    const effectiveSkipCount = currentUser.daily_skip_count ?? 0;

    // Check limit: 120 skips/day for free users
    let canSkip = effectiveSkipCount < limit;

    if (!lockAcquired && increment) {
      return { canSkip: false, isPremium: false, skipCount: effectiveSkipCount, limit, reason: 'locked' };
    }

    if (!increment) {
      return {
        canSkip,
        isPremium: false,
        skipCount: effectiveSkipCount,
        limit,
        reason: canSkip ? 'ok' : 'limit_reached'
      };
    }

    // Attempting to Skip
    if (!canSkip) {
      return {
        canSkip: false,
        isPremium: false,
        skipCount: effectiveSkipCount,
        limit,
        reason: 'limit_reached'
      };
    }

    // Free user, skip allowed. Consume one skip atomically.
    const finalUser = await prisma.users.update({
      where: { id: userId },
      data: {
        daily_skip_count: { increment: 1 },
        last_skip_reset_date: new Date()
      }
    });

    return {
      canSkip: true,
      isPremium: false,
      skipCount: finalUser.daily_skip_count,
      limit,
      reason: 'increment',
      didReset
    };
  } finally {
    await safeUnlock(redis, lockKey, lockValue);
  }
}
