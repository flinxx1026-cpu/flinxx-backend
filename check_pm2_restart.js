const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Checking PM2 Restart Status ===');
try {
  const result = execSync('pm2 status', { encoding: 'utf8' });
  console.log(result);
  
  if (result.includes('online')) {
    console.log('✅ Success: The backend process has automatically restared after reboot and is ONLINE.');
  } else {
    console.log('❌ Error: The backend process did NOT start automatically.');
  }
} catch (e) {
  console.error('Error fetching PM2 status:', e.message);
  console.log('❌ PM2 environment is not loaded properly after reboot.');
}
