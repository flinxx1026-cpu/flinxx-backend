const testPayment = async () => {
  const userId = '016282f0-31c9-49aa-b709-e01385f86c15';  // From logs
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxNjI4MmYwLTMxYzktNDlhYS1iNzA5LWUwMTM4NWY4NmMxNSIsInVzZXJJZCI6IjAxNjI4MmYwLTMxYzktNDlhYS1iNzA5LWUwMTM4NWY4NmMxNSIsImVtYWlsIjoidGdnY2MxNDcwQGdtYWlsLmNvbSIsInB1YmxpY0lkIjoiNjQyMTY5MDQiLCJpYXQiOjE3NzMxNTg5OTcsImV4cCI6MTc3Mzc2Mzc5N30.Qya4y6zspABbfKImfRCmLmvJcU1tdOClFDwvQ8uy7es';
  
  try {
    console.log('📞 Calling /api/payments/get-payment-link...');
    const response = await fetch('http://localhost:5000/api/payments/get-payment-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: 'blue_tick',
        userId: userId
      })
    });

    const responseText = await response.text();
    console.log('\n✅ Response Status:', response.status);
    
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Response Data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Raw Response:', responseText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testPayment();
