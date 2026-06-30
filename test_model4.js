const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add drag handle to itemRow
const itemRowSearch = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}" onclick="openEditItem('\${item.id}')" style="cursor:pointer">
    <div class="cb\${ck?' on':''}" onclick="event.stopPropagation(); toggleItem('\${item.id}')"></div>`;
const itemRowReplace = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row drag-item" data-item-id="\${item.id}" onclick="openEditItem('\${item.id}')" style="cursor:pointer">
    <span class="drag-handle-item" style="color:hsl(var(--muted-foreground));cursor:grab;padding:0 8px;font-size:16px;" onclick="event.stopPropagation()">⠿</span>
    <div class="cb\${ck?' on':''}" onclick="event.stopPropagation(); toggleItem('\${item.id}')"></div>`;
html = html.replace(itemRowSearch, itemRowReplace);


// 2. Add drag and drop global handlers
const scriptSearch = `// ═══════════════════════════════════════
//  BUILD DAYS`;
const dndCode = `// ═══════════════════════════════════════
//  ITEM DRAG AND DROP
// ═══════════════════════════════════════
let draggedItemId = null;
let dragGhost = null;

document.addEventListener('pointerdown', e => {
  const handle = e.target.closest('.drag-handle-item');
  if (!handle) return;
  const row = handle.closest('.list-row');
  if (!row) return;
  e.preventDefault();

  draggedItemId = row.dataset.itemId;
  row.classList.add('dragging');

  dragGhost = row.cloneNode(true);
  dragGhost.style.position = 'fixed';
  dragGhost.style.pointerEvents = 'none';
  dragGhost.style.opacity = '0.8';
  dragGhost.style.zIndex = '1000';
  dragGhost.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  dragGhost.style.background = 'hsl(var(--card))';
  dragGhost.style.width = row.offsetWidth + 'px';
  document.body.appendChild(dragGhost);

  updateGhostPosition(e);
  handle.setPointerCapture(e.pointerId);
  Haptic.light();
});

document.addEventListener('pointermove', e => {
  if (!draggedItemId) return;
  updateGhostPosition(e);

  // Highlight potential drop targets
  document.querySelectorAll('.card').forEach(c => c.classList.remove('card-drag-over'));

  const target = document.elementFromPoint(e.clientX, e.clientY);
  const card = target ? target.closest('.card') : null;

  if (card && (card.id.startsWith('card-d') || card.id.startsWith('crd-bag-'))) {
    card.classList.add('card-drag-over');
  }
});

document.addEventListener('pointerup', e => {
  if (!draggedItemId) return;

  const target = document.elementFromPoint(e.clientX, e.clientY);
  const card = target ? target.closest('.card') : null;

  if (card) {
    const item = ITEMS.find(i => i.id === draggedItemId);
    if (item) {
      if (card.id.startsWith('card-d')) {
        // Drop on Day card
        const dayId = card.id.replace('card-', '');
        if (!item.dayIds) item.dayIds = [];
        if (!item.dayIds.includes(dayId)) {
          item.dayIds.push(dayId);
          Haptic.success();
          renderAll();
        }
      } else if (card.id.startsWith('crd-bag-')) {
        // Drop on Bag card
        const bagId = card.dataset.id.replace('bag-', '');
        if (!item.bagIds) item.bagIds = [];
        if (!item.bagIds.includes(bagId)) {
          item.bagIds.push(bagId);
          Haptic.success();
          renderAll();
        }
      }
    }
  }

  document.querySelectorAll('.card').forEach(c => c.classList.remove('card-drag-over'));
  document.querySelectorAll('.list-row').forEach(r => r.classList.remove('dragging'));
  if (dragGhost) dragGhost.remove();

  draggedItemId = null;
  dragGhost = null;
});

function updateGhostPosition(e) {
  if (dragGhost) {
    dragGhost.style.left = e.clientX - 20 + 'px';
    dragGhost.style.top = e.clientY - 20 + 'px';
  }
}
`;
html = html.replace(scriptSearch, dndCode + '\n' + scriptSearch);


// 3. Render weather banners explicitly
const weatherSearch = `if(/mammoth|tahoe|aspen|vail|park city/.test(d0))
      h+= \`<div class="banner info"><strong>\${esc(T.destinations[0].name)}:</strong> Expect 15–30°F. Pack base layers, waterproof outer, gloves.</div>\`;
    else if(/hawaii|cancun|miami|bali|tulum/.test(d0))
      h+= \`<div class="banner info"><strong>\${esc(T.destinations[0].name)}:</strong> Hot and humid. Light fabrics, SPF, one light layer for A/C.</div>\`;
    else if(/london|paris|amsterdam|edinburgh/.test(d0))
      h+= \`<div class="banner info"><strong>\${esc(T.destinations[0].name)}:</strong> Variable weather — layers and a compact rain jacket.</div>\`;`;

const weatherReplace = `if(/mammoth|tahoe|aspen|vail|park city/.test(d0))
      h+= \`<div class="banner info">☁️ <strong>\${esc(T.destinations[0].name)}:</strong> Expect 15–30°F. Suggestion: Layering for cold mornings, waterproof outer, gloves.</div>\`;
    else if(/hawaii|cancun|miami|bali|tulum/.test(d0))
      h+= \`<div class="banner info">☀️ <strong>\${esc(T.destinations[0].name)}:</strong> Hot and humid (85°F). Suggestion: Swimsuit for hot tubs, light fabrics, SPF.</div>\`;
    else if(/london|paris|amsterdam|edinburgh/.test(d0))
      h+= \`<div class="banner info">🌧️ <strong>\${esc(T.destinations[0].name)}:</strong> Variable weather (55°F). Suggestion: Layers and a compact rain jacket.</div>\`;`;

html = html.replace(weatherSearch, weatherReplace);

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
