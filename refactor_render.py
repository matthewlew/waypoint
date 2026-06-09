import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace renderByCategory
old_renderByCategory = """function renderByCategory(){
  const ordered=catOrder.map(id=>CATS.find(c=>c.id===id)).filter(Boolean)
    .concat(CATS.filter(c=>!catOrder.includes(c.id)));
  let h=`<div class="pack-note">Items marked <strong>carry</strong> go in your bag or backpack, not checked luggage.</div>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(cat=>{
    const items=ITEMS.filter(i=>i.categoryId===cat.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('cat-'+cat.id);
    h+=packCard({id:'cat-'+cat.id,gid:cat.id,name:cat.name,sub:cat.desc||'',
      count:`${done}/${items.length}`,open,editType:'cat',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('cat','${cat.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('category')">+ Add category</button>`;
  return h;
}"""
new_renderByCategory = """function renderByCategory(){
  const ordered=catOrder.map(id=>CATS.find(c=>c.id===id)).filter(Boolean)
    .concat(CATS.filter(c=>!catOrder.includes(c.id)));
  let h=`<div class="pack-note">Items marked <strong>carry</strong> go in your bag or backpack, not checked luggage.</div>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(cat=>{
    const items=ITEMS.filter(i=>(i.categoryIds||[]).includes(cat.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('cat-'+cat.id);
    h+=packCard({id:'cat-'+cat.id,gid:cat.id,name:cat.name,sub:cat.desc||'',
      count:`${done}/${items.length}`,open,editType:'cat',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('cat','${cat.id}')">+ Add item</div>`});
  });
  const unassigned = ITEMS.filter(i => !(i.categoryIds && i.categoryIds.length > 0));
  if(unassigned.length > 0) {
    const done=unassigned.filter(i=>i.checked).length;
    const open=openCards.has('cat-unassigned');
    h+=packCard({id:'cat-unassigned',gid:'unassigned',name:'Uncategorized',sub:'No category assigned',
      count:`${done}/${unassigned.length}`,open,editType:'cat',
      body:unassigned.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('cat','unassigned')">+ Add item</div>`});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('category')">+ Add category</button>`;
  return h;
}"""
content = content.replace(old_renderByCategory, new_renderByCategory)

# Replace renderByBag
old_renderByBag = """function renderByBag(){
  const ordered=bagOrder.map(id=>BAGS.find(b=>b.id===id)).filter(Boolean)
    .concat(BAGS.filter(b=>!bagOrder.includes(b.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by where things physically live.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(bag=>{
    const items=ITEMS.filter(i=>i.bagId===bag.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('bag-'+bag.id);
    h+=packCard({id:'bag-'+bag.id,gid:bag.id,name:bag.name,sub:bag.desc,
      count:`${done}/${items.length}`,open,editType:'bag',
      body:items.map(i=>itemRow(i,true)).join('')+`<div class="row-add" onclick="openAddItem('bag','${bag.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('bag')">+ Add bag or location</button>`;
  return h;
}"""
new_renderByBag = """function renderByBag(){
  const ordered=bagOrder.map(id=>BAGS.find(b=>b.id===id)).filter(Boolean)
    .concat(BAGS.filter(b=>!bagOrder.includes(b.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by where things physically live.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(bag=>{
    const items=ITEMS.filter(i=>(i.bagIds||[]).includes(bag.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('bag-'+bag.id);
    h+=packCard({id:'bag-'+bag.id,gid:bag.id,name:bag.name,sub:bag.desc,
      count:`${done}/${items.length}`,open,editType:'bag',
      body:items.map(i=>itemRow(i,true)).join('')+`<div class="row-add" onclick="openAddItem('bag','${bag.id}')">+ Add item</div>`});
  });
  const unassigned = ITEMS.filter(i => !(i.bagIds && i.bagIds.length > 0));
  if(unassigned.length > 0) {
    const done=unassigned.filter(i=>i.checked).length;
    const open=openCards.has('bag-unassigned');
    h+=packCard({id:'bag-unassigned',gid:'unassigned',name:'Unassigned Bag',sub:'No bag assigned',
      count:`${done}/${unassigned.length}`,open,editType:'bag',
      body:unassigned.map(i=>itemRow(i,true)).join('')+`<div class="row-add" onclick="openAddItem('bag','unassigned')">+ Add item</div>`});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('bag')">+ Add bag or location</button>`;
  return h;
}"""
content = content.replace(old_renderByBag, new_renderByBag)

# Replace renderByPurpose
old_renderByPurpose = """function renderByPurpose(){
  const ordered=purposeOrder.map(id=>PURPOSES.find(p=>p.id===id)).filter(Boolean)
    .concat(PURPOSES.filter(p=>!purposeOrder.includes(p.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by trip function.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(pur=>{
    const items=ITEMS.filter(i=>i.purposeId===pur.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('pur-'+pur.id);
    h+=packCard({id:'pur-'+pur.id,gid:pur.id,name:pur.name,sub:'',
      count:`${done}/${items.length}`,open,editType:'purpose',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('pur','${pur.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('purpose')">+ Add group</button>`;
  return h;
}"""
new_renderByPurpose = """function renderByPurpose(){
  const ordered=purposeOrder.map(id=>PURPOSES.find(p=>p.id===id)).filter(Boolean)
    .concat(PURPOSES.filter(p=>!purposeOrder.includes(p.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by trip function.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(pur=>{
    const items=ITEMS.filter(i=>(i.purposeIds||[]).includes(pur.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('pur-'+pur.id);
    h+=packCard({id:'pur-'+pur.id,gid:pur.id,name:pur.name,sub:'',
      count:`${done}/${items.length}`,open,editType:'purpose',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('pur','${pur.id}')">+ Add item</div>`});
  });
  const unassigned = ITEMS.filter(i => !(i.purposeIds && i.purposeIds.length > 0));
  if(unassigned.length > 0) {
    const done=unassigned.filter(i=>i.checked).length;
    const open=openCards.has('pur-unassigned');
    h+=packCard({id:'pur-unassigned',gid:'unassigned',name:'Unassigned Purpose',sub:'No purpose assigned',
      count:`${done}/${unassigned.length}`,open,editType:'purpose',
      body:unassigned.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('pur','unassigned')">+ Add item</div>`});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('purpose')">+ Add group</button>`;
  return h;
}"""
content = content.replace(old_renderByPurpose, new_renderByPurpose)

with open('index.html', 'w') as f:
    f.write(content)
