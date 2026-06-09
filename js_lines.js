
'use strict';

// ═══════════════════════════════════════
//  HAPTICS
// ═══════════════════════════════════════
const Haptic={
  light(){if(navigator.vibrate)navigator.vibrate(8);else this._a(.02,80)},
  medium(){if(navigator.vibrate)navigator.vibrate([6,40,10]);else this._a(.04,120)},
  success(){if(navigator.vibrate)navigator.vibrate([8,30,8,30,16]);else this._a(.06,60)},
  _ctx:null,
  _a(g,ms){try{
    if(!this._ctx)this._ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=this._ctx.createOscillator(),gn=this._ctx.createGain();
    o.connect(gn);gn.connect(this._ctx.destination);o.frequency.value=440;
    gn.gain.setValueAtTime(g,this._ctx.currentTime);
    gn.gain.exponentialRampToValueAtTime(.001,this._ctx.currentTime+ms/1000);
    o.start();o.stop(this._ctx.currentTime+ms/1000);
  }catch(e){}}
};

// ═══════════════════════════════════════
//  ACTIVITY DATABASE
// ═══════════════════════════════════════
const ACT_DB=[
  {id:'flight',    label:'Flight',        category:'Travel',  hint:'travel',
   detect:['flight','fly','flying','plane','airport'],
   day:['Comfortable outfit','Slip-on shoes','Neck pillow'],night:[]},
  {id:'train',     label:'Train',         category:'Travel',  hint:'travel',
   detect:['train','rail','amtrak','eurostar'],
   day:['Comfortable outfit','Layers'],night:[]},
  {id:'drive',     label:'Road trip',     category:'Travel',  hint:'travel',
   detect:['drive','driving','road trip','car'],
   day:['Comfortable clothes'],night:[]},
  {id:'hike',      label:'Hiking',        category:'Active',  hint:'active',
   detect:['hike','hiking','trail','trekking','trek'],
   day:['Activewear','Trail shoes','Moisture-wicking top'],night:[]},
  {id:'ski',       label:'Skiing',        category:'Snow',    hint:'snow',
   detect:['ski','skiing','ski day','slopes'],
   day:['Base layer','Ski pants','Snow jacket','Goggles','Gloves'],
   night:['Après outfit','Warm socks']},
  {id:'snowboard', label:'Snowboarding',  category:'Snow',    hint:'snow',
   detect:['snowboard','snowboarding','board day'],
   day:['Base layer','Board pants','Snow jacket','Goggles','Gloves'],
   night:['Après outfit']},
  {id:'beach',     label:'Beach',         category:'Water',   hint:'water',
   detect:['beach','shore','coast','seaside'],
   day:['Swimwear','Cover-up','Flip flops'],night:[]},
  {id:'pool',      label:'Pool',          category:'Water',   hint:'water',
   detect:['pool','swimming pool','swim'],
   day:['Swimwear','Flip flops'],night:[]},
  {id:'hottub',    label:'Hot tub',       category:'Water',   hint:'water',
   detect:['hot tub','hottub','jacuzzi','hot spring'],
   day:['Swimwear'],night:['Swimwear','Flip flops']},
  {id:'kayak',     label:'Kayaking',      category:'Active',  hint:'active',
   detect:['kayak','kayaking','paddle','paddleboard'],
   day:['Quick-dry shorts','Rash guard','Water shoes'],night:[]},
  {id:'cycle',     label:'Cycling',       category:'Active',  hint:'active',
   detect:['cycle','cycling','bike','biking'],
   day:['Cycling kit','Helmet'],night:[]},
  {id:'gym',       label:'Gym',           category:'Active',  hint:'active',
   detect:['gym','workout','lift','weights'],
   day:['Gym kit','Trainers'],night:[]},
  {id:'yoga',      label:'Yoga',          category:'Active',  hint:'active',
   detect:['yoga','pilates'],
   day:['Yoga set'],night:[]},
  {id:'museum',    label:'Museum',        category:'Culture', hint:'culture',
   detect:['museum','gallery','exhibit'],
   day:['Smart casual','Comfortable shoes'],night:[]},
  {id:'explore',   label:'City walk',     category:'Casual',  hint:'casual',
   detect:['explore','wander','sightseeing','city walk'],
   day:['Casual outfit','Walking shoes'],night:[]},
  {id:'market',    label:'Market',        category:'Casual',  hint:'casual',
   detect:['market','farmers market','bazaar'],
   day:['Casual outfit'],night:[]},
  {id:'tour',      label:'Guided tour',   category:'Culture', hint:'culture',
   detect:['tour','guided tour','excursion'],
   day:['Smart casual','Comfortable shoes'],night:[]},
  {id:'dinner',    label:'Fine dining',   category:'Evening', hint:'evening',
   detect:['dinner','dining','restaurant','fine dining','fancy dinner'],
   day:[],night:['Dressy outfit','Smart shoes']},
  {id:'bar',       label:'Bar',           category:'Evening', hint:'evening',
   detect:['bar','nightlife','cocktails','club'],
   day:[],night:['Going-out outfit']},
  {id:'spa',       label:'Spa',           category:'Wellness',hint:'wellness',
   detect:['spa','massage','sauna','steam room'],
   day:['Swimwear','Flip flops'],night:[]},
  {id:'camping',   label:'Camping',       category:'Outdoor', hint:'outdoor',
   detect:['camp','camping','tent','campfire','campsite'],
   day:['Outdoor layers','Sturdy boots'],night:['Warm base layer']},
  {id:'climb',     label:'Climbing',      category:'Active',  hint:'active',
   detect:['climb','climbing','bouldering','crag'],
   day:['Climbing pants','Climbing shoes','Chalk bag'],night:[]},
  {id:'photo',     label:'Photography',   category:'Casual',  hint:'casual',
   detect:['photo','photography','photoshoot'],
   day:['Casual outfit'],night:[]},
  {id:'rest',      label:'Rest day',      category:'Casual',  hint:'casual',
   detect:['rest','relax','chill','lounge','lazy day'],
   day:['Loungewear'],night:['Pyjamas']},
  {id:'apres',     label:'Après ski',     category:'Snow',    hint:'snow',
   detect:['après','apres ski','après ski','apres'],
   day:[],night:['Après outfit','Warm socks','Snow boots']},
  {id:'concert',   label:'Concert',       category:'Evening', hint:'evening',
   detect:['concert','show','gig','festival'],
   day:[],night:['Going-out outfit','Comfortable shoes']},
  {id:'brunch',    label:'Brunch',        category:'Casual',  hint:'casual',
   detect:['brunch','breakfast out'],
   day:['Casual outfit'],night:[]},
];

const DETECT_SORTED=[...ACT_DB]
  .flatMap(a=>a.detect.map(d=>({word:d,act:a})))
  .sort((a,b)=>b.word.length-a.word.length);

// Flight code regex — e.g. DL067, AA 1234, UA123, LH 400
const FLT_CODE_RE=/\b([A-Z]{2}|[A-Z]\d|\d[A-Z])\s*(\d{1,4}[A-Z]?)\b/g;

