const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetDrag = `const rows=()=>[...container.querySelectorAll(':scope>.dest-row,:scope>.et-dest-row,:scope>.card')];`;
const replaceDrag = `const rows=()=>[...container.querySelectorAll(':scope>.dest-row,:scope>.et-dest-row,:scope>.card,:scope>.list-row')];`;

if (content.includes(targetDrag)) {
    content = content.replace(targetDrag, replaceDrag);
    console.log("initDrag replaced");
}

// Modify itemRow to include a drag handle if it doesn't already
const targetItemRow = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}">`;

const replaceItemRow = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}">
    <span class="drag-handle" style="padding:0 6px 0 0;font-size:14px">⠿</span>`;

if (content.includes(targetItemRow)) {
    content = content.replace(targetItemRow, replaceItemRow);
    console.log("itemRow replaced");
}

fs.writeFileSync('index.html', content);
