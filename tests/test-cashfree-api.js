const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg';
const CASHFREE_CLIENT_ID = 'YOUR_TEST_CLIENT_ID';
const CASHFREE_SECRET_KEY = 'YOUR_TEST_SECRET_KEY';

const headers = {
  'x-client-id': CASHFREE_CLIENT_ID,
  'x-client-secret': CASHFREE_SECRET_KEY,
  'x-api-version': '2023-08-01',
  'Content-Type': 'application/json',
};

const payload = {
  order_id: 'test_' + Date.now(),
  order_amount: 100,
  order_currency: 'INR',
  customer_details: {
    customer_id: 'test_customer',
    customer_email: 'test@flinxx.app',
    customer_phone: '9999999999',
  },
  order_note: 'Test Order',
};

console.log('📋 Testing Cashfree API /orders endpoint...');
console.log('Payload:', JSON.stringify(payload, null, 2));

fetch(`${CASHFREE_BASE_URL}/orders`, {
  method: 'POST',
  headers,
  body: JSON.stringify(payload),
})
  .then(r => r.text())
  .then(text => {
    console.log('\n✅ Response:');
    try {
      const parsed = JSON.parse(text);
      console.log(JSON.stringify(parsed, null, 2));
      console.log('\n📌 Response Keys:', Object.keys(parsed));
      if (parsed.data) console.log('📌 Data Keys:', Object.keys(parsed.data));
    } catch {
      console.log(text);
    }
  })
  .catch(e => console.error('❌ Error:', e.message));
