const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function mkItem\(name,catId,bagId,purId,carry=false,note='',auto=false\)\{\n  return\{id:'item-'\+\(itemIdSeq\+\+\),name,categoryIds:catId\?\[catId\]:\[\],bagIds:bagId\?\[bagId\]:\[\],purposeIds:purId\?\[purId\]:\[\],dayIds:\[\],scenarios:\[\],/g;
const hasMatch = html.match(regex);
if (hasMatch) {
    console.log("Already updated");
} else {
    console.log("Not updated");
}
