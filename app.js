// Family Vacation Planner V1.8 — time-to-value recommendations
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const defaultMembers = () => [
  {id:crypto.randomUUID?.() || String(Date.now()), name:'Adult 1', age:35, height:68, thrill:'medium'},
  {id:crypto.randomUUID?.() || String(Date.now()+1), name:'Child 1', age:10, height:54, thrill:'medium'}
];
const defaultProfile = {
  familyName:'', homeBase:'', members:defaultMembers(), maxDrive:30, budget:'medium', energy:'medium',
  interests:['rides','food','shopping','beach','indoor'], heatAware:true, notes:''
};
const savedProfile = JSON.parse(localStorage.getItem('ffvp_profile') || 'null');
const state = {
  coords:null, weather:null,
  unit:localStorage.getItem('ffvp_unit') || (navigator.language?.toLowerCase().includes('us') ? 'f' : 'c'),
  profile:{...defaultProfile, ...(savedProfile || {}), members:(savedProfile?.members?.length ? savedProfile.members : defaultMembers())},
  saved:JSON.parse(localStorage.getItem('ffvp_saved') || '[]'), deferredInstall:null, filter:'all'
};

const activities = [
  {id:'disney-springs',name:'Disney Springs',icon:'✨',category:'shopping',tags:['shopping','food','indoor'],cost:1,energy:1,lat:28.3703,lon:-81.5194,destination:'Disney Springs, Lake Buena Vista, FL',note:'Food, shops and entertainment with no theme-park admission.'},
  {id:'magic-kingdom',name:'Magic Kingdom',icon:'🏰',category:'park',tags:['rides'],cost:3,energy:3,lat:28.4177,lon:-81.5812,destination:'Magic Kingdom Park, Florida',note:'Broad family appeal, but ride-by-ride height rules still matter.',familyStyle:'broad'},
  {id:'epcot',name:'EPCOT',icon:'🌐',category:'park',tags:['rides','food'],cost:3,energy:3,lat:28.3747,lon:-81.5494,destination:'EPCOT, Florida',note:'Rides, food and a slightly more grown-up pace.',familyStyle:'broad'},
  {id:'hollywood',name:"Disney's Hollywood Studios",icon:'🎬',category:'park',tags:['rides'],cost:3,energy:3,lat:28.3575,lon:-81.5583,destination:"Disney's Hollywood Studios, Florida",note:'Headline attractions make height and thrill preference especially relevant.',familyStyle:'thrill'},
  {id:'animal-kingdom',name:"Disney's Animal Kingdom",icon:'🦒',category:'park',tags:['rides','nature'],cost:3,energy:3,lat:28.3553,lon:-81.5900,destination:"Disney's Animal Kingdom Theme Park, Florida",note:'Animals plus rides, with plenty beyond pure thrills.',familyStyle:'broad'},
  {id:'universal-studios',name:'Universal Studios Florida',icon:'🎥',category:'park',tags:['rides'],cost:3,energy:3,lat:28.4754,lon:-81.4679,destination:'Universal Studios Florida',note:'Thrill-led day; family height mix matters.',familyStyle:'thrill'},
  {id:'islands',name:'Islands of Adventure',icon:'🦖',category:'park',tags:['rides'],cost:3,energy:3,lat:28.4717,lon:-81.4718,destination:'Universal Islands of Adventure, Florida',note:'Thrill-heavy park where smaller visitors can have fewer headline options.',familyStyle:'thrill'},
  {id:'epic',name:'Universal Epic Universe',icon:'🌌',category:'park',tags:['rides'],cost:3,energy:3,lat:28.4405,lon:-81.4477,destination:'Universal Epic Universe, Florida',note:'Big park day; check individual attraction rules.',familyStyle:'thrill'},
  {id:'seaworld',name:'SeaWorld Orlando',icon:'🐬',category:'park',tags:['rides','nature'],cost:3,energy:3,lat:28.4111,lon:-81.4618,destination:'SeaWorld Orlando, Florida',note:'Coasters, shows and marine attractions.',familyStyle:'thrill'},
  {id:'icon-park',name:'ICON Park',icon:'🎡',category:'activity',tags:['food','rides'],cost:2,energy:1,lat:28.4432,lon:-81.4695,destination:'ICON Park, Orlando, FL',note:'Flexible evening option with food and attractions together.'},
  {id:'wonderworks',name:'WonderWorks Orlando',icon:'🧪',category:'indoor',tags:['indoor'],cost:2,energy:2,lat:28.4338,lon:-81.4714,destination:'WonderWorks Orlando, FL',note:'Indoor family attraction — handy for heat or thunderstorms.'},
  {id:'dezerland',name:'Dezerland Park Orlando',icon:'🏎',category:'indoor',tags:['indoor','rides'],cost:2,energy:2,lat:28.4635,lon:-81.4552,destination:'Dezerland Park Orlando, FL',note:'Large indoor entertainment complex; useful bad-weather fallback.'},
  {id:'crayola',name:'Crayola Experience',icon:'🖍',category:'indoor',tags:['indoor'],cost:2,energy:1,lat:28.4458,lon:-81.3951,destination:'Crayola Experience Orlando, FL',note:'Indoor and particularly suited to younger children.',familyStyle:'young'},
  {id:'florida-mall',name:'The Florida Mall',icon:'🛍',category:'shopping',tags:['shopping','food','indoor'],cost:1,energy:1,lat:28.4465,lon:-81.3954,destination:'The Florida Mall, Orlando, FL',note:'Air-conditioned shopping and food — gloriously weather-proof.'},
  {id:'millenia',name:'The Mall at Millenia',icon:'🛍',category:'shopping',tags:['shopping','food','indoor'],cost:1,energy:1,lat:28.4856,lon:-81.4311,destination:'The Mall at Millenia, Orlando, FL',note:'Indoor shopping with plenty of food nearby.'},
  {id:'clearwater',name:'Clearwater Beach',icon:'🌊',category:'beach',tags:['beach','nature'],cost:1,energy:2,lat:27.9777,lon:-82.8273,destination:'Clearwater Beach, FL',note:'Proper Gulf beach day — only worth the drive when weather is on your side.'},
  {id:'cocoa',name:'Cocoa Beach',icon:'🏄',category:'beach',tags:['beach','nature'],cost:1,energy:2,lat:28.3200,lon:-80.6076,destination:'Cocoa Beach, FL',note:'Atlantic beach option that pairs well with the Space Coast.'},
  {id:'daytona',name:'Daytona Beach',icon:'☀️',category:'beach',tags:['beach','nature'],cost:1,energy:2,lat:29.2108,lon:-81.0228,destination:'Daytona Beach, FL',note:'Beach plus boardwalk atmosphere; a substantial day trip.'},
  {id:'kennedy',name:'Kennedy Space Center',icon:'🚀',category:'activity',tags:['indoor'],cost:3,energy:2,lat:28.5230,lon:-80.6814,destination:'Kennedy Space Center Visitor Complex, FL',note:'Excellent full-day alternative to the Orlando parks.'},
  {id:'minigolf',name:'Crazy golf near me',icon:'⛳',category:'activity',tags:['lowcost'],cost:1,energy:1,search:'mini golf',note:'Low-commitment family option when nobody wants another huge day.'},
  {id:'food-budget',name:'Quick family meal nearby',icon:'🍔',category:'food',tags:['food','indoor'],cost:1,energy:1,search:'family quick service restaurant',foodTier:'budget',internalView:'food',note:'Fast, casual and easier on the holiday wallet.'},
  {id:'food-casual',name:'Casual sit-down meal nearby',icon:'🍽',category:'food',tags:['food','indoor'],cost:2,energy:1,search:'family casual dining restaurant',foodTier:'casual',internalView:'food',note:'A proper sit-down meal without turning dinner into an event.'},
  {id:'food-treat',name:'Treat-night restaurant nearby',icon:'🥩',category:'food',tags:['food','indoor'],cost:3,energy:1,search:'family friendly upscale restaurant',foodTier:'treat',internalView:'food',note:'For when the holiday budget has officially entered “we are here now” mode.'}
];

