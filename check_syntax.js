const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.writeFileSync('extracted.js', scriptContent);
