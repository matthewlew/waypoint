const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// In buildDayCard, handle invalid dates (when T.depDate is empty)
const cardDateSearch = `\${DOW[day.date.getDay()]} \${fmt(day.date)}`;
const cardDateReplace = `\${isNaN(day.date.getTime()) ? 'Day ' + day.dayNum : DOW[day.date.getDay()] + ' ' + fmt(day.date)}`;

// Also for outfits page card
const outfitDateSearch = `\${DOW[day.date.getDay()]} \${fmt(day.date)}`;
const outfitDateReplace = `\${isNaN(day.date.getTime()) ? 'Day ' + day.dayNum : DOW[day.date.getDay()] + ' ' + fmt(day.date)}`;


// Replace globally (it will hit both spots)
html = html.split(cardDateSearch).join(cardDateReplace);

fs.writeFileSync('index.html', html);
console.log('Patched flexible dates.');
