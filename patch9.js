const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\n    else if\(aiCtx\.viewType==='bag'\)\{bagId=aiCtx\.groupId;\}\n    else\{purId=aiCtx\.groupId;\}\n    ITEMS\.push\(mkItem\(nm,catId,bagId,purId,carry\)\);\n    closeAll\(\);Haptic\.medium\(\);renderPack\(\);\n  \}\n\}/g;
html = html.replace(regex, "");

fs.writeFileSync('index.html', html);
