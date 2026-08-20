const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  coords: null,
  weather: null,
  unit: localStorage.getItem('ffvp_unit') || (navigator.language?.toLowerCase().includes('us') ? 'f' : 'c'),
  profile: JSON.parse(localStorage.getItem('ffvp_profile') || 'null') || {
    adults: 2, children: 2, maxDrive: 30, budget: 'medium', energy: 'medium',
    interests: ['rides','food','shopping','beach','indoor'], heatAware: true
  },
  saved: JSON.parse(localStorage.getItem('ffvp_saved') || '[]'),
  deferredInstall: null,
  filter: 'all'
};

const activities = [
  {id:'disney-springs', name:'Disney Springs', icon:'✨', category:'shopping', tags:['shopping','food','indoor'], cost:1, energy:1, lat:28.3703, lon:-81.5194, destination:'Disney Springs, Lake Buena Vista, FL', note:'Food, shops and entertainment with no theme-park admission.'},
  {id:'magic-kingdom', name:'Magic Kingdom', icon:'🏰', category:'park', tags:['rides'], cost:3, energy:3, lat:28.4177, lon:-81.5812, destination:'Magic Kingdom Park, Florida', note:'Big-ticket park day with lots of family rides.'},
  {id:'epcot', name:'EPCOT', icon:'🌐', category:'park', tags:['rides','food'], cost:3, energy:3, lat:28.3747, lon:-81.5494, destination:'EPCOT, Florida', note:'Rides, food and a slightly more grown-up pace.'},
  {id:'hollywood', name:"Disney's Hollywood Studios", icon:'🎬', category:'park', tags:['rides'], cost:3, energy:3, lat:28.3575, lon:-81.5583, destination:"Disney's Hollywood Studios, Florida", note:'High-demand rides and Star Wars attractions.'},
  {id:'animal-kingdom', name:"Disney's Animal Kingdom", icon:'🦒', category:'park', tags:['rides','nature'], cost:3, energy:3, lat:28.3553, lon:-81.5900, destination:"Disney's Animal Kingdom Theme Park, Florida", note:'Theme park plus animals; better earlier in the day.'},
  {id:'universal-studios', name:'Universal Studios Florida', icon:'🎥', category:'park', tags:['rides'], cost:3, energy:3, lat:28.4754, lon:-81.4679, destination:'Universal Studios Florida', note:'Full-on ride day with strong indoor coverage.'},
  {id:'islands', name:'Islands of Adventure', icon:'🦖', category:'park', tags:['rides'], cost:3, energy:3, lat:28.4717, lon:-81.4718, destination:'Universal Islands of Adventure, Florida', note:'Thrill-heavy park with major headline rides.'},
  {id:'epic', name:'Universal Epic Universe', icon:'🌌', category:'park', tags:['rides'], cost:3, energy:3, lat:28.4405, lon:-81.4477, destination:'Universal Epic Universe, Florida', note:'Newest Universal park; check live waits before committing.'},
  {id:'seaworld', name:'SeaWorld Orlando', icon:'🐬', category:'park', tags:['rides','nature'], cost:3, energy:3, lat:28.4111, lon:-81.4618, destination:'SeaWorld Orlando, Florida', note:'Coasters, shows and marine attractions.'},
  {id:'icon-park', name:'ICON Park', icon:'🎡', category:'activity', tags:['food','rides'], cost:2, energy:1, lat:28.4432, lon:-81.4695, destination:'ICON Park, Orlando, FL', note:'Flexible evening option with food and attractions together.'},
  {id:'wonderworks', name:'WonderWorks Orlando', icon:'🧪', category:'indoor', tags:['indoor'], cost:2, energy:2, lat:28.4338, lon:-81.4714, destination:'WonderWorks Orlando, FL', note:'Indoor family attraction — handy for heat or thunderstorms.'},
  {id:'dezerland', name:'Dezerland Park Orlando', icon:'🏎', category:'indoor', tags:['indoor','rides'], cost:2, energy:2, lat:28.4635, lon:-81.4552, destination:'Dezerland Park Orlando, FL', note:'Large indoor entertainment complex; useful bad-weather fallback.'},
  {id:'crayola', name:'Crayola Experience', icon:'🖍', category:'indoor', tags:['indoor'], cost:2, energy:1, lat:28.4458, lon:-81.3951, destination:'Crayola Experience Orlando, FL', note:'Indoor and particularly suited to younger children.'},
  {id:'florida-mall', name:'The Florida Mall', icon:'🛍', category:'shopping', tags:['shopping','food','indoor'], cost:1, energy:1, lat:28.4465, lon:-81.3954, destination:'The Florida Mall, Orlando, FL', note:'Air-conditioned shopping and food — gloriously weather-proof.'},
  {id:'millenia', name:'The Mall at Millenia', icon:'🛍', category:'shopping', tags:['shopping','food','indoor'], cost:1, energy:1, lat:28.4856, lon:-81.4311, destination:'The Mall at Millenia, Orlando, FL', note:'Indoor shopping with plenty of food nearby.'},
  {id:'clearwater', name:'Clearwater Beach', icon:'🌊', category:'beach', tags:['beach'], cost:1, energy:2, lat:27.9777, lon:-82.8273, destination:'Clearwater Beach, FL', note:'Proper Gulf beach day — only worth the drive when weather is on your side.'},
  {id:'cocoa', name:'Cocoa Beach', icon:'🏄', category:'beach', tags:['beach'], cost:1, energy:2, lat:28.3200, lon:-80.6076, destination:'Cocoa Beach, FL', note:'Atlantic beach option that pairs well with the Space Coast.'},
  {id:'daytona', name:'Daytona Beach', icon:'☀️', category:'beach', tags:['beach'], cost:1, energy:2, lat:29.2108, lon:-81.0228, destination:'Daytona Beach, FL', note:'Beach plus boardwalk atmosphere; a substantial day trip.'},
  {id:'kennedy', name:'Kennedy Space Center', icon:'🚀', category:'activity', tags:['indoor'], cost:3, energy:2, lat:28.5230, lon:-80.6814, destination:'Kennedy Space Center Visitor Complex, FL', note:'Excellent full-day alternative to the Orlando parks.'},
  {id:'minigolf', name:'Crazy golf near me', icon:'⛳', category:'activity', tags:['lowcost'], cost:1, energy:1, search:'mini golf', note:'Low-commitment family option when nobody wants another huge day.'},
  {id:'food', name:'Easy family meal nearby', icon:'🍔', category:'food', tags:['food','indoor'], cost:2, energy:1, search:'family restaurant', note:'Prioritise an easy meal and give everyone a reset.'}
];

