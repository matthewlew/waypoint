const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    let script = scriptMatch[1];
    try {
        const vm = require('vm');
        new vm.Script(script);
        console.log("Compilation successful!");
    } catch (e) {
        console.error("Compilation error:");
        console.error(e);
    }
}
