import express from 'express';
import crypto from 'crypto';

const router = express.Router();

let pool;
let prisma;

export const setPaymentsPool = (dbPool) => { pool = dbPool; };
export const setPaymentsPrisma = (prismaClient) => { prisma = prismaClient; };

// ===== CASHFREE CONFIGURATION =====
// For development/testing, we support MOCK MODE
// Set CASHFREE_MOCK=true in .env to use mock payments (no real API calls)
// For production, use real Cashfree credentials
const CASHFREE_MOCK = process.env.CASHFREE_MOCK === 'true';
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || 'YOUR_TEST_CLIENT_ID';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'YOUR_TEST_SECRET_KEY';
const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'production' 
  ? 'https://api.cashfree.com/pg' 
  : 'https://sandbox.cashfree.com/pg';
const CASHFREE_ENVIRONMENT = process.env.CASHFREE_ENV || 'sandbox';

// ===== BASE URL CONFIG (for return_url and webhook) =====
// Use domain in production/testing, localhost for development
const BASE_URL = process.env.BASE_URL || 'https://flinxx.in';
console.log(`📍 [CONFIG] BASE_URL set to: ${BASE_URL}`);

// ===== PLAN CONFIG =====
const PLANS = {
  blue_tick: { name: 'Blue Tick', amount: 1, currency: 'INR', description: 'Verified Blue Tick Badge', duration_days: 30 }, // TEMP: Changed to ₹1 for testing (normally ₹69)
  match_boost: { name: 'Match Boost', amount: 189, currency: 'INR', description: '3x More Matches + Daily Picks', duration_days: 30 },
  unlimited_skip: { name: 'Unlimited Skip', amount: 149, currency: 'INR', description: 'Unlimited Skips - No Daily Limit', duration_days: 28 },
};

// ===== HELPER: Create Cashfree Authorization Headers =====
const getCashfreeHeaders = () => {
  return {
    'x-client-id': CASHFREE_CLIENT_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json',
  };
};

