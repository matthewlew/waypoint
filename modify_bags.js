const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetBags = `let BAGS=[
  {id:'purse',   name:'Purse / Tote', desc:'On your body — security, under seat'},
  {id:'backpack',name:'Backpack',      desc:'Accessible — backseat or under seat'},
  {id:'main',    name:'Main bag',      desc:'Checked or overhead luggage'},
  {id:'backseat',name:'Car: Backseat', desc:'Easy reach on the drive'},
  {id:'trunk',   name:'Car: Boot',     desc:'Less accessible — gear, food box'},
];`;

const replacementBags = `let BAGS=[
  {id:'purse',   name:'Purse / Tote', desc:'On your body — security, under seat'},
  {id:'backpack',name:'Backpack',      desc:'Accessible — backseat or under seat'},
  {id:'main',    name:'Luggage',      desc:'Checked or overhead luggage'},
  {id:'backseat',name:'Car seat', desc:'Easy reach on the drive'},
  {id:'trunk',   name:'Car trunk',     desc:'Less accessible — gear, food box'},
];`;

if (content.includes(targetBags)) {
    content = content.replace(targetBags, replacementBags);
    console.log("BAGS replaced");
} else {
    console.log("BAGS target not found");
}

const targetPurposes = `let PURPOSES=[
  {id:'clothing', name:'Clothing'},
  {id:'toiletry', name:'Toiletries'},
  {id:'gear',     name:'Gear & Equipment'},
  {id:'food',     name:'Food & Supplies'},
  {id:'tech',     name:'Tech & Documents'},
];`;

const replacementPurposes = `let PURPOSES=[
  {id:'clothing', name:'Clothing'},
  {id:'toiletry', name:'Toiletries'},
  {id:'gear',     name:'Gear & Equipment'},
  {id:'food',     name:'Food & Supplies'},
  {id:'tech',     name:'Tech & Documents'},
];
let ROUTINES=[];
let SCENARIOS=[];`;

if (content.includes(targetPurposes)) {
    content = content.replace(targetPurposes, replacementPurposes);
    console.log("PURPOSES replaced");
} else {
    console.log("PURPOSES target not found");
}

fs.writeFileSync('index.html', content);
