const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.join(process.env.HOME, 'flinxx-backend/backend/.env');

console.log('Target env path:', envPath);

if (!fs.existsSync(envPath)) {
  console.error('.env not found!');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
const newDbUrl = 'DATABASE_URL="postgresql://postgres:Nikhil6002@flinxx-db.chiwiam80lbl.eu-north-1.rds.amazonaws.com:5432/flinxx"';

envContent = envContent.replace(/^DATABASE_URL=.*$/m, newDbUrl);

// Write changes
fs.writeFileSync(envPath, envContent);
console.log('Successfully updated .env database URL to AWS RDS.');

console.log('\n--- Prisma Generate ---');
try {
  const result = execSync('cd ~/flinxx-backend/backend && npx prisma generate', { encoding: 'utf8' });
  console.log(result);
} catch (e) {
  console.error('Prisma Error:', e.message);
}

console.log('\n--- PM2 Restart ---');
try {
  const result = execSync('pm2 restart flinxx-backend', { encoding: 'utf8' });
  console.log(result);
} catch (e) {
  console.error('PM2 Error:', e.message);
}

console.log('\n--- PM2 Set to Persist on Server Restart ---');
try {
  execSync('pm2 save', { encoding: 'utf8' });
  console.log('Saved PM2 state.');
} catch (e) {
  console.error('PM2 Save Error:', e.message);
}