const parks = [
  {name:'Magic Kingdom', id:'75ea578a-adc8-4116-a54d-dccb60765ef9'},
  {name:'EPCOT', id:'47f90d2c-e191-4239-a466-5892ef59a88b'},
  {name:'Hollywood Studios', id:'288747d1-8b4f-4a64-867e-ea7c9b27bad8'},
  {name:'Animal Kingdom', id:'1c84a229-8862-4648-9c71-378ddd2c7693'},
  {name:'Universal Studios', id:'eb3f4560-2383-4a36-9152-6b3e5ed6bc57'},
  {name:'Islands of Adventure', id:'267615cc-8943-4c2a-ae2c-5da728ca591f'},
  {name:'Epic Universe', id:'12dbb85b-265f-44e6-bccf-f1faa17211fc'},
  {name:'SeaWorld Orlando', id:'27d64dee-d85e-48dc-ad6d-8077445cd946'}
];

const weatherCode = (code) => {
  if ([0].includes(code)) return ['Clear','☀️'];
  if ([1,2].includes(code)) return ['Partly cloudy','🌤'];
  if ([3].includes(code)) return ['Cloudy','☁️'];
  if ([45,48].includes(code)) return ['Foggy','🌫'];
  if ([51,53,55,56,57].includes(code)) return ['Drizzle','🌦'];
  if ([61,63,65,66,67,80,81,82].includes(code)) return ['Rain','🌧'];
  if ([71,73,75,77,85,86].includes(code)) return ['Snow','🌨'];
  if ([95,96,99].includes(code)) return ['Thunderstorms','⛈'];
  return ['Mixed weather','🌤'];
};
const toF = c => (c * 9/5) + 32;
const temp = c => state.unit === 'f' ? `${Math.round(toF(c))}°F` : `${Math.round(c)}°C`;
const miles = km => km * 0.621371;
const haversine = (a,b,c,d) => { const R=6371, p=Math.PI/180, x=(c-a)*p, y=(d-b)*p; const q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2; return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q)); };
const distMiles = a => state.coords && a.lat ? miles(haversine(state.coords.lat,state.coords.lon,a.lat,a.lon)) : null;
const money = n => '$'.repeat(n);

