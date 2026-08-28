const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="notes-head">notes<\/div>\n\s*<div class="notes-editor" id="ed-note-\${day.id}" contenteditable="true"\n\s*data-ph="Reminders, reservations, anything…"\n\s*spellcheck="false" autocapitalize="sentences"\n\s*>\${esc\(day.noteText\|\|''\)}<\/div>\n\s*<\/div>\n\s*<\/div>`;\n}/g;

html = html.replace(regex, `  <div class="notes-head">notes</div>
      <div class="notes-editor" id="ed-note-\${day.id}" contenteditable="true"
        data-ph="Reminders, reservations, anything…"
        spellcheck="false" autocapitalize="sentences"
      >\${esc(day.noteText||'')}</div>
      \${(()=>{
          const assignedItems = ITEMS.filter(i => i.dayIds && i.dayIds.includes(day.id));
          if (!assignedItems.length) return '';
          return \`<div class="notes-head" style="margin-top:12px;margin-bottom:6px">items assigned</div>
            <div style="margin-bottom:12px;line-height:2">
              \${assignedItems.map(i => \`<span class="odb-item\${i.carry ? ' carry' : ''}" onclick="openEditItem('\${i.id}')" style="cursor:pointer; display:inline-block; padding:2px 8px; margin:0 4px 4px 0; border:1px solid hsl(var(--border)); border-radius:12px; font-size:13px">\${esc(i.name)}</span>\`).join('')}
            </div>\`;
      })()}
    </div>
  </div>\`;
}`);

fs.writeFileSync('index.html', html);
