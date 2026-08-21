// Family Vacation Planner V2.2.11 — contextual holiday copy + trip-aware dayparts
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const defaultHeightUnit = () => navigator.language?.toLowerCase().startsWith('en-us') ? 'imperial' : 'metric';
const memberRole = m => m?.role || ((+m?.age||0) < 18 ? 'child' : 'adult');
const memberInitial = (name='', role='adult', index=0) => {
  const cleaned=String(name).trim();
  if(cleaned){const parts=cleaned.split(/\s+/).filter(Boolean);return (parts.length>1?(parts[0][0]+parts.at(-1)[0]):parts[0][0]).toUpperCase();}
  return role==='child'?`C${index+1}`:`A${index+1}`;
};
const defaultMembers = () => [
  {id:crypto.randomUUID?.() || String(Date.now()), name:'Adult 1', age:35, height:68, heightUnit:defaultHeightUnit(), role:'adult', thrill:'medium'},
  {id:crypto.randomUUID?.() || String(Date.now()+1), name:'Child 1', age:10, height:54, heightUnit:defaultHeightUnit(), role:'child', thrill:'medium'}
];
const defaultProfile = {
  familyName:'', homeBase:'', destinationPreset:'orlando', members:defaultMembers(), maxDrive:30, budget:'medium', energy:'medium',
  interests:['rides','food','shopping','beach','indoor'], heatAware:true, notes:'', quickNotes:[], arrivalDate:'', departureDate:'', budgetRemaining:'', walkingTolerance:'medium'
};
const savedProfile = JSON.parse(localStorage.getItem('ffvp_profile') || 'null');
const state = {
  coords:null, weather:null,
  unit:localStorage.getItem('ffvp_unit') || (navigator.language?.toLowerCase().includes('us') ? 'f' : 'c'),
  profile:{...defaultProfile, ...(savedProfile || {}), members:(savedProfile?.members?.length ? savedProfile.members : defaultMembers())},
  saved:JSON.parse(localStorage.getItem('ffvp_saved') || '[]'), tripStatuses:JSON.parse(localStorage.getItem('ffvp_trip_statuses') || '{}'), plans:JSON.parse(localStorage.getItem('ffvp_plans') || '[]'),
  discovered:JSON.parse(localStorage.getItem('ffvp_discovered') || '{}'), prepDone:JSON.parse(localStorage.getItem('ffvp_prep_done') || '{}'),
  locationMode:localStorage.getItem('ffvp_test_location') || 'gps', locationName:'', discoveryCategory:'sights', localSeedKey:'', parkSchedules:{}, deferredInstall:null, filter:'all', recommendationRuns:{}, tomorrowMood:localStorage.getItem('ffvp_tomorrow_mood') || null
};
const betaForceOnboarding = () => localStorage.getItem('ffvp_force_onboarding') !== '0';
const betaForceLanding = () => localStorage.getItem('ffvp_force_landing') !== '0';

const quickIconSvg = {
  stayin:'<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>',
  indoor:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0Z"/><path d="M12 4v16"/><path d="M12 20a2 2 0 0 0 4 0"/></svg>',
  food:'<svg viewBox="0 0 24 24"><path d="M7 3v8"/><path d="M4.5 3v5a2.5 2.5 0 0 0 5 0V3"/><path d="M7 11v10"/><path d="M15 3v18"/><path d="M15 3c3 1 4.5 3.5 4.5 6S18 13 15 13"/></svg>',
  outdoors:'<svg viewBox="0 0 24 24"><circle cx="17" cy="6" r="2.5"/><path d="M3 19h18"/><path d="m5 19 5-9 3 5 2-3 4 7"/></svg>',
  thrills:'<svg viewBox="0 0 24 24"><path d="m13 2-8 12h7l-1 8 8-12h-7z"/></svg>',
  shopping:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
  sights:'<svg viewBox="0 0 24 24"><path d="M4 19h16"/><path d="M6 19v-8l6-5 6 5v8"/><path d="M9 19v-5h6v5"/><path d="m18 4 .6 1.4L20 6l-1.4.6L18 8l-.6-1.4L16 6l1.4-.6Z"/></svg>'
};

const locationPresets = {
  orlando:{name:'Orlando / Central Florida',short:'Orlando',lat:28.3772,lon:-81.5707,region:'florida'},
  'new-york':{name:'New York City',short:'New York',lat:40.7580,lon:-73.9855,region:'new-york'},
  winsford:{name:'Winsford / Cheshire',short:'Cheshire',lat:53.1914,lon:-2.5234,region:'cheshire'},
  london:{name:'London',short:'London',lat:51.5074,lon:-0.1278,region:'london'},
  paris:{name:'Paris',short:'Paris',lat:48.8566,lon:2.3522,region:'paris'},
  manchester:{name:'Manchester',short:'Manchester',lat:53.4808,lon:-2.2426,region:'manchester'}
};
function presetFor(key){return locationPresets[key]||null;}
function destinationPreset(){return presetFor(state.profile.destinationPreset)||locationPresets.orlando;}
function locationRegion(){
  if(state.locationMode!=='gps'&&presetFor(state.locationMode))return presetFor(state.locationMode).region;
  if(!state.coords)return destinationPreset().region;
  const d=miles(haversine(state.coords.lat,state.coords.lon,28.3772,-81.5707));if(d<180)return 'florida';
  const checks=Object.values(locationPresets).filter(x=>x.region!=='florida').map(x=>({x,d:miles(haversine(state.coords.lat,state.coords.lon,x.lat,x.lon))})).sort((a,b)=>a.d-b.d);
  return checks[0]?.d<80?checks[0].x.region:'local';
}
function isFloridaContext(){return locationRegion()==='florida';}

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

