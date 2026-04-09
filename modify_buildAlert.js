const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const targetAlert = `function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim'))
    return\`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('\${day.id}','swim')">Skip</span></div>\`;
  return'';
}`;

const replaceAlert = `function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  let h='';
  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim')) {
    h+=\`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('\${day.id}','swim')">Skip</span></div>\`;
  }

  if(/(dinner|bar|concert|nightlife)/.test(day.nightText?.toLowerCase()||'') && !/(sleepwear|pyjamas|outfit)/.test(all) && !day._dismissed.has('night')) {
     h+=\`<div class="smart-alert"><div class="sa-text">No evening outfit or sleepwear added.</div>
      <span class="sa-skip" onclick="dismiss('\${day.id}','night')">Skip</span></div>\`;
  }

  return h;
}`;

if (content.includes(targetAlert)) {
    content = content.replace(targetAlert, replaceAlert);
    console.log("buildAlert replaced");
} else {
    console.log("buildAlert target not found");
}

fs.writeFileSync('index.html', content);
