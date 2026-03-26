const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envPath = path.join(process.env.HOME, 'flinxx-backend/backend/.env');
let envContent = fs.readFileSync(envPath, 'utf8');

if (!envContent.includes('sslmode=require')) {
  envContent = envContent.replace(
    'amazonaws.com:5432/flinxx"',
    'amazonaws.com:5432/flinxx?sslmode=require"'
  );
  fs.writeFileSync(envPath, envContent);
  console.log('Added ?sslmode=require to DATABASE_URL');
}

console.log('--- RE-PUSHING SCHEMA ---');
try {
  const out = execSync('cd ~/flinxx-backend/backend && npx prisma db push --accept-data-loss', { encoding: 'utf8', stdio: 'pipe' });
  console.log(out);
  execSync('pm2 restart flinxx-backend');
  console.log('✅ Success!');
} catch (e) {
  if (e.stderr) console.log('ERROR:', e.stderr.toString());
  else if (e.stdout) console.log('ERROR OUT:', e.stdout.toString());
  else console.log('ERROR MSG:', e.message);
}
