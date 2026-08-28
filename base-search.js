const ORLANDO={lat:28.5383,lon:-81.3792};
const CENTRAL_FLORIDA={south:27.45,north:29.35,west:-82.45,east:-80.55};
const UA='FERDAOrlando/0.1 (+https://family-vacation-planner-alpha.vercel.app)';

function inCentralFlorida(lat,lon){return lat>=CENTRAL_FLORIDA.south&&lat<=CENTRAL_FLORIDA.north&&lon>=CENTRAL_FLORIDA.west&&lon<=CENTRAL_FLORIDA.east;}
function typeLabel(types=[],primary=''){
  const all=[primary,...types].map(x=>String(x||'').toLowerCase());
  if(all.some(x=>x.includes('hotel')))return 'Hotel';
  if(all.some(x=>x.includes('resort')))return 'Resort';
  if(all.some(x=>x.includes('lodging')))return 'Accommodation';
  return 'Address / place';
}
async function googleTextSearch(q){
  const key=process.env.GOOGLE_PLACES_API_KEY;if(!key)return null;
  const body={
    textQuery:`${q}, Orlando Florida`,
    languageCode:'en',
    maxResultCount:7,
    locationBias:{circle:{center:{latitude:ORLANDO.lat,longitude:ORLANDO.lon},radius:65000}}
  };
  const fields=['places.id','places.displayName','places.formattedAddress','places.location','places.primaryType','places.types','places.googleMapsUri'].join(',');
  const r=await fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:{'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':fields},body:JSON.stringify(body)});
  if(!r.ok)throw new Error(`Google Places ${r.status}`);
  const data=await r.json();
  return (data.places||[]).map(p=>({
    id:`gp:${p.id}`,
    providerId:p.id,
    name:p.displayName?.text||p.formattedAddress||'Orlando base',
    address:p.formattedAddress||'',
    lat:p.location?.latitude,
    lon:p.location?.longitude,
    type:typeLabel(p.types,p.primaryType),
    mapsUrl:p.googleMapsUri||'',
    source:'Google Places'
  })).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&inCentralFlorida(x.lat,x.lon));
}
async function nominatimSearch(q){
  const u=new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('q',`${q}, Orlando, Florida`);u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('limit','7');
  u.searchParams.set('viewbox',`${CENTRAL_FLORIDA.west},${CENTRAL_FLORIDA.north},${CENTRAL_FLORIDA.east},${CENTRAL_FLORIDA.south}`);u.searchParams.set('bounded','1');
  const r=await fetch(u,{headers:{'User-Agent':UA,'Accept':'application/json','Referer':'https://family-vacation-planner-alpha.vercel.app/'}});
  if(!r.ok)throw new Error(`Nominatim ${r.status}`);
  const data=await r.json();
  return (data||[]).map(x=>({id:`osm:${x.osm_type}:${x.osm_id}`,name:String(x.display_name||'').split(',')[0]||'Orlando base',address:x.display_name||'',lat:Number(x.lat),lon:Number(x.lon),type:'Address / place',mapsUrl:'',source:'OpenStreetMap'})).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&inCentralFlorida(x.lat,x.lon));
}
async function reverseLookup(lat,lon){
  if(!inCentralFlorida(lat,lon))return {outside:true};
  const u=new URL('https://nominatim.openstreetmap.org/reverse');u.searchParams.set('lat',String(lat));u.searchParams.set('lon',String(lon));u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('zoom','18');
  try{
    const r=await fetch(u,{headers:{'User-Agent':UA,'Accept':'application/json','Referer':'https://family-vacation-planner-alpha.vercel.app/'}});if(!r.ok)throw new Error();
    const x=await r.json();const label=x.name||x.address?.hotel||x.address?.resort||x.address?.road||'Current Orlando location';
    return {outside:false,result:{id:'gps',name:label,address:x.display_name||'',lat,lon,type:'Current location',mapsUrl:'',source:'Device location'}};
  }catch{return {outside:false,result:{id:'gps',name:'Current Orlando location',address:'',lat,lon,type:'Current location',mapsUrl:'',source:'Device location'}};}
}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=180');
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
  const lat=Number(req.query.lat),lon=Number(req.query.lon);
  if(req.query.reverse==='1'){
    if(!Number.isFinite(lat)||!Number.isFinite(lon))return res.status(400).json({error:'Invalid coordinates'});
    const result=await reverseLookup(lat,lon);return res.status(200).json(result);
  }
  const q=String(req.query.q||'').trim();if(q.length<2)return res.status(400).json({error:'Search needs at least 2 characters'});
  try{const results=await googleTextSearch(q);if(results?.length)return res.status(200).json({source:'Google Places',results});}catch(e){}
  try{const results=await nominatimSearch(q);if(results.length)return res.status(200).json({source:'OpenStreetMap',results});}catch(e){}
  return res.status(200).json({source:'none',results:[]});
};
