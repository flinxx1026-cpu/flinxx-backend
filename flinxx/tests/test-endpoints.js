// Test different Cashfree v3 endpoints to find the correct one
const testEndpoints = async () => {
  const baseUrl = 'https://api.cashfree.com/pg';
  const clientId = 'YOUR_CLIENT_ID';
  const secretKey = 'YOUR_SECRET_KEY';

  const headers = {
    'x-client-id': clientId,
    'x-client-secret': secretKey,
    'x-api-version': '2023-08-01',
    'Content-Type': 'application/json',
  };

  const testPayload = {
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

  const endpoints = [
    '/orders',
    '/payment-links',
    '/payments',
    '/payments/sessions',
    '/sessions',
    '/web-checkout',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🧪 Testing: ${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testPayload),
      });

      const text = await response.text();
      const data = (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })();

      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, typeof data === 'string' ? data.substring(0, 100) : JSON.stringify(data).substring(0, 200));
    } catch (e) {
      console.log(`   Error: ${e.message}`);
    }
  }
};

testEndpoints();