const CARRY_SET=new Set(['Face mist','Body lotion','Moisturiser','Prescription meds',
  'Pain relief','Hand sanitiser','Dry shampoo','Lip product','Power bank',
  'Neck pillow','Slip-on shoes']);

// ═══════════════════════════════════════
//  FLIGHT CODE MOCK DATA
//  In production: call AviationStack / AeroDataBox API
// ═══════════════════════════════════════
const FLT_MOCK={
  default:(code)=>({
    code,
    route:'Route info unavailable',
    dep:'—',arr:'—',
    status:'Check airline app for live status',
  }),
};
function lookupFlight(code){
  // Mock — returns plausible-looking data based on code
  const num=parseInt(code.replace(/[A-Z\s]/g,''))||0;
  const depH=6+Math.floor(num%16);
  const dur=1+Math.floor(num%4);
  const arrH=depH+dur;
  const pad=h=>`${h%24}:${num%60<10?'0':''}${num%60}`;
  return{code,dep:pad(depH),arr:pad(arrH),
    status:'On time',duration:`${dur}h ${num%60}m`};
}

// ═══════════════════════════════════════
//  ITEM STORE
// ═══════════════════════════════════════
let ITEMS=[];let itemIdSeq=1;
function mkItem(name,catId,bagId,purId,carry=false,note='',auto=false){
  return{id:'item-'+(itemIdSeq++),name,categoryId:catId,bagId,purposeId:purId,
    carry,checked:false,auto,note};
}

let CATS=[
  {id:'skincare',name:'Skincare',  type:'toi'},
  {id:'hair',    name:'Hair',      type:'toi'},
  {id:'body',    name:'Body',      type:'toi'},
  {id:'makeup',  name:'Makeup',    type:'toi'},
  {id:'health',  name:'Health & meds',type:'toi'},
  {id:'food',    name:'Food box',  type:'sup',desc:'Car camping / road trip food'},
  {id:'tech',    name:'Tech & docs',type:'sup',desc:'Chargers, devices, documents'},
];
let BAGS=[
  {id:'purse',   name:'Purse / Tote', desc:'On your body — security, under seat'},
  {id:'backpack',name:'Backpack',      desc:'Accessible — backseat or under seat'},
  {id:'main',    name:'Main bag',      desc:'Checked or overhead luggage'},
  {id:'backseat',name:'Car: Backseat', desc:'Easy reach on the drive'},
  {id:'trunk',   name:'Car: Boot',     desc:'Less accessible — gear, food box'},
];
let PURPOSES=[
  {id:'clothing', name:'Clothing'},
  {id:'toiletry', name:'Toiletries'},
  {id:'gear',     name:'Gear & Equipment'},
  {id:'food',     name:'Food & Supplies'},
  {id:'tech',     name:'Tech & Documents'},
];

function initItems(){
  ITEMS=[];
  const toi=[
    {cat:'skincare',items:[['Cleanser','purse',false],['Moisturiser','purse',true],['SPF 50','main',false],['Face mist','purse',true]]},
    {cat:'hair',    items:[['Shampoo','main',false],['Conditioner','main',false],['Dry shampoo','purse',true],['Hair tools','main',false]]},
    {cat:'body',    items:[['Body wash','main',false],['Deodorant','main',false],['Razor','main',false],['Body lotion','purse',true]]},
    {cat:'makeup',  items:[['Foundation','main',false],['Mascara','main',false],['Lip product','purse',true],['Eyeshadow palette','main',false],['Makeup brushes','main',false],['Makeup remover','main',false]]},
    {cat:'health',  items:[['Prescription meds','purse',true],['Pain relief','purse',true],['Plasters','main',false],['Hand sanitiser','purse',true]]},
  ];
  toi.forEach(({cat,items})=>items.forEach(([n,b,c])=>ITEMS.push(mkItem(n,cat,b,'toiletry',c,'',true))));
  [['Instant noodles','trunk',false,''],['Snacks','backseat',false,'For the car'],
   ['Tupperware','trunk',false,'To eat with'],['Utensils','trunk',false,''],
   ['Reusable water bottles','backseat',false,'']
  ].forEach(([n,b,c,note])=>ITEMS.push(mkItem(n,'food',b,'food',c,note,true)));
  [['Passport / ID','purse',true],['Phone + charger','backpack',false],
   ['Power bank','purse',true],['Laptop + charger','backpack',false],
   ['Universal adapter','backpack',false],['Earbuds','backpack',false]
  ].forEach(([n,b,c])=>ITEMS.push(mkItem(n,'tech',b,'tech',c,'',true)));
}

// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
let T={name:'',who:[],depDate:'',depTime:'08:00',retDate:'',destinations:[]};
let days=[];
let openCards=new Set();
let packView='category';
let outView='pack';
let customOut={};
let aiCtx=null,editCtx=null,agCtx=null;
let whoArr=[];
let catOrder,bagOrder,purposeOrder;

// ═══════════════════════════════════════
//  SETUP
// ═══════════════════════════════════════
function whoAdd(){
  const v=document.getElementById('whoInp').value.trim();if(!v)return;
  whoArr.push(v);document.getElementById('whoInp').value='';renderWho();Haptic.light();
}
function renderWho(){
  document.getElementById('whoWrap').innerHTML=whoArr.map((w,i)=>
    `<div class="who-chip">${esc(w)}<span class="who-x" onclick="whoArr.splice(${i},1);renderWho()">×</span></div>`).join('');
}
function destAdd(lid){
  const l=document.getElementById(lid);const r=document.createElement('div');r.className='dest-row';
  r.innerHTML=`<span class="drag-handle">⠿</span>
    <input class="sf-inp" placeholder="Destination" autocomplete="off">
    <input class="sf-inp sf-mini" type="number" min="1" placeholder="nts">
    <button class="dest-rm" onclick="destRm(this)">×</button>`;
  l.appendChild(r);initDrag(l);Haptic.light();
}
function destRm(b){
  const p=b.closest('[id]');const rows=p?.querySelectorAll('.dest-row,.et-dest-row');
  if(rows&&rows.length>1){b.closest('.dest-row,.et-dest-row').remove();Haptic.light();}
}
function go(){
  T.name=document.getElementById('sName').value.trim()||'My Trip';
  T.who=[...whoArr];
  T.depDate=document.getElementById('sDepD').value;
  T.depTime=document.getElementById('sDepT').value||'08:00';
  T.retDate=document.getElementById('sRetD').value;
  readDests('destList');
  initItems();
  catOrder=CATS.map(c=>c.id);
  bagOrder=BAGS.map(b=>b.id);
  purposeOrder=PURPOSES.map(p=>p.id);
  buildDays();
  document.getElementById('setup').classList.add('gone');
  document.getElementById('app').style.display='flex';
  if(days.length)openCards.add(days[0].id);
  renderAll();Haptic.success();
}
function readDests(lid){
  T.destinations=[];
  const COLS=['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0891B2'];
  document.querySelectorAll(`#${lid} .dest-row,#${lid} .et-dest-row`).forEach((r,i)=>{
    const ins=r.querySelectorAll('input');
    T.destinations.push({
      name:ins[0].value.trim()||'Destination '+(i+1),
      nights:parseInt(ins[1]?.value)||3,
      color:COLS[i%COLS.length],
    });
  });
}

