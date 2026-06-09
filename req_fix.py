import re

with open('index.html', 'r') as f:
    content = f.read()

# Fix unassigned bug
old_commitItem = """function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catIds=[],bagIds=[],purIds=[],dayIds=[];
    if(aiCtx.viewType==='cat'){catIds=[aiCtx.groupId];purIds=[CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech'];}
    else if(aiCtx.viewType==='bag'){bagIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='day'){dayIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='pur'){purIds=[aiCtx.groupId];}
    let itm = mkItem(nm,catIds,bagIds,purIds,carry);
    itm.dayIds = dayIds;
    ITEMS.push(itm);
    closeAll();Haptic.medium();renderPack();renderDays();
  }
}"""

new_commitItem = """function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catIds=[],bagIds=[],purIds=[],dayIds=[];
    if(aiCtx.viewType==='cat'&&aiCtx.groupId!=='unassigned'){catIds=[aiCtx.groupId];purIds=[CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech'];}
    else if(aiCtx.viewType==='bag'&&aiCtx.groupId!=='unassigned'){bagIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='day'){dayIds=[aiCtx.groupId];}
    else if(aiCtx.viewType==='pur'&&aiCtx.groupId!=='unassigned'){purIds=[aiCtx.groupId];}
    let itm = mkItem(nm,catIds,bagIds,purIds,carry);
    itm.dayIds = dayIds;
    ITEMS.push(itm);
    closeAll();Haptic.medium();renderPack();renderDays();
  }
}"""
content = content.replace(old_commitItem, new_commitItem)

# Fix removeGroup
old_removeGroup = """function removeGroup(type,id){
  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS=ITEMS.filter(i=>i.categoryId!==id);catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);purposeOrder=purposeOrder.filter(x=>x!==id);}
  Haptic.medium();closeAll();renderPack();
}"""

new_removeGroup = """function removeGroup(type,id){
  if(type==='cat'){
    CATS=CATS.filter(c=>c.id!==id);
    ITEMS.forEach(i=>{if(i.categoryIds) i.categoryIds=i.categoryIds.filter(x=>x!==id);});
    catOrder=catOrder.filter(x=>x!==id);
  }
  else if(type==='bag'){
    BAGS=BAGS.filter(b=>b.id!==id);
    ITEMS.forEach(i=>{if(i.bagIds) i.bagIds=i.bagIds.filter(x=>x!==id);});
    bagOrder=bagOrder.filter(x=>x!==id);
  }
  else{
    PURPOSES=PURPOSES.filter(p=>p.id!==id);
    ITEMS.forEach(i=>{if(i.purposeIds) i.purposeIds=i.purposeIds.filter(x=>x!==id);});
    purposeOrder=purposeOrder.filter(x=>x!==id);
  }
  Haptic.medium();closeAll();renderPack();
}"""
content = content.replace(old_removeGroup, new_removeGroup)

with open('index.html', 'w') as f:
    f.write(content)
