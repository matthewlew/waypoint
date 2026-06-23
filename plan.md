### Plan for Implementing Yvette-Oriented Feature Development

**1. Data Model Refactoring (Multi-Context Item Assignment & Day-First Architecture)**
* Use `replace_with_git_merge_diff` on `index.html` to modify `mkItem` to use arrays instead of single strings:
```javascript
<<<<<<< SEARCH
function mkItem(name,catId,bagId,purId,carry=false,note='',auto=false){
  return{id:'item-'+(itemIdSeq++),name,categoryId:catId,bagId,purposeId:purId,
    carry,checked:false,auto,note};
}
=======
function mkItem(name,categoryIds=[],bagIds=[],purposeIds=[],dayIds=[],scenarios=[],carry=false,note='',auto=false){
  return{id:'item-'+(itemIdSeq++),name,categoryIds,bagIds,purposeIds,dayIds,scenarios,carry,checked:false,auto,note};
}
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` on `index.html` to update `initItems` function to pass arrays:
```javascript
<<<<<<< SEARCH
function initItems(){
  ITEMS=[];
  const toi=[
    {cat:'skincare',items:[['Cleanser','purse',false],['Moisturiser','purse',true],['SPF 50','main',false],['Face mist','purse',true]]},
    {cat:'hair',    items:[['Shampoo','main',false],['Conditioner','main',false],['Dry shampoo','purse',true],['Hair tools','main',false]]},
    {cat:'body',    items:[['Body wash','main',false],['Deodorant','main',false],['Razor','main',false],['Body lotion','purse',true]]},
    {cat:'makeup',  items:[['Foundation','main',false],['Mascara','main',false],['Lip product','purse',true],['Eyeshadow palette','main',false],['Makeup brushes','main',false],['Makeup remover','main',false]]},
    {cat:'health',  items:[['Prescription meds','purse',true],['Pain relief','purse',true],['Plasters','main',false],['Hand sanitiser','purse',true]]},
  ];
  toi.forEach(({cat,items})=>items.forEach(([n,b,c])=>ITEMS.push(mkItem(n,cat,b,'toiletry',c,'',true))));
  [['Instant noodles','trunk',false,''],['Snacks','backseat',false,'For the car'],
   ['Tupperware','trunk',false,'To eat with'],['Utensils','trunk',false,''],
   ['Reusable water bottles','backseat',false,'']
  ].forEach(([n,b,c,note])=>ITEMS.push(mkItem(n,'food',b,'food',c,note,true)));
  [['Passport / ID','purse',true],['Phone + charger','backpack',false],
   ['Power bank','purse',true],['Laptop + charger','backpack',false],
   ['Universal adapter','backpack',false],['Earbuds','backpack',false]
  ].forEach(([n,b,c])=>ITEMS.push(mkItem(n,'tech',b,'tech',c,'',true)));
}
=======
function initItems(){
  ITEMS=[];
  const toi=[
    {cat:'skincare',items:[['Cleanser','purse',false],['Moisturiser','purse',true],['SPF 50','main',false],['Face mist','purse',true]]},
    {cat:'hair',    items:[['Shampoo','main',false],['Conditioner','main',false],['Dry shampoo','purse',true],['Hair tools','main',false]]},
    {cat:'body',    items:[['Body wash','main',false],['Deodorant','main',false],['Razor','main',false],['Body lotion','purse',true]]},
    {cat:'makeup',  items:[['Foundation','main',false],['Mascara','main',false],['Lip product','purse',true],['Eyeshadow palette','main',false],['Makeup brushes','main',false],['Makeup remover','main',false]]},
    {cat:'health',  items:[['Prescription meds','purse',true],['Pain relief','purse',true],['Plasters','main',false],['Hand sanitiser','purse',true]]},
  ];
  toi.forEach(({cat,items})=>items.forEach(([n,b,c])=>ITEMS.push(mkItem(n,[cat],[b],['toiletry'],[],[],c,'',true))));
  [['Instant noodles','trunk',false,''],['Snacks','backseat',false,'For the car'],
   ['Tupperware','trunk',false,'To eat with'],['Utensils','trunk',false,''],
   ['Reusable water bottles','backseat',false,'']
  ].forEach(([n,b,c,note])=>ITEMS.push(mkItem(n,['food'],[b],['food'],[],[],c,note,true)));
  [['Passport / ID','purse',true],['Phone + charger','backpack',false],
   ['Power bank','purse',true],['Laptop + charger','backpack',false],
   ['Universal adapter','backpack',false],['Earbuds','backpack',false]
  ].forEach(([n,b,c])=>ITEMS.push(mkItem(n,['tech'],[b],['tech'],[],[],c,'',true)));
}
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` on `index.html` to update `removeGroup` filtering logic to array checking:
```javascript
<<<<<<< SEARCH
function removeGroup(type,id){
  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS=ITEMS.filter(i=>i.categoryId!==id);catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);purposeOrder=purposeOrder.filter(x=>x!==id);}
  Haptic.medium();closeAll();renderPack();
}
=======
function removeGroup(type,id){
  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS=ITEMS.filter(i=>!i.categoryIds.includes(id));catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);purposeOrder=purposeOrder.filter(x=>x!==id);}
  Haptic.medium();closeAll();renderPack();
}
>>>>>>> REPLACE
```

