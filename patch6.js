const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const jsCode = `
let draftItem = null;
function openEditItem(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item) return;

  draftItem = JSON.parse(JSON.stringify(item));
  if (!draftItem.categoryIds) draftItem.categoryIds = [];
  if (!draftItem.bagIds) draftItem.bagIds = [];
  if (!draftItem.purposeIds) draftItem.purposeIds = [];
  if (!draftItem.dayIds) draftItem.dayIds = [];

  document.getElementById('ei-name').value = draftItem.name;
  document.getElementById('ei-carry').checked = draftItem.carry;
  document.getElementById('ei-note').value = draftItem.note || '';

  renderItemChips();

  openOv('ovEditItem');
  setTimeout(() => document.getElementById('ei-name').focus(), 280);
}

function renderItemChips() {
  const dc = document.getElementById('ei-days');
  dc.innerHTML = days.map(d => {
    const act = draftItem.dayIds.includes(d.id) ? ' active' : '';
    return \`<div class="ei-chip\${act}" onclick="toggleDraftId('dayIds', '\${d.id}')">Day \${d.dayNum}</div>\`;
  }).join('');

  const bc = document.getElementById('ei-bags');
  bc.innerHTML = BAGS.map(b => {
    const act = draftItem.bagIds.includes(b.id) ? ' active' : '';
    return \`<div class="ei-chip\${act}" onclick="toggleDraftId('bagIds', '\${b.id}')">\${esc(b.name)}</div>\`;
  }).join('');

  const cc = document.getElementById('ei-cats');
  cc.innerHTML = CATS.map(c => {
    const act = draftItem.categoryIds.includes(c.id) ? ' active' : '';
    return \`<div class="ei-chip\${act}" onclick="toggleDraftId('categoryIds', '\${c.id}')">\${esc(c.name)}</div>\`;
  }).join('');

  const pc = document.getElementById('ei-purs');
  pc.innerHTML = PURPOSES.map(p => {
    const act = draftItem.purposeIds.includes(p.id) ? ' active' : '';
    return \`<div class="ei-chip\${act}" onclick="toggleDraftId('purposeIds', '\${p.id}')">\${esc(p.name)}</div>\`;
  }).join('');
}

function toggleDraftId(arrayName, id) {
  if (!draftItem[arrayName]) draftItem[arrayName] = [];
  const idx = draftItem[arrayName].indexOf(id);
  if (idx > -1) {
    draftItem[arrayName].splice(idx, 1);
  } else {
    draftItem[arrayName].push(id);
  }
  Haptic.light();
  renderItemChips();
}

function commitEditItem() {
  if (!draftItem) return;
  const name = document.getElementById('ei-name').value.trim();
  if (!name) return;

  const idx = ITEMS.findIndex(i => i.id === draftItem.id);
  if (idx > -1) {
    ITEMS[idx] = {
      ...ITEMS[idx],
      name,
      carry: document.getElementById('ei-carry').checked,
      note: document.getElementById('ei-note').value.trim(),
      categoryIds: [...draftItem.categoryIds],
      bagIds: [...draftItem.bagIds],
      purposeIds: [...draftItem.purposeIds],
      dayIds: [...draftItem.dayIds]
    };
  }

  closeAll();
  Haptic.medium();
  renderAll();
}
`;

html = html.replace('// ═══════════════════════════════════════\n//  UTILITIES', jsCode + '\n// ═══════════════════════════════════════\n//  UTILITIES');

// Replace openAddItem call parameter in renderUnassignedItems
html = html.replace(/openAddItem\('\${type}',''\)/g, `openAddItem(type==='cat'?'cat':type==='bag'?'bag':'pur','')`);

// Fix commitItem for multiple context assignment
const newCommitItem = `function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catId='',bagId='',purId='';
    if(aiCtx.viewType==='cat'){
        if(aiCtx.groupId) {
            catId=aiCtx.groupId;
            const c=CATS.find(c=>c.id===aiCtx.groupId);
            if(c) purId=c.type==='toi'?'toiletry':'tech';
        }
    }
    else if(aiCtx.viewType==='bag'){if(aiCtx.groupId)bagId=aiCtx.groupId;}
    else{if(aiCtx.groupId)purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
    closeAll();Haptic.medium();renderPack();
  }
}`;

html = html.replace(/function commitItem\(\)\{[\s\S]*?\}\n/g, newCommitItem + '\n');


fs.writeFileSync('index.html', html);
