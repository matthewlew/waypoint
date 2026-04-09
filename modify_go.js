const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetGo = `function go(){
  T.name=document.getElementById('sName').value.trim()||'My Trip';
  T.who=[...whoArr];
  T.depDate=document.getElementById('sDepD').value;
  T.depTime=document.getElementById('sDepT').value||'08:00';
  T.retDate=document.getElementById('sRetD').value;`;

const replaceGo = `function go(){
  T.name=document.getElementById('sName').value.trim()||'My Trip';
  T.who=[...whoArr];
  T.depDate=document.getElementById('sDepD').value;
  T.depTime=document.getElementById('sDepT').value;
  T.retDate=document.getElementById('sRetD').value;`;

if (content.includes(targetGo)) {
    content = content.replace(targetGo, replaceGo);
    console.log("go() replaced");
} else {
    console.log("go() not found");
}

fs.writeFileSync('index.html', content);
