const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update buildDayCard to show packed items
const dayCardSearch = `
    <div class="card-body\${isOpen?' open':''}" id="body-\${day.id}">
      <div class="slot-head">day</div>`;
const dayCardReplace = `
    <div class="card-body\${isOpen?' open':''}" id="body-\${day.id}">
      <div class="slot-head">packed items</div>
      <div style="margin-bottom:12px;">
        \${(() => {
          const dayItems = ITEMS.filter(i => (i.dayIds||[]).includes(day.id));
          return dayItems.map(i => \`<span class="odb-item\${i.carry?' carry':''}" onclick="openEditItem('\${i.id}')" style="cursor:pointer">\${esc(i.name)}</span>\`).join(' ');
        })()}
        <span class="odb-add" onclick="openAddItem('day','\${day.id}')">+ item</span>
      </div>
      <div class="slot-head">day</div>`;

html = html.replace(dayCardSearch, dayCardReplace);
fs.writeFileSync('index.html', html);
console.log('Patched day assignment rendering.');
