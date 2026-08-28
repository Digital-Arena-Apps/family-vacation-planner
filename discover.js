const SUPPORTED_LANGS=new Set(['en','es','fr','de']);
function safeLang(v){const x=String(v||'en').toLowerCase().split('-')[0];return SUPPORTED_LANGS.has(x)?x:'en';}
const CATEGORY_TYPES = {
  // Exclusive primary-type buckets: the same Google place cannot be returned by
  // two daily moods just because it carries several secondary types.
  chill: ['beach','spa','massage_spa','wellness_center','sauna','scenic_spot'],
  thrills: ['amusement_park','water_park','adventure_sports_center','amusement_center','go_karting_venue','miniature_golf_course','ferris_wheel','off_roading_area','paintball_center','video_arcade'],
  indoor: ['museum','art_museum','history_museum','aquarium','art_gallery','movie_theater','bowling_alley','indoor_playground','planetarium','performing_arts_theater','cultural_center'],
  outdoors: ['park','city_park','state_park','national_park','botanical_garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','scenic_spot'],
  // Leisure shopping only. Supermarkets, hypermarkets and generic stores are Essentials.
  shopping: ['shopping_mall','market','farmers_market','flea_market','gift_shop','clothing_store','book_store','toy_store','jewelry_store','shoe_store','sporting_goods_store','thrift_store','cosmetics_store'],
  sights: ['historical_landmark','cultural_landmark','historical_place','monument','castle','observation_deck','visitor_center'],
  wildlife: ['zoo','wildlife_park','wildlife_refuge','nature_preserve','national_park'],
  beaches: ['beach']
};
const OSM_FILTERS = {
  chill: ['[\"natural\"=\"beach\"]','[\"leisure\"=\"spa\"]','[\"tourism\"=\"viewpoint\"]'],
  thrills: ['["tourism"="theme_park"]','["leisure"="amusement_arcade"]','["leisure"="miniature_golf"]','["leisure"="bowling_alley"]','["sport"="karting"]'],
  indoor: ['["tourism"="museum"]','["tourism"="aquarium"]','["amenity"="cinema"]','["leisure"="bowling_alley"]','["leisure"="amusement_arcade"]'],
  outdoors: ['["leisure"="park"]','["tourism"="zoo"]','["leisure"="nature_reserve"]','["tourism"="viewpoint"]','["leisure"="garden"]'],
  shopping: ['["shop"="mall"]','["shop"="gift"]','["shop"="clothes"]','["amenity"="marketplace"]'],
  sights: ['["tourism"="attraction"]','["tourism"="museum"]','["tourism"="viewpoint"]','["historic"]','["leisure"="park"]'],
  wildlife: ['["tourism"="zoo"]','["leisure"="nature_reserve"]','["boundary"="protected_area"]'],
  beaches: ['["natural"="beach"]']
};
function haversine(a,b,c,d){const R=3958.7613,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p,q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));}
function priceLevel(v){const m={PRICE_LEVEL_FREE:0,PRICE_LEVEL_INEXPENSIVE:1,PRICE_LEVEL_MODERATE:2,PRICE_LEVEL_EXPENSIVE:3,PRICE_LEVEL_VERY_EXPENSIVE:4};return m[v] ?? null;}
const OUTDOOR_STRONG_TYPES=new Set(['city_park','state_park','national_park','botanical_garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','scenic_spot']);
const BUSINESSISH_NAME=/\b(landscap(?:e|ing)?|lawn|maintenance|property|properties|realty|realtor|residential|hoa|homeowners|association|services?|solutions?|contractor|nursery|garden\s*center|clubhouse|apartments?|condo|ministry|church|school|academy)\b/i;
const PUBLIC_OUTDOOR_NAME=/\b(park|parks|garden|gardens|botanical|arboretum|preserve|reserve|trail|trails|greenway|nature|wildlife|zoo|playground|recreation|recreational|forest|woods|scenic|viewpoint)\b/i;
function visitorExperienceAllowed(x,category){
  if(!x)return false;
  if(String(x.businessStatus||'').toUpperCase()==='CLOSED_PERMANENTLY')return false;
  if(['private','no','customers'].includes(String(x.access||'').toLowerCase()))return false;
  if(!['outdoors','wildlife'].includes(category))return true;
  const type=String(x.typeKey||x.type||'').toLowerCase();
  const name=String(x.name||'');
  if(BUSINESSISH_NAME.test(name))return false;
  if(OUTDOOR_STRONG_TYPES.has(type))return true;
  // Generic "park" is noisy in Places data. Keep it only when the name itself
  // reads like a visitor/public outdoor place, or it has substantial public reviews.
  if(type==='park')return PUBLIC_OUTDOOR_NAME.test(name)||(x.ratingCount||0)>=75;
  return false;
}
const GENERIC_DESCRIPTIONS={
  es:{chill:'Una opción tranquila para bajar el ritmo y descansar un poco.',thrills:'Una experiencia de más energía pensada para la emoción y la aventura.',indoor:'Una opción interior y protegida del tiempo para pasar unas horas en familia.',outdoors:'Una experiencia familiar al aire libre centrada en naturaleza, espacio abierto o animales.',shopping:'Una opción para pasear y comprar, no para hacer la compra práctica del día a día.',sights:'Un lugar de interés pensado para visitantes que puede merecer un hueco en el viaje.',wildlife:'Una experiencia de fauna donde los animales, el hábitat o el safari son el motivo principal para ir.',beaches:'Una parada de playa o costa para arena, agua y un ritmo más tranquilo.'},
  fr:{chill:'Une option tranquille pour ralentir et récupérer un peu.',thrills:'Une expérience plus énergique axée sur les sensations et l’aventure.',indoor:'Une option couverte et à l’abri de la météo pour quelques heures en famille.',outdoors:'Une expérience familiale en plein air centrée sur la nature, les espaces ouverts ou les animaux.',shopping:'Une sortie shopping et balade, plutôt que des courses pratiques du quotidien.',sights:'Un site pensé pour les visiteurs qui peut mériter une place dans le voyage.',wildlife:'Une expérience autour de la faune où les animaux, l’habitat ou le safari sont la raison principale de venir.',beaches:'Une halte plage ou littoral pour le sable, l’eau et un rythme plus calme.'},
  de:{chill:'Eine ruhige Option, um das Tempo zu drosseln und etwas aufzutanken.',thrills:'Ein energiegeladenes Erlebnis für Action und Abenteuer.',indoor:'Eine wetterfeste Indoor-Option für ein paar entspanntere Stunden mit der Familie.',outdoors:'Ein Familienerlebnis draußen mit Natur, Freiraum oder Tieren im Mittelpunkt.',shopping:'Eine Freizeit-Shoppingoption zum Bummeln, nicht für praktische Einkäufe.',sights:'Eine besucherorientierte Sehenswürdigkeit, die einen Platz in der Reise wert sein kann.',wildlife:'Ein Tiererlebnis, bei dem Tiere, Lebensraum oder Safari der Hauptgrund für den Besuch sind.',beaches:'Ein Strand- oder Küstenstopp für Sand, Wasser und ein ruhigeres Tempo.'}
};
function experienceDescription(category,x,lang='en'){
  if(lang!=='en')return GENERIC_DESCRIPTIONS[lang]?.[category]||GENERIC_DESCRIPTIONS[lang]?.sights||'';
  const t=String(x.typeKey||x.type||'').toLowerCase();
  const copy={
    beach:'Beach time for sand, water and a slower pace — best when the weather and drive time make it worthwhile.',
    spa:'A low-effort wellness stop for a proper reset away from the busy sightseeing pace.',
    scenic_spot:'A scenic stop made for views, photos and a lower-effort outdoor break.',
    city_park:'Public green space for an easy walk, play or picnic without committing the whole day.',
    state_park:'A larger outdoor day with trails, nature and room to explore; allow a few hours rather than a quick stop.',
    national_park:'A major nature-focused day out with scenery and outdoor exploration; usually worth planning several hours.',
    park:'An outdoor green-space option for walking, play or a picnic; usually a lighter commitment than a major attraction.',
    botanical_garden:'Landscaped gardens and walking paths — a relaxed outdoor experience that works well for strolling and photos.',
    hiking_area:'A trail-based outdoor option — best when the family is up for walking and the weather cooperates.',
    zoo:'An animal-focused family day out with exhibits and plenty of walking; better for a few hours than a quick stop.',
    wildlife_park:'Wildlife-focused outdoor experience with animal viewing and walking areas; allow time to explore properly.',
    wildlife_refuge:'A quieter nature and wildlife experience, usually centred on trails, habitats or viewing areas.',
    nature_preserve:'Nature-first outdoor time with trails and wildlife; a good choice when you want space rather than rides or shops.',
    playground:'A simple local stop for younger children to burn off energy without turning it into a full-day outing.',
    picnic_ground:'An easy outdoor stop for food, downtime and open space; useful for a lower-key part of the day.',
    cycling_park:'An active outdoor option built around cycling or wheeled recreation rather than a traditional attraction.',
    museum:'Indoor exhibits and displays — a weather-proof option that can usually fill a couple of hours.',
    art_museum:'Indoor galleries and exhibitions for a slower, culture-focused few hours.',
    history_museum:'Indoor exhibits focused on local or wider history — useful for a lower-energy, weather-proof day.',
    aquarium:'Indoor animal exhibits and marine life; family-friendly and especially useful in heat or rain.',
    movie_theater:'A straightforward indoor reset with minimal walking — useful when everyone needs an easier couple of hours.',
    bowling_alley:'Casual indoor family activity that works well for a shorter session or poor-weather backup.',
    indoor_playground:'Indoor play aimed mainly at younger children — good for burning off energy without battling the weather.',
    amusement_park:'A high-energy park day built around rides and attractions; usually a substantial time and walking commitment.',
    water_park:'A high-energy water-based day with slides and pools; best treated as a major outing rather than a quick stop.',
    go_karting_venue:'Shorter high-energy fun centred on kart racing — useful when you want excitement without a full theme-park day.',
    miniature_golf_course:'Low-commitment competitive family fun that normally fits neatly into a couple of hours.',
    shopping_mall:'Leisure shopping with multiple stores in one place, often useful when you want an easy indoor browse.',
    farmers_market:'A browse-and-snack experience focused on local stalls, produce and small vendors.',
    flea_market:'Casual browsing through independent stalls and bargain finds rather than conventional mall shopping.',
    market:'A browse-first stop with multiple stalls or vendors; good for a lighter few hours rather than a major day out.'
  };
  return copy[t]||({chill:'A lower-effort option for slowing the pace and giving everyone a bit of breathing room.',thrills:'A higher-energy experience aimed at excitement rather than a quiet day.',indoor:'A weather-proof indoor option for a few easier hours.',outdoors:'An outdoor family experience focused on nature, open space or animals.',shopping:'A leisure-shopping option for browsing rather than practical groceries or essentials.',sights:'A visitor-focused local sight that may be worth building into the trip.',wildlife:'A visitor-focused wildlife experience where animals, habitat or safari-style exploring are the main reason to go.',beaches:'A beach or coastal stop for sand, water and a slower pace.'}[category]||'A nearby visitor experience that fits this part of your trip.');
}
async function googlePlaces(category,lat,lon,radius,lang='en'){
  const key=process.env.GOOGLE_PLACES_API_KEY;if(!key)return null;
  const body={includedPrimaryTypes:CATEGORY_TYPES[category],maxResultCount:20,languageCode:lang,rankPreference:category==='chill'?'DISTANCE':'POPULARITY',locationRestriction:{circle:{center:{latitude:lat,longitude:lon},radius}}};
  const fields=['places.id','places.displayName','places.formattedAddress','places.location','places.rating','places.userRatingCount','places.priceLevel','places.primaryType','places.primaryTypeDisplayName','places.types','places.currentOpeningHours','places.businessStatus','places.googleMapsUri'].join(',');
  const r=await fetch('https://places.googleapis.com/v1/places:searchNearby',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fields},body:JSON.stringify(body)});
  if(!r.ok)throw new Error(`Google Places ${r.status}`);
  const data=await r.json();
  return (data.places||[]).map(p=>({
    id:`gp:${p.id}`,providerId:p.id,name:p.displayName?.text||'Nearby place',address:p.formattedAddress||'',lat:p.location?.latitude,lon:p.location?.longitude,
    rating:Number.isFinite(p.rating)?p.rating:null,ratingCount:p.userRatingCount||0,priceLevel:priceLevel(p.priceLevel),type:p.primaryTypeDisplayName?.text||'',typeKey:p.primaryType||'',types:p.types||[],openNow:typeof p.currentOpeningHours?.openNow==='boolean'?p.currentOpeningHours.openNow:null,businessStatus:p.businessStatus||'',mapsUrl:p.googleMapsUri||'',source:'Google Places'
  })).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)).filter(x=>visitorExperienceAllowed(x,category)).map(x=>({...x,distance:haversine(lat,lon,x.lat,x.lon),description:experienceDescription(category,x,lang)})).sort((a,b)=>category==='outdoors'?a.distance-b.distance:0);
}
async function overpass(category,lat,lon,radius,lang='en'){
  const filters=OSM_FILTERS[category]||[];if(!filters.length)return [];
  const parts=filters.flatMap(f=>[`node${f}(around:${radius},${lat},${lon});`,`way${f}(around:${radius},${lat},${lon});`,`relation${f}(around:${radius},${lat},${lon});`]).join('');
  const q=`[out:json][timeout:14];(${parts});out center tags;`;
  const endpoints=['https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter'];
  let last;
  for(const url of endpoints){try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'FERDAOrlando/0.1'},body:`data=${encodeURIComponent(q)}`});if(!r.ok)throw new Error(`Overpass ${r.status}`);const d=await r.json();return (d.elements||[]).map(el=>{const la=el.lat??el.center?.lat,lo=el.lon??el.center?.lon,t=el.tags||{};if(!Number.isFinite(la)||!Number.isFinite(lo))return null;const name=t[`name:${lang}`]||t['name:en']||t.name||t.brand||t.operator;if(!name)return null;const addr=[ [t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' '),t['addr:city']].filter(Boolean).join(', ');return{id:`osm:${el.type}:${el.id}`,name,address:addr,lat:la,lon:lo,rating:null,ratingCount:0,priceLevel:null,type:t.tourism||t.leisure||t.shop||t.amenity||t.historic||'',typeKey:t.tourism||t.leisure||t.shop||t.amenity||t.historic||'',types:[t.tourism||t.leisure||t.shop||t.amenity||t.historic||''].filter(Boolean),openNow:null,mapsUrl:'',source:'OpenStreetMap',access:t.access||'',distance:haversine(lat,lon,la,lo)};}).filter(Boolean).filter(x=>visitorExperienceAllowed(x,category)).map(x=>({...x,description:experienceDescription(category,x,lang)})).sort((a,b)=>a.distance-b.distance).slice(0,12);}catch(e){last=e;}}
  throw last||new Error('Discovery unavailable');
}
function normalizedName(name){return String(name||'').toLowerCase().replace(/&/g,' and ').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\b(supercenter|super centre|store|location|branch)\b/g,' ').replace(/\b#?\d+\b/g,' ').replace(/\s+/g,' ').trim();}
function dedupeResults(results){
  const out=[];
  for(const r of results||[]){
    const name=normalizedName(r.name);const idx=out.findIndex(x=>normalizedName(x.name)===name&&haversine(x.lat,x.lon,r.lat,r.lon)<=0.35);
    if(idx<0)out.push(r);else if((r.ratingCount||0)>(out[idx].ratingCount||0))out[idx]=r;
  }
  return out;
}
function filterShopping(results){
  const practical=new Set(['supermarket','grocery_store','discount_supermarket','hypermarket','warehouse_store','convenience_store','food_store','general_store','discount_store']);
  return (results||[]).filter(r=>![r.typeKey,...(r.types||[])].some(t=>practical.has(String(t||'').toLowerCase())));
}
function resultSubtype(r,category){
  const t=String(r.typeKey||r.type||'').toLowerCase();
  if(category==='wildlife'){if(t.includes('zoo'))return 'zoo';if(t.includes('wildlife'))return 'wildlife';if(t.includes('refuge')||t.includes('preserve'))return 'reserve';if(t.includes('national_park'))return 'national-park';}
  if(category==='beaches')return 'beach';
  if(category==='outdoors'){
    if(t.includes('playground'))return 'playground';
    if(t.includes('zoo')||t.includes('wildlife'))return 'wildlife';
    if(t.includes('garden')||t.includes('botanical'))return 'garden';
    if(t.includes('hiking')||t.includes('cycling'))return 'trail';
    if(t.includes('preserve')||t.includes('refuge'))return 'nature';
    if(t.includes('scenic')||t.includes('viewpoint'))return 'scenic';
    if(t.includes('picnic'))return 'picnic';
    if(t.includes('park'))return 'park';
  }
  if(category==='shopping'){
    if(t.includes('mall'))return 'mall';if(t.includes('market'))return 'market';if(t.includes('gift'))return 'gift';
    if(t.includes('book')||t.includes('toy'))return 'books-toys';if(t.includes('clothing')||t.includes('shoe')||t.includes('jewelry')||t.includes('cosmetics'))return 'fashion';
  }
  if(category==='indoor'){
    if(t.includes('aquarium'))return 'aquarium';if(t.includes('museum')||t.includes('gallery'))return 'museum';if(t.includes('movie')||t.includes('theater'))return 'show';if(t.includes('bowling'))return 'bowling';if(t.includes('playground'))return 'play';
  }
  if(category==='thrills'){
    if(t.includes('amusement_park')||t==='water_park')return 'theme-park';if(t.includes('kart'))return 'karting';if(t.includes('miniature_golf'))return 'mini-golf';if(t.includes('adventure')||t.includes('paintball')||t.includes('off_roading'))return 'adventure';
  }
  if(category==='chill'){if(t==='beach')return 'beach';if(t.includes('spa')||t.includes('wellness')||t.includes('sauna'))return 'spa';if(t.includes('scenic'))return 'scenic';}
  return t||category||'other';
}
function diversifyResults(results,category){
  const groups=new Map();
  for(const r of results||[]){const key=resultSubtype(r,category);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
  // Within each experience type, prefer the nearer option; then round-robin
  // across types so the first five feel like choices rather than duplicates.
  for(const group of groups.values())group.sort((a,b)=>(a.distance??999)-(b.distance??999));
  const out=[];let round=0,added=true;
  while(added){added=false;for(const group of groups.values()){if(group[round]){out.push(group[round]);added=true;}}round++;}
  return out;
}
module.exports=async function handler(req,res){
  if(req.method!=='GET'){res.status(405).json({error:'Method not allowed'});return;}
  const category=String(req.query.category||'');const lat=Number(req.query.lat),lon=Number(req.query.lon),miles=Number(req.query.miles||30),lang=safeLang(req.query.lang);
  if(!CATEGORY_TYPES[category]||!Number.isFinite(lat)||!Number.isFinite(lon)){res.status(400).json({error:'Invalid category or coordinates'});return;}
  const radius=Math.max(1500,Math.min(50000,miles*1609.344));
  try{
    let results=null,source='';
    try{results=await googlePlaces(category,lat,lon,radius,lang);if(results?.length)source='Google Places';}catch(e){}
    if(!results?.length){results=await overpass(category,lat,lon,radius,lang);source='OpenStreetMap fallback';}
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
    if(category==='shopping')results=filterShopping(results);results=dedupeResults(results);results=diversifyResults(results,category);
    res.status(200).json({category,source,language:lang,results:(results||[]).slice(0,['outdoors','chill','wildlife','beaches'].includes(category)?16:10)});
  }catch(e){res.status(503).json({error:'Discovery temporarily unavailable'});}
};