const essentials = [
  {id:'groceries',icon:'🛒',name:'Groceries',sub:'Supermarkets & food shops',query:'grocery store',cost:'$–$$',costNote:'Basket cost varies',osm:['["shop"="supermarket"]','["shop"="grocery"]']},
  {id:'pharmacy',icon:'💊',name:'Pharmacy',sub:'Medication & everyday health supplies',query:'pharmacy',cost:'$',costNote:'Everyday items usually low-cost',osm:['["amenity"="pharmacy"]']},
  {id:'fuel',icon:'⛽',name:'Fuel',sub:'Gas stations nearby',query:'gas station',cost:'$$',costNote:'Pump prices vary by station',osm:['["amenity"="fuel"]']},
  {id:'convenience',icon:'🏪',name:'Convenience store',sub:'Snacks, drinks & forgotten bits',query:'convenience store',cost:'$$',costNote:'Usually pricier than supermarkets',osm:['["shop"="convenience"]']},
  {id:'laundry',icon:'🧺',name:'Laundry',sub:'Laundromats & wash services',query:'laundromat',cost:'$–$$',costNote:'Often around $5–15 per load/service',osm:['["shop"="laundry"]','["amenity"="laundry"]']},
  {id:'car',icon:'🔧',name:'Car help',sub:'Tyres, battery & repair shops',query:'auto repair',cost:'$$–$$$',costNote:'Depends heavily on the repair',osm:['["shop"="car_repair"]','["shop"="tyres"]']},
  {id:'clinic',icon:'🩺',name:'Urgent care / clinic',sub:'Non-emergency medical care',query:'urgent care',cost:'$$–$$$',costNote:'Cash / insurance rates vary',osm:['["amenity"="clinic"]','["healthcare"="clinic"]']},
  {id:'hospital',icon:'🏥',name:'Hospital / ER',sub:'Emergency departments nearby',query:'hospital emergency room',cost:'$$$',costNote:'Emergency care can be expensive',osm:['["amenity"="hospital"]']}
];
const stayInIdeas = [
  {icon:'🛋',name:'Proper reset day',note:'Drop the agenda. Films, games, naps, snacks and nobody putting shoes on.'},
  {icon:'🍕',name:'Order dinner in',note:'Search delivery or takeaway options and let the villa / hotel do the heavy lifting.',search:'food delivery'},
  {icon:'🎲',name:'Family game challenge',note:'Pick teams, set a tiny prize and run a cards / board-game / console tournament.'},
  {icon:'🏊',name:'Pool & shade session',note:'Good when conditions are safe. Avoid pools during thunderstorms and follow property rules.',weatherSensitive:true},
  {icon:'🍿',name:'Movie + snack run',note:'One person does a quick snack mission; everybody else claims the sofa.',search:'convenience store'},
  {icon:'📸',name:'Holiday photo catch-up',note:'Share photos, make favourites and actually look at the memories you have already made.'}
];

const parks = [
  {name:'Magic Kingdom',id:'75ea578a-adc8-4116-a54d-dccb60765ef9',style:'broad',pressureBias:1},
  {name:'EPCOT',id:'47f90d2c-e191-4239-a466-5892ef59a88b',style:'broad',pressureBias:4},
  {name:'Hollywood Studios',id:'288747d1-8b4f-4a64-867e-ea7c9b27bad8',style:'thrill',pressureBias:7},
  {name:'Animal Kingdom',id:'1c84a229-8862-4648-9c71-378ddd2c7693',style:'broad',pressureBias:-2},
  {name:'Universal Studios',id:'eb3f4560-2383-4a36-9152-6b3e5ed6bc57',style:'thrill',pressureBias:4},
  {name:'Islands of Adventure',id:'267615cc-8943-4c2a-ae2c-5da728ca591f',style:'thrill',pressureBias:6},
  {name:'Epic Universe',id:'12dbb85b-265f-44e6-bccf-f1faa17211fc',style:'thrill',pressureBias:10},
  {name:'SeaWorld Orlando',id:'27d64dee-d85e-48dc-ad6d-8077445cd946',style:'thrill',pressureBias:-3}
];

// V1.5 crowd outlook is deliberately a transparent beta heuristic.
// It uses season, day-of-week, weather and a small park-specific pressure bias.
// It is NOT official attendance/capacity. The architecture is ready for a licensed
// historical provider or our own recorded-history model later.
const seasonPressure=[62,66,72,64,50,46,39,24,22,34,49,70]; // Jan-Dec beta seasonal pattern
const weekdayPressure=[-5,7,3,0,-3,3,6]; // Sun-Sat
function crowdOutlook(p,date=new Date()){
  const month=date.getMonth(),day=date.getDay();
  let score=seasonPressure[month]+weekdayPressure[day]+(p.pressureBias||0);
  if(state.weather && date.toDateString()===new Date().toDateString()){
    const rain=state.weather.daily?.precipitation_probability_max?.[0]||0;
    const feels=state.weather.current?.apparent_temperature||0;
    if(rain>=70)score-=7;
    if(feels>=36)score-=4;
  }
  score=Math.max(5,Math.min(90,Math.round(score)));
  const band=score<=25?'Low':score<=50?'Moderate':score<=70?'Busy':'Very busy';
  const tone=score<=25?'green':score<=50?'amber':score<=70?'orange':'red';
  return {score,band,tone};
}
function waitHeat(avg){
  if(avg==null)return {band:'No data',tone:'neutral'};
  if(avg<=20)return {band:'Light',tone:'green'};
  if(avg<=35)return {band:'Moderate',tone:'amber'};
  if(avg<=50)return {band:'Heavy',tone:'orange'};
  return {band:'Very heavy',tone:'red'};
}
function parkValueSignal(p){
  if(p.avg==null)return {label:'Not enough live data',tone:'neutral',copy:'Wait-time pressure cannot be compared yet.'};
  const expected=12+(p.outlook.score*.43)+(p.pressureBias||0);
  const delta=p.avg-expected;
  if(delta>=15)return {label:'Poor value right now',tone:'red',copy:`Live waits are about ${Math.round(delta)} min above the beta expectation for this crowd outlook. An alternative park may give you more for the same time.`};
  if(delta>=7)return {label:'Watch the waits',tone:'orange',copy:`Queues are running above what this crowd outlook would normally suggest.`};
  if(delta<=-9)return {label:'Better than expected',tone:'green',copy:`Live waits are running below the beta expectation for this crowd outlook.`};
  return {label:'About as expected',tone:'amber',copy:'Live waits are broadly in line with the beta crowd outlook.'};
}

