// Test script to verify partner_found event is emitted correctly
// This simulates two users connecting and matching

import io from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';

// User 1
const user1 = {
  id: 'user-test-1',
  name: 'Test User 1',
  age: 25,
  location: 'Test City 1'
};

// User 2
const user2 = {
  id: 'user-test-2',
  name: 'Test User 2',
  age: 24,
  location: 'Test City 2'
};

let socket1, socket2;
let resultsLog = [];

function log(message, data = null) {
  const msg = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
  console.log(msg);
  resultsLog.push(msg);
}

async function testMatching() {
  return new Promise((resolve) => {
    // Connect first user
    socket1 = io(BACKEND_URL, { 
      reconnection: true, 
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    socket1.on('connect', () => {
      log(`✅ User 1 connected with socket ID: ${socket1.id}`);
      
      // Start matching for user 1
      log(`📤 User 1 starting matching...`);
      socket1.emit('user:start_matching', {
        userId: user1.id,
        userName: user1.name,
        userAge: user1.age,
        userLocation: user1.location
      });
    });

    socket1.on('partner_found', (data) => {
      log(`🎉 User 1 received partner_found:`, data);
    });

    socket1.on('match:waiting', (data) => {
      log(`⏳ User 1 is waiting:`, data);
      
      // After user 1 is waiting, connect user 2
      setTimeout(() => {
        socket2 = io(BACKEND_URL, { 
          reconnection: true, 
          autoConnect: true,
          transports: ['websocket', 'polling']
        });

        socket2.on('connect', () => {
          log(`✅ User 2 connected with socket ID: ${socket2.id}`);
          
          // Start matching for user 2
          log(`📤 User 2 starting matching...`);
          socket2.emit('user:start_matching', {
            userId: user2.id,
            userName: user2.name,
            userAge: user2.age,
            userLocation: user2.location
          });
        });

        socket2.on('partner_found', (data) => {
          log(`🎉 User 2 received partner_found:`, data);
          
          // Test complete
          setTimeout(() => {
            log('\n--- TEST COMPLETE ---');
            console.log('\n📋 Full test log:');
            resultsLog.forEach(r => console.log(r));
            
            socket1.disconnect();
            socket2.disconnect();
            process.exit(0);
          }, 2000);
        });

        socket2.on('match:waiting', (data) => {
          log(`⏳ User 2 is waiting:`, data);
        });

        socket2.on('error', (error) => {
          log(`❌ User 2 error: ${error}`);
        });
      }, 500);
    });

    socket1.on('error', (error) => {
      log(`❌ User 1 error: ${error}`);
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      if (socket1 || socket2) {
        log('⏱️ Test timeout - no match found after 15 seconds');
        if (socket1) socket1.disconnect();
        if (socket2) socket2.disconnect();
        process.exit(1);
      }
    }, 15000);
  });
}

log('🚀 Starting matching test...\n');
testMatching();
