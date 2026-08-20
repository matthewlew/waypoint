const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const completenessSearch = `
function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim'))
    return\`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('\${day.id}','swim')">Skip</span></div>\`;
  return'';
}`;
const completenessReplace = `
function buildAlert(day){
  const all=(day.dayText+' '+day.nightText).toLowerCase();
  let alerts = '';

  if(/(hot tub|jacuzzi|pool|hot spring)/.test(all)&&!/swim|beach|swimwear/.test(all)&&!day._dismissed.has('swim')) {
    alerts += \`<div class="smart-alert"><div class="sa-text">Hot tub or pool — swimsuit not detected yet.</div>
      <span class="sa-skip" onclick="dismiss('\${day.id}','swim')">Skip</span></div>\`;
  }

  // Check for evening outfit if evening text exists but no outfit is explicitly assigned or detected
  if (day.nightText && day.nightText.trim().length > 0 && !day._dismissed.has('evening_outfit')) {
     const nOutfit = getOutfitFromText(day.nightText, 'night');
     const customN = customOut[day.id+'night'] || [];
     if (nOutfit.length === 0 && customN.length === 0) {
        alerts += \`<div class="smart-alert"><div class="sa-text">Evening activities planned, but no evening outfit assigned.</div>
          <span class="sa-skip" onclick="dismiss('\${day.id}','evening_outfit')">Skip</span></div>\`;
     }
  }

  // Check for sleepwear/pyjamas
  if (!day._dismissed.has('sleepwear')) {
     const allItems = [...getOutfitFromText(all, 'day'), ...getOutfitFromText(all, 'night'), ...(customOut[day.id+'day']||[]), ...(customOut[day.id+'night']||[])];
     const dayPacked = ITEMS.filter(i => (i.dayIds||[]).includes(day.id)).map(i => i.name.toLowerCase());

     const hasSleepwear = allItems.some(i => i.toLowerCase().includes('pyjamas') || i.toLowerCase().includes('sleepwear')) ||
                          dayPacked.some(n => n.includes('pyjama') || n.includes('sleepwear') || n.includes('pjs'));

     // Only show sleepwear alert if it's the last day at a destination or just in general if they haven't packed any across the trip?
     // For simplicity, let's just suggest it if "rest" or "sleep" is mentioned and no sleepwear is packed.
     if (/(rest|sleep|night|bed)/.test(all) && !hasSleepwear) {
        alerts += \`<div class="smart-alert"><div class="sa-text">Consider packing sleepwear for the night.</div>
          <span class="sa-skip" onclick="dismiss('\${day.id}','sleepwear')">Skip</span></div>\`;
     }
  }

  return alerts;
}`;

html = html.replace(completenessSearch, completenessReplace);

const toastHTML = `
<!-- TOAST -->
<div id="toast" style="position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(100px); background:hsl(var(--foreground)); color:#fff; padding:12px 24px; border-radius:30px; font-size:14px; font-weight:500; opacity:0; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index:1000; pointer-events:none; box-shadow:0 4px 12px rgba(0,0,0,0.15);"></div>
`;

html = html.replace('</body>', toastHTML + '\n</body>');

const toastJS = `
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  t.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.transform = 'translateX(-50%) translateY(100px)';
    t.style.opacity = '0';
  }, 3000);
}
`;

html = html.replace('// ═══════════════════════════════════════\n//  UTILITIES', toastJS + '\n// ═══════════════════════════════════════\n//  UTILITIES');

html = html.replace(
  `closeAll();Haptic.medium();renderPack();\n  }\n}\n`,
  `closeAll();Haptic.medium();renderPack();\n    if (typeof showToast === 'function') showToast('Saved to Closet');\n  }\n}\n`
);


fs.writeFileSync('index.html', html);
console.log('Patched completeness and toast.');
