const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function tryRepair(str) {
  try {
     return Buffer.from(str, 'latin1').toString('utf8');
  } catch (e) {
     return str;
  }
}

let brokenFiles = [];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.match(/ðŸ|â‚¹|âœ|â ¤|âš|â›|â ³|â Œ/)) {
      let buffer = Buffer.from(content, 'latin1');
      let repaired = buffer.toString('utf8');
      
      if (repaired.includes('\uFFFD')) {
         console.log(`[WARN] File ${filePath} has invalid UTF-8 when converted via latin1.`);
      } else {
         console.log(`[OK] File ${filePath} successfully repairs via latin1 conversion.`);
         brokenFiles.push(filePath);
      }
    }
  }
});
console.log(`Can safely repair ${brokenFiles.length} files.`);

// If safe, let's just do it
brokenFiles.forEach(file => {
   let content = fs.readFileSync(file, 'utf8');
   let repaired = Buffer.from(content, 'latin1').toString('utf8');
   fs.writeFileSync(file, repaired, 'utf8');
});

console.log('REPAIR COMPLETE.');