const weatherCode = code => {
  if(code===0)return ['Clear','☀️']; if([1,2].includes(code))return ['Partly cloudy','🌤']; if(code===3)return ['Cloudy','☁️'];
  if([45,48].includes(code))return ['Foggy','🌫']; if([51,53,55,56,57].includes(code))return ['Drizzle','🌦'];
  if([61,63,65,66,67,80,81,82].includes(code))return ['Rain','🌧']; if([95,96,99].includes(code))return ['Thunderstorms','⛈']; return ['Mixed weather','🌤'];
};
const toF=c=>(c*9/5)+32, temp=c=>state.unit==='f'?`${Math.round(toF(c))}°F`:`${Math.round(c)}°C`, bothTemp=c=>`${Math.round(c)}°C / ${Math.round(toF(c))}°F`, miles=km=>km*.621371;
const haversine=(a,b,c,d)=>{const R=6371,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p,q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));};
const distMiles=a=>state.coords&&a.lat?miles(haversine(state.coords.lat,state.coords.lon,a.lat,a.lon)):null;
const money=n=>'$'.repeat(n);
const memberSummary=()=>state.profile.members || [];
const childMembers=()=>memberSummary().filter(m=>(+m.age||0)<18);
const smallerVisitors=()=>childMembers().filter(m=>(+m.age||0)<8 || (+m.height||999)<48);
const lowThrill=()=>memberSummary().filter(m=>m.thrill==='low').length;
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),1900);}
function updateGreeting(){
  const h=new Date().getHours(),part=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
  const family=state.profile.familyName?.trim();
  const title=$('#todayGreeting'),copy=$('#todayGreetingCopy');
  if(title)title.textContent=family?`${part}, ${family}`:part;
  if(copy)copy.textContent='Here’s what looks smartest for your crew right now.';
}
function mapsSearch(q){window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q+' near me')}`,'_blank','noopener');}

function setView(name){
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='explore')renderExplore(); if(name==='saved')renderSaved(); if(name==='parks'&&!$('#parksList').children.length)loadParks();
  if(name==='essentials')renderEssentials(); if(name==='food')loadFood(); if(name==='stayin')renderStayIn(); if(name==='family')loadProfileForm();
}
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.target)));
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.back)));

async function requestLocation(){
  $('#locationLabel').textContent='Finding your location…';
  if(!navigator.geolocation){$('#locationLabel').textContent='Location not supported';return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    state.coords={lat:pos.coords.latitude,lon:pos.coords.longitude}; $('#locationLabel').textContent='Using your current location'; await loadWeather(); renderExplore();
  },()=>{ $('#locationLabel').textContent='Location off — using Orlando for demo'; state.coords={lat:28.3772,lon:-81.5707}; loadWeather();renderExplore(); },{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
}
$('#refreshLocation').addEventListener('click',requestLocation);

async function loadWeather(){
  if(!state.coords)return; const {lat,lon}=state.coords;
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,precipitation&hourly=precipitation_probability,weather_code,temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&timezone=auto&forecast_days=2`;
  try{const r=await fetch(u);if(!r.ok)throw new Error();state.weather=await r.json();renderWeather();}catch(e){$('#weatherCard').className='hero-card weather-card';$('#weatherCard').innerHTML='<b>Weather unavailable right now.</b><p style="color:#d7e7e4;margin-top:8px">The planner still works, but weather-aware scoring is paused.</p>';}
}
function formatWeatherHour(iso){
  if(!iso)return ''; const d=new Date(iso); return d.toLocaleTimeString([], {hour:'numeric',minute:undefined});
}
function rainWindow(w){
  const times=w.hourly?.time||[], probs=w.hourly?.precipitation_probability||[]; if(!times.length)return null;
  const now=new Date(w.current?.time||Date.now()).getTime(); let start=times.findIndex(t=>new Date(t).getTime()>=now); if(start<0)start=0;
  const end=Math.min(times.length,start+12); let best=start,bestP=-1;
  for(let i=start;i<end;i++){const p=Number(probs[i]||0);if(p>bestP){bestP=p;best=i;}}
  if(bestP<20)return {prob:bestP,label:'low next 12h'};
  const lo=Math.max(start,best-1), hi=Math.min(end-1,best+1);
  return {prob:bestP,label:`${formatWeatherHour(times[lo])}–${formatWeatherHour(times[hi])}`};
}
function renderWeather(){
  const w=state.weather;if(!w)return;const c=w.current,d=w.daily,[summary,icon]=weatherCode(c.weather_code),maxRain=d.precipitation_probability_max?.[0]||0,rain=rainWindow(w);
  const rainText=rain&&rain.prob>=20?`${Math.round(rain.prob)}% · ${rain.label}`:`${Math.round(maxRain)}% · low nearby`;
  let alert=rain&&rain.prob>=55?`Best storm window: ${rain.label}. Indoor options get a boost.`:'Weather looks usable for a mixed day.';
  if([95,96,99].includes(c.weather_code))alert='Thunderstorms nearby now — stay out of pools and exposed outdoor areas.'; else if(c.apparent_temperature>=34)alert='Feels very hot — shorter outdoor spells and air-conditioned options may be smarter.';
  $('#weatherCard').className='hero-card weather-card'; $('#weatherCard').innerHTML=`<div class="weather-top"><div><div class="weather-place">RIGHT NOW</div><div class="weather-temp">${bothTemp(c.temperature_2m)}</div><div class="weather-summary">${summary} · feels ${bothTemp(c.apparent_temperature)}</div></div><div class="weather-icon">${icon}</div></div><div class="weather-grid"><div class="weather-stat"><small>High</small><b>${bothTemp(d.temperature_2m_max[0])}</b></div><div class="weather-stat"><small>Low</small><b>${bothTemp(d.temperature_2m_min[0])}</b></div><div class="weather-stat"><small>Rain risk</small><b>${rainText}</b></div></div><div class="weather-alert">${alert}</div>`;
}

const stayHomeRecommendation = {
  id:'stay-home', name:'Stay in & reset', icon:'🏠', category:'stayin', tags:['indoor'], cost:1, energy:0,
  note:'Keep the evening easy at your villa / hotel — food in, pool only if conditions are safe, games, films or tomorrow planning.',
  internalView:'stayin', transient:true, minVisit:30
};

