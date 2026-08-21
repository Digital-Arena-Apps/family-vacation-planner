const CATEGORY_TYPES = {
  // Exclusive primary-type buckets: the same Google place cannot be returned by
  // two daily moods just because it carries several secondary types.
  chill: ['beach','spa','massage_spa','wellness_center','sauna','scenic_spot'],
  thrills: ['amusement_park','water_park','adventure_sports_center','amusement_center','go_karting_venue','miniature_golf_course','ferris_wheel','off_roading_area','paintball_center','video_arcade'],
  indoor: ['museum','art_museum','history_museum','aquarium','art_gallery','movie_theater','bowling_alley','indoor_playground','planetarium','performing_arts_theater','cultural_center'],
  outdoors: ['park','city_park','state_park','national_park','botanical_garden','garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','dog_park','marina'],
  // Leisure shopping only. Supermarkets, hypermarkets and generic stores are Essentials.
  shopping: ['shopping_mall','market','farmers_market','flea_market','gift_shop','clothing_store','book_store','toy_store','jewelry_store','shoe_store','sporting_goods_store','thrift_store','cosmetics_store'],
  sights: ['historical_landmark','cultural_landmark','historical_place','monument','castle','observation_deck','visitor_center']
};
const OSM_FILTERS = {
  chill: ['[\"natural\"=\"beach\"]','[\"leisure\"=\"spa\"]','[\"tourism\"=\"viewpoint\"]'],
  thrills: ['["tourism"="theme_park"]','["leisure"="amusement_arcade"]','["leisure"="miniature_golf"]','["leisure"="bowling_alley"]','["sport"="karting"]'],
  indoor: ['["tourism"="museum"]','["tourism"="aquarium"]','["amenity"="cinema"]','["leisure"="bowling_alley"]','["leisure"="amusement_arcade"]'],
  outdoors: ['["leisure"="park"]','["tourism"="zoo"]','["leisure"="nature_reserve"]','["tourism"="viewpoint"]','["leisure"="garden"]'],
  shopping: ['["shop"="mall"]','["shop"="gift"]','["shop"="clothes"]','["amenity"="marketplace"]'],
  sights: ['["tourism"="attraction"]','["tourism"="museum"]','["tourism"="viewpoint"]','["historic"]','["leisure"="park"]']
};
function haversine(a,b,c,d){const R=3958.7613,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p,q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));}
function priceLevel(v){const m={PRICE_LEVEL_FREE:0,PRICE_LEVEL_INEXPENSIVE:1,PRICE_LEVEL_MODERATE:2,PRICE_LEVEL_EXPENSIVE:3,PRICE_LEVEL_VERY_EXPENSIVE:4};return m[v] ?? null;}
async function googlePlaces(category,lat,lon,radius){
  const key=process.env.GOOGLE_PLACES_API_KEY;if(!key)return null;
  const body={includedPrimaryTypes:CATEGORY_TYPES[category],maxResultCount:20,rankPreference:['outdoors','chill'].includes(category)?'DISTANCE':'POPULARITY',locationRestriction:{circle:{center:{latitude:lat,longitude:lon},radius}}};
  const fields=['places.id','places.displayName','places.formattedAddress','places.location','places.rating','places.userRatingCount','places.priceLevel','places.primaryType','places.primaryTypeDisplayName','places.types','places.currentOpeningHours','places.businessStatus','places.googleMapsUri'].join(',');
  const r=await fetch('https://places.googleapis.com/v1/places:searchNearby',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fields},body:JSON.stringify(body)});
  if(!r.ok)throw new Error(`Google Places ${r.status}`);
  const data=await r.json();
  return (data.places||[]).map(p=>({
    id:`gp:${p.id}`,providerId:p.id,name:p.displayName?.text||'Nearby place',address:p.formattedAddress||'',lat:p.location?.latitude,lon:p.location?.longitude,
    rating:Number.isFinite(p.rating)?p.rating:null,ratingCount:p.userRatingCount||0,priceLevel:priceLevel(p.priceLevel),type:p.primaryTypeDisplayName?.text||'',typeKey:p.primaryType||'',types:p.types||[],openNow:typeof p.currentOpeningHours?.openNow==='boolean'?p.currentOpeningHours.openNow:null,businessStatus:p.businessStatus||'',mapsUrl:p.googleMapsUri||'',source:'Google Places'
  })).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)).map(x=>({...x,distance:haversine(lat,lon,x.lat,x.lon)})).sort((a,b)=>category==='outdoors'?a.distance-b.distance:0);
}
async function overpass(category,lat,lon,radius){
  const filters=OSM_FILTERS[category]||[];if(!filters.length)return [];
  const parts=filters.flatMap(f=>[`node${f}(around:${radius},${lat},${lon});`,`way${f}(around:${radius},${lat},${lon});`,`relation${f}(around:${radius},${lat},${lon});`]).join('');
  const q=`[out:json][timeout:14];(${parts});out center tags;`;
  const endpoints=['https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter'];
  let last;
  for(const url of endpoints){try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'FamilyVacationPlannerBeta/2.1'},body:`data=${encodeURIComponent(q)}`});if(!r.ok)throw new Error(`Overpass ${r.status}`);const d=await r.json();return (d.elements||[]).map(el=>{const la=el.lat??el.center?.lat,lo=el.lon??el.center?.lon,t=el.tags||{};if(!Number.isFinite(la)||!Number.isFinite(lo))return null;const name=t.name||t.brand||t.operator;if(!name)return null;const addr=[ [t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' '),t['addr:city']].filter(Boolean).join(', ');return{id:`osm:${el.type}:${el.id}`,name,address:addr,lat:la,lon:lo,rating:null,ratingCount:0,priceLevel:null,type:t.tourism||t.leisure||t.shop||t.amenity||t.historic||'',typeKey:t.tourism||t.leisure||t.shop||t.amenity||t.historic||'',types:[t.tourism||t.leisure||t.shop||t.amenity||t.historic||''].filter(Boolean),openNow:null,mapsUrl:'',source:'OpenStreetMap',distance:haversine(lat,lon,la,lo)};}).filter(Boolean).sort((a,b)=>a.distance-b.distance).slice(0,12);}catch(e){last=e;}}
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
module.exports=async function handler(req,res){
  if(req.method!=='GET'){res.status(405).json({error:'Method not allowed'});return;}
  const category=String(req.query.category||'');const lat=Number(req.query.lat),lon=Number(req.query.lon),miles=Number(req.query.miles||30);
  if(!CATEGORY_TYPES[category]||!Number.isFinite(lat)||!Number.isFinite(lon)){res.status(400).json({error:'Invalid category or coordinates'});return;}
  const radius=Math.max(1500,Math.min(50000,miles*1609.344));
  try{
    let results=null,source='';
    try{results=await googlePlaces(category,lat,lon,radius);if(results?.length)source='Google Places';}catch(e){}
    if(!results?.length){results=await overpass(category,lat,lon,radius);source='OpenStreetMap fallback';}
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
    if(category==='shopping')results=filterShopping(results);results=dedupeResults(results);
    res.status(200).json({category,source,results:(results||[]).slice(0,['outdoors','chill'].includes(category)?16:10)});
  }catch(e){res.status(503).json({error:'Discovery temporarily unavailable'});}
};
