const { execSync } = require('child_process');

console.log('=== STARTING BACKEND PROCESS ===');
try {
  // Stop existing if any
  try { execSync('pm2 delete flinxx-backend', { stdio: 'ignore' }); } catch(err){}
  
  // Start gracefully
  execSync('cd ~/flinxx-backend/backend && pm2 start server.js --name flinxx-backend', { encoding: 'utf8' });
  console.log('Started flinxx-backend in PM2.');
} catch (e) {
  console.error('Error starting PM2:', e.message);
}

console.log('\n=== FIXING PM2 STARTUP ON BOOT ===');
try {
  // Extract pm2 startup command for systemd
  const startupOut = execSync('pm2 startup systemd', { encoding: 'utf8' });
  
  // Find the generated sudo command
  const lines = startupOut.split('\n');
  const sudoLine = lines.find(line => line.trim().startsWith('sudo env PATH'));
  
  if (sudoLine) {
    console.log('Identified startup configuration:', sudoLine);
    execSync(sudoLine, { encoding: 'utf8', stdio: 'inherit' });
    console.log('Successfully bound PM2 to systemd boot pipeline.');
  } else {
    console.log('Sudo command not found. Might be pre-configured.');
  }
  
  execSync('pm2 save', { encoding: 'utf8' });
  console.log('PM2 list state saved to disk.');
} catch (e) {
  console.error('Error during startup config:', e.message);
  if (e.stdout) console.error('stdout:', e.stdout.toString());
  if (e.stderr) console.error('stderr:', e.stderr.toString());
}
