const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const target = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c, (newOrder) => {
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

const replace = `document.querySelectorAll('.items-drag-container').forEach(c=>initDrag(c, (newOrder) => {
    if(newOrder && newOrder.length > 0) {
      const oldIndices = [];
      const movedItems = [];
      ITEMS.forEach((item, index) => {
        if (newOrder.includes(item.id)) {
            oldIndices.push(index);
            movedItems.push(item);
        }
      });

      movedItems.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));

      for(let i=0; i<oldIndices.length; i++){
          ITEMS[oldIndices[i]] = movedItems[i];
      }
    }
  }));`;

if (content.includes(target)) {
    content = content.replace(target, replace);
    console.log("Improved drag persistence");
}

fs.writeFileSync('index.html', content);
