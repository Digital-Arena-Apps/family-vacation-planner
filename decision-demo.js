// Vacation Planner V2.5 — Decision Engine Demo
// Focused Orlando demo layered on top of the existing working app.
(() => {
  'use strict';

  const STORAGE_KEY = 'vp_decision_demo_v25';
  const DEMO = {
    trip: {
      name: 'Orlando Family Vacation',
      day: 'Day 5 of 10',
      dates: '18–27 August 2026',
      accommodation: 'Windsor at Westside villa · Kissimmee',
      transport: 'Rental car available',
      pace: 'Balanced',
      budget: 'Comfortable family spend',
      walking: 'Moderate · lower energy today'
    },
    now: {
      time: '2:30 PM',
      place: 'At the villa · Kissimmee',
      temperature: '91°F / 33°C',
      feels: 'Feels 99°F / 37°C',
      weather: 'Thunderstorms from about 3:00–6:00 PM',
      available: 'About 4½ hours before dinner'
    },
    travellers: [
      {name:'Jordan', age:42, detail:'Food, scenic stops · medium thrill · moderate walking'},
      {name:'Casey', age:40, detail:'Gluten-free · low/medium thrill · moderate walking'},
      {name:'Maya', age:16, detail:'Photography, shopping · low thrill · low energy today'},
      {name:'Noah', age:13, detail:'Gaming, big rides · high thrill · 60 in / 152 cm'},
      {name:'Leo', age:9, detail:'Animals, arcades · medium thrill · 46 in / 117 cm'}
    ],
    fixed: [
      {time:'7:30 PM', title:"Ford's Garage · Sunset Walk", detail:'Dinner reservation tonight · fixed', day:'Today'},
      {time:'7:30 PM', title:'The Boathouse · Disney Springs', detail:'Dinner reservation · fixed', day:'Tomorrow'}
    ],
    visited: ['Magic Kingdom', 'Universal Studios Florida', 'Disney Springs'],
    skipped: ['Afternoon mini golf · too hot / low group interest'],
    saved: [
      {title:"Ford's Garage", why:'Family-friendly burgers and useful gluten-free options.', source:'Recommended before the trip', priority:'Booked tonight'},
      {title:'Gatorland', why:'Leo loves animals; different pace after two theme-park days.', source:'Saved by the family', priority:'Must do'},
      {title:'Boggy Creek Airboat Adventures', why:'Outdoor Florida experience the group has not done yet.', source:'Saved before arrival', priority:'Want to visit'}
    ]
  };

  const RECOMMENDATIONS = {
    sea: {
      id:'sea', icon:'🐠', name:'SEA LIFE Orlando Aquarium', badge:'Best overall fit', score:'94%',
      drive:'24 min', distance:'14 mi', duration:'1½–2 hours', cost:'$$ · about $120 family', suitability:'Excellent for all 5',
      leave:'Leave about 2:45 PM',
      why:['Indoors before the storms arrive','Low walking for Maya’s lower-energy afternoon','Works for Leo, the teens and adults','Not visited yet','Leaves a comfortable buffer before the 7:30 PM dinner'],
      summary:'Indoor, low-effort and broad family appeal — the cleanest fit for the weather window.'
    },
    movie: {
      id:'movie', icon:'🎬', name:'Studio Movie Grill · Sunset Walk', badge:'Easiest option', score:'91%',
      drive:'13 min', distance:'7 mi', duration:'2 hours', cost:'$$ · movie + snacks', suitability:'Very easy group fit',
      leave:'Leave about 3:05 PM',
      why:['Fully indoors during the storm window','Mostly seated — useful after two busy park days','Same area as tonight’s Ford’s Garage booking','Minimal extra driving','Easy option if the family wants a quieter afternoon'],
      summary:'The low-energy choice, and it puts you beside dinner instead of creating another journey.'
    },
    main: {
      id:'main', icon:'🎳', name:'Main Event Orlando', badge:'Best for mixed energy', score:'88%',
      drive:'20 min', distance:'12 mi', duration:'2 hours', cost:'$$ · flexible spend', suitability:'Good for all 5',
      leave:'Leave about 2:50 PM',
      why:['Indoor bowling and arcade options','No single activity has to suit everyone','No long outdoor queues','No height issue for the core activities','Still realistic before dinner'],
      summary:'A flexible indoor option when Noah wants activity but Maya needs something less demanding.'
    },
    museum: {
      id:'museum', icon:'🪞', name:'Museum of Illusions Orlando', badge:'Low-walking swap', score:'87%',
      drive:'23 min', distance:'13 mi', duration:'75–90 min', cost:'$$', suitability:'Good for all 5',
      leave:'Leave about 2:50 PM',
      why:['Indoors through the thunderstorm window','Shorter visit with lower walking','Photography-friendly for Maya','Suitable across the age range','Easy to finish well before dinner'],
      summary:'A shorter, lighter afternoon when energy matters more than squeezing in another major attraction.'
    },
    villa: {
      id:'villa', icon:'🏡', name:'Stay at the villa & reset', badge:'Best value', score:'85%',
      drive:'0 min', distance:'0 mi', duration:'2–3 hours', cost:'$ · already paid for', suitability:'Easy for everyone',
      leave:'No need to leave yet',
      why:['Costs almost nothing','Avoids the worst weather completely','Gives tired family members a proper reset','You can leave for dinner after the storm band passes','Protects energy for tomorrow’s must-do'],
      summary:'Doing less is sometimes the better holiday decision — especially before a fixed evening booking.'
    },
    crayola: {
      id:'crayola', icon:'🖍️', name:'Crayola Experience Orlando', badge:'Family-friendly backup', score:'84%',
      drive:'25 min', distance:'16 mi', duration:'2 hours', cost:'$$', suitability:'Strongest for Leo, still workable for group',
      leave:'Leave about 2:45 PM',
      why:['Indoor weather-safe option','Strong fit for Leo','Flexible visit length','No major walking burden','Can still make dinner without rushing'],
      summary:'A dependable weather-proof choice if the group wants something more hands-on.'
    }
  };

  const PLAN_TOMORROW = [
    {time:'8:00 AM', part:'Morning', title:'Breakfast at the villa', detail:'Easy start after two high-step park days.', type:'flex'},
    {time:'8:45 AM', part:'Travel', title:'Leave the villa', detail:'About 25 minutes to Gatorland with a little arrival buffer.', type:'travel'},
    {time:'9:15 AM', part:'Morning', title:'Gatorland', detail:'Saved as a must-do. Outdoor time goes first while the forecast is drier and cooler.', type:'flex'},
    {time:'12:15 PM', part:'Lunch', title:"Miller's Ale House · Hunter's Creek", detail:'Short drive, broad menu and a sensible break before the indoor afternoon.', type:'flex'},
    {time:'1:30 PM', part:'Afternoon', title:'SEA LIFE Orlando Aquarium', detail:'Indoor option through the likeliest thunderstorm period; lower walking than another park.', type:'flex'},
    {time:'4:15 PM', part:'Reset', title:'Back to the villa', detail:'About 90 minutes to cool down, change and recharge before dinner.', type:'flex'},
    {time:'6:45 PM', part:'Travel', title:'Leave for Disney Springs', detail:'Allows parking and walking time without turning dinner into a rush.', type:'travel'},
    {time:'7:30 PM', part:'Evening', title:'The Boathouse · Disney Springs', detail:'Dinner reservation — this stays fixed.', type:'fixed'},
    {time:'9:00 PM', part:'Optional', title:'Short Disney Springs wander', detail:'Only if everyone still has energy and the weather has cleared.', type:'optional'}
  ];

  const FIX_ORIGINAL = [
    {time:'9:15 AM', title:'Gatorland', detail:'Saved must-do · outdoor', type:'flex'},
    {time:'12:15 PM', title:'Lunch · Hunter’s Creek', detail:'Flexible', type:'flex'},
    {time:'2:30 PM', title:'Boggy Creek Airboat Adventures', detail:'Outdoor · weather sensitive', type:'risk'},
    {time:'7:30 PM', title:'The Boathouse · Disney Springs', detail:'Dinner reservation', type:'fixed'}
  ];

  const loadState = () => {
    try {
      return Object.assign({saved:{}, rejected:{}, chosen:null, lastReason:null, fixReason:'storms', fixApplied:false}, JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'));
    } catch {
      return {saved:{}, rejected:{}, chosen:null, lastReason:null, fixReason:'storms', fixApplied:false};
    }
  };
  let demoState = loadState();
  let pendingRejectId = null;

  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const safe = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const toast = msg => { try { if(typeof showToast === 'function') return showToast(msg); } catch {} const el=$('#vpDemoToast'); if(!el)return; el.textContent=msg; el.classList.remove('hidden'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.add('hidden'),2200); };

  function recommendationOrder(){
    const rejected = new Set(Object.keys(demoState.rejected||{}));
    let order = ['sea','movie','main','museum','villa','crayola'];
    if(demoState.lastReason==='too_expensive') order=['villa','movie','museum','sea','main','crayola'];
    if(demoState.lastReason==='too_far') order=['movie','villa','main','sea','museum','crayola'];
    if(demoState.lastReason==='too_tiring') order=['movie','villa','museum','sea','main','crayola'];
    if(demoState.lastReason==='not_interested') order=['main','sea','movie','museum','villa','crayola'];
    if(demoState.lastReason==='doesnt_suit') order=['sea','movie','crayola','villa','museum','main'];
    return order.filter(id=>!rejected.has(id)).slice(0,3).map(id=>RECOMMENDATIONS[id]);
  }

  function learningCopy(){
    const map={
      too_expensive:'I’ve pushed lower-cost choices up for this trip.',
      too_far:'I’ve tightened the driving radius for the next set.',
      too_tiring:'I’m favouring seated and lower-walking ideas now.',
      not_interested:'Got it — I’m moving away from that type of activity.',
      already_done:'I’ve marked it as done and won’t keep suggesting it.',
      doesnt_suit:'I’m weighting whole-family fit more heavily.',
      something_else:'I’ve taken that option out of the current shortlist.'
    };
    return map[demoState.lastReason]||'';
  }

  function buildHome(){
    const today=$('.view[data-view="today"]');
    if(!today || $('#vpDecisionHome')) return;

    const eyebrow=$('#todayLocationEyebrow'); if(eyebrow) eyebrow.textContent='ORLANDO · DAY 5 OF 10';
    const greeting=$('#todayGreeting'); if(greeting) greeting.textContent=DEMO.trip.name;
    const copy=$('#todayGreetingCopy'); if(copy) copy.textContent='You’re at the villa. I already have the family, bookings and trip history.';

    const home=document.createElement('section');
    home.id='vpDecisionHome';
    home.className='vp-decision-home';
    home.innerHTML=`
      <div class="vp-demo-label">DEMO SCENARIO · KISSIMMEE, FLORIDA</div>
      <section class="vp-situation-card">
        <div class="vp-situation-top">
          <div><span>RIGHT NOW</span><strong>${DEMO.now.time}</strong><small>${DEMO.now.place}</small></div>
          <div class="vp-weather-bubble"><b>⛈️ ${DEMO.now.temperature}</b><small>${DEMO.now.weather}</small></div>
        </div>
        <div class="vp-context-pills">
          <span>🚗 Car available</span><span>😮‍💨 Lower energy</span><span>⏱️ ${DEMO.now.available}</span><span>🔒 Dinner 7:30 PM</span>
        </div>
      </section>

      <div class="vp-help-heading"><div class="eyebrow">YOUR VACATION, WORKED OUT</div><h2>What would you like help with?</h2><p>I’ll use what I already know about this trip — you don’t need to explain it again.</p></div>

      <div class="vp-job-grid">
        <button type="button" class="vp-job-card vp-job-primary" data-vp-open="now">
          <span class="vp-job-icon">⚡</span><div><b>What Now?</b><small>Help us decide what makes sense to do next.</small><em>Uses time · weather · family · dinner booking</em></div><span class="vp-arrow">›</span>
        </button>
        <button type="button" class="vp-job-card" data-vp-open="tomorrow">
          <span class="vp-job-icon">☀️</span><div><b>Plan Tomorrow</b><small>Build us a realistic day around our plans.</small><em>Works around a fixed 7:30 PM reservation</em></div><span class="vp-arrow">›</span>
        </button>
        <button type="button" class="vp-job-card" data-vp-open="fix">
          <span class="vp-job-icon">🛠️</span><div><b>Fix My Day</b><small>Something changed — reorganise the plan.</small><em>Demo: thunderstorms arrive earlier</em></div><span class="vp-arrow">›</span>
        </button>
      </div>

      <section id="vpChosenSummary" class="vp-chosen-summary hidden"></section>

      <button type="button" class="vp-memory-card" data-vp-open="memory">
        <div><span class="eyebrow">WHAT I ALREADY KNOW</span><b>5 travellers · 2 fixed plans · 3 saved ideas</b><small>Balanced pace · gluten-free need · mixed thrill levels · moderate budget</small></div><span>See trip memory ›</span>
      </button>
    `;

    const weather=$('#weatherCard',today);
    if(weather) weather.parentNode.insertBefore(home,weather); else today.prepend(home);
    updateChosenSummary();
  }

  function updateChosenSummary(){
    const box=$('#vpChosenSummary'); if(!box)return;
    const r=RECOMMENDATIONS[demoState.chosen];
    if(!r){box.classList.add('hidden');box.innerHTML='';return;}
    box.classList.remove('hidden');
    box.innerHTML=`<span>✓ NEXT UP</span><b>${safe(r.name)}</b><small>${safe(r.leave)} · ${safe(r.duration)} · still leaves a comfortable buffer before dinner.</small><button type="button" data-vp-open="now">View decision</button>`;
  }

  function buildTripContext(){
    const trip=$('.view[data-view="trip"]');
    if(!trip || $('#vpDemoTripContext')) return;
    const card=document.createElement('section');
    card.id='vpDemoTripContext';
    card.className='vp-demo-trip-context';
    card.innerHTML=tripMemoryMarkup(false);
    const heading=trip.querySelector('.page-heading');
    if(heading && heading.nextSibling) heading.parentNode.insertBefore(card,heading.nextSibling); else trip.prepend(card);
  }

  function tripMemoryMarkup(inOverlay=true){
    return `
      <div class="vp-memory-intro"><div class="eyebrow">THE CONTEXT I PLAN WITH</div><h2>${DEMO.trip.name}</h2><p>Tell me once. I keep the useful bits in mind when I recommend, plan or replan.</p></div>
      <div class="vp-memory-grid">
        <section><span>YOUR TRIP</span><b>Orlando · ${DEMO.trip.dates}</b><small>${DEMO.trip.accommodation}<br>${DEMO.trip.transport}</small></section>
        <section><span>PREFERENCES</span><b>${DEMO.trip.pace} pace · ${DEMO.trip.budget}</b><small>${DEMO.trip.walking}</small></section>
      </div>
      <div class="vp-memory-section"><h3>Travellers</h3><div class="vp-traveller-list">${DEMO.travellers.map(t=>`<div><b>${safe(t.name)} · ${t.age}</b><small>${safe(t.detail)}</small></div>`).join('')}</div></div>
      <div class="vp-memory-section"><h3>Fixed plans</h3>${DEMO.fixed.map(f=>`<div class="vp-fixed-row"><span>🔒</span><div><b>${safe(f.day)} · ${safe(f.time)} · ${safe(f.title)}</b><small>${safe(f.detail)}</small></div></div>`).join('')}</div>
      <div class="vp-memory-section"><h3>Saved with context</h3>${DEMO.saved.map(s=>`<div class="vp-saved-row"><div><b>${safe(s.title)}</b><small>“${safe(s.why)}”</small><em>${safe(s.source)} · ${safe(s.priority)}</em></div></div>`).join('')}</div>
      <div class="vp-memory-section vp-memory-compact"><h3>Already learned</h3><p><b>Visited:</b> ${DEMO.visited.join(' · ')}</p><p><b>Skip:</b> ${DEMO.skipped.join('')}</p></div>
      ${inOverlay?'<div class="vp-memory-foot">This is demo data, but it shows the production model: persistent trip context becomes an input to every decision.</div>':''}
    `;
  }

  function buildOverlay(){
    if($('#vpDecisionOverlay'))return;
    const overlay=document.createElement('div');
    overlay.id='vpDecisionOverlay';
    overlay.className='vp-demo-overlay hidden';
    overlay.innerHTML=`<div class="vp-demo-panel"><header><button type="button" class="vp-demo-close" data-vp-close aria-label="Close">←</button><div><span id="vpPanelKicker">VACATION PLANNER</span><b id="vpPanelTitle">Decision</b></div><span class="vp-demo-badge">DEMO</span></header><main id="vpPanelBody"></main></div>`;
    document.body.appendChild(overlay);

    const feedback=document.createElement('div');
    feedback.id='vpFeedbackSheet';
    feedback.className='vp-feedback-overlay hidden';
    feedback.innerHTML=`<div class="vp-feedback-card"><button class="vp-feedback-close" type="button" data-vp-feedback-close>×</button><span>HELP ME LEARN THIS TRIP</span><h3 id="vpFeedbackTitle">What’s the main reason?</h3><div class="vp-feedback-grid">
      <button data-vp-reason="too_expensive">💸 <b>Too expensive</b></button>
      <button data-vp-reason="too_far">🚗 <b>Too far</b></button>
      <button data-vp-reason="too_tiring">😮‍💨 <b>Too tiring</b></button>
      <button data-vp-reason="not_interested">🙅 <b>Not interested</b></button>
      <button data-vp-reason="already_done">✓ <b>Already done it</b></button>
      <button data-vp-reason="doesnt_suit">👨‍👩‍👧 <b>Doesn’t suit someone</b></button>
      <button data-vp-reason="something_else">… <b>Something else</b></button>
    </div><small>I’ll use this for this travelling group, not just remove one card.</small></div>`;
    document.body.appendChild(feedback);

    const toastEl=document.createElement('div'); toastEl.id='vpDemoToast';toastEl.className='vp-demo-toast hidden';document.body.appendChild(toastEl);
  }

  function panelHeader(kicker,title){ $('#vpPanelKicker').textContent=kicker; $('#vpPanelTitle').textContent=title; }
  function openPanel(type){
    const overlay=$('#vpDecisionOverlay'); if(!overlay)return;
    overlay.classList.remove('hidden'); document.body.classList.add('vp-panel-open');
    if(type==='now') renderWhatNow();
    else if(type==='tomorrow') renderTomorrow();
    else if(type==='fix') renderFix();
    else renderMemory();
    overlay.scrollTop=0;
  }
  function closePanel(){ $('#vpDecisionOverlay')?.classList.add('hidden'); document.body.classList.remove('vp-panel-open'); closeFeedback(); }

  function contextStrip(){
    return `<div class="vp-panel-context"><span>📍 Villa</span><span>🕝 ${DEMO.now.time}</span><span>⛈️ Storms from 3</span><span>🔒 Dinner 7:30</span></div>`;
  }

  function renderWhatNow(){
    panelHeader('WHAT NOW?','Three choices that make sense');
    const recs=recommendationOrder();
    const learning=learningCopy();
    $('#vpPanelBody').innerHTML=`
      ${contextStrip()}
      <section class="vp-reason-hero"><span>I’VE USED YOUR TRIP CONTEXT</span><h2>You’ve got time — but the weather and dinner booking narrow the sensible options.</h2><p>I’ve ruled out outdoor plans after 3 PM. I’m also not ranking Andretti highly today: Leo’s height and Maya’s lower thrill/energy preference make it a weaker whole-family fit.</p></section>
      ${learning?`<div class="vp-learning-note">✓ ${safe(learning)} <b>That preference now affects this trip’s next suggestions.</b></div>`:''}
      <div class="vp-rec-list">${recs.map(recommendationMarkup).join('')}</div>
      <div class="vp-decision-foot"><b>Why only three?</b><span>The job here is to help you decide, not make you research another list.</span></div>
    `;
  }

  function recommendationMarkup(r){
    const chosen=demoState.chosen===r.id, saved=!!demoState.saved[r.id];
    return `<article class="vp-rec-card ${chosen?'chosen':''}" data-rec-id="${r.id}">
      <div class="vp-rec-head"><div class="vp-rec-icon">${r.icon}</div><div><span>${r.badge} · ${r.score} fit</span><h3>${safe(r.name)}</h3><p>${safe(r.summary)}</p></div></div>
      <div class="vp-rec-facts"><span>🚗 ${r.drive}</span><span>⏱️ ${r.duration}</span><span>💵 ${r.cost}</span><span>👨‍👩‍👧 ${r.suitability}</span></div>
      <details class="vp-why" ${r.id==='sea'?'open':''}><summary>Why I’m suggesting this <span>›</span></summary><ul>${r.why.map(x=>`<li>${safe(x)}</li>`).join('')}</ul><div class="vp-leave-line">${safe(r.leave)}</div></details>
      <div class="vp-rec-actions">
        <button type="button" class="vp-choose" data-vp-choose="${r.id}">${chosen?'✓ Chosen':'Choose this'}</button>
        <button type="button" class="vp-save" data-vp-save="${r.id}">${saved?'✓ Saved':'Save for later'}</button>
        <button type="button" class="vp-reject" data-vp-reject="${r.id}">Not for us</button>
      </div>
    </article>`;
  }

  function chooseRecommendation(id){
    const r=RECOMMENDATIONS[id]; if(!r)return;
    demoState.chosen=id; saveState(); updateChosenSummary(); renderWhatNow();
    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_accepted',{id,name:r.name,source:'v2.5-demo'}); } catch {}
    toast(`Good choice — ${r.name} is now your next plan.`);
  }
  function toggleSave(id){
    demoState.saved[id]=!demoState.saved[id]; saveState(); renderWhatNow(); toast(demoState.saved[id]?'Saved with this trip.':'Removed from saved ideas.');
  }
  function openFeedback(id){ pendingRejectId=id; const r=RECOMMENDATIONS[id]; $('#vpFeedbackTitle').textContent=`Why doesn’t ${r?.name||'this'} work?`; $('#vpFeedbackSheet').classList.remove('hidden'); }
  function closeFeedback(){ pendingRejectId=null; $('#vpFeedbackSheet')?.classList.add('hidden'); }
  function rejectReason(reason){
    if(!pendingRejectId)return;
    demoState.rejected[pendingRejectId]={reason,at:new Date().toISOString()}; demoState.lastReason=reason; if(demoState.chosen===pendingRejectId)demoState.chosen=null; saveState(); closeFeedback(); updateChosenSummary(); renderWhatNow();
    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_rejected',{id:pendingRejectId,reason,source:'v2.5-demo'}); } catch {}
    toast('Got it — I’ve adjusted the next set.');
  }

  function renderTomorrow(){
    panelHeader('PLAN TOMORROW','A day you can actually follow');
    $('#vpPanelBody').innerHTML=`
      <div class="vp-tomorrow-head"><div><span>SUNDAY · ORLANDO</span><h2>Outdoor first. Indoor through the storms. Dinner stays fixed.</h2></div><div class="vp-forecast-chip">🌦️ 88°F / 31°C<br><small>Storm risk after 2:30 PM</small></div></div>
      <div class="vp-plan-timeline">${PLAN_TOMORROW.map(planRow).join('')}</div>
      <section class="vp-plan-why"><span>WHY THIS PLAN WORKS</span><ul>
        <li><b>Gatorland is already a saved must-do</b>, so it gets the best morning weather window.</li>
        <li>The afternoon moves indoors before the usual storm build-up.</li>
        <li>There’s a deliberate villa reset after two high-step theme-park days.</li>
        <li>The <b>7:30 PM Boathouse reservation is fixed</b>; everything else bends around it.</li>
        <li>Magic Kingdom and Universal are not suggested again because this trip already records them as visited.</li>
      </ul></section>
      <button type="button" class="vp-primary-wide" data-vp-open="fix">Something changed? Fix this day →</button>
    `;
  }

  function planRow(item){
    const label=item.type==='fixed'?'🔒 FIXED':item.type==='travel'?'DRIVE':item.type==='optional'?'OPTIONAL':'FLEXIBLE';
    return `<div class="vp-plan-row ${item.type}"><time>${item.time}</time><div class="vp-plan-line"><span class="vp-plan-dot"></span></div><div><span class="vp-plan-type">${label} · ${item.part}</span><b>${safe(item.title)}</b><small>${safe(item.detail)}</small></div></div>`;
  }

  function renderFix(){
    panelHeader('FIX MY DAY','Something changed. Keep the good bits.');
    const selected=demoState.fixReason||'storms';
    $('#vpPanelBody').innerHTML=`
      <section class="vp-fix-intro"><span>WHAT CHANGED?</span><h2>Tell me the disruption — not the whole holiday again.</h2><p>I’ll protect fixed commitments and change only what needs changing.</p></section>
      <div class="vp-change-chips">
        ${[['storms','⛈️ Thunderstorms earlier'],['late','⏰ We’re running late'],['tired','😮‍💨 Someone is tired'],['closed','🚫 Attraction closed'],['minds','↪️ Changed our minds'],['booking','🕝 Booking time changed'],['free','✨ Unexpected free time']].map(([id,label])=>`<button type="button" class="${selected===id?'active':''}" data-vp-fix-reason="${id}">${label}</button>`).join('')}
      </div>
      <section class="vp-disruption-card"><div><span>LIVE CHANGE · DEMO</span><b>${fixReasonHeadline(selected)}</b><small>${fixReasonDetail(selected)}</small></div></section>
      <h3 class="vp-subheading">Original plan</h3>
      <div class="vp-mini-plan">${FIX_ORIGINAL.map(x=>`<div class="${x.type}"><time>${x.time}</time><div><b>${safe(x.title)}</b><small>${safe(x.detail)}</small></div>${x.type==='fixed'?'<span>🔒</span>':''}</div>`).join('')}</div>
      ${demoState.fixApplied?fixedResultMarkup(selected):`<button type="button" class="vp-primary-wide vp-fix-button" data-vp-apply-fix>Fix my day</button><small class="vp-button-note">I’ll move flexible plans, preserve the reservation and explain every change.</small>`}
    `;
  }

  function fixReasonHeadline(reason){
    return ({storms:'Thunderstorms are now expected from 3:00–6:00 PM.',late:'You’re about 90 minutes behind the plan.',tired:'Maya’s energy has dropped and the group wants less walking.',closed:'The planned afternoon attraction is unexpectedly closed.',minds:'The family no longer wants the planned outdoor afternoon.',booking:'Dinner has moved earlier to 6:45 PM.',free:'You unexpectedly have three free hours this afternoon.'})[reason]||'The plan needs adjusting.';
  }
  function fixReasonDetail(reason){
    return ({storms:'The airboat slot overlaps the highest lightning risk.',late:'The current sequence would turn the rest of the day into a rush.',tired:'Keep the value of the day without forcing another high-energy block.',closed:'Replace only the broken part of the day.',minds:'Use saved trip context to offer a better-fit substitute.',booking:'Rebuild travel and activity timing around the new fixed time.',free:'Fill the gap without creating a long detour.'})[reason]||'';
  }

  function fixedResultMarkup(reason){
    if(reason!=='storms'){
      const alt={
        late:['Shorten Gatorland to the highlights','Move the flexible lunch later','Keep the 7:30 PM dinner untouched'],
        tired:['Replace the outdoor afternoon with a villa reset','Keep one short indoor option available','Keep the 7:30 PM dinner untouched'],
        closed:['Remove the closed attraction','Add SEA LIFE as the weather-safe replacement','Keep the 7:30 PM dinner untouched'],
        minds:['Drop the outdoor activity','Use a saved indoor/low-walking alternative','Keep the 7:30 PM dinner untouched'],
        booking:['Trim the afternoon activity','Leave Disney Springs earlier','Lock the new 6:45 PM dinner time'],
        free:['Add a nearby 90-minute indoor option','Keep a reset buffer before dinner','Avoid crossing Orlando twice']
      }[reason]||[];
      return `<section class="vp-fixed-result"><div class="vp-fixed-success">✓ I’ve repaired the day without rebuilding everything.</div>${alt.map((x,i)=>`<div class="vp-change-row"><span>${i===alt.length-1?'KEPT':'CHANGED'}</span><b>${safe(x)}</b></div>`).join('')}<div class="vp-fix-why"><b>Why</b><p>The fixed booking remains the anchor; I only changed the flexible pieces affected by what you told me.</p></div><button type="button" class="vp-secondary-wide" data-vp-reset-fix>See the original again</button></section>`;
    }
    return `<section class="vp-fixed-result">
      <div class="vp-fixed-success">✓ I’ve adjusted your afternoon.</div>
      <div class="vp-change-row moved"><span>MOVED</span><div><b>Boggy Creek Airboat Adventures</b><small>Moved to Monday at 9:00 AM — drier weather and cooler temperatures.</small></div></div>
      <div class="vp-change-row added"><span>ADDED</span><div><b>SEA LIFE Orlando Aquarium · 2:30–4:15 PM</b><small>Indoor, lower walking and a straightforward replacement from Hunter’s Creek.</small></div></div>
      <div class="vp-change-row added"><span>ADDED</span><div><b>Villa reset · 4:45–6:20 PM</b><small>Cool down, change and recharge before the evening.</small></div></div>
      <div class="vp-change-row kept"><span>KEPT 🔒</span><div><b>The Boathouse · 7:30 PM</b><small>Your fixed dinner reservation stays exactly where it was.</small></div></div>
      <div class="vp-fix-why"><b>Why this fix makes sense</b><p>Lightning risk now overlaps the airboat slot. The replacement is indoors, doesn’t create a cross-city detour, and still leaves a calm buffer before the fixed dinner reservation.</p></div>
      <button type="button" class="vp-secondary-wide" data-vp-reset-fix>See the original again</button>
    </section>`;
  }

  function renderMemory(){ panelHeader('TRIP MEMORY','I already know the useful bits'); $('#vpPanelBody').innerHTML=tripMemoryMarkup(true); }

  function wireEvents(){
    document.addEventListener('click', e=>{
      const open=e.target.closest('[data-vp-open]'); if(open){openPanel(open.dataset.vpOpen);return;}
      if(e.target.closest('[data-vp-close]')){closePanel();return;}
      const choose=e.target.closest('[data-vp-choose]'); if(choose){chooseRecommendation(choose.dataset.vpChoose);return;}
      const save=e.target.closest('[data-vp-save]'); if(save){toggleSave(save.dataset.vpSave);return;}
      const reject=e.target.closest('[data-vp-reject]'); if(reject){openFeedback(reject.dataset.vpReject);return;}
      if(e.target.closest('[data-vp-feedback-close]')){closeFeedback();return;}
      const reason=e.target.closest('[data-vp-reason]'); if(reason){rejectReason(reason.dataset.vpReason);return;}
      const fixReason=e.target.closest('[data-vp-fix-reason]'); if(fixReason){demoState.fixReason=fixReason.dataset.vpFixReason;demoState.fixApplied=false;saveState();renderFix();return;}
      if(e.target.closest('[data-vp-apply-fix]')){demoState.fixApplied=true;saveState();renderFix();toast('Day repaired — fixed plans protected.');return;}
      if(e.target.closest('[data-vp-reset-fix]')){demoState.fixApplied=false;saveState();renderFix();return;}
      if(e.target.closest('[data-vp-launch-demo]')){launchDemo();return;}
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#vpFeedbackSheet')?.classList.contains('hidden'))closeFeedback();else if(!$('#vpDecisionOverlay')?.classList.contains('hidden'))closePanel();}});
  }

  function addDemoLaunchers(){
    const landing=$('.landing-actions');
    if(landing && !$('#vpLandingDemo')){
      const b=document.createElement('button');b.id='vpLandingDemo';b.type='button';b.className='landing-secondary vp-demo-launch';b.dataset.vpLaunchDemo='1';b.textContent='Try the Orlando decision demo';landing.appendChild(b);
    }
    const onboarding=$('.adventure-form');
    if(onboarding && !$('#vpOnboardingDemo')){
      const b=document.createElement('button');b.id='vpOnboardingDemo';b.type='button';b.className='text-btn full vp-onboarding-demo';b.dataset.vpLaunchDemo='1';b.textContent='Skip setup and view Orlando demo';onboarding.appendChild(b);
    }
  }
  function launchDemo(){
    $('#landingScreen')?.classList.add('hidden'); $('#onboarding')?.classList.add('hidden');
    const today=$('.view[data-view="today"]'); if(today){$$('.view').forEach(v=>v.classList.remove('active'));today.classList.add('active');}
    window.scrollTo({top:0,behavior:'smooth'}); toast('Orlando demo ready — start with What Now?');
  }

  function init(){
    if($('#vpDecisionHome'))return;
    document.body.classList.add('vp-decision-demo');
    const kicker=$('.brand-kicker'); if(kicker)kicker.textContent='DECISION DEMO · V2.5';
    buildHome(); buildTripContext(); buildOverlay(); addDemoLaunchers(); wireEvents();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true}); else setTimeout(init,0);
})();
