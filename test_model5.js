const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix removeGroup to just unlink the category rather than delete the whole item
const searchRemoveGroup = `  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS=ITEMS.filter(i=>!i.categoryIds.includes(id));catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);purposeOrder=purposeOrder.filter(x=>x!==id);}`;

const replaceRemoveGroup = `  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS.forEach(i=>{if(i.categoryIds) i.categoryIds=i.categoryIds.filter(x=>x!==id);});catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);ITEMS.forEach(i=>{if(i.bagIds) i.bagIds=i.bagIds.filter(x=>x!==id);});bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);ITEMS.forEach(i=>{if(i.purposeIds) i.purposeIds=i.purposeIds.filter(x=>x!==id);});purposeOrder=purposeOrder.filter(x=>x!==id);}`;

html = html.replace(searchRemoveGroup, replaceRemoveGroup);

fs.writeFileSync('index.html', html, 'utf8');