function showToast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'),1900); }
function setView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='explore') renderExplore();
  if(name==='saved') renderSaved();
  if(name==='parks' && !$('#parksList').children.length) loadParks();
}
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.target)));

async function requestLocation(){
  $('#locationLabel').textContent='Finding your location…';
  if(!navigator.geolocation){ $('#locationLabel').textContent='Location not supported'; return; }
  navigator.geolocation.getCurrentPosition(async pos=>{
    state.coords={lat:pos.coords.latitude,lon:pos.coords.longitude};
    $('#locationLabel').textContent='Using your current location';
    await loadWeather(); renderExplore();
  }, err=>{
    $('#locationLabel').textContent='Location off — using Orlando for demo';
    state.coords={lat:28.3772,lon:-81.5707};
    loadWeather(); renderExplore();
  },{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
}
$('#refreshLocation').addEventListener('click',requestLocation);

async function loadWeather(){
  if(!state.coords) return;
  const {lat,lon}=state.coords;
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,precipitation&hourly=precipitation_probability,weather_code,temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&timezone=auto&forecast_days=2`;
  try{
    const r=await fetch(u); if(!r.ok) throw new Error('Weather unavailable');
    state.weather=await r.json(); renderWeather();
  }catch(e){
    $('#weatherCard').className='hero-card weather-card';
    $('#weatherCard').innerHTML=`<div class="weather-top"><div><div class="weather-place">WEATHER</div><div class="weather-summary">Couldn’t load live weather</div></div><div class="weather-icon">🌤</div></div><div class="weather-alert">Tap Refresh above or check your connection.</div>`;
  }
}
function renderWeather(){
  const w=state.weather, c=w.current, d=w.daily, [summary,icon]=weatherCode(c.weather_code);
  const maxRain=d.precipitation_probability_max?.[0] ?? 0;
  let alert='Conditions look fairly flexible for family plans.';
  if([95,96,99].includes(c.weather_code)||maxRain>=60) alert='Storm/rain risk is significant — keep an indoor fallback handy.';
  else if(c.apparent_temperature>=34) alert='Feels very hot — shorter outdoor spells and indoor options may be smarter.';
  $('#weatherCard').className='hero-card weather-card';
  $('#weatherCard').innerHTML=`
    <div class="weather-top"><div><div class="weather-place">RIGHT NOW</div><div class="weather-temp">${temp(c.temperature_2m)}</div><div class="weather-summary">${summary} · feels ${temp(c.apparent_temperature)}</div></div><div class="weather-icon">${icon}</div></div>
    <div class="weather-grid">
      <div class="weather-stat"><small>High</small><b>${temp(d.temperature_2m_max[0])}</b></div>
      <div class="weather-stat"><small>Low</small><b>${temp(d.temperature_2m_min[0])}</b></div>
      <div class="weather-stat"><small>Rain risk</small><b>${Math.round(maxRain)}%</b></div>
    </div><div class="weather-alert">${alert}</div>`;
}

function recommendationScore(a){
  let score=60, reasons=[];
  const d=distMiles(a); const p=state.profile; const w=state.weather;
  if(d!=null){ score += Math.max(-25, 18-(d*.55)); if(d>p.maxDrive){score-=30; reasons.push('further than your usual travel range');} else if(d<15) reasons.push('fairly close'); }
  if(a.tags.some(t=>p.interests.includes(t))) score+=10;
  if(a.energy>({low:1,medium:2,high:3}[p.energy])){score-=9; reasons.push('a bigger-energy option');}
  const budgetLevel={low:1,medium:2,high:3}[p.budget]; if(a.cost>budgetLevel){score-=13; reasons.push('above your preferred spend');}
  const hour=new Date().getHours();
  if(w){
    const rain=w.daily.precipitation_probability_max?.[0]||0; const feels=w.current.apparent_temperature;
    const indoor=a.tags.includes('indoor')||a.category==='shopping'; const outdoor=['beach','park'].includes(a.category);
    if(rain>=55 && indoor){score+=18; reasons.push('good rain fallback');}
    if(rain>=55 && a.category==='beach'){score-=35; reasons.push('weather works against a beach day');}
    if(feels>=34 && p.heatAware && indoor){score+=14; reasons.push('air-conditioned');}
    if(feels>=36 && p.heatAware && outdoor){score-=12; reasons.push('hard work in the heat');}
  }
  if(hour>=17 && a.category==='shopping'){score+=8; reasons.push('easy evening option');}
  if(hour>=16 && a.category==='beach'){score-=10;}
  if(hour>=15 && a.category==='park'){score-=5; reasons.push('late for a full park day');}
  if(a.id==='food' && hour>=16){score+=12; reasons.push('good reset for the evening');}
  return {score:Math.max(1,Math.min(99,Math.round(score))), reason:reasons.slice(0,2).join(' · ')||a.note};
}
function runRecommendations(forcedTag=null){
  let list=activities.map(a=>({...a,...recommendationScore(a)}));
  if(forcedTag){ list=list.filter(a=>a.category===forcedTag||a.tags.includes(forcedTag)); }
  list.sort((a,b)=>b.score-a.score);
  $('#recommendations').classList.remove('hidden');
  $('#recommendationList').innerHTML=list.slice(0,4).map((a,i)=>placeCard(a,true,i===0)).join('');
  wirePlaceActions($('#recommendationList'));
  $('#recommendations').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#whatNowBtn').addEventListener('click',()=>runRecommendations());
$('#rerunBtn').addEventListener('click',()=>runRecommendations());
$$('.quick-card').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.quick==='park'){setView('parks');return;}
  runRecommendations(b.dataset.quick);
}));

function placeCard(a, withScore=false, hero=false){
  const d=distMiles(a); const saved=state.saved.includes(a.id); const meta=[d!=null?`${d<10?d.toFixed(1):Math.round(d)} mi away`:null,money(a.cost),a.category.replace(/^./,x=>x.toUpperCase())].filter(Boolean).join(' · ');
  return `<article class="place-card" data-id="${a.id}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${hero?'⭐ ':''}${a.name}</div>${withScore?`<span class="score-pill">${a.score}% fit</span>`:''}</div><div class="place-meta">${meta}</div></div></div><div class="reason">${withScore?(a.reason||a.note):a.note}</div><div class="place-actions"><button class="small-btn save-btn">${saved?'♥ Saved':'♡ Save'}</button><button class="small-btn primary-small directions-btn">${a.search?'Find nearby':'Directions'}</button></div></article>`;
}
function wirePlaceActions(root){
  $$('.save-btn',root).forEach(b=>b.addEventListener('click',()=>{
    const id=b.closest('.place-card').dataset.id; toggleSave(id); renderExplore(); renderSaved();
    if(!$('#recommendations').classList.contains('hidden')) runRecommendations();
  }));
  $$('.directions-btn',root).forEach(b=>b.addEventListener('click',()=>{
    const id=b.closest('.place-card').dataset.id, a=activities.find(x=>x.id===id);
    const q=a.search ? `${a.search} near me` : a.destination;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,'_blank','noopener');
  }));
}
function toggleSave(id){
  state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];
  localStorage.setItem('ffvp_saved',JSON.stringify(state.saved)); showToast(state.saved.includes(id)?'Saved to your trip':'Removed from saved');
}
function renderExplore(){
  let list=activities.map(a=>({...a,...recommendationScore(a)}));
  if(state.filter!=='all'){
    if(state.filter==='lowcost') list=list.filter(a=>a.cost===1);
    else list=list.filter(a=>a.category===state.filter||a.tags.includes(state.filter));
  }
  list.sort((a,b)=>{const ad=distMiles(a)??999, bd=distMiles(b)??999; return ad-bd});
  $('#exploreList').innerHTML=list.map(a=>placeCard(a,false)).join(''); wirePlaceActions($('#exploreList'));
}
$$('#exploreFilters .chip').forEach(c=>c.addEventListener('click',()=>{
  state.filter=c.dataset.filter; $$('#exploreFilters .chip').forEach(x=>x.classList.toggle('active',x===c)); renderExplore();
}));
function renderSaved(){
  const list=activities.filter(a=>state.saved.includes(a.id)).map(a=>({...a,...recommendationScore(a)}));
  $('#savedList').innerHTML=list.length?list.map(a=>placeCard(a,false)).join(''):`<div class="error-card"><b>Nothing saved yet.</b><br/>Use the heart button while exploring to build the family shortlist.</div>`;
  wirePlaceActions($('#savedList'));
}

