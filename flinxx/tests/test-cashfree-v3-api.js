#!/usr/bin/env node
// Test script to check Cashfree v3 API behavior with return_url

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID || 'YOUR_TEST_CLIENT_ID';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || 'YOUR_TEST_SECRET_KEY';
const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg';

async function testCashfreeAPI() {
  const orderId = `test_order_${Date.now()}_return_url_test`;
  
  // Test payload WITH return_url and notify_url
  const payload = {
    order_id: orderId,
    order_amount: 100,
    order_currency: 'INR',
    customer_details: {
      customer_id: 'test_user_' + Date.now(),
      customer_email: 'test@flinxx.app',
      customer_phone: '9999999999',
    },
    order_note: 'Test order with return_url and notify_url',
    return_url: 'https://gastroscopic-sharonda-inequilaterally.ngrok-free.dev/payment-success',
    notify_url: 'https://gastroscopic-sharonda-inequilaterally.ngrok-free.dev/api/payments/webhook',
  };

  console.log('\n📋 Test Payload (WITH return_url and notify_url):');
  console.log(JSON.stringify(payload, null, 2));

  const headers = {
    'x-client-id': CASHFREE_CLIENT_ID,
    'x-client-secret': CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json',
  };

  try {
    console.log('\n🔗 Sending request to Cashfree API...');
    console.log('URL:', `${CASHFREE_BASE_URL}/orders`);
    
    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    console.log('\n📤 Cashfree Response:');
    console.log('Status:', response.status, response.statusText);
    console.log('Data:', JSON.stringify(responseData, null, 2));

    if (response.ok && responseData.payment_session_id) {
      console.log('\n✅ Success! Payment Session ID:', responseData.payment_session_id.substring(0, 80) + '...');
      console.log('📝 Order ID:', responseData.order_id);
      console.log('\n⚠️  NOTE: return_url and notify_url were accepted by the API.');
      console.log('The issue might be:');
      console.log('1. Cashfree Merchant Dashboard has returned "localhost" in whitelist');
      console.log('2. The ngrok domain needs to be whitelisted in Merchant Dashboard');
      console.log('3. The return_url is correct, but Cashfree redirects anyway');
    } else {
      console.log('\n❌ API Error. Possible issues:');
      console.log('1. return_url/notify_url parameters might not be valid for v3');
      console.log('2. One of the parameters is being rejected');
      console.log('3. Check Cashfree v3 documentation for correct parameter names');
    }

  } catch (error) {
    console.error('\n❌ Fetch error:', error.message);
  }
}

testCashfreeAPI();
