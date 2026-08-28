const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Change ITEM structure
html = html.replace('function mkItem(name,catId,bagId,purId,carry=false,note=\'\',auto=false){',
                    'function mkItem(name,catId,bagId,purId,carry=false,note=\'\',auto=false){');
html = html.replace('return{id:\'item-\'+(itemIdSeq++),name,categoryId:catId,bagId,purposeId:purId,',
                    'return{id:\'item-\'+(itemIdSeq++),name,categoryIds:catId?[catId]:[],bagIds:bagId?[bagId]:[],purposeIds:purId?[purId]:[],dayIds:[],scenarios:[],');


// Replace usages of categoryId -> categoryIds.includes
html = html.replace(/i\.categoryId===cat\.id/g, '(i.categoryIds||[]).includes(cat.id)');
html = html.replace(/i\.categoryId!==id/g, '!(i.categoryIds||[]).includes(id)');
html = html.replace(/item\.categoryId/g, '(item.categoryIds&&item.categoryIds.length>0?item.categoryIds[0]:null)');

// Replace usages of bagId -> bagIds.includes
html = html.replace(/i\.bagId===bag\.id/g, '(i.bagIds||[]).includes(bag.id)');
html = html.replace(/i\.bagId!==id/g, '!(i.bagIds||[]).includes(id)');
html = html.replace(/item\.bagId/g, '(item.bagIds&&item.bagIds.length>0?item.bagIds[0]:null)');

// Replace usages of purposeId -> purposeIds.includes
html = html.replace(/i\.purposeId===pur\.id/g, '(i.purposeIds||[]).includes(pur.id)');
html = html.replace(/i\.purposeId!==id/g, '!(i.purposeIds||[]).includes(id)');
html = html.replace(/item\.purposeId/g, '(item.purposeIds&&item.purposeIds.length>0?item.purposeIds[0]:null)');

fs.writeFileSync('index.html', html);
