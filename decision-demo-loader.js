// FERDA — Orlando startup and onboarding compatibility layer
(()=>{
  'use strict';

  if(window.__FERDA_ORLANDO_BOOTSTRAP__) return;
  window.__FERDA_ORLANDO_BOOTSTRAP__=true;

  const VERSION='ferda-0.1.0';
  const RELEASE_KEY='vp_orlando_demo_release'; // deliberately outside ffvp_* app data
  const ONBOARDING_METRICS_KEY='ffvp_orlando_onboarding_metrics';
  const ORLANDO_ZONE='America/New_York';
  const SPLASH_MIN_MS=350;
  const SPLASH_MAX_MS=1600;
  const bootStarted=performance.now();

  let onboardingStart=0;
  let revealed=false;
  let releaseChanged=false;

  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const setText=(el,v)=>{if(el){const t=String(v??'');if(el.textContent!==t)el.textContent=t;}};
  const setHTML=(el,v)=>{if(el){const h=String(v??'');if(el.innerHTML!==h)el.innerHTML=h;}};
  const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function injectSplash(){
    if(qs('#vpStartupSplash')) return;
    const style=document.createElement('style');
    style.id='vpStartupCriticalCss';
    style.textContent=`
      #vpStartupSplash{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:18px;background:linear-gradient(155deg,#dff5ef 0%,#fff8e9 55%,#f7ead4 100%);font-family:Inter,system-ui,sans-serif;color:#173b3a;overflow:hidden}
      #vpStartupSplash:before,#vpStartupSplash:after{content:"";position:absolute;border-radius:50%;pointer-events:none}#vpStartupSplash:before{width:310px;height:310px;right:-150px;top:-120px;background:rgba(13,119,113,.12)}#vpStartupSplash:after{width:270px;height:270px;left:-155px;bottom:-115px;background:rgba(245,166,35,.12)}
      .vp-startup-card{position:relative;z-index:1;width:min(100%,390px);text-align:center;padding:25px 21px 21px;border:1px solid rgba(255,255,255,.9);border-radius:28px;background:rgba(255,255,255,.88);box-shadow:0 24px 70px rgba(15,23,42,.10)}
      .vp-startup-logo{width:min(290px,84%);height:auto;display:block;margin:0 auto 13px}.vp-startup-kicker{font-size:10px;font-weight:900;letter-spacing:.13em;color:#0d7771}.vp-startup-title{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:22px;line-height:1.17;margin:8px 0 7px;color:#173b3a}.vp-startup-copy{font-size:13px;line-height:1.48;color:#5d7774;margin:0 auto 18px;max-width:310px}
      .vp-startup-status{font-size:13px;font-weight:800;color:#29464d;min-height:20px}.vp-startup-detail{font-size:11px;color:#78898e;margin-top:7px;min-height:17px}.vp-startup-track{height:5px;margin-top:14px;border-radius:999px;background:#e2eceb;overflow:hidden}.vp-startup-bar{display:block;width:12%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#0d7771,#f5a623);transition:width .25s ease}.vp-startup-dots{display:flex;justify-content:center;gap:6px;margin-top:13px}.vp-startup-dots i{width:6px;height:6px;border-radius:50%;background:#79bdb7;animation:vpStartupPulse 1s ease-in-out infinite}.vp-startup-dots i:nth-child(2){animation-delay:.16s}.vp-startup-dots i:nth-child(3){animation-delay:.32s}
      #vpStartupSplash.vp-startup-leaving{opacity:0;transition:opacity .2s ease;pointer-events:none}@keyframes vpStartupPulse{0%,100%{opacity:.35;transform:scale(.82)}50%{opacity:1;transform:scale(1.15)}}
      @media(max-width:420px){#vpStartupSplash{padding:15px}.vp-startup-card{padding:22px 16px 19px;border-radius:24px}.vp-startup-title{font-size:20px}.vp-startup-copy{font-size:12.5px}.vp-startup-logo{width:min(225px,74%)}}
      @media(prefers-reduced-motion:reduce){.vp-startup-dots i{animation:none}.vp-startup-bar{transition:none}}
    `;
    document.head.appendChild(style);
    const splash=document.createElement('div');
    splash.id='vpStartupSplash';
    splash.setAttribute('role','status');
    splash.setAttribute('aria-live','polite');
    splash.innerHTML=`<div class="vp-startup-card"><img class="vp-startup-logo" src="assets/ferda/branding/brand_logo_mark.webp" alt="FERDA"><div class="vp-startup-kicker">ORLANDO TRAVEL BUDDY</div><div class="vp-startup-title">Your adventure is getting ready.</div><p class="vp-startup-copy">Keeping your family, trip and Orlando context together so you don’t have to work everything out again.</p><div id="vpStartupStatus" class="vp-startup-status">Getting your Orlando trip ready…</div><div class="vp-startup-track"><span id="vpStartupBar" class="vp-startup-bar"></span></div><div id="vpStartupDetail" class="vp-startup-detail">Preparing FERDA</div><div class="vp-startup-dots" aria-hidden="true"><i></i><i></i><i></i></div></div>`;
    document.body.appendChild(splash);
    qs('#landingScreen')?.classList.add('hidden');
    qs('#onboarding')?.classList.add('hidden');
  }

  function splashProgress(p,status,detail){
    const bar=qs('#vpStartupBar');
    if(bar) bar.style.width=`${Math.max(8,Math.min(100,p))}%`;
    setText(qs('#vpStartupStatus'),status);
    setText(qs('#vpStartupDetail'),detail);
  }

  function migrateReleaseOnce(){
    let previous='';
    try{previous=localStorage.getItem(RELEASE_KEY)||'';}catch{}
    if(previous===VERSION) return false;
    try{
      localStorage.setItem(RELEASE_KEY,VERSION);
      localStorage.setItem('ffvp_force_landing','0');
      localStorage.setItem('ffvp_force_onboarding','0');
    }catch{}
    return true;
  }

  function lockOldBetaLaunchFlags(){
    try{
      localStorage.setItem('ffvp_force_landing','0');
      localStorage.setItem('ffvp_force_onboarding','0');
      localStorage.setItem('ffvp_test_location','orlando');
    }catch{}
  }

  function loadStyle(href,id){
    if(document.getElementById(id)) return;
    const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }

  function loadScript(src,id,timeout=1700){
    return new Promise(resolve=>{
      if(document.getElementById(id)){resolve(true);return;}
      let done=false;
      const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok);};
      const s=document.createElement('script');s.id=id;s.src=src;s.async=false;s.onload=()=>finish(true);s.onerror=()=>finish(false);document.body.appendChild(s);
      const timer=setTimeout(()=>finish(false),timeout);
    });
  }

  function readProfile(){try{return JSON.parse(localStorage.getItem('ffvp_profile')||'{}')||{};}catch{return {};}}
  function writeProfilePatch(patch){
    try{
      const p={...readProfile(),...patch,destinationPreset:'orlando'};
      localStorage.setItem('ffvp_profile',JSON.stringify(p));
      if(typeof state!=='undefined'&&state?.profile) Object.assign(state.profile,p);
    }catch{}
  }
  function paceFromProfile(){const p=readProfile();if(p.pace)return p.pace;if(p.energy==='low'||p.walkingTolerance==='low')return'relaxed';if(p.energy==='high'||p.walkingTolerance==='high')return'packed';return'balanced';}
  function pacePatch(v){return v==='relaxed'?{pace:'relaxed',energy:'low',walkingTolerance:'low'}:v==='packed'?{pace:'packed',energy:'high',walkingTolerance:'high'}:{pace:'balanced',energy:'medium',walkingTolerance:'medium'};}
  function budgetLabel(v){return({low:'Keep costs down',medium:'Comfortable spend',high:'Holiday mode'})[v]||'Comfortable spend';}
  function paceLabel(v){return({relaxed:'Relaxed pace',balanced:'Balanced pace',packed:'Pack it in'})[v]||'Balanced pace';}
  function heightBandLabel(v){return({under36:'Under 36″','36to41':'36–41″','42to47':'42–47″','48plus':'48″+','unknown':'Height not set'})[v]||'Height not set';}
  function thrillLabel(v){return({low:'gentle rides',medium:'some thrills',high:'big thrills'})[v]||'some thrills';}

  function markOrlandoOnly(){
    document.body.classList.add('orlando-early-access');
    setText(qs('.brand-kicker'),'ORLANDO TRAVEL BUDDY');
    const setupDest=qs('#setupDestinationPreset');if(setupDest){setupDest.value='orlando';setupDest.closest('label')?.style.setProperty('display','none');}
    const profileDest=qs('#destinationPreset');if(profileDest){profileDest.value='orlando';profileDest.closest('label')?.style.setProperty('display','none');}
    qs('#setupLanguage')?.closest('label')?.style.setProperty('display','none');
    qs('#locationStrip')?.style.setProperty('display','none');
    ['#newTripBtn','#newTripBtnFamily','#familyNewVacationBtn','#openDestinationFinder'].forEach(sel=>qs(sel)?.style.setProperty('display','none'));
    qs('#newTripDialog')?.style.setProperty('display','none');
    qs('#orlandoLandingCopy')?.remove();
  }

  function stepWhy(step,icon,html){
    if(!step||qs('.orlando-step-why',step))return;
    const box=document.createElement('div');box.className='orlando-step-why';box.innerHTML=`<span>${icon}</span><div>${html}</div>`;
    const anchor=qs('.setup-actions',step)||qs('.setup-next',step)||qs('.launch-card',step);
    if(anchor)anchor.parentNode.insertBefore(box,anchor);else step.appendChild(box);
  }

  function injectPaceControl(step){
    if(!step||qs('#setupOrlandoPace',step))return;
    const current=paceFromProfile(),block=document.createElement('div');block.className='orlando-pace-block';
    block.innerHTML=`<span class="field-label">Holiday pace</span><small class="orlando-pace-copy">This helps me judge whether another big attraction is a good idea or whether the family needs an easier day.</small><input id="setupOrlandoPace" type="hidden" value="${current}"><div class="orlando-pace-grid"><button type="button" class="orlando-pace-option ${current==='relaxed'?'active':''}" data-orlando-pace="relaxed"><b>Relaxed</b><small>Plenty of breathing room</small></button><button type="button" class="orlando-pace-option ${current==='balanced'?'active':''}" data-orlando-pace="balanced"><b>Balanced</b><small>A bit of both</small></button><button type="button" class="orlando-pace-option ${current==='packed'?'active':''}" data-orlando-pace="packed"><b>Pack it in</b><small>Make the days count</small></button></div>`;
    const launch=qs('.launch-card',step);if(launch)launch.parentNode.insertBefore(block,launch);else step.appendChild(block);
    qsa('[data-orlando-pace]',block).forEach(b=>b.addEventListener('click',()=>{qs('#setupOrlandoPace').value=b.dataset.orlandoPace;qsa('[data-orlando-pace]',block).forEach(x=>x.classList.toggle('active',x===b));}));
  }

  function compactCrewRows(){
    const root=qs('#setupMembers');if(!root)return;
    qsa('.member-row',root).forEach(row=>{
      if(row.classList.contains('orlando-crew-compact'))return;
      row.classList.add('orlando-crew-compact');
      const fields=qs('.member-fields',row);if(!fields)return;
      const toggle=document.createElement('button');toggle.type='button';toggle.className='orlando-crew-more';toggle.innerHTML='<span>Ride & height details <small>optional</small></span><b>＋</b>';fields.after(toggle);
      toggle.addEventListener('click',()=>{const open=row.classList.toggle('orlando-crew-expanded');setHTML(toggle,`<span>${open?'Hide ride details':'Ride & height details <small>optional</small>'}</span><b>${open?'−':'＋'}</b>`);});
    });
  }

  function rewriteOnboarding(){
    const onboarding=qs('#onboarding');if(!onboarding)return;
    const hero=qs('.onboarding-hero');
    if(hero){
      setText(qs(':scope > p',hero),'A few useful details now means less thinking once you’re in Orlando. I’ll remember the people, the pace and the practical bits for the whole trip.');
      if(!qs('.orlando-onboarding-badge',hero)){const badge=document.createElement('div');badge.className='orlando-onboarding-badge';badge.textContent='ORLANDO FAMILY HOLIDAY SETUP';qs('.setup-progress-wrap',hero)?.before(badge);}
    }
    const steps=qsa('.setup-step',onboarding);
    if(steps[0]){
      setText(qs('h3',steps[0]),'Tell me about your Orlando trip');
      setText(qs('.step-copy',steps[0]),'Just enough to know when you’re there and where the family is starting from.');
      const labels=qsa('.field-label',steps[0]);if(labels[0])setText(labels[0],'Trip name (optional)');
      const family=qs('#setupFamilyName');if(family){family.placeholder='Our Orlando adventure';if(releaseChanged)family.value='';}
      const home=qs('#setupHomeBase');if(home){home.placeholder='Search villa, hotel, resort or address';if(releaseChanged)home.value='';setText(home.parentElement?.querySelector('small'),'Find your Orlando base so plans can start from the right place.');}
      const a=qs('#setupArrivalDate'),d=qs('#setupDepartureDate');if(a){a.required=true;if(releaseChanged)a.value='';}if(d){d.required=true;if(releaseChanged)d.value='';}
      setText(qs('.field-help',steps[0]),'Your dates tell me whether we’re planning ahead, deciding what to do today, or running out of holiday days.');
      setText(qs('.setup-next',steps[0]),'Who’s coming? →');
      if(!qs('#orlandoDateError',steps[0])){const err=document.createElement('div');err.id='orlandoDateError';err.className='orlando-date-error';err.setAttribute('role','alert');qs('.setup-next',steps[0])?.before(err);}
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
      setText(qs('.step-copy',steps[2]),'Give me the rough pace, travel range and spending mood. We can learn the rest as you use the trip.');
      injectPaceControl(steps[2]);
      setHTML(qs('.launch-card',steps[2]),'<span>✨</span><div><b>That’s enough to start being useful.</b><small>Add bookings, must-dos and extra preferences later.</small></div>');
      setText(qs('button[type="submit"]',steps[2]),'Show me what makes sense ✦');
    }
    qs('#skipSetup')?.style.setProperty('display','none');
    compactCrewRows();
    const root=qs('#setupMembers');if(root&&!root.dataset.orlandoWatcher){root.dataset.orlandoWatcher='1';new MutationObserver(compactCrewRows).observe(root,{childList:true,subtree:false});}
  }

  function showDateError(msg){const el=qs('#orlandoDateError');if(!el)return;setText(el,msg);el.classList.toggle('show',!!msg);}
  function validateDates(){const a=qs('#setupArrivalDate')?.value,d=qs('#setupDepartureDate')?.value;if(!a||!d){showDateError('Add your Orlando arrival and departure dates.');return false;}if(new Date(`${d}T12:00:00`)<new Date(`${a}T12:00:00`)){showDateError('Departure needs to be after arrival.');return false;}showDateError('');return true;}

  function startMetrics(){if(onboardingStart)return;onboardingStart=Date.now();try{localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify({version:VERSION,startedAt:new Date().toISOString(),steps:{}}));}catch{}}
  function finishMetrics(){if(!onboardingStart)startMetrics();try{const data=JSON.parse(localStorage.getItem(ONBOARDING_METRICS_KEY)||'{}');data.completed=true;data.completedAt=new Date().toISOString();data.totalMs=Date.now()-onboardingStart;localStorage.setItem(ONBOARDING_METRICS_KEY,JSON.stringify(data));}catch{}}

  function wireOnboarding(){
    const form=qs('#onboardingForm');if(!form||form.dataset.orlandoWired)return;form.dataset.orlandoWired='1';
    form.addEventListener('click',e=>{const next=e.target.closest('.setup-next');if(!next)return;const active=qs('.setup-step.active',form);if(active?.dataset.setupStep==='0'&&!validateDates()){e.preventDefault();e.stopImmediatePropagation();qs('#setupArrivalDate')?.focus();}},true);
    form.addEventListener('submit',e=>{if(!validateDates()){e.preventDefault();e.stopImmediatePropagation();}},true);
    form.addEventListener('submit',()=>{const pace=qs('#setupOrlandoPace')?.value||'balanced';writeProfilePatch({...pacePatch(pace),destinationPreset:'orlando'});finishMetrics();setTimeout(personalizeDecisionExperience,120);});
  }

  function formatClock(date,timeZone){try{return new Intl.DateTimeFormat(undefined,{timeZone,hour:'2-digit',minute:'2-digit'}).format(date);}catch{return date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}}
  function ensureTimeStrip(){const intro=qs('.view[data-view="today"] .today-intro');if(!intro)return;let strip=qs('#orlandoTimeStrip');if(!strip){strip=document.createElement('section');strip.id='orlandoTimeStrip';strip.className='orlando-time-strip';strip.innerHTML='<div class="orlando-time-box primary"><span>ORLANDO TIME</span><b id="orlandoClock">--:--</b><small>Eastern Time</small></div><div class="orlando-time-box orlando-device-time"><span>YOUR TIME</span><b id="deviceClock">--:--</b><small id="deviceZone">Device time</small></div>';intro.after(strip);}updateClocks();}
  function updateClocks(){const now=new Date(),zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';setText(qs('#orlandoClock'),formatClock(now,ORLANDO_ZONE));setText(qs('#deviceClock'),formatClock(now,zone||undefined));setText(qs('#deviceZone'),String(zone||'Device time').replace(/_/g,' ').replace('Europe/','').replace('America/',''));qs('#orlandoTimeStrip')?.classList.toggle('same-zone',zone===ORLANDO_ZONE);}

  function syncOrlandoLocation(){
    qs('#locationStrip')?.style.setProperty('display','none');
    const p=readProfile();
    if(Number.isFinite(+p.homeBaseLat)&&Number.isFinite(+p.homeBaseLon)){
      try{if(typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:+p.homeBaseLat,lon:+p.homeBaseLon};state.locationName=p.homeBase||'Your Orlando base';}if(typeof loadWeather==='function')loadWeather({silent:true});return;}catch{}
    }
    try{if(typeof applyPresetLocation==='function'){applyPresetLocation('orlando');return;}}catch{}
    try{if(typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:28.5383,lon:-81.3792};state.locationName='Orlando / Central Florida';}if(typeof loadWeather==='function')loadWeather({silent:true});}catch{}
  }

  function personalizationSummary(){const p=readProfile(),members=Array.isArray(p.members)?p.members:[];return{p,members,bits:[paceLabel(p.pace||paceFromProfile()),budgetLabel(p.budget)]};}
  function personalizeDecisionExperience(){
    const {p,members,bits}=personalizationSummary(),count=members.length;
    setText(qs('#todayGreetingCopy'),'I’ve got your Orlando trip and your crew. You shouldn’t have to explain the holiday again every time you need a decision.');
    const memory=qs('#vpDecisionHome .vp-memory-card');if(memory){setText(qs('b',memory),`${count||'Your'} traveller${count===1?'':'s'} · Orlando trip remembered`);setText(qs('small',memory),bits.join(' · '));}
    const sections=qsa('.vp-memory-grid section');if(sections[0]){setText(qs('b',sections[0]),`Orlando${p.arrivalDate?` · ${p.arrivalDate}`:''}`);setHTML(qs('small',sections[0]),`${p.homeBase?`${esc(p.homeBase)}<br>`:''}Central Florida family trip`);}
    const list=qs('.vp-traveller-list');if(list&&members.length)list.innerHTML=members.map((m,i)=>`<div><b>${esc(m.name||`Traveller ${i+1}`)} · ${Number.isFinite(+m.age)?+m.age:'Age not set'}</b><small>${heightBandLabel(m.heightBand)} · ${thrillLabel(m.thrill)}</small></div>`).join('');
  }

  function revealApp(){
    if(revealed)return;
    revealed=true;
    const onboarded=!!localStorage.getItem('ffvp_onboarded');
    qs('#landingScreen')?.classList.add('hidden');
    if(!onboarded){
      startMetrics();
      try{if(typeof showOnboarding==='function')showOnboarding();else qs('#onboarding')?.classList.remove('hidden');}catch{qs('#onboarding')?.classList.remove('hidden');}
    }else{
      qs('#onboarding')?.classList.add('hidden');
    }
    splashProgress(100,'Ready for Orlando','');
    const elapsed=performance.now()-bootStarted;
    setTimeout(()=>{
      const splash=qs('#vpStartupSplash');if(!splash)return;
      splash.classList.add('vp-startup-leaving');
      setTimeout(()=>{splash.remove();qs('#vpStartupCriticalCss')?.remove();},220);
    },Math.max(0,SPLASH_MIN_MS-elapsed));
  }

  // Do this immediately when the deferred script executes, not at DOMContentLoaded.
  // That prevents the old shell from visibly painting between app startup and our splash.
  injectSplash();
  releaseChanged=migrateReleaseOnce();
  lockOldBetaLaunchFlags();
  splashProgress(releaseChanged?28:22,releaseChanged?'Updating FERDA safely':'Getting your Orlando trip ready…',releaseChanged?'Keeping your saved trip in place':'Preparing your trip tools');

  async function init(){
    loadStyle(`/decision-demo.css?v=${VERSION}`,'vpDecisionDemoCss');
    loadStyle(`/orlando-early-access.css?v=${VERSION}`,'vpOrlandoEarlyAccessCss');
    markOrlandoOnly();
    rewriteOnboarding();
    wireOnboarding();
    ensureTimeStrip();
    syncOrlandoLocation();

    setTimeout(()=>splashProgress(58,'Connecting the planner…','Loading Orlando decision tools'),220);
    const basePromise=loadScript(`/base-location.js?v=${VERSION}`,'vpBaseLocationRuntime');
    const demoPromise=loadScript(`/decision-demo.js?v=${VERSION}`,'vpDecisionDemoRuntime');
    Promise.allSettled([basePromise,demoPromise]).then(()=>{personalizeDecisionExperience();syncOrlandoLocation();});
    loadScript(`/family-ui-test.js?v=${VERSION}`,'vpFamilyUiTestRuntime',1100).then(()=>{});

    setTimeout(()=>splashProgress(84,'Almost there…','Finishing your Orlando setup'),650);
    setTimeout(revealApp,1000);
    setTimeout(revealApp,SPLASH_MAX_MS); // hard safety ceiling; guarded, never reopens the splash
    setInterval(updateClocks,30000);
    window.__VP_BOOT_STATE__={version:VERSION,releaseChanged,get revealed(){return revealed;}};
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
