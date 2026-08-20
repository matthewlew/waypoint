const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// We replaced this:
// ${isNaN(day.date.getTime()) ? 'Day ' + day.dayNum : DOW[day.date.getDay()] + ' ' + fmt(day.date)}
// But wait, the previous code had fallback T.depDate to a Date.
// Let's see how T.depDate is parsed in buildDays

const buildDaysSearch = `const start=T.depDate?new Date(T.depDate+'T12:00:00'):new Date();`;
const buildDaysReplace = `const start=T.depDate?new Date(T.depDate+'T12:00:00'):new Date('invalid');`;

html = html.replace(buildDaysSearch, buildDaysReplace);

fs.writeFileSync('index.html', html);
console.log('Patched fallback date in buildDays.');