// ═══════════════════════════════════════
//  DRAG REORDER — generic pointer events
// ═══════════════════════════════════════
function initDrag(container,onDone){
  if(!container)return;
  let di=null,oi=null;
  const rows=()=>[...container.querySelectorAll(':scope>.dest-row,:scope>.et-dest-row,:scope>.card')];
  rows().forEach((row,idx)=>{
    const handle=row.querySelector('.drag-handle,.et-handle');
    const target=handle||row;
    if(target._db)return;target._db=true;
    target.addEventListener('pointerdown',e=>{
      if(handle&&e.target!==handle&&!handle.contains(e.target))return;
      e.preventDefault();di=idx;
      row.classList.add(handle?'dragging':'card-dragging');
      target.setPointerCapture(e.pointerId);Haptic.light();
    });
    target.addEventListener('pointermove',e=>{
      if(di===null)return;e.preventDefault();
      const all=rows();let no=null;
      all.forEach((r,i)=>{const rc=r.getBoundingClientRect();
        if(e.clientY>=rc.top&&e.clientY<=rc.bottom)no=i;});
      if(no!==null&&no!==oi){
        if(oi!==null)rows()[oi]?.classList.remove('drag-over','card-drag-over');
        oi=no;
        if(oi!==di)rows()[oi]?.classList.add(handle?'drag-over':'card-drag-over');
        Haptic.light();
      }
    });
    target.addEventListener('pointerup',()=>{
      if(di===null)return;
      rows().forEach(r=>r.classList.remove('dragging','drag-over','card-dragging','card-drag-over'));
      if(oi!==null&&oi!==di){
        const all=rows(),drag=all[di],tgt=all[oi];
        container.insertBefore(drag,di<oi?tgt.nextSibling:tgt);
        if(onDone)onDone(rows().map(r=>r.dataset.id).filter(Boolean));
        Haptic.success();
      }
      di=null;oi=null;
    });
  });
}
initDrag(document.getElementById('destList'));

// ═══════════════════════════════════════
//  BUILD DAYS
// ═══════════════════════════════════════
function buildDays(){
  days.forEach(d=>{
    ['day','night','note'].forEach(s=>{
      const el=document.getElementById(`ed-${s}-${d.id}`);
      if(el)d[s+'Text']=el.innerText;
    });
  });
  const prev=new Map(days.map(d=>[d.id,d]));
  days=[];
  const start=T.depDate?new Date(T.depDate+'T12:00:00'):new Date();
  let n=1;
  T.destinations.forEach((dest,di)=>{
    for(let d=0;d<dest.nights;d++){
      const date=new Date(start);date.setDate(start.getDate()+(n-1));
      const isFirst=n===1,isTransfer=d===dest.nights-1&&di<T.destinations.length-1;
      const isLast=di===T.destinations.length-1&&d===dest.nights-1;
      const id='d'+n,old=prev.get(id)||{};
      days.push({id,destIdx:di,dayNum:n,date,
        isTravel:isFirst||isTransfer||isLast,
        dayText:old.dayText||(isFirst||isTransfer?'Flight':''),
        nightText:old.nightText||'',noteText:old.noteText||'',
        _dismissed:old._dismissed||new Set(),
        _flightCodes:old._flightCodes||{},
      });
      n++;
    }
  });
}

const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(d){return(d.getMonth()+1)+'/'+d.getDate();}
function fmtLong(d){return DOW[d.getDay()]+', '+MONTHS[d.getMonth()]+' '+d.getDate();}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ═══════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════
function renderAll(){renderHeader();renderDays();renderOutfits();renderPack();}
function renderHeader(){
  document.getElementById('hTrip').textContent=T.name||'My Trip';
  const nights=T.destinations.reduce((s,d)=>s+d.nights,0);
  document.getElementById('hMeta').textContent=nights+' nights · '+T.destinations.map(d=>d.name).join(' → ');
}

// ─── DAYS ───
function renderDays(){
  renderBanners();
  document.getElementById('dayList').innerHTML=days.map(d=>buildDayCard(d)).join('');
  days.forEach(d=>{
    attachEditor('ed-day-'+d.id,d.id,'day');
    attachEditor('ed-night-'+d.id,d.id,'night');
    const ne=document.getElementById('ed-note-'+d.id);
    if(ne)ne.addEventListener('input',()=>{const x=days.find(x=>x.id===d.id);if(x)x.noteText=ne.innerText;});
    attachBulletKey('ed-day-'+d.id);
    attachBulletKey('ed-night-'+d.id);
    attachBulletKey('ed-note-'+d.id);
  });
  document.getElementById('addDayWrap').innerHTML=T.destinations.map((dest,i)=>
    `<button class="add-day-btn" onclick="addDay(${i})">+ Day in ${esc(dest.name)}</button>`).join('');
}

function renderBanners(){
  let h='';
  if(T.depDate&&T.depTime){
    const dep=new Date(T.depDate+'T'+T.depTime),hr=(dep-Date.now())/3.6e6;
    if(hr>0&&hr<24) h+=`<div class="banner warn"><strong>Pack now</strong> — leaving in ${Math.round(hr)}h.</div>`;
    else if(hr>=24&&hr<48) h+=`<div class="banner warn"><strong>Pack tonight</strong> — departing tomorrow at ${T.depTime}.</div>`;
    else if(hr>=48) h+=`<div class="banner warn">Pack by <strong>${fmtLong(new Date(dep-172800000))}</strong> — ${Math.ceil(hr/24)} days to go.</div>`;
  }
  if(T.destinations.length){
    const d0=T.destinations[0].name.toLowerCase();
    if(/mammoth|tahoe|aspen|vail|park city/.test(d0))
      h+=`<div class="banner info"><strong>${esc(T.destinations[0].name)}:</strong> Expect 15–30°F. Pack base layers, waterproof outer, gloves.</div>`;
    else if(/hawaii|cancun|miami|bali|tulum/.test(d0))
      h+=`<div class="banner info"><strong>${esc(T.destinations[0].name)}:</strong> Hot and humid. Light fabrics, SPF, one light layer for A/C.</div>`;
    else if(/london|paris|amsterdam|edinburgh/.test(d0))
      h+=`<div class="banner info"><strong>${esc(T.destinations[0].name)}:</strong> Variable weather — layers and a compact rain jacket.</div>`;
  }
  document.getElementById('banners').innerHTML=h;
}

