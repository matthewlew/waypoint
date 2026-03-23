const fs = require('fs');
const code = fs.readFileSync('index.html', 'utf-8');
const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);

if (!scriptMatch) {
  console.error("No script tag found!");
  process.exit(1);
}

const jsCode = scriptMatch[1];
try {
  const vm = require('vm');
  new vm.Script(jsCode);
  console.log("Syntax OK");
} catch (e) {
  console.error("Syntax Error:", e);
  process.exit(1);
}
