const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix the typo in removeGroup introduced by patch3
html = html.replace("ITEMS=ITEMS.filter(i=>i.categoryIds = (i.categoryIds||[]).filter(x=>x!==id));",
                    "ITEMS.forEach(i=>{i.categoryIds = (i.categoryIds||[]).filter(x=>x!==id)});");

fs.writeFileSync('index.html', html);