function buildDayCard(day){
  const dest=T.destinations[day.destIdx];
  const isOpen=openCards.has(day.id);
  const alert=buildAlert(day);
  // Build any flight strips for detected codes
  const flightStrips=buildFlightStrips(day);

  return`<div class="card${day.isTravel?' travel':''}" id="card-${day.id}">
    <div class="card-hd${isOpen?' open':''}" onclick="toggleCard('${day.id}')">
      <div class="card-hd-left">
        <div class="card-num">${day.dayNum}</div>
        <div class="card-sub">
          ${DOW[day.date.getDay()]} ${fmt(day.date)} ·
          <span class="dest-inline" style="color:${dest.color}">${esc(dest.name)}</span>
          ${day.isTravel?`<span class="travel-inline"> · ✈ Travel</span>`:''}
        </div>
      </div>
      <div class="card-hd-right">
        <span class="chevron${isOpen?' open':''}">▼</span>
      </div>
    </div>
    ${alert?`<div>${alert}</div>`:''}
    ${flightStrips}
    <div class="card-body${isOpen?' open':''}" id="body-${day.id}">
      <div class="slot-head">day</div>
      <div class="slot-editor" id="ed-day-${day.id}" contenteditable="true"
        data-ph="What's happening? e.g. Snowboard, lunch out, explore…"
        spellcheck="false" autocorrect="off" autocapitalize="sentences"
      >${buildEdHTML(day.dayText||'')}</div>
      <div class="slot-divider"></div>
      <div class="slot-head">evening</div>
      <div class="slot-editor" id="ed-night-${day.id}" contenteditable="true"
        data-ph="Dinner, bar, hot tub, rest…"
        spellcheck="false" autocorrect="off" autocapitalize="sentences"
      >${buildEdHTML(day.nightText||'')}</div>
      <div class="notes-head">notes</div>
      <div class="notes-editor" id="ed-note-${day.id}" contenteditable="true"
        data-ph="Reminders, reservations, anything…"
        spellcheck="false" autocapitalize="sentences"
      >${esc(day.noteText||'')}</div>
    </div>
  </div>`;
}

function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim'))
    return`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('${day.id}','swim')">Skip</span></div>`;
  return'';
}

// ─── FLIGHT STRIPS ───
function buildFlightStrips(day){
  const allText=day.dayText+' '+day.nightText;
  const codes=extractFlightCodes(allText);
  if(!codes.length)return'';
  return codes.map(code=>{
    const info=lookupFlight(code);
    return`<div class="flight-strip" onclick="event.stopPropagation()">
      <span class="fs-code">${esc(code)}</span>
      <span class="fs-info">${esc(info.dep)} → ${esc(info.arr)} · ${esc(info.duration)}</span>
      <span class="fs-tag">${esc(info.status)}</span>
    </div>`;
  }).join('');
}

function extractFlightCodes(text){
  // Match 2-letter airline code + 1-4 digit flight number
  const re=/\b([A-Z]{2})\s*(\d{1,4}[A-Z]?)\b/g;
  const codes=new Set();let m;
  while((m=re.exec(text))!==null){
    const code=m[1]+m[2];
    // Filter out obvious false positives
    const skip=['AM','PM','TV','PC','OK','NO','MY'];
    if(!skip.includes(m[1]))codes.add(code);
  }
  return[...codes];
}

function dismiss(dayId,key){
  const d=days.find(x=>x.id===dayId);if(d)d._dismissed.add(key);Haptic.light();renderDays();
}
function toggleCard(id){
  openCards.has(id)?openCards.delete(id):openCards.add(id);Haptic.light();
  const card=document.getElementById('card-'+id);
  const hd=card?.querySelector('.card-hd');
  const body=document.getElementById('body-'+id);
  const chev=hd?.querySelector('.chevron');
  const open=openCards.has(id);
  hd?.classList.toggle('open',open);
  body?.classList.toggle('open',open);
  chev?.classList.toggle('open',open);
}
function addDay(di){T.destinations[di].nights++;buildDays();renderAll();Haptic.medium();}

// ─── HIGHLIGHT ENGINE ───
function highlightText(plain){
  if(!plain)return'';
  const lower=plain.toLowerCase();
  // Build match list from activities
  const matches=[];
  DETECT_SORTED.forEach(({word,act})=>{
    let idx=0;
    while((idx=lower.indexOf(word,idx))!==-1){
      const b=idx===0||/[\s,.\-–!?•\n]/.test(plain[idx-1]);
      const e2=idx+word.length;
      const a=e2>=plain.length||/[\s,.\-–!?•\n]/.test(plain[e2]);
      if(b&&a&&!matches.some(m=>!(e2<=m.s||idx>=m.e)))
        matches.push({s:idx,e:e2,type:'act',act,word:plain.slice(idx,e2)});
      idx++;
    }
  });
  // Flight codes
  const fltRe=/\b([A-Z]{2})\s*(\d{1,4}[A-Z]?)\b/g;
  const skip=['AM','PM','TV','PC','OK','NO','MY'];
  let fm;
  while((fm=fltRe.exec(plain))!==null){
    if(skip.includes(fm[1]))continue;
    const s=fm.index,e2=fm.index+fm[0].length;
    if(!matches.some(m=>!(e2<=m.s||s>=m.e)))
      matches.push({s,e:e2,type:'flt',word:fm[0].replace(/\s/,'')});
  }
  matches.sort((a,b)=>a.s-b.s);

  let out='',pos=0;
  // Process line by line to handle bullets
  const lines=plain.split('\n');
  let charPos=0;
  lines.forEach((line,li)=>{
    const lineStart=charPos,lineEnd=charPos+line.length;
    const isBullet=line.startsWith('• ');
    const lineText=isBullet?line.slice(2):line;
    const lineTextStart=isBullet?lineStart+2:lineStart;

    if(isBullet){
      out+=`<span class="bullet-line" data-line="${li}">`;
    }
    // Render matches within this line
    let lp=lineTextStart;
    matches.filter(m=>m.s>=lineTextStart&&m.e<=lineEnd).sort((a,b)=>a.s-b.s).forEach(m=>{
      if(m.s>lp) out+=esc(plain.slice(lp,m.s));
      if(m.type==='act'){
        out+=`<span class="linked" data-act="${m.act.id}">${esc(m.word)}</span>`;
      }else{
        out+=`<span class="flt-code" data-flt="${esc(m.word)}">${esc(m.word)}</span>`;
      }
      lp=m.e;
    });
    if(lp<lineEnd) out+=esc(plain.slice(lp,lineEnd));
    if(isBullet) out+='</span>';
    if(li<lines.length-1) out+='<br>';
    charPos=lineEnd+1; // +1 for \n
  });
  return out;
}

function buildEdHTML(text){
  if(!text)return'';
  return highlightText(text);
}

function rehighlight(el){
  const sel=window.getSelection();if(!sel||!sel.rangeCount)return;
  const range=sel.getRangeAt(0);
  const pre=range.cloneRange();
  pre.selectNodeContents(el);pre.setEnd(range.endContainer,range.endOffset);
  const offset=pre.toString().length;
  el.innerHTML=highlightText(esc(el.innerText));
  restoreCaret(el,offset);
}
function restoreCaret(el,offset){
  try{
    const sel=window.getSelection(),range=document.createRange();
    let chars=0,found=false;
    function walk(node){if(found)return;
      if(node.nodeType===3){const n=chars+node.length;
        if(n>=offset){range.setStart(node,offset-chars);range.collapse(true);found=true;}
        else chars=n;}
      else node.childNodes.forEach(walk);}
    walk(el);
    if(!found){range.selectNodeContents(el);range.collapse(false);}
    sel.removeAllRanges();sel.addRange(range);
  }catch(e){}
}

