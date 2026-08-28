const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const vm = require('vm');
let codeToExecute = '';

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    codeToExecute = scriptMatch[1];

    // Add mock DOM environment variables
    const preCode = `
    const document = {
      getElementById: () => ({ classList: {add: ()=>{}, remove: ()=>{}}, innerHTML: '', value: '', style: {}, focus: ()=>{}, appendChild: ()=>{}, addEventListener: ()=>{}, setPointerCapture: ()=>{}, dataset: {}, querySelectorAll: () => [] }),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => ({ className: '', innerHTML: '', addEventListener: ()=>{}, style: {}, appendChild: ()=>{}, dataset: {}, classList: {add: ()=>{}, remove: ()=>{}, toggle: ()=>{}}, querySelectorAll: () => [] }),
      execCommand: () => {},
      addEventListener: () => {}
    };
    const window = { innerWidth: 1000, getSelection: () => null };
    const event = { target: null, preventDefault: ()=>{}, stopPropagation: ()=>{} };

    `;

    try {
        const script = new vm.Script(preCode + codeToExecute + '\ninitItems(); console.log(ITEMS.length, "items"); console.log(ITEMS[0]);');
        script.runInNewContext({console});
        console.log("No syntax errors found.");
    } catch (e) {
        console.error("Syntax error:", e);
    }
}
