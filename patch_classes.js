const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexSheet = /<div class="sheet">/g;
html = html.replace(regexSheet, '<div class="sheet" onclick="event.stopPropagation()">');

const regexHd = /<div class="sheet-hd">\n\s*<div class="sheet-title">Edit item<\/div>\n\s*<button class="sheet-close" onclick="closeAll\(\)">×<\/button>\n\s*<\/div>/g;
html = html.replace(regexHd, '<div class="sheet-handle"></div><div class="sheet-title" style="padding: 0 16px;">Edit item</div>');

const regexSfGrp = /<div class="sf-grp">/g;
html = html.replace(regexSfGrp, '<div style="margin-bottom: 12px; padding: 0 16px;">');

const regexSfGrp2 = /<div class="sf-grp" style="display:flex;align-items:center;gap:12px">/g;
html = html.replace(regexSfGrp2, '<div style="display:flex;align-items:center;gap:12px; margin-bottom: 12px; padding: 0 16px;">');

const regexSfLbl = /<label class="sf-lbl">/g;
html = html.replace(regexSfLbl, '<span class="sh-lbl">');

const regexSfLbl2 = /<label for="ei-carry" class="sf-lbl" style="margin-bottom:0">/g;
html = html.replace(regexSfLbl2, '<span class="sh-lbl" style="margin-bottom:0">');

const regexSfLblClose = /<\/label>/g;
html = html.replace(regexSfLblClose, '</span>');

const regexSfInp = /<input type="text" class="sf-inp" /g;
html = html.replace(regexSfInp, '<input class="sh-inp" ');

const regexBtn = /<button class="btn" style="flex:1" onclick="commitEditItem\(\)">Save Changes<\/button>/g;
html = html.replace(regexBtn, '<div style="padding: 0 16px;"><button class="sh-cta" onclick="commitEditItem()">Save Changes</button></div>');

const regexSheetFt = /<div class="sheet-ft">/g;
html = html.replace(regexSheetFt, '<div>');


fs.writeFileSync('index.html', html);
