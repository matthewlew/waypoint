const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Also inject initDrag on list-row containers to make them sortable
const targetPackBody = `body:items.map(i=>itemRow(i)).join('')+\`<div class="row-add" onclick="openAddItem('cat','\${cat.id}')">+ Add item</div>\`});`;
const replacePackBody = `body:\`<div class="items-drag-container">\${items.map(i=>itemRow(i)).join('')}</div>\`+\`<div class="row-add" onclick="openAddItem('cat','\${cat.id}')">+ Add item</div>\`});`;
content = content.replace(targetPackBody, replacePackBody);

const targetPackBody2 = `body:items.map(i=>itemRow(i,true)).join('')+\`<div class="row-add" onclick="openAddItem('bag','\${bag.id}')">+ Add item</div>\`});`;
const replacePackBody2 = `body:\`<div class="items-drag-container">\${items.map(i=>itemRow(i,true)).join('')}</div>\`+\`<div class="row-add" onclick="openAddItem('bag','\${bag.id}')">+ Add item</div>\`});`;
content = content.replace(targetPackBody2, replacePackBody2);

const targetPackBody3 = `body:items.map(i=>itemRow(i)).join('')+\`<div class="row-add" onclick="openAddItem('pur','\${pur.id}')">+ Add item</div>\`});`;
const replacePackBody3 = `body:\`<div class="items-drag-container">\${items.map(i=>itemRow(i)).join('')}</div>\`+\`<div class="row-add" onclick="openAddItem('pur','\${pur.id}')">+ Add item</div>\`});`;
content = content.replace(targetPackBody3, replacePackBody3);

// add initDrag calling logic for items
const targetRenderPack = `document.querySelectorAll('.card-menu-btn').forEach(btn=>{`;
const replaceRenderPack = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c));
  document.querySelectorAll('.card-menu-btn').forEach(btn=>{`;

content = content.replace(targetRenderPack, replaceRenderPack);

fs.writeFileSync('index.html', content);
console.log("Done");