// V2.2.5: every place gets ONE primary mood. Secondary tags may tune ranking,
// but they never make the same venue eligible for a second mood.
const primaryMoodTypes={
  chill:new Set(['beach','spa','massage_spa','wellness_center','sauna','scenic_spot']),
  shopping:new Set(['shopping_mall','market','farmers_market','flea_market','gift_shop','clothing_store','book_store','toy_store','jewelry_store','shoe_store','sporting_goods_store','thrift_store','cosmetics_store']),
  outdoors:new Set(['park','city_park','state_park','national_park','botanical_garden','garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','dog_park','marina']),
  indoor:new Set(['museum','art_museum','history_museum','aquarium','art_gallery','movie_theater','bowling_alley','indoor_playground','planetarium','performing_arts_theater','cultural_center']),
  thrills:new Set(['amusement_park','water_park','adventure_sports_center','go_karting_venue','miniature_golf_course','amusement_center','ferris_wheel','roller_coaster','off_roading_area','paintball_center','video_arcade'])
};
const practicalShoppingTypes=new Set(['supermarket','grocery_store','discount_supermarket','hypermarket','warehouse_store','convenience_store','food_store','general_store','discount_store']);
function normalizedPlaceType(v){return String(v||'').toLowerCase().trim().replaceAll(' ','_');}
function discoveredTypeSet(a){return new Set([normalizedPlaceType(a?.placeType),...((a?.placeTypes||[]).map(normalizedPlaceType))].filter(Boolean));}
function primaryMoodForPlace(a){
  if(!a)return null;
  if(a.category==='stayin'||a.category==='beach')return 'chill';
  if(a.category==='food')return 'food';
  if(a.category==='park')return 'thrills';
  if(a.discovered){
    const types=discoveredTypeSet(a);
    // Practical retail belongs in Essentials, even if Google also calls it a store.
    if([...types].some(t=>practicalShoppingTypes.has(t)))return null;
    for(const mood of ['chill','thrills','outdoors','indoor','shopping'])if([...types].some(t=>primaryMoodTypes[mood].has(t)))return mood;
    if(['chill','thrills','outdoors','indoor','shopping'].includes(a.sourceCategory))return a.sourceCategory;
  }
  if(a.category==='shopping')return 'shopping';
  if(a.category==='outdoors')return 'outdoors';
  if(a.category==='indoor')return 'indoor';
  if((a.tags||[]).includes('rides'))return 'thrills';
  return null;
}
function inferDiscoveredSemantics(a){
  if(!a?.discovered)return a;
  const mood=primaryMoodForPlace(a);
  if(mood==='shopping')return {...a,category:'shopping',tags:['shopping'],primaryMood:mood};
  if(mood==='outdoors')return {...a,category:'outdoors',tags:['nature'],primaryMood:mood};
  if(mood==='indoor')return {...a,category:'indoor',tags:['indoor'],primaryMood:mood};
  if(mood==='thrills')return {...a,category:primaryMoodTypes.thrills.has(normalizedPlaceType(a.placeType))&&['amusement_park','water_park'].includes(normalizedPlaceType(a.placeType))?'park':'activity',tags:['rides'],primaryMood:mood};
  if(mood==='chill')return {...a,category:normalizedPlaceType(a.placeType)==='beach'?'beach':'activity',tags:['relax'],primaryMood:mood};
  // Broad discovery stays neutral unless its provider primary type maps cleanly.
  return {...a,category:'activity',tags:[],primaryMood:null};
}
function normalizeVenueName(name){return String(name||'').toLowerCase().replace(/&/g,' and ').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\b(supercenter|super centre|store|location|branch)\b/g,' ').replace(/\b#?\d+\b/g,' ').replace(/\s+/g,' ').trim();}
function samePhysicalPlace(a,b){
  const an=normalizeVenueName(a.name),bn=normalizeVenueName(b.name);if(!an||!bn||an!==bn)return false;
  if(!Number.isFinite(+a.lat)||!Number.isFinite(+a.lon)||!Number.isFinite(+b.lat)||!Number.isFinite(+b.lon))return true;
  return miles(haversine(+a.lat,+a.lon,+b.lat,+b.lon))<=0.35;
}
function mergeDuplicatePlace(a,b){
  const preferred=(!a.discovered&&b.discovered)?a:(!b.discovered&&a.discovered)?b:a;
  const other=preferred===a?b:a;
  return {...other,...preferred,mapsUrl:preferred.mapsUrl||other.mapsUrl||'',placeType:preferred.placeType||other.placeType||'',placeTypes:[...new Set([...(preferred.placeTypes||[]),...(other.placeTypes||[])])],provider:preferred.provider||other.provider||'',aliasIds:[...new Set([...(preferred.aliasIds||[]),...(other.aliasIds||[]),other.id]) ]};
}
function dedupePlaces(list){
  const out=[];
  for(const place of list){const idx=out.findIndex(x=>samePhysicalPlace(x,place));if(idx<0)out.push(place);else out[idx]=mergeDuplicatePlace(out[idx],place);}
  return out;
}
function allTripPlaces(){return dedupePlaces([...activities,...Object.values(state.discovered||{}).map(inferDiscoveredSemantics)]);}
function destinationLabel(){return destinationPreset().name;}
const quickMoodCopy={
  florida:{title:'What are you in the mood for?',copy:'Built around Central Florida — but the mood comes first, not the venue type.',items:[
    ['stayin','Chill & Recharge','Pool, villa or an easy reset'],['indoor','Indoor & Easy','Air-con escapes & rainy-day wins'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Nature, water & open-air ideas'],['thrills','Thrills & Excitement','Parks, coasters, karting & big-energy fun'],['shopping','Shop & Browse','Outlets, malls & retail']
  ]},
  'new-york':{title:'What are you in the mood for?',copy:'New York changes the mix — city experiences replace the Florida-first assumptions.',items:[
    ['stayin','Chill & Recharge','Hotel reset or an easy neighbourhood'],['indoor','Indoor & Easy','Museums, shows & weather-proof ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, waterfronts & city walks'],['thrills','Thrills & Excitement','Views, rides & high-energy experiences'],['shopping','Shop & Browse','Stores, markets & neighbourhoods']
  ]},
  cheshire:{title:'What are you in the mood for?',copy:'Local family options within the travel range you set.',items:[
    ['stayin','Chill & Recharge','Keep it local and low effort'],['indoor','Indoor & Easy','Museums, play & weather-proof ideas'],['food','Food & Treats','Restaurants, pubs & family treats'],['outdoors','Outdoors & Explore','Parks, trails & countryside'],['thrills','Thrills & Excitement','Coasters, karting & adventure within range'],['shopping','Shop & Browse','Town centres, retail parks & outlets']
  ]},
  london:{title:'What are you in the mood for?',copy:'City-scale options, filtered by your travel tolerance.',items:[
    ['stayin','Chill & Recharge','Hotel reset or a slower local wander'],['indoor','Indoor & Easy','Museums, galleries & shows'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, river walks & open-air sights'],['thrills','Thrills & Excitement','Views, rides & high-energy experiences'],['shopping','Shop & Browse','Markets, high streets & malls']
  ]},
  paris:{title:'What are you in the mood for?',copy:'The same moods, translated into what makes sense around Paris.',items:[
    ['stayin','Chill & Recharge','Hotel reset or a slower café break'],['indoor','Indoor & Easy','Museums, galleries & covered ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, river walks & open-air sights'],['thrills','Thrills & Excitement','Big attractions & energetic experiences'],['shopping','Shop & Browse','Markets, boutiques & shopping centres']
  ]},
  manchester:{title:'What are you in the mood for?',copy:'Urban and regional family ideas within the range you choose.',items:[
    ['stayin','Chill & Recharge','Keep it easy and local'],['indoor','Indoor & Easy','Museums, play & weather-proof ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, trails & outdoor ideas'],['thrills','Thrills & Excitement','Karting, adventure & big-energy fun'],['shopping','Shop & Browse','City centre, markets & malls']
  ]},
  local:{title:'What are you in the mood for?',copy:'I’ll translate the mood into whatever is genuinely nearby.',items:[
    ['stayin','Chill & Recharge','Keep the pace easy'],['indoor','Indoor & Easy','Weather-proof family ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, walks & open-air ideas'],['thrills','Thrills & Excitement','Adventure and high-energy options'],['shopping','Shop & Browse','Markets, malls & retail']
  ]}
};
function renderQuickMoods(){
  const t=tripContext();
  let cfg=quickMoodCopy[locationRegion()]||quickMoodCopy.local;
  if(t?.before){
    const dest=destinationPreset();
    cfg={
      title:'Build your trip',
      copy:`Discover ideas around ${dest.name} now. Mark the best ones Must do or Want to go, then shape them into your holiday.`,
      items:[
        ['sights','Must-do experiences','The iconic sights and family favourites worth planning around'],
        ['thrills','Thrills & Excitement','Big-energy days, rides and adventure experiences'],
        ['food','Food worth planning','Highly rated meals, treats and places worth booking'],
        ['outdoors','Chill & Recharge','Beaches, parks and slower days to balance the itinerary'],
        ['indoor','Indoor backups','Museums, attractions and rainy-day alternatives'],
        ['shopping','Shop & Browse','Outlets, markets and shopping worth making time for']
      ]
    };
  }
  if(t?.inTrip){
    const now=new Date(),h=now.getHours(),stage=holidayStage(t);
    if(h<5){cfg={...cfg,title:'Planning later today?',copy:'Choose the kind of day you want when everyone wakes up — I’ll turn the mood into suitable experiences nearby.'};}
    else if(h>=22){cfg={...cfg,title:'Thinking ahead to tomorrow?',copy:'Pick the vibe for tomorrow now, or leave it until morning. No need to squeeze another big plan into tonight.'};}
    else if(stage==='final-days'){cfg={...cfg,title:'A few days left — what still feels worth doing?',copy:'Choose the mood first and I’ll focus the remaining time on experiences that still feel worth the effort.'};}
    else if(stage==='early'){cfg={...cfg,title:'What are you in the mood for?',copy:'The trip is still young — choose the kind of day that fits the crew rather than trying to tick everything off at once.'};}
  }
  $('#quickStartTitle').textContent=cfg.title;$('#quickStartCopy').textContent=cfg.copy;
  cfg.items.forEach((item,i)=>{
    const b=$(`#quickMood${i+1}`);if(!b)return;
    b.dataset.quick=item[0];$('b',b).textContent=item[1];$('small',b).textContent=item[2];
    const icon=$('.quick-icon-wrap',b);if(icon&&quickIconSvg[item[0]])icon.innerHTML=quickIconSvg[item[0]];
  });
  $('#quickEssentialsLink').classList.toggle('hidden',!!t?.before);
  $('#weatherCard').classList.toggle('countdown-hidden',!!t?.before);
  const label=state.locationName||(state.locationMode==='gps'?'Near you':presetFor(state.locationMode)?.name)||destinationLabel();
  if(t?.before){const dest=destinationPreset(),nearDest=state.coords&&miles(haversine(state.coords.lat,state.coords.lon,dest.lat,dest.lon))<50;$('#todayLocationEyebrow').textContent=nearDest?`PLANNING ${dest.name.toUpperCase()}`:`COUNTDOWN TO ${dest.name.toUpperCase()}`;}
  else $('#todayLocationEyebrow').textContent=label==='Near you'?'TODAY NEAR YOU':`TODAY IN ${String(label).toUpperCase()}`;
  $('#parksNavLabel').textContent=isFloridaContext()?'Parks':'Thrills';
}

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
const money=n=>currencyInfo().symbol.repeat(n);
function currencyInfo(region=locationRegion()){if(['cheshire','london','manchester'].includes(region))return {symbol:'£',factor:.82,code:'GBP'};if(region==='paris')return {symbol:'€',factor:.95,code:'EUR'};return {symbol:'$',factor:1,code:'USD'};}
function tripCurrencyInfo(){const r=destinationPreset().region;return currencyInfo(r);}
function localCostGuide(text){return String(text||'').replace(/\$/g,currencyInfo().symbol);}
const memberSummary=()=>state.profile.members || [];
const childMembers=()=>memberSummary().filter(m=>(+m.age||0)<18);
const smallerVisitors=()=>childMembers().filter(m=>(+m.age||0)<8 || (+m.height||999)<48);
const lowThrill=()=>memberSummary().filter(m=>m.thrill==='low').length;
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),1900);}
function dateOnly(s){if(!s)return null;const [y,m,d]=String(s).split('-').map(Number);return y&&m&&d?new Date(y,m-1,d,12,0,0,0):null;}
function localDateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function tripContext(date=new Date()){
  const a=dateOnly(state.profile.arrivalDate), dep=dateOnly(state.profile.departureDate);
  if(!a||!dep||dep<a)return null;
  const day=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12), ms=86400000;
  const total=Math.max(1,Math.round((dep-a)/ms)), index=Math.floor((day-a)/ms)+1;
  const daysUntilDeparture=Math.ceil((dep-day)/ms),departureDay=localDateKey(day)===localDateKey(dep);
  return {arrival:a,departure:dep,total,index,daysUntilDeparture,departureDay,inTrip:day>=a&&day<dep,before:day<a,after:day>dep,fullDaysRemaining:Math.max(0,daysUntilDeparture-1)};
}
function plansForDate(d){const key=localDateKey(d);return state.plans.filter(x=>x.date===key).sort((a,b)=>(a.time||'23:59').localeCompare(b.time||'23:59'));}
function nextFixedPlan(now=new Date()){
  return state.plans.map(x=>({...x,when:new Date(`${x.date}T${x.time||'23:59'}:00`)})).filter(x=>x.when>=now).sort((a,b)=>a.when-b.when)[0]||null;
}
function daysUntilArrival(t){return t?.before?Math.max(0,Math.ceil((t.arrival-new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),12))/86400000)):0;}
function prepSuggestions(days,region){
  const base=[];
  if(days>21)base.push(['documents','Check passports / travel documents and any entry requirements'],['insurance','Confirm travel insurance and key bookings'],['tickets','Add fixed tickets, reservations and transport to Trip']);
  else if(days>7)base.push(['apps','Download airline, hotel and attraction apps you’ll actually need'],['meds','Check prescriptions, medication and travel-size essentials'],['money','Check cards, spending plan and roaming / eSIM options']);
  else if(days>2)base.push(['weather','Check the destination forecast and adjust packing'],['checkin','Complete any available online check-in'],['downloads','Download tickets, booking confirmations and offline entertainment']);
  else base.push(['charge','Charge phones, watches and power banks'],['docs-ready','Put passports / IDs, tickets and keys together'],['bags','Final bag check: chargers, medication, weather gear and travel snacks']);
  const local={
    florida:[['florida-kit','Pack high-SPF sunscreen, refillable bottles and lightweight rain gear'],['storms','Plan around heat and short afternoon storm windows']],
    'new-york':[['walking','Prioritise comfortable walking shoes and portable charging'],['transit','Set up contactless payment / transit plan']],
    cheshire:[['layers','Pack flexible layers and waterproofs rather than trusting one forecast']],
    london:[['transit','Set up contactless payment and save key transport routes'],['walking','Comfortable walking shoes will earn their luggage space']],
    paris:[['timed','Check timed-entry attractions and major reservations'],['transit','Save your preferred Metro / transport setup']],
    manchester:[['layers','Pack for changeable weather and comfortable walking']]
  }[region]||[];
  return [...base,...local].slice(0,5);
}
function renderPrep(){
  const section=$('#prepSection'),t=tripContext();if(!section)return;
  if(!t?.before){section.classList.add('hidden');return;}
  section.classList.remove('hidden');const days=daysUntilArrival(t),dest=destinationPreset();
  $('#prepTitle').textContent=days===0?'Your trip starts today':`${days} day${days===1?'':'s'} to ${dest.short}`;
  $('#prepCopy').textContent=days>7?'A little useful prep now means less admin once the holiday starts.':'Final stretch — keep this practical and light.';
  const key=`${state.profile.arrivalDate}:${state.profile.destinationPreset}`;const done=state.prepDone[key]||{};
  $('#prepChecklist').innerHTML=prepSuggestions(days,dest.region).map(([id,text])=>`<label class="prep-item"><input type="checkbox" data-prep-id="${id}" ${done[id]?'checked':''}><span><b>${done[id]?'Done':'Suggested prep'}</b><small>${escapeHtml(text)}</small></span></label>`).join('');
  $$('.prep-item input',$('#prepChecklist')).forEach(i=>i.addEventListener('change',()=>{state.prepDone[key]={...(state.prepDone[key]||{}),[i.dataset.prepId]:i.checked};localStorage.setItem('ffvp_prep_done',JSON.stringify(state.prepDone));renderPrep();}));
}
function holidayStage(t){
  if(!t)return 'unknown';
  if(t.before){const d=daysUntilArrival(t);return d<=1?'imminent':d<=7?'final-countdown':d<=30?'countdown':'planning';}
  if(t.after)return 'after';
  if(t.departureDay)return 'departure';
  if(t.daysUntilDeparture<=2)return 'final-days';
  if(t.index<=Math.max(2,Math.ceil(t.total*.25)))return 'early';
  if(t.index>=Math.ceil(t.total*.6))return 'later';
  return 'middle';
}
function countdownLabel(days,dest){
  if(days===0)return 'Trip day is here';
  if(days===1)return `1 sleep to ${dest}`;
  if(days<=30)return `${days} sleeps to ${dest}`;
  return `${days} days to ${dest}`;
}
function tripStageLine(t){
  if(!t)return 'Add your vacation dates and I’ll pace the planning around your trip.';
  const stage=holidayStage(t);
  if(stage==='departure')return 'Departure day — keep plans light, close and easy to abandon if travel timings move.';
  if(stage==='final-days')return `Only ${t.fullDaysRemaining} full day${t.fullDaysRemaining===1?'':'s'} left after today — make the remaining time count without exhausting everyone.`;
  if(stage==='early')return 'The holiday is still young — there’s no need to cram everything into today.';
  if(stage==='middle')return 'You’re into the rhythm of the trip now — a good time to balance must-dos with recovery.';
  if(stage==='later')return `${t.fullDaysRemaining} full day${t.fullDaysRemaining===1?'':'s'} remain after today — worth checking what is still on the must-do list.`;
  return 'I’ll keep recommendations paced around the time you have left.';
}
function moodFutureLine(mood,label='tomorrow'){
  return ({
    thrills:`Get some sleep — ${label} is shaping up to be a day of excitement.`,
    chill:`Get some sleep — ${label} can be a proper recharge day.`,
    outdoors:`Get some sleep — ${label} is for fresh air and exploring.`,
    indoor:`Get some sleep — ${label} can stay easy, comfortable and weather-proof.`,
    food:`Get some sleep — ${label} is looking good for food and treats.`,
    shopping:`Get some sleep — ${label} can be a relaxed browse-and-shop day.`
  }[mood]||'Get some sleep — there’s another holiday day waiting for you.');
}
function contextualRestLine(now=new Date()){
  const t=tripContext(now),label=isOvernightWindow(now)?'later today':'tomorrow';
  if(t?.departureDay)return 'Get some sleep — checkout and travel will come around quickly, so keep the next stretch easy.';
  if(t?.daysUntilDeparture<=2&&!state.tomorrowMood)return `Get some sleep — there ${t.fullDaysRemaining===1?'is':'are'} only ${t.fullDaysRemaining} full day${t.fullDaysRemaining===1?'':'s'} left after today, so start the next one rested.`;
  return moodFutureLine(state.tomorrowMood,label);
}
function updateTripPulse(){
  const box=$('#tripPulse'),title=$('#tripPulseTitle'),copy=$('#tripPulseCopy');if(!box)return;
  box.classList.remove('hidden');const t=tripContext();
  if(!t){title.textContent='Add your vacation dates';copy.textContent='I’ll use them to pace recommendations, countdown and prep.';renderPrep();return;}
  if(t.before){const days=daysUntilArrival(t),dest=destinationPreset().short;title.textContent=countdownLabel(days,dest);copy.textContent=days<=2?'Final checks now; the fun part is almost here.':days<=7?'One week or less — useful prep now means less admin on holiday.':'Build the must-do list now and leave room for spontaneous days too.';renderPrep();return;}
  if(t.after){title.textContent='Trip complete';copy.textContent='Your visited places are waiting in Trip memories — a nice little record of where the holiday took you.';renderPrep();return;}
  if(t.departureDay){title.textContent='Departure day';copy.textContent='No heroic planning today — short, nearby options that fit around checkout and travel win.';renderPrep();return;}
  title.textContent=`Day ${t.index} of ${t.total} · ${t.daysUntilDeparture} day${t.daysUntilDeparture===1?'':'s'} until departure`;
  const next=nextFixedPlan();
  copy.textContent=next&&next.date===localDateKey()?`Next fixed plan: ${next.title}${next.time?` at ${formatPlanTime(next.time)}`:''}. ${tripStageLine(t)}`:tripStageLine(t);renderPrep();
}
function updateGreeting(){
  const now=new Date(),h=now.getHours(),part=h<5?'Late night':h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Evening';
  const family=state.profile.familyName?.trim();
  const title=$('#todayGreeting'),copy=$('#todayGreetingCopy'),t=tripContext(now);
  if(t?.before){const days=daysUntilArrival(t),dest=destinationPreset().short;if(title)title.textContent=family?`${countdownLabel(days,dest)}, ${family}`:countdownLabel(days,dest);if(copy)copy.textContent=days<=2?'Almost time — keep the prep list short and the excitement high.':days<=7?'The countdown is properly on now.':'Plenty of time to discover, shortlist and shape the trip.';}
  else if(h<5){if(title)title.textContent=family?`Late one, ${family}?`:'Late one?';if(copy)copy.textContent=contextualRestLine(now);}
  else{if(title)title.textContent=family?`${part}, ${family}`:part;if(copy)copy.textContent=t?.inTrip?`Day ${t.index} of ${t.total}. ${tripStageLine(t)}`:'Here’s what looks smartest for your crew right now.';}
  updateTripPulse();refreshDecisionCard();renderQuickMoods();
}
function mapsSearch(q){window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q+' near me')}`,'_blank','noopener');}

function setView(name){
  if(name==='parks'&&!isFloridaContext()){loadDiscover('thrills');return;}
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='explore')renderExplore(); if(name==='saved')renderTripHub(); if(name==='parks'&&!$('#parksList').children.length)loadParks();
  if(name==='essentials')renderEssentials(); if(name==='food')loadFood(); if(name==='stayin')renderStayIn(); if(name==='family')loadProfileForm(); if(name==='tomorrow-planner')renderTomorrowPlannerContext();
}
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.target==='explore'&&!isFloridaContext()){loadDiscover('sights');return;}setView(b.dataset.target);}));
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.back)));
function applyPresetLocation(key,{persist=true}={}){
  const p=presetFor(key);if(!p)return false;state.locationMode=key;state.coords={lat:p.lat,lon:p.lon};state.locationName=p.name;if(persist){localStorage.setItem('ffvp_test_location',key);$('#testLocationSelect').value=key;}$('#locationLabel').textContent=`Testing from ${p.name}`;loadWeather();renderExplore();renderQuickMoods();if($('.view.active')?.dataset.view==='parks'&&!isFloridaContext())loadDiscover('thrills');return true;
}
async function requestLocation(){
  if(state.locationMode!=='gps'&&applyPresetLocation(state.locationMode,{persist:false}))return;
  $('#locationLabel').textContent='Finding your location…';state.locationMode='gps';$('#testLocationSelect').value='gps';localStorage.setItem('ffvp_test_location','gps');
  if(!navigator.geolocation){const d=destinationPreset();state.coords={lat:d.lat,lon:d.lon};state.locationName=d.name;$('#locationLabel').textContent=`Location unavailable — previewing ${d.name}`;loadWeather();renderQuickMoods();return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    state.coords={lat:pos.coords.latitude,lon:pos.coords.longitude};state.locationName='Near you'; $('#locationLabel').textContent='Using your current location'; await loadWeather(); renderExplore();renderQuickMoods();
  },()=>{const d=destinationPreset();state.coords={lat:d.lat,lon:d.lon};state.locationName=d.name;$('#locationLabel').textContent=`Location off — previewing ${d.name}`;loadWeather();renderExplore();renderQuickMoods();},{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
}
$('#refreshLocation').addEventListener('click',requestLocation);
$('#testLocationSelect').addEventListener('change',e=>{const key=e.target.value;if(key==='gps'){state.locationMode='gps';localStorage.setItem('ffvp_test_location','gps');requestLocation();}else applyPresetLocation(key);});
function previewDestination(){const key=state.profile.destinationPreset||'orlando';applyPresetLocation(key);showToast(`Previewing ${destinationPreset().name}`);}
$('#previewDestinationBtn').addEventListener('click',previewDestination);

async function loadWeather(){
  if(!state.coords)return; const {lat,lon}=state.coords;
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,precipitation&hourly=precipitation_probability,weather_code,temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&timezone=auto&forecast_days=2`;
  try{const r=await fetch(u);if(!r.ok)throw new Error();state.weather=await r.json();renderWeather();}catch(e){$('#weatherCard').className='hero-card weather-card'+(tripContext()?.before?' countdown-hidden':'');$('#weatherCard').innerHTML='<b>Weather unavailable right now.</b><p style="color:#d7e7e4;margin-top:8px">The planner still works, but weather-aware scoring is paused.</p>';}
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
  const tc=tripContext(),dest=destinationPreset(),nearDest=state.coords&&miles(haversine(state.coords.lat,state.coords.lon,dest.lat,dest.lon))<50;if(tc?.before&&nearDest&&daysUntilArrival(tc)>2)alert=`Current conditions around ${dest.short} — your actual trip forecast is not available this far ahead yet.`;
  $('#weatherCard').className='hero-card weather-card'+(tripContext()?.before?' countdown-hidden':''); $('#weatherCard').innerHTML=`<div class="weather-top"><div><div class="weather-place">RIGHT NOW</div><div class="weather-temp">${bothTemp(c.temperature_2m)}</div><div class="weather-summary">${summary} · feels ${bothTemp(c.apparent_temperature)}</div></div><div class="weather-icon">${icon}</div></div><div class="weather-grid"><div class="weather-stat"><small>High</small><b>${bothTemp(d.temperature_2m_max[0])}</b></div><div class="weather-stat"><small>Low</small><b>${bothTemp(d.temperature_2m_min[0])}</b></div><div class="weather-stat"><small>Rain risk</small><b>${rainText}</b></div></div><div class="weather-alert">${alert}</div>`;
}

