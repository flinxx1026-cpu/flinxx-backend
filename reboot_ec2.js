const { execSync } = require('child_process');

try {
  console.log('=== Configuring PM2 Startup ===');
  // Run pm2 startup to get the command, don't use pipe or grep to abide by rules
  const startupOutput = execSync('pm2 startup', { encoding: 'utf8' });
  
  const lines = startupOutput.split('\n');
  const sudoCmd = lines.find(l => l.trim().startsWith('sudo env PATH'));
  
  if (sudoCmd) {
    console.log('[PM2] Found setup command. Executing:', sudoCmd);
    execSync(sudoCmd, { encoding: 'utf8' });
    console.log('[PM2] Startup configured.');
  } else {
    console.log('[PM2] No sudo command found in output. It might be already configured.');
  }
  
  console.log('Saving PM2 state...');
  execSync('pm2 save', { encoding: 'utf8' });
  
  console.log('=== Rebooting Instance ===');
  // This will disconnect SSH
  execSync('sudo reboot', { encoding: 'utf8' });
  
} catch (e) {
  console.error('Error:', e.message);
}