// ===== DEBUG: Test Cashfree API Connection =====
router.all('/test-cashfree', async (req, res) => {
  try {
    console.log(`\n🧪 [CASHFREE TEST] Testing Cashfree API Connection`);
    console.log(`  Environment: ${CASHFREE_ENVIRONMENT}`);
    console.log(`  Base URL: ${CASHFREE_BASE_URL}`);
    console.log(`  Client ID: ${CASHFREE_CLIENT_ID.substring(0, 10)}...`);

    const testPayload = {
      order_id: `test_${Date.now()}`,
      order_amount: 100,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'test_customer',
        customer_email: 'test@flinxx.app',
        customer_phone: '9876543210',
      },
      order_note: 'Test Order',
    };

    const headers = getCashfreeHeaders();
    console.log(`  Headers:`, { ...headers, 'x-client-secret': '***' });
    console.log(`  Payload:`, testPayload);

    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    console.log(`  Response Status: ${response.status}`);
    console.log(`  Response Data:`, JSON.stringify(responseData, null, 2));

    res.json({
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Connection successful' : 'Connection failed',
      response: responseData,
    });

  } catch (error) {
    console.error('🧪 [CASHFREE TEST] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// ===== 1. CREATE SESSION (equivalent to create-order) =====
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

    // Generate unique order ID (simpler format like test endpoint)
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // ===== MOCK MODE: Skip Cashfree API, generate fake session =====
    if (CASHFREE_MOCK) {
      console.log('🎭 [MOCK MODE] Creating mock payment session');
      const mockSessionId = `mock_${orderId}`;
      
      console.log(`💳 [PAYMENTS] Order created (MOCK): ${orderId} for plan ${planId} by user ${userId.substring(0, 8)}...`);
      
      // Save order in DB
      await pool.query(
        `INSERT INTO payments (id, user_id, plan_id, plan_name, amount, currency, cashfree_order_id, cashfree_session_id, status)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'created')`,
        [userId, planId, plan.name, plan.amount, plan.currency, orderId, mockSessionId]
      );

      return res.json({
        success: true,
        sessionId: mockSessionId,
        orderId: orderId,
        plan: {
          id: planId,
          name: plan.name,
          description: plan.description,
          amount: plan.amount,
        },
        mock: true,
        message: 'Mock payment session created (development mode)'
      });
    }

    // ===== REAL MODE: Call Cashfree API =====
    // Create Cashfree session - REQUIRED FIELDS ONLY (matching test endpoint which works)
    const sessionPayload = {
      order_id: orderId,
      order_amount: plan.amount, // Cashfree expects amount in rupees
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_name: user.display_name || `User ${userId.substring(0, 8)}`,
        customer_email: user.email || `user${userId.substring(0, 8)}@flinxx.app`,
        customer_phone: (user.phone_number || '9876543210').toString().replace(/[^0-9]/g, ''),
      },
      order_note: `${plan.name} subscription for Flinxx`,
      return_url: `${BASE_URL}/payment-success?orderId={order_id}`,
      notify_url: `${BASE_URL}/api/payments/webhook`,
    };

    const endpoint = '/orders';
    const bodyString = JSON.stringify(sessionPayload);
    const headers = getCashfreeHeaders();

    console.log('💳 [PAYMENTS] Sending request to Cashfree API:');
    console.log('  Environment:', CASHFREE_ENVIRONMENT);
    console.log('  Base URL:', CASHFREE_BASE_URL);
    console.log('  Endpoint:', endpoint);
    console.log('  Full URL:', `${CASHFREE_BASE_URL}${endpoint}`);
    console.log('  Headers:', { ...headers, 'x-client-secret': '***' });
    console.log('  Body:', JSON.stringify(sessionPayload, null, 2));

    let response;
    let sessionData;
    
    try {
      response = await fetch(`${CASHFREE_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: bodyString,
      });

      const responseText = await response.text();
      console.log('💳 [PAYMENTS] Cashfree Raw Response:', responseText);
      
      try {
        sessionData = JSON.parse(responseText);
      } catch (e) {
        console.error('💳 [PAYMENTS] Failed to parse JSON:', e.message);
        sessionData = { error: 'Invalid JSON response from Cashfree', raw: responseText };
      }

      console.log('💳 [PAYMENTS] Cashfree API Response:');
      console.log('  Status:', response.status, response.statusText);
      console.log('  Data:', sessionData);
    } catch (fetchError) {
      console.error('💳 [PAYMENTS] ❌ Fetch error:', fetchError.message);
      return res.status(500).json({ 
        error: 'Failed to connect to Cashfree API',
        details: fetchError.message 
      });
    }

    if (!response.ok) {
      console.error('💳 [PAYMENTS] ❌ Cashfree API request failed');
      console.error('  HTTP Status:', response.status);
      console.error('  Response Body:', JSON.stringify(sessionData, null, 2));
      console.error('  Full Error Details:');
      console.error('    message:', sessionData?.message);
      console.error('    error:', sessionData?.error);
      console.error('    reason:', sessionData?.reason);
      console.error('    status:', sessionData?.status);
      
      const errorMessage = sessionData?.message || sessionData?.error || sessionData?.reason || JSON.stringify(sessionData);
      
      return res.status(response.status).json({ 
        error: 'Failed to create payment session',
        details: errorMessage,
        cashfreeResponse: sessionData
      });
    }

    // Handle different response formats from Cashfree
    let sessionId = sessionData?.payments_session_id || sessionData?.session_id || sessionData?.payment_session_id;
    
    if (!sessionId) {
      console.error('💳 [PAYMENTS] ❌ No session ID in Cashfree response');
      console.error('  Full response:', JSON.stringify(sessionData, null, 2));
      console.error('  Available keys:', Object.keys(sessionData || {}));
      return res.status(400).json({ 
        error: 'No payment session received from Cashfree',
        details: 'Session ID missing in response',
        cashfreeResponse: sessionData,
        availableKeys: Object.keys(sessionData || {})
      });
    }

    console.log(`💳 [PAYMENTS] ✅ Order created: ${orderId} for plan ${planId}`);
    console.log(`  Session ID received: ${sessionId}`);

    // Save order in DB
    await pool.query(
      `INSERT INTO payments (id, user_id, plan_id, plan_name, amount, currency, cashfree_order_id, cashfree_session_id, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'created')`,
      [userId, planId, plan.name, plan.amount, plan.currency, orderId, sessionId]
    );

    res.json({
      success: true,
      sessionId: sessionId,
      orderId: orderId,
      plan: {
        id: planId,
        name: plan.name,
        description: plan.description,
        amount: plan.amount,
      },
    });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// ===== 1.5 GET PAYMENT LINK (Redirect-based approach, no SDK needed) =====
router.post('/get-payment-link', async (req, res) => {
  try {
    console.log('💳 [GET-PAYMENT-LINK] Request received');
    console.log('  Body:', req.body);
    console.log('  Pool available:', !!pool);
    console.log('  Prisma available:', !!prisma);
    
    const { planId, userId } = req.body;

    if (!planId || !userId) {
      console.error('💳 [GET-PAYMENT-LINK] ❌ Missing planId or userId');
      return res.status(400).json({ error: 'planId and userId are required' });
    }

    const plan = PLANS[planId];
    if (!plan) {
      console.error('💳 [GET-PAYMENT-LINK] ❌ Invalid plan:', planId);
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // ===== MOCK MODE: Return mock session without database lookup =====
    if (CASHFREE_MOCK) {
      console.log('🎭 [MOCK MODE] Creating mock payment session');
      const mockSessionId = `session_mock_${orderId}`;
      console.log('✅ Mock mode returning session:', mockSessionId);
      
      return res.json({
        success: true,
        sessionId: mockSessionId,
        orderId: orderId,
        isMock: true,
      });
    }

    // ===== REAL MODE: Validate user exists =====
    console.log('💳 [GET-PAYMENT-LINK] Looking up user:', userId);
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('💳 [GET-PAYMENT-LINK] ❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('💳 [GET-PAYMENT-LINK] ✅ User found:', user.email);

    // ===== REAL CASHFREE: Create order and get payment link =====
    // Cashfree requires HTTPS for return_url and notify_url
    // Using ngrok domain for external payment flow testing
    
    const sessionPayload = {
      order_id: orderId,
      order_amount: plan.amount, // Cashfree expects amount in rupees
      order_currency: 'INR',
      customer_details: {
        customer_id: userId,
        customer_name: user.display_name || `User ${userId.substring(0, 8)}`,
        customer_email: user.email || `user${userId.substring(0, 8)}@flinxx.app`,
        customer_phone: (user.phone_number || '9876543210').toString().replace(/[^0-9]/g, '').substring(0, 10),
      },
      order_note: `${plan.name} subscription for Flinxx`,
      return_url: `${BASE_URL}/payment-success?orderId={order_id}`,
      notify_url: `${BASE_URL}/api/payments/webhook`,
    };

    const endpoint = '/orders';
    const headers = getCashfreeHeaders();

    console.log('💳 [PAYMENTS] Creating Cashfree order for payment link...');
    console.log('  Order ID:', orderId);
    console.log('  Endpoint:', endpoint);
    console.log('  Full URL:', `${CASHFREE_BASE_URL}${endpoint}`);
    console.log('  Request Payload:', JSON.stringify(sessionPayload, null, 2));
    console.log('  Headers:', { ...headers, 'x-client-secret': '***' });

    const response = await fetch(`${CASHFREE_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sessionPayload),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('💳 [PAYMENTS] Failed to parse Cashfree response:', e.message);
      responseData = { error: 'Invalid JSON response from Cashfree', raw: responseText };
    }

    console.log('💳 [PAYMENTS] Cashfree API Response (full):', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('💳 [PAYMENTS] ❌ Cashfree API failed:', responseData);
      return res.status(response.status).json({ 
        error: 'Failed to create payment link',
        details: responseData?.message || responseData?.error?.message || JSON.stringify(responseData)
      });
    }

    // Cashfree /orders returns payment_session_id at root level
    const paymentSessionId = responseData?.payment_session_id;
    
    if (!paymentSessionId) {
      console.error('💳 [PAYMENTS] ❌ No payment_session_id in response:', responseData);
      return res.status(400).json({ 
        error: 'No payment session received from Cashfree',
        details: 'Payment session ID not found in response',
        response: responseData,
        availableKeys: Object.keys(responseData || {})
      });
    }

    console.log('💳 [PAYMENTS] ✅ Payment session created:', paymentSessionId.substring(0, 80) + '...');

    // Save order in DB
    await pool.query(
      `INSERT INTO payments (id, user_id, plan_id, plan_name, amount, currency, cashfree_order_id, cashfree_session_id, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'pending')`,
      [userId, planId, plan.name, plan.amount, plan.currency, orderId, paymentSessionId]
    );

    // Return session ID to frontend (frontend will use SDK to open checkout)
    res.json({
      success: true,
      sessionId: paymentSessionId,
      orderId: orderId,
      isMock: false,
    });
  } catch (error) {
    console.error('💳 [GET-PAYMENT-LINK] ❌ Caught error:', error.message);
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ===== 2. VERIFY PAYMENT (webhook endpoint) =====
router.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Get payment record from DB first
    const { rows } = await pool.query(
      `SELECT * FROM payments WHERE cashfree_order_id = $1`,
      [orderId]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    const payment = rows[0];

    // ===== MOCK MODE: Auto-mark as paid =====
    if (CASHFREE_MOCK) {
      console.log('🎭 [MOCK MODE] Verifying mock payment - auto-marking as successful');

      const activePlanId = payment.plan_id;
      const activeUserId = payment.user_id;

      // Update payment record to paid
      await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             cashfree_payment_id = $1,
             paid_at = NOW(),
             updated_at = NOW()
         WHERE cashfree_order_id = $2`,
        [orderId, orderId]
      );

      // Enable feature for user based on plan
      const now = new Date();
      let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // Default 28 days

      if (activePlanId === 'blue_tick') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days for blue tick
        await pool.query(
          `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'match_boost') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days for match boost
        await pool.query(
          `UPDATE users SET has_match_boost = true, match_boost_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'unlimited_skip') {
        expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days for unlimited skip
        await pool.query(
          `UPDATE users SET has_unlimited_skip = true, unlimited_skip_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      }

      console.log(`💳 [PAYMENTS] ✅ Feature "${activePlanId}" enabled for user ${activeUserId.substring(0, 8)}... until ${expiresAt.toISOString()}`);

      return res.json({
        success: true,
        message: `Payment verified! ${PLANS[activePlanId]?.name || activePlanId} is now active (MOCK).`,
        feature: activePlanId,
        plan: activePlanId,
        planName: PLANS[activePlanId]?.name || activePlanId,
        expiresAt: expiresAt.toISOString(),
        mock: true,
      });
    }

    // ===== REAL MODE: Fetch from Cashfree API =====
    // Fetch order details from Cashfree to verify payment status
    const endpoint = `/orders/${orderId}`;
    const headers = getCashfreeHeaders();

    console.log('💳 [PAYMENTS] Fetching order from Cashfree:', `${CASHFREE_BASE_URL}${endpoint}`);

    const response = await fetch(`${CASHFREE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const orderData = await response.json();

    console.log('💳 [PAYMENTS] Cashfree order data:', orderData);

    if (!response.ok) {
      console.error('💳 [PAYMENTS] ❌ Failed to fetch order from Cashfree:', orderData);
      return res.status(400).json({ error: 'Failed to verify payment' });
    }

    // Check if order status is PAID
    if (orderData.order_status === 'PAID') {
      // Extract payment ID from settlements (Cashfree provides this)
      const paymentId = orderData.cf_payment_id ? orderData.cf_payment_id.toString() : orderId;

      // Update payment record to paid
      await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             cashfree_payment_id = $1,
             paid_at = NOW(),
             updated_at = NOW()
         WHERE cashfree_order_id = $2`,
        [paymentId, orderId]
      );

      const activePlanId = payment.plan_id;
      const activeUserId = payment.user_id;

      // Enable feature for user based on plan
      const now = new Date();
      let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // Default 28 days

      if (activePlanId === 'blue_tick') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days for blue tick
        await pool.query(
          `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'match_boost') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days for match boost
        await pool.query(
          `UPDATE users SET has_match_boost = true, match_boost_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'unlimited_skip') {
        expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days for unlimited skip
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
        plan: activePlanId,
        planName: PLANS[activePlanId]?.name || activePlanId,
        expiresAt: expiresAt.toISOString(),
      });
    } else {
      // Payment not completed yet
      console.log(`💳 [PAYMENTS] ⏳ Order ${orderId} status: ${orderData.order_status}`);
      
      // Update status in DB if needed
      if (orderData.order_status === 'FAILED') {
        await pool.query(
          `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE cashfree_order_id = $1`,
          [orderId]
        );
      }

      res.status(202).json({
        success: false,
        message: `Payment not yet confirmed. Status: ${orderData.order_status}`,
        status: orderData.order_status,
      });
    }

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Error verifying payment:', error.message);
    res.status(500).json({ error: 'Failed to verify payment', details: error.message });
  }
});

