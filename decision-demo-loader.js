// Vacation Planner V2.6.5 — Orlando Early Access startup + onboarding layer
// The proven core app stays intact. This layer owns release-reset behaviour,
// a bounded branded startup experience, and the Orlando-first onboarding demo.
(()=>{
  'use strict';

  const VERSION='2.6.5';
  const RELEASE_KEY='ffvp_demo_release';
  const RELEASE_RELOAD_KEY='ffvp_release_reloading';
  const ONBOARDING_METRICS_KEY='ffvp_orlando_onboarding_metrics';
  const ORLANDO_ZONE='America/New_York';
  const SPLASH_MIN_MS=1400;
  const SPLASH_MAX_MS=3200;

  let onboardingStart=0,stepStart=0,lastStep=-1,startupStarted=performance.now(),startupFinished=false;
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const setText=(el,v)=>{if(el){const t=String(v??'');if(el.textContent!==t)el.textContent=t;}};
  const setHTML=(el,v)=>{if(el){const h=String(v??'');if(el.innerHTML!==h)el.innerHTML=h;}};
  const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function injectStartupSplash(){
    if(qs('#vpStartupSplash'))return;
    const style=document.createElement('style');
    style.id='vpStartupCriticalCss';
    style.textContent=`
      #vpStartupSplash{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:24px;background:linear-gradient(155deg,#f8f9fa 0%,#eefafa 43%,#fff3ec 100%);font-family:Inter,system-ui,sans-serif;color:#0f172a;overflow:hidden}
      #vpStartupSplash:before,#vpStartupSplash:after{content:"";position:absolute;border-radius:999px;filter:blur(1px);pointer-events:none}
      #vpStartupSplash:before{width:310px;height:310px;right:-150px;top:-115px;background:rgba(52,196,184,.14)}
      #vpStartupSplash:after{width:270px;height:270px;left:-150px;bottom:-100px;background:rgba(255,107,107,.12)}
      .vp-startup-card{position:relative;z-index:1;width:min(100%,390px);text-align:center;padding:30px 24px 24px;border:1px solid rgba(255,255,255,.9);border-radius:30px;background:rgba(255,255,255,.76);box-shadow:0 24px 70px rgba(15,23,42,.10);backdrop-filter:blur(18px)}
      .vp-startup-logo{width:min(280px,82%);height:auto;display:block;margin:0 auto 15px}.vp-startup-kicker{font-size:10px;font-weight:900;letter-spacing:.14em;color:#0f817b}.vp-startup-title{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:24px;line-height:1.16;margin:9px 0 8px;color:#152b34}.vp-startup-copy{font-size:14px;line-height:1.5;color:#607279;margin:0 auto 22px;max-width:310px}
      .vp-startup-status{font-size:13px;font-weight:800;color:#29464d;min-height:20px}.vp-startup-detail{font-size:11px;color:#78898e;margin-top:7px;min-height:17px}.vp-startup-track{height:5px;margin-top:15px;border-radius:999px;background:#e2eceb;overflow:hidden}.vp-startup-bar{display:block;width:12%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#19a69d,#ff6b6b);transition:width .28s ease}.vp-startup-dots{display:flex;justify-content:center;gap:6px;margin-top:14px}.vp-startup-dots i{width:6px;height:6px;border-radius:50%;background:#9bcfca;animation:vpStartupPulse 1s ease-in-out infinite}.vp-startup-dots i:nth-child(2){animation-delay:.16s}.vp-startup-dots i:nth-child(3){animation-delay:.32s}
      #vpStartupSplash.vp-startup-leaving{opacity:0;transition:opacity .24s ease;pointer-events:none}@keyframes vpStartupPulse{0%,100%{opacity:.35;transform:scale(.82)}50%{opacity:1;transform:scale(1.15)}}
      @media(max-width:420px){#vpStartupSplash{padding:18px}.vp-startup-card{padding:25px 18px 21px;border-radius:26px}.vp-startup-title{font-size:21px}.vp-startup-copy{font-size:13px}}
      @media(prefers-reduced-motion:reduce){.vp-startup-dots i{animation:none}.vp-startup-bar{transition:none}}
    `;
    document.head.appendChild(style);
    const splash=document.createElement('div');
    splash.id='vpStartupSplash';splash.setAttribute('role','status');splash.setAttribute('aria-live','polite');
    splash.innerHTML=`<div class="vp-startup-card"><img class="vp-startup-logo" src="brand-logo.png" alt="Family Vacation Planner"><div class="vp-startup-kicker">ORLANDO EARLY ACCESS</div><div class="vp-startup-title">Your holiday helper is getting ready.</div><p class="vp-startup-copy">I’ll keep the family, the trip and what’s happening right now together — so you don’t have to work everything out again.</p><div id="vpStartupStatus" class="vp-startup-status">Getting your Orlando trip ready…</div><div class="vp-startup-track"><span id="vpStartupBar" class="vp-startup-bar"></span></div><div id="vpStartupDetail" class="vp-startup-detail">Preparing the app</div><div class="vp-startup-dots" aria-hidden="true"><i></i><i></i><i></i></div></div>`;
    document.body.appendChild(splash);
    qs('#landingScreen')?.classList.add('hidden');
    qs('#onboarding')?.classList.add('hidden');
    setTimeout(()=>finishStartup(true),SPLASH_MAX_MS);
  }

  function splashProgress(percent,status,detail){
    const bar=qs('#vpStartupBar');if(bar)bar.style.width=`${Math.max(8,Math.min(100,percent))}%`;
    setText(qs('#vpStartupStatus'),status);setText(qs('#vpStartupDetail'),detail);
  }

  async function clearDemoCaches(){
    try{if('caches' in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>/^ffvp[-_]/i.test(k)).map(k=>caches.delete(k)));}}catch{}
  }

  function resetForRelease(){
    let previous='';try{previous=localStorage.getItem(RELEASE_KEY)||'';}catch{}
    if(previous===VERSION)return false;
    splashProgress(16,'Updating the Orlando demo…','Clearing the previous test trip');
    try{
      const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('ffvp_'))keys.push(k);}
      keys.forEach(k=>localStorage.removeItem(k));
      localStorage.setItem(RELEASE_KEY,VERSION);
      sessionStorage.setItem(RELEASE_RELOAD_KEY,VERSION);
    }catch{}
    clearDemoCaches().finally(()=>{
      const url=new URL(location.href);url.searchParams.set('release',VERSION);url.searchParams.set('fresh',String(Date.now()));
      setTimeout(()=>location.replace(url.toString()),260);
    });
    return true;
  }

  function loadStyle(href,id){
    if(document.getElementById(id))return;
    const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
  function loadScript(src,id,timeout=1400){
    return new Promise(resolve=>{
      if(document.getElementById(id)){resolve(true);return;}
      let settled=false;const done=ok=>{if(settled)return;settled=true;clearTimeout(timer);resolve(ok);};
      const s=document.createElement('script');s.id=id;s.src=src;s.async=false;s.onload=()=>done(true);s.onerror=()=>done(false);document.body.appendChild(s);
      const timer=setTimeout(()=>done(false),timeout);
    });
  }
  function readProfile(){try{return JSON.parse(localStorage.getItem('ffvp_profile')||'{}')||{};}catch{return {};}}
  function writeProfilePatch(patch){
    try{const p={...readProfile(),...patch,destinationPreset:'orlando'};localStorage.setItem('ffvp_profile',JSON.stringify(p));if(typeof state!=='undefined'&&state?.profile){Object.assign(state.profile,p);if(typeof saveProfile==='function')saveProfile();}}catch{}
  }
  function paceFromProfile(){const p=readProfile();if(p.pace)return p.pace;if(p.energy==='low'||p.walkingTolerance==='low')return'relaxed';if(p.energy==='high'||p.walkingTolerance==='high')return'packed';return'balanced';}
  function pacePatch(v){return v==='relaxed'?{pace:'relaxed',energy:'low',walkingTolerance:'low'}:v==='packed'?{pace:'packed',energy:'high',walkingTolerance:'high'}:{pace:'balanced',energy:'medium',walkingTolerance:'medium'};}
  function budgetLabel(v){return({low:'Keep costs down',medium:'Comfortable spend',high:'Holiday mode'})[v]||'Comfortable spend';}
  function paceLabel(v){return({relaxed:'Relaxed pace',balanced:'Balanced pace',packed:'Pack it in'})[v]||'Balanced pace';}
  function heightBandLabel(v){return({under36:'Under 36″','36to41':'36–41″','42to47':'42–47″','48plus':'48″+','unknown':'Height not set'})[v]||'Height not set';}
  function thrillLabel(v){return({low:'gentle rides',medium:'some thrills',high:'big thrills'})[v]||'some thrills';}

  function markOrlandoOnly(){
    document.body.classList.add('orlando-early-access');setText(qs('.brand-kicker'),'ORLANDO EARLY ACCESS · V2.6.5');
    const setupDestination=qs('#setupDestinationPreset');if(setupDestination){setupDestination.value='orlando';setupDestination.closest('label')?.style.setProperty('display','none');}
    const profileDestination=qs('#destinationPreset');if(profileDestination){profileDestination.value='orlando';profileDestination.closest('label')?.style.setProperty('display','none');}
    const language=qs('#setupLanguage');language?.closest('label')?.style.setProperty('display','none');
    qs('#locationStrip')?.style.setProperty('display','none');
    ['#newTripBtn','#newTripBtnFamily','#familyNewVacationBtn','#openDestinationFinder'].forEach(sel=>qs(sel)?.style.setProperty('display','none'));
    qs('#newTripDialog')?.style.setProperty('display','none');
    qs('#orlandoLandingCopy')?.remove();
    writeProfilePatch({destinationPreset:'orlando'});
  }

  function stepWhy(step,icon,html){if(!step||qs('.orlando-step-why',step))return;const box=document.createElement('div');box.className='orlando-step-why';box.innerHTML=`<span>${icon}</span><div>${html}</div>`;const anchor=qs('.setup-actions',step)||qs('.setup-next',step)||qs('.launch-card',step);if(anchor)anchor.parentNode.insertBefore(box,anchor);else step.appendChild(box);}
  function injectPaceControl(step){
    if(!step||qs('#setupOrlandoPace',step))return;const current=paceFromProfile(),block=document.createElement('div');block.className='orlando-pace-block';
    block.innerHTML=`<span class="field-label">Holiday pace</span><small class="orlando-pace-copy">This helps me judge whether another big attraction is a good idea or whether the family needs an easier day.</small><input id="setupOrlandoPace" type="hidden" value="${current}"><div class="orlando-pace-grid" role="group" aria-label="Holiday pace"><button type="button" class="orlando-pace-option ${current==='relaxed'?'active':''}" data-orlando-pace="relaxed"><b>Relaxed</b><small>Plenty of breathing room</small></button><button type="button" class="orlando-pace-option ${current==='balanced'?'active':''}" data-orlando-pace="balanced"><b>Balanced</b><small>A bit of both</small></button><button type="button" class="orlando-pace-option ${current==='packed'?'active':''}" data-orlando-pace="packed"><b>Pack it in</b><small>Make the days count</small></button></div>`;
    const launch=qs('.launch-card',step);if(launch)launch.parentNode.insertBefore(block,launch);else step.appendChild(block);
    qsa('[data-orlando-pace]',block).forEach(b=>b.addEventListener('click',()=>{qs('#setupOrlandoPace').value=b.dataset.orlandoPace;qsa('[data-orlando-pace]',block).forEach(x=>x.classList.toggle('active',x===b));}));
  }
  function compactCrewRows(){
    const root=qs('#setupMembers');if(!root)return;qsa('.member-row',root).forEach(row=>{if(row.classList.contains('orlando-crew-compact'))return;row.classList.add('orlando-crew-compact');const fields=qs('.member-fields',row);if(!fields)return;const toggle=document.createElement('button');toggle.type='button';toggle.className='orlando-crew-more';toggle.innerHTML='<span>Ride & height details <small>optional</small></span><b>＋</b>';fields.after(toggle);toggle.addEventListener('click',()=>{const open=row.classList.toggle('orlando-crew-expanded');setHTML(toggle,`<span>${open?'Hide ride details':'Ride & height details <small>optional</small>'}</span><b>${open?'−':'＋'}</b>`);});});
  }
  function watchCrewRows(){const root=qs('#setupMembers');if(!root)return;compactCrewRows();new MutationObserver(compactCrewRows).observe(root,{childList:true,subtree:false});}

  function rewriteOnboarding(){
    const onboarding=qs('#onboarding');if(!onboarding)return;const hero=qs('.onboarding-hero');
    if(hero){setText(qs(':scope > p',hero),'A few useful details now means less thinking once you’re in Orlando. I’ll remember the people, the pace and the practical bits for the whole trip.');if(!qs('.orlando-onboarding-badge',hero)){const badge=document.createElement('div');badge.className='orlando-onboarding-badge';badge.textContent='ORLANDO FAMILY HOLIDAY SETUP';const progress=qs('.setup-progress-wrap',hero);if(progress)hero.insertBefore(badge,progress);}}
    const steps=qsa('.setup-step',onboarding);
    if(steps[0]){setText(qs('h3',steps[0]),'Tell me about your Orlando trip');setText(qs('.step-copy',steps[0]),'Just enough to know when you’re there and where the family is starting from.');const labels=qsa('.field-label',steps[0]);if(labels[0])setText(labels[0],'Trip name (optional)');const family=qs('#setupFamilyName');if(family)family.placeholder='Our Orlando adventure';const home=qs('#setupHomeBase');if(home){home.placeholder='Search villa, hotel, resort or address';setText(home.parentElement?.querySelector('small'),'Find your Orlando base so plans can start from the right place.');}const arrival=qs('#setupArrivalDate'),departure=qs('#setupDepartureDate');if(arrival)arrival.required=true;if(departure)departure.required=true;setText(qs('.field-help',steps[0]),'Your dates tell me whether we’re planning ahead, deciding what to do today, or running out of holiday days.');setText(qs('.setup-next',steps[0]),'Who’s coming? →');if(!qs('#orlandoDateError',steps[0])){const err=document.createElement('div');err.id='orlandoDateError';err.className='orlando-date-error';err.setAttribute('role','alert');qs('.setup-next',steps[0])?.before(err);}stepWhy(steps[0],'📍','<b>Why I ask:</b> Orlando is spread out. Your base gives tomorrow plans a real starting point; while you’re out, What Now can switch to your live location.');}
    if(steps[1]){setText(qs('h3',steps[1]),'Who am I planning for?');setText(qs('.step-copy',steps[1]),'Start with names and ages. Add ride-height and ride preferences only where they’re useful.');setText(qs('.crew-count-intro small',steps[1]),'Build the crew first. Each person stays compact until you want to add Orlando ride details.');setText(qs('.setup-next',steps[1]),'How do you holiday? →');stepWhy(steps[1],'👨‍👩‍👧','<b>Why I ask:</b> A good Orlando recommendation has to work for the actual group — not an imaginary average family.');}
    if(steps[2]){setText(qs('h3',steps[2]),'How do you want Orlando to feel?');setText(qs('.step-copy',steps[2]),'Two families can stay in the same villa and want completely different holidays. Give me the rough pace, travel range and spending mood.');injectPaceControl(steps[2]);const launch=qs('.launch-card',steps[2]);if(launch)setHTML(launch,'<span>✨</span><div><b>That’s enough to start being useful.</b><small>Add bookings, must-dos and extra preferences later. You don’t need to configure everything before you see value.</small></div>');setText(qs('button[type="submit"]',steps[2]),'Show me what makes sense ✦');}
    qs('#skipSetup')?.style.setProperty('display','none');watchCrewRows();
  }

  function showDateError(msg){const el=qs('#orlandoDateError');if(!el)return;setText(el,msg);el.classList.toggle('show',!!msg);}
  function validateDates(){const a=qs('#setupArrivalDate')?.value,d=qs('#setupDepartureDate')?.value;if(!a||!d){showDateError('Add your Orlando arrival and departure dates so I know what stage of the trip I’m planning for.');return false;}if(new Date(`${d}T12:00:00`)<new Date(`${a}T12:00:00`)){showDateError('Departure needs to be after arrival.');return false;}showDateError('');return true;}
  function startMetrics(){if(onboardingStart)return;onboardingStart=Date.now();stepStart=onboardingStart;lastStep=0;try{localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify({version:VERSION,startedAt:new Date().toISOString(),steps:{}}));}catch{}}
  function recordStep(next){if(!onboardingStart)startMetrics();const now=Date.now();let data={};try{data=JSON.parse(localStorage.getItem(ONBOARDING_METRICS_KEY)||'{}');}catch{}data.steps=data.steps||{};if(lastStep>=0&&next!==lastStep)data.steps[`step${lastStep+1}Ms`]=(data.steps[`step${lastStep+1}Ms`]||0)+(now-stepStart);lastStep=next;stepStart=now;try{localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify(data));}catch{}}
  function finishMetrics(){if(!onboardingStart)startMetrics();const now=Date.now();let data={};try{data=JSON.parse(localStorage.getItem(ONBOARDING_METRICS_KEY)||'{}');}catch{}data.steps=data.steps||{};data.steps[`step${lastStep+1}Ms`]=(data.steps[`step${lastStep+1}Ms`]||0)+(now-stepStart);data.completed=true;data.completedAt=new Date().toISOString();data.totalMs=now-onboardingStart;try{localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify(data));}catch{}}
  function wireOnboarding(){
    const onboarding=qs('#onboarding'),form=qs('#onboardingForm');if(!onboarding||!form)return;
    new MutationObserver(()=>{if(!onboarding.classList.contains('hidden')){startMetrics();const step=qsa('.setup-step',form).findIndex(x=>x.classList.contains('active'));if(step>=0&&step!==lastStep)recordStep(step);compactCrewRows();}}).observe(onboarding,{attributes:true,subtree:true,attributeFilter:['class']});
    form.addEventListener('click',e=>{const next=e.target.closest('.setup-next');if(!next)return;const active=qs('.setup-step.active',form);if(active?.dataset.setupStep==='0'&&!validateDates()){e.preventDefault();e.stopImmediatePropagation();qs('#setupArrivalDate')?.focus();}},true);
    form.addEventListener('submit',e=>{if(!validateDates()){e.preventDefault();e.stopImmediatePropagation();}},true);
    form.addEventListener('submit',()=>{writeProfilePatch({...pacePatch(qs('#setupOrlandoPace')?.value||'balanced'),destinationPreset:'orlando'});finishMetrics();try{localStorage.removeItem('ffvp_force_landing');localStorage.removeItem('ffvp_force_onboarding');localStorage.setItem('ffvp_test_location','orlando');}catch{}setTimeout(()=>{syncOrlandoLocation();personalizeDecisionExperience();renderSmokeStatus();},100);});
  }

  function formatClock(date,zone){try{return new Intl.DateTimeFormat(undefined,{timeZone:zone,hour:'2-digit',minute:'2-digit'}).format(date);}catch{return date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}}
  function zoneLabel(zone){return String(zone||'Local time').replace(/_/g,' ').replace('Europe/','').replace('America/','');}
  function ensureTimeStrip(){const intro=qs('.view[data-view="today"] .today-intro');if(!intro)return;let strip=qs('#orlandoTimeStrip');if(!strip){strip=document.createElement('section');strip.id='orlandoTimeStrip';strip.className='orlando-time-strip';strip.innerHTML='<div class="orlando-time-box primary"><span>ORLANDO TIME</span><b id="orlandoClock">--:--</b><small>Eastern Time</small></div><div class="orlando-time-box orlando-device-time"><span>YOUR TIME</span><b id="deviceClock">--:--</b><small id="deviceZone">Device time</small></div>';intro.after(strip);}updateClocks();}
  function updateClocks(){const now=new Date(),zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';setText(qs('#orlandoClock'),formatClock(now,ORLANDO_ZONE));setText(qs('#deviceClock'),formatClock(now,zone||undefined));setText(qs('#deviceZone'),zoneLabel(zone));qs('#orlandoTimeStrip')?.classList.toggle('same-zone',zone===ORLANDO_ZONE);}
  function syncOrlandoLocation(){
    qs('#locationStrip')?.style.setProperty('display','none');const p=readProfile();
    try{if(Number.isFinite(+p.homeBaseLat)&&Number.isFinite(+p.homeBaseLon)&&typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:+p.homeBaseLat,lon:+p.homeBaseLon};state.locationName=p.homeBase||'Your Orlando base';if(typeof loadWeather==='function')loadWeather({silent:true});return;}}catch{}
    try{localStorage.setItem('ffvp_test_location','orlando');if(typeof applyPresetLocation==='function')applyPresetLocation('orlando');else if(typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:28.5383,lon:-81.3792};state.locationName='Orlando / Central Florida';if(typeof loadWeather==='function')loadWeather({silent:true});}}catch{}
  }

  function personalizationSummary(){const p=readProfile(),members=Array.isArray(p.members)?p.members:[],notes=(p.quickNotes||[]).slice(0,2),vibes=[...new Set(members.map(m=>m.thrill).filter(Boolean))],bits=[paceLabel(p.pace||paceFromProfile()),budgetLabel(p.budget)];if(notes.length)bits.push(notes.join(' · '));else if(vibes.length>1)bits.push('mixed ride preferences');return{p,members,bits};}
  function patchTripMemory(root=document){const{p,members,bits}=personalizationSummary();if(!members.length)return;setText(qs('.vp-memory-intro h2',root),p.familyName||'Our Orlando vacation');const sections=qsa('.vp-memory-grid section',root);if(sections[0]){const dates=p.arrivalDate&&p.departureDate?`${p.arrivalDate} → ${p.departureDate}`:'Dates saved';setText(qs('b',sections[0]),`Orlando · ${dates}`);setHTML(qs('small',sections[0]),`${p.homeBase?`${esc(p.homeBase)}<br>`:''}Central Florida family trip`);}if(sections[1]){setText(qs('b',sections[1]),bits.slice(0,2).join(' · '));setText(qs('small',sections[1]),bits.slice(2).join(' · ')||'I’ll keep adapting as you make decisions.');}const list=qs('.vp-traveller-list',root);if(list)setHTML(list,members.map((m,i)=>`<div><b>${esc(m.name||`Traveller ${i+1}`)} · ${Number.isFinite(+m.age)?+m.age:'Age not set'}</b><small>${heightBandLabel(m.heightBand)} · ${thrillLabel(m.thrill)}</small></div>`).join(''));}
  function personalizeDecisionExperience(){const{members,bits}=personalizationSummary(),count=members.length;setText(qs('#todayGreetingCopy'),'I’ve got your Orlando trip and your crew. You shouldn’t have to explain the holiday again every time you need a decision.');const memory=qs('#vpDecisionHome .vp-memory-card');if(memory){setText(qs('b',memory),`${count||'Your'} traveller${count===1?'':'s'} · Orlando trip remembered`);setText(qs('small',memory),bits.join(' · '));}setText(qs('.vp-reason-hero p'),'I’m using the Orlando weather window, the time you have, your fixed plans and the crew profile to rule out weaker options before you see them.');patchTripMemory(document);}
  function removeDemoShortcuts(){['#vpLandingDemo','#vpOnboardingDemo'].forEach(sel=>qs(sel)?.remove());}
  function wireDemoPersonalization(){document.addEventListener('click',e=>{if(e.target.closest('[data-vp-open]'))setTimeout(personalizeDecisionExperience,20);});}

  function showOnboarding(){
    qs('#landingScreen')?.classList.add('hidden');
    const onboarding=qs('#onboarding');if(onboarding){onboarding.classList.remove('hidden');const steps=qsa('.setup-step',onboarding);steps.forEach((s,i)=>s.classList.toggle('active',i===0));setText(qs('#setupProgressText'),'STEP 1 OF 3');qsa('.setup-progress span').forEach((s,i)=>s.classList.toggle('active',i===0));startMetrics();}
  }
  function showSavedApp(){qs('#landingScreen')?.classList.add('hidden');qs('#onboarding')?.classList.add('hidden');}

  function renderSmokeStatus(){const checks=[['3 onboarding steps',qsa('.setup-step').length===3],['Orlando locked',qs('#setupDestinationPreset')?.value==='orlando'],['Destination question removed',qs('#setupDestinationPreset')?.closest('label')?.style.display==='none'],['Dates required',!!qs('#setupArrivalDate')?.required&&!!qs('#setupDepartureDate')?.required],['Compact crew enabled',qsa('#setupMembers .orlando-crew-compact').length===qsa('#setupMembers .member-row').length],['Test location hidden',qs('#locationStrip')?.style.display==='none'],['Orlando clock present',!!qs('#orlandoTimeStrip')],['Base search loaded',!!qs('#vpBasePicker')],['Decision experience loaded',!!qs('#vpDecisionHome')]];const ok=checks.every(x=>x[1]);window.__VP_ORLANDO_SMOKE__={version:VERSION,ok,checks};}

  async function finishStartup(forced=false){
    if(startupFinished)return;startupFinished=true;
    const elapsed=performance.now()-startupStarted;if(!forced&&elapsed<SPLASH_MIN_MS)await new Promise(r=>setTimeout(r,SPLASH_MIN_MS-elapsed));
    const onboarded=!!localStorage.getItem('ffvp_onboarded');
    if(onboarded)showSavedApp();else showOnboarding();
    splashProgress(100,'Ready for Orlando','');
    const splash=qs('#vpStartupSplash');if(splash){splash.classList.add('vp-startup-leaving');setTimeout(()=>{splash.remove();qs('#vpStartupCriticalCss')?.remove();},260);}
  }

  async function init(){
    injectStartupSplash();
    if(resetForRelease())return;
    const justUpdated=sessionStorage.getItem(RELEASE_RELOAD_KEY)===VERSION;if(justUpdated){sessionStorage.removeItem(RELEASE_RELOAD_KEY);splashProgress(24,'Latest version ready','Starting with a clean Orlando trip');}else splashProgress(20,'Getting your Orlando trip ready…','Loading your trip context');

    loadStyle(`/decision-demo.css?v=${VERSION}`,'vpDecisionDemoCss');loadStyle(`/orlando-early-access.css?v=${VERSION}`,'vpOrlandoEarlyAccessCss');
    markOrlandoOnly();rewriteOnboarding();wireOnboarding();ensureTimeStrip();syncOrlandoLocation();

    splashProgress(42,'Preparing your trip tools…','Setting up your Orlando base and location');
    await loadScript(`/base-location.js?v=${VERSION}`,'vpBaseLocationRuntime',1100);

    splashProgress(67,'Connecting the decision tools…','What Now, Plan Tomorrow and Fix My Day');
    await loadScript(`/decision-demo.js?v=${VERSION}`,'vpDecisionDemoRuntime',1200);
    removeDemoShortcuts();personalizeDecisionExperience();wireDemoPersonalization();

    splashProgress(88,'Almost there…','Finishing the family setup');
    loadScript(`/family-ui-test.js?v=5`,'vpFamilyUiTestRuntime',700).then(renderSmokeStatus);
    updateClocks();setInterval(updateClocks,30000);
    await finishStartup(false);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