// ─── BULLET KEY HANDLER ───
// On Enter: if current line starts with • stay in bullet mode
// On "-" at start of line: convert to bullet
function attachBulletKey(elId){
  const el=document.getElementById(elId);if(!el)return;
  el.addEventListener('keydown',e=>{
    if(e.key==='-'){
      const sel=window.getSelection();if(!sel||!sel.rangeCount)return;
      const range=sel.getRangeAt(0);
      // Check if cursor is at start of a text node / line
      const pre=range.cloneRange();
      pre.selectNodeContents(el);pre.setEnd(range.startContainer,range.startOffset);
      const textBefore=pre.toString();
      // At start of a line if nothing before or previous char is \n
      const atLineStart=textBefore===''||textBefore.endsWith('\n');
      if(atLineStart){
        e.preventDefault();
        document.execCommand('insertText',false,'• ');
        Haptic.light();
      }
    }
    if(e.key==='Enter'){
      const sel=window.getSelection();if(!sel||!sel.rangeCount)return;
      const range=sel.getRangeAt(0);
      const pre=range.cloneRange();
      pre.selectNodeContents(el);pre.setEnd(range.startContainer,range.startOffset);
      const textBefore=pre.toString();
      const lastNewline=textBefore.lastIndexOf('\n');
      const currentLine=lastNewline===-1?textBefore:textBefore.slice(lastNewline+1);
      if(currentLine.startsWith('• ')){
        if(currentLine==='• '){
          // Empty bullet — exit bullet mode: remove the •
          e.preventDefault();
          // Delete back 2 chars (• and space) and insert plain newline
          document.execCommand('delete',false);
          document.execCommand('delete',false);
        }else{
          e.preventDefault();
          document.execCommand('insertText',false,'\n• ');
          Haptic.light();
        }
      }
    }
  });
}

// ─── EDITOR ATTACHMENT ───
function attachEditor(elId,dayId,slot){
  const el=document.getElementById(elId);if(!el)return;
  let lastDet=new Set(),timer=null;
  // Tooltip on activity spans
  el.addEventListener('mouseover',e=>{
    const span=e.target.closest('.linked');if(!span)return;
    const act=ACT_DB.find(a=>a.id===span.dataset.act);if(!act)return;
    showTip(span,{type:'activity',act});
  });
  el.addEventListener('mouseout',e=>{if(!e.target.closest('.linked,.flt-code'))hideTip();});
  // Tooltip on flight codes
  el.addEventListener('mouseover',e=>{
    const span=e.target.closest('.flt-code');if(!span)return;
    const info=lookupFlight(span.dataset.flt||span.textContent);
    showTip(span,{type:'flight',info});
  });
  el.addEventListener('touchstart',e=>{
    const linked=e.target.closest('.linked');
    const flt=e.target.closest('.flt-code');
    if(linked){const act=ACT_DB.find(a=>a.id===linked.dataset.act);if(act){showTip(linked,{type:'activity',act});setTimeout(hideTip,2500);}}
    if(flt){const info=lookupFlight(flt.dataset.flt||flt.textContent);showTip(flt,{type:'flight',info});setTimeout(hideTip,2500);}
  },{passive:true});

  el.addEventListener('input',()=>{
    const d=days.find(x=>x.id===dayId);if(!d)return;
    const txt=el.innerText;
    if(slot==='day')d.dayText=txt;else d.nightText=txt;
    clearTimeout(timer);
    timer=setTimeout(()=>{
      const newDet=new Set(detectActs(txt).map(a=>a.id));
      let hasNew=false;newDet.forEach(id=>{if(!lastDet.has(id))hasNew=true;});
      if(hasNew){Haptic.light();lastDet=newDet;}
      // Check for new flight codes
      const codes=extractFlightCodes(txt);
      if(codes.length)Haptic.light();
      rehighlight(el);
      // Rebuild flight strips
      const strips=document.querySelector(`#card-${dayId} .flight-strip`)?.parentElement;
      if(strips){
        const newStrips=buildFlightStrips(d);
        // Update strips area
        const card=document.getElementById('card-'+dayId);
        if(card){
          const existing=card.querySelector('.flight-strip-wrap');
          if(existing)existing.innerHTML=newStrips||'';
        }
      }
      renderOutfits();renderPack();
    },420);
  });
}

function detectActs(text){
  const lower=text.toLowerCase();const found=new Set();
  DETECT_SORTED.forEach(({word,act})=>{if(found.has(act.id))return;
    const idx=lower.indexOf(word);if(idx===-1)return;
    const b=idx===0||/[\s,.\-–•\n]/.test(text[idx-1]);
    const e2=idx+word.length;
    const a=e2>=text.length||/[\s,.\-–!?•\n]/.test(text[e2]);
    if(b&&a)found.add(act.id);});
  return[...found].map(id=>ACT_DB.find(a=>a.id===id)).filter(Boolean);
}
function getOutfitFromText(text,slot){
  const s=new Set();
  detectActs(text).forEach(a=>(slot==='day'?a.day:a.night).forEach(i=>s.add(i)));
  return[...s];
}

// ═══════════════════════════════════════
//  TOOLTIP
// ═══════════════════════════════════════
function showTip(el,data){
  const tip=document.getElementById('tip');
  if(data.type==='activity'){
    document.getElementById('tipName').textContent=data.act.label;
    document.getElementById('tipCat').textContent=data.act.category;
    const items=[...data.act.day,...data.act.night];
    document.getElementById('tipItems').innerHTML=items.map(i=>`<span class="tip-item">${esc(i)}</span>`).join('');
  }else if(data.type==='outfit'){
    document.getElementById('tipName').textContent=data.slotName;
    document.getElementById('tipCat').textContent='outfit item';
    document.getElementById('tipItems').innerHTML=data.sources.map(s=>
      `<span class="tip-item">${esc(s.actLabel)} · ${s.days.join(', ')}</span>`).join('');
  }else if(data.type==='flight'){
    const info=data.info;
    document.getElementById('tipName').textContent=info.code;
    document.getElementById('tipCat').textContent='flight';
    document.getElementById('tipItems').innerHTML=
      `<span class="tip-item">Dep ${esc(info.dep)} · Arr ${esc(info.arr)}</span>
       <span class="tip-item">Duration ${esc(info.duration)}</span>
       <span class="tip-item">${esc(info.status)}</span>`;
  }
  tip.style.display='block';
  const rect=el.getBoundingClientRect();
  const tw=tip.offsetWidth||200,th=tip.offsetHeight||80;
  let left=rect.left,top=rect.top-th-8;
  if(left+tw>window.innerWidth-8)left=window.innerWidth-tw-8;
  if(top<8)top=rect.bottom+8;
  tip.style.left=Math.max(8,left)+'px';tip.style.top=top+'px';
  tip.classList.add('show');
}
function hideTip(){
  const tip=document.getElementById('tip');
  tip.classList.remove('show');tip.style.display='none';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('.linked,.flt-code,.outfit-tip-target'))hideTip();
},{passive:true});

