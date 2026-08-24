(()=>{
  'use strict';
  if (window.__FERDA_CORE_V1__) return;
  window.__FERDA_CORE_V1__ = true;

  const VERSION = 'FERDA Core 0.1';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function readJSON(key, fallback){
    try { return JSON.parse(localStorage.getItem(key) || '') || fallback; }
    catch { return fallback; }
  }

  function loadStyles(){
    if ($('#ferdaCoreStyles')) return;
    const link = document.createElement('link');
    link.id = 'ferdaCoreStyles';
    link.rel = 'stylesheet';
    link.href = 'ferda-v1.css?v=0.1.0';
    document.head.appendChild(link);
  }

  function setText(selector, text){ const el=$(selector); if(el) el.textContent=text; }

  function profile(){ return readJSON('ffvp_profile', {}); }
  function plans(){ return readJSON('ffvp_plans', []); }
  function members(){ return Array.isArray(profile().members) ? profile().members : []; }

  function parseDateOnly(v){
    if(!v) return null;
    const d = new Date(`${v}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function formatDate(v){
    const d=parseDateOnly(v); if(!d) return '';
    return new Intl.DateTimeFormat(undefined,{weekday:'short',day:'numeric',month:'short'}).format(d);
  }

  function tripStatus(){
    const p=profile();
    const start=parseDateOnly(p.arrivalDate), end=parseDateOnly(p.departureDate), now=new Date();
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
    if(!start || !end) return {label:'Trip dates not set',sub:'Add dates in Trip when you’re ready.'};
    if(today < start){
      const days=Math.max(0,Math.ceil((start-today)/86400000));
      return {label:`${days} day${days===1?'':'s'} to go`,sub:`${formatDate(p.arrivalDate)} – ${formatDate(p.departureDate)}`};
    }
    if(today > end) return {label:'Trip complete',sub:`${formatDate(p.arrivalDate)} – ${formatDate(p.departureDate)}`};
    const day=Math.floor((today-start)/86400000)+1;
    const total=Math.floor((end-start)/86400000)+1;
    return {label:`Day ${day} of ${total}`,sub:`${formatDate(p.arrivalDate)} – ${formatDate(p.departureDate)}`};
  }

  function todayPlans(){
    const key = new Date().toISOString().slice(0,10);
    return plans().filter(p=>p && p.date===key).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99'));
  }

  function nextPlan(){
    const now=new Date();
    const candidates=plans().map(p=>{
      const stamp=p?.date ? new Date(`${p.date}T${p.time || '23:59'}:00`) : null;
      return {...p,_stamp:stamp};
    }).filter(p=>p._stamp && !Number.isNaN(p._stamp.getTime()) && p._stamp >= now)
      .sort((a,b)=>a._stamp-b._stamp);
    return candidates[0] || null;
  }

  function navigate(target){
    const btn=$(`.nav-item[data-target="${target}"]`);
    if(btn) btn.click();
  }

  function rebrandChrome(){
    document.title='FERDA — Everyone’s holiday. One shared plan.';
    const meta=$('meta[name="description"]');
    if(meta) meta.content='FERDA is the family holiday operating system: one shared plan built around the people travelling.';

    const topbar=$('.topbar');
    if(topbar){
      topbar.innerHTML=`
        <button class="ferda-brand" type="button" aria-label="FERDA home">
          <span class="ferda-mark" aria-hidden="true"><span>F</span><i></i></span>
          <span class="ferda-wordmark"><b>FERDA</b><small>Everyone’s holiday. One shared plan.</small></span>
        </button>
        <span class="ferda-version" aria-label="${VERSION}">CORE 0.1</span>`;
      $('.ferda-brand',topbar)?.addEventListener('click',()=>navigate('today'));
    }

    const nav=$('.bottom-nav');
    if(nav){
      const specialist=$('.nav-item[data-target="specialist"]',nav);
      if(specialist) specialist.remove();
      const defs={today:['Today','⌂'],explore:['Explore','⌕'],saved:['Trip','▣'],family:['Family','◎']};
      Object.entries(defs).forEach(([target,[label,glyph]])=>{
        const b=$(`.nav-item[data-target="${target}"]`,nav); if(!b) return;
        b.setAttribute('aria-label',label);
        b.innerHTML=`<span class="ferda-nav-glyph" aria-hidden="true">${glyph}</span><small>${label}</small>`;
      });
    }
  }

  function simplifyOnboarding(){
    const landing=$('#landingScreen');
    if(landing){
      const shell=$('.landing-shell',landing);
      if(shell && !$('.ferda-landing-copy',shell)){
        shell.classList.add('ferda-landing');
        const scene=$('.landing-scene',shell); if(scene) scene.innerHTML='';
        const copy=document.createElement('div');
        copy.className='ferda-landing-copy';
        copy.innerHTML=`<div class="ferda-mark ferda-mark-large" aria-hidden="true"><span>F</span><i></i></div><div class="ferda-landing-word">FERDA</div><h1>Everyone’s holiday.<br>One shared plan.</h1><p>Build the trip around the people going — then keep everybody in the loop without carrying the whole holiday in your head.</p>`;
        shell.insertBefore(copy,$('.landing-actions',shell));
        setText('#landingPrimary','Create our trip');
        setText('#landingContinue','Continue our trip');
      }
    }

    const hero=$('.onboarding-hero');
    if(hero){
      hero.innerHTML=`<div class="ferda-onboarding-brand"><span class="ferda-mark" aria-hidden="true"><span>F</span><i></i></span><b>FERDA</b></div><p>Start with the people. We’ll ask for more only when it helps the holiday.</p><div class="setup-progress-wrap"><div id="setupProgressText" class="setup-progress-text">STEP 1 OF 3</div><div class="setup-progress" aria-label="Setup progress"><span class="active"></span><span></span><span></span></div></div>`;
    }

    const step1=$('[data-setup-step="0"]');
    if(step1){
      const kicker=$('.step-kicker',step1); if(kicker) kicker.textContent='01 · YOUR TRIP';
      const h=$('h3',step1); if(h) h.textContent='Where and when are you going?';
      const p=$('.step-copy',step1); if(p) p.textContent='Just enough to create the shared trip. You can fill in the rest later.';
      ['#setupFamilyName','#setupLanguage','#setupHomeBase'].forEach(sel=>$(sel)?.closest('label')?.classList.add('ferda-defer-field'));
      const help=$('.field-help',step1); if(help) help.textContent='Dates help FERDA understand what is happening now and what can wait.';
      const next=$('.setup-next',step1); if(next) next.textContent='Add the people →';
    }
    const step2=$('[data-setup-step="1"]');
    if(step2){
      const kicker=$('.step-kicker',step2); if(kicker) kicker.textContent='02 · HOLIDAY CREW';
      const h=$('h3',step2); if(h) h.textContent='Who’s coming?';
      const p=$('.step-copy',step2); if(p) p.textContent='Start with names and ages. Preferences can grow as FERDA needs them.';
      const intro=$('.crew-count-intro small',step2); if(intro) intro.textContent='Add the people travelling. Keep it lightweight for now.';
      const next=$('.setup-next',step2); if(next) next.textContent='A little about the trip →';
    }
    const step3=$('[data-setup-step="2"]');
    if(step3){
      const kicker=$('.step-kicker',step3); if(kicker) kicker.textContent='03 · TRIP PREFERENCES';
      const h=$('h3',step3); if(h) h.textContent='What would make planning easier?';
      const p=$('.step-copy',step3); if(p) p.textContent='Two quick defaults help FERDA avoid obviously bad suggestions. They’re guidance, not rules.';
      const launch=$('.launch-card',step3); if(launch) launch.innerHTML='<span>✓</span><div><b>Your shared trip is ready.</b><small>We’ll learn the useful detail progressively — not through a giant questionnaire.</small></div>';
      const submit=$('button[type="submit"]',step3); if(submit) submit.textContent='Open our trip';
    }
  }

  function buildToday(){
    const view=$('.view[data-view="today"]'); if(!view) return;
    const intro=$('.today-intro',view); if(!intro) return;
    setText('#todayLocationEyebrow','TODAY');
    const greeting=$('#todayGreeting'); if(greeting) greeting.textContent='Your holiday, at a glance';
    const greetingCopy=$('#todayGreetingCopy'); if(greetingCopy) greetingCopy.textContent='What matters now — without digging through the whole itinerary.';

    ['#locationStrip','#weatherCard','.decision-card','#nowContextBar','#tripPulse'].forEach(sel=>$(sel,view)?.classList.add('ferda-secondary-capability'));

    let snapshot=$('#ferdaTodaySnapshot');
    if(!snapshot){
      snapshot=document.createElement('section');
      snapshot.id='ferdaTodaySnapshot'; snapshot.className='ferda-today-snapshot';
      intro.insertAdjacentElement('afterend',snapshot);
    }
    const p=profile(), status=tripStatus(), crew=members(), todays=todayPlans(), next=nextPlan();
    const tripName=p.familyName || p.tripName || (p.destinationPreset ? `${String(p.destinationPreset).replaceAll('-',' ')} trip` : 'Your trip');
    const nextCopy=next ? `${next.time ? `${next.time} · ` : ''}${next.title || 'Planned activity'}` : 'Nothing fixed is coming up yet';
    snapshot.innerHTML=`
      <article class="ferda-trip-hero">
        <div><span class="ferda-kicker">${escapeHTML(tripName)}</span><h2>${escapeHTML(status.label)}</h2><p>${escapeHTML(status.sub)}</p></div>
        <button class="ferda-text-action" type="button" data-ferda-nav="saved">View trip</button>
      </article>
      <div class="ferda-status-grid">
        <article><span>Next up</span><b>${escapeHTML(nextCopy)}</b><small>${next ? formatDate(next.date) : 'Add plans only when they are useful.'}</small></article>
        <article><span>Holiday crew</span><b>${crew.length || '—'} ${crew.length===1?'person':'people'}</b><small>${crew.length ? 'Preferences travel with the crew.' : 'Add who is travelling.'}</small></article>
      </div>
      <section class="ferda-today-plan"><div class="ferda-section-head"><div><span class="ferda-kicker">TODAY’S PLAN</span><h3>${todays.length ? `${todays.length} thing${todays.length===1?'':'s'} on the plan` : 'A clear day'}</h3></div><button class="ferda-text-action" type="button" data-ferda-add-plan>Add plan</button></div>
        <div class="ferda-day-list">${todays.length ? todays.map(item=>`<div class="ferda-day-item"><time>${escapeHTML(item.time || 'Any time')}</time><div><b>${escapeHTML(item.title || 'Plan')}</b><small>${escapeHTML(item.location || 'No location needed')}</small></div><span class="ferda-plan-badge fixed">Fixed</span></div>`).join('') : '<div class="ferda-empty-state"><b>Nothing you have to do.</b><span>That can be a plan too. Add something fixed, or explore something that suits the crew.</span></div>'}</div>
      </section>
      <div class="ferda-primary-actions"><button class="ferda-action-card" type="button" data-ferda-nav="explore"><span>Find something for us</span><small>Crew-aware ideas when you need them</small></button><button class="ferda-action-card quieter" type="button" data-ferda-nav="family"><span>Update the crew</span><small>Needs and preferences stay with the people</small></button></div>`;

    $$('[data-ferda-nav]',snapshot).forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.ferdaNav)));
    $('[data-ferda-add-plan]',snapshot)?.addEventListener('click',()=>{navigate('saved'); setTimeout(()=>$('#planTitle')?.focus(),120);});
  }

  function escapeHTML(v=''){
    return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function refineExplore(){
    const view=$('.view[data-view="explore"]'); if(!view) return;
    const heading=$('.page-heading',view);
    if(heading){
      const eyebrow=$('.eyebrow',heading); if(eyebrow) eyebrow.textContent='EXPLORE FOR YOUR CREW';
      const h=$('h2',heading); if(h) h.textContent='What would work for everyone?';
      const p=$('p',heading); if(p) p.textContent='Browse familiar categories, with the travelling party kept in the decision.';
      if(!$('.ferda-suitability-note',view)) heading.insertAdjacentHTML('afterend','<div class="ferda-suitability-note"><b>FERDA suitability</b><span>Recommendations are guidance based on your crew and trip — never a hard rule.</span></div>');
    }
  }

  function refineTrip(){
    const view=$('.view[data-view="saved"]'); if(!view) return;
    const heading=$('.trip-page-heading',view);
    if(heading){
      const eyebrow=$('.eyebrow',heading); if(eyebrow) eyebrow.textContent='TRIP';
      const h=$('h2',heading); if(h) h.textContent='One shared plan';
      const p=$('p',heading); if(p) p.textContent='Keep bookings, likely plans and possibilities together — without turning the holiday into project management.';
    }
    const block=$('#planForm')?.closest('.section-block');
    if(block){
      const eyebrow=$('.eyebrow',block); if(eyebrow) eyebrow.textContent='ADD TO THE PLAN';
      const h=$('h2',block); if(h) h.textContent='What kind of plan is it?';
      if(!$('#ferdaPlanType')){
        const seg=document.createElement('div'); seg.className='ferda-plan-type'; seg.innerHTML=`<input id="ferdaPlanType" type="hidden" value="fixed"><button type="button" class="active" data-plan-type="fixed"><b>Fixed</b><small>Booked or committed</small></button><button type="button" data-plan-type="planned"><b>Planned</b><small>Likely intention</small></button><button type="button" data-plan-type="flexible"><b>Flexible</b><small>Do it if it suits</small></button>`;
        $('#planForm').insertBefore(seg,$('#planTitle'));
        $$('[data-plan-type]',seg).forEach(b=>b.addEventListener('click',()=>{ $('#ferdaPlanType').value=b.dataset.planType; $$('[data-plan-type]',seg).forEach(x=>x.classList.toggle('active',x===b)); }));
        $('#planForm').addEventListener('submit',()=>{
          const type=$('#ferdaPlanType')?.value || 'fixed';
          setTimeout(()=>{
            const list=readJSON('ffvp_plans',[]);
            if(list.length){ list[list.length-1].ferdaType=type; localStorage.setItem('ffvp_plans',JSON.stringify(list)); decoratePlanTypes(); }
          },80);
        },true);
      }
    }
    decoratePlanTypes();
  }

  function decoratePlanTypes(){
    const list=$('#plansList'); if(!list) return;
    const data=readJSON('ffvp_plans',[]);
    [...list.children].forEach(row=>{
      $('.ferda-plan-badge',row)?.remove();
      const match=data.find(p=>p?.title && row.textContent.includes(p.title));
      const type=match?.ferdaType || 'fixed';
      const badge=document.createElement('span'); badge.className=`ferda-plan-badge ${type}`; badge.textContent=type[0].toUpperCase()+type.slice(1); row.appendChild(badge);
    });
  }

  function refineFamily(){
    const view=$('.view[data-view="family"]'); if(!view) return;
    const heading=$('.page-heading',view);
    if(heading){
      const eyebrow=$('.eyebrow',heading); if(eyebrow) eyebrow.textContent='HOLIDAY CREW';
      const h=$('h2',heading); if(h) h.textContent='FERDA starts with the people';
      const p=$('p',heading); if(p) p.textContent='Capture only what helps the holiday work better. Profiles can become richer when there is a reason.';
    }
    const form=$('#familyForm');
    if(form && !form.dataset.ferdaStructured){
      form.dataset.ferdaStructured='1';
      const crewHeading=$('.setup-heading',form), crewList=$('#familyMembers');
      if(crewHeading && crewList){
        form.insertBefore(crewList,form.firstChild); form.insertBefore(crewHeading,crewList);
        const oldAdd=$('#addMember'); if(oldAdd) oldAdd.classList.add('ferda-inline-add');
      }
      const save=$('button[type="submit"]',form);
      const msg=$('#saveProfileMsg');
      const details=document.createElement('details'); details.className='ferda-progressive-settings';
      details.innerHTML='<summary><span><b>Trip-wide preferences</b><small>Distance, pace, food, access and other useful defaults</small></span><span aria-hidden="true">＋</span></summary><div class="ferda-progressive-body"></div>';
      const body=$('.ferda-progressive-body',details);
      [...form.children].forEach(child=>{ if(child!==crewHeading && child!==crewList && child!==save && child!==msg) body.appendChild(child); });
      if(save) form.insertBefore(details,save); else form.appendChild(details);
      if(save) save.textContent='Save crew & preferences';

      const sticky=document.createElement('button'); sticky.type='button'; sticky.className='ferda-sticky-add-person'; sticky.innerHTML='<span aria-hidden="true">＋</span><b>Add person</b>';
      sticky.addEventListener('click',()=>$('#addMember')?.click());
      view.appendChild(sticky);
    }
    $$('.commercial-plan-section,.beta-tools',view).forEach(el=>el.classList.add('ferda-secondary-capability'));
  }

  function removePrototypeNoise(){
    $$('.brand-kicker,.test-location-picker,.commercial-plan-section,.beta-tools').forEach(el=>el.classList.add('ferda-secondary-capability'));
    setText('#navTodayLabel','Today'); setText('#navExploreLabel','Explore'); setText('#navTripLabel','Trip'); setText('#navFamilyLabel','Family');
  }

  function refreshCore(){ buildToday(); refineTrip(); decoratePlanTypes(); }

  function init(){
    loadStyles();
    document.body.classList.add('ferda-core-v1');
    rebrandChrome();
    simplifyOnboarding();
    removePrototypeNoise();
    refineExplore();
    refineTrip();
    refineFamily();
    buildToday();

    const observer=new MutationObserver(mutations=>{
      if(mutations.some(m=>m.target?.id==='plansList' || m.target?.id==='familyMembers')) setTimeout(refreshCore,30);
    });
    ['#plansList','#familyMembers'].forEach(sel=>{const el=$(sel);if(el)observer.observe(el,{childList:true,subtree:true});});
    window.addEventListener('storage',refreshCore);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshCore();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
