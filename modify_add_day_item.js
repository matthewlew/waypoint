const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Also inject an "Add item" button directly in the Day card to populate the DayFirst architecture
const targetNotesEnd = `\${esc(day.noteText||'')}</div>
    </div>
  </div>\`;`;

const replaceNotesEnd = `\${esc(day.noteText||'')}</div>
      <div class="row-add" onclick="openAddItem('day','\${day.id}')">+ Add item</div>
    </div>
  </div>\`;`;

if(content.includes(targetNotesEnd)){
    content = content.replace(targetNotesEnd, replaceNotesEnd);
    console.log("Added Add Item button to days");
}

const targetCommitItem2 = `}else if(aiCtx.type==='packitem'){
    let catId='health',bagId='main',purId='toiletry';`;

const replaceCommitItem2 = `}else if(aiCtx.type==='packitem'){
    if(aiCtx.viewType==='day') {
        const newItem = mkItem(nm,'','','',carry);
        newItem.dayIds.push(aiCtx.groupId);
        ITEMS.push(newItem);
        showToast('Saved to Day');
        closeAll();Haptic.medium();renderDays();
        return;
    }
    let catId='health',bagId='main',purId='toiletry';`;

if(content.includes(targetCommitItem2)){
    content = content.replace(targetCommitItem2, replaceCommitItem2);
    console.log("Updated commitItem to handle dayFirst assignments");
}

fs.writeFileSync('index.html', content);
