const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    const vm = require('vm');
    const sandbox = {
      window: {},
      document: {
        getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} }, style: {}, getBoundingClientRect: () => ({}) }),
        querySelectorAll: () => ([]),
        querySelector: () => ({}),
        createElement: () => ({}),
        body: { appendChild: () => {} },
        execCommand: () => {},
      },
      navigator: {},
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      Date: Date,
      console: console,
      Math: Math,
      Set: Set,
      Map: Map,
      JSON: JSON,
      parseInt: parseInt
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    console.log("Syntax check passed!");
  } catch (e) {
    console.error("Syntax error:", e);
    process.exit(1);
  }
} else {
  console.log("No script tag found.");
}