function dayPhase(date=new Date()){
  const h=date.getHours();
  if(h<11)return 'morning'; if(h<15)return 'midday'; if(h<18)return 'afternoon'; if(h<21)return 'evening'; return 'late';
}
function estimatedTravelMinutes(a){
  const d=distMiles(a); if(d==null){if(a.category==='stayin')return 0;if(a.internalView==='food')return 10;return null;}
  const roadMiles=d*1.22; // simple road-vs-straight-line allowance for beta
  const speed=d<8?24:d<25?32:46;
  return Math.max(4,Math.round((roadMiles/speed)*60+5));
}
function minimumVisitMinutes(a){
  if(Number.isFinite(a.minVisit))return a.minVisit;
  return ({park:240,beach:180,activity:90,indoor:90,shopping:75,food:60,stayin:30}[a.category]||75);
}
function recommendationWindow(){
  const now=new Date(),phase=dayPhase(now),mins=now.getHours()*60+now.getMinutes();
  const labels={morning:'BEST THIS MORNING',midday:'BEST AROUND LUNCH',afternoon:'BEST THIS AFTERNOON',evening:'BEST THIS EVENING',late:'BEST FOR TONIGHT'};
  const titles={morning:'Make the most of the morning',midday:'What works next?',afternoon:'Best use of the afternoon',evening:'Worth doing this evening',late:'Keep tonight easy'};
  const copies={
    morning:'Plenty of day left — distance matters less when the payoff is worth it.',
    midday:'We’re balancing travel time with how much useful day you’ll have when you arrive.',
    afternoon:'Long journeys and full-day attractions start losing value from here.',
    evening:'Nearby food, shopping and shorter entertainment get priority over big day trips.',
    late:'We’re heavily favouring nearby options that are still worth the journey — or staying in.'
  };
  return {now,phase,mins,label:labels[phase],title:titles[phase],copy:copies[phase]};
}
function foodEstimate(tier){
  const adults=memberSummary().filter(m=>(+m.age||0)>=13).length || 2, kids=Math.max(0,memberSummary().length-adults);
  const rates={budget:[11,18,7,11],casual:[18,29,10,17],treat:[30,48,15,24]}[tier];
  const lo=adults*rates[0]+kids*rates[2], hi=adults*rates[1]+kids*rates[3];
  return `$${Math.round(lo)}–$${Math.round(hi)} est. for your group`;
}
function familyFitReason(a){
  if(a.familyStyle==='thrill' && (smallerVisitors().length || lowThrill())) return 'Mixed family fit: younger/smaller or low-thrill visitors may have fewer headline options.';
  if(a.familyStyle==='young' && childMembers().some(m=>(+m.age||0)<=11)) return 'Strong fit for families with younger children.';
  if(a.familyStyle==='broad') return 'Broad family mix, but check individual attraction requirements.';
  return '';
}
function recommendationScore(a){
  let score=60,reasons=[];const d=distMiles(a),p=state.profile,w=state.weather;
  const windowInfo=recommendationWindow(),hour=windowInfo.now.getHours(),phase=windowInfo.phase;
  const travel=estimatedTravelMinutes(a),visit=minimumVisitMinutes(a);

  if(d!=null){
    score+=Math.max(-25,18-(d*.55));
    if(d>p.maxDrive){score-=30;reasons.push('further than your usual travel range');}
    else if(d<15)reasons.push('fairly close');
  }
  if(travel!=null){
    // Travel starts to matter much more as the usable day disappears.
    if(travel>25)score-=Math.min(20,(travel-25)*.7);
    if(phase==='evening'&&travel>25){score-=10;reasons.push(`about ${travel} min away`);}
    if(phase==='late'&&travel>15){score-=Math.min(38,(travel-15)*1.25);reasons.push(`~${travel} min each way this late`);}

    const usableEnd=23*60+30;
    const remaining=Math.max(0,usableEnd-windowInfo.mins);
    const commitment=travel*2+visit;
    if(hour>=17&&commitment>remaining){
      score-=Math.min(38,Math.max(8,(commitment-remaining)/5));
      reasons.push('not much useful time left after travel');
    }
  }

  if(a.tags.some(t=>p.interests.includes(t)))score+=10;
  if(a.energy>({low:1,medium:2,high:3}[p.energy])){score-=9;reasons.push('a bigger-energy option');}
  const budgetLevel={low:1,medium:2,high:3}[p.budget];if(a.cost>budgetLevel){score-=13;reasons.push('above your preferred spend');}
  if(a.familyStyle==='thrill'&&smallerVisitors().length){score-=12;reasons.push('mixed fit for younger/smaller visitors');}
  if(a.familyStyle==='thrill'&&lowThrill()){score-=8;reasons.push('not everyone is thrill-focused');}
  if(a.familyStyle==='young'&&childMembers().some(m=>(+m.age||0)<=11)){score+=12;reasons.push('good younger-child fit');}

  if(w){
    const rain=w.daily.precipitation_probability_max?.[0]||0,feels=w.current.apparent_temperature,indoor=a.tags.includes('indoor')||a.category==='shopping'||a.category==='stayin',outdoor=['beach','park'].includes(a.category);
    if(rain>=55&&indoor){score+=18;reasons.push('good rain fallback');}
    if(rain>=55&&a.category==='beach'){score-=35;reasons.push('weather works against an outdoor day');}
    if(feels>=34&&p.heatAware&&indoor){score+=14;reasons.push('keeps you out of the heat');}
    if(feels>=36&&p.heatAware&&outdoor){score-=12;reasons.push('hard work in the heat');}
  }

  // Strong daypart behaviour: the same place should score very differently at 9am and 9:30pm.
  if(a.category==='park'){
    if(phase==='afternoon'){score-=10;reasons.push('late for a full park day');}
    if(phase==='evening'){score-=34;reasons.push('limited park time left');}
    if(phase==='late'){score-=72;reasons.push('too late to justify a park journey');}
  }
  if(a.category==='beach'){
    if(hour>=18){score-=48;reasons.push('too late for a worthwhile beach trip');}
    else if(hour>=16)score-=16;
  }
  if(a.category==='shopping'){
    if(phase==='evening'){score+=10;reasons.push('easy evening option');}
    if(phase==='late'){score-=4;reasons.push('check closing time before leaving');}
  }
  if(a.category==='food'&&hour>=16){score+=(travel!=null&&travel<=20?20:8);reasons.push(travel!=null&&travel<=20?'nearby food fits the evening':'food still fits the evening');}
  if(a.category==='stayin'){
    if(phase==='evening')score+=22;
    if(phase==='late'){score+=52;reasons.push('zero travel at this time of night');}
  }

  return {score:Math.max(1,Math.min(99,Math.round(score))),reason:reasons.slice(0,2).join(' · ')||familyFitReason(a)||a.note,travelMinutes:travel};
}
function runRecommendations(forcedTag=null){
  const context=recommendationWindow();
  let candidates=[...activities];
  if(!forcedTag)candidates.push(stayHomeRecommendation);
  let list=candidates.map(a=>({...a,...recommendationScore(a)}));
  if(forcedTag)list=list.filter(a=>a.category===forcedTag||a.tags.includes(forcedTag));
  list.sort((a,b)=>b.score-a.score);
  const eyebrow=$('#recommendationsEyebrow'),title=$('#recommendationsTitle'),copy=$('#recommendationsContext');
  if(eyebrow)eyebrow.textContent=context.label;
  if(title)title.textContent=context.title;
  if(copy)copy.textContent=context.copy+' Drive times are planning estimates, not live traffic.';
  $('#recommendations').classList.remove('hidden');
  $('#recommendationList').innerHTML=list.slice(0,4).map((a,i)=>placeCard(a,true,i===0)).join('');
  wirePlaceActions($('#recommendationList'));
  $('#recommendations').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#whatNowBtn').addEventListener('click',()=>runRecommendations());$('#rerunBtn').addEventListener('click',()=>runRecommendations());
$$('.quick-card').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.quick;if(q==='park'){setView('parks');return;}if(q==='family'){showOnboarding();return;}if(q==='food'||q==='essentials'||q==='stayin'){setView(q);return;}runRecommendations(q);}));

