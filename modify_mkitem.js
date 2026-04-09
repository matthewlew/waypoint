const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The initial regex didn't match perfectly, let's try a direct string replacement since the body is short.
const target = `function mkItem(name,catId,bagId,purId,carry=false,note='',auto=false){
  return{id:'item-'+(itemIdSeq++),name,categoryId:catId,bagId,purposeId:purId,
    carry,checked:false,auto,note};
}`;
const replacement = `function mkItem(name,catId,bagId,purId,carry=false,note='',auto=false){
  const dayIds=[],bagIds=bagId?[bagId]:[],purposeIds=purId?[purId]:[],scenarios=[];
  return{id:'item-'+(itemIdSeq++),name,categoryId:catId,bagId,purposeId:purId,
    dayIds,bagIds,purposeIds,scenarios,
    carry,checked:false,auto,note};
}`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('index.html', content);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the target string.");
}
