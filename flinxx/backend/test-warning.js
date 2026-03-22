// Test Warning System
// Run with: node test-warning.js

import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWarning() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 [TEST WARNING] Starting warning system test...');
    console.log('='.repeat(80));
    
    // Get first user
    console.log('\n📊 Fetching first user from database...');
    const user = await prisma.users.findFirst({
      select: {
        id: true,
        email: true,
        public_id: true
      }
    });
    
    if (!user) {
      console.log('❌ No users found in database');
      console.log('💡 Create a user account first by logging in to the app');
      process.exit(1);
    }
    
    console.log('✅ User found:');
    console.log(`   UUID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Public ID: ${user.public_id}`);
    
    // Send warning
    console.log('\n📡 Sending warning to user...');
    const warningPayload = {
      userId: user.id,
      reason: 'Automated test warning - check if modal appears on user screen'
    };
    
    console.log(`   Payload:`);
    console.log(`   ${JSON.stringify(warningPayload, null, 4)}`);
    
    const response = await axios.post('http://localhost:5000/api/admin/send-warning', warningPayload);
    
    console.log('\n✅ Warning sent successfully!');
    console.log(`   Response:`);
    console.log(`   ${JSON.stringify(response.data, null, 4)}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 NEXT STEPS:');
    console.log('='.repeat(80));
    console.log('   1. Open http://localhost:3003 in browser');
    console.log('   2. Login as the test user (' + user.email + ')');
    console.log('   3. Keep the page open and active');
    console.log('   4. Check browser console for debug logs');
    console.log('   5. The warning modal SHOULD appear with gold styling!');
    console.log('='.repeat(80) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('\n💡 Make sure:');
    console.error('   - Backend is running on http://localhost:5000');
    console.error('   - Database is accessible at the CONNECTION string in .env');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testWarning();