// ===== 3. WEBHOOK ENDPOINT (for Cashfree callbacks) =====
router.post('/webhook', async (req, res) => {
  try {
    const { order_id, order_status, cf_payment_id } = req.body;

    console.log(`💳 [PAYMENTS] 📨 Webhook received - Order: ${order_id}, Status: ${order_status}`);

    if (order_status === 'PAID') {
      // Get payment record
      const { rows } = await pool.query(
        `SELECT * FROM payments WHERE cashfree_order_id = $1`,
        [order_id]
      );

      if (rows[0]) {
        const payment = rows[0];
        const activePlanId = payment.plan_id;
        const activeUserId = payment.user_id;

        // Update payment status
        await pool.query(
          `UPDATE payments 
           SET status = 'paid',
               cashfree_payment_id = $1,
               paid_at = NOW(),
               updated_at = NOW()
           WHERE cashfree_order_id = $2`,
          [cf_payment_id || order_id, order_id]
        );

        // Enable feature for user
        const now = new Date();
        let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

        if (activePlanId === 'blue_tick') {
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          await pool.query(
            `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
            [expiresAt, activeUserId]
          );
        } else if (activePlanId === 'match_boost') {
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
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

        console.log(`💳 [PAYMENTS] ✅ Webhook processed - Feature "${activePlanId}" enabled for user ${activeUserId.substring(0, 8)}...`);
      }
    }

    // Always respond with 200 to acknowledge webhook
    res.json({ success: true });

  } catch (error) {
    console.error('💳 [PAYMENTS] ❌ Webhook error:', error.message);
    res.status(200).json({ success: true }); // Still acknowledge to prevent Cashfree retry
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

// ===== 3.5 PAYMENT SUCCESS PAGE (Cashfree return_url handler) =====
// This endpoint is called when Cashfree redirects back after payment completion
router.get('/payment-success', async (req, res) => {
  try {
    const orderId = req.query.order_id;

    console.log(`💳 [PAYMENT-SUCCESS] Payment success page requested. Order ID: ${orderId}`);

    if (!orderId) {
      console.warn('💳 [PAYMENT-SUCCESS] ⚠️ No order_id provided in redirect URL');
      return res.status(400).json({ 
        success: false, 
        message: 'No order_id provided. Please complete the payment flow properly.' 
      });
    }

    // Get payment record from DB
    const { rows } = await pool.query(
      `SELECT * FROM payments WHERE cashfree_order_id = $1`,
      [orderId]
    );

    if (!rows[0]) {
      console.error('💳 [PAYMENT-SUCCESS] ❌ Payment record not found:', orderId);
      return res.status(404).json({ 
        success: false, 
        message: 'Payment record not found. Please contact support.' 
      });
    }

    const payment = rows[0];
    console.log(`💳 [PAYMENT-SUCCESS] Payment record found - Status: ${payment.status}, User: ${payment.user_id.substring(0, 8)}...`);

    // ===== MOCK MODE: Auto-mark as paid with subscription activation =====
    if (CASHFREE_MOCK) {
      console.log('🎭 [PAYMENT-SUCCESS] Mock mode - auto-activating subscription');
      
      const activePlanId = payment.plan_id;
      const activeUserId = payment.user_id;

      // Update payment record to paid
      await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             cashfree_payment_id = $1,
             paid_at = NOW(),
             updated_at = NOW()
         WHERE cashfree_order_id = $2`,
        [orderId, orderId]
      );

      // Enable feature for user
      const now = new Date();
      let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

      if (activePlanId === 'blue_tick') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'match_boost') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_match_boost = true, match_boost_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'unlimited_skip') {
        expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_unlimited_skip = true, unlimited_skip_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      }

      console.log(`💳 [PAYMENT-SUCCESS] ✅ Mock subscription activated - "${activePlanId}" expires at ${expiresAt.toISOString()}`);
      
      // Return success response
      return res.json({
        success: true,
        message: `✅ Payment Successful! ${PLANS[activePlanId]?.name || activePlanId} is now active.`,
        orderId: orderId,
        plan: activePlanId,
        planName: PLANS[activePlanId]?.name || activePlanId,
        expiresAt: expiresAt.toISOString(),
        mock: true,
      });
    }

    // ===== REAL MODE: Verify payment with Cashfree API =====
    const endpoint = `/orders/${orderId}`;
    const headers = getCashfreeHeaders();

    console.log(`💳 [PAYMENT-SUCCESS] Verifying payment with Cashfree: ${CASHFREE_BASE_URL}${endpoint}`);

    const response = await fetch(`${CASHFREE_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error('💳 [PAYMENT-SUCCESS] ❌ Failed to fetch order from Cashfree:', orderData);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to verify payment status. Please try again later.' 
      });
    }

    console.log(`💳 [PAYMENT-SUCCESS] Cashfree order status: ${orderData.order_status}`);

    // Check if order status is PAID
    if (orderData.order_status === 'PAID') {
      const activePlanId = payment.plan_id;
      const activeUserId = payment.user_id;
      const paymentId = orderData.cf_payment_id ? orderData.cf_payment_id.toString() : orderId;

      // Update payment record to paid
      await pool.query(
        `UPDATE payments 
         SET status = 'paid', 
             cashfree_payment_id = $1,
             paid_at = NOW(),
             updated_at = NOW()
         WHERE cashfree_order_id = $2`,
        [paymentId, orderId]
      );

      // Enable feature for user based on plan
      const now = new Date();
      let expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

      if (activePlanId === 'blue_tick') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_blue_tick = true, blue_tick_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'match_boost') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_match_boost = true, match_boost_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      } else if (activePlanId === 'unlimited_skip') {
        expiresAt = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
        await pool.query(
          `UPDATE users SET has_unlimited_skip = true, unlimited_skip_expires_at = $1, updated_at = NOW() WHERE id = $2`,
          [expiresAt, activeUserId]
        );
      }

      console.log(`💳 [PAYMENT-SUCCESS] ✅ Payment verified & subscription activated - "${activePlanId}" expires at ${expiresAt.toISOString()}`);

      return res.json({
        success: true,
        message: `✅ Payment Successful! ${PLANS[activePlanId]?.name || activePlanId} is now active.`,
        orderId: orderId,
        plan: activePlanId,
        planName: PLANS[activePlanId]?.name || activePlanId,
        expiresAt: expiresAt.toISOString(),
      });
    } else {
      // Payment not completed
      console.warn(`💳 [PAYMENT-SUCCESS] ⚠️ Order not paid yet. Status: ${orderData.order_status}`);
      
      if (orderData.order_status === 'FAILED') {
        await pool.query(
          `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE cashfree_order_id = $1`,
          [orderId]
        );
      }

      return res.status(202).json({
        success: false,
        message: `Payment not yet completed. Status: ${orderData.order_status}`,
        status: orderData.order_status,
        orderId: orderId,
      });
    }

  } catch (error) {
    console.error('💳 [PAYMENT-SUCCESS] ❌ Error handling payment success:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      details: error.message 
    });
  }
});

// ===== 4. GET PAYMENT HISTORY =====
router.get('/history', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { rows } = await pool.query(
      `SELECT id, plan_id, plan_name, amount, currency, status, cashfree_order_id, paid_at, created_at
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
