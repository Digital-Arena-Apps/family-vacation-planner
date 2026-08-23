// Vacation Planner V2.6.3 — Orlando Early Access bootstrap
// Keeps the proven V2.4 app intact while making the public-facing test genuinely Orlando-first.
(()=>{
  'use strict';

  const VERSION='2.6.3';
  const ONBOARDING_METRICS_KEY='ffvp_orlando_onboarding_metrics';
  const ORLANDO_ZONE='America/New_York';
  let onboardingStart=0;
  let stepStart=0;
  let lastStep=-1;

  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const setText=(el,value)=>{const text=String(value??'');if(el&&el.textContent!==text)el.textContent=text;};
  const setHTML=(el,value)=>{const html=String(value??'');if(el&&el.innerHTML!==html)el.innerHTML=html;};

  function loadStyle(href,id){
    if(document.getElementById(id))return;
    const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
  function loadScript(src,id){
    return new Promise((resolve,reject)=>{
      if(document.getElementById(id)){resolve();return;}
      const s=document.createElement('script');s.id=id;s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);
    });
  }
  function readProfile(){try{return JSON.parse(localStorage.getItem('ffvp_profile')||'{}')||{};}catch{return {};}}
  function writeProfilePatch(patch){
    try{
      const p={...readProfile(),...patch,destinationPreset:'orlando'};
      localStorage.setItem('ffvp_profile',JSON.stringify(p));
      if(typeof state!=='undefined'&&state?.profile){Object.assign(state.profile,p);if(typeof saveProfile==='function')saveProfile();}
    }catch(e){console.warn('Could not persist Orlando profile patch',e);}
  }
  function paceFromProfile(){
    const p=readProfile();
    if(p.pace)return p.pace;
    if(p.energy==='low'||p.walkingTolerance==='low')return 'relaxed';
    if(p.energy==='high'||p.walkingTolerance==='high')return 'packed';
    return 'balanced';
  }
  function pacePatch(value){
    if(value==='relaxed')return {pace:'relaxed',energy:'low',walkingTolerance:'low'};
    if(value==='packed')return {pace:'packed',energy:'high',walkingTolerance:'high'};
    return {pace:'balanced',energy:'medium',walkingTolerance:'medium'};
  }
  function budgetLabel(value){return ({low:'Keep costs down',medium:'Comfortable spend',high:'Holiday mode'})[value]||'Comfortable spend';}
  function paceLabel(value){return ({relaxed:'Relaxed pace',balanced:'Balanced pace',packed:'Pack it in'})[value]||'Balanced pace';}
  function heightBandLabel(band){return ({under36:'Under 36″','36to41':'36–41″','42to47':'42–47″','48plus':'48″+','unknown':'Height not set'})[band]||'Height not set';}
  function thrillLabel(v){return ({low:'gentle rides',medium:'some thrills',high:'big thrills'})[v]||'some thrills';}
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));}

  function markOrlandoOnly(){
    document.body.classList.add('orlando-early-access');
    setText(qs('.brand-kicker'),'ORLANDO EARLY ACCESS · V2.6');
    const setupDestination=qs('#setupDestinationPreset');
    if(setupDestination){setupDestination.value='orlando';const row=setupDestination.closest('label');if(row)row.style.display='none';}
    const profileDestination=qs('#destinationPreset');
    if(profileDestination){profileDestination.value='orlando';const row=profileDestination.closest('label');if(row)row.style.display='none';}
    const language=qs('#setupLanguage');if(language){const row=language.closest('label');if(row)row.style.display='none';}
    const locationStrip=qs('#locationStrip');if(locationStrip)locationStrip.style.display='none';
    ['#newTripBtn','#newTripBtnFamily','#familyNewVacationBtn','#openDestinationFinder'].forEach(sel=>{const el=qs(sel);if(el)el.style.display='none';});
    const newTrip=qs('#newTripDialog');if(newTrip)newTrip.style.display='none';
    writeProfilePatch({destinationPreset:'orlando'});
  }

  function addLandingPositioning(){
    setText(qs('#landingPrimary'),'Set up my Orlando trip ✦');
    const shell=qs('.landing-splash');if(!shell||qs('#orlandoLandingCopy'))return;
    const copy=document.createElement('div');copy.id='orlandoLandingCopy';copy.className='orlando-landing-copy';
    copy.innerHTML='<span>ORLANDO EARLY ACCESS</span><b>The family helper you don’t know you need — until you need it.</b><small>Tell me your trip once. When the weather changes, everyone gets tired or you suddenly have a few free hours, I’ll help work out what makes sense next.</small>';
    shell.appendChild(copy);
  }

  function stepWhy(step,icon,html){
    if(!step||qs('.orlando-step-why',step))return;
    const box=document.createElement('div');box.className='orlando-step-why';box.innerHTML=`<span>${icon}</span><div>${html}</div>`;
    const actions=qs('.setup-actions',step)||qs('.setup-next',step)||qs('.launch-card',step);
    if(actions)actions.parentNode.insertBefore(box,actions);else step.appendChild(box);
  }

  function injectPaceControl(step){
    if(!step||qs('#setupOrlandoPace',step))return;
    const current=paceFromProfile();
    const block=document.createElement('div');block.className='orlando-pace-block';
    block.innerHTML=`<span class="field-label">Holiday pace</span><small class="orlando-pace-copy">This helps me judge whether another big attraction is a good idea or whether the family needs an easier day.</small><input id="setupOrlandoPace" type="hidden" value="${current}"><div class="orlando-pace-grid" role="group" aria-label="Holiday pace"><button type="button" class="orlando-pace-option ${current==='relaxed'?'active':''}" data-orlando-pace="relaxed"><b>Relaxed</b><small>Plenty of breathing room</small></button><button type="button" class="orlando-pace-option ${current==='balanced'?'active':''}" data-orlando-pace="balanced"><b>Balanced</b><small>A bit of both</small></button><button type="button" class="orlando-pace-option ${current==='packed'?'active':''}" data-orlando-pace="packed"><b>Pack it in</b><small>Make the days count</small></button></div>`;
    const launch=qs('.launch-card',step);if(launch)launch.parentNode.insertBefore(block,launch);else step.appendChild(block);
    qsa('[data-orlando-pace]',block).forEach(b=>b.addEventListener('click',()=>{
      qs('#setupOrlandoPace').value=b.dataset.orlandoPace;
      qsa('[data-orlando-pace]',block).forEach(x=>x.classList.toggle('active',x===b));
    }));
  }

  function compactCrewRows(){
    const root=qs('#setupMembers');if(!root)return;
    qsa('.member-row',root).forEach(row=>{
      if(row.classList.contains('orlando-crew-compact'))return;
      row.classList.add('orlando-crew-compact');
      const fields=qs('.member-fields',row);if(!fields)return;
      const toggle=document.createElement('button');toggle.type='button';toggle.className='orlando-crew-more';
      toggle.innerHTML='<span>Ride & height details <small>optional</small></span><b>＋</b>';
      fields.after(toggle);
      toggle.addEventListener('click',()=>{
        const open=row.classList.toggle('orlando-crew-expanded');
        setHTML(toggle,`<span>${open?'Hide ride details':'Ride & height details <small>optional</small>'}</span><b>${open?'−':'＋'}</b>`);
      });
    });
  }
  function watchCrewRows(){
    const root=qs('#setupMembers');if(!root)return;
    compactCrewRows();
    new MutationObserver(()=>compactCrewRows()).observe(root,{childList:true,subtree:false});
  }

  function rewriteOnboarding(){
    const onboarding=qs('#onboarding');if(!onboarding)return;
    const hero=qs('.onboarding-hero');
    if(hero){
      setText(qs(':scope > p',hero),'A few useful details now means less thinking once you’re in Orlando. I’ll remember the people, the pace and the practical bits for the whole trip.');
      if(!qs('.orlando-onboarding-badge',hero)){
        const badge=document.createElement('div');badge.className='orlando-onboarding-badge';badge.textContent='ORLANDO FAMILY HOLIDAY SETUP';
        const progress=qs('.setup-progress-wrap',hero);if(progress)hero.insertBefore(badge,progress);
      }
    }
    const steps=qsa('.setup-step',onboarding);
    if(steps[0]){
      setText(qs('h3',steps[0]),'Tell me about your Orlando trip');
      setText(qs('.step-copy',steps[0]),'Just enough to know when you’re there and where the family is starting from.');
      const labels=qsa('.field-label',steps[0]);if(labels[0])setText(labels[0],'Trip name (optional)');
      const family=qs('#setupFamilyName');if(family)family.placeholder='Our Orlando adventure';
      const home=qs('#setupHomeBase');if(home){home.placeholder='Search villa, hotel, resort or address';setText(home.parentElement?.querySelector('small'),'Find your Orlando base so plans can start from the right place.');}
      const arrival=qs('#setupArrivalDate'),departure=qs('#setupDepartureDate');if(arrival)arrival.required=true;if(departure)departure.required=true;
      const dateHelp=qs('.field-help',steps[0]);setText(dateHelp,'Your dates tell me whether we’re planning ahead, deciding what to do today, or running out of holiday days.');
      setText(qs('.setup-next',steps[0]),'Who’s coming? →');
      if(!qs('#orlandoDateError',steps[0])){const err=document.createElement('div');err.id='orlandoDateError';err.className='orlando-date-error';err.setAttribute('role','alert');const help=dateHelp||qs('.setup-next',steps[0]);help?.parentNode.insertBefore(err,help?.nextSibling||null);}
      stepWhy(steps[0],'📍','<b>Why I ask:</b> Orlando is spread out. Your base gives tomorrow plans a real starting point; while you’re out, What Now can switch to your live location.');
    }
    if(steps[1]){
      setText(qs('h3',steps[1]),'Who am I planning for?');
      setText(qs('.step-copy',steps[1]),'Start with names and ages. Add ride-height and ride preferences only where they’re useful.');
      setText(qs('.crew-count-intro small',steps[1]),'Build the crew first. Each person stays compact until you want to add Orlando ride details.');
      setText(qs('.setup-next',steps[1]),'How do you holiday? →');
      stepWhy(steps[1],'👨‍👩‍👧','<b>Why I ask:</b> A good Orlando recommendation has to work for the actual group — not an imaginary average family.');
    }
    if(steps[2]){
      setText(qs('h3',steps[2]),'How do you want Orlando to feel?');
      setText(qs('.step-copy',steps[2]),'Two families can stay in the same villa and want completely different holidays. Give me the rough pace, travel range and spending mood.');
      const maxLabel=qs('.field-group .field-label',steps[2]);if(maxLabel)setText(maxLabel,'How far are you happy to travel?');
      injectPaceControl(steps[2]);
      const launch=qs('.launch-card',steps[2]);if(launch)setHTML(launch,'<span>✨</span><div><b>That’s enough to start being useful.</b><small>Add bookings, must-dos and extra preferences later. I don’t need you to configure everything before you see value.</small></div>');
      setText(qs('button[type="submit"]',steps[2]),'Show me what makes sense ✦');
      if(!qs('.orlando-ready-card',steps[2])){const ready=document.createElement('div');ready.className='orlando-ready-card';ready.innerHTML='<span>⚡</span><div><b>Your first payoff is next.</b><small>I’ll show how the same Orlando afternoon changes when I know the family, the weather and a fixed dinner booking.</small></div>';const actions=qs('.setup-actions',steps[2]);if(actions)actions.parentNode.insertBefore(ready,actions);}
    }
    const skip=qs('#skipSetup');if(skip)skip.style.display='none';
    watchCrewRows();
  }

  function showDateError(message){const el=qs('#orlandoDateError');if(!el)return;setText(el,message);el.classList.toggle('show',!!message);}
  function validateDates(){
    const a=qs('#setupArrivalDate')?.value,d=qs('#setupDepartureDate')?.value;
    if(!a||!d){showDateError('Add your Orlando arrival and departure dates so I know what stage of the trip I’m planning for.');return false;}
    if(new Date(`${d}T12:00:00`)<new Date(`${a}T12:00:00`)){showDateError('Departure needs to be after arrival.');return false;}
    showDateError('');return true;
  }

  function startMetrics(){
    if(onboardingStart)return;onboardingStart=Date.now();stepStart=onboardingStart;lastStep=0;
    localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify({version:VERSION,startedAt:new Date(onboardingStart).toISOString(),steps:{}}));
  }
  function recordStep(nextStep){
    if(!onboardingStart)startMetrics();
    const now=Date.now();let data={};try{data=JSON.parse(localStorage.getItem(ONBOARDING_METRICS_KEY)||'{}');}catch{}
    data.version=VERSION;data.steps=data.steps||{};
    if(lastStep>=0&&nextStep!==lastStep)data.steps[`step${lastStep+1}Ms`]=(data.steps[`step${lastStep+1}Ms`]||0)+(now-stepStart);
    lastStep=nextStep;stepStart=now;localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify(data));
  }
  function finishMetrics(){
    if(!onboardingStart)startMetrics();const now=Date.now();let data={};try{data=JSON.parse(localStorage.getItem(ONBOARDING_METRICS_KEY)||'{}');}catch{}
    data.steps=data.steps||{};data.steps[`step${lastStep+1}Ms`]=(data.steps[`step${lastStep+1}Ms`]||0)+(now-stepStart);data.completedAt=new Date(now).toISOString();data.totalMs=now-onboardingStart;data.completed=true;localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify(data));
  }

  function wireOnboarding(){
    const onboarding=qs('#onboarding'),form=qs('#onboardingForm');if(!onboarding||!form)return;
    new MutationObserver(()=>{
      if(!onboarding.classList.contains('hidden')){
        startMetrics();const step=qsa('.setup-step',form).findIndex(x=>x.classList.contains('active'));if(step>=0&&step!==lastStep)recordStep(step);compactCrewRows();
      }
    }).observe(onboarding,{attributes:true,subtree:true,attributeFilter:['class']});

    form.addEventListener('click',e=>{
      const next=e.target.closest('.setup-next');if(!next)return;
      const active=qs('.setup-step.active',form);if(active?.dataset.setupStep==='0'&&!validateDates()){e.preventDefault();e.stopImmediatePropagation();qs('#setupArrivalDate')?.focus();}
    },true);
    form.addEventListener('submit',e=>{if(!validateDates()){e.preventDefault();e.stopImmediatePropagation();}},true);
    form.addEventListener('submit',()=>{
      const pace=qs('#setupOrlandoPace')?.value||'balanced';
      writeProfilePatch({...pacePatch(pace),destinationPreset:'orlando'});
      finishMetrics();
      localStorage.removeItem('ffvp_force_landing');localStorage.removeItem('ffvp_force_onboarding');
      localStorage.setItem('ffvp_test_location','orlando');
      setTimeout(()=>{syncOrlandoLocation();personalizeDecisionExperience();renderSmokeStatus();},100);
    });
  }

  function formatClock(date,timeZone){
    try{return new Intl.DateTimeFormat(undefined,{timeZone,hour:'2-digit',minute:'2-digit'}).format(date);}catch{return date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
  }
  function zoneLabel(zone){return String(zone||'Local time').replace(/_/g,' ').replace('Europe/','').replace('America/','');}
  function ensureTimeStrip(){
    const intro=qs('.view[data-view="today"] .today-intro');if(!intro)return;
    let strip=qs('#orlandoTimeStrip');if(!strip){strip=document.createElement('section');strip.id='orlandoTimeStrip';strip.className='orlando-time-strip';strip.innerHTML='<div class="orlando-time-box primary"><span>ORLANDO TIME</span><b id="orlandoClock">--:--</b><small>Eastern Time</small></div><div class="orlando-time-box orlando-device-time"><span>YOUR TIME</span><b id="deviceClock">--:--</b><small id="deviceZone">Device time</small></div>';intro.after(strip);}
    updateClocks();
  }
  function updateClocks(){
    const now=new Date(),deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    setText(qs('#orlandoClock'),formatClock(now,ORLANDO_ZONE));setText(qs('#deviceClock'),formatClock(now,deviceZone||undefined));setText(qs('#deviceZone'),zoneLabel(deviceZone));
    qs('#orlandoTimeStrip')?.classList.toggle('same-zone',deviceZone===ORLANDO_ZONE);
  }

  function syncOrlandoLocation(){
    const strip=qs('#locationStrip');if(strip)strip.style.display='none';
    const deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    let inTrip=false;try{inTrip=!!(typeof tripContext==='function'&&tripContext()?.inTrip);}catch{}
    if(deviceZone===ORLANDO_ZONE&&inTrip&&typeof requestLocation==='function'){
      try{if(typeof state!=='undefined')state.locationMode='gps';localStorage.setItem('ffvp_test_location','gps');requestLocation();return;}catch{}
    }
    localStorage.setItem('ffvp_test_location','orlando');
    try{if(typeof applyPresetLocation==='function'){applyPresetLocation('orlando');return;}}catch{}
    try{
      if(typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:28.5383,lon:-81.3792};state.locationName='Orlando / Central Florida';}
      if(typeof loadWeather==='function')loadWeather();
    }catch(e){console.warn('Could not set Orlando planning location',e);}
  }

  function personalizationSummary(){
    const p=readProfile(),members=Array.isArray(p.members)?p.members:[];
    const notes=(p.quickNotes||[]).slice(0,2),vibes=[...new Set(members.map(m=>m.thrill).filter(Boolean))];
    const bits=[paceLabel(p.pace||paceFromProfile()),budgetLabel(p.budget)];
    if(notes.length)bits.push(notes.join(' · '));else if(vibes.length>1)bits.push('mixed ride preferences');
    return {p,members,bits};
  }
  function patchTripMemory(root=document){
    const {p,members,bits}=personalizationSummary();if(!members.length)return;
    setText(qs('.vp-memory-intro h2',root),p.familyName||'Our Orlando vacation');
    const sections=qsa('.vp-memory-grid section',root);
    if(sections[0]){const dates=p.arrivalDate&&p.departureDate?`${p.arrivalDate} → ${p.departureDate}`:'Dates saved';setText(qs('b',sections[0]),`Orlando · ${dates}`);setHTML(qs('small',sections[0]),`${p.homeBase?`${esc(p.homeBase)}<br>`:''}Central Florida family trip`);}
    if(sections[1]){setText(qs('b',sections[1]),bits.slice(0,2).join(' · '));setText(qs('small',sections[1]),bits.slice(2).join(' · ')||'I’ll keep adapting as you make decisions.');}
    const list=qs('.vp-traveller-list',root);if(list)setHTML(list,members.map((m,i)=>`<div><b>${esc(m.name||`Traveller ${i+1}`)} · ${Number.isFinite(+m.age)?+m.age:'Age not set'}</b><small>${heightBandLabel(m.heightBand)} · ${thrillLabel(m.thrill)}</small></div>`).join(''));
  }
  function personalizeDecisionExperience(){
    const {members,bits}=personalizationSummary(),count=members.length;
    setText(qs('#todayGreetingCopy'),'I’ve got your Orlando trip and your crew. You shouldn’t have to explain the holiday again every time you need a decision.');
    const memory=qs('#vpDecisionHome .vp-memory-card');if(memory){setText(qs('b',memory),`${count||'Your'} traveller${count===1?'':'s'} · Orlando trip remembered`);setText(qs('small',memory),bits.join(' · '));}
    setText(qs('.vp-reason-hero p'),'I’m using the Orlando weather window, the time you have, your fixed plans and the crew profile to rule out weaker options before you see them.');
    qsa('.vp-rec-facts').forEach(f=>{const spans=qsa('span',f),last=spans.at(-1);if(last&&count)setText(last,`👨‍👩‍👧 Whole group · ${count} traveller${count===1?'':'s'}`);});
    patchTripMemory(document);
  }

  function removeDemoShortcuts(){['#vpLandingDemo','#vpOnboardingDemo'].forEach(sel=>qs(sel)?.remove());}
  function wireDemoPersonalization(){document.addEventListener('click',e=>{if(e.target.closest('[data-vp-open]'))setTimeout(personalizeDecisionExperience,20);});}

  function renderSmokeStatus(){
    const checks=[
      ['3 onboarding steps',qsa('.setup-step').length===3],
      ['Orlando locked',qs('#setupDestinationPreset')?.value==='orlando'],
      ['Destination question removed',qs('#setupDestinationPreset')?.closest('label')?.style.display==='none'],
      ['Dates required',!!qs('#setupArrivalDate')?.required&&!!qs('#setupDepartureDate')?.required],
      ['Compact crew enabled',qsa('#setupMembers .orlando-crew-compact').length===qsa('#setupMembers .member-row').length],
      ['Test location hidden',qs('#locationStrip')?.style.display==='none'],
      ['Orlando clock present',!!qs('#orlandoTimeStrip')],
      ['Base search loaded',!!qs('#vpBasePicker')],
      ['Navigation contract intact',qsa('.bottom-nav .nav-item').length>0&&qsa('.bottom-nav .nav-item').every(b=>!!b.dataset.target)],
      ['Decision experience loaded',!!qs('#vpDecisionHome')]
    ];
    const ok=checks.every(x=>x[1]);window.__VP_ORLANDO_SMOKE__={version:VERSION,ok,checks};
    const host=qs('.beta-tools .testing-card');if(!host)return;
    let card=qs('#orlandoSmokeStatus');if(!card){card=document.createElement('div');card.id='orlandoSmokeStatus';host.appendChild(card);}
    card.className=`orlando-smoke-card ${ok?'pass':'fail'}`;card.innerHTML=`<b>${ok?'✓ Orlando onboarding smoke checks passed':'⚠ Orlando onboarding check needs attention'}</b><small>${checks.map(([n,v])=>`${v?'✓':'×'} ${n}`).join(' · ')}</small>`;
  }

  async function init(){
    const onboarded=!!localStorage.getItem('ffvp_onboarded');
    if(onboarded){localStorage.removeItem('ffvp_force_landing');localStorage.removeItem('ffvp_force_onboarding');qs('#landingScreen')?.classList.add('hidden');qs('#onboarding')?.classList.add('hidden');}

    loadStyle(`/decision-demo.css?v=${VERSION}`,'vpDecisionDemoCss');
    loadStyle(`/orlando-early-access.css?v=${VERSION}`,'vpOrlandoEarlyAccessCss');
    markOrlandoOnly();addLandingPositioning();rewriteOnboarding();wireOnboarding();ensureTimeStrip();syncOrlandoLocation();
    try{await loadScript(`/base-location.js?v=${VERSION}`,'vpBaseLocationRuntime');}catch(e){console.warn('Home base search did not load',e);}

    if(!onboarded){qs('#onboarding')?.classList.add('hidden');if(typeof showLanding==='function')showLanding();else qs('#landingScreen')?.classList.remove('hidden');addLandingPositioning();}

    try{await loadScript(`/decision-demo.js?v=${VERSION}`,'vpDecisionDemoRuntime');}catch(e){console.error('Decision experience failed to load',e);}
    removeDemoShortcuts();personalizeDecisionExperience();wireDemoPersonalization();

    try{await loadScript('/family-ui-test.js?v=4','vpFamilyUiTestRuntime');}catch(e){console.warn('Family UI test did not load',e);}
    renderSmokeStatus();
    setInterval(updateClocks,30000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
