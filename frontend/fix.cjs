const fs = require('fs');
const f = 'C:/Users/nikhi/Downloads/joi/frontend/src/context/AuthContext.jsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/const setAuthToken = \(token, userData\) => \{\r?\n\s+\}\)/, 'const setAuthToken = (token, userData) => {');
fs.writeFileSync(f, c);
console.log('Fixed syntax error');
