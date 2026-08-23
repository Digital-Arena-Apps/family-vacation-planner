// Vacation Planner V2.6.4 — Orlando home base + release-aware startup gate
(()=>{
  'use strict';
  const RELEASE='2.6.4';
  const RELEASE_KEY='ffvp_release_version';
  const MIN_SPLASH_MS=1500;
  const MAX_SPLASH_MS=3800;
  const CENTRAL={south:27.45,north:29.35,west:-82.45,east:-80.55};
  let searchTimer=null,searchAbort=null,watchId=null,planningOrigin='base';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inCentral=(lat,lon)=>lat>=CENTRAL.south&&lat<=CENTRAL.north&&lon>=CENTRAL.west&&lon<=CENTRAL.east;

  function beginStartupSplash(){
    const started=performance.now();
    document.body.classList.add('vp-starting');
    const landing=$('#landingScreen'),onboarding=$('#onboarding'),actions=$('.landing-actions');
    if(landing)landing.classList.remove('hidden');
    if(onboarding)onboarding.classList.add('hidden');
    if(actions){actions.dataset.vpStartupHidden='1';actions.style.visibility='hidden';actions.style.pointerEvents='none';}
    const shell=$('.landing-splash');
    if(shell&&!$('#orlandoStartupStatus')){
      const status=document.createElement('div');status.id='orlandoStartupStatus';status.className='orlando-startup-status';status.innerHTML='<span class="orlando-startup-dot"></span><span>Getting your Orlando trip ready…</span>';shell.appendChild(status);
    }
    return started;
  }

  async function resetForReleaseIfNeeded(){
    if(localStorage.getItem(RELEASE_KEY)===RELEASE)return false;
    const preserveLocal=new Set(['ffvp_language','ffvp_unit']);
    const localKeys=[];for(let i=0;i<localStorage.length;i++)localKeys.push(localStorage.key(i));
    localKeys.filter(Boolean).forEach(key=>{
      if((key.startsWith('ffvp_')&&!preserveLocal.has(key))||key.startsWith('vp_')||/demo/i.test(key))localStorage.removeItem(key);
    });
    const sessionKeys=[];for(let i=0;i<sessionStorage.length;i++)sessionKeys.push(sessionStorage.key(i));
    sessionKeys.filter(Boolean).forEach(key=>{if(key.startsWith('ffvp_')||key.startsWith('vp_')||/demo/i.test(key))sessionStorage.removeItem(key);});
    localStorage.setItem(RELEASE_KEY,RELEASE);
    localStorage.setItem('ffvp_force_landing','1');
    localStorage.setItem('ffvp_force_onboarding','1');
    try{
      if('caches' in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('ffvp-')).map(k=>caches.delete(k)));}
    }catch(e){console.warn('Could not clear old Vacation Planner caches',e);}
    location.reload();
    return true;
  }

  function appLooksReady(){return !!$('#orlandoTimeStrip')&&!!$('#vpDecisionHome');}
  function finishStartupSplash(started){
    const finish=()=>{
      const elapsed=performance.now()-started;
      if((elapsed<MIN_SPLASH_MS||!appLooksReady())&&elapsed<MAX_SPLASH_MS){setTimeout(finish,100);return;}
      const landing=$('#landingScreen'),onboarding=$('#onboarding'),actions=$('.landing-actions'),status=$('#orlandoStartupStatus');
      document.body.classList.remove('vp-starting');
      status?.remove();
      if(actions){actions.style.visibility='';actions.style.pointerEvents='';delete actions.dataset.vpStartupHidden;}
      const onboarded=!!localStorage.getItem('ffvp_onboarded');
      if(landing)landing.classList.add('hidden');
      if(onboarded){if(onboarding)onboarding.classList.add('hidden');}
      else if(typeof showOnboarding==='function')showOnboarding();
      else if(onboarding)onboarding.classList.remove('hidden');
    };
    finish();
  }

  function profile(){try{return JSON.parse(localStorage.getItem('ffvp_profile')||'{}')||{};}catch{return {};}}
  function persist(patch){
    const p={...profile(),...patch,destinationPreset:'orlando'};localStorage.setItem('ffvp_profile',JSON.stringify(p));
    try{if(typeof state!=='undefined'&&state?.profile){Object.assign(state.profile,p);if(typeof saveProfile==='function')saveProfile();}}catch{}
    return p;
  }
  function injectStyles(){
    if($('#vpBaseLocationStyles'))return;const s=document.createElement('style');s.id='vpBaseLocationStyles';s.textContent=`
    .vp-base-picker{margin-top:8px}.vp-base-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.vp-base-gps{border:1px solid #cfe3e0;background:#f0faf8;color:#08746f;border-radius:13px;padding:0 11px;min-height:48px;font-size:9px;font-weight:850;white-space:nowrap}.vp-base-results{display:grid;gap:6px;margin-top:7px}.vp-base-result{width:100%;display:grid;grid-template-columns:1fr auto;gap:7px;text-align:left;border:1px solid #e0e7e7;border-radius:13px;background:#fff;padding:10px 11px;color:#263b42}.vp-base-result b,.vp-base-result small{display:block}.vp-base-result b{font-size:10px}.vp-base-result small{margin-top:2px;color:#6d7e84;font-size:8.5px;line-height:1.35}.vp-base-result span{align-self:center;border-radius:999px;background:#eef8f6;color:#0d817b;padding:4px 6px;font-size:7px;font-weight:850}.vp-base-message{display:none;margin-top:7px;padding:8px 9px;border-radius:11px;font-size:8.5px;line-height:1.4}.vp-base-message.show{display:block}.vp-base-message.info{background:#eff9f7;color:#176b66}.vp-base-message.error{background:#fff1ee;color:#a5473c}.vp-base-selected{display:flex;gap:9px;align-items:flex-start;margin-top:8px;border:1px solid #bfe0da;background:#f0faf8;border-radius:14px;padding:10px}.vp-base-selected.hidden{display:none}.vp-base-selected>span{font-size:17px}.vp-base-selected b,.vp-base-selected small{display:block}.vp-base-selected b{font-size:10px;color:#164f4b}.vp-base-selected small{font-size:8.5px;color:#5d7675;margin-top:2px;line-height:1.35}.vp-planning-origin{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:7px 0 13px;padding:10px 12px;border:1px solid #dbe7e6;border-radius:16px;background:#fff}.vp-planning-origin-copy{min-width:0}.vp-planning-origin-copy span,.vp-planning-origin-copy b,.vp-planning-origin-copy small{display:block}.vp-planning-origin-copy span{font-size:7px;font-weight:900;letter-spacing:.08em;color:#0f817b}.vp-planning-origin-copy b{font-size:10.5px;color:#213c43;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vp-planning-origin-copy small{font-size:8px;color:#738287;margin-top:2px}.vp-origin-actions{display:flex;gap:5px;flex:0 0 auto}.vp-origin-actions button{border:1px solid #d5e2e0;background:#f6faf9;color:#176f69;border-radius:10px;min-height:36px;padding:6px 8px;font-size:7.5px;font-weight:850}.vp-origin-actions button.active{background:#0f817b;color:#fff;border-color:#0f817b}@media(max-width:420px){.vp-base-search-row{grid-template-columns:1fr}.vp-base-gps{min-height:42px}.vp-planning-origin{align-items:flex-start}.vp-origin-actions{flex-direction:column}}
    `;document.head.appendChild(s);
  }
  function message(text,type='info'){const el=$('#vpBaseMessage');if(!el)return;el.textContent=text;el.className=`vp-base-message ${text?'show':''} ${type}`;}
  function renderSelected(){
    const p=profile(),box=$('#vpBaseSelected');if(!box)return;
    if(!Number.isFinite(+p.homeBaseLat)||!Number.isFinite(+p.homeBaseLon)){box.classList.add('hidden');box.innerHTML='';return;}
    box.classList.remove('hidden');box.innerHTML=`<span>📍</span><div><b>${esc(p.homeBase||'Your Orlando base')}</b><small>${esc(p.homeBaseAddress||'Saved as the starting point for trip planning.')}</small></div>`;
  }
  function saveBase(result){
    const input=$('#setupHomeBase');if(input)input.value=result.name||result.address||'Orlando base';
    persist({homeBase:result.name||result.address||'Orlando base',homeBaseAddress:result.address||'',homeBaseLat:+result.lat,homeBaseLon:+result.lon,homeBasePlaceId:result.providerId||result.id||'',homeBaseSource:result.source||''});
    $('#vpBaseResults')?.replaceChildren();message('Base saved. Tomorrow plans can start here; What Now can switch to your live location when you’re out.');renderSelected();planningOrigin='base';stopLiveLocation();applyPlanningAnchor();renderOriginCard();patchDemoLocation();
  }
  async function searchBase(q){
    const root=$('#vpBaseResults');if(!root)return;if(q.trim().length<2){root.replaceChildren();return;}
    if(searchAbort)searchAbort.abort();searchAbort=new AbortController();root.innerHTML='<div class="vp-base-message show info">Searching around Orlando…</div>';
    try{
      const r=await fetch(`/api/base-search?q=${encodeURIComponent(q.trim())}`,{signal:searchAbort.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error();const data=await r.json();
      const rows=data.results||[];root.innerHTML=rows.length?rows.map((x,i)=>`<button type="button" class="vp-base-result" data-base-i="${i}"><div><b>${esc(x.name)}</b><small>${esc(x.address)}</small></div><span>${esc(x.type||'Place')}</span></button>`).join(''):'<div class="vp-base-message show info">No strong Orlando match yet. Try the hotel/resort name, community name or street address.</div>';
      $$('.vp-base-result',root).forEach(b=>b.addEventListener('click',()=>saveBase(rows[+b.dataset.baseI])));
    }catch(e){if(e.name!=='AbortError')root.innerHTML='<div class="vp-base-message show error">Search is unavailable just now. You can still type the base manually and refine it later.</div>';}
  }
  async function reverseCurrent(pos,{saveAsBase=false}={}){
    const lat=pos.coords.latitude,lon=pos.coords.longitude;
    if(!inCentral(lat,lon)){message('That location looks outside Central Florida. Search for your Orlando villa, hotel or resort instead.','error');return false;}
    let result={name:'Current Orlando location',address:'',lat,lon,id:'gps',source:'Device location'};
    try{const r=await fetch(`/api/base-search?reverse=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);if(r.ok){const d=await r.json();if(d.result)result=d.result;}}catch{}
    if(saveAsBase)saveBase(result);else{planningOrigin='current';setCurrentCoords(result);renderOriginCard();patchDemoLocation();}
    return true;
  }
  function useCurrentAsBase(){
    if(!navigator.geolocation){message('Location services are not available on this device.','error');return;}
    message('Checking your current location…');navigator.geolocation.getCurrentPosition(pos=>reverseCurrent(pos,{saveAsBase:true}),()=>message('I couldn’t access your location. Search for the villa or hotel instead.','error'),{enableHighAccuracy:true,timeout:10000,maximumAge:60000});
  }
  function setCurrentCoords(result){
    try{if(typeof state!=='undefined'){state.locationMode='gps';state.coords={lat:+result.lat,lon:+result.lon};state.locationName=result.name||'Current location';}if(typeof loadWeather==='function')loadWeather({silent:true});if(typeof renderExplore==='function')renderExplore();}catch{}
  }
  function applyPlanningAnchor(){
    const p=profile();if(!Number.isFinite(+p.homeBaseLat)||!Number.isFinite(+p.homeBaseLon)||planningOrigin==='current')return false;
    try{if(typeof state!=='undefined'){state.locationMode='orlando';state.coords={lat:+p.homeBaseLat,lon:+p.homeBaseLon};state.locationName=p.homeBase||'Your Orlando base';}if(typeof loadWeather==='function')loadWeather({silent:true});if(typeof renderExplore==='function')renderExplore();return true;}catch{return false;}
  }
  function startLiveLocation(){
    if(!navigator.geolocation)return;planningOrigin='current';if(watchId!=null)navigator.geolocation.clearWatch(watchId);
    watchId=navigator.geolocation.watchPosition(pos=>reverseCurrent(pos,{saveAsBase:false}),()=>{planningOrigin='base';stopLiveLocation();applyPlanningAnchor();renderOriginCard();},{enableHighAccuracy:false,timeout:10000,maximumAge:120000});renderOriginCard();
  }
  function stopLiveLocation(){if(watchId!=null&&navigator.geolocation){navigator.geolocation.clearWatch(watchId);watchId=null;}}
  function useBase(){planningOrigin='base';stopLiveLocation();applyPlanningAnchor();renderOriginCard();patchDemoLocation();}
  function renderOriginCard(){
    const time=$('#orlandoTimeStrip');if(!time)return;let card=$('#vpPlanningOrigin');if(!card){card=document.createElement('section');card.id='vpPlanningOrigin';card.className='vp-planning-origin';time.after(card);}
    const p=profile(),hasBase=Number.isFinite(+p.homeBaseLat)&&Number.isFinite(+p.homeBaseLon);let inTrip=false;try{inTrip=!!(typeof tripContext==='function'&&tripContext()?.inTrip);}catch{}
    const current=planningOrigin==='current';const title=current?'Your current location':hasBase?(p.homeBase||'Your Orlando base'):'Orlando';
    const sub=current?'Updating while this app is open':hasBase?'Used as the starting point for plans':'Set your villa or hotel for more accurate travel times';
    card.innerHTML=`<div class="vp-planning-origin-copy"><span>PLANNING FROM</span><b>${esc(title)}</b><small>${esc(sub)}</small></div><div class="vp-origin-actions">${hasBase?`<button type="button" data-origin="base" class="${!current?'active':''}">Base</button>`:''}${inTrip?`<button type="button" data-origin="current" class="${current?'active':''}">Use where I am</button>`:''}</div>`;
    $('[data-origin="base"]',card)?.addEventListener('click',useBase);$('[data-origin="current"]',card)?.addEventListener('click',startLiveLocation);
  }
  function patchDemoLocation(){
    const p=profile(),label=planningOrigin==='current'?'Here':(p.homeBase||'Your base');
    $$('.vp-panel-context span').forEach((el,i)=>{if(i===0)setTextSafe(el,`📍 ${label}`);});
    $$('#vpDecisionHome .vp-context-pills span').forEach(el=>{if(/villa|base|location/i.test(el.textContent||''))setTextSafe(el,`📍 ${label}`);});
  }
  function setTextSafe(el,text){if(el&&el.textContent!==text)el.textContent=text;}
  function buildPicker(){
    injectStyles();const input=$('#setupHomeBase');if(!input)return;const label=input.closest('label');if(!label||$('#vpBasePicker'))return;
    input.autocomplete='off';input.placeholder='Search villa, hotel, resort or address';
    const oldHelp=label.querySelector('small');if(oldHelp)oldHelp.textContent='Choose a result for accurate travel times. If you’re already at the villa/hotel, you can use your current location.';
    const picker=document.createElement('div');picker.id='vpBasePicker';picker.className='vp-base-picker';picker.innerHTML='<div class="vp-base-search-row"><div></div><button type="button" class="vp-base-gps" id="vpUseCurrentBase">◎ I’m here now</button></div><div id="vpBaseResults" class="vp-base-results"></div><div id="vpBaseMessage" class="vp-base-message"></div><div id="vpBaseSelected" class="vp-base-selected hidden"></div>';
    label.appendChild(picker);picker.querySelector('.vp-base-search-row>div').appendChild(input);
    input.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchBase(input.value),280);});$('#vpUseCurrentBase').addEventListener('click',useCurrentAsBase);renderSelected();
  }
  async function init(){
    const splashStarted=beginStartupSplash();
    if(await resetForReleaseIfNeeded())return;
    buildPicker();applyPlanningAnchor();renderOriginCard();renderSelected();patchDemoLocation();
    const form=$('#onboardingForm');form?.addEventListener('submit',()=>setTimeout(()=>{applyPlanningAnchor();renderOriginCard();patchDemoLocation();},160));
    document.addEventListener('click',e=>{if(e.target.closest('[data-vp-open]'))setTimeout(patchDemoLocation,25);});
    new MutationObserver(()=>{if($('#setupHomeBase')&&!$('#vpBasePicker'))buildPicker();if($('#orlandoTimeStrip'))renderOriginCard();}).observe(document.body,{childList:true,subtree:true});
    finishStartupSplash(splashStarted);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
