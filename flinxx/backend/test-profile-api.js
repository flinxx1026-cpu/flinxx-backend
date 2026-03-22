import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function testProfileResponse() {
  const users = ['itsgaming808@gmail.com', 'rcbvtg@gmail.com'];
  
  for (const email of users) {
    try {
      console.log(`\n\nTesting with: ${email}`);
      const payload = {
        email: email, 
        userId: 'something' // mock since the api checks the db
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
      console.log('Token created');
      
      const res = await fetch('http://localhost:3001/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const body = await res.json();
      console.log(`Response for ${email}:`, JSON.stringify(body, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

testProfileResponse();
