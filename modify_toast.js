const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Inject toast CSS
const targetCss = `</style>`;
const replaceCss = `.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:hsl(var(--foreground));color:#fff;padding:10px 16px;border-radius:20px;font-size:14px;z-index:1000;opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease;}.toast.show{opacity:1;transform:translate(-50%,-5px);}\n</style>`;
if (content.includes(targetCss)) {
    content = content.replace(targetCss, replaceCss);
    console.log("Toast CSS added");
}

// Inject toast HTML
const targetHtml = `<!-- TOOLTIP -->`;
const replaceHtml = `<!-- TOAST -->\n<div id="toast" class="toast"></div>\n\n<!-- TOOLTIP -->`;
if (content.includes(targetHtml)) {
    content = content.replace(targetHtml, replaceHtml);
    console.log("Toast HTML added");
}

// Inject showToast function and modify commitItem
const targetCommit = `function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catId='health',bagId='main',purId='toiletry';
    if(aiCtx.viewType==='cat'){catId=aiCtx.groupId;purId=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech';}
    else if(aiCtx.viewType==='bag'){bagId=aiCtx.groupId;}
    else{purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
    closeAll();Haptic.medium();renderPack();
  }
}`;

const replaceCommit = `let toastTimer=null;
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'), 2000);
}

function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    showToast('Saved to Closet');
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catId='health',bagId='main',purId='toiletry';
    if(aiCtx.viewType==='cat'){catId=aiCtx.groupId;purId=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech';}
    else if(aiCtx.viewType==='bag'){bagId=aiCtx.groupId;}
    else{purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
    showToast('Saved to Closet');
    closeAll();Haptic.medium();renderPack();
  }
}`;

if (content.includes(targetCommit)) {
    content = content.replace(targetCommit, replaceCommit);
    console.log("commitItem replaced");
}

fs.writeFileSync('index.html', content);
