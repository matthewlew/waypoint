import re

with open('index.html', 'r') as f:
    content = f.read()

# Enhance buildDayCard
old_buildDayCard = """function buildDayCard(day){
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
}"""

new_buildDayCard = """function buildDayCard(day){
  const dest=T.destinations[day.destIdx];
  const isOpen=openCards.has(day.id);
  const alert=buildAlert(day);
  // Build any flight strips for detected codes
  const flightStrips=buildFlightStrips(day);

  // Directly attached items
  const attachedItems = ITEMS.filter(i => (i.dayIds||[]).includes(day.id));
  const attachedHtml = attachedItems.length > 0 ?
    `<div class="slot-head" style="margin-top:16px;">attached items</div>` +
    attachedItems.map(i => itemRow(i, true)).join('') : '';

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
      ${attachedHtml}
      <div class="row-add" style="margin-top:12px; border-top:1px dashed hsl(var(--border)); padding-top:12px;" onclick="openAddItem('day','${day.id}')">+ Add item</div>
    </div>
  </div>`;
}"""

content = content.replace(old_buildDayCard, new_buildDayCard)

with open('index.html', 'w') as f:
    f.write(content)
