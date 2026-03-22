const testOrdersEndpoint = async () => {
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
    order_id: 'test_order_' + Date.now(),
    order_amount: 100,
    order_currency: 'INR',
    customer_details: {
      customer_id: 'test_customer',
      customer_email: 'test@flinxx.app',
      customer_phone: '9999999999',
    },
    order_note: 'Test Order',
  };

  try {
    console.log('📋 Testing /orders endpoint with full response...\n');
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();
    
    console.log('✅ Full /orders Response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n📌 Response Keys:', Object.keys(data));
    if (data.data) console.log('📌 Data Keys:', Object.keys(data.data));
    
    // Check for payment link or session fields
    console.log('\n🔍 Looking for payment link fields:');
    if (data.payment_link) console.log('   ✅ payment_link:', data.payment_link.substring(0, 80) + '...');
    if (data.data?.payment_link) console.log('   ✅ data.payment_link:', data.data.payment_link.substring(0, 80) + '...');
    if (data.cf_order_id) console.log('   📌 cf_order_id:', data.cf_order_id);
    if (data.data?.cf_order_id) console.log('   📌 data.cf_order_id:', data.data.cf_order_id);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testOrdersEndpoint();