const stayHomeRecommendation = {
  id:'stay-home', name:'Stay in & reset', icon:'🏠', category:'stayin', tags:['indoor'], cost:1, energy:0,
  note:'Keep the evening easy at your villa / hotel — food in, pool only if conditions are safe, games, films or tomorrow planning.',
  internalView:'stayin', transient:true, minVisit:30
};


function tripStatusObj(id){const v=state.tripStatuses[id];return typeof v==='string'?{status:v}:v||{status:''};}
function tripStatus(id){return tripStatusObj(id).status||'';}
function saveTripStatuses(){localStorage.setItem('ffvp_trip_statuses',JSON.stringify(state.tripStatuses));}
function setTripStatus(id,status){
  const prev=tripStatusObj(id), next={...prev,status};
  if(status==='visited'&&!next.visitedAt)next.visitedAt=localDateKey();
  if(status!=='visited'&&status!=='repeat'&&prev.status==='visited')next.visitedAt=prev.visitedAt;
  state.tripStatuses[id]=next;saveTripStatuses();renderExplore();renderTripHub();if(!$('#recommendations').classList.contains('hidden'))runRecommendations();showToast(statusLabel(status)||'Trip status cleared');
}
function setTripRating(id,rating){state.tripStatuses[id]={...tripStatusObj(id),rating:+rating||0};saveTripStatuses();renderTripHub();}
function statusLabel(s){return ({want:'Want to go',must:'Must do',visited:'Been there',repeat:'Happy to repeat',skip:'Don’t suggest again'})[s]||'';}
function activityStatusSelect(a){
  const s=tripStatus(a.id);
  return `<select class="trip-status-select" aria-label="Trip status for ${escapeHtml(a.name)}"><option value="" ${!s?'selected':''}>Trip status…</option><option value="must" ${s==='must'?'selected':''}>⭐ Must do</option><option value="want" ${s==='want'?'selected':''}>♡ Want to go</option><option value="visited" ${s==='visited'?'selected':''}>✓ Been there</option><option value="repeat" ${s==='repeat'?'selected':''}>↻ Happy to repeat</option><option value="skip" ${s==='skip'?'selected':''}>× Don’t suggest</option></select>`;
}
function roughSpendTier(a){const n=memberSummary().length||2,f=currencyInfo().factor;return (a.cost===3?Math.max(120,n*45):a.cost===2?Math.max(60,n*25):Math.max(20,n*12))*f;}
function formatPlanTime(t){if(!t)return 'any time';const [h,m]=t.split(':').map(Number);return new Date(2000,0,1,h,m).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});}
function refreshDecisionCard(){
  const now=new Date(),h=now.getHours(),title=$('#decisionTitle'),copy=$('#decisionCopy'),nowBtn=$('#whatNowBtn'),tomorrow=$('#tomorrowBtn'),t=tripContext(now);if(!title)return;
  if(t?.before){const days=daysUntilArrival(t),dest=destinationPreset().short;title.textContent=days<=1?'Nearly adventure time':countdownLabel(days,dest);copy.textContent=days<=2?'Final checks, travel-day basics and a short must-do list — no need to over-plan the fun out of it.':days<=7?`Use the final countdown to sort the useful bits and choose a few ${dest} experiences you really care about.`:`Discover ${dest}, build your must-do list and let the itinerary take shape gradually.`;nowBtn.textContent='Prep checklist';tomorrow.textContent='Build trip ideas';tomorrow.classList.remove('hidden');return;}
  tomorrow.textContent=h<5?'Plan later today':'Plan tomorrow';
  if(h<5){title.textContent='Time to recharge?';copy.textContent=`${contextualRestLine(now)} If you’re not ready to call it yet, I’ll only suggest genuinely nearby, low-effort options.`;nowBtn.textContent='One last easy option';tomorrow.classList.remove('hidden');}
  else if(h>=22){title.textContent='Wind down or set up tomorrow?';copy.textContent=`${contextualRestLine(now)} I can still find something easy nearby if nobody is ready for bed.`;nowBtn.textContent='Keep tonight easy';tomorrow.classList.remove('hidden');}
  else if(h>=20){title.textContent='One more thing tonight — or save it for tomorrow?';copy.textContent=`I’ll compare what is genuinely worth doing now with the value of starting tomorrow rested. ${tripStageLine(t)}`;nowBtn.textContent='Something tonight';tomorrow.classList.remove('hidden');}
  else if(h>=17){title.textContent='How should we finish the day?';copy.textContent=`Closing times and travel matter more now. ${tripStageLine(t)}`;nowBtn.textContent='Plan this evening';tomorrow.classList.remove('hidden');}
  else if(h>=12){title.textContent='What fits the rest of today?';copy.textContent=`I’ll balance weather, travel, energy and the time left in the day. ${tripStageLine(t)}`;nowBtn.textContent='Find our best options';tomorrow.classList.add('hidden');}
  else{title.textContent='What kind of day shall we make of it?';copy.textContent=`You’ve got the day ahead. I’ll weigh weather, distance, energy and trip priorities. ${tripStageLine(t)}`;nowBtn.textContent='Find our best options';tomorrow.classList.add('hidden');}
}
function weatherForDate(target){
  const w=state.weather;if(!w)return null;const today=localDateKey(),key=localDateKey(target),idx=key===today?0:1;
  return {rain:w.daily?.precipitation_probability_max?.[idx]||0,high:w.daily?.temperature_2m_max?.[idx],low:w.daily?.temperature_2m_min?.[idx],feels:idx===0?w.current?.apparent_temperature:null};
}
function tripUrgencyBoost(a,targetDate){
  const t=tripContext(targetDate),s=tripStatus(a.id);if(!t?.inTrip)return 0;
  if(s==='must')return t.daysUntilDeparture<=3?34:22;
  if(s==='want')return t.daysUntilDeparture<=3?18:10;
  return 0;
}
function planFit(targetDate,travel,visit,mode){
  const plans=plansForDate(targetDate);if(!plans.length)return {adjust:0,reason:''};
  if(mode==='now'){
    const now=new Date(),next=plans.map(p=>({...p,when:new Date(`${p.date}T${p.time||'23:59'}:00`)})).filter(p=>p.when>now).sort((a,b)=>a.when-b.when)[0];
    if(!next||travel==null)return {adjust:0,reason:''};
    const mins=(next.when-now)/60000,commit=travel*2+visit+30;
    if(commit>mins)return {adjust:-42,reason:`doesn’t fit comfortably before ${next.title}`};
    if(commit>mins-60)return {adjust:-16,reason:`tight before ${next.title}`};
    return {adjust:4,reason:`fits before ${next.title}`};
  }
  const timed=plans.filter(p=>p.time);if(!timed.length)return {adjust:-3,reason:'you already have a fixed plan tomorrow'};
  if(visit>=180&&timed.some(p=>{const h=+p.time.slice(0,2);return h>=11&&h<=17;}))return {adjust:-24,reason:`a fixed plan splits tomorrow`};
  return {adjust:-5,reason:'planned around tomorrow’s booking'};
}
function dayPhase(date=new Date()){
  const h=date.getHours();
  if(h<5)return 'late'; if(h<11)return 'morning'; if(h<15)return 'midday'; if(h<18)return 'afternoon'; if(h<21)return 'evening'; return 'late';
}
function isOvernightWindow(date=new Date()){return date.getHours()<5;}
function nextPlanningDate(date=new Date()){const d=new Date(date);if(!isOvernightWindow(d))d.setDate(d.getDate()+1);return d;}
function nextPlanningLabel(date=new Date()){return isOvernightWindow(date)?'later today':'tomorrow';}
function nextPlanningEyebrow(date=new Date()){return isOvernightWindow(date)?'LATER TODAY':'TOMORROW';}

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
  const now=new Date(),phase=dayPhase(now),mins=now.getHours()*60+now.getMinutes(),t=tripContext(now);
  const labels={morning:'START THE DAY WELL',midday:'BEST FOR THE NEXT FEW HOURS',afternoon:'MAKE THE AFTERNOON COUNT',evening:'FINISH THE DAY WELL',late:'KEEP TONIGHT LIGHT'};
  const titles={morning:'Good options for the day ahead',midday:'What fits from here?',afternoon:'Best use of the afternoon',evening:'Worth doing this evening',late:'Easy wins for tonight'};
  const copies={
    morning:`There’s plenty of usable day ahead, so a slightly longer journey can still earn its place. ${tripStageLine(t)}`,
    midday:`We’re balancing travel time with how much useful day you’ll have when you arrive. ${tripStageLine(t)}`,
    afternoon:`Full-day attractions and long journeys lose value from here, so the shortlist gets more selective. ${tripStageLine(t)}`,
    evening:`Nearby food, short entertainment and easy wins take priority over another huge day out. ${tripStageLine(t)}`,
    late:`Only genuinely worthwhile nearby options make the cut now. Rest is a perfectly good recommendation too. ${tripStageLine(t)}`
  };
  if(isOvernightWindow(now))return {now,phase:'late',mins,label:'WIND-DOWN MODE',title:'One last easy option — or bed',copy:`${contextualRestLine(now)} I’ll only surface something now if it is genuinely close and low effort.`};
  return {now,phase,mins,label:labels[phase],title:titles[phase],copy:copies[phase]};
}
function foodEstimate(tier){
  const adults=memberSummary().filter(m=>(+m.age||0)>=13).length || 2, kids=Math.max(0,memberSummary().length-adults);
  const rates={budget:[11,18,7,11],casual:[18,29,10,17],treat:[30,48,15,24]}[tier],cur=currencyInfo();
  const lo=(adults*rates[0]+kids*rates[2])*cur.factor, hi=(adults*rates[1]+kids*rates[3])*cur.factor;
  return `${cur.symbol}${Math.round(lo)}–${cur.symbol}${Math.round(hi)} est. for your group`;
}
function familyFitReason(a){
  if(a.familyStyle==='thrill' && (smallerVisitors().length || lowThrill())) return 'Mixed family fit: younger/smaller or low-thrill visitors may have fewer headline options.';
  if(a.familyStyle==='young' && childMembers().some(m=>(+m.age||0)<=11)) return 'Strong fit for families with younger children.';
  if(a.familyStyle==='broad') return 'Broad family mix, but check individual attraction requirements.';
  return '';
}
const parkActivityMap={'magic-kingdom':'Magic Kingdom','epcot':'EPCOT','hollywood':'Hollywood Studios','animal-kingdom':'Animal Kingdom','universal-studios':'Universal Studios','islands':'Islands of Adventure','epic':'Epic Universe','seaworld':'SeaWorld Orlando'};
function parkDefinitionForActivity(a){const name=parkActivityMap[a.id];return name?parks.find(p=>p.name===name):null;}
async function hydrateRecommendationSchedules(targetDate){await Promise.all(activities.filter(a=>a.category==='park').map(a=>{const p=parkDefinitionForActivity(a);return p?loadParkSchedule(p,targetDate):null;}));}
function scheduleForActivity(a,targetDate){const p=parkDefinitionForActivity(a);return p?state.parkSchedules[`${p.id}:${localDateKey(targetDate)}`]||null:null;}
function recommendationScore(a,options={}){
  let score=60,reasons=[];const d=distMiles(a),p=state.profile;
  const targetDate=options.targetDate||new Date(), mode=options.mode||'now', windowInfo=recommendationWindow(), hour=windowInfo.now.getHours(), phase=windowInfo.phase;
  const travel=estimatedTravelMinutes(a),visit=minimumVisitMinutes(a),status=tripStatus(a.id),wx=weatherForDate(targetDate);
  const schedule=a.category==='park'?scheduleForActivity(a,targetDate):null;
  if(status==='skip'||status==='visited')return {score:-999,reason:status==='visited'?'already visited this trip':'hidden for this trip',travelMinutes:travel};
  if(!isFloridaContext()&&!a.discovered&&a.lat&&d!=null&&d>250)return {score:-999,reason:'outside this destination',travelMinutes:travel};
  if(a.discovered&&d!=null&&d>Math.max(120,(p.maxDrive||30)*2))return {score:-999,reason:'outside this travel area',travelMinutes:travel};
  if(status==='repeat'){score+=12;reasons.push('you marked it worth repeating');}
  score+=tripUrgencyBoost(a,targetDate);if(status==='must')reasons.push('one of your must-dos');else if(status==='want')reasons.push('on your want-to-go list');

  if(d!=null){score+=Math.max(-25,18-(d*.55));if(d>p.maxDrive){score-=30;reasons.push('further than your usual travel range');}else if(d<15)reasons.push('fairly close');}
  if(travel!=null&&mode==='now'){
    if(travel>25)score-=Math.min(20,(travel-25)*.7);
    if(phase==='evening'&&travel>25){score-=10;reasons.push(`about ${travel} min away`);} if(phase==='late'&&travel>15){score-=Math.min(38,(travel-15)*1.25);reasons.push(`~${travel} min each way this late`);}
    const usableEnd=23*60+30,remaining=Math.max(0,usableEnd-windowInfo.mins),commitment=travel*2+visit;
    if(hour>=17&&commitment>remaining){score-=Math.min(38,Math.max(8,(commitment-remaining)/5));reasons.push('not much useful time left after travel');}
  }

  if(a.tags.some(t=>p.interests.includes(t)))score+=10;
  if(a.energy>({low:1,medium:2,high:3}[p.energy])){score-=9;reasons.push('a bigger-energy option');}
  if(p.walkingTolerance==='low'&&(a.category==='park'||a.category==='beach')){score-=13;reasons.push('a bigger walking day');}
  const budgetLevel={low:1,medium:2,high:3}[p.budget];if(a.cost>budgetLevel){score-=13;reasons.push('above your preferred spend');}
  const remaining=Number(p.budgetRemaining);if(Number.isFinite(remaining)&&remaining>0&&roughSpendTier(a)>remaining*.35){score-=18;reasons.push('uses a large share of the remaining budget');}
  if(a.familyStyle==='thrill'&&smallerVisitors().length){score-=12;reasons.push('mixed fit for younger/smaller visitors');} if(a.familyStyle==='thrill'&&lowThrill()){score-=8;reasons.push('not everyone is thrill-focused');} if(a.familyStyle==='young'&&childMembers().some(m=>(+m.age||0)<=11)){score+=12;reasons.push('good younger-child fit');}

  if(wx){const indoor=a.tags.includes('indoor')||a.category==='shopping'||a.category==='stayin',outdoor=['beach','park'].includes(a.category);if(wx.rain>=55&&indoor){score+=18;reasons.push(mode==='tomorrow'?'good fallback for tomorrow’s rain':'good rain fallback');}if(wx.rain>=55&&a.category==='beach'){score-=35;reasons.push('weather works against an outdoor day');}if(wx.feels>=34&&p.heatAware&&indoor){score+=14;reasons.push('keeps you out of the heat');}if(wx.feels>=36&&p.heatAware&&outdoor){score-=12;reasons.push('hard work in the heat');}}

  if(schedule?.open&&schedule?.close&&travel!=null){
    if(mode==='now'){
      const arrival=new Date(Date.now()+travel*60000),usable=(schedule.close-arrival)/60000;
      if(arrival>=schedule.close){score-=85;reasons.push(`would arrive after the park closes`);}
      else if(usable<visit){score-=48;reasons.push(`only ~${Math.max(0,Math.round(usable))} useful minutes before closing`);}
      else if(usable<visit+90){score-=14;reasons.push(`closing at ${timeLabel(schedule.close)} limits the value`);}
      else reasons.push(`open until ${timeLabel(schedule.close)}`);
    } else {
      const operating=(schedule.close-schedule.open)/60000;if(operating>=visit+120)score+=5;reasons.push(`${timeLabel(schedule.open)}–${timeLabel(schedule.close)} ${nextPlanningLabel()}`);
    }
  }

  if(mode==='now'){
    if(a.category==='park'){if(phase==='afternoon'){score-=10;reasons.push('late for a full park day');}if(phase==='evening'){score-=34;reasons.push('limited park time left');}if(phase==='late'){score-=72;reasons.push('too late to justify a park journey');}}
    if(a.category==='beach'){if(hour>=18){score-=48;reasons.push('too late for a worthwhile beach trip');}else if(hour>=16)score-=16;}
    if(a.category==='shopping'){if(phase==='evening'){score+=10;reasons.push('easy evening option');}if(phase==='late'){score-=4;reasons.push('check closing time before leaving');}}
    if(a.category==='food'&&hour>=16){score+=(travel!=null&&travel<=20?20:8);reasons.push(travel!=null&&travel<=20?'nearby food fits the evening':'food still fits the evening');}
    if(a.category==='stayin'){if(phase==='evening')score+=22;if(phase==='late'){score+=52;reasons.push('zero travel at this time of night');}}
  } else {
    if(a.category==='park')score+=10;if(a.category==='stayin')score-=20;
    const t=tripContext(targetDate);if(t?.daysUntilDeparture<=2&&status==='must')score+=10;
  }
  const tc=tripContext(targetDate);if(tc?.departureDay){if(a.category==='park'){score-=75;reasons.push('departure day is poor value for a full park');}else if(a.category==='beach'){score-=60;reasons.push('too much travel for departure day');}else if(visit>=120){score-=25;reasons.push('a long commitment for departure day');}else if(['food','shopping'].includes(a.category)){score+=12;reasons.push('easier to fit around departure day');}}
  const pf=planFit(targetDate,travel,visit,mode);score+=pf.adjust;if(pf.reason)reasons.push(pf.reason);
  const commitment=travel==null?null:travel*2+visit;
  return {score:Math.max(-999,Math.min(99,Math.round(score))),reason:reasons.slice(0,3).join(' · ')||familyFitReason(a)||a.note,travelMinutes:travel,commitmentMinutes:commitment};
}
async function seedLocalDiscovery(){
  if(isFloridaContext()||!state.coords)return;const key=`${state.coords.lat.toFixed(3)},${state.coords.lon.toFixed(3)}:${state.profile.maxDrive||30}`;if(state.localSeedKey===key)return;
  try{const r=await fetch(`/api/discover?category=sights&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(state.profile.maxDrive||30)}`);if(!r.ok)return;const data=await r.json();(data.results||[]).slice(0,8).forEach(x=>rememberDiscovered(discoveredActivity(x,'sights')));state.localSeedKey=key;}catch(e){}
}