**2. Update Adding Items logic**
* Use `replace_with_git_merge_diff` on `index.html` in `commitItem()`. Update logic:
```javascript
<<<<<<< SEARCH
    let catId='health',bagId='main',purId='toiletry';
    if(aiCtx.viewType==='cat'){catId=aiCtx.groupId;purId=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech';}
    else if(aiCtx.viewType==='bag'){bagId=aiCtx.groupId;}
    else{purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
=======
    let catIds=[],bagIds=[],purIds=[];
    if(aiCtx.viewType==='cat'){catIds=[aiCtx.groupId];purIds=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?['toiletry']:['tech'];}
    else if(aiCtx.viewType==='bag'){bagIds=[aiCtx.groupId];}
    else{purIds=[aiCtx.groupId];}
    ITEMS.push(mkItem(nm,catIds,bagIds,purIds,[],[],carry));
>>>>>>> REPLACE
```

**3. Update Packing Views with Unassigned Fallbacks**
* Use `replace_with_git_merge_diff` on `index.html` to update `renderByCategory()`:
```javascript
<<<<<<< SEARCH
function renderByCategory(){
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
}
=======
function renderByCategory(){
  const ordered=catOrder.map(id=>CATS.find(c=>c.id===id)).filter(Boolean)
    .concat(CATS.filter(c=>!catOrder.includes(c.id)));
  let h=`<div class="pack-note">Items marked <strong>carry</strong> go in your bag or backpack, not checked luggage.</div>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(cat=>{
    const items=ITEMS.filter(i=>i.categoryIds.includes(cat.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('cat-'+cat.id);
    h+=packCard({id:'cat-'+cat.id,gid:cat.id,name:cat.name,sub:cat.desc||'',
      count:`${done}/${items.length}`,open,editType:'cat',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('cat','${cat.id}')">+ Add item</div>`});
  });
  const unassigned=ITEMS.filter(i=>!i.categoryIds||i.categoryIds.length===0);
  if(unassigned.length){
    h+=packCard({id:'cat-unassigned',gid:'unassigned',name:'Uncategorized',sub:'',count:`0/${unassigned.length}`,open:true,editType:'cat',body:unassigned.map(i=>itemRow(i)).join('')});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('category')">+ Add category</button>`;
  return h;
}
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` on `index.html` to update `renderByBag()`:
```javascript
<<<<<<< SEARCH
function renderByBag(){
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
}
=======
function renderByBag(){
  const ordered=bagOrder.map(id=>BAGS.find(b=>b.id===id)).filter(Boolean)
    .concat(BAGS.filter(b=>!bagOrder.includes(b.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by where things physically live.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(bag=>{
    const items=ITEMS.filter(i=>i.bagIds.includes(bag.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('bag-'+bag.id);
    h+=packCard({id:'bag-'+bag.id,gid:bag.id,name:bag.name,sub:bag.desc,
      count:`${done}/${items.length}`,open,editType:'bag',
      body:items.map(i=>itemRow(i,true)).join('')+`<div class="row-add" onclick="openAddItem('bag','${bag.id}')">+ Add item</div>`});
  });
  const unassigned=ITEMS.filter(i=>!i.bagIds||i.bagIds.length===0);
  if(unassigned.length){
    h+=packCard({id:'bag-unassigned',gid:'unassigned',name:'Unassigned',sub:'',count:`0/${unassigned.length}`,open:true,editType:'bag',body:unassigned.map(i=>itemRow(i,true)).join('')});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('bag')">+ Add bag or location</button>`;
  return h;
}
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` on `index.html` to update `renderByPurpose()`:
```javascript
<<<<<<< SEARCH
function renderByPurpose(){
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
}
=======
function renderByPurpose(){
  const ordered=purposeOrder.map(id=>PURPOSES.find(p=>p.id===id)).filter(Boolean)
    .concat(PURPOSES.filter(p=>!purposeOrder.includes(p.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by trip function.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(pur=>{
    const items=ITEMS.filter(i=>i.purposeIds.includes(pur.id));
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('pur-'+pur.id);
    h+=packCard({id:'pur-'+pur.id,gid:pur.id,name:pur.name,sub:'',
      count:`${done}/${items.length}`,open,editType:'purpose',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('pur','${pur.id}')">+ Add item</div>`});
  });
  const unassigned=ITEMS.filter(i=>!i.purposeIds||i.purposeIds.length===0);
  if(unassigned.length){
    h+=packCard({id:'pur-unassigned',gid:'unassigned',name:'Unassigned',sub:'',count:`0/${unassigned.length}`,open:true,editType:'purpose',body:unassigned.map(i=>itemRow(i)).join('')});
  }
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('purpose')">+ Add group</button>`;
  return h;
}
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` on `index.html` to update `itemRow()`:
```javascript
<<<<<<< SEARCH
function itemRow(item,showBag=false){
  const ck=item.checked;
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}')"></div>
    <div class="item-txt${ck?' done':''}">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl">carry</span>`:''}
    ${item.note?`<span class="item-note">${esc(item.note)}</span>`:''}
    ${showBag&&item.categoryId?`<span class="from-lbl">${esc(CATS.find(c=>c.id===item.categoryId)?.name||'')}</span>`:''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>`;
}
=======
function itemRow(item,showBag=false){
  const ck=item.checked;
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}')"></div>
    <div class="item-txt${ck?' done':''}" onclick="openEditItem('${item.id}')">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl">carry</span>`:''}
    ${item.note?`<span class="item-note">${esc(item.note)}</span>`:''}
    ${showBag&&item.categoryIds?.length?`<span class="from-lbl">${esc(item.categoryIds.map(id=>CATS.find(c=>c.id===id)?.name).filter(Boolean).join(', '))}</span>`:''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>`;
}
>>>>>>> REPLACE
```

**4. Edit Item Sheet Overlay (`ovEditItem`) HTML and JS**
* Use `replace_with_git_merge_diff` to add the HTML overlay `ovEditItem` in `index.html`:
```javascript
<<<<<<< SEARCH
<!-- SHEET: Add group -->
<div class="overlay" id="ovAG" onclick="if(event.target===this)closeAll()">
=======
<!-- SHEET: Edit item -->
<div class="overlay" id="ovEditItem" onclick="if(event.target===this)closeAll()">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <div class="sheet-body">
      <div class="sheet-title">Edit Assignment</div>
      <input type="hidden" id="ei-id">
      <span class="sh-lbl">Days</span>
      <div id="ei-days"></div>
      <span class="sh-lbl">Bags</span>
      <div id="ei-bags"></div>
      <span class="sh-lbl">Categories</span>
      <div id="ei-cats"></div>
      <button class="sh-cta" onclick="commitEditItem()">Save</button>
      <button class="sh-cancel" onclick="closeAll()">Cancel</button>
    </div>
  </div>
</div>

<!-- SHEET: Add group -->
<div class="overlay" id="ovAG" onclick="if(event.target===this)closeAll()">
>>>>>>> REPLACE
```
* Use `replace_with_git_merge_diff` to add JS functions in `index.html`:
```javascript
<<<<<<< SEARCH
function toggleItem(itemId){
  const item=ITEMS.find(i=>i.id===itemId);if(!item)return;
=======
let draftItem = null;
function openEditItem(id){
  const item = ITEMS.find(i=>i.id===id); if(!item)return;
  draftItem = JSON.parse(JSON.stringify(item));
  document.getElementById('ei-id').value = id;
  document.getElementById('ei-days').innerHTML = days.map(d=>`<label><input type="checkbox" value="${d.id}" ${draftItem.dayIds.includes(d.id)?'checked':''}> Day ${d.dayNum}</label>`).join('<br>');
  document.getElementById('ei-bags').innerHTML = BAGS.map(b=>`<label><input type="checkbox" value="${b.id}" ${draftItem.bagIds.includes(b.id)?'checked':''}> ${esc(b.name)}</label>`).join('<br>');
  document.getElementById('ei-cats').innerHTML = CATS.map(c=>`<label><input type="checkbox" value="${c.id}" ${draftItem.categoryIds.includes(c.id)?'checked':''}> ${esc(c.name)}</label>`).join('<br>');
  openOv('ovEditItem');
}
function commitEditItem(){
  if(!draftItem)return;
  const id = document.getElementById('ei-id').value;
  const item = ITEMS.find(i=>i.id===id); if(!item)return;
  item.dayIds = Array.from(document.querySelectorAll('#ei-days input:checked')).map(cb=>cb.value);
  item.bagIds = Array.from(document.querySelectorAll('#ei-bags input:checked')).map(cb=>cb.value);
  item.categoryIds = Array.from(document.querySelectorAll('#ei-cats input:checked')).map(cb=>cb.value);
  closeAll(); Haptic.medium(); renderPack();
}

function toggleItem(itemId){
  const item=ITEMS.find(i=>i.id===itemId);if(!item)return;
>>>>>>> REPLACE
```

**5. Completeness Feedback & Smart Alerts**
* Use `replace_with_git_merge_diff` to modify `buildAlert` in `index.html`:
```javascript
<<<<<<< SEARCH
function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim'))
    return`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('${day.id}','swim')">Skip</span></div>`;
  return'';
}
=======
function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  const dayItems=ITEMS.filter(i=>i.dayIds&&i.dayIds.includes(day.id));
  const hasSwim=dayItems.some(i=>i.name.toLowerCase().includes('swim') || (i.categoryIds&&i.categoryIds.includes('swimwear')));
  const hasSleep=dayItems.some(i=>i.name.toLowerCase().includes('sleep') || i.name.toLowerCase().includes('pyjamas'));

  let h = '';
  if(/(hot tub|jacuzzi|pool|hot spring|beach)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim')&&!hasSwim){
    h+=`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('${day.id}','swim')">Skip</span></div>`;
  }
  if(all.includes('sleep') || all.includes('night') || day.nightText !== ''){
      if(!hasSleep && !day._dismissed.has('sleep')){
          h+=`<div class="smart-alert"><div class="sa-text">No sleepwear added for tonight.</div>
          <span class="sa-skip" onclick="dismiss('${day.id}','sleep')">Skip</span></div>`;
      }
  }
  return h;
}
>>>>>>> REPLACE
```

**6. Code Verification**
* Use `read_file` to review `index.html` to confirm that the modifications were applied cleanly and the file structure remains valid.

**7. Visual Verification**
* Use `run_in_bash_session` to start the local server: `python3 -m http.server 8000 > server.log 2>&1 &`.
* Run the Playwright script to navigate the UI, open the packing view, add an item, edit its assignment via the new `ovEditItem` overlay, and take a screenshot/video.

**8. Pre-commit Steps**
* Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

**9. Final Submission**
* Submit the changes.
