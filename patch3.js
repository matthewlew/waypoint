const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('!(i.categoryIds||[]).includes(id)', 'i.categoryIds = (i.categoryIds||[]).filter(x=>x!==id)');
html = html.replace('!(i.bagIds||[]).includes(id)', 'i.bagIds = (i.bagIds||[]).filter(x=>x!==id)');
html = html.replace('!(i.purposeIds||[]).includes(id)', 'i.purposeIds = (i.purposeIds||[]).filter(x=>x!==id)');

fs.writeFileSync('index.html', html);
