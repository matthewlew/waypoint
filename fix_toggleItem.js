const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The re-rendering of Days doesn't automatically happen when toggling items inside a day since they weren't natively there.
// Need to add logic to `toggleItem` to toggle the class `.cb.on` for day item rows as well.
const targetToggleItem = `document.querySelectorAll(\`[data-item-id="\${itemId}"]\`).forEach(row=>{
    row.querySelector('.cb')?.classList.toggle('on',item.checked);
    row.querySelector('.item-txt')?.classList.toggle('done',item.checked);
  });`;

const replaceToggleItem = `document.querySelectorAll(\`[data-item-id="\${itemId}"]\`).forEach(row=>{
    row.querySelector('.cb')?.classList.toggle('on',item.checked);
    row.querySelector('.item-txt')?.classList.toggle('done',item.checked);
  });
  // Also toggle for day cards since they might not use data-item-id (they didn't in my string replacement)
  renderDays();`;

if (content.includes(targetToggleItem)) {
    content = content.replace(targetToggleItem, replaceToggleItem);
    console.log("toggleItem updated to refresh days");
}

fs.writeFileSync('index.html', content);
