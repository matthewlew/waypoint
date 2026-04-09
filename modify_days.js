const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Render days needs to actually show items directly attached to the day.
const targetBodyDay = `<div class="card-body\${isOpen?' open':''}" id="body-\${day.id}">`;
const replaceBodyDay = `<div class="card-body\${isOpen?' open':''}" id="body-\${day.id}">
      \${ITEMS.filter(i=>i.dayIds && i.dayIds.includes(day.id)).map(i=>\`<div class="list-row"><div class="cb\${i.checked?' on':''}" onclick="toggleItem('\${i.id}')"></div><div class="item-txt\${i.checked?' done':''} \${i.carry?' carry':''}">\${esc(i.name)}</div></div>\`).join('')}`;

if(content.includes(targetBodyDay)){
    content = content.replace(targetBodyDay, replaceBodyDay);
    console.log("Day cards now show items assigned directly to them");
}

fs.writeFileSync('index.html', content);
