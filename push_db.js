const { execSync } = require('child_process');

console.log('=== PUSHING DATABASE SCHEMA TO NEON/RDS ===');
try {
  // Push the Prisma schema to create missing tables on the new database
  const pushRes = execSync('cd ~/flinxx-backend/backend && npx prisma db push', { encoding: 'utf8' });
  console.log(pushRes);
  
  console.log('=== RESTARTING PM2 BACKEND ===');
  const restartRes = execSync('pm2 restart flinxx-backend', { encoding: 'utf8' });
  console.log(restartRes);
  
  console.log('✅ Schema pushed successfully and backend restarted.');
} catch (e) {
  console.error('Error during db push:', e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
}
