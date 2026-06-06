sed -i '/<!-- SHEET: Add item -->/i \
<!-- SHEET: Edit Item -->\
<div class="overlay" id="ovEditItem" onclick="if(event.target===this)closeAll()">\
  <div class="sheet" onclick="event.stopPropagation()">\
    <div class="sheet-handle"></div>\
    <div class="sheet-body">\
      <div class="sheet-title">Edit item</div>\
      <input class="sh-inp" id="ei-name" placeholder="Item name…" autocomplete="off">\
      <div class="carry-row" style="padding-top:0">\
        <input type="checkbox" id="ei-carry">\
        <label for="ei-carry">Carry with me</label>\
      </div>\
      <span class="sh-lbl">Days</span>\
      <div class="who-wrap" id="ei-days-wrap"></div>\
      <span class="sh-lbl">Categories</span>\
      <div class="who-wrap" id="ei-cats-wrap"></div>\
      <span class="sh-lbl">Bags</span>\
      <div class="who-wrap" id="ei-bags-wrap"></div>\
      <span class="sh-lbl">Purposes</span>\
      <div class="who-wrap" id="ei-purs-wrap"></div>\
      <button class="sh-cta" onclick="saveEditItem()">Save item</button>\
      <button class="sh-cancel" onclick="closeAll()">Cancel</button>\
    </div>\
  </div>\
</div>\
' index.html
