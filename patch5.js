const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const editItemHTML = `
<!-- Edit Item Sheet -->
<div class="overlay" id="ovEditItem" onclick="if(event.target===this)closeAll()">
  <div class="sheet">
    <div class="sheet-hd">
      <div class="sheet-title">Edit item</div>
      <button class="sheet-close" onclick="closeAll()">×</button>
    </div>
    <div class="sheet-body">
      <div class="sf-grp">
        <label class="sf-lbl">Name</label>
        <input type="text" class="sf-inp" id="ei-name" autocomplete="off">
      </div>
      <div class="sf-grp" style="display:flex;align-items:center;gap:12px">
        <input type="checkbox" id="ei-carry" style="width:20px;height:20px;accent-color:hsl(var(--foreground))">
        <label for="ei-carry" class="sf-lbl" style="margin-bottom:0">Keep with me (Carry-on / Purse)</label>
      </div>
      <div class="sf-grp">
        <label class="sf-lbl">Note / Detail</label>
        <input type="text" class="sf-inp" id="ei-note" autocomplete="off" placeholder="e.g. Needs washing, buy there...">
      </div>

      <div class="sf-grp">
        <label class="sf-lbl">Days (optional)</label>
        <div class="ei-chips" id="ei-days"></div>
      </div>

      <div class="sf-grp">
        <label class="sf-lbl">Bags / Locations</label>
        <div class="ei-chips" id="ei-bags"></div>
      </div>

      <div class="sf-grp">
        <label class="sf-lbl">Categories</label>
        <div class="ei-chips" id="ei-cats"></div>
      </div>

      <div class="sf-grp">
        <label class="sf-lbl">Purposes</label>
        <div class="ei-chips" id="ei-purs"></div>
      </div>

    </div>
    <div class="sheet-ft">
      <button class="btn" style="flex:1" onclick="commitEditItem()">Save Changes</button>
    </div>
  </div>
</div>
`;

html = html.replace('</body>', editItemHTML + '\n</body>');
fs.writeFileSync('index.html', html);
