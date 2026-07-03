const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix includes calls
content = content.replace(/i=>i\.categoryIds\.includes/g, "i=>(i.categoryIds||[]).includes");
content = content.replace(/i=>i\.bagIds\.includes/g, "i=>(i.bagIds||[]).includes");
content = content.replace(/i=>i\.purposeIds\.includes/g, "i=>(i.purposeIds||[]).includes");
content = content.replace(/i=>i\.dayIds\.includes/g, "i=>(i.dayIds||[]).includes");

fs.writeFileSync('index.html', content);