function tomorrowTargetDate(){return nextPlanningDate(new Date());}
function tomorrowMoodTitle(mood){return ({chill:'Chill & Recharge',indoor:'Indoor & Easy',food:'Food & Treats',outdoors:'Outdoors & Explore',thrills:'Thrills & Excitement',shopping:'Shop & Browse'}[mood]||'Best overall');}
function tomorrowMoodMatches(a,mood){
  if(!mood)return true;
  // Inclusion is now exclusive: one venue -> one mood.
  return primaryMoodForPlace(a)===mood;
}
function tomorrowMoodAffinity(a,mood){
  if(!mood||primaryMoodForPlace(a)!==mood)return 0;
  if(mood==='chill')return a.category==='stayin'?24:a.category==='beach'?16:10;
  if(mood==='food')return 14;
  return 12;
}

function moodSubtype(a,mood){
  const t=normalizedPlaceType(a.placeType);
  if(mood==='outdoors'){
    if(t.includes('zoo')||t.includes('wildlife'))return 'wildlife';
    if(t.includes('garden'))return 'garden';
    if(t.includes('hiking')||t.includes('trail')||t.includes('cycling'))return 'trail';
    if(t.includes('park')||t.includes('playground')||t.includes('picnic'))return 'park';
    return 'other-outdoors';
  }
  if(mood==='chill'){
    if(a.category==='stayin')return 'stay-in';
    if(a.category==='beach'||t==='beach')return 'beach';
    if(t.includes('spa')||t.includes('wellness')||t==='sauna')return 'spa';
    if(t.includes('scenic'))return 'scenic';
    return 'other-chill';
  }
  if(mood==='indoor'){
    if(t.includes('museum')||t.includes('gallery'))return 'museum';
    if(t.includes('aquarium'))return 'aquarium';
    if(t.includes('movie')||t.includes('theater'))return 'show';
    if(t.includes('bowling')||t.includes('playground'))return 'play';
    return 'other-indoor';
  }
  if(mood==='thrills'){
    if(a.category==='park'||t.includes('amusement_park')||t==='water_park')return 'theme-park';
    if(t.includes('kart'))return 'karting';
    if(t.includes('miniature_golf'))return 'mini-golf';
    if(t.includes('adventure')||t.includes('paintball')||t.includes('off_roading'))return 'adventure';
    return 'other-thrill';
  }
  if(mood==='shopping')return normalizeVenueName(a.name).split(' ').slice(0,2).join(' ')||'shopping';
  return mood;
}
function shapeMoodResults(list,mood){
  // Exact venue de-dupe is already done in allTripPlaces; this pass adds shortlist diversity.
  const maxMiles=state.profile.maxDrive||30;
  const inRange=list.filter(a=>{const d=distMiles(a);return d==null||d<=maxMiles;});
  const primary=inRange.length>=3?inRange:list;
  const rest=inRange.length>=3?list.filter(a=>!inRange.includes(a)):[];
  const caps={
    outdoors:{park:2,wildlife:1,garden:1,trail:1,'other-outdoors':1},
    chill:{'stay-in':1,beach:2,spa:1,scenic:1,'other-chill':1},
    indoor:{museum:2,aquarium:1,show:1,play:1,'other-indoor':1},
    thrills:{'theme-park':3,karting:1,'mini-golf':1,adventure:1,'other-thrill':1}
  };
  const diversify=(items)=>{
    const picked=[],deferred=[],counts={};
    for(const a of items){
      const key=moodSubtype(a,mood),cap=mood==='shopping'?1:(caps[mood]?.[key]??2);
      if((counts[key]||0)<cap){picked.push(a);counts[key]=(counts[key]||0)+1;}else deferred.push(a);
    }
    return [...picked,...deferred];
  };
  return [...diversify(primary),...diversify(rest)];
}
async function seedMoodDiscovery(mood){
  if(!state.coords)return;
  const category=({chill:'chill',indoor:'indoor',outdoors:'outdoors',thrills:'thrills',shopping:'shopping'}[mood]||'sights');
  if(mood==='food')return;
  const key=`${category}:${state.coords.lat.toFixed(3)},${state.coords.lon.toFixed(3)}:${state.profile.maxDrive||30}`;state.moodSeedKeys=state.moodSeedKeys||{};if(state.moodSeedKeys[key])return;
  try{const r=await fetch(`/api/discover?category=${encodeURIComponent(category)}&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(state.profile.maxDrive||30)}`);if(!r.ok)return;const data=await r.json();(data.results||[]).slice(0,10).forEach(x=>rememberDiscovered(discoveredActivity(x,category)));state.moodSeedKeys[key]=true;}catch(e){}
}
function renderTomorrowPlannerContext(){
  const target=tomorrowTargetDate(),t=tripContext(target),wx=weatherForDate(target),plans=plansForDate(target),dest=destinationPreset();
  const bits=[];if(t?.departureDay)bits.push('Departure day');else if(t?.inTrip)bits.push(`Day ${t.index} of ${t.total}`);
  if(wx)bits.push(`${Math.round(wx.high)}°C high`,`${wx.rain}% rain risk`);if(plans.length)bits.push(`${plans.length} fixed plan${plans.length===1?'':'s'}`);
  const planLabel=nextPlanningLabel();
  $('#tomorrowPlannerContext').textContent=`Choose the mood first and I’ll rank experiences for ${dest.short||dest.name} using ${planLabel}’s conditions, travel time and your trip progress.`;
  $('#tomorrowSnapshot').innerHTML=`<div><span>${planLabel==='later today'?'Later today':'Tomorrow'}</span><b>${bits[0]||'A fresh day'}</b></div><div><span>Conditions</span><b>${wx?`${Math.round(wx.high)}°C · ${wx.rain}% rain`:'Forecast loading'}</b></div><div><span>Diary</span><b>${plans.length?`${plans.length} fixed plan${plans.length===1?'':'s'}`:'Wide open'}</b></div>`;
}
function openTomorrowPlanner(){
  if(tripContext()?.before){previewDestination();loadDiscover('sights');return;}
  setView('tomorrow-planner');$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target==='today'));renderTomorrowPlannerContext();
}

