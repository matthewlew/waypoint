const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// I also need to ensure that the initial drag code inside renderPack is actually attached correctly
const targetDragCheck = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c, (newOrder) => {`;
if (content.includes(targetDragCheck)) {
    console.log("Drag logic is present in renderPack");
} else {
    console.log("Drag logic MISSING");
}