function placeCard(a,withScore=false,hero=false){
  const d=distMiles(a),saved=!a.transient&&state.saved.includes(a.id),budget=a.foodTier?foodEstimate(a.foodTier):money(a.cost),travel=a.travelMinutes??estimatedTravelMinutes(a);
  const distanceMeta=d!=null?`${d<10?d.toFixed(1):Math.round(d)} mi · ~${travel} min drive`:(a.category==='stayin'?'No travel':null);
  const meta=[distanceMeta,budget,a.category.replace(/^./,x=>x.toUpperCase())].filter(Boolean).join(' · '),fit=familyFitReason(a);
  const saveAction=a.transient?'':`<button class="small-btn save-btn">${saved?'♥ Saved':'♡ Save'}</button>`;
  const primaryAction=a.internalView?`<button class="small-btn primary-small internal-view-btn" data-view="${a.internalView}">See ideas</button>`:`<button class="small-btn primary-small directions-btn">${a.search?'Find nearby':'Directions'}</button>`;
  return `<article class="place-card" data-id="${a.id}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${hero?'⭐ ':''}${a.name}</div>${withScore?`<span class="score-pill">${a.score}% fit</span>`:''}</div><div class="place-meta">${meta}</div></div></div><div class="reason">${withScore?(a.reason||a.note):a.note}${fit&&!withScore?`<br><span class="family-fit">${fit}</span>`:''}</div><div class="place-actions">${saveAction}${primaryAction}</div></article>`;
}
function wirePlaceActions(root){
  $$('.save-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id;toggleSave(id);renderExplore();renderSaved();if(!$('#recommendations').classList.contains('hidden'))runRecommendations();}));
  $$('.directions-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id,a=activities.find(x=>x.id===id);if(!a)return;const q=a.search?`${a.search} near me`:a.destination;window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,'_blank','noopener');}));
  $$('.internal-view-btn',root).forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
}
function toggleSave(id){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];localStorage.setItem('ffvp_saved',JSON.stringify(state.saved));showToast(state.saved.includes(id)?'Saved to your trip':'Removed from saved');}
function renderExplore(){let list=activities.map(a=>({...a,...recommendationScore(a)}));if(state.filter!=='all'){if(state.filter==='lowcost')list=list.filter(a=>a.cost===1);else list=list.filter(a=>a.category===state.filter||a.tags.includes(state.filter));}list.sort((a,b)=>(distMiles(a)??999)-(distMiles(b)??999));$('#exploreList').innerHTML=list.map(a=>placeCard(a,false)).join('');wirePlaceActions($('#exploreList'));}
$$('#exploreFilters .chip').forEach(c=>c.addEventListener('click',()=>{state.filter=c.dataset.filter;$$('#exploreFilters .chip').forEach(x=>x.classList.toggle('active',x===c));renderExplore();}));
function renderSaved(){const list=activities.filter(a=>state.saved.includes(a.id)).map(a=>({...a,...recommendationScore(a)}));$('#savedList').innerHTML=list.length?list.map(a=>placeCard(a,false)).join(''):'<div class="error-card"><b>Nothing saved yet.</b><br/>Use the heart button while exploring to build the family shortlist.</div>';wirePlaceActions($('#savedList'));}

function renderEssentials(){
  $('#essentialsList').innerHTML=essentials.map(e=>`<button type="button" class="essential-card" data-essential="${e.id}"><span>${e.icon}</span><div><b>${e.name}</b><small>${e.sub}</small><em>${e.cost} · ${e.costNote}</em></div><i class="essential-chevron" aria-hidden="true">›</i></button>`).join('');
  $$('.essential-card',$('#essentialsList')).forEach(b=>b.addEventListener('click',()=>openEssential(b.dataset.essential)));
}
function openEssential(id){
  const e=essentials.find(x=>x.id===id);if(!e)return;
  $('#essentialDetailIcon').textContent=e.icon;
  $('#essentialDetailTitle').textContent=e.name;
  $('#essentialDetailCopy').textContent=`${e.sub} · ${e.cost} cost guide`;
  setView('essential-detail');
  loadNearbyEssential(id);
}
function essentialName(el,e){const t=el.tags||{};return t.name||t.brand||t.operator||`${e.name} nearby`;}
function essentialCoords(el){return {lat:el.lat??el.center?.lat,lon:el.lon??el.center?.lon};}
function essentialAddress(el){
  const t=el.tags||{},line1=[t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' '),line2=[t['addr:city'],t['addr:state']].filter(Boolean).join(', ');
  return [line1,line2].filter(Boolean).join(' · ')||t['addr:full']||'';
}
function directionsUrl(x){return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${x.lat},${x.lon}`)}&travelmode=driving`;}
function mapsSearchUrl(q){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q+' near me')}`;}
function essentialResultCard(x,e){
  const d=x.distance<10?x.distance.toFixed(1):Math.round(x.distance),address=x.address?` · ${escapeHtml(x.address)}`:'';
  return `<article class="place-card essential-result"><div class="place-top"><div class="place-icon">${e.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${escapeHtml(x.name)}</div><span class="score-pill">${d} mi</span></div><div class="place-meta">${e.cost} typical cost guide${address}</div></div></div><div class="reason">${e.costNote}. Price guide is approximate rather than live.</div><div class="place-actions"><a class="small-btn primary-small direction-link" href="${directionsUrl(x)}" target="_blank" rel="noopener">Directions →</a></div></article>`;
}
async function loadNearbyEssential(id){
  const e=essentials.find(x=>x.id===id);if(!e)return;
  if(!state.coords){
    $('#essentialsStatus').innerHTML='<span>📍</span><div><b>Location needed</b><small>Turn on location, then tap Try again.</small></div>';
    $('#essentialResults').innerHTML=`<article class="place-card"><div class="reason">We need your location to rank nearby ${e.name.toLowerCase()}.</div><div class="place-actions"><button type="button" class="small-btn primary-small retry-essential">Try again</button></div></article>`;
    $('.retry-essential').addEventListener('click',async()=>{await requestLocation();loadNearbyEssential(id);});
    return;
  }
  $('#essentialsStatus').innerHTML=`<span class="mini-spinner"></span><div><b>Finding ${e.name.toLowerCase()} near you…</b><small>Our server is checking nearby options so you can stay inside the app.</small></div>`;
  $('#essentialResults').innerHTML='';
  const {lat,lon}=state.coords;
  try{
    const r=await fetch(`/api/nearby?category=${encodeURIComponent(id)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,{headers:{'Accept':'application/json'}});
    if(!r.ok)throw new Error(`Nearby ${r.status}`);
    const data=await r.json(),results=Array.isArray(data.results)?data.results:[];
    if(!results.length)throw new Error('No nearby results');
    $('#essentialsStatus').innerHTML=`<span>📍</span><div><b>Closest ${e.name.toLowerCase()}</b><small>${results.length} nearby options · ${escapeHtml(data.source||'nearby data')}.</small></div>`;
    $('#essentialResults').innerHTML=results.map(x=>essentialResultCard(x,e)).join('');
  }catch(err){
    $('#essentialsStatus').innerHTML=`<span>🧭</span><div><b>Nearby lookup is temporarily unavailable</b><small>Try again in a moment. Maps is only the emergency fallback.</small></div>`;
    $('#essentialResults').innerHTML=`<article class="place-card"><div class="reason">Our nearby service could not return ${e.name.toLowerCase()} just now.</div><div class="place-actions"><button type="button" class="small-btn retry-essential">Try again</button><a class="small-btn direction-link" href="${mapsSearchUrl(e.query)}" target="_blank" rel="noopener">Fallback Maps →</a></div></article>`;
    $('.retry-essential').addEventListener('click',()=>loadNearbyEssential(id));
  }
}

