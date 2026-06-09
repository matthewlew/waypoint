import re

with open('index.html', 'r') as f:
    content = f.read()

ov_edit_item_html = """
<!-- OVERLAY: Edit Item (Multi-context) -->
<div class="overlay" id="ovEditItem">
  <div class="sheet">
    <div class="sheet-hd">
      <div class="sheet-title" id="edit-item-title">Edit Item</div>
      <button class="icon-btn" onclick="closeAll()">×</button>
    </div>
    <div class="sheet-body">
      <label class="sf-lbl">Name</label>
      <input class="sf-inp" id="ei-name" autocomplete="off">
      <div style="display:flex;align-items:center;margin:16px 0;">
        <input type="checkbox" id="ei-carry" style="width:20px;height:20px;margin-right:10px;">
        <label for="ei-carry" style="font-size:15px">Carry-on only</label>
      </div>
      <label class="sf-lbl">Note</label>
      <input class="sf-inp" id="ei-note" placeholder="Optional note" autocomplete="off">

      <div class="sf-lbl" style="margin-top:24px;border-bottom:1px solid hsl(var(--border));padding-bottom:8px">Assign to Days</div>
      <div id="ei-days-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px"></div>

      <div class="sf-lbl" style="margin-top:24px;border-bottom:1px solid hsl(var(--border));padding-bottom:8px">Assign to Bags</div>
      <div id="ei-bags-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px"></div>

      <div class="sf-lbl" style="margin-top:24px;border-bottom:1px solid hsl(var(--border));padding-bottom:8px">Assign to Categories</div>
      <div id="ei-cats-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px"></div>

      <div class="sf-lbl" style="margin-top:24px;border-bottom:1px solid hsl(var(--border));padding-bottom:8px">Assign to Purposes</div>
      <div id="ei-purs-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px"></div>
    </div>
    <div class="sheet-ft">
      <button class="btn w-full danger" style="margin-bottom:8px" onclick="deleteEditItem()">Delete Item</button>
      <button class="btn w-full" onclick="commitEditItem()">Save Item</button>
    </div>
  </div>
</div>
"""

content = content.replace('<!-- OVERLAYS -->', '<!-- OVERLAYS -->\n' + ov_edit_item_html)

js_funcs = """
let editingItemId = null;
let editItemDraft = null;

function openEditItem(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item) return;
  editingItemId = itemId;
  // Create a deep copy for the draft
  editItemDraft = JSON.parse(JSON.stringify(item));

  document.getElementById('ei-name').value = item.name;
  document.getElementById('ei-carry').checked = item.carry;
  document.getElementById('ei-note').value = item.note || '';

  // Days
  let daysHtml = days.map(d => {
    const isChecked = editItemDraft.dayIds?.includes(d.id) ? 'checked' : '';
    return `<label style="display:flex;align-items:center"><input type="checkbox" value="${d.id}" ${isChecked} onchange="toggleDraftArr('dayIds', '${d.id}', this.checked)" style="margin-right:8px;width:16px;height:16px"> Day ${d.dayNum} - ${T.destinations[d.destIdx]?.name}</label>`;
  }).join('');
  document.getElementById('ei-days-list').innerHTML = daysHtml || '<div style="color:hsl(var(--muted-foreground));font-size:14px">No days added yet.</div>';

  // Bags
  let bagsHtml = BAGS.map(b => {
    const isChecked = editItemDraft.bagIds?.includes(b.id) ? 'checked' : '';
    return `<label style="display:flex;align-items:center"><input type="checkbox" value="${b.id}" ${isChecked} onchange="toggleDraftArr('bagIds', '${b.id}', this.checked)" style="margin-right:8px;width:16px;height:16px"> ${b.name}</label>`;
  }).join('');
  document.getElementById('ei-bags-list').innerHTML = bagsHtml;

  // Categories
  let catsHtml = CATS.map(c => {
    const isChecked = editItemDraft.categoryIds?.includes(c.id) ? 'checked' : '';
    return `<label style="display:flex;align-items:center"><input type="checkbox" value="${c.id}" ${isChecked} onchange="toggleDraftArr('categoryIds', '${c.id}', this.checked)" style="margin-right:8px;width:16px;height:16px"> ${c.name}</label>`;
  }).join('');
  document.getElementById('ei-cats-list').innerHTML = catsHtml;

  // Purposes
  let pursHtml = PURPOSES.map(p => {
    const isChecked = editItemDraft.purposeIds?.includes(p.id) ? 'checked' : '';
    return `<label style="display:flex;align-items:center"><input type="checkbox" value="${p.id}" ${isChecked} onchange="toggleDraftArr('purposeIds', '${p.id}', this.checked)" style="margin-right:8px;width:16px;height:16px"> ${p.name}</label>`;
  }).join('');
  document.getElementById('ei-purs-list').innerHTML = pursHtml;

  openOv('ovEditItem');
}

function toggleDraftArr(arrName, val, isChecked) {
  if (!editItemDraft[arrName]) editItemDraft[arrName] = [];
  if (isChecked) {
    if (!editItemDraft[arrName].includes(val)) editItemDraft[arrName].push(val);
  } else {
    editItemDraft[arrName] = editItemDraft[arrName].filter(x => x !== val);
  }
}

function commitEditItem() {
  const item = ITEMS.find(i => i.id === editingItemId);
  if (!item) return;
  item.name = document.getElementById('ei-name').value.trim() || item.name;
  item.carry = document.getElementById('ei-carry').checked;
  item.note = document.getElementById('ei-note').value.trim();
  item.dayIds = [...(editItemDraft.dayIds || [])];
  item.bagIds = [...(editItemDraft.bagIds || [])];
  item.categoryIds = [...(editItemDraft.categoryIds || [])];
  item.purposeIds = [...(editItemDraft.purposeIds || [])];

  closeAll();
  Haptic.medium();
  renderPack();
  renderDays();
}

function deleteEditItem() {
  ITEMS = ITEMS.filter(i => i.id !== editingItemId);
  closeAll();
  Haptic.medium();
  renderPack();
  renderDays();
}
"""

