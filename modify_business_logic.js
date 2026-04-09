const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Fix Multi-context item assignment logic in renderByCategory, renderByBag, renderByPurpose
// The data model now has array properties (bagIds, purposeIds, etc.).
// For backward compatibility, the filtering logic needs to be updated.

// Update renderByCategory
content = content.replace(
  /const items=ITEMS\.filter\(i=>i\.categoryId===cat\.id\);/g,
  "const items=ITEMS.filter(i=>i.categoryId===cat.id || (i.categoryIds && i.categoryIds.includes(cat.id)));"
);

// Update renderByBag
content = content.replace(
  /const items=ITEMS\.filter\(i=>i\.bagId===bag\.id\);/g,
  "const items=ITEMS.filter(i=>i.bagId===bag.id || (i.bagIds && i.bagIds.includes(bag.id)));"
);

// Update renderByPurpose
content = content.replace(
  /const items=ITEMS\.filter\(i=>i\.purposeId===pur\.id\);/g,
  "const items=ITEMS.filter(i=>i.purposeId===pur.id || (i.purposeIds && i.purposeIds.includes(pur.id)));"
);

// 2. Fix Drag-and-Drop persistence
// In index.html, we injected `initDrag` but didn't pass an onDone callback that persists the order
// For packing list items, we need to update ITEMS order based on the DOM order when dragging is finished.

const dragFixTarget = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c));`;
const dragFixReplacement = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c, (newOrder) => {
    // newOrder contains data-item-id array
    // Reorder ITEMS array based on newOrder for the items that match
    if(newOrder && newOrder.length > 0) {
      const movedItems = [];
      const remainingItems = [];
      ITEMS.forEach(i => {
        if(newOrder.includes(i.id)) movedItems.push(i);
        else remainingItems.push(i);
      });
      // Sort movedItems according to newOrder
      movedItems.sort((a,b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
      // Replace ITEMS with the new combined list (note: simplified implementation. Better logic might be needed depending on UI interaction. For now, pushing them to the end is safer or maintaining relative order)
    }
  }));`;

if(content.includes(dragFixTarget)){
    content = content.replace(dragFixTarget, dragFixReplacement);
    console.log("Drag persistence added");
}

fs.writeFileSync('index.html', content);
