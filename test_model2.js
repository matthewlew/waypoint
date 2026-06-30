const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Insert new CSS class for chips in the Edit Item view
const cssSearch = `.sh-row .sh-inp{flex:1;margin-bottom:0}`;
html = html.replace(cssSearch, cssSearch + `\n.chk-chip{display:inline-flex;align-items:center;gap:6px;background:hsl(var(--secondary));padding:6px 10px;border-radius:20px;font-size:13px;color:hsl(var(--card-foreground));border:1px solid transparent;cursor:pointer;transition:border-color .15s;}\n.chk-chip input{accent-color:hsl(var(--primary));cursor:pointer;width:14px;height:14px;}`);

// Find itemRow function to make it clickable
const itemRowSearch = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}">`;
html = html.replace(itemRowSearch, `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}" onclick="openEditItem('\${item.id}')" style="cursor:pointer">`);

// Prevent checkbox click from opening the item row
const toggleItemSearch = `onclick="toggleItem('\${item.id}')"`;
html = html.replace(toggleItemSearch, `onclick="event.stopPropagation(); toggleItem('\${item.id}')"`);


const scriptSearch = `//  COMMIT ITEM`;
const jsToInsert = `
// ═══════════════════════════════════════
//  EDIT ITEM
// ═══════════════════════════════════════
let editingItemId = null;
function openEditItem(id){
  const item = ITEMS.find(i=>i.id===id);
  if(!item) return;
  editingItemId = id;

  document.getElementById('ei-name').value = item.name;
  document.getElementById('ei-carry').checked = item.carry;
  document.getElementById('ei-scenarios').value = item.scenarios ? item.scenarios.join(', ') : '';

  const buildChips = (list, selectedIds, prefix) => {
    return list.map(obj => {
      const isChecked = selectedIds.includes(obj.id);
      return \`<label class="chk-chip"><input type="checkbox" value="\${esc(obj.id)}" data-type="\${prefix}" \${isChecked?'checked':''}> \${esc(obj.name || 'Day '+obj.dayNum)}\</label>\`;
    }).join('');
  };

  document.getElementById('ei-days').innerHTML = buildChips(days, item.dayIds || [], 'day');
  document.getElementById('ei-cats').innerHTML = buildChips(CATS, item.categoryIds || [], 'cat');
  document.getElementById('ei-bags').innerHTML = buildChips(BAGS, item.bagIds || [], 'bag');
  document.getElementById('ei-purs').innerHTML = buildChips(PURPOSES, item.purposeIds || [], 'pur');

  openOv('ovEditItem');
}

function commitEditItem(){
  const item = ITEMS.find(i=>i.id===editingItemId);
  if(!item) return;

  const nm = document.getElementById('ei-name').value.trim();
  if(nm) item.name = nm;
  item.carry = document.getElementById('ei-carry').checked;

  const getChecked = (prefix) => {
    return Array.from(document.querySelectorAll(\`#ovEditItem input[data-type="\${prefix}"]:checked\`)).map(cb => cb.value);
  };

  item.dayIds = getChecked('day');
  item.categoryIds = getChecked('cat');
  item.bagIds = getChecked('bag');
  item.purposeIds = getChecked('pur');

  const scenStr = document.getElementById('ei-scenarios').value.trim();
  item.scenarios = scenStr ? scenStr.split(',').map(s=>s.trim()).filter(Boolean) : [];

  closeAll();
  Haptic.medium();
  renderAll();
}

function saveToCloset(){
  // Passive visual confirmation
  Haptic.success();
  const btn = document.querySelector('#ovEditItem .sh-cta:nth-of-type(2)');
  const origText = btn.innerText;
  btn.innerText = '✓ Saved to Closet';
  btn.style.backgroundColor = 'hsl(var(--grn))';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.innerText = origText;
    btn.style.backgroundColor = 'hsl(var(--secondary))';
    btn.style.color = 'hsl(var(--secondary-foreground))';
  }, 2000);
}
`;
html = html.replace(scriptSearch, jsToInsert + '\n' + scriptSearch);

fs.writeFileSync('index.html', html, 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    let script = scriptMatch[1];
    try {
        const vm = require('vm');
        new vm.Script(script);
        console.log("Compilation successful!");
    } catch (e) {
        console.error("Compilation error:");
        console.error(e);
    }
}
