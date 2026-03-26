const { execSync } = require('child_process');

console.log('=== PUSHING DATABASE SCHEMA FORCEFULLY ===');
try {
  // Use --accept-data-loss just in case it prompts
  const pushRes = execSync('cd ~/flinxx-backend/backend && npx prisma db push --accept-data-loss', { encoding: 'utf8' });
  console.log(pushRes);
  
  console.log('=== RESTARTING PM2 BACKEND ===');
  const restartRes = execSync('pm2 restart flinxx-backend', { encoding: 'utf8' });
  console.log(restartRes);
  
  console.log('✅ Schema pushed successfully and backend restarted.');
} catch (e) {
  console.error('Error during db push:', e.message);
  if (e.stdout) console.log('STDOUT:', e.stdout.toString());
  if (e.stderr) console.error('STDERR:', e.stderr.toString());
}
