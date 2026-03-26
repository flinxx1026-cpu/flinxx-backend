const { execSync } = require('child_process');
const fs = require('fs');

try {
  const logs = execSync('pm2 logs flinxx-backend --nostream --lines 50', { encoding: 'utf8' });
  fs.writeFileSync(require('path').join(process.env.HOME, 'pm2_logs.txt'), logs);
} catch(e) {
  fs.writeFileSync(require('path').join(process.env.HOME, 'pm2_logs.txt'), e.message + '\n' + e.stdout);
}
