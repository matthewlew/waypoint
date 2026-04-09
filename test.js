const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const target1 = `toi.forEach(({cat,items})=>items.forEach(([n,b,c])=>ITEMS.push(mkItem(n,cat,b,'toiletry',c,'',true))));`;
const replace1 = `toi.forEach(({cat,items})=>items.forEach(([n,b,c])=>ITEMS.push(mkItem(n,cat,b,'toiletry',c,'',true))));`;

const target2 = `[['Instant noodles','trunk',false,''],['Snacks','backseat',false,'For the car'],
   ['Tupperware','trunk',false,'To eat with'],['Utensils','trunk',false,''],
   ['Reusable water bottles','backseat',false,'']
  ].forEach(([n,b,c,note])=>ITEMS.push(mkItem(n,'food',b,'food',c,note,true)));`;
const replace2 = target2;

const target3 = `[['Passport / ID','purse',true],['Phone + charger','backpack',false],
   ['Power bank','purse',true],['Laptop + charger','backpack',false],
   ['Universal adapter','backpack',false],['Earbuds','backpack',false]
  ].forEach(([n,b,c])=>ITEMS.push(mkItem(n,'tech',b,'tech',c,'',true)));`;
const replace3 = target3;

// The current parameters in mkItem: (name,catId,bagId,purId,carry,note,auto)
// The changes simply let mkItem accept the same signature, but internally assign bagId into an array bagIds, etc.
// So there are no changes strictly required to initItems to pass arrays, since mkItem wraps them for backwards compatibility (e.g., bagIds=bagId?[bagId]:[]).
// I will just verify that the changes are sufficient.