function recommendationRunKey(forcedTag,mode,targetDate){
  const region=locationRegion();
  const loc=state.coords?`${state.coords.lat.toFixed(2)},${state.coords.lon.toFixed(2)}`:'no-location';
  const day=targetDate.toISOString().slice(0,10);
  return `${mode}:${forcedTag||'overall'}:${region}:${loc}:${day}`;
}
function rotatingShortlist(list,count,key,rerun=false){
  if(!list.length)return [];
  const best=list[0].score;
  // Keep reruns inside a sensible quality band rather than surfacing weak filler.
  let pool=list.filter((a,i)=>i<18 && a.score>=Math.max(30,best-30));
  if(pool.length<count)pool=list.slice(0,Math.min(18,list.length));
  let run=state.recommendationRuns[key];
  if(!run||!rerun)run={last:[],seen:[],runs:0};

  const lastSet=new Set(run.last||[]),seenSet=new Set(run.seen||[]);
  let candidates=rerun?pool.filter(a=>!lastSet.has(a.id)&&!seenSet.has(a.id)):pool.slice();
  // Once every unseen option has been used, allow earlier suggestions back in —
  // but never repeat the immediately previous set when alternatives exist.
  if(candidates.length<count&&rerun){
    const notLast=pool.filter(a=>!lastSet.has(a.id)&&!candidates.some(x=>x.id===a.id));
    candidates=[...candidates,...notLast];
  }
  if(candidates.length<count){
    candidates=[...candidates,...pool.filter(a=>!candidates.some(x=>x.id===a.id))];
  }

  // Nudge each rerun through a different part of the quality pool while preserving rank.
  if(rerun&&candidates.length>count){
    const shift=(run.runs*count)%candidates.length;
    candidates=[...candidates.slice(shift),...candidates.slice(0,shift)];
  }
  const picked=candidates.slice(0,count);
  run.last=picked.map(a=>a.id);
  run.seen=[...new Set([...(run.seen||[]),...run.last])];
  if(run.seen.length>=pool.length)run.seen=[...run.last];
  run.runs=(run.runs||0)+1;
  state.recommendationRuns[key]=run;
  return picked;
}
async function runRecommendations(forcedTag=null,mode='now',options={}){
  const now=new Date(),targetDate=mode==='tomorrow'?nextPlanningDate(now):new Date(now);
  if(mode==='tomorrow'&&forcedTag)await seedMoodDiscovery(forcedTag);else if(!isFloridaContext())await seedLocalDiscovery();
  const context=recommendationWindow();await hydrateRecommendationSchedules(targetDate);let candidates=allTripPlaces();if(!forcedTag&&mode==='now')candidates.push(stayHomeRecommendation);if(mode==='tomorrow'&&forcedTag==='chill')candidates.push(stayHomeRecommendation);
  let list=candidates.map(a=>({...a,...recommendationScore(a,{targetDate,mode})})).filter(a=>a.score>-500);
  if(forcedTag){
    list=list.filter(a=>mode==='tomorrow'?tomorrowMoodMatches(a,forcedTag):(a.category===forcedTag||a.tags.includes(forcedTag)));
    if(mode==='tomorrow')list=list.map(a=>({...a,score:Math.min(99,a.score+tomorrowMoodAffinity(a,forcedTag))}));
  }
  list.sort((a,b)=>b.score-a.score);
  if(mode==='tomorrow'&&forcedTag)list=shapeMoodResults(list,forcedTag);
  const rerun=!!options.rerun;
  const runKey=recommendationRunKey(forcedTag,mode,targetDate);
  const displayCount=mode==='tomorrow'?5:4;
  const displayList=rotatingShortlist(list,displayCount,runKey,rerun);
  const eyebrow=$('#recommendationsEyebrow'),title=$('#recommendationsTitle'),copy=$('#recommendationsContext');
  if(mode==='tomorrow'){
    const t=tripContext(targetDate),wx=weatherForDate(targetDate),plans=plansForDate(targetDate),weather=wx?`${Math.round(wx.high)}°C high · ${wx.rain}% rain risk`:'weather still loading';
    if($('.view.active')?.dataset.view==='tomorrow-planner'){
      state.tomorrowMood=forcedTag||null;localStorage.setItem('ffvp_tomorrow_mood',state.tomorrowMood||'');const mood=tomorrowMoodTitle(forcedTag);
      const planLabel=nextPlanningLabel(now),planEyebrow=nextPlanningEyebrow(now);
      $('#tomorrowResultsEyebrow').textContent=forcedTag?`${mood.toUpperCase()} · ${planEyebrow}`:`BEST OVERALL · ${planEyebrow}`;
      $('#tomorrowResultsTitle').textContent=t?.departureDay?'Best fit for departure day':(forcedTag?`${mood} for ${planLabel}`:(t?.inTrip?`Best bets for day ${t.index} of ${t.total}`:`Best bets for ${planLabel}`));
      $('#tomorrowResultsContext').textContent=`${weather}${plans.length?` · ${plans.length} fixed plan${plans.length===1?'':'s'} in the diary`:''}. I’ve filtered out places already visited unless you marked them Repeat.`;
      $('#tomorrowResults').classList.remove('hidden');$('#tomorrowRecommendationList').innerHTML=displayList.length?displayList.map((a,i)=>placeCard(a,true,i===0)).join(''):'<div class="error-card"><b>No strong matches for that mood yet.</b><br/>Try another mood or Best overall.</div>';wirePlaceActions($('#tomorrowRecommendationList'));$('#tomorrowResults').scrollIntoView({behavior:'smooth',block:'start'});return;
    }
    const planLabel=nextPlanningLabel(now);eyebrow.textContent=isOvernightWindow(now)?'PLAN LATER TODAY':'PLAN TOMORROW';title.textContent=t?.departureDay?'Departure-day options':(t?.inTrip?`Best bets for day ${t.index} of ${t.total}`:`Best bets for ${planLabel}`);copy.textContent=`${weather}${plans.length?` · ${plans.length} fixed plan${plans.length===1?'':'s'} already in the diary`:''}. Already-visited places are excluded unless marked Repeat.`;
  }else{eyebrow.textContent=context.label;title.textContent=context.title;copy.textContent=context.copy+' I’m also checking trip progress, fixed plans and places you’ve already done. Drive times are planning estimates, not live traffic.';}
  $('#recommendations').classList.remove('hidden');$('#recommendationList').innerHTML=displayList.map((a,i)=>placeCard(a,true,i===0)).join('');wirePlaceActions($('#recommendationList'));$('#recommendations').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#whatNowBtn').addEventListener('click',()=>{if(tripContext()?.before){$('#prepSection').scrollIntoView({behavior:'smooth',block:'start'});return;}runRecommendations(null,'now');});
$('#tomorrowBtn').addEventListener('click',openTomorrowPlanner);$('#rerunBtn').addEventListener('click',()=>runRecommendations(null,'now',{rerun:true}));
$$('.tomorrow-mood').forEach(b=>b.addEventListener('click',()=>runRecommendations(b.dataset.tomorrowMood,'tomorrow')));
$('#tomorrowBestOverall').addEventListener('click',()=>runRecommendations(null,'tomorrow'));
$('#tomorrowRerunBtn').addEventListener('click',()=>runRecommendations(state.tomorrowMood||null,'tomorrow',{rerun:true}));
$('#openTripBtn').addEventListener('click',()=>setView('saved'));$('#quickEssentialsLink').addEventListener('click',()=>setView('essentials'));
$$('.quick-card').forEach(b=>b.addEventListener('click',()=>{
  const q=b.dataset.quick,t=tripContext();
  if(t?.before){
    const d=destinationPreset();state.coords={lat:d.lat,lon:d.lon};state.locationName=d.name;
    if(q==='food'){setView('food');return;}
    if(['chill','thrills','indoor','outdoors','shopping','sights'].includes(q)){loadDiscover(q);return;}
  }
  if(q==='food'||q==='stayin'){setView(q);return;}
  if(['chill','thrills','indoor','outdoors','shopping','sights'].includes(q)){loadDiscover(q);return;}
  runRecommendations(q);
}));


const discoveryMeta={
  chill:{eyebrow:'CHILL & RECHARGE',title:'Slow the pace down',copy:'Beaches, spas, wellness and scenic low-effort options — deliberately separate from active outdoor exploring.',icon:'🌊',category:'activity',tags:['relax']},
  thrills:{eyebrow:'THRILLS & EXCITEMENT',title:'Turn the energy up',copy:'Theme parks are only one version of a thrill day — I’ll also look for karting, adventure, high-energy attractions and big views.',icon:'⚡',category:'activity',tags:['rides']},
  indoor:{eyebrow:'INDOOR & EASY',title:'Good ideas under cover',copy:'Museums, aquariums, entertainment and other weather-proof family options around you.',icon:'☂',category:'indoor',tags:['indoor']},
  outdoors:{eyebrow:'OUTDOORS & EXPLORE',title:'Get outside',copy:'Parks, gardens, trails, viewpoints and open-air family options that make sense from here.',icon:'🌿',category:'outdoors',tags:['nature']},
  shopping:{eyebrow:'SHOP & BROWSE',title:'Shopping nearby',copy:'Malls, markets and browse-worthy retail without assuming every destination has Florida-style outlets.',icon:'🛍',category:'shopping',tags:['shopping','indoor']},
  sights:{eyebrow:'EXPLORE LOCALLY',title:'What is worth seeing nearby?',copy:'A broad local mix of landmarks, museums, views, parks and family attractions.',icon:'📍',category:'activity',tags:['nature','indoor']}
};
function discoveredActivity(x,category){
  const m=discoveryMeta[category]||discoveryMeta.sights,level=x.priceLevel==null?2:Math.max(1,Math.min(3,x.priceLevel||1));
  const raw={id:x.id,name:x.name,icon:m.icon,category:m.category,tags:m.tags,cost:level,energy:category==='thrills'?2:1,lat:+x.lat,lon:+x.lon,destination:x.name,note:[x.type,x.rating?`★ ${x.rating.toFixed(1)}`:'',x.address].filter(Boolean).join(' · ')||'Discovered near your selected location.',discovered:true,provider:x.source||'',mapsUrl:x.mapsUrl||'',sourceCategory:category,placeType:x.typeKey||x.type||'',placeTypes:Array.isArray(x.types)?x.types:[]};
  return inferDiscoveredSemantics(raw);
}
function rememberDiscovered(a){state.discovered[a.id]=a;localStorage.setItem('ffvp_discovered',JSON.stringify(state.discovered));}
function discoveryCard(x,category){
  const a=discoveredActivity(x,category);rememberDiscovered(a);const d=Number(x.distance),distance=Number.isFinite(d)?`${d<10?d.toFixed(1):Math.round(d)} mi`:'';
  const rating=x.rating?`★ ${Number(x.rating).toFixed(1)}${x.ratingCount?` · ${Number(x.ratingCount).toLocaleString()} reviews`:''}`:'Rating unavailable';
  const open=x.openNow===true?'<span class="trip-state-chip state-repeat">Open now</span>':x.openNow===false?'<span class="trip-state-chip state-skip">Closed now</span>':'';
  const s=tripStatus(a.id),saved=state.saved.includes(a.id),type=escapeHtml(x.type||'Local attraction'),address=x.address?escapeHtml(x.address):'';
  return `<article class="place-card discover-card" data-id="${escapeHtml(a.id)}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${escapeHtml(a.name)}</div>${distance?`<span class="score-pill">${distance}</span>`:''}</div><div class="place-meta">${type}${address?` · ${address}`:''}</div></div></div><div class="discover-rating-row"><b>${rating}</b>${open}</div><div class="trip-card-tools">${activityStatusSelect(a)}${s?`<span class="trip-state-chip state-${s}">${statusLabel(s)}</span>`:''}</div><div class="place-actions"><button class="small-btn discover-save">${saved?'♥ Saved':'♡ Save'}</button><a class="small-btn primary-small direction-link" href="${x.mapsUrl||directionsUrl(a)}" target="_blank" rel="noopener">Directions →</a></div></article>`;
}
function wireDiscover(root){
  $$('.discover-save',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id;toggleSave(id);renderTripHub();b.textContent=state.saved.includes(id)?'♥ Saved':'♡ Save';}));
  $$('.trip-status-select',root).forEach(sel=>sel.addEventListener('change',()=>{const id=sel.closest('.place-card').dataset.id;setTripStatus(id,sel.value);loadDiscover(state.discoveryCategory);}));
}
async function loadDiscover(category='sights'){
  state.discoveryCategory=category;const meta=discoveryMeta[category]||discoveryMeta.sights;
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view==='discover'));$$('.nav-item').forEach(n=>n.classList.toggle('active',(category==='thrills'&&n.dataset.target==='parks')||(category!=='thrills'&&n.dataset.target==='explore')));window.scrollTo({top:0,behavior:'smooth'});
  $('#discoverEyebrow').textContent=meta.eyebrow;$('#discoverTitle').textContent=meta.title;$('#discoverCopy').textContent=`${meta.copy} Search centre: ${state.locationName||destinationLabel()}.`;
  if(!state.coords){$('#discoverStatus').innerHTML='<span>📍</span><div><b>Location needed</b><small>Choose a test location or enable device location.</small></div>';$('#discoverResults').innerHTML='';return;}
  $('#discoverStatus').innerHTML='<span class="mini-spinner"></span><div><b>Finding local options…</b><small>Checking places inside your travel range.</small></div>';$('#discoverResults').innerHTML='';
  try{const r=await fetch(`/api/discover?category=${encodeURIComponent(category)}&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(state.profile.maxDrive||30)}`);if(!r.ok)throw new Error();const data=await r.json();let results=Array.isArray(data.results)?data.results:[];results=results.filter(x=>!['skip','visited'].includes(tripStatus(x.id)));if(!results.length)throw new Error();
    $('#discoverStatus').innerHTML=`<span>📍</span><div><b>${results.length} ideas around ${escapeHtml(state.locationName||'your location')}</b><small>${escapeHtml(data.source||'Places')} · within roughly ${state.profile.maxDrive||30} miles.</small></div>`;$('#discoverResults').innerHTML=results.map(x=>discoveryCard(x,category)).join('');wireDiscover($('#discoverResults'));
  }catch(e){$('#discoverStatus').innerHTML='<span>🧭</span><div><b>Local discovery is taking a break</b><small>Try again in a moment. Your saved trip plan still works.</small></div>';$('#discoverResults').innerHTML=`<article class="place-card"><div class="reason">I couldn’t get a reliable local shortlist just now.</div><div class="place-actions"><button id="retryDiscover" class="small-btn primary-small">Try again</button></div></article>`;$('#retryDiscover').addEventListener('click',()=>loadDiscover(category));}
}