async function loadPark(p){
  const r=await fetch(`https://api.themeparks.wiki/v1/entity/${p.id}/live`); if(!r.ok) throw new Error('Unavailable');
  const data=await r.json(); const raw=data.liveData||data.children||data;
  const rows=(Array.isArray(raw)?raw:[]).map(x=>{
    const standby=x.queue?.STANDBY?.waitTime ?? x.queue?.standby?.waitTime ?? x.waitTime ?? null;
    return {name:x.name||x.entity?.name||'Attraction',wait:Number.isFinite(standby)?standby:null,status:x.status||''};
  }).filter(x=>x.wait!==null);
  const open=rows.filter(x=>x.wait>=0); const avg=open.length?Math.round(open.reduce((s,x)=>s+x.wait,0)/open.length):null;
  const top=[...open].sort((a,b)=>b.wait-a.wait).slice(0,3);
  return {...p,avg,top,count:open.length};
}
function parkCard(p){
  if(p.error) return `<article class="park-card"><div class="park-head"><div class="park-name">${p.name}</div><span class="park-status closed">Unavailable</span></div><p style="font-size:12px;margin-top:10px">Live data couldn't be loaded right now.</p></article>`;
  return `<article class="park-card"><div class="park-head"><div class="park-name">${p.name}</div><span class="park-status">LIVE</span></div><div class="park-waits"><div class="wait-stat"><small>Avg wait</small><b>${p.avg==null?'—':p.avg+' min'}</b></div><div class="wait-stat"><small>Rides reporting</small><b>${p.count}</b></div></div><div class="ride-list">${p.top.length?p.top.map(r=>`<div class="ride-row"><span>${r.name}</span><span>${r.wait} min</span></div>`).join(''):'<div class="ride-row"><span>No standby waits reporting</span></div>'}</div></article>`;
}
async function loadParks(){
  $('#parksList').innerHTML=parks.map(p=>`<article class="park-card loading-card"><div class="skeleton medium"></div><div class="skeleton wide"></div></article>`).join('');
  const results=await Promise.all(parks.map(async p=>{try{return await loadPark(p)}catch(e){return {...p,error:true}}}));
  $('#parksList').innerHTML=results.map(parkCard).join('');
}
$('#refreshParks').addEventListener('click',loadParks);

