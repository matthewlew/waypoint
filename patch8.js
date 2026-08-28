const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /else if\(aiCtx\.viewType==='bag'\)\{if\(aiCtx\.groupId\)bagId=aiCtx\.groupId;\}/g;
html = html.replace(regex, "else if(aiCtx.viewType==='bag'){if(aiCtx.groupId)bagId=aiCtx.groupId;}");

fs.writeFileSync('index.html', html);