function placeCard(a,withScore=false,hero=false){
  const d=distMiles(a),saved=!a.transient&&state.saved.includes(a.id),budget=a.foodTier?foodEstimate(a.foodTier):money(a.cost),travel=a.travelMinutes??estimatedTravelMinutes(a);
  const distanceMeta=d!=null?`${d<10?d.toFixed(1):Math.round(d)} mi · ~${travel} min drive`:(a.category==='stayin'?'No travel':null),commit=a.commitmentMinutes?`~${Math.round(a.commitmentMinutes/15)*15} min total commitment`:null;
  const meta=[distanceMeta,budget,a.category.replace(/^./,x=>x.toUpperCase())].filter(Boolean).join(' · '),fit=familyFitReason(a),s=tripStatus(a.id);
  const saveAction=a.transient?'':`<button class="small-btn save-btn">${saved?'♥ Saved':'♡ Save'}</button>`;
  const primaryAction=a.internalView?`<button class="small-btn primary-small internal-view-btn" data-view="${a.internalView}">See ideas</button>`:`<button class="small-btn primary-small directions-btn">${a.search?'Find nearby':'Directions'}</button>`;
  const tripTools=a.transient?'':`<div class="trip-card-tools">${activityStatusSelect(a)}${s?`<span class="trip-state-chip state-${s}">${statusLabel(s)}</span>`:''}</div>`;
  return `<article class="place-card" data-id="${a.id}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${hero?'⭐ ':''}${a.name}</div>${withScore?`<span class="score-pill">${a.score}% fit</span>`:''}</div><div class="place-meta">${meta}</div></div></div><div class="reason">${withScore?`<b>Why:</b> ${a.reason||a.note}`:a.note}${commit&&withScore?`<br><span class="family-fit">${commit} including return travel + useful visit time.</span>`:''}${fit&&!withScore?`<br><span class="family-fit">${fit}</span>`:''}</div>${tripTools}<div class="place-actions">${saveAction}${primaryAction}</div></article>`;
}
function wirePlaceActions(root){
  $$('.save-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id;toggleSave(id);renderExplore();renderTripHub();if(!$('#recommendations').classList.contains('hidden'))runRecommendations();}));
  $$('.directions-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id,a=allTripPlaces().find(x=>x.id===id);if(!a)return;if(a.mapsUrl){window.open(a.mapsUrl,'_blank','noopener');return;}const q=a.search?`${a.search} near me`:a.destination;window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,'_blank','noopener');}));
  $$('.internal-view-btn',root).forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $$('.trip-status-select',root).forEach(s=>s.addEventListener('change',()=>setTripStatus(s.closest('.place-card').dataset.id,s.value)));
}
function toggleSave(id){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];localStorage.setItem('ffvp_saved',JSON.stringify(state.saved));showToast(state.saved.includes(id)?'Saved to your trip':'Removed from saved');}
function renderExplore(){if(!isFloridaContext()&&$('.view.active')?.dataset.view==='explore'){loadDiscover('sights');return;}let list=activities.map(a=>({...a,...recommendationScore(a)}));if(state.filter!=='all'){if(state.filter==='lowcost')list=list.filter(a=>a.cost===1);else list=list.filter(a=>a.category===state.filter||a.tags.includes(state.filter));}list.sort((a,b)=>(distMiles(a)??999)-(distMiles(b)??999));$('#exploreList').innerHTML=list.map(a=>placeCard(a,false)).join('');wirePlaceActions($('#exploreList'));}
$$('#exploreFilters .chip').forEach(c=>c.addEventListener('click',()=>{state.filter=c.dataset.filter;$$('#exploreFilters .chip').forEach(x=>x.classList.toggle('active',x===c));renderExplore();}));
function renderSaved(){renderTripHub();}
function renderTripHub(){
  const summary=$('#tripSummary');if(!summary)return;const t=tripContext(),remaining=Number(state.profile.budgetRemaining);
  if(t?.inTrip)summary.innerHTML=`<div class="trip-summary-main"><div><span class="trip-day-big">Day ${t.index}</span><small>of ${t.total}</small></div><div><b>${t.daysUntilDeparture} day${t.daysUntilDeparture===1?'':'s'} to departure</b><small>${t.fullDaysRemaining} full days after today</small></div>${remaining>0?`<div><b>${tripCurrencyInfo().symbol}${Math.round(remaining)}</b><small>budget remaining</small></div>`:''}</div>`;else if(t?.departureDay)summary.innerHTML=`<div class="trip-summary-main"><div><span class="trip-day-big">Departure</span><small>day</small></div><div><b>Keep it flexible</b><small>Short, nearby options rank higher today</small></div>${remaining>0?`<div><b>${tripCurrencyInfo().symbol}${Math.round(remaining)}</b><small>budget remaining</small></div>`:''}</div>`;
  else summary.innerHTML=`<div class="trip-empty"><b>${t?.before?'Trip countdown ready':'Add your vacation dates'}</b><small>${t?.before?`${daysUntilArrival(t)} days until ${destinationPreset().name}.`:'Set arrival and departure in Family so recommendations understand the length of your stay.'}</small></div>`;
  renderPlans();
  const ids=new Set([...state.saved,...Object.keys(state.tripStatuses).filter(id=>tripStatus(id))]);const tripPlaces=allTripPlaces();const list=tripPlaces.filter(a=>ids.has(a.id)).map(a=>({...a,...recommendationScore(a)}));
  $('#savedList').innerHTML=list.length?list.map(a=>placeCard(a,false)).join(''):'<div class="error-card"><b>No trip places yet.</b><br/>Save a place or give it a trip status while exploring.</div>';wirePlaceActions($('#savedList'));
  const visited=tripPlaces.filter(a=>['visited','repeat'].includes(tripStatus(a.id))).sort((a,b)=>(tripStatusObj(b.id).visitedAt||'').localeCompare(tripStatusObj(a.id).visitedAt||''));
  $('#memoriesList').innerHTML=visited.length?visited.map(a=>{const o=tripStatusObj(a.id);return `<article class="memory-row" data-id="${a.id}"><div><b>${a.name}</b><small>${o.visitedAt?new Date(`${o.visitedAt}T12:00:00`).toLocaleDateString([], {month:'short',day:'numeric'}):'This trip'} · ${tripStatus(a.id)==='repeat'?'Happy to repeat':'Done'}</small></div><label>Family rating<select class="memory-rating"><option value="0">—</option>${[5,4,3,2,1].map(n=>`<option value="${n}" ${o.rating===n?'selected':''}>${'★'.repeat(n)}</option>`).join('')}</select></label></article>`;}).join(''):'<div class="trip-empty"><b>No memories logged yet.</b><small>Mark a place “Been there” and it will appear here.</small></div>';
  $$('.memory-rating',$('#memoriesList')).forEach(s=>s.addEventListener('change',()=>setTripRating(s.closest('.memory-row').dataset.id,s.value)));
}
function savePlans(){localStorage.setItem('ffvp_plans',JSON.stringify(state.plans));updateTripPulse();}
function renderPlans(){const root=$('#plansList');if(!root)return;const nowKey=localDateKey();const list=[...state.plans].sort((a,b)=>(a.date+(a.time||'23:59')).localeCompare(b.date+(b.time||'23:59')));root.innerHTML=list.length?list.map(p=>`<article class="plan-row ${p.date<nowKey?'past':''}" data-id="${p.id}"><div><b>${escapeHtml(p.title)}</b><small>${new Date(`${p.date}T12:00:00`).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}${p.time?` · ${formatPlanTime(p.time)}`:''}${p.location?` · ${escapeHtml(p.location)}`:''}</small></div><button class="icon-btn remove-plan" aria-label="Remove plan">×</button></article>`).join(''):'<div class="trip-empty"><b>No fixed plans yet.</b><small>Add reservations, flights, shows or anything the decision engine needs to work around.</small></div>';$$('.remove-plan',root).forEach(b=>b.addEventListener('click',()=>{state.plans=state.plans.filter(p=>p.id!==b.closest('.plan-row').dataset.id);savePlans();renderTripHub();}));}
$('#planForm').addEventListener('submit',e=>{e.preventDefault();const title=$('#planTitle').value.trim(),date=$('#planDate').value;if(!title||!date)return;state.plans.push({id:crypto.randomUUID?.()||String(Date.now()),title,date,time:$('#planTime').value,location:$('#planLocation').value.trim()});savePlans();e.target.reset();renderTripHub();showToast('Fixed plan added');});


function renderEssentials(){
  $('#essentialsList').innerHTML=essentials.map(e=>`<button type="button" class="essential-card" data-essential="${e.id}"><span>${e.icon}</span><div><b>${e.name}</b><small>${e.sub}</small><em>${localCostGuide(e.cost)} · ${e.costNote}</em></div><i class="essential-chevron" aria-hidden="true">›</i></button>`).join('');
  $$('.essential-card',$('#essentialsList')).forEach(b=>b.addEventListener('click',()=>openEssential(b.dataset.essential)));
}
function openEssential(id){
  const e=essentials.find(x=>x.id===id);if(!e)return;
  $('#essentialDetailIcon').textContent=e.icon;
  $('#essentialDetailTitle').textContent=e.name;
  $('#essentialDetailCopy').textContent=`${e.sub} · ${localCostGuide(e.cost)} cost guide`;
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
  return `<article class="place-card essential-result"><div class="place-top"><div class="place-icon">${e.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${escapeHtml(x.name)}</div><span class="score-pill">${d} mi</span></div><div class="place-meta">${localCostGuide(e.cost)} typical cost guide${address}</div></div></div><div class="reason">${e.costNote}. Price guide is approximate rather than live.</div><div class="place-actions"><a class="small-btn primary-small direction-link" href="${directionsUrl(x)}" target="_blank" rel="noopener">Directions →</a></div></article>`;
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
function foodPriceText(level){const sym=currencyInfo().symbol;if(level===1)return sym;if(level===2)return sym.repeat(2);if(level===3)return sym.repeat(3);if(level>=4)return sym.repeat(4);return `${sym}–${sym}${sym}`;}

function familyMealEstimate(level){
  const {adults,children}=familyCounts();
  const bands={1:[10,18,7,12],2:[18,35,10,20],3:[35,60,18,30],4:[60,100,25,45]};
  const b=bands[level]||[16,32,9,18],cur=currencyInfo();
  const low=Math.round((adults*b[0]+children*b[2])*cur.factor),high=Math.round((adults*b[1]+children*b[3])*cur.factor);
  return `Family est. ${cur.symbol}${low}–${cur.symbol}${high}`;
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

async function loadParkSchedule(p,targetDate=new Date()){
  try{
    const key=localDateKey(targetDate),cacheKey=`${p.id}:${key}`;if(state.parkSchedules[cacheKey])return state.parkSchedules[cacheKey];
    const r=await fetch(`https://api.themeparks.wiki/v1/entity/${p.id}/schedule`);if(!r.ok)return null;
    const data=await r.json(),entries=Array.isArray(data)?data:(data.schedule||[]);
    const operating=entries.find(e=>String(e.date||'').slice(0,10)===key&&String(e.type||'OPERATING').toUpperCase()==='OPERATING')||entries.find(e=>String(e.date||'').slice(0,10)===key);
    if(!operating)return null;
    const openRaw=operating.openingTime||operating.opening_time||operating.startTime||operating.start,closeRaw=operating.closingTime||operating.closing_time||operating.endTime||operating.end;
    const open=openRaw?new Date(openRaw):null,close=closeRaw?new Date(closeRaw):null,now=new Date();let status='UPCOMING';
    if(key===localDateKey(now)&&open&&close){if(now<open)status='NOT_OPEN_YET';else if(now>=close)status='CLOSED';else if((close-now)/60000<=60)status='CLOSING_SOON';else status='OPEN';}
    const result={open,close,status};state.parkSchedules[cacheKey]=result;return result;
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

function newMember(seed={}){
  const role=seed.role||((seed.age!=='' && seed.age!=null && +seed.age<18)?'child':'adult');
  const defaultAge=role==='child'?10:35, defaultHeight=role==='child'?54:68;
  return{id:crypto.randomUUID?.()||String(Date.now()+Math.random()),name:seed.name??'',age:seed.age??defaultAge,height:seed.height??defaultHeight,heightUnit:seed.heightUnit||defaultHeightUnit(),role,thrill:seed.thrill||'medium'};
}
function memberRow(m,scope='profile',index=0){
  const role=m.role||memberRole(m), unit=m.heightUnit||defaultHeightUnit(), inches=+m.height||0, cm=inches?Math.round(inches*2.54):'', feet=inches?Math.floor(inches/12):'', rem=inches?Math.round(inches-(Math.floor(inches/12)*12)):'';
  const initial=memberInitial(m.name,role,index), roleLabel=role==='child'?'Child':'Adult', remove=scope==='setup'?'':`<button class="member-remove" type="button" aria-label="Remove ${roleLabel.toLowerCase()}">×</button>`;
  return `<div class="member-row crew-card" data-id="${m.id}" data-role="${role}" data-role-index="${index}"><div class="crew-avatar crew-avatar-initial ${role}" aria-hidden="true">${escapeHtml(initial)}</div><div class="crew-fields"><div class="crew-role-line"><span>${roleLabel} ${index+1}</span></div><div class="member-row-top"><input class="member-name" type="text" maxlength="25" placeholder="Name / nickname" value="${escapeHtml(m.name)}"/>${remove}</div><div class="member-fields"><label>Age<input class="member-age" type="number" min="0" max="99" inputmode="numeric" value="${m.age}"></label><div class="height-field"><span class="member-field-label">Height</span><div class="height-control"><select class="member-height-unit" aria-label="Height unit"><option value="metric" ${unit==='metric'?'selected':''}>cm</option><option value="imperial" ${unit==='imperial'?'selected':''}>ft / in</option></select><div class="height-entry height-metric ${unit==='metric'?'':'hidden'}"><input class="member-height-cm" type="number" min="50" max="230" inputmode="decimal" aria-label="Height in centimetres" value="${cm}" placeholder="137"></div><div class="height-entry height-imperial ${unit==='imperial'?'':'hidden'}"><input class="member-height-ft" type="number" min="1" max="7" inputmode="numeric" aria-label="Height feet" value="${feet}" placeholder="4"><span>′</span><input class="member-height-in" type="number" min="0" max="11" inputmode="numeric" aria-label="Height inches" value="${rem}" placeholder="6"><span>″</span></div></div></div><label>Ride vibe<select class="member-thrill"><option value="low" ${m.thrill==='low'?'selected':''}>Gentle please</option><option value="medium" ${m.thrill==='medium'?'selected':''}>Some thrills</option><option value="high" ${m.thrill==='high'?'selected':''}>Bring it on</option></select></label></div></div></div>`;
}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function wireMemberRow(row){
  $('.member-remove',row)?.addEventListener('click',()=>{const root=row.parentElement;if(root.children.length<=1){showToast('Keep at least one family member');return;}row.remove();});
  const avatar=$('.crew-avatar-initial',row), name=$('.member-name',row);
  const refreshInitial=()=>{if(avatar)avatar.textContent=memberInitial(name?.value,row.dataset.role||'adult',+row.dataset.roleIndex||0);};
  name?.addEventListener('input',refreshInitial);
  const unit=$('.member-height-unit',row);const syncHeightUnit=()=>{const metric=unit.value==='metric';$('.height-metric',row).classList.toggle('hidden',!metric);$('.height-imperial',row).classList.toggle('hidden',metric);};
  unit?.addEventListener('change',syncHeightUnit);syncHeightUnit();
}
function renderMemberEditor(rootId,members,scope='profile'){const root=$(rootId);const roleCounts={adult:0,child:0};root.innerHTML=members.map(m=>{const role=m.role||memberRole(m),i=roleCounts[role]++;return memberRow({...m,role},scope,i);}).join('');$$('.member-row',root).forEach(wireMemberRow);}
function collectMembers(rootId){return $$('.member-row',$(rootId)).map(r=>{const unit=$('.member-height-unit',r)?.value||defaultHeightUnit();let height=0;if(unit==='metric'){height=(+$('.member-height-cm',r)?.value||0)/2.54;}else{height=(+$('.member-height-ft',r)?.value||0)*12+(+$('.member-height-in',r)?.value||0);}return{id:r.dataset.id,name:$('.member-name',r).value.trim()||'Family member',age:+$('.member-age',r).value||0,height:Math.round(height*10)/10,heightUnit:unit,role:r.dataset.role||'adult',thrill:$('.member-thrill',r).value};});}
function addMemberTo(rootId){const root=$(rootId);const m=newMember({role:'adult'});root.insertAdjacentHTML('beforeend',memberRow(m,'profile',$$('.member-row[data-role="adult"]',root).length));wireMemberRow(root.lastElementChild);}
$('#addMember').addEventListener('click',()=>addMemberTo('#familyMembers'));

function loadProfileForm(){const p=state.profile;$('#familyName').value=p.familyName||'';$('#destinationPreset').value=p.destinationPreset||'orlando';$('#homeBase').value=p.homeBase||'';$('#arrivalDate').value=p.arrivalDate||'';$('#departureDate').value=p.departureDate||'';$('#budgetRemaining').value=p.budgetRemaining||'';$('#walkingTolerance').value=p.walkingTolerance||'medium';$('#maxDrive').value=p.maxDrive;$('#budget').value=p.budget;$('#energy').value=p.energy;$('#heatAware').checked=p.heatAware;$('#familyNotes').value=p.notes||'';renderMemberEditor('#familyMembers',p.members);$$('input[name=interests]').forEach(i=>i.checked=p.interests.includes(i.value));updateUnits();}
$('#familyForm').addEventListener('submit',e=>{e.preventDefault();state.profile={...state.profile,familyName:$('#familyName').value.trim(),destinationPreset:$('#destinationPreset').value,homeBase:$('#homeBase').value.trim(),arrivalDate:$('#arrivalDate').value,departureDate:$('#departureDate').value,budgetRemaining:$('#budgetRemaining').value,walkingTolerance:$('#walkingTolerance').value,members:collectMembers('#familyMembers'),maxDrive:+$('#maxDrive').value,budget:$('#budget').value,energy:$('#energy').value,interests:$$('input[name=interests]:checked').map(x=>x.value),heatAware:$('#heatAware').checked,notes:$('#familyNotes').value.trim()};saveProfile();$('#saveProfileMsg').classList.remove('hidden');setTimeout(()=>$('#saveProfileMsg').classList.add('hidden'),1600);renderExplore();renderTripHub();});
function saveProfile(){localStorage.setItem('ffvp_profile',JSON.stringify(state.profile));updateGreeting();renderTripHub();renderQuickMoods();}
function updateUnits(){$('#unitC').classList.toggle('active',state.unit==='c');$('#unitF').classList.toggle('active',state.unit==='f');if(state.weather)renderWeather();}
$$('.segmented button').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;localStorage.setItem('ffvp_unit',state.unit);updateUnits();}));

let setupStep=0;
let setupQuickNotes=new Set();
let setupCrewDraft={adult:[],child:[]};
let setupCrewCounts={adult:1,child:1};
function renderSetupQuickNotes(){$$('.note-chip').forEach(b=>b.classList.toggle('active',setupQuickNotes.has(b.dataset.note)));}
function normalizeCrewDraft(members=[]){
  setupCrewDraft={adult:[],child:[]};
  members.forEach(m=>{const role=m.role||memberRole(m);setupCrewDraft[role].push({...m,role});});
  if(!setupCrewDraft.adult.length)setupCrewDraft.adult.push(newMember({role:'adult',name:'Adult 1'}));
  setupCrewCounts={adult:Math.max(1,setupCrewDraft.adult.length),child:setupCrewDraft.child.length};
}
function captureSetupCrew(){
  if(!$('#setupMembers')?.children.length)return;
  const current=collectMembers('#setupMembers'), next={adult:[],child:[]};
  current.forEach(m=>next[m.role||memberRole(m)].push(m));
  ['adult','child'].forEach(role=>{next[role].forEach((m,i)=>setupCrewDraft[role][i]=m);});
}
function ensureCrewDraft(role,count){
  while(setupCrewDraft[role].length<count){const i=setupCrewDraft[role].length;setupCrewDraft[role].push(newMember({role,name:`${role==='adult'?'Adult':'Child'} ${i+1}`}));}
}
function renderSetupCrew(){
  ensureCrewDraft('adult',setupCrewCounts.adult);ensureCrewDraft('child',setupCrewCounts.child);
  const members=[...setupCrewDraft.adult.slice(0,setupCrewCounts.adult),...setupCrewDraft.child.slice(0,setupCrewCounts.child)];
  renderMemberEditor('#setupMembers',members,'setup');
  if($('#setupAdultCount'))$('#setupAdultCount').textContent=setupCrewCounts.adult;
  if($('#setupChildCount'))$('#setupChildCount').textContent=setupCrewCounts.child;
  const total=setupCrewCounts.adult+setupCrewCounts.child, summary=$('#setupCrewSummary');if(summary)summary.textContent=`${total} profile${total===1?'':'s'} ready`;
  $$('.count-stepper').forEach(stepper=>{const role=stepper.dataset.countRole;$('.count-btn[data-count-change="-1"]',stepper).disabled=role==='adult'?setupCrewCounts.adult<=1:setupCrewCounts.child<=0;});
}
function changeSetupCrewCount(role,delta){
  captureSetupCrew();const min=role==='adult'?1:0,max=10;setupCrewCounts[role]=Math.max(min,Math.min(max,setupCrewCounts[role]+delta));renderSetupCrew();
}
function showSetupStep(n){
  setupStep=Math.max(0,Math.min(2,n));
  const onboarding=$('#onboarding');onboarding.dataset.setupStep=String(setupStep);
  $$('.setup-step').forEach((x,i)=>x.classList.toggle('active',i===setupStep));
  $$('.setup-progress span').forEach((x,i)=>{x.classList.toggle('completed',i<setupStep);x.classList.toggle('active',i===setupStep);});
  const progress=$('#setupProgressText');if(progress)progress.textContent=`STEP ${setupStep+1} OF 3`;
  $('.skip-setup').classList.toggle('hidden',setupStep>0);
  onboarding.scrollTop=0;
}
function showOnboarding(){
  const p=state.profile;$('#setupFamilyName').value=p.familyName||'';$('#setupDestinationPreset').value=p.destinationPreset||'orlando';$('#setupHomeBase').value=p.homeBase||'';$('#setupArrivalDate').value=p.arrivalDate||'';$('#setupDepartureDate').value=p.departureDate||'';$('#setupMaxDrive').value=p.maxDrive||30;$('#setupBudget').value=p.budget||'medium';$('#setupNotes').value=p.notes||'';setupQuickNotes=new Set(p.quickNotes||[]);renderSetupQuickNotes();normalizeCrewDraft(p.members?.length?p.members:defaultMembers());renderSetupCrew();showSetupStep(0);$('#onboarding').classList.remove('hidden');
}
$$('.count-stepper .count-btn').forEach(b=>b.addEventListener('click',()=>{const stepper=b.closest('.count-stepper');changeSetupCrewCount(stepper.dataset.countRole,+b.dataset.countChange||0);}));
$$('.note-chip').forEach(b=>b.addEventListener('click',()=>{const note=b.dataset.note;if(setupQuickNotes.has(note))setupQuickNotes.delete(note);else setupQuickNotes.add(note);renderSetupQuickNotes();}));
$$('.setup-next').forEach(b=>b.addEventListener('click',()=>showSetupStep(setupStep+1)));$$('.setup-back').forEach(b=>b.addEventListener('click',()=>showSetupStep(setupStep-1)));
$('#onboardingForm').addEventListener('submit',e=>{e.preventDefault();captureSetupCrew();state.profile={...state.profile,familyName:$('#setupFamilyName').value.trim(),destinationPreset:$('#setupDestinationPreset').value,homeBase:$('#setupHomeBase').value.trim(),arrivalDate:$('#setupArrivalDate').value,departureDate:$('#setupDepartureDate').value,maxDrive:+$('#setupMaxDrive').value,budget:$('#setupBudget').value,notes:$('#setupNotes').value.trim(),quickNotes:[...setupQuickNotes],members:collectMembers('#setupMembers')};saveProfile();localStorage.setItem('ffvp_onboarded','1');$('#onboarding').classList.add('hidden');loadProfileForm();renderExplore();showToast('Adventure crew saved ✨');});
$('#skipSetup').addEventListener('click',()=>{localStorage.setItem('ffvp_onboarded','1');$('#onboarding').classList.add('hidden');});

function showLanding(){
  const landing=$('#landingScreen');if(!landing)return;
  const hasSaved=!!localStorage.getItem('ffvp_onboarded');
  $('#landingContinue')?.classList.toggle('hidden',!hasSaved);
  landing.classList.remove('hidden');
}
function hideLanding(){ $('#landingScreen')?.classList.add('hidden'); }
$('#landingPrimary')?.addEventListener('click',()=>{hideLanding();showOnboarding();});
$('#landingContinue')?.addEventListener('click',()=>{hideLanding();});

function clearTripLocalData(includeSettings=false){
  const keys=['ffvp_profile','ffvp_onboarded','ffvp_saved','ffvp_trip_statuses','ffvp_plans','ffvp_discovered','ffvp_prep_done'];
  keys.forEach(k=>localStorage.removeItem(k));
  if(includeSettings){
    ['ffvp_unit','ffvp_test_location','ffvp_force_onboarding','ffvp_force_landing'].forEach(k=>localStorage.removeItem(k));
  }
}
function initBetaTestingTools(){
  const forceLanding=$('#forceLanding');if(forceLanding){forceLanding.checked=betaForceLanding();forceLanding.addEventListener('change',()=>{localStorage.setItem('ffvp_force_landing',forceLanding.checked?'1':'0');showToast(forceLanding.checked?'Landing screen will open on each launch':'Landing launch test off');});}
  const force=$('#forceOnboarding');if(force){force.checked=betaForceOnboarding();force.addEventListener('change',()=>{localStorage.setItem('ffvp_force_onboarding',force.checked?'1':'0');showToast(force.checked?'Onboarding stays enabled for launch testing':'Onboarding launch test off');});}
  $('#showLanding')?.addEventListener('click',()=>showLanding());
  $('#restartOnboarding')?.addEventListener('click',()=>showOnboarding());
  $('#newUserTest')?.addEventListener('click',()=>{if(!confirm('Start a clean new-user test? This clears the saved family, trip, shortlist and memories on this device.'))return;const keepForce=localStorage.getItem('ffvp_force_onboarding')??'1';const keepLanding=localStorage.getItem('ffvp_force_landing')??'1';clearTripLocalData(false);localStorage.setItem('ffvp_force_onboarding',keepForce);localStorage.setItem('ffvp_force_landing',keepLanding);location.reload();});
  $('#resetAppData')?.addEventListener('click',()=>{if(!confirm('Reset ALL Family Vacation Planner data and testing settings on this device?'))return;localStorage.clear();location.reload();});
}
initBetaTestingTools();

function updateOnlineState(){const b=$('#offlineBanner');if(!b)return;b.classList.toggle('hidden',navigator.onLine);}
window.addEventListener('online',updateOnlineState);window.addEventListener('offline',updateOnlineState);updateOnlineState();
setInterval(()=>{updateGreeting();},60000);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').addEventListener('click',async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('#installBtn').classList.add('hidden');});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

loadProfileForm();$('#testLocationSelect').value=presetFor(state.locationMode)?state.locationMode:'gps';updateGreeting();renderExplore();renderTripHub();renderEssentials();requestLocation();if(betaForceLanding())showLanding();else if(betaForceOnboarding()||!localStorage.getItem('ffvp_onboarded'))showOnboarding();
