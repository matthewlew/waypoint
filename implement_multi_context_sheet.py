import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Add the overlay HTML
overlay_html = """
<!-- SHEET: Edit Item Contexts -->
<div class="overlay" id="ovEditItem" onclick="if(event.target===this)closeAll()">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <div class="sheet-body">
      <div class="sheet-title">Edit Item</div>
      <div class="sheet-sub" id="ei-sub"></div>

      <span class="sh-lbl">Days</span>
      <div class="ei-grid" id="ei-days"></div>

      <span class="sh-lbl">Bags / Locations</span>
      <div class="ei-grid" id="ei-bags"></div>

      <span class="sh-lbl">Categories</span>
      <div class="ei-grid" id="ei-cats"></div>

      <span class="sh-lbl">Purposes</span>
      <div class="ei-grid" id="ei-purposes"></div>

      <button class="sh-cta" onclick="commitEditItem()" style="margin-top:16px">Save assignments</button>
      <button class="sh-cancel" onclick="closeAll()">Cancel</button>
    </div>
  </div>
</div>
"""

# Let's add some basic CSS for the grid in the stylesheet
css_append = """
.ei-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.ei-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: hsl(var(--card)); border: 1px solid hsl(var(--border));
  border-radius: var(--rs); padding: 6px 10px; font-size: 13px;
  color: hsl(var(--card-foreground)); cursor: pointer; user-select: none;
}
.ei-chip.on {
  background: hsl(var(--foreground)); border-color: hsl(var(--foreground)); color: #fff;
}
"""

content = content.replace('</style>', css_append + '</style>')
content = content.replace('<!-- SHEET: Add group -->', overlay_html + '\n<!-- SHEET: Add group -->')

# 2. Add JavaScript functions

js_functions = """
let eiCtx = null;

function toggleEiChip(el) {
  el.classList.toggle('on');
  Haptic.light();
}

function openEditItem(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item) return;
  eiCtx = item;

  document.getElementById('ei-sub').textContent = item.name;

  // Render Days
  document.getElementById('ei-days').innerHTML = days.map(d =>
    `<div class="ei-chip${item.dayIds.includes(d.id) ? ' on' : ''}" data-val="${d.id}" onclick="toggleEiChip(this)">Day ${d.dayNum}</div>`
  ).join('');

  // Render Bags
  document.getElementById('ei-bags').innerHTML = BAGS.map(b =>
    `<div class="ei-chip${item.bagIds.includes(b.id) ? ' on' : ''}" data-val="${b.id}" onclick="toggleEiChip(this)">${esc(b.name)}</div>`
  ).join('');

  // Render Categories
  document.getElementById('ei-cats').innerHTML = CATS.map(c =>
    `<div class="ei-chip${item.categoryIds.includes(c.id) ? ' on' : ''}" data-val="${c.id}" onclick="toggleEiChip(this)">${esc(c.name)}</div>`
  ).join('');

  // Render Purposes
  document.getElementById('ei-purposes').innerHTML = PURPOSES.map(p =>
    `<div class="ei-chip${item.purposeIds.includes(p.id) ? ' on' : ''}" data-val="${p.id}" onclick="toggleEiChip(this)">${esc(p.name)}</div>`
  ).join('');

  openOv('ovEditItem');
}

function commitEditItem() {
  if (!eiCtx) return;
  const item = eiCtx;

  item.dayIds = [...document.querySelectorAll('#ei-days .ei-chip.on')].map(el => el.dataset.val);
  item.bagIds = [...document.querySelectorAll('#ei-bags .ei-chip.on')].map(el => el.dataset.val);
  item.categoryIds = [...document.querySelectorAll('#ei-cats .ei-chip.on')].map(el => el.dataset.val);
  item.purposeIds = [...document.querySelectorAll('#ei-purposes .ei-chip.on')].map(el => el.dataset.val);

  closeAll();
  Haptic.medium();
  renderPack();
  renderDays();
}
"""

content = content.replace('function openEditTrip(){', js_functions + '\nfunction openEditTrip(){')

# 3. Update itemRow() to open the edit sheet
# <div class="item-txt${ck?' done':''}">${esc(item.name)}</div> -> make it clickable
new_itemRow = """function itemRow(item,showBag=false){
  const ck=item.checked;
  // Use first category for the from-lbl for now
  const mainCatId = item.categoryIds && item.categoryIds.length > 0 ? item.categoryIds[0] : null;
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}')"></div>
    <div class="item-txt${ck?' done':''}" onclick="openEditItem('${item.id}')" style="cursor:pointer" title="Edit assignments">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl">carry</span>`:''}
    ${item.note?`<span class="item-note">${esc(item.note)}</span>`:''}
    ${showBag&&mainCatId?`<span class="from-lbl">${esc(CATS.find(c=>c.id===mainCatId)?.name||'')}</span>`:''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>`;
}"""

content = re.sub(r'function itemRow\(item,showBag=false\)\{[\s\S]*?</div>`;\n\}', new_itemRow, content)

with open('index.html', 'w') as f:
    f.write(content)