let foodResultsCache=[];
let foodSortMode='distance';
function familyCounts(){
  const members=state.profile.members||[];
  const adults=Math.max(1,members.filter(m=>(+m.age||0)>=18).length || 1);
  const children=members.filter(m=>(+m.age||0)<18).length;
  return {adults,children};
}
function foodPriceText(level){
  if(level===1)return '$'; if(level===2)return '$$'; if(level===3)return '$$$'; if(level>=4)return '$$$$'; return '$–$$';
}
function familyMealEstimate(level){
  const {adults,children}=familyCounts();
  const bands={1:[10,18,7,12],2:[18,35,10,20],3:[35,60,18,30],4:[60,100,25,45]};
  const b=bands[level]||[16,32,9,18];
  const low=Math.round(adults*b[0]+children*b[2]),high=Math.round(adults*b[1]+children*b[3]);
  return `Family est. $${low}–$${high}`;
}
function foodDirectionsUrl(x){return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(x.lat+','+x.lon)}&travelmode=driving`;}
function foodCard(x){
  const rating=x.rating?`<span class="food-rating">★ ${Number(x.rating).toFixed(1)}${x.userRatingCount?` <small>(${x.userRatingCount})</small>`:''}</span>`:`<span class="food-rating muted-rating">Rating unavailable</span>`;
  const price=foodPriceText(x.priceLevel),estimate=familyMealEstimate(x.priceLevel);
  const d=x.distance<10?x.distance.toFixed(1):Math.round(x.distance);
  const type=x.typeLabel||'Food & drink';
  const open=x.openNow===true?'<span class="open-pill open">Open now</span>':x.openNow===false?'<span class="open-pill closed">Closed</span>':'';
  return `<article class="place-card food-card"><div class="food-card-top"><div><div class="place-title">${escapeHtml(x.name)}</div><div class="place-meta">${escapeHtml(type)} · ${d} mi away ${open}</div></div>${rating}</div><div class="food-budget-row"><span class="price-pill">${price}</span><b>${estimate}</b></div>${x.address?`<div class="reason">${escapeHtml(x.address)}</div>`:''}<div class="place-actions"><a class="small-btn primary-small direction-link" href="${foodDirectionsUrl(x)}" target="_blank" rel="noopener">Directions →</a></div></article>`;
}
function renderFoodResults(){
  let list=[...foodResultsCache];
  const late=new Date().getHours()>=19;
  // In the evening, known-open places should naturally rise above known-closed places.
  const openRank=x=>x.openNow===true?0:x.openNow==null?1:2;
  if(foodSortMode==='rating')list.sort((a,b)=>(late?openRank(a)-openRank(b):0)||(b.rating||-1)-(a.rating||-1)||a.distance-b.distance);
  else if(foodSortMode==='budget')list.sort((a,b)=>(late?openRank(a)-openRank(b):0)||(a.priceLevel||2)-(b.priceLevel||2)||a.distance-b.distance);
  else if(foodSortMode==='treat')list.sort((a,b)=>(late?openRank(a)-openRank(b):0)||(b.priceLevel||2)-(a.priceLevel||2)||(b.rating||0)-(a.rating||0));
  else list.sort((a,b)=>(late?openRank(a)-openRank(b):0)||a.distance-b.distance);
  $('#foodResults').innerHTML=list.map(foodCard).join('');
}
async function loadFood(force=false){
  if(foodResultsCache.length&&!force){renderFoodResults();return;}
  if(!state.coords){$('#foodStatus').innerHTML='<span>📍</span><div><b>Location needed</b><small>Turn on location and try again.</small></div>';return;}
  $('#foodStatus').innerHTML='<span class="mini-spinner"></span><div><b>Finding nearby food…</b><small>Ratings and price guidance where available.</small></div>';
  $('#foodResults').innerHTML='';
  const {lat,lon}=state.coords;
  try{
    const r=await fetch(`/api/food?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,{headers:{Accept:'application/json'}});
    if(!r.ok)throw new Error(`Food ${r.status}`);
    const data=await r.json();foodResultsCache=Array.isArray(data.results)?data.results:[];
    if(!foodResultsCache.length)throw new Error('No food results');
    const rich=foodResultsCache.some(x=>x.rating||x.priceLevel);
    $('#foodStatus').innerHTML=`<span>🍽</span><div><b>${foodResultsCache.length} nearby options</b><small>${rich?'Ratings + price guidance available':'Nearby shortlist found · ratings need Google Places to be enabled'} · ${escapeHtml(data.source||'places data')}</small></div>`;
    $('#foodSort').querySelector('[data-food-sort="rating"]').disabled=!foodResultsCache.some(x=>x.rating);
    renderFoodResults();
  }catch(err){
    $('#foodStatus').innerHTML='<span>🧭</span><div><b>Food lookup is temporarily unavailable</b><small>Try again in a moment.</small></div>';
    $('#foodResults').innerHTML='<article class="place-card"><div class="reason">We could not load nearby restaurants just now.</div><div class="place-actions"><button class="small-btn primary-small retry-food">Try again</button></div></article>';
    $('.retry-food').addEventListener('click',()=>loadFood(true));
  }
}
$$('[data-food-sort]').forEach(b=>b.addEventListener('click',()=>{if(b.disabled)return;foodSortMode=b.dataset.foodSort;$$('[data-food-sort]').forEach(x=>x.classList.toggle('active',x===b));renderFoodResults();}));