// ═══════════════════════════════════════
//  OUTFITS PAGE
// ═══════════════════════════════════════
function renderOutfits(){
  const wrap=document.getElementById('outfitContent');
  const perDay=days.map(day=>{
    const dest=T.destinations[day.destIdx];
    const d=[...getOutfitFromText(day.dayText||'','day'),...(customOut[day.id+'day']||[])];
    const n=[...getOutfitFromText(day.nightText||'','night'),...(customOut[day.id+'night']||[])];
    return{day,dest,d,n};
  }).filter(x=>x.d.length||x.n.length);

  const slotMap=new Map();
  perDay.forEach(({day,d,n})=>{
    const label=`Day ${day.dayNum}`;
    const addToMap=(items,slot)=>{
      items.forEach(item=>{
        if(!slotMap.has(item))slotMap.set(item,{sources:[],carry:CARRY_SET.has(item)});
        const entry=slotMap.get(item);
        const srcActs=detectActs(slot==='day'?day.dayText||'':day.nightText||'')
          .filter(a=>(slot==='day'?a.day:a.night).includes(item));
        if(srcActs.length){
          srcActs.forEach(act=>{
            let src=entry.sources.find(s=>s.actLabel===act.label);
            if(!src){src={actLabel:act.label,actId:act.id,days:[]};entry.sources.push(src);}
            src.days.push(label);
          });
        }else{
          let src=entry.sources.find(s=>s.actLabel==='Custom');
          if(!src){src={actLabel:'Custom',actId:'',days:[]};entry.sources.push(src);}
          src.days.push(label);
        }
      });
    };
    addToMap(d,'day');addToMap(n,'night');
  });

  const toggle=`<div class="out-view-toggle">
    <button class="out-toggle-btn${outView==='pack'?' on':''}" onclick="setOutView('pack')">Packing view</button>
    <button class="out-toggle-btn${outView==='day'?' on':''}" onclick="setOutView('day')">By day</button>
  </div>`;

  if(!slotMap.size){
    wrap.innerHTML=toggle+`<div class="out-empty">Type activities in your day editors to see outfit suggestions.</div>`;
    return;
  }

  let html=toggle;
  if(outView==='pack'){
    html+=`<div style="margin-top:12px">`;
    [...slotMap.entries()].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([name,data])=>{
      const total=data.sources.reduce((s,src)=>s+src.days.length,0);
      const tipData=JSON.stringify(data.sources);
      html+=`<div class="outfit-slot-row">
        <div class="osr-left">
          <div class="osr-name">
            <span class="outfit-tip-target${data.carry?' carry':''}"
              data-slot="${esc(name)}" data-tip="${esc(tipData)}">${esc(name)}</span>
          </div>
          <div class="osr-sources">${data.sources.map(s=>esc(s.actLabel)).join(', ')}</div>
        </div>
        <div class="osr-right">
          ${total>1?`<span class="osr-count">×${total}</span>`:''}
        </div>
      </div>`;
    });
    html+=`</div>`;
  }else{
    perDay.forEach(({day,dest,d,n})=>{
      const isOpen=openCards.has('out-'+day.id);
      html+=`<div class="card" id="card-out-${day.id}">
        <div class="card-hd${isOpen?' open':''}" onclick="toggleOCard('${day.id}')">
          <div class="card-hd-left">
            <div class="card-num">${day.dayNum}</div>
            <div class="card-sub">${DOW[day.date.getDay()]} ${fmt(day.date)} · <span style="color:${dest.color};font-weight:600">${esc(dest.name)}</span></div>
          </div>
          <div class="card-hd-right">
            <span class="card-count">${d.length+n.length} items</span>
            <span class="chevron${isOpen?' open':''}">▼</span>
          </div>
        </div>
        <div class="card-body${isOpen?' open':''}">
          ${d.length?`<div class="slot-head">day</div><div style="margin-bottom:8px;line-height:2">
            ${d.map(i=>`<span class="odb-item${CARRY_SET.has(i)?' carry':''}">${esc(i)}</span>`).join(' ')}
            <span class="odb-add" onclick="openAddOutfit('${day.id}','day')">+ item</span>
          </div>`:''}
          ${n.length?`<div class="slot-head" style="${d.length?'margin-top:10px':''}">evening</div><div style="line-height:2">
            ${n.map(i=>`<span class="odb-item${CARRY_SET.has(i)?' carry':''}">${esc(i)}</span>`).join(' ')}
            <span class="odb-add" onclick="openAddOutfit('${day.id}','night')">+ item</span>
          </div>`:''}
        </div>
      </div>`;
    });
  }

  wrap.innerHTML=html;

  // Attach outfit tooltips
  wrap.querySelectorAll('.outfit-tip-target').forEach(el=>{
    const raw=el.dataset.tip;if(!raw)return;
    try{
      const sources=JSON.parse(raw);
      const slotName=el.dataset.slot;
      el.addEventListener('mouseenter',()=>showTip(el,{type:'outfit',slotName,sources}));
      el.addEventListener('mouseleave',hideTip);
      el.addEventListener('touchstart',()=>{showTip(el,{type:'outfit',slotName,sources});setTimeout(hideTip,2500);},{passive:true});
    }catch(e){}
  });
}
function setOutView(v){outView=v;Haptic.light();renderOutfits();}
function toggleOCard(id){openCards.has('out-'+id)?openCards.delete('out-'+id):openCards.add('out-'+id);Haptic.light();renderOutfits();}
function openAddOutfit(dayId,slot){
  const day=days.find(d=>d.id===dayId);
  aiCtx={type:'outfit',dayId,slot};
  document.getElementById('ai-title').textContent='Add outfit item';
  document.getElementById('ai-sub').textContent=`Day ${day.dayNum} · ${slot==='day'?'Daytime':'Evening'}`;
  document.getElementById('ai-inp').value='';
  document.getElementById('ai-carry-row').style.display='flex';
  document.getElementById('ai-carry').checked=false;
  openOv('ovAI');setTimeout(()=>document.getElementById('ai-inp').focus(),280);
}

// ═══════════════════════════════════════
//  PACKING — unified three views
// ═══════════════════════════════════════
function setPackView(v){
  packView=v;
  document.querySelectorAll('.vpill').forEach((b,i)=>{
    b.classList.toggle('on',['category','bag','purpose'][i]===v);});
  const labels={category:'+ Category',bag:'+ Bag',purpose:'+ Group'};
  const sa=document.getElementById('packSecAct');
  sa.textContent=labels[v];sa.onclick=()=>openAddGroup(v);
  Haptic.light();renderPack();
}
function renderPack(){
  const allText=days.map(d=>d.dayText+' '+d.nightText).join(' ').toLowerCase();
  if(/snowboard|skiing/.test(allText)&&!CATS.find(c=>c.id==='snowgear')){
    CATS.push({id:'snowgear',name:'Snow gear',type:'sup',desc:'Equipment for the mountain'});
    PURPOSES.push({id:'snowgear',name:'Snow gear'});
    catOrder.push('snowgear');purposeOrder.push('snowgear');
    [['Snowboard / skis','trunk'],['Helmet','trunk'],['Boot bag','trunk'],['Poles','trunk']]
      .forEach(([n,b])=>ITEMS.push(mkItem(n,'snowgear',b,'snowgear',false,'',true)));
  }
  if(/camp|camping|tent/.test(allText)&&!CATS.find(c=>c.id==='campgear')){
    CATS.push({id:'campgear',name:'Camping gear',type:'sup',desc:''});
    PURPOSES.push({id:'campgear',name:'Camping gear'});
    catOrder.push('campgear');purposeOrder.push('campgear');
    [['Sleeping bag','trunk'],['Tent','trunk'],['Headlamp','backpack'],['Blanket','trunk']]
      .forEach(([n,b])=>ITEMS.push(mkItem(n,'campgear',b,'campgear',false,'',true)));
  }
  let html='';
  if(packView==='category') html=renderByCategory();
  else if(packView==='bag') html=renderByBag();
  else html=renderByPurpose();
  document.getElementById('packContent').innerHTML=html;
  const cgl=document.getElementById('cardGroupList');
  if(cgl)initDrag(cgl,newOrder=>{
    if(packView==='category')catOrder=newOrder.filter(Boolean);
    else if(packView==='bag')bagOrder=newOrder.filter(Boolean);
    else purposeOrder=newOrder.filter(Boolean);
  });
  document.querySelectorAll('.card-menu-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      document.querySelectorAll('.card-dropdown').forEach(d=>d.classList.remove('open'));
      btn.nextElementSibling?.classList.toggle('open');
    });
  });
}

