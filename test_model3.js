const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const scriptSearch = `//  EDIT ITEM`;
const jsToInsert = `
function openAddDayItem(dayId) {
  aiCtx = { type: 'dayitem', dayId };
  const day = days.find(d => d.id === dayId);
  document.getElementById('ai-title').textContent = 'Add item to Day ' + day.dayNum;
  document.getElementById('ai-sub').textContent = '';
  document.getElementById('ai-inp').value = '';
  document.getElementById('ai-carry-row').style.display = 'flex';
  document.getElementById('ai-carry').checked = false;
  openOv('ovAI');
  setTimeout(() => document.getElementById('ai-inp').focus(), 280);
}

function openAddRoutine(dayId) {
  aiCtx = { type: 'routine', dayId };
  document.getElementById('ai-title').textContent = 'Add Routine';
  document.getElementById('ai-sub').textContent = 'e.g. Morning skincare';
  document.getElementById('ai-inp').value = '';
  document.getElementById('ai-carry-row').style.display = 'none';
  document.getElementById('ai-carry').checked = false;
  openOv('ovAI');
  setTimeout(() => document.getElementById('ai-inp').focus(), 280);
}

const originalCommitItem = commitItem;
commitItem = function() {
  if (aiCtx && aiCtx.type === 'dayitem') {
    const nm = document.getElementById('ai-inp').value.trim();
    if (!nm) return;
    const carry = document.getElementById('ai-carry').checked;
    const newItem = mkItem(nm, '', '', '', carry);
    newItem.dayIds = [aiCtx.dayId];
    ITEMS.push(newItem);
    closeAll();
    Haptic.medium();
    renderAll();
  } else if (aiCtx && aiCtx.type === 'routine') {
    const nm = document.getElementById('ai-inp').value.trim().toLowerCase();
    if (!nm) return;
    let routineItems = [];
    if (nm.includes('morning') || nm.includes('skincare')) {
      routineItems = ['Cleanser', 'Moisturiser', 'SPF 50'];
    } else if (nm.includes('night') || nm.includes('evening')) {
      routineItems = ['Cleanser', 'Night cream', 'Sleepwear'];
    } else {
      routineItems = [document.getElementById('ai-inp').value.trim()];
    }

    routineItems.forEach(iName => {
      const newItem = mkItem(iName, '', '', '', false);
      newItem.dayIds = [aiCtx.dayId];
      ITEMS.push(newItem);
    });

    closeAll();
    Haptic.medium();
    renderAll();
  } else {
    originalCommitItem();
  }
};
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
