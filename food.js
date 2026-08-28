const USER_AGENT='FERDAOrlando/0.1 (+https://family-vacation-planner-alpha.vercel.app)';

function haversine(a,b,c,d){
  const R=6371,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p;
  const q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;
  return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q))*0.621371;
}
function timedFetch(url,options={},ms=6500){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);
  return fetch(url,{...options,signal:controller.signal}).finally(()=>clearTimeout(timer));
}
function googlePriceLevel(v){
  return ({PRICE_LEVEL_INEXPENSIVE:1,PRICE_LEVEL_MODERATE:2,PRICE_LEVEL_EXPENSIVE:3,PRICE_LEVEL_VERY_EXPENSIVE:4})[v]||null;
}
async function googlePlaces(lat,lon){
  const key=process.env.GOOGLE_PLACES_API_KEY;if(!key)return null;
  const body={
    includedTypes:['restaurant','cafe','bakery','meal_takeaway','fast_food_restaurant'],
    maxResultCount:15,
    rankPreference:'DISTANCE',
    locationRestriction:{circle:{center:{latitude:lat,longitude:lon},radius:12000}}
  };
  const r=await timedFetch('https://places.googleapis.com/v1/places:searchNearby',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'X-Goog-Api-Key':key,
      'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.primaryType,places.primaryTypeDisplayName,places.currentOpeningHours.openNow'
    },
    body:JSON.stringify(body)
  },7000);
  if(!r.ok)throw new Error(`Google Places ${r.status}`);
  const data=await r.json();
  return (data.places||[]).map(x=>({
    id:x.id||'',name:x.displayName?.text||'Restaurant',address:x.formattedAddress||'',
    lat:x.location?.latitude,lon:x.location?.longitude,rating:Number.isFinite(x.rating)?x.rating:null,
    userRatingCount:Number.isFinite(x.userRatingCount)?x.userRatingCount:null,priceLevel:googlePriceLevel(x.priceLevel),
    typeLabel:x.primaryTypeDisplayName?.text||String(x.primaryType||'restaurant').replaceAll('_',' '),openNow:x.currentOpeningHours?.openNow
  })).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)).map(x=>({...x,distance:haversine(lat,lon,x.lat,x.lon)}));
}
function osmCoords(el){return {lat:el.lat??el.center?.lat,lon:el.lon??el.center?.lon};}
function osmAddress(el){
  const t=el.tags||{},line1=[t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' '),line2=[t['addr:city'],t['addr:state']].filter(Boolean).join(', ');
  return [line1,line2].filter(Boolean).join(' · ')||t['addr:full']||'';
}
function inferPrice(tags={}){if(tags.amenity==='fast_food')return 1;if(tags.amenity==='cafe'||tags.shop==='bakery')return 1;return 2;}
function typeLabel(tags={}){
  if(tags.cuisine)return String(tags.cuisine).split(';').slice(0,2).map(x=>x.replaceAll('_',' ')).join(' · ');
  if(tags.amenity==='fast_food')return 'Fast food';if(tags.amenity==='cafe')return 'Cafe';if(tags.shop==='bakery')return 'Bakery';return 'Restaurant';
}
async function overpassFood(lat,lon){
  const radius=14000;
  const query=`[out:json][timeout:12];(nwr(around:${radius},${lat},${lon})["amenity"="restaurant"];nwr(around:${radius},${lat},${lon})["amenity"="fast_food"];nwr(around:${radius},${lat},${lon})["amenity"="cafe"];nwr(around:${radius},${lat},${lon})["shop"="bakery"];);out center tags;`;
  const endpoints=['https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter'];
  const jobs=endpoints.map(async endpoint=>{
    const r=await timedFetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','User-Agent':USER_AGENT,'Accept':'application/json'},body:'data='+encodeURIComponent(query)},6500);
    if(!r.ok)throw new Error(`Overpass ${r.status}`);const data=await r.json();if(!Array.isArray(data.elements))throw new Error('Invalid Overpass');return data.elements;
  });
  const elements=await Promise.any(jobs),seen=new Set();
  return elements.map(el=>{
    const c=osmCoords(el),t=el.tags||{};if(!Number.isFinite(c.lat)||!Number.isFinite(c.lon))return null;
    const name=t.name||t.brand||t.operator||'Food nearby',key=`${name}|${c.lat.toFixed(4)}|${c.lon.toFixed(4)}`;if(seen.has(key))return null;seen.add(key);
    return {id:key,name,address:osmAddress(el),lat:c.lat,lon:c.lon,rating:null,userRatingCount:null,priceLevel:inferPrice(t),typeLabel:typeLabel(t),distance:haversine(lat,lon,c.lat,c.lon)};
  }).filter(Boolean).sort((a,b)=>a.distance-b.distance).slice(0,15);
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const lat=Number(req.query.lat),lon=Number(req.query.lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return res.status(400).json({error:'Invalid coordinates'});
  try{
    const rich=await googlePlaces(lat,lon);
    if(rich?.length)return res.status(200).json({source:'Google Places',results:rich.sort((a,b)=>a.distance-b.distance)});
  }catch(err){console.error('Google Places food lookup failed:',err.message);}
  try{
    const fallback=await overpassFood(lat,lon);
    if(fallback.length)return res.status(200).json({source:'OpenStreetMap fallback',results:fallback});
  }catch(err){console.error('OSM food lookup failed:',err.message);}
  return res.status(503).json({error:'Food places are temporarily unavailable'});
};
