const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /else if\(type==='bag'\)\{BAGS=BAGS\.filter\(b=>b\.id!==id\);bagOrder=bagOrder\.filter\(x=>x!==id\);\}/;
html = html.replace(regex, "else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);ITEMS.forEach(i=>{i.bagIds = (i.bagIds||[]).filter(x=>x!==id)});bagOrder=bagOrder.filter(x=>x!==id);}");

const regex2 = /else\{PURPOSES=PURPOSES\.filter\(p=>p\.id!==id\);purposeOrder=purposeOrder\.filter\(x=>x!==id\);\}/;
html = html.replace(regex2, "else{PURPOSES=PURPOSES.filter(p=>p.id!==id);ITEMS.forEach(i=>{i.purposeIds = (i.purposeIds||[]).filter(x=>x!==id)});purposeOrder=purposeOrder.filter(x=>x!==id);}");

fs.writeFileSync('index.html', html);
