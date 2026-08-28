const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const itemRowFunc = `function itemRow(item,showBag=false){
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

html = html.replace(/function itemRow\(item,showBag=false\)\{[\s\S]*?\n\}/, itemRowFunc);

html = html.replace('function renderByCategory(){', `function renderUnassignedItems(type) {
  const items = ITEMS.filter(i => {
    if (type === 'cat') return !i.categoryIds || i.categoryIds.length === 0;
    if (type === 'bag') return !i.bagIds || i.bagIds.length === 0;
    if (type === 'pur') return !i.purposeIds || i.purposeIds.length === 0;
    return false;
  });
  if (items.length === 0) return '';
  const done = items.filter(i => i.checked).length;
  const open = openCards.has('unassigned-'+type);
  const name = type === 'cat' ? 'Uncategorised' : type === 'bag' ? 'Unassigned location' : 'Unassigned purpose';

  return packCard({id:'unassigned-'+type,gid:'unassigned',name:name,sub:'',
    count:\`\${done}/\${items.length}\`,open,editType:'',
    body:items.map(i=>itemRow(i, type==='bag')).join('')+
      \`<div class="row-add" onclick="openAddItem('\${type}','')">+ Add item</div>\`
  });
}

function renderByCategory(){`);

html = html.replace(/h\+=packCard\(\{id:'cat-'\+cat\.id/g, `h+=packCard({id:'cat-'+cat.id`);
html = html.replace(/ordered\.forEach\(cat=>\{/g, `h+=renderUnassignedItems('cat');\n  ordered.forEach(cat=>{`);
html = html.replace(/ordered\.forEach\(bag=>\{/g, `h+=renderUnassignedItems('bag');\n  ordered.forEach(bag=>{`);
html = html.replace(/ordered\.forEach\(pur=>\{/g, `h+=renderUnassignedItems('pur');\n  ordered.forEach(pur=>{`);


fs.writeFileSync('index.html', html);
