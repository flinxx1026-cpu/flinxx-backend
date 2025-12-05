#!/usr/bin/env node

// Quick startup test - Run for 5 seconds then exit
const subprocess = require('child_process');
const path = require('path');

console.log('🧪 Testing server startup...\n');

const server = subprocess.spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env }
});

// Kill after 5 seconds
setTimeout(() => {
  console.log('\n⏱️ Test timeout - stopping server...');
  server.kill();
  process.exit(0);
}, 5000);

server.on('error', (err) => {
  console.error('❌ Server startup failed:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`\n❌ Server exited with code ${code}`);
    process.exit(1);
  }
});