function renderByCategory(){
  const ordered=catOrder.map(id=>CATS.find(c=>c.id===id)).filter(Boolean)
    .concat(CATS.filter(c=>!catOrder.includes(c.id)));
  let h=`<div class="pack-note">Items marked <strong>carry</strong> go in your bag or backpack, not checked luggage.</div>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(cat=>{
    const items=ITEMS.filter(i=>i.categoryId===cat.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('cat-'+cat.id);
    h+=packCard({id:'cat-'+cat.id,gid:cat.id,name:cat.name,sub:cat.desc||'',
      count:`${done}/${items.length}`,open,editType:'cat',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('cat','${cat.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('category')">+ Add category</button>`;
  return h;
}
function renderByBag(){
  const ordered=bagOrder.map(id=>BAGS.find(b=>b.id===id)).filter(Boolean)
    .concat(BAGS.filter(b=>!bagOrder.includes(b.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by where things physically live.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(bag=>{
    const items=ITEMS.filter(i=>i.bagId===bag.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('bag-'+bag.id);
    h+=packCard({id:'bag-'+bag.id,gid:bag.id,name:bag.name,sub:bag.desc,
      count:`${done}/${items.length}`,open,editType:'bag',
      body:items.map(i=>itemRow(i,true)).join('')+`<div class="row-add" onclick="openAddItem('bag','${bag.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('bag')">+ Add bag or location</button>`;
  return h;
}
function renderByPurpose(){
  const ordered=purposeOrder.map(id=>PURPOSES.find(p=>p.id===id)).filter(Boolean)
    .concat(PURPOSES.filter(p=>!purposeOrder.includes(p.id)));
  let h=`<p style="font-size:14px;color:hsl(var(--muted-foreground));padding:10px 0 4px">Organised by trip function.</p>
    <div class="card-group-list" id="cardGroupList">`;
  ordered.forEach(pur=>{
    const items=ITEMS.filter(i=>i.purposeId===pur.id);
    const done=items.filter(i=>i.checked).length;
    const open=openCards.has('pur-'+pur.id);
    h+=packCard({id:'pur-'+pur.id,gid:pur.id,name:pur.name,sub:'',
      count:`${done}/${items.length}`,open,editType:'purpose',
      body:items.map(i=>itemRow(i)).join('')+`<div class="row-add" onclick="openAddItem('pur','${pur.id}')">+ Add item</div>`});
  });
  h+=`</div><button class="add-card-btn" onclick="openAddGroup('purpose')">+ Add group</button>`;
  return h;
}
function itemRow(item,showBag=false){
  const ck=item.checked;
  return`<div class="list-row" data-item-id="${item.id}">
    <div class="cb${ck?' on':''}" onclick="toggleItem('${item.id}')"></div>
    <div class="item-txt${ck?' done':''}">${esc(item.name)}</div>
    ${item.carry?`<span class="carry-lbl">carry</span>`:''}
    ${item.note?`<span class="item-note">${esc(item.note)}</span>`:''}
    ${showBag&&item.categoryId?`<span class="from-lbl">${esc(CATS.find(c=>c.id===item.categoryId)?.name||'')}</span>`:''}
    <div class="synced-dot" title="Synced across all views"></div>
  </div>`;
}
function packCard({id,gid,name,sub,count,open,editType,body}){
  return`<div class="card" id="crd-${id}" data-id="${id}">
    <div class="card-hd${open?' open':''}" onclick="togglePackCard('${id}')">
      <div class="card-hd-left">
        <div class="card-name">${esc(name)}</div>
        ${sub?`<div class="card-desc">${esc(sub)}</div>`:''}
      </div>
      <div class="card-hd-right">
        <span class="card-count">${count}</span>
        <button class="card-menu-btn" aria-label="Options">⋯
          <div class="card-dropdown">
            <div class="dd-item" onclick="openEditGroup('${editType}','${gid}')">Rename / edit</div>
            <div class="dd-item danger" onclick="removeGroup('${editType}','${gid}')">Remove</div>
          </div>
        </button>
        <span class="chevron${open?' open':''}">▼</span>
      </div>
    </div>
    <div class="card-body${open?' open':''}">${body}</div>
  </div>`;
}
function togglePackCard(id){
  openCards.has(id)?openCards.delete(id):openCards.add(id);Haptic.light();
  const card=document.getElementById('crd-'+id);
  const hd=card?.querySelector('.card-hd');
  const body=card?.querySelector('.card-body');
  const chev=hd?.querySelector('.chevron');
  const open=openCards.has(id);
  hd?.classList.toggle('open',open);body?.classList.toggle('open',open);chev?.classList.toggle('open',open);
}
function toggleItem(itemId){
  const item=ITEMS.find(i=>i.id===itemId);if(!item)return;
  item.checked=!item.checked;Haptic.medium();
  document.querySelectorAll(`[data-item-id="${itemId}"]`).forEach(row=>{
    row.querySelector('.cb')?.classList.toggle('on',item.checked);
    row.querySelector('.item-txt')?.classList.toggle('done',item.checked);
  });
  document.querySelectorAll('.card-count').forEach(el=>{
    const body=el.closest('.card')?.querySelector('.card-body');if(!body)return;
    const rows=body.querySelectorAll('[data-item-id]');
    const done=[...rows].filter(r=>r.querySelector('.cb.on')).length;
    el.textContent=`${done}/${rows.length}`;
  });
}
function openAddItem(viewType,groupId){
  aiCtx={type:'packitem',viewType,groupId};
  const groupName=viewType==='cat'?CATS.find(c=>c.id===groupId)?.name:
    viewType==='bag'?BAGS.find(b=>b.id===groupId)?.name:PURPOSES.find(p=>p.id===groupId)?.name;
  document.getElementById('ai-title').textContent='Add item';
  document.getElementById('ai-sub').textContent=groupName||'';
  document.getElementById('ai-inp').value='';
  document.getElementById('ai-carry-row').style.display='flex';
  document.getElementById('ai-carry').checked=false;
  openOv('ovAI');setTimeout(()=>document.getElementById('ai-inp').focus(),280);
}
function openEditGroup(type,id){
  editCtx={type,id};
  let name='',desc='';
  if(type==='cat'){const c=CATS.find(x=>x.id===id);name=c?.name||'';desc=c?.desc||'';}
  else if(type==='bag'){const b=BAGS.find(x=>x.id===id);name=b?.name||'';desc=b?.desc||'';}
  else{const p=PURPOSES.find(x=>x.id===id);name=p?.name||'';}
  document.getElementById('edit-title').textContent='Edit';
  document.getElementById('edit-name').value=name;
  document.getElementById('edit-desc').value=desc;
  document.getElementById('edit-desc-lbl').style.display=type==='purpose'?'none':'block';
  document.getElementById('edit-desc').style.display=type==='purpose'?'none':'block';
  openOv('ovEdit');setTimeout(()=>document.getElementById('edit-name').focus(),280);
}
function commitEdit(){
  if(!editCtx)return;
  const nm=document.getElementById('edit-name').value.trim();if(!nm)return;
  const dc=document.getElementById('edit-desc').value.trim();
  if(editCtx.type==='cat'){const c=CATS.find(x=>x.id===editCtx.id);if(c){c.name=nm;c.desc=dc;}}
  else if(editCtx.type==='bag'){const b=BAGS.find(x=>x.id===editCtx.id);if(b){b.name=nm;b.desc=dc;}}
  else{const p=PURPOSES.find(x=>x.id===editCtx.id);if(p)p.name=nm;}
  closeAll();Haptic.medium();renderPack();
}
function commitRemove(){if(editCtx)removeGroup(editCtx.type,editCtx.id);}
function removeGroup(type,id){
  if(type==='cat'){CATS=CATS.filter(c=>c.id!==id);ITEMS=ITEMS.filter(i=>i.categoryId!==id);catOrder=catOrder.filter(x=>x!==id);}
  else if(type==='bag'){BAGS=BAGS.filter(b=>b.id!==id);bagOrder=bagOrder.filter(x=>x!==id);}
  else{PURPOSES=PURPOSES.filter(p=>p.id!==id);purposeOrder=purposeOrder.filter(x=>x!==id);}
  Haptic.medium();closeAll();renderPack();
}
function openAddGroup(type){
  agCtx={type};
  const labels={category:'New category',bag:'New bag or location',purpose:'New group'};
  const subs={category:'e.g. Electronics, Documents',bag:'e.g. Tote bag, Car backseat',purpose:'e.g. Climbing gear, Food'};
  document.getElementById('ag-title').textContent=labels[type]||'New group';
  document.getElementById('ag-sub').textContent=subs[type]||'';
  document.getElementById('ag-name').value='';
  document.getElementById('ag-desc').value='';
  openOv('ovAG');setTimeout(()=>document.getElementById('ag-name').focus(),280);
}
function commitGroup(){
  const nm=document.getElementById('ag-name').value.trim();if(!nm)return;
  const dc=document.getElementById('ag-desc').value.trim();
  const id='grp-'+Date.now();
  if(agCtx?.type==='category'){CATS.push({id,name:nm,desc:dc,type:'custom'});catOrder.push(id);}
  else if(agCtx?.type==='bag'){BAGS.push({id,name:nm,desc:dc});bagOrder.push(id);}
  else{PURPOSES.push({id,name:nm});purposeOrder.push(id);}
  openCards.add((agCtx?.type==='category'?'cat-':agCtx?.type==='bag'?'bag-':'pur-')+id);
  closeAll();Haptic.medium();renderPack();
}

// ═══════════════════════════════════════
//  COMMIT ITEM
// ═══════════════════════════════════════
function commitItem(){
  const nm=document.getElementById('ai-inp').value.trim();if(!nm||!aiCtx)return;
  const carry=document.getElementById('ai-carry').checked;
  if(aiCtx.type==='outfit'){
    const key=aiCtx.dayId+aiCtx.slot;
    if(!customOut[key])customOut[key]=[];
    customOut[key].push(nm);if(carry)CARRY_SET.add(nm);
    closeAll();Haptic.medium();renderOutfits();
  }else if(aiCtx.type==='packitem'){
    let catId='health',bagId='main',purId='toiletry';
    if(aiCtx.viewType==='cat'){catId=aiCtx.groupId;purId=CATS.find(c=>c.id===aiCtx.groupId)?.type==='toi'?'toiletry':'tech';}
    else if(aiCtx.viewType==='bag'){bagId=aiCtx.groupId;}
    else{purId=aiCtx.groupId;}
    ITEMS.push(mkItem(nm,catId,bagId,purId,carry));
    closeAll();Haptic.medium();renderPack();
  }
}

// ═══════════════════════════════════════
//  EDIT TRIP
// ═══════════════════════════════════════
function openEditTrip(){
  document.getElementById('et-name').value=T.name;
  document.getElementById('et-depd').value=T.depDate;
  document.getElementById('et-dept').value=T.depTime;
  document.getElementById('et-retd').value=T.retDate;
  const dc=document.getElementById('etDestList');dc.innerHTML='';
  T.destinations.forEach(d=>{
    const row=document.createElement('div');row.className='et-dest-row';
    row.innerHTML=`<span class="et-handle">⠿</span>
      <input class="sh-inp" style="flex:1;margin-bottom:0" value="${esc(d.name)}" autocomplete="off">
      <input class="sh-inp sf-mini" style="margin-bottom:0" type="number" min="1" value="${d.nights}">
      <button class="dest-rm" onclick="destRm(this)">×</button>`;
    dc.appendChild(row);
  });
  initDrag(dc);openOv('ovET');Haptic.light();
}
function etDestAdd(){
  const dc=document.getElementById('etDestList');
  const row=document.createElement('div');row.className='et-dest-row';
  row.innerHTML=`<span class="et-handle">⠿</span>
    <input class="sh-inp" style="flex:1;margin-bottom:0" placeholder="Destination" autocomplete="off">
    <input class="sh-inp sf-mini" style="margin-bottom:0" type="number" min="1" placeholder="nts">
    <button class="dest-rm" onclick="destRm(this)">×</button>`;
  dc.appendChild(row);initDrag(dc);Haptic.light();
}
function saveTrip(){
  T.name=document.getElementById('et-name').value.trim()||T.name;
  T.depDate=document.getElementById('et-depd').value||T.depDate;
  T.depTime=document.getElementById('et-dept').value||T.depTime;
  T.retDate=document.getElementById('et-retd').value||T.retDate;
  readDests('etDestList');buildDays();closeAll();Haptic.success();renderAll();
}

// ═══════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════
function openOv(id){closeAll();document.getElementById(id).classList.add('open');}
function closeAll(){
  document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('open'));
  document.querySelectorAll('.card-dropdown').forEach(d=>d.classList.remove('open'));
}
function goNav(id){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('nb-'+id).classList.add('on');
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('on'));
  document.getElementById('sec-'+id).classList.add('on');
  document.getElementById('mainScr').scrollTop=0;
  Haptic.light();
  if(id==='pack'){setPackView(packView);}
  if(id==='outfits')renderOutfits();
}
