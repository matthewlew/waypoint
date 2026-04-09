const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Also update `initDrag` to actually extract the correct `data-item-id` if dragging a list-row.
// By default it was doing `dataset.id`. `list-row` has `data-item-id`.
const targetDrag = `if(onDone)onDone(rows().map(r=>r.dataset.id).filter(Boolean));`;
const replaceDrag = `if(onDone)onDone(rows().map(r=>r.dataset.id || r.dataset.itemId).filter(Boolean));`;

if (content.includes(targetDrag)) {
    content = content.replace(targetDrag, replaceDrag);
    console.log("initDrag data id extraction fixed");
}

fs.writeFileSync('index.html', content);
