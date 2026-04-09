const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// I also need to ensure that `openAddItem` works correctly for `day`
const targetOpenAdd = `function openAddItem(viewType,groupId){
  aiCtx={type:'packitem',viewType,groupId};
  const groupName=viewType==='cat'?CATS.find(c=>c.id===groupId)?.name:
    viewType==='bag'?BAGS.find(b=>b.id===groupId)?.name:PURPOSES.find(p=>p.id===groupId)?.name;`;

const replaceOpenAdd = `function openAddItem(viewType,groupId){
  aiCtx={type:'packitem',viewType,groupId};
  let groupName='';
  if(viewType==='cat') groupName=CATS.find(c=>c.id===groupId)?.name;
  else if(viewType==='bag') groupName=BAGS.find(b=>b.id===groupId)?.name;
  else if(viewType==='pur') groupName=PURPOSES.find(p=>p.id===groupId)?.name;
  else if(viewType==='day') groupName='Day '+days.find(d=>d.id===groupId)?.dayNum;`;

if(content.includes(targetOpenAdd)){
    content = content.replace(targetOpenAdd, replaceOpenAdd);
    console.log("Updated openAddItem to support day header");
}

fs.writeFileSync('index.html', content);