function renderStayIn(){
  const storm=state.weather&&[95,96,99].includes(state.weather.current.weather_code),rain=state.weather?.daily?.precipitation_probability_max?.[0]||0;
  $('#stayInList').innerHTML=stayInIdeas.map(i=>{let note=i.note;if(i.weatherSensitive&&(storm||rain>65))note='Skip the pool for now: weather suggests a safer indoor reset instead.';return `<article class="place-card stay-card"><div class="place-top"><div class="place-icon">${i.icon}</div><div class="place-main"><div class="place-title">${i.name}</div></div></div><div class="reason">${note}</div>${i.search?`<div class="place-actions"><button class="small-btn primary-small stay-search" data-search="${i.search}">Find nearby</button></div>`:''}</article>`;}).join('');
  $$('.stay-search').forEach(b=>b.addEventListener('click',()=>mapsSearch(b.dataset.search)));
}

async function loadParkSchedule(p){
  try{
    const r=await fetch(`https://api.themeparks.wiki/v1/entity/${p.id}/schedule`);if(!r.ok)return null;
    const data=await r.json(),entries=Array.isArray(data)?data:(data.schedule||[]);
    const today=new Date(),key=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const operating=entries.find(e=>String(e.date||'').slice(0,10)===key&&String(e.type||'OPERATING').toUpperCase()==='OPERATING')||entries.find(e=>String(e.date||'').slice(0,10)===key);
    if(!operating)return null;
    const openRaw=operating.openingTime||operating.opening_time||operating.startTime||operating.start;
    const closeRaw=operating.closingTime||operating.closing_time||operating.endTime||operating.end;
    const open=openRaw?new Date(openRaw):null,close=closeRaw?new Date(closeRaw):null,now=new Date();
    let status='UNKNOWN';
    if(open&&close){if(now<open)status='NOT_OPEN_YET';else if(now>=close)status='CLOSED';else if((close-now)/60000<=60)status='CLOSING_SOON';else status='OPEN';}
    return {open,close,status};
  }catch(e){return null;}
}
function timeLabel(d){return d?d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):'—';}
async function loadPark(p){
  const [liveR,schedule]=await Promise.all([
    fetch(`https://api.themeparks.wiki/v1/entity/${p.id}/live`),
    loadParkSchedule(p)
  ]);
  if(!liveR.ok)throw new Error();
  const data=await liveR.json(),raw=data.liveData||data.children||data;
  const rows=(Array.isArray(raw)?raw:[]).map(x=>{
    const standby=x.queue?.STANDBY?.waitTime??x.queue?.standby?.waitTime??x.waitTime??null;
    return {name:x.name||x.entity?.name||'Attraction',wait:Number.isFinite(standby)?standby:null,status:x.status||'',lastUpdated:x.lastUpdated||null};
  }).filter(x=>x.wait!==null);
  const open=rows.filter(x=>x.wait>=0),avg=open.length?Math.round(open.reduce((s,x)=>s+x.wait,0)/open.length):null;
  const top=[...open].sort((a,b)=>b.wait-a.wait).slice(0,3);
  const sorted=open.map(x=>x.wait).sort((a,b)=>a-b);
  const median=sorted.length?sorted[Math.floor(sorted.length/2)]:null;
  const outlook=crowdOutlook(p,new Date());
  const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
  const tomorrowOutlook=crowdOutlook(p,tomorrow);
  const result={...p,avg,median,top,count:open.length,outlook,tomorrowOutlook,schedule};
  result.heat=waitHeat(avg);result.value=parkValueSignal(result);return result;
}
function parkFit(p){if(p.style==='thrill'&&(smallerVisitors().length||lowThrill()))return 'Mixed fit for your family';return 'Broad family fit';}
function tempPill(label,tone){return `<span class="pressure-pill ${tone}"><span class="pressure-dot"></span>${label}</span>`;}
function parkStatusPill(p){
  const s=p.schedule?.status;
  if(s==='CLOSED')return '<span class="park-status closed">CLOSED</span>';
  if(s==='NOT_OPEN_YET')return '<span class="park-status soon">OPENS LATER</span>';
  if(s==='CLOSING_SOON')return '<span class="park-status warning">CLOSING SOON</span>';
  if(s==='OPEN')return '<span class="park-status">OPEN</span>';
  return p.count?'<span class="park-status">LIVE</span>':'<span class="park-status closed">NO LIVE DATA</span>';
}
function parkHoursLine(p){const s=p.schedule;if(!s||!s.open||!s.close)return '';return `<div class="park-hours">Today · ${timeLabel(s.open)}–${timeLabel(s.close)}</div>`;}
function parkCard(p){
  if(p.error)return `<article class="park-card"><div class="park-head"><div class="park-name">${p.name}</div><span class="park-status closed">Unavailable</span></div><p class="park-error">Live data couldn't be loaded right now.</p></article>`;
  const closed=['CLOSED','NOT_OPEN_YET'].includes(p.schedule?.status);
  const heat=closed?tempPill('Not live','neutral'):tempPill(`${p.heat.band}`,p.heat.tone);
  const value=closed?`<div class="value-signal neutral"><div class="value-title">${p.schedule?.status==='NOT_OPEN_YET'?'Park has not opened yet':'Park is closed'}</div><div class="value-copy">Crowd outlook remains useful; live queue pressure resumes when the park is operating.</div></div>`:`<div class="value-signal ${p.value.tone}"><div class="value-title">${p.value.label}</div><div class="value-copy">${p.value.copy}</div></div>`;
  return `<article class="park-card pressure-card">
    <div class="park-head"><div><div class="park-name">${p.name}</div><div class="park-fit">${parkFit(p)}</div>${parkHoursLine(p)}</div>${parkStatusPill(p)}</div>
    <div class="pressure-strip"><div class="pressure-block"><small>Crowd outlook</small>${tempPill(`${p.outlook.band} · ${p.outlook.score}/100`,p.outlook.tone)}</div><div class="pressure-block"><small>Live wait heat</small>${heat}</div></div>
    <div class="park-waits triple"><div class="wait-stat"><small>Avg wait</small><b>${closed?'—':(p.avg==null?'—':p.avg+' min')}</b></div><div class="wait-stat"><small>Median</small><b>${closed?'—':(p.median==null?'—':p.median+' min')}</b></div><div class="wait-stat"><small>Rides live</small><b>${closed?'—':p.count}</b></div></div>
    ${value}
    <div class="tomorrow-outlook"><span>Tomorrow outlook</span>${tempPill(`${p.tomorrowOutlook.band} · ${p.tomorrowOutlook.score}/100`,p.tomorrowOutlook.tone)}</div>
    <div class="ride-list">${closed?'<div class="ride-row"><span>Live waits resume while the park is open</span></div>':(p.top.length?p.top.map(r=>`<div class="ride-row"><span>${r.name}</span><span>${r.wait} min</span></div>`).join(''):'<div class="ride-row"><span>No standby waits reporting</span></div>')}</div>
  </article>`;
}
async function loadParks(){
  $('#parksList').innerHTML=parks.map(()=>'<article class="park-card loading-card"><div class="skeleton medium"></div><div class="skeleton wide"></div></article>').join('');
  const results=await Promise.all(parks.map(async p=>{try{return await loadPark(p)}catch(e){return{...p,error:true}}}));
  $('#parksList').innerHTML=results.map(parkCard).join('');
}
$('#refreshParks').addEventListener('click',loadParks);

