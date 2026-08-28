const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldItemRowFunc = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}" onclick="openEditItem('\${item.id}')">
    <div class="cb\${ck?' on':''}" onclick="event.stopPropagation(); toggleItem('\${item.id}')"></div>
    <div class="item-txt\${ck?' done':''}">\${esc(item.name)}</div>
    \${item.carry?'<span class="carry-lbl">carry</span>':''}
    \${item.note?'<span class="item-note">'+esc(item.note)+'</span>':''}
    \${showBag&&(item.categoryIds&&item.categoryIds.length>0)?'<span class="from-lbl">'+esc(CATS.find(c=>c.id===item.categoryIds[0])?.name||'')+'</span>':''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>\`;
}`;

const newItemRowFunc = `function itemRow(item,showBag=false){
  const ck=item.checked;
  return\`<div class="list-row" data-item-id="\${item.id}" onclick="openEditItem('\${item.id}')">
    <div class="cb\${ck?' on':''}" onclick="event.stopPropagation(); toggleItem('\${item.id}')"></div>
    <div class="item-txt\${ck?' done':''}">\${esc(item.name)}</div>
    \${item.carry?'<span class="carry-lbl">carry</span>':''}
    \${item.note?'<span class="item-note">'+esc(item.note)+'</span>':''}
    \${showBag&&(item.categoryIds&&item.categoryIds.length>0)?'<span class="from-lbl">'+esc(CATS.find(c=>c.id===item.categoryIds[0])?.name||'')+'</span>':''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>\`;
}`;

html = html.replace(oldItemRowFunc, newItemRowFunc);

html = html.replace("else if(aiCtx.viewType==='bag'){if(aiCtx.groupId)bagId=aiCtx.groupId;}", "else if(aiCtx.viewType==='bag'){if(aiCtx.groupId)bagId=aiCtx.groupId;}");

fs.writeFileSync('index.html', html);
