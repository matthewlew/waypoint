const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const editItemSheet = `
<!-- SHEET: Edit item (Multi-Context) -->
<div class="overlay" id="ovEditItem" onclick="if(event.target===this)closeAll()">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <div class="sheet-body">
      <div class="sheet-title">Edit Item</div>
      <input class="sh-inp" id="ei-name" placeholder="Item name..." autocomplete="off">
      <div class="carry-row">
        <input type="checkbox" id="ei-carry">
        <label for="ei-carry">Carry with me</label>
      </div>
      <input class="sh-inp" id="ei-note" placeholder="Note (optional)..." autocomplete="off" style="margin-bottom: 16px;">

      <div style="margin-bottom: 16px;">
        <span class="sh-lbl">Days</span>
        <div id="ei-days-wrap" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
      </div>

      <div style="margin-bottom: 16px;">
        <span class="sh-lbl">Bags</span>
        <div id="ei-bags-wrap" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
      </div>

      <div style="margin-bottom: 16px;">
        <span class="sh-lbl">Categories</span>
        <div id="ei-cats-wrap" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
      </div>

      <div style="margin-bottom: 16px;">
        <span class="sh-lbl">Purposes</span>
        <div id="ei-purs-wrap" style="display:flex; flex-wrap:wrap; gap:6px;"></div>
      </div>

      <button class="sh-cta" onclick="commitEditItem()">Save Changes</button>
      <button class="sh-cancel" onclick="closeAll()">Cancel</button>
    </div>
  </div>
</div>
`;

html = html.replace('<!-- SHEET: Edit group -->', editItemSheet + '\n<!-- SHEET: Edit group -->');

const jsPatch = `
let eiDraft = null;

function renderChips(containerId, items, selectedIds, toggleFnStr) {
  const c = document.getElementById(containerId);
  c.innerHTML = items.map(item => {
    const isSel = selectedIds.includes(item.id);
    return \`<div class="vpill \${isSel ? 'on' : ''}" onclick="\${toggleFnStr}('\${item.id}')">\${esc(item.name || 'Day '+item.dayNum)}</div>\`;
  }).join('');
}

function toggleEiDraftArray(arrName, id) {
  if (!eiDraft) return;
  if (eiDraft[arrName].includes(id)) {
    eiDraft[arrName] = eiDraft[arrName].filter(x => x !== id);
  } else {
    eiDraft[arrName].push(id);
  }
  reRenderEiChips();
}

function reRenderEiChips() {
  if (!eiDraft) return;
  renderChips('ei-days-wrap', days, eiDraft.dayIds, 'toggleEiDay');
  renderChips('ei-bags-wrap', BAGS, eiDraft.bagIds, 'toggleEiBag');
  renderChips('ei-cats-wrap', CATS, eiDraft.categoryIds, 'toggleEiCat');
  renderChips('ei-purs-wrap', PURPOSES, eiDraft.purposeIds, 'toggleEiPur');
}

function toggleEiDay(id) { toggleEiDraftArray('dayIds', id); }
function toggleEiBag(id) { toggleEiDraftArray('bagIds', id); }
function toggleEiCat(id) { toggleEiDraftArray('categoryIds', id); }
function toggleEiPur(id) { toggleEiDraftArray('purposeIds', id); }

function openEditItem(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item) return;
  eiDraft = {
    id: item.id,
    name: item.name,
    carry: item.carry,
    note: item.note || '',
    dayIds: [...(item.dayIds || [])],
    bagIds: [...(item.bagIds || [])],
    categoryIds: [...(item.categoryIds || [])],
    purposeIds: [...(item.purposeIds || [])]
  };

  document.getElementById('ei-name').value = eiDraft.name;
  document.getElementById('ei-carry').checked = eiDraft.carry;
  document.getElementById('ei-note').value = eiDraft.note;

  reRenderEiChips();

  openOv('ovEditItem');
}

function commitEditItem() {
  if (!eiDraft) return;
  const item = ITEMS.find(i => i.id === eiDraft.id);
  if (!item) return;

  item.name = document.getElementById('ei-name').value.trim() || item.name;
  item.carry = document.getElementById('ei-carry').checked;
  item.note = document.getElementById('ei-note').value.trim();
  item.dayIds = [...eiDraft.dayIds];
  item.bagIds = [...eiDraft.bagIds];
  item.categoryIds = [...eiDraft.categoryIds];
  item.purposeIds = [...eiDraft.purposeIds];

  closeAll();
  Haptic.medium();
  renderAll();

  if (typeof showToast === 'function') {
    showToast('Saved to Closet');
  }
}
`;

html = html.replace('function commitEdit(){', jsPatch + '\nfunction commitEdit(){');

html = html.replace(
  '<div class="item-txt${ck?\' done\':\'\'}">${esc(item.name)}</div>',
  '<div class="item-txt${ck?\' done\':\'\'}" onclick="openEditItem(\'${item.id}\')" style="cursor:pointer;">${esc(item.name)}</div>'
);

fs.writeFileSync('index.html', html);
console.log('Patched index.html');
