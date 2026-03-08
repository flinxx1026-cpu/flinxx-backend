import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

let pool;
let prisma;

export const setPaymentsPool = (dbPool) => { pool = dbPool; };
export const setPaymentsPrisma = (prismaClient) => { prisma = prismaClient; };

// ===== RAZORPAY INSTANCE =====
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SNsF6ogtXGm9HE',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'C5cA4eUI68Kkf6YkTXlffnlR',
});

// ===== PLAN CONFIG =====
const PLANS = {
  blue_tick: { name: 'Blue Tick', amount: 6900, currency: 'INR', description: 'Verified Blue Tick Badge', duration_days: 30 },
  match_boost: { name: 'Match Boost', amount: 18900, currency: 'INR', description: '3x More Matches + Daily Picks', duration_days: 30 },
  unlimited_skip: { name: 'Unlimited Skip', amount: 14900, currency: 'INR', description: 'Unlimited Skips - No Daily Limit', duration_days: 28 },
};

// ===== 1. CREATE ORDER =====
router.post('/create-order', async (req, res) => {
  try {
    const { planId, userId } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: 'planId and userId are required' });
    }

    const plan = PLANS[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan. Valid plans: blue_tick, match_boost, unlimited_skip' });
    }

    // Validate user exists
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount, // amount in paise
      currency: plan.currency,
      receipt: `order_${planId}_${Date.now()}`,
      notes: {
        planId,
        userId,
        planName: plan.name,
      },
    });

    console.log(`💳 [PAYMENTS] Order created: ${order.id} for plan ${planId} by user ${userId.substring(0, 8)}...`);

    // Save order in DB
    await pool.query(
      `INSERT INTO payments (id, user_id, plan_id, plan_name, amount, currency, razorpay_order_id, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'created')`,
      [userId, planId, plan.name, plan.amount, plan.currency, order.id]
    );

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      plan: {
        id: planId,
        name: plan.name,
        description: plan.description,
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SNsF6ogtXGm9HE',
    });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// ===== 2. VERIFY PAYMENT =====
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    // Verify signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'C5cA4eUI68Kkf6YkTXlffnlR';
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error('💳 [PAYMENTS] ❌ Signature mismatch!');
      
      // Update payment status to failed
      await pool.query(
        `UPDATE payments SET status = 'failed', razorpay_payment_id = $1, updated_at = NOW() WHERE razorpay_order_id = $2`,
        [razorpay_payment_id, razorpay_order_id]
      );

      return res.status(400).json({ error: 'Payment verification failed - signature mismatch' });
    }

    console.log(`💳 [PAYMENTS] ✅ Signature verified for order ${razorpay_order_id}`);

    // Update payment record
    await pool.query(
      `UPDATE payments 
       SET status = 'paid', 
           razorpay_payment_id = $1, 
           razorpay_signature = $2, 
           paid_at = NOW(),
           updated_at = NOW()
       WHERE razorpay_order_id = $3`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id]
    );

    // Get payment record to find plan details
    const { rows } = await pool.query(
      `SELECT * FROM payments WHERE razorpay_order_id = $1`,
      [razorpay_order_id]
    );

    const payment = rows[0];
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    const activePlanId = payment.plan_id;
    const activeUserId = payment.user_id;

    // Enable feature for user based on plan
    const now = new Date();
    let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days

    if (activePlanId === 'blue_tick') {
      await pool.query(
        `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
        [expiresAt, activeUserId]
      );
    } else if (activePlanId === 'match_boost') {
      await pool.query(
        `UPDATE users SET has_match_boost = true, match_boost_expires_at = $1, updated_at = NOW() WHERE id = $2`,
        [expiresAt, activeUserId]
      );
    } else if (activePlanId === 'unlimited_skip') {
      await pool.query(
        `UPDATE users SET has_unlimited_skip = true, unlimited_skip_expires_at = $1, updated_at = NOW() WHERE id = $2`,
        [expiresAt, activeUserId]
      );
    }

    console.log(`💳 [PAYMENTS] ✅ Feature "${activePlanId}" enabled for user ${activeUserId.substring(0, 8)}... until ${expiresAt.toISOString()}`);

    res.json({
      success: true,
      message: `Payment verified! ${PLANS[activePlanId]?.name || activePlanId} is now active.`,
      feature: activePlanId,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error verifying payment:', error.message);
    res.status(500).json({ error: 'Failed to verify payment', details: error.message });
  }
});

// ===== 3. GET USER FEATURES (active subscriptions) =====
router.get('/features', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { rows } = await pool.query(
      `SELECT has_blue_tick, blue_tick_expires_at,
              has_match_boost, match_boost_expires_at,
              has_unlimited_skip, unlimited_skip_expires_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!rows[0]) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    const now = new Date();

    // Check expiry and auto-disable if expired
    const features = {
      blue_tick: !!(user.has_blue_tick && user.blue_tick_expires_at && new Date(user.blue_tick_expires_at) > now),
      match_boost: !!(user.has_match_boost && user.match_boost_expires_at && new Date(user.match_boost_expires_at) > now),
      unlimited_skip: !!(user.has_unlimited_skip && user.unlimited_skip_expires_at && new Date(user.unlimited_skip_expires_at) > now),
    };

    // Auto-disable expired features in DB so they don't linger
    const expiredUpdates = [];
    if (user.has_blue_tick && !features.blue_tick) {
      expiredUpdates.push(`has_blue_tick = false`);
    }
    if (user.has_match_boost && !features.match_boost) {
      expiredUpdates.push(`has_match_boost = false`);
    }
    if (user.has_unlimited_skip && !features.unlimited_skip) {
      expiredUpdates.push(`has_unlimited_skip = false`);
    }
    if (expiredUpdates.length > 0) {
      await pool.query(`UPDATE users SET ${expiredUpdates.join(', ')}, updated_at = NOW() WHERE id = $1`, [userId]);
      console.log(`💳 [PAYMENTS] 🔄 Auto-disabled expired features for user ${userId.substring(0, 8)}...: ${expiredUpdates.join(', ')}`);
    }

    // Only return expiry for active features
    const expiry = {
      blue_tick: features.blue_tick ? user.blue_tick_expires_at : null,
      match_boost: features.match_boost ? user.match_boost_expires_at : null,
      unlimited_skip: features.unlimited_skip ? user.unlimited_skip_expires_at : null,
    };

    res.json({ success: true, features, expiry });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error fetching features:', error.message);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// ===== 4. GET PAYMENT HISTORY =====
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { rows } = await pool.query(
      `SELECT id, plan_id, plan_name, amount, currency, status, razorpay_order_id, paid_at, created_at
       FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );

    res.json({ success: true, payments: rows });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