function newMember(seed={}){return{id:crypto.randomUUID?.()||String(Date.now()+Math.random()),name:seed.name||'',age:seed.age??'',height:seed.height??'',thrill:seed.thrill||'medium'};}
function memberRow(m,scope){return `<div class="member-row crew-card" data-id="${m.id}"><div class="crew-avatar">${(+m.age||0)<13?'🧒':'😎'}</div><div class="crew-fields"><div class="member-row-top"><input class="member-name" type="text" maxlength="25" placeholder="Name / nickname" value="${escapeHtml(m.name)}"/><button class="member-remove" type="button" aria-label="Remove">×</button></div><div class="member-fields"><label>Age<input class="member-age" type="number" min="0" max="99" value="${m.age}"></label><label>Height (in)<input class="member-height" type="number" min="20" max="90" value="${m.height}"></label><label>Ride vibe<select class="member-thrill"><option value="low" ${m.thrill==='low'?'selected':''}>🙂 Gentle please</option><option value="medium" ${m.thrill==='medium'?'selected':''}>🎢 Some thrills</option><option value="high" ${m.thrill==='high'?'selected':''}>🚀 Bring it on</option></select></label></div></div></div>`;}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function renderMemberEditor(rootId,members){const root=$(rootId);root.innerHTML=members.map(m=>memberRow(m)).join('');$$('.member-remove',root).forEach(b=>b.addEventListener('click',()=>{if(root.children.length<=1){showToast('Keep at least one family member');return;}b.closest('.member-row').remove();}));}
function collectMembers(rootId){return $$('.member-row',$(rootId)).map(r=>({id:r.dataset.id,name:$('.member-name',r).value.trim()||'Family member',age:+$('.member-age',r).value||0,height:+$('.member-height',r).value||0,thrill:$('.member-thrill',r).value}));}
function addMemberTo(rootId){const root=$(rootId);root.insertAdjacentHTML('beforeend',memberRow(newMember()));const row=root.lastElementChild;$('.member-remove',row).addEventListener('click',()=>row.remove());}
$('#addMember').addEventListener('click',()=>addMemberTo('#familyMembers'));$('#addSetupMember').addEventListener('click',()=>addMemberTo('#setupMembers'));

function loadProfileForm(){const p=state.profile;$('#familyName').value=p.familyName||'';$('#homeBase').value=p.homeBase||'';$('#maxDrive').value=p.maxDrive;$('#budget').value=p.budget;$('#energy').value=p.energy;$('#heatAware').checked=p.heatAware;$('#familyNotes').value=p.notes||'';renderMemberEditor('#familyMembers',p.members);$$('input[name=interests]').forEach(i=>i.checked=p.interests.includes(i.value));updateUnits();}
$('#familyForm').addEventListener('submit',e=>{e.preventDefault();state.profile={...state.profile,familyName:$('#familyName').value.trim(),homeBase:$('#homeBase').value.trim(),members:collectMembers('#familyMembers'),maxDrive:+$('#maxDrive').value,budget:$('#budget').value,energy:$('#energy').value,interests:$$('input[name=interests]:checked').map(x=>x.value),heatAware:$('#heatAware').checked,notes:$('#familyNotes').value.trim()};saveProfile();$('#saveProfileMsg').classList.remove('hidden');setTimeout(()=>$('#saveProfileMsg').classList.add('hidden'),1600);renderExplore();});
function saveProfile(){localStorage.setItem('ffvp_profile',JSON.stringify(state.profile));updateGreeting();}
function updateUnits(){$('#unitC').classList.toggle('active',state.unit==='c');$('#unitF').classList.toggle('active',state.unit==='f');if(state.weather)renderWeather();}
$$('.segmented button').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;localStorage.setItem('ffvp_unit',state.unit);updateUnits();}));

let setupStep=0;
function showSetupStep(n){setupStep=Math.max(0,Math.min(2,n));$$('.setup-step').forEach((x,i)=>x.classList.toggle('active',i===setupStep));$$('.setup-progress span').forEach((x,i)=>x.classList.toggle('active',i<=setupStep));$('.skip-setup').classList.toggle('hidden',setupStep>0);}
function showOnboarding(){
  const p=state.profile;$('#setupFamilyName').value=p.familyName||'';$('#setupHomeBase').value=p.homeBase||'';$('#setupMaxDrive').value=p.maxDrive||30;$('#setupBudget').value=p.budget||'medium';$('#setupNotes').value=p.notes||'';renderMemberEditor('#setupMembers',p.members?.length?p.members:defaultMembers());showSetupStep(0);$('#onboarding').classList.remove('hidden');
}
$$('.setup-next').forEach(b=>b.addEventListener('click',()=>showSetupStep(setupStep+1)));$$('.setup-back').forEach(b=>b.addEventListener('click',()=>showSetupStep(setupStep-1)));
$('#onboardingForm').addEventListener('submit',e=>{e.preventDefault();state.profile={...state.profile,familyName:$('#setupFamilyName').value.trim(),homeBase:$('#setupHomeBase').value.trim(),maxDrive:+$('#setupMaxDrive').value,budget:$('#setupBudget').value,notes:$('#setupNotes').value.trim(),members:collectMembers('#setupMembers')};saveProfile();localStorage.setItem('ffvp_onboarded','1');$('#onboarding').classList.add('hidden');loadProfileForm();renderExplore();showToast('Adventure crew saved ✨');});
$('#skipSetup').addEventListener('click',()=>{localStorage.setItem('ffvp_onboarded','1');$('#onboarding').classList.add('hidden');});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').addEventListener('click',async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('#installBtn').classList.add('hidden');});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

loadProfileForm();updateGreeting();renderExplore();renderSaved();renderEssentials();requestLocation();if(!localStorage.getItem('ffvp_onboarded'))showOnboarding();