content = content.replace('//  COMMIT ITEM', '//  COMMIT ITEM\n' + js_funcs)

# Update commitItem
old_commitItem = """function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catId='health',bagId='main',purId='toiletry';
    if(aiCtx.viewType==='cat'){catId=aiCtx.groupId;purId=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech';}
    else if(aiCtx.viewType==='bag'){bagId=aiCtx.groupId;}
    else{purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
    closeAll();Haptic.medium();renderPack();
  }
}"""
new_commitItem = """function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catIds=[],bagIds=[],purIds=[],dayIds=[];
    if(aiCtx.viewType==='cat'){catIds=[aiCtx.groupId];purIds=[CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech'];}
    else if(aiCtx.viewType==='bag'){bagIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='day'){dayIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='pur'){purIds=[aiCtx.groupId];}
    let itm = mkItem(nm,catIds,bagIds,purIds,carry);
    itm.dayIds = dayIds;
    ITEMS.push(itm);
    closeAll();Haptic.medium();renderPack();renderDays();
  }
}"""

content = content.replace(old_commitItem, new_commitItem)

# Update itemRow to make it editable
old_itemRow = """function itemRow(item,showBag=false){
  const ck=item.checked;
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}')"></div>
    <div class="item-txt${ck?' done':''}">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl">carry</span>`:''}
    ${item.note?`<span class="item-note">${esc(item.note)}</span>`:''}
    ${showBag&&item.categoryId?`<span class="from-lbl">${esc(CATS.find(c=>c.id===item.categoryId)?.name||'')}</span>`:''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>`;
}"""

new_itemRow = """function itemRow(item,showBag=false){
  const ck=item.checked;
  // Find first assigned category name if we want to show it
  const catName = item.categoryIds && item.categoryIds.length ? CATS.find(c=>c.id===item.categoryIds[0])?.name : '';
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}'); event.stopPropagation();"></div>
    <div class="item-txt${ck?' done':''}" onclick="openEditItem('${item.id}')" style="cursor:pointer">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl" onclick="openEditItem('${item.id}')" style="cursor:pointer">carry</span>`:''}
    ${item.note?`<span class="item-note" onclick="openEditItem('${item.id}')" style="cursor:pointer">${esc(item.note)}</span>`:''}
    ${showBag&&catName?`<span class="from-lbl" onclick="openEditItem('${item.id}')" style="cursor:pointer">${esc(catName)}</span>`:''}
    <div class="synced-dot" title="Synced across all views" onclick="openEditItem('${item.id}')" style="cursor:pointer"></div>
  </div>`;
}"""
content = content.replace(old_itemRow, new_itemRow)

with open('index.html', 'w') as f:
    f.write(content)