function loadProfileForm(){
  const p=state.profile; $('#adults').value=p.adults; $('#children').value=p.children; $('#maxDrive').value=p.maxDrive; $('#budget').value=p.budget; $('#energy').value=p.energy; $('#heatAware').checked=p.heatAware;
  $$('input[name=interests]').forEach(i=>i.checked=p.interests.includes(i.value)); updateUnits();
}
$('#familyForm').addEventListener('submit',e=>{
  e.preventDefault(); state.profile={adults:+$('#adults').value,children:+$('#children').value,maxDrive:+$('#maxDrive').value,budget:$('#budget').value,energy:$('#energy').value,interests:$$('input[name=interests]:checked').map(x=>x.value),heatAware:$('#heatAware').checked};
  localStorage.setItem('ffvp_profile',JSON.stringify(state.profile)); $('#saveProfileMsg').classList.remove('hidden'); setTimeout(()=>$('#saveProfileMsg').classList.add('hidden'),1600); renderExplore();
});
function updateUnits(){ $('#unitC').classList.toggle('active',state.unit==='c'); $('#unitF').classList.toggle('active',state.unit==='f'); if(state.weather) renderWeather(); }
$$('.segmented button').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;localStorage.setItem('ffvp_unit',state.unit);updateUnits()}));

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('#installBtn').classList.remove('hidden')});
$('#installBtn').addEventListener('click',async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('#installBtn').classList.add('hidden')});

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
loadProfileForm(); renderExplore(); renderSaved(); requestLocation();
