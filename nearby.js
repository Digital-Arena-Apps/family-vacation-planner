const CATEGORIES = {
  groceries: {name:'Groceries',query:'supermarket',filters:['["shop"="supermarket"]','["shop"="grocery"]']},
  pharmacy: {name:'Pharmacy',query:'pharmacy',filters:['["amenity"="pharmacy"]']},
  fuel: {name:'Fuel',query:'gas station',filters:['["amenity"="fuel"]']},
  convenience: {name:'Convenience store',query:'convenience store',filters:['["shop"="convenience"]']},
  laundry: {name:'Laundry',query:'laundromat',filters:['["shop"="laundry"]','["amenity"="laundry"]']},
  car: {name:'Car help',query:'auto repair',filters:['["shop"="car_repair"]','["shop"="tyres"]']},
  clinic: {name:'Urgent care / clinic',query:'urgent care clinic',filters:['["amenity"="clinic"]','["healthcare"="clinic"]']},
  hospital: {name:'Hospital / ER',query:'hospital emergency room',filters:['["amenity"="hospital"]']}
};

const USER_AGENT='FERDAOrlando/0.1 (+https://family-vacation-planner-alpha.vercel.app)';

function haversine(a,b,c,d){
  const R=6371,p=Math.PI/180,x=(c-a)*p,y=(d-b)*p;
  const q=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;
  return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q))*0.621371;
}
function osmName(el,category){const t=el.tags||{};return t.name||t.brand||t.operator||`${category.name} nearby`;}
function osmCoords(el){return {lat:el.lat??el.center?.lat,lon:el.lon??el.center?.lon};}
function osmAddress(el){
  const t=el.tags||{};
  const line1=[t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' ');
  const line2=[t['addr:city'],t['addr:state']].filter(Boolean).join(', ');
  return [line1,line2].filter(Boolean).join(' · ')||t['addr:full']||'';
}
async function timedFetch(url,options={},ms=5500){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),ms);
  try{return await fetch(url,{...options,signal:controller.signal});}
  finally{clearTimeout(timer);}
}
async function overpassSearch(category,lat,lon){
  const radius=18000;
  const clauses=category.filters.map(f=>`nwr(around:${radius},${lat},${lon})${f};`).join('');
  const query=`[out:json][timeout:12];(${clauses});out center tags;`;
  const endpoints=['https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter'];
  const jobs=endpoints.map(async endpoint=>{
    const r=await timedFetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','User-Agent':USER_AGENT,'Accept':'application/json'},
      body:'data='+encodeURIComponent(query)
    },6000);
    if(!r.ok)throw new Error(`Overpass ${r.status}`);
    const data=await r.json();
    if(!Array.isArray(data.elements))throw new Error('Invalid Overpass response');
    return data.elements;
  });
  return Promise.any(jobs);
}
async function nominatimSearch(category,lat,lon){
  const span=.18;
  const viewbox=[lon-span,lat+span,lon+span,lat-span].join(',');
  const u=new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('q',category.query);u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');
  u.searchParams.set('limit','10');u.searchParams.set('bounded','1');u.searchParams.set('viewbox',viewbox);
  const r=await timedFetch(u.toString(),{
    headers:{'User-Agent':USER_AGENT,'Accept':'application/json','Referer':'https://family-vacation-planner-alpha.vercel.app/'}
  },4500);
  if(!r.ok)throw new Error(`Nominatim ${r.status}`);
  const data=await r.json();
  return (data||[]).map(x=>({
    name:String(x.display_name||'').split(',')[0]||category.name,
    lat:Number(x.lat),lon:Number(x.lon),address:x.display_name||''
  })).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon));
}
function normaliseOverpass(elements,category,lat,lon){
  const seen=new Set();
  return (elements||[]).map(el=>{
    const c=osmCoords(el);if(!Number.isFinite(c.lat)||!Number.isFinite(c.lon))return null;
    const name=osmName(el,category),key=`${name}|${c.lat.toFixed(4)}|${c.lon.toFixed(4)}`;
    if(seen.has(key))return null;seen.add(key);
    return {name,lat:c.lat,lon:c.lon,address:osmAddress(el),distance:haversine(lat,lon,c.lat,c.lon)};
  }).filter(Boolean);
}
function normaliseFallback(rows,lat,lon){
  const seen=new Set();
  return rows.map(x=>{
    const key=`${x.name}|${x.lat.toFixed(4)}|${x.lon.toFixed(4)}`;if(seen.has(key))return null;seen.add(key);
    return {...x,distance:haversine(lat,lon,x.lat,x.lon)};
  }).filter(Boolean);
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const lat=Number(req.query.lat),lon=Number(req.query.lon),category=CATEGORIES[req.query.category];
  if(!category||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){
    return res.status(400).json({error:'Invalid category or coordinates'});
  }
  try{
    const elements=await overpassSearch(category,lat,lon);
    const results=normaliseOverpass(elements,category,lat,lon).sort((a,b)=>a.distance-b.distance).slice(0,7);
    if(results.length)return res.status(200).json({source:'OpenStreetMap / Overpass',results});
  }catch(err){}
  try{
    const rows=await nominatimSearch(category,lat,lon);
    const results=normaliseFallback(rows,lat,lon).sort((a,b)=>a.distance-b.distance).slice(0,7);
    if(results.length)return res.status(200).json({source:'OpenStreetMap / Nominatim fallback',results});
  }catch(err){}
  return res.status(503).json({error:'Nearby places are temporarily unavailable'});
};
