const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatches && scriptMatches[1]) {
  try {
    new vm.Script(scriptMatches[1]);
    console.log('Syntax OK');
  } catch (e) {
    console.error('Syntax Error:', e);
    process.exit(1);
  }
} else {
  console.log('No script tag found.');
}
