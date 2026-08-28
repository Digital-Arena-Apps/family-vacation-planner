// FERDA behavioural reference — What Now learning loop
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const SUPPORTED_LANGUAGES=['en','es','fr','de'];
const LANG_LOCALES={en:'en-GB',es:'es-ES',fr:'fr-FR',de:'de-DE'};
const TRANSLATIONS={
  en:{today:'Today',explore:'Explore',trip:'Trip',family:'Family',parks:'Parks',wildlife:'Wildlife',sights:'Sights',highlights:'Highlights',beaches:'Beaches',daysOut:'Days Out',discover:'Discover',language:'Language',languageCopy:'App navigation, dates and place searches',auto:'Automatic',landingStart:'Let’s plan our adventure ✦',landingNew:'Plan a new vacation ✦',landingContinue:'Continue saved trip',quickTitle:'What are you in the mood for?',quickCopy:'Pick the vibe and we’ll find places nearby that fit it.',chill:'Chill & Recharge',indoor:'Indoor & Easy',food:'Food & Treats',outdoors:'Outdoors & Explore',thrills:'Thrills & Excitement',shopping:'Shop & Browse',save:'Save',saved:'Saved',directions:'Directions →',openNow:'Open now',ratingUnavailable:'Rating unavailable',whatItsLike:'What it’s like:',newVacation:'＋ New vacation',newVacationLong:'＋ Start a new vacation',whereNext:'Where shall we go next?',newTripIntro:'Already got somewhere in mind? Great. If not, tell me the kind of holiday you fancy and we’ll narrow it down.',known:'I know where we’re going',startPlanning:'Start planning this vacation',helpChoose:'Help me choose a destination',finderTitle:'What kind of holiday sounds good?',finderCopy:'Pick up to 3 things that matter most. Add budget, trip length and where you’re travelling from, and we’ll see what fits.',finderOrigin:'Travelling from',finderBudget:'Budget feel',finderLength:'Trip length',showIdeas:'Find me a few ideas',finderClimate:'Weather feel',finderSetting:'Holiday setting',finderAny:'Any',finderHot:'Hot & sunny',finderWarm:'Warm / mild',finderCool:'Cool / fresh',finderCity:'City',finderCoast:'Coast / island',finderNature:'Nature / scenery',finderMixed:'A bit of everything',finderNeed:'Choose at least one priority to get started.',finderDifferent:'Show me some different ones',planThis:'Plan this trip',previousTrips:'Previous vacations',restore:'Restore trip'},
  es:{today:'Hoy',explore:'Explorar',trip:'Viaje',family:'Familia',parks:'Parques',wildlife:'Fauna',sights:'Lugares',highlights:'Destacados',beaches:'Playas',daysOut:'Excursiones',discover:'Descubrir',language:'Idioma',languageCopy:'Navegación, fechas y búsquedas de lugares',auto:'Automático',landingStart:'Planifiquemos nuestra aventura ✦',landingNew:'Planear unas nuevas vacaciones ✦',landingContinue:'Continuar viaje guardado',quickTitle:'¿Qué os apetece hoy?',quickCopy:'Elige primero el tipo de día y buscaré experiencias que encajen con este destino.',chill:'Relax y recarga',indoor:'Interior y fácil',food:'Comida y caprichos',outdoors:'Aire libre y explorar',thrills:'Emoción y aventura',shopping:'Compras y paseo',save:'Guardar',saved:'Guardado',directions:'Cómo llegar →',openNow:'Abierto ahora',ratingUnavailable:'Valoración no disponible',whatItsLike:'Cómo es:',newVacation:'＋ Nuevo viaje',newVacationLong:'＋ Crear nuevas vacaciones',whereNext:'¿Adónde vamos ahora?',newTripIntro:'Empieza con un destino que ya conozcas o deja que el planificador compare el tipo de vacaciones que busca tu familia.',known:'Ya sabemos adónde vamos',startPlanning:'Empezar a planificar',helpChoose:'Ayúdame a elegir destino',finderTitle:'¿Qué tipo de vacaciones os apetece?',finderCopy:'Elige hasta 3 prioridades. Compararé el viaje completo, incluido el origen, el presupuesto y el tiempo disponible.',finderOrigin:'Salida desde',finderBudget:'Presupuesto',finderLength:'Duración',showIdeas:'Ver ideas',finderClimate:'Clima',finderSetting:'Tipo de destino',finderAny:'Cualquiera',finderHot:'Calor y sol',finderWarm:'Templado',finderCool:'Fresco',finderCity:'Ciudad',finderCoast:'Costa / isla',finderNature:'Naturaleza / paisaje',finderMixed:'Un poco de todo',finderNeed:'Elige al menos una prioridad para empezar.',finderDifferent:'Ver otras ideas',planThis:'Planear este viaje',previousTrips:'Vacaciones anteriores',restore:'Restaurar viaje'},
  fr:{today:"Aujourd’hui",explore:'Explorer',trip:'Voyage',family:'Famille',parks:'Parcs',wildlife:'Faune',sights:'Sites',highlights:'Incontournables',beaches:'Plages',daysOut:'Sorties',discover:'Découvrir',language:'Langue',languageCopy:'Navigation, dates et recherche de lieux',auto:'Automatique',landingStart:'Planifions notre aventure ✦',landingNew:'Planifier de nouvelles vacances ✦',landingContinue:'Continuer le voyage enregistré',quickTitle:'De quoi avez-vous envie ?',quickCopy:'Choisissez d’abord le style de journée ; je chercherai des expériences adaptées à cette destination.',chill:'Repos & détente',indoor:'Intérieur & facile',food:'Repas & gourmandises',outdoors:'Plein air & découverte',thrills:'Sensations & aventure',shopping:'Shopping & balade',save:'Enregistrer',saved:'Enregistré',directions:'Itinéraire →',openNow:'Ouvert maintenant',ratingUnavailable:'Note indisponible',whatItsLike:'À quoi s’attendre :',newVacation:'＋ Nouveau voyage',newVacationLong:'＋ Créer de nouvelles vacances',whereNext:'Où partons-nous ensuite ?',newTripIntro:'Choisissez une destination que vous connaissez déjà, ou laissez le planificateur comparer les vacances qui correspondent à votre famille.',known:'Je sais où nous allons',startPlanning:'Commencer à planifier',helpChoose:'Aidez-moi à choisir une destination',finderTitle:'Quel type de vacances vous tente ?',finderCopy:'Choisissez jusqu’à 3 priorités. Je comparerai le voyage complet, y compris le point de départ, le budget et la durée.',finderOrigin:'Départ depuis',finderBudget:'Budget',finderLength:'Durée',showIdeas:'Voir des idées',finderClimate:'Climat',finderSetting:'Type de séjour',finderAny:'Peu importe',finderHot:'Chaud et ensoleillé',finderWarm:'Doux / tempéré',finderCool:'Frais',finderCity:'Ville',finderCoast:'Côte / île',finderNature:'Nature / paysages',finderMixed:'Un peu de tout',finderNeed:'Choisissez au moins une priorité pour commencer.',finderDifferent:'Voir d’autres idées',planThis:'Planifier ce voyage',previousTrips:'Vacances précédentes',restore:'Restaurer le voyage'},
  de:{today:'Heute',explore:'Entdecken',trip:'Reise',family:'Familie',parks:'Parks',wildlife:'Tierwelt',sights:'Sehenswürdigkeiten',highlights:'Highlights',beaches:'Strände',daysOut:'Ausflüge',discover:'Entdecken',language:'Sprache',languageCopy:'Navigation, Datumsformat und Ortssuche',auto:'Automatisch',landingStart:'Unser Abenteuer planen ✦',landingNew:'Neue Reise planen ✦',landingContinue:'Gespeicherte Reise fortsetzen',quickTitle:'Worauf habt ihr heute Lust?',quickCopy:'Wählt zuerst die Art des Tages – ich finde Erlebnisse, die zu diesem Reiseziel passen.',chill:'Entspannen & Auftanken',indoor:'Drinnen & entspannt',food:'Essen & Genuss',outdoors:'Draußen & Entdecken',thrills:'Action & Abenteuer',shopping:'Bummeln & Shoppen',save:'Speichern',saved:'Gespeichert',directions:'Route →',openNow:'Jetzt geöffnet',ratingUnavailable:'Keine Bewertung',whatItsLike:'So ist es:',newVacation:'＋ Neue Reise',newVacationLong:'＋ Neue Reise erstellen',whereNext:'Wohin soll es als Nächstes gehen?',newTripIntro:'Startet mit einem Ziel, das ihr schon kennt, oder lasst den Planer Urlaubsarten vergleichen, die zu eurer Familie passen.',known:'Wir wissen schon, wohin',startPlanning:'Reise planen',helpChoose:'Hilf mir bei der Zielwahl',finderTitle:'Welche Art Urlaub klingt gut?',finderCopy:'Wählt bis zu 3 Prioritäten. Ich vergleiche die gesamte Reise – inklusive Abreiseort, Budget und verfügbarer Zeit.',finderOrigin:'Abreise von',finderBudget:'Budget',finderLength:'Reisedauer',showIdeas:'Ideen anzeigen',finderClimate:'Wettergefühl',finderSetting:'Urlaubsumgebung',finderAny:'Egal',finderHot:'Heiß & sonnig',finderWarm:'Warm / mild',finderCool:'Kühl / frisch',finderCity:'Stadt',finderCoast:'Küste / Insel',finderNature:'Natur / Landschaft',finderMixed:'Von allem etwas',finderNeed:'Wählt mindestens eine Priorität aus.',finderDifferent:'Andere Ideen zeigen',planThis:'Diese Reise planen',previousTrips:'Frühere Reisen',restore:'Reise wiederherstellen'}
};
const ONBOARDING_I18N={
 en:{step:'STEP',oneTitle:'Give this trip a name',oneCopy:'Make it yours — family name, holiday nickname, whatever feels right.',tripName:'Trip / family name',destination:'Where are you going?',homeBase:'Your holiday base',arrival:'Arrival date',departure:'Departure date',nextCrew:'Meet the crew →',twoTitle:'Who’s coming along?',twoCopy:'Tell us who’s travelling and the few details that actually make a difference.',adults:'Adults',children:'Children',notes:'Anything useful to know?',nextStyle:'Vacation style →',threeTitle:'How do you like to holiday?',threeCopy:'No judgement. “Keep it cheap and nearby” and “we flew this far, let’s do it” are both legitimate strategies.',back:'← Back',start:'Start the adventure ✨',skip:'Do this later'},
 es:{step:'PASO',oneTitle:'Ponle nombre al viaje',oneCopy:'Hazlo vuestro: apellido, apodo del viaje o lo que os haga ilusión.',tripName:'Nombre del viaje / familia',destination:'¿Adónde vais?',homeBase:'Alojamiento base',arrival:'Fecha de llegada',departure:'Fecha de salida',nextCrew:'Conocer a la familia →',twoTitle:'¿Quién viene?',twoCopy:'Elige primero cuántos adultos y niños viajan. Prepararemos los perfiles debajo.',adults:'Adultos',children:'Niños',notes:'¿Algo útil que debamos saber?',nextStyle:'Estilo de vacaciones →',threeTitle:'¿Cómo os gusta viajar?',threeCopy:'Sin juicios: ahorrar y quedarse cerca o aprovechar al máximo el viaje son opciones igual de válidas.',back:'← Atrás',start:'Empezar la aventura ✨',skip:'Lo configuraré más tarde'},
 fr:{step:'ÉTAPE',oneTitle:'Donnez un nom à ce voyage',oneCopy:'Nom de famille, petit surnom du séjour… faites-en votre voyage.',tripName:'Nom du voyage / de la famille',destination:'Où allez-vous ?',homeBase:'Votre hébergement',arrival:'Date d’arrivée',departure:'Date de départ',nextCrew:'Présenter la famille →',twoTitle:'Qui vient avec vous ?',twoCopy:'Choisissez d’abord le nombre d’adultes et d’enfants. Les profils seront créés juste dessous.',adults:'Adultes',children:'Enfants',notes:'Quelque chose d’utile à savoir ?',nextStyle:'Style de vacances →',threeTitle:'Comment aimez-vous voyager ?',threeCopy:'Aucun jugement : rester près et économiser ou profiter à fond du voyage sont deux bonnes stratégies.',back:'← Retour',start:'Commencer l’aventure ✨',skip:'Je configurerai plus tard'},
 de:{step:'SCHRITT',oneTitle:'Gebt dieser Reise einen Namen',oneCopy:'Familienname, Urlaubs-Spitzname oder etwas ganz Eigenes.',tripName:'Reise- / Familienname',destination:'Wohin geht es?',homeBase:'Eure Unterkunft',arrival:'Anreisedatum',departure:'Abreisedatum',nextCrew:'Familie hinzufügen →',twoTitle:'Wer kommt mit?',twoCopy:'Wählt zuerst die Anzahl der Erwachsenen und Kinder. Die Profile erscheinen direkt darunter.',adults:'Erwachsene',children:'Kinder',notes:'Gibt es etwas Wichtiges zu wissen?',nextStyle:'Urlaubsstil →',threeTitle:'Wie reist ihr am liebsten?',threeCopy:'Kein Urteil: günstig und nah bleiben oder den Urlaub voll auskosten – beides ist völlig legitim.',back:'← Zurück',start:'Abenteuer starten ✨',skip:'Später einrichten'}
};
function ot(key){return ONBOARDING_I18N[appLanguage()]?.[key]||ONBOARDING_I18N.en[key]||key;}
function detectedLanguage(){const raw=(navigator.languages?.[0]||navigator.language||'en').toLowerCase().split('-')[0];return SUPPORTED_LANGUAGES.includes(raw)?raw:'en';}
function appLanguage(){const saved=localStorage.getItem('ffvp_language')||'auto';return saved==='auto'?detectedLanguage():(SUPPORTED_LANGUAGES.includes(saved)?saved:'en');}
function appLocale(){const lang=appLanguage();if(lang==='en'){const n=(navigator.languages?.[0]||navigator.language||'').toLowerCase();return n.startsWith('en-us')?'en-US':'en-GB';}return LANG_LOCALES[lang]||'en-GB';}
function t(key,fallback=''){return TRANSLATIONS[appLanguage()]?.[key]??TRANSLATIONS.en[key]??fallback??key;}
function languageQuery(){return encodeURIComponent(appLanguage());}
function regionUsesMiles(){const tc=typeof tripContext==='function'?tripContext():null;const region=tc?.before?destinationPreset().region:locationRegion();return ['florida','new-york','anaheim','maui','cheshire','london','manchester','san-diego','yellowstone','cornwall','edinburgh'].includes(region);}
function formatDistance(mi){if(!Number.isFinite(+mi))return '';if(regionUsesMiles()){const v=+mi;return `${v<10?v.toFixed(1):Math.round(v)} mi`;}const km=+mi*1.609344;return `${km<10?km.toFixed(1):Math.round(km)} km`;}


const defaultHeightUnit = () => navigator.language?.toLowerCase().startsWith('en-us') ? 'imperial' : 'metric';
const memberRole = m => m?.role || ((+m?.age||0) < 18 ? 'child' : 'adult');

const heightBandFromInches = inches => {
  const h=+inches||0;
  if(!h)return 'unknown';
  if(h<36)return 'under36';
  if(h<42)return '36to41';
  if(h<48)return '42to47';
  return '48plus';
};
const heightBandFromMember = m => m?.heightBand || heightBandFromInches(m?.height);
const representativeHeightForBand = band => ({under36:34,'36to41':39,'42to47':45,'48plus':50,unknown:0}[band] ?? 0);
const memberInitial = (name='', role='adult', index=0) => {
  const cleaned=String(name).trim();
  if(cleaned){const parts=cleaned.split(/\s+/).filter(Boolean);return (parts.length>1?(parts[0][0]+parts.at(-1)[0]):parts[0][0]).toUpperCase();}
  return role==='child'?`C${index+1}`:`A${index+1}`;
};
const FERDA_AVATAR_PACKS={
  florida:[
    {key:'bobcat',src:'assets/ferda/avatars/avatar_bobcat.webp'},
    {key:'manatee',src:'assets/ferda/avatars/avatar_manatee.webp'},
    {key:'otter',src:'assets/ferda/avatars/avatar_otter.webp'},
    {key:'black-bear',src:'assets/ferda/avatars/avatar_black_bear.webp'},
    {key:'alligator',src:'assets/ferda/avatars/avatar_alligator.webp'},
    {key:'sea-turtle',src:'assets/ferda/avatars/avatar_sea_turtle.webp'},
    {key:'gecko',src:'assets/ferda/avatars/avatar_gecko.webp'},
    {key:'osprey',src:'assets/ferda/avatars/avatar_osprey.webp'}
  ]
};
function memberAvatar(m,index=0,pack='florida'){
  const avatars=FERDA_AVATAR_PACKS[pack]||FERDA_AVATAR_PACKS.florida;
  return avatars.find(a=>a.key===m?.avatarKey)||avatars[index%avatars.length];
}
const defaultMembers = () => [
  {id:crypto.randomUUID?.() || String(Date.now()), name:'Adult 1', age:35, height:68, heightUnit:defaultHeightUnit(), role:'adult', thrill:'medium',avatarKey:'otter'},
  {id:crypto.randomUUID?.() || String(Date.now()+1), name:'Child 1', age:10, height:54, heightUnit:defaultHeightUnit(), role:'child', thrill:'medium',avatarKey:'gecko'}
];
const defaultProfile = {
  familyName:'', homeBase:'', destinationPreset:'orlando', members:defaultMembers(), maxDrive:30, budget:'medium', energy:'medium',
  interests:['rides','food','shopping','beach','indoor'], heatAware:true, notes:'', quickNotes:[], arrivalDate:'', departureDate:'', budgetRemaining:'', walkingTolerance:'medium'
};
const savedProfile = JSON.parse(localStorage.getItem('ffvp_profile') || 'null');
function betaLocalDayStamp(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function loadNowContext(){
  try{const saved=JSON.parse(localStorage.getItem('ffvp_now_context')||'null');if(saved?.day===betaLocalDayStamp())return {...saved,day:betaLocalDayStamp()};}catch(e){}
  return {day:betaLocalDayStamp(),time2:false,cheap:false,lowEnergy:false,drive:false,food:false};
}
const state = {
  coords:null, weather:null,
  unit:localStorage.getItem('ffvp_unit') || (navigator.language?.toLowerCase().includes('us') ? 'f' : 'c'),
  profile:{...defaultProfile, ...(savedProfile || {}), members:(savedProfile?.members?.length ? savedProfile.members : defaultMembers())},
  saved:JSON.parse(localStorage.getItem('ffvp_saved') || '[]'), tripStatuses:JSON.parse(localStorage.getItem('ffvp_trip_statuses') || '{}'), plans:JSON.parse(localStorage.getItem('ffvp_plans') || '[]'),
  discovered:JSON.parse(localStorage.getItem('ffvp_discovered') || '{}'), prepDone:JSON.parse(localStorage.getItem('ffvp_prep_done') || '{}'),
  locationMode:localStorage.getItem('ffvp_test_location') || 'gps', locationName:'', discoveryCategory:'sights', localSeedKey:'', parkSchedules:{}, deferredInstall:null, filter:'all', recommendationRuns:{}, tomorrowMood:localStorage.getItem('ffvp_tomorrow_mood') || null, archives:JSON.parse(localStorage.getItem('ffvp_trip_archive') || '[]'),
  nowContext:loadNowContext(), recommendationFeedback:JSON.parse(localStorage.getItem('ffvp_recommendation_feedback') || '{}'), decisionEvents:JSON.parse(localStorage.getItem('ffvp_decision_events') || '[]'), pendingFeedbackId:null, currentRecommendationContext:null, currentRecommendationStartedAt:0
};
const betaForceOnboarding = () => localStorage.getItem('ffvp_force_onboarding') !== '0';
const betaForceLanding = () => localStorage.getItem('ffvp_force_landing') !== '0';

// FERDA commercial test environment. No payment provider is connected yet.
// The legacy storage keys remain stable so existing beta devices keep their state.
const COMMERCIAL_PLANS={
  explorer:{key:'explorer',name:'Free Trial',price:'Free',freshLimit:20,tripLimit:1,ads:false,fullAccess:false,copy:'Try FERDA on one Orlando trip before deciding whether it belongs on the holiday.'},
  traveller:{key:'traveller',name:'FERDA Full',price:'£8.99 once',freshLimit:1000,tripLimit:Infinity,ads:false,fullAccess:true,copy:'The complete Orlando travel buddy. One payment, no subscription and no display ads.'}
};
function commercialTier(){const k=localStorage.getItem('ffvp_commercial_tier')||'explorer';return k==='pro'?'traveller':(COMMERCIAL_PLANS[k]?k:'explorer');}
function commercialPlan(){return COMMERCIAL_PLANS[commercialTier()];}
function freshUsed(){return Math.max(0,+localStorage.getItem('ffvp_fresh_used')||0);}
function tripUses(){const stored=localStorage.getItem('ffvp_trip_uses');if(stored!=null)return Math.max(0,+stored||0);const initial=localStorage.getItem('ffvp_onboarded')?1:0;localStorage.setItem('ffvp_trip_uses',String(initial));return initial;}
function setCommercialTier(tier,{resetUsage=false}={}){if(!COMMERCIAL_PLANS[tier])tier='explorer';localStorage.setItem('ffvp_commercial_tier',tier);if(resetUsage)localStorage.setItem('ffvp_fresh_used','0');updateCommercialUI();}
function setFreshUsed(n){localStorage.setItem('ffvp_fresh_used',String(Math.max(0,Math.round(+n||0))));updateCommercialUI();}
function freshRemaining(){return Math.max(0,commercialPlan().freshLimit-freshUsed());}
function refundFreshIdea(){if(freshUsed()>0)setFreshUsed(freshUsed()-1);}
function commercialTripLimitReached(){const p=commercialPlan();return Number.isFinite(p.tripLimit)&&tripUses()>=p.tripLimit;}
function openPricing(reason='choice'){
  const d=$('#pricingDialog');if(!d)return;
  const messages={fresh:'Your free trial has used its Fresh Ideas. Everything you saved still works; unlock FERDA once when you are ready for more.',trip:'Your free trial includes one vacation. Your current trip stays exactly as it is.',finder:'Unlock FERDA once for the complete Orlando planning experience.',choice:'Try FERDA first. If it earns its place on the holiday, unlock the complete app with one payment.'};
  $('#pricingReason').textContent=messages[reason]||messages.choice;
  $$('.pricing-card').forEach(c=>c.classList.toggle('current',c.dataset.pricingTier===commercialTier()));
  d.classList.remove('hidden');
}
function closePricing(){$('#pricingDialog')?.classList.add('hidden');}
function consumeFreshIdea(reason='fresh search'){
  const p=commercialPlan();
  if(freshUsed()>=p.freshLimit){openPricing('fresh');showToast('You’re out of Fresh Ideas on this plan — saved plans still work.');return false;}
  setFreshUsed(freshUsed()+1);
  return true;
}
function countTripUse(){localStorage.setItem('ffvp_trip_uses',String(tripUses()+1));updateCommercialUI();}
function updateCommercialUI(){
  const p=commercialPlan(),used=freshUsed(),remaining=Math.max(0,p.freshLimit-used),pct=p.fullAccess?100:Math.max(0,Math.min(100,(remaining/p.freshLimit)*100));
  if($('#commercialTierBadge'))$('#commercialTierBadge').textContent=p.name.toUpperCase();
  if($('#commercialTierTitle'))$('#commercialTierTitle').textContent=`${p.name} · ${p.price}`;
  if($('#commercialTierCopy'))$('#commercialTierCopy').textContent=p.copy;
  if($('#freshIdeasLabel'))$('#freshIdeasLabel').textContent=p.fullAccess?'Full access':`${remaining} of ${p.freshLimit} left`;
  if($('#freshIdeasBar'))$('#freshIdeasBar').style.width=`${pct}%`;
  if($('#freshIdeasCopy'))$('#freshIdeasCopy').textContent=p.fullAccess?'Complete planning access is enabled on this device.':'Only a brand-new nearby search uses one. Reopening saved ideas costs nothing.';
  if($('#tripAllowanceLabel'))$('#tripAllowanceLabel').textContent=Number.isFinite(p.tripLimit)?`${tripUses()} of ${p.tripLimit} used`:'Unlimited trips';
  if($('#adsPlanLabel'))$('#adsPlanLabel').textContent='Always ad-free';
  $('#freeAdSlot')?.classList.toggle('hidden',!p.ads||localStorage.getItem('ffvp_test_ad_hidden')==='1');
  if($('#testCommercialPlan'))$('#testCommercialPlan').value=p.key;
  if($('#testFreshUsed'))$('#testFreshUsed').value=used;
  if($('#testTripUses'))$('#testTripUses').value=tripUses();
}


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
  anaheim:{name:'Anaheim / Orange County',short:'Anaheim',lat:33.8366,lon:-117.9143,region:'anaheim'},
  'new-york':{name:'New York City',short:'New York',lat:40.7580,lon:-73.9855,region:'new-york'},
  'san-diego':{name:'San Diego',short:'San Diego',lat:32.7157,lon:-117.1611,region:'san-diego'},
  nairobi:{name:'Nairobi',short:'Nairobi',lat:-1.2864,lon:36.8172,region:'nairobi'},
  kruger:{name:'Kruger National Park',short:'Kruger',lat:-23.9884,lon:31.5547,region:'kruger'},
  'cape-town':{name:'Cape Town',short:'Cape Town',lat:-33.9249,lon:18.4241,region:'cape-town'},
  'costa-rica':{name:'Costa Rica',short:'Costa Rica',lat:9.7489,lon:-83.7534,region:'costa-rica'},
  maui:{name:'Maui',short:'Maui',lat:20.7984,lon:-156.3319,region:'maui'},
  cancun:{name:'Cancún / Riviera Maya',short:'Cancún',lat:21.1619,lon:-86.8515,region:'cancun'},
  bali:{name:'Bali',short:'Bali',lat:-8.4095,lon:115.1889,region:'bali'},
  phuket:{name:'Phuket',short:'Phuket',lat:7.8804,lon:98.3923,region:'phuket'},
  tenerife:{name:'Tenerife',short:'Tenerife',lat:28.2916,lon:-16.6291,region:'tenerife'},
  mallorca:{name:'Mallorca',short:'Mallorca',lat:39.6953,lon:3.0176,region:'mallorca'},
  algarve:{name:'The Algarve',short:'Algarve',lat:37.0179,lon:-7.9304,region:'algarve'},
  cornwall:{name:'Cornwall',short:'Cornwall',lat:50.2660,lon:-5.0527,region:'cornwall'},
  barcelona:{name:'Barcelona',short:'Barcelona',lat:41.3874,lon:2.1686,region:'barcelona'},
  lisbon:{name:'Lisbon',short:'Lisbon',lat:38.7223,lon:-9.1393,region:'lisbon'},
  rome:{name:'Rome',short:'Rome',lat:41.9028,lon:12.4964,region:'rome'},
  paris:{name:'Paris',short:'Paris',lat:48.8566,lon:2.3522,region:'paris'},
  london:{name:'London',short:'London',lat:51.5074,lon:-0.1278,region:'london'},
  amsterdam:{name:'Amsterdam',short:'Amsterdam',lat:52.3676,lon:4.9041,region:'amsterdam'},
  copenhagen:{name:'Copenhagen',short:'Copenhagen',lat:55.6761,lon:12.5683,region:'copenhagen'},
  edinburgh:{name:'Edinburgh',short:'Edinburgh',lat:55.9533,lon:-3.1883,region:'edinburgh'},
  dubai:{name:'Dubai',short:'Dubai',lat:25.2048,lon:55.2708,region:'dubai'},
  singapore:{name:'Singapore',short:'Singapore',lat:1.3521,lon:103.8198,region:'singapore'},
  tokyo:{name:'Tokyo',short:'Tokyo',lat:35.6762,lon:139.6503,region:'tokyo'},
  kyoto:{name:'Kyoto',short:'Kyoto',lat:35.0116,lon:135.7681,region:'kyoto'},
  bangkok:{name:'Bangkok',short:'Bangkok',lat:13.7563,lon:100.5018,region:'bangkok'},
  iceland:{name:'Iceland',short:'Iceland',lat:64.9631,lon:-19.0208,region:'iceland'},
  'swiss-alps':{name:'Swiss Alps',short:'Swiss Alps',lat:46.5591,lon:8.5616,region:'swiss-alps'},
  'lake-garda':{name:'Lake Garda',short:'Lake Garda',lat:45.6049,lon:10.6351,region:'lake-garda'},
  yellowstone:{name:'Yellowstone National Park',short:'Yellowstone',lat:44.4280,lon:-110.5885,region:'yellowstone'},
  winsford:{name:'Winsford / Cheshire',short:'Cheshire',lat:53.1914,lon:-2.5234,region:'cheshire'},
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

const specialistModules={
  florida:{label:'Parks',icon:'◉',kind:'parks-live',category:'thrills',eyebrow:'PARK INTELLIGENCE'},
  anaheim:{label:'Parks',icon:'◉',kind:'discover',category:'thrills',eyebrow:'THEME PARKS & THRILLS',title:'Parks and big-energy experiences',copy:'Theme parks lead here, backed up by other high-energy family attractions within your travel range.'},
  nairobi:{label:'Wildlife',icon:'◈',kind:'discover',category:'wildlife',eyebrow:'WILDLIFE & SAFARI',title:'Wildlife worth making time for',copy:'Safari, wildlife, zoo and reserve experiences become the specialist lens for this destination.'},
  'new-york':{label:'Sights',icon:'◆',kind:'discover',category:'sights',eyebrow:'CITY SIGHTS',title:'New York sights worth your time',copy:'Landmarks, viewpoints and visitor experiences that make sense around the city.'},
  london:{label:'Sights',icon:'◆',kind:'discover',category:'sights',eyebrow:'CITY SIGHTS',title:'London sights worth your time',copy:'Landmarks, viewpoints and visitor experiences that make sense around the city.'},
  paris:{label:'Highlights',icon:'✦',kind:'discover',category:'sights',eyebrow:'PARIS HIGHLIGHTS',title:'Paris highlights worth planning around',copy:'Landmarks and visitor experiences that deserve a place on a Paris trip rather than a generic attraction list.'},
  maui:{label:'Beaches',icon:'≈',kind:'discover',category:'beaches',eyebrow:'BEACHES & COAST',title:'Beach and coast options',copy:'Visitor-friendly beaches near your base, weighted by travel range so the coast feels useful rather than generic.'},
  cheshire:{label:'Days Out',icon:'◇',kind:'discover',category:'sights',eyebrow:'FAMILY DAYS OUT',title:'Family days out nearby',copy:'Visitor attractions and local highlights that make sense as an actual family day out.'},
  manchester:{label:'Days Out',icon:'◇',kind:'discover',category:'sights',eyebrow:'FAMILY DAYS OUT',title:'Family days out nearby',copy:'Visitor attractions and local highlights that make sense as an actual family day out.'},
  local:{label:'Discover',icon:'⌕',kind:'discover',category:'sights',eyebrow:'DESTINATION DISCOVERY',title:'What is special around here?',copy:'A destination-neutral discovery view until the app has enough confidence to activate a specialist module.'}
};
function specialistContextRegion(){
  const t=tripContext?.();
  if(t?.before)return destinationPreset().region;
  return locationRegion();
}
const specialistTemplates={
  parks:{label:'Parks',icon:'◉',kind:'discover',category:'thrills',eyebrow:'THEME PARKS & THRILLS',title:'Parks and big-energy experiences',copy:'Theme parks and high-energy family attractions that make sense for this destination.'},
  wildlife:{label:'Wildlife',icon:'◈',kind:'discover',category:'wildlife',eyebrow:'WILDLIFE & NATURE',title:'Wildlife worth making time for',copy:'Visitor-friendly wildlife, reserve and animal experiences around this destination.'},
  sights:{label:'Sights',icon:'◆',kind:'discover',category:'sights',eyebrow:'DESTINATION SIGHTS',title:'Sights worth your time',copy:'Landmarks and visitor experiences that help define the destination.'},
  beaches:{label:'Beaches',icon:'≈',kind:'discover',category:'beaches',eyebrow:'BEACHES & COAST',title:'Beach and coast options',copy:'Visitor-friendly beach and coast options, weighted by travel range.'},
  outdoors:{label:'Discover',icon:'◇',kind:'discover',category:'outdoors',eyebrow:'OUTDOORS & NATURE',title:'Outdoor experiences worth exploring',copy:'Nature, scenery and outdoor experiences that fit the destination.'}
};
function specialistModule(){
  const region=specialistContextRegion();
  if(specialistModules[region])return specialistModules[region];
  const key=(tripContext?.()?.before||state.locationMode==='gps')?state.profile.destinationPreset:state.locationMode;
  const specialist=typeof destinationFinderProfiles!=='undefined'?destinationFinderProfiles[key]?.specialist:null;
  return specialistTemplates[specialist]||specialistModules.local;
}
function specialistTranslatedLabel(m){const key={Parks:'parks',Wildlife:'wildlife',Sights:'sights',Highlights:'highlights',Beaches:'beaches','Days Out':'daysOut',Discover:'discover'}[m.label];return key?t(key,m.label):m.label;}
function renderSpecialistNav(){
  const m=specialistModule(),label=$('#parksNavLabel'),icon=$('#specialistNavIcon');
  if(label)label.textContent=specialistTranslatedLabel(m);if(icon)icon.textContent=m.icon;
}
function openSpecialistModule(){
  const m=specialistModule();
  if(m.kind==='parks-live'){setView('parks');return;}
  loadDiscover(m.category,{specialist:true});
}

function localizeQuickConfig(cfg){
  if(appLanguage()==='en')return cfg;
  const labels={stayin:['chill','Slow pace and recovery'],chill:['chill','Slow pace and recovery'],indoor:['indoor','Weather-proof ideas'],food:['food','Meals and treats'],outdoors:['outdoors','Nature and open-air ideas'],thrills:['thrills','High-energy experiences'],shopping:['shopping','Markets, malls and browsing'],sights:['sights','The destination highlights']};
  return {...cfg,title:t('quickTitle'),copy:t('quickCopy'),items:cfg.items.map(item=>{const k=labels[item[0]]||labels.sights;return [item[0],t(k[0],item[1]),k[1]];})};
}
function updateDistanceOptionLabels(){
  const useMiles=regionUsesMiles();
  const labels={15:useMiles?'About 15 miles':'About 24 km',30:useMiles?'About 30 miles':'About 48 km',60:useMiles?'About 60 miles':'About 97 km',100:useMiles?'Up to 100 miles':'Up to 161 km'};
  ['#maxDrive','#setupMaxDrive'].forEach(sel=>{const el=$(sel);if(!el)return;[...el.options].forEach(o=>{if(labels[o.value])o.textContent=labels[o.value];});});
}
function applyTranslations(){
  document.documentElement.lang=appLanguage();
  const map={navTodayLabel:'today',navExploreLabel:'explore',navTripLabel:'trip',navFamilyLabel:'family',languageSettingTitle:'language',languageSettingCopy:'languageCopy',newTripBtn:'newVacation',newTripBtnFamily:'newVacationLong',newTripTitle:'whereNext',newTripIntro:'newTripIntro',knownDestinationLabel:'known',startKnownTrip:'startPlanning',openDestinationFinder:'helpChoose',finderTitle:'finderTitle',finderCopy:'finderCopy',findDestinations:'showIdeas',finderOriginLabel:'finderOrigin',finderBudgetLabel:'finderBudget',finderLengthLabel:'finderLength',finderClimateLabel:'finderClimate',finderSettingLabel:'finderSetting'};
  Object.entries(map).forEach(([id,key])=>{const el=$('#'+id);if(el)el.textContent=t(key,el.textContent);});
  const languageSelect=$('#languageSelect'),setupLanguage=$('#setupLanguage');
  const saved=localStorage.getItem('ffvp_language')||'auto';if(languageSelect)languageSelect.value=saved;if(setupLanguage)setupLanguage.value=saved;
  if($('#setupLanguageLabel'))$('#setupLanguageLabel').textContent=t('language');
  if($('#setupLanguageHelp'))$('#setupLanguageHelp').textContent=t('languageCopy');
  const steps=$$('.setup-step');
  if(steps[0]){const labels=$$('.field-label',steps[0]);$('h3',steps[0]).textContent=ot('oneTitle');$('.step-copy',steps[0]).textContent=ot('oneCopy');if(labels[0])labels[0].textContent=ot('tripName');if(labels[1])labels[1].textContent=ot('destination');if(labels[3])labels[3].textContent=ot('homeBase');if(labels[4])labels[4].textContent=ot('arrival');if(labels[5])labels[5].textContent=ot('departure');$('.setup-next',steps[0]).textContent=ot('nextCrew');}
  if(steps[1]){$('h3',steps[1]).textContent=ot('twoTitle');$('.step-copy',steps[1]).textContent=ot('twoCopy');const cc=$$('.crew-count-label',steps[1]);if(cc[0])cc[0].textContent=ot('adults');if(cc[1])cc[1].textContent=ot('children');const noteLabel=$('.field-group .field-label',steps[1]);if(noteLabel)noteLabel.textContent=ot('notes');const next=$('.setup-next',steps[1]);if(next)next.textContent=ot('nextStyle');const back=$('.setup-back',steps[1]);if(back)back.textContent=ot('back');}
  if(steps[2]){$('h3',steps[2]).textContent=ot('threeTitle');$('.step-copy',steps[2]).textContent=ot('threeCopy');const back=$('.setup-back',steps[2]);if(back)back.textContent=ot('back');const submit=$('button[type=submit]',steps[2]);if(submit)submit.textContent=ot('start');}
  if($('#skipSetup'))$('#skipSetup').textContent=ot('skip');
  $$('.finder-chip').forEach(b=>{const key={thrills:'thrills',wildlife:'wildlife',beach:'beaches',sights:'sights',outdoors:'outdoors',food:'food',shopping:'shopping',chill:'chill'}[b.dataset.destMood];if(key)b.textContent=t(key,b.textContent);});
  const hasSaved=!!localStorage.getItem('ffvp_onboarded');if($('#landingPrimary'))$('#landingPrimary').textContent=hasSaved?t('landingNew'):t('landingStart');if($('#landingContinue'))$('#landingContinue').textContent=t('landingContinue');
  updateDistanceOptionLabels();renderSpecialistNav();
}
function setAppLanguage(value){localStorage.setItem('ffvp_language',value||'auto');applyTranslations();renderQuickMoods();renderTripHub();if(state.discoveryCategory&&$('.view[data-view="discover"]')?.classList.contains('active'))loadDiscover(state.discoveryCategory,{specialist:!!state.discoverySpecialist});}


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
  outdoors:new Set(['park','city_park','state_park','national_park','botanical_garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','scenic_spot']),
  indoor:new Set(['museum','art_museum','history_museum','aquarium','art_gallery','movie_theater','bowling_alley','indoor_playground','planetarium','performing_arts_theater','cultural_center']),
  thrills:new Set(['amusement_park','water_park','adventure_sports_center','go_karting_venue','miniature_golf_course','amusement_center','ferris_wheel','roller_coaster','off_roading_area','paintball_center','video_arcade'])
};
const practicalShoppingTypes=new Set(['supermarket','grocery_store','discount_supermarket','hypermarket','warehouse_store','convenience_store','food_store','general_store','discount_store']);
const strongOutdoorVisitorTypes=new Set(['city_park','state_park','national_park','botanical_garden','hiking_area','zoo','wildlife_park','wildlife_refuge','nature_preserve','playground','picnic_ground','cycling_park','scenic_spot']);
const businessishOutdoorName=/\b(landscap(?:e|ing)?|lawn|maintenance|property|properties|realty|realtor|residential|hoa|homeowners|association|services?|solutions?|contractor|nursery|garden\s*center|clubhouse|apartments?|condo|ministry|church|school|academy)\b/i;
const publicOutdoorName=/\b(park|parks|garden|gardens|botanical|arboretum|preserve|reserve|trail|trails|greenway|nature|wildlife|zoo|playground|recreation|recreational|forest|woods|scenic|viewpoint)\b/i;
function discoveredVisitorExperienceAllowed(a){
  if(!a?.discovered)return true;
  const type=normalizedPlaceType(a.placeType);
  if(a.sourceCategory!=='outdoors')return true;
  if(businessishOutdoorName.test(String(a.name||'')))return false;
  if(strongOutdoorVisitorTypes.has(type))return true;
  if(type==='park')return publicOutdoorName.test(String(a.name||''))||(+a.ratingCount||0)>=75;
  return false;
}
function normalizedPlaceType(v){return String(v||'').toLowerCase().trim().replaceAll(' ','_');}
function discoveredTypeSet(a){return new Set([normalizedPlaceType(a?.placeType),...((a?.placeTypes||[]).map(normalizedPlaceType))].filter(Boolean));}
function primaryMoodForPlace(a){
  if(!a)return null;
  if(a.category==='stayin'||a.category==='beach')return 'chill';
  if(a.category==='food')return 'food';
  if(a.category==='park')return 'thrills';
  if(a.discovered){
    if(!discoveredVisitorExperienceAllowed(a))return null;
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
  london:{title:'What are you in the mood for?',copy:'City ideas that fit how far you’re happy to go.',items:[
    ['stayin','Chill & Recharge','Hotel reset or a slower local wander'],['indoor','Indoor & Easy','Museums, galleries & shows'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, river walks & open-air sights'],['thrills','Thrills & Excitement','Views, rides & high-energy experiences'],['shopping','Shop & Browse','Markets, high streets & malls']
  ]},
  paris:{title:'What are you in the mood for?',copy:'The same moods, translated into what makes sense around Paris.',items:[
    ['stayin','Chill & Recharge','Hotel reset or a slower café break'],['indoor','Indoor & Easy','Museums, galleries & covered ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, river walks & open-air sights'],['thrills','Thrills & Excitement','Big attractions & energetic experiences'],['shopping','Shop & Browse','Markets, boutiques & shopping centres']
  ]},
  nairobi:{title:'What are you in the mood for?',copy:'Wildlife and outdoor experiences matter more here, so the mix shifts with the destination.',items:[
    ['stayin','Chill & Recharge','Hotel or lodge reset and a slower pace'],['indoor','Indoor & Easy','Museums and weather-proof options'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Nature, parks and open-air experiences'],['thrills','Thrills & Excitement','Adventure and energetic experiences'],['shopping','Shop & Browse','Markets, malls and local shopping']
  ]},
  anaheim:{title:'What are you in the mood for?',copy:'Theme-park country, but the mood still comes first.',items:[
    ['stayin','Chill & Recharge','Pool, hotel or easy reset'],['indoor','Indoor & Easy','Weather-proof family ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks and outdoor escapes'],['thrills','Thrills & Excitement','Theme parks, rides and high-energy fun'],['shopping','Shop & Browse','Malls, outlets and retail']
  ]},
  maui:{title:'What are you in the mood for?',copy:'Island time changes the mix — coast, nature and slower days deserve more weight.',items:[
    ['stayin','Chill & Recharge','Resort, pool or beach reset'],['indoor','Indoor & Easy','Lower-effort weather-proof ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Nature, coast and scenic exploring'],['thrills','Thrills & Excitement','Water and adventure experiences'],['shopping','Shop & Browse','Markets, shops and local finds']
  ]},
  manchester:{title:'What are you in the mood for?',copy:'Urban and regional family ideas within the range you choose.',items:[
    ['stayin','Chill & Recharge','Keep it easy and local'],['indoor','Indoor & Easy','Museums, play & weather-proof ideas'],['food','Food & Treats','Nearby ratings + family spend'],['outdoors','Outdoors & Explore','Parks, trails & outdoor ideas'],['thrills','Thrills & Excitement','Karting, adventure & big-energy fun'],['shopping','Shop & Browse','City centre, markets & malls']
  ]},
  local:{title:'What are you in the mood for?',copy:'Pick a vibe and we’ll see what’s genuinely worth doing nearby.',items:[
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
      copy:`Have a browse around ${dest.name}. Save anything that makes you think “yes, definitely that.”`,
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
    if(h<5){cfg={...cfg,title:'Planning later today?',copy:'Choose the kind of day you fancy when everyone wakes up — we’ll line up some good options nearby.'};}
    else if(h>=22){cfg={...cfg,title:'Thinking ahead to tomorrow?',copy:'Pick the vibe for tomorrow now, or leave it until morning. No need to squeeze another big plan into tonight.'};}
    else if(stage==='final-days'){cfg={...cfg,title:'A few days left — what still feels worth doing?',copy:'Pick the mood and we’ll focus on the things still worth making time for.'};}
    else if(stage==='early'){cfg={...cfg,title:'What are you in the mood for?',copy:'The trip is still young — choose the kind of day that fits the crew rather than trying to tick everything off at once.'};}
  }
  cfg=localizeQuickConfig(cfg);
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
  renderSpecialistNav();
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
  if([61,63,65,66,67,80,81,82].includes(code))return ['Rain','🌧']; if([71,73,75,77,85,86].includes(code))return ['Snow','🌨']; if([95,96,99].includes(code))return ['Thunderstorms','⛈']; return ['Mixed weather','🌤'];
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
const smallerVisitors=()=>childMembers().filter(m=>{const band=heightBandFromMember(m);return (+m.age||0)<8 || (band!=='unknown' && band!=='48plus') || (band==='unknown' && (+m.height||999)<48);});
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
  if(!t)return 'Add your vacation dates and we’ll keep the pace sensible for the trip.';
  const stage=holidayStage(t);
  if(stage==='departure')return 'Departure day — keep it light, nearby and easy to change if travel timings move.';
  if(stage==='final-days')return `Only ${t.fullDaysRemaining} full day${t.fullDaysRemaining===1?'':'s'} left after today — enough time for a few favourites without running everyone into the ground.`;
  if(stage==='early')return 'You’ve got plenty of holiday left — no need to cram everything into today.';
  if(stage==='middle')return 'You’re properly into the trip now — worth mixing the must-dos with an easier day here and there.';
  if(stage==='later')return `${t.fullDaysRemaining} full day${t.fullDaysRemaining===1?'':'s'} left after today — worth checking what you’d kick yourself for missing.`;
  return 'We’ll keep things paced around the time you have left.';
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
  if(!t){title.textContent='Add your vacation dates';copy.textContent='That lets the app keep the countdown, prep and daily pace in step with your holiday.';renderPrep();return;}
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
  else{if(title)title.textContent=family?`${part}, ${family}`:part;if(copy)copy.textContent=t?.inTrip?`Day ${t.index} of ${t.total}. ${tripStageLine(t)}`:'Let’s see what looks good for your crew.';}
  updateTripPulse();refreshDecisionCard();renderQuickMoods();
}
function mapsSearch(q){window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q+' near me')}`,'_blank','noopener');}

function setView(name){
  if(name==='specialist'){openSpecialistModule();return;}
  if(name==='parks'&&!isFloridaContext()){openSpecialistModule();return;}
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  $$('.nav-item').forEach(n=>n.classList.toggle('active',name==='parks'?n.dataset.target==='specialist':n.dataset.target===name));
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='explore')renderExplore(); if(name==='saved')renderTripHub(); if(name==='parks'&&!$('#parksList').children.length)loadParks();
  if(name==='essentials')renderEssentials(); if(name==='food')loadFood(); if(name==='stayin')renderStayIn(); if(name==='family')loadProfileForm(); if(name==='tomorrow-planner')renderTomorrowPlannerContext();
}
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.target==='specialist'){openSpecialistModule();return;}setView(b.dataset.target);}));
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.back)));
function applyPresetLocation(key,{persist=true}={}){
  const p=presetFor(key);if(!p)return false;state.locationMode=key;state.coords={lat:p.lat,lon:p.lon};state.locationName=p.name;if(persist){localStorage.setItem('ffvp_test_location',key);$('#testLocationSelect').value=key;}$('#locationLabel').textContent=`Testing from ${p.name}`;loadWeather();renderExplore();renderQuickMoods();renderSpecialistNav();if($('.nav-item[data-target="specialist"]')?.classList.contains('active'))openSpecialistModule();return true;
}
async function requestLocation(){
  if(state.locationMode!=='gps'&&applyPresetLocation(state.locationMode,{persist:false}))return;
  $('#locationLabel').textContent='Finding your location…';state.locationMode='gps';$('#testLocationSelect').value='gps';localStorage.setItem('ffvp_test_location','gps');
  if(!navigator.geolocation){const d=destinationPreset();state.coords={lat:d.lat,lon:d.lon};state.locationName=d.name;$('#locationLabel').textContent=`Location unavailable — previewing ${d.name}`;loadWeather();renderQuickMoods();renderSpecialistNav();return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    state.coords={lat:pos.coords.latitude,lon:pos.coords.longitude};state.locationName='Near you'; $('#locationLabel').textContent='Using your current location'; await loadWeather(); renderExplore();renderQuickMoods();renderSpecialistNav();
  },()=>{const d=destinationPreset();state.coords={lat:d.lat,lon:d.lon};state.locationName=d.name;$('#locationLabel').textContent=`Location off — previewing ${d.name}`;loadWeather();renderExplore();renderQuickMoods();renderSpecialistNav();},{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
}
$('#refreshLocation').addEventListener('click',requestLocation);
$('#testLocationSelect').addEventListener('change',e=>{const key=e.target.value;if(key==='gps'){state.locationMode='gps';localStorage.setItem('ffvp_test_location','gps');requestLocation();}else applyPresetLocation(key);});
function previewDestination(){const key=state.profile.destinationPreset||'orlando';applyPresetLocation(key);showToast(`Previewing ${destinationPreset().name}`);}
$('#previewDestinationBtn').addEventListener('click',previewDestination);

let weatherRefreshTimer=null;
async function loadWeather({silent=false}={}){
  if(!state.coords)return; const {lat,lon}=state.coords;
  if(!silent){const card=$('#weatherCard');if(card&&!state.weather)card.classList.add('weather-loading');}
  try{
    const r=await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,{headers:{'Accept':'application/json'}});
    if(!r.ok)throw new Error(`Weather ${r.status}`);
    state.weather=await r.json();renderWeather();
  }catch(e){
    const card=$('#weatherCard');if(!state.weather&&card){card.className='hero-card weather-card weather-error'+(tripContext()?.before?' countdown-hidden':'');card.innerHTML='<b>Weather is taking a break.</b><p style="color:#d7e7e4;margin-top:8px">Everything else still works — we’ll try the forecast again shortly.</p>';}
  }
}
function formatWeatherHour(iso){
  if(!iso)return ''; const m=String(iso).match(/T(\d{2}):(\d{2})/);if(!m)return '';
  const d=new Date(2000,0,1,+m[1],+m[2]);return d.toLocaleTimeString(appLocale(),{hour:'numeric',minute:m[2]==='00'?undefined:'2-digit'});
}
function currentWeatherIndex(w){
  const times=w.hourly?.time||[],now=String(w.current?.time||'');if(!times.length)return 0;
  const i=times.findIndex(t=>String(t)>=now);return i<0?Math.max(0,times.length-1):i;
}
function rainWindow(w,hours=12){
  const times=w.hourly?.time||[],probs=w.hourly?.precipitation_probability||[];if(!times.length)return null;
  const start=currentWeatherIndex(w),end=Math.min(times.length,start+hours);let best=start,bestP=-1;
  for(let i=start;i<end;i++){const p=Number(probs[i]||0);if(p>bestP){bestP=p;best=i;}}
  if(bestP<20)return {prob:bestP,label:`low next ${hours}h`};
  let lo=best,hi=best;while(lo>start&&Number(probs[lo-1]||0)>=Math.max(35,bestP-15))lo--;while(hi<end-1&&Number(probs[hi+1]||0)>=Math.max(35,bestP-15))hi++;
  return {prob:bestP,label:`${formatWeatherHour(times[lo])}–${formatWeatherHour(times[hi+1]||times[hi])}`};
}
function weatherWindowForDay(w,dayIndex=0){
  const day=w.daily?.time?.[dayIndex];if(!day)return null;const times=w.hourly?.time||[],probs=w.hourly?.precipitation_probability||[],feels=w.hourly?.apparent_temperature||w.hourly?.temperature_2m||[],codes=w.hourly?.weather_code||[];
  const candidates=[];for(let i=0;i<times.length;i++){if(!String(times[i]).startsWith(day+'T'))continue;const hour=+(String(times[i]).slice(11,13));if(hour<8||hour>19)continue;candidates.push(i);}if(candidates.length<3)return null;
  let best=null;for(let j=0;j<=candidates.length-3;j++){const inds=candidates.slice(j,j+3);const avgRain=inds.reduce((a,i)=>a+Number(probs[i]||0),0)/inds.length;const avgFeels=inds.reduce((a,i)=>a+Number(feels[i]||0),0)/inds.length;const storm=inds.some(i=>[95,96,99].includes(Number(codes[i])));const heatPenalty=Math.max(0,avgFeels-31)*4;const score=avgRain+heatPenalty+(storm?80:0);if(!best||score<best.score)best={score,avgRain,avgFeels,start:times[inds[0]],end:times[inds[inds.length-1]],storm};}
  if(!best)return null;return {...best,label:`${formatWeatherHour(best.start)}–${formatWeatherHour(best.end)}`};
}
function weatherTheme(code,isDay=1){if(!isDay)return 'weather-night';if([95,96,99].includes(code))return 'weather-storm';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return 'weather-rain';if([1,2,3,45,48].includes(code))return 'weather-cloudy';return 'weather-sunny';}
function hourlyWeatherCards(w,count=6){
  const times=w.hourly?.time||[],temps=w.hourly?.temperature_2m||[],probs=w.hourly?.precipitation_probability||[],codes=w.hourly?.weather_code||[],day=w.hourly?.is_day||[],start=currentWeatherIndex(w),end=Math.min(times.length,start+count);
  return times.slice(start,end).map((t,j)=>{const i=start+j,[,baseIcon]=weatherCode(Number(codes[i])),icon=!Number(day[i]??1)&&[0,1,2].includes(Number(codes[i]))?'🌙':baseIcon;return `<div class="weather-hour"><span>${j===0?'Now':formatWeatherHour(t)}</span><i>${icon}</i><b>${temp(Number(temps[i]||0))}</b><small>${Math.round(Number(probs[i]||0))}% rain</small></div>`;}).join('');
}
function renderWeather(){
  const w=state.weather;if(!w)return;const c=w.current||{},d=w.daily||{},[summary,baseIcon]=weatherCode(Number(c.weather_code)),isDay=Number(c.is_day??1),icon=!isDay&&[0,1,2].includes(Number(c.weather_code))?'🌙':baseIcon,maxRain=Number(d.precipitation_probability_max?.[0]||0),rain=rainWindow(w),best=weatherWindowForDay(w,0),uv=Number(d.uv_index_max?.[0]||0),wind=Number(c.wind_speed_10m||0),gust=Number(c.wind_gusts_10m||0);
  const rainText=rain&&rain.prob>=20?`${Math.round(rain.prob)}% · ${rain.label}`:`${Math.round(maxRain)}% · looking low`;
  let alert=best&&best.avgRain<35?`Best outdoor spell looks like ${best.label}.`:'Weather looks usable for a mixed day.';
  if(rain&&rain.prob>=55)alert=`Rain/storm risk is highest around ${rain.label}. Indoor ideas get a boost then.`;
  if([95,96,99].includes(Number(c.weather_code)))alert='Thunderstorms nearby now — stay out of pools and exposed outdoor areas.';
  else if(Number(c.apparent_temperature)>=34)alert=`It feels hot. ${best?`The easier outdoor window looks like ${best.label}.`:'Keep outdoor spells shorter and build in air-con.'}`;
  else if(uv>=8)alert=`UV is very high today${best?`; ${best.label} looks the kinder outdoor window`:''}. Shade and sunscreen matter.`;
  if(gust>=45)alert='It is gusty enough to affect exposed outdoor plans — worth keeping a backup handy.';
  const tc=tripContext(),dest=destinationPreset(),nearDest=state.coords&&miles(haversine(state.coords.lat,state.coords.lon,dest.lat,dest.lon))<50;if(tc?.before&&nearDest&&daysUntilArrival(tc)>2)alert=`These are current conditions around ${dest.short}; your useful trip forecast will appear as you get closer.`;
  const card=$('#weatherCard'),theme=weatherTheme(Number(c.weather_code),isDay);card.className=`hero-card weather-card ${theme}${tripContext()?.before?' countdown-hidden':''}`;
  card.innerHTML=`<div class="weather-ambient" aria-hidden="true"><span></span><span></span><span></span></div><div class="weather-top"><div><div class="weather-place">RIGHT NOW · ${formatWeatherHour(c.time)}</div><div class="weather-temp">${bothTemp(Number(c.temperature_2m||0))}</div><div class="weather-summary">${summary} · feels ${bothTemp(Number(c.apparent_temperature||c.temperature_2m||0))}</div></div><div class="weather-icon" aria-hidden="true">${icon}</div></div><div class="weather-grid"><div class="weather-stat"><small>High</small><b>${bothTemp(Number(d.temperature_2m_max?.[0]||0))}</b></div><div class="weather-stat"><small>Low</small><b>${bothTemp(Number(d.temperature_2m_min?.[0]||0))}</b></div><div class="weather-stat"><small>Rain risk</small><b>${rainText}</b></div></div><div class="weather-alert">${escapeHtml(alert)}</div><details class="weather-details"><summary>Next few hours <span>›</span></summary><div class="weather-hours">${hourlyWeatherCards(w,6)}</div><div class="weather-extra"><span>Wind ${Math.round(wind)} km/h${gust?` · gusts ${Math.round(gust)}`:''}</span><span>${uv?`UV ${Math.round(uv)}`:''}</span></div></details><div class="weather-source">Forecast by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · refreshes automatically</div>`;
}

const stayHomeRecommendation = {
  id:'stay-home', name:'Stay in & reset', icon:'🏠', category:'stayin', tags:['indoor'], cost:1, energy:0,
  note:'Keep the evening easy at your villa / hotel — food in, pool only if conditions are safe, games, films or tomorrow planning.',
  internalView:'stayin', transient:true, minVisit:30
};



function saveNowContext(){state.nowContext.day=betaLocalDayStamp();localStorage.setItem('ffvp_now_context',JSON.stringify(state.nowContext));renderNowContext();}
function activeNowContext(){if(state.nowContext.day!==betaLocalDayStamp())state.nowContext=loadNowContext();return state.nowContext;}
function renderNowContext(){
  const c=activeNowContext();$$('.now-context-chip').forEach(b=>{const on=!!c[b.dataset.nowContext];b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  const any=['time2','cheap','lowEnergy','drive','food'].some(k=>c[k]);$('#clearNowContext')?.classList.toggle('hidden',!any);
}
function nowContextSummary(){
  const c=activeNowContext(),parts=[];if(c.time2)parts.push('about 2 hours');if(c.cheap)parts.push('keep it cheap');if(c.lowEnergy)parts.push('low energy');if(c.drive)parts.push('happy to drive');if(c.food)parts.push('food needed');return parts;
}
function saveRecommendationFeedback(){localStorage.setItem('ffvp_recommendation_feedback',JSON.stringify(state.recommendationFeedback));}
function saveDecisionEvents(){state.decisionEvents=state.decisionEvents.slice(-500);localStorage.setItem('ffvp_decision_events',JSON.stringify(state.decisionEvents));renderDecisionMetrics();}
function trackDecisionEvent(type,props={}){state.decisionEvents.push({type,at:new Date().toISOString(),day:betaLocalDayStamp(),destination:state.profile.destinationPreset||'',...props});saveDecisionEvents();}
function feedbackFor(id){return state.recommendationFeedback[id]||{};}
function feedbackSignature(a){return {mood:primaryMoodForPlace(a)||a.category||'',category:a.category||'',placeType:normalizedPlaceType(a.placeType),familyStyle:a.familyStyle||''};}
function feedbackReasonLabel(reason){return ({too_expensive:'Too expensive',too_far:'Too far away',too_tiring:'Too tiring',not_interested:'Not interested',already_done:'Already done it',group_mismatch:'Doesn’t suit the group',wrong_type:'Wrong kind of thing',other:'Something else'})[reason]||reason;}
function learnedRecommendationAdjustment(a){
  let adjust=0;const reasons=[],sig=feedbackSignature(a),items=Object.values(state.recommendationFeedback||{}).filter(f=>f?.dismissed&&f.reason);
  const count=r=>items.filter(f=>f.reason===r).length;
  const expensive=count('too_expensive');if(expensive&&a.cost>=2){adjust-=Math.min(28,expensive*(a.cost===3?10:6));if(expensive>=2)reasons.push('we’re keeping spend tighter');}
  const far=count('too_far'),d=distMiles(a);if(far&&d!=null&&d>12){adjust-=Math.min(28,far*Math.min(10,d/4));if(far>=2)reasons.push('closer options suit this trip better');}
  const tiring=count('too_tiring');if(tiring&&(a.energy>=2||['park','beach'].includes(a.category))){adjust-=Math.min(28,tiring*8);if(tiring>=2)reasons.push('lighter options have worked better');}
  const group=count('group_mismatch');if(group&&a.familyStyle&&items.some(f=>f.reason==='group_mismatch'&&f.signature?.familyStyle===a.familyStyle)){adjust-=Math.min(24,group*8);}
  const taste=items.filter(f=>['not_interested','wrong_type'].includes(f.reason));const sameTaste=taste.filter(f=>(f.signature?.mood&&f.signature.mood===sig.mood)||(f.signature?.placeType&&f.signature.placeType===sig.placeType)).length;if(sameTaste){adjust-=Math.min(32,sameTaste*10);if(sameTaste>=2)reasons.push('similar ideas have been ruled out');}
  return {adjust,reasons};
}
function renderDecisionMetrics(){
  const sets=state.decisionEvents.filter(e=>e.type==='recommendations_generated').length,accepted=state.decisionEvents.filter(e=>e.type==='recommendation_accepted').length,rejected=state.decisionEvents.filter(e=>e.type==='recommendation_rejected').length,decisions=accepted+rejected;
  if($('#metricRecommendationSets'))$('#metricRecommendationSets').textContent=String(sets);if($('#metricAccepted'))$('#metricAccepted').textContent=String(accepted);if($('#metricAcceptance'))$('#metricAcceptance').textContent=decisions?`${Math.round(accepted/decisions*100)}%`:'—';
  const counts={};state.decisionEvents.filter(e=>e.type==='recommendation_rejected'&&e.reason).forEach(e=>counts[e.reason]=(counts[e.reason]||0)+1);const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];if($('#metricTopReject'))$('#metricTopReject').textContent=top?`Most common rejection: ${feedbackReasonLabel(top[0])} (${top[1]})`:'No rejection pattern yet.';
}
function decisionDelay(){return state.currentRecommendationStartedAt?Math.max(0,Date.now()-state.currentRecommendationStartedAt):null;}
function acceptRecommendation(id,card){
  const a=allTripPlaces().find(x=>x.id===id)||([stayHomeRecommendation].find(x=>x.id===id));if(!a)return;const prev=feedbackFor(id);state.recommendationFeedback[id]={...prev,acceptedAt:new Date().toISOString(),selectedDate:betaLocalDayStamp(),acceptedCount:(prev.acceptedCount||0)+1,dismissed:false,signature:feedbackSignature(a)};saveRecommendationFeedback();
  if(!a.transient&&!state.saved.includes(id)){state.saved=[...state.saved,id];localStorage.setItem('ffvp_saved',JSON.stringify(state.saved));renderTripHub();}
  trackDecisionEvent('recommendation_accepted',{id,name:a.name,score:+card?.dataset.score||null,decisionMs:decisionDelay(),context:nowContextSummary()});
  card?.classList.add('decision-picked');const area=card?.querySelector('.decision-choice-actions');if(area)area.innerHTML='<div class="decision-picked-note">✓ Good choice — I’ll remember that for this trip.</div>';showToast(a.id==='stay-home'?'Easy night it is — good call.':'Nice — saved to your trip.');
}
function openRecommendationFeedback(id){const a=allTripPlaces().find(x=>x.id===id)||([stayHomeRecommendation].find(x=>x.id===id));if(!a)return;state.pendingFeedbackId=id;$('#feedbackPlaceName').textContent=`${a.name} isn’t quite right — what’s the main reason?`;$('#recommendationFeedbackDialog').classList.remove('hidden');}
function closeRecommendationFeedback(){state.pendingFeedbackId=null;$('#recommendationFeedbackDialog')?.classList.add('hidden');}
function rejectRecommendation(reason){
  const id=state.pendingFeedbackId,a=allTripPlaces().find(x=>x.id===id)||([stayHomeRecommendation].find(x=>x.id===id));if(!id||!a)return;const prev=feedbackFor(id),counts={...(prev.reasonCounts||{})};counts[reason]=(counts[reason]||0)+1;state.recommendationFeedback[id]={...prev,dismissed:true,reason,rejectedAt:new Date().toISOString(),reasonCounts:counts,signature:feedbackSignature(a)};saveRecommendationFeedback();
  if(reason==='already_done'&&!a.transient){const old=tripStatusObj(id);state.tripStatuses[id]={...old,status:'visited',visitedAt:old.visitedAt||localDateKey()};saveTripStatuses();}
  trackDecisionEvent('recommendation_rejected',{id,name:a.name,reason,decisionMs:decisionDelay(),context:nowContextSummary()});closeRecommendationFeedback();showToast(`Got it — ${feedbackReasonLabel(reason).toLowerCase()}.`);
  const c=state.currentRecommendationContext||{};runRecommendations(c.forcedTag||null,'now',{replacement:true,noScroll:true});
}

function tripStatusObj(id){const v=state.tripStatuses[id];return typeof v==='string'?{status:v}:v||{status:''};}
function tripStatus(id){return tripStatusObj(id).status||'';}
function saveTripStatuses(){localStorage.setItem('ffvp_trip_statuses',JSON.stringify(state.tripStatuses));}
function setTripStatus(id,status){
  const prev=tripStatusObj(id), next={...prev,status};
  if(status==='visited'&&!next.visitedAt)next.visitedAt=localDateKey();
  if(status!=='visited'&&status!=='repeat'&&prev.status==='visited')next.visitedAt=prev.visitedAt;
  state.tripStatuses[id]=next;saveTripStatuses();renderExplore();renderTripHub();if(!$('#recommendations').classList.contains('hidden'))runRecommendations();showToast(statusLabel(status)||'Trip note cleared');
}
function setTripRating(id,rating){state.tripStatuses[id]={...tripStatusObj(id),rating:+rating||0};saveTripStatuses();renderTripHub();}
function statusLabel(s){return ({want:'Want to go',must:'Must do',visited:'Been there',repeat:'Happy to repeat',skip:'Don’t suggest again'})[s]||'';}
function activityStatusSelect(a){
  const s=tripStatus(a.id);
  return `<select class="trip-status-select" aria-label="Trip status for ${escapeHtml(a.name)}"><option value="" ${!s?'selected':''}>Trip status…</option><option value="must" ${s==='must'?'selected':''}>⭐ Must do</option><option value="want" ${s==='want'?'selected':''}>♡ Want to go</option><option value="visited" ${s==='visited'?'selected':''}>✓ Been there</option><option value="repeat" ${s==='repeat'?'selected':''}>↻ Happy to repeat</option><option value="skip" ${s==='skip'?'selected':''}>× Don’t suggest</option></select>`;
}
function roughSpendTier(a){const n=memberSummary().length||2,f=currencyInfo().factor;return (a.cost===3?Math.max(120,n*45):a.cost===2?Math.max(60,n*25):Math.max(20,n*12))*f;}
function formatPlanTime(t){if(!t)return 'any time';const [h,m]=t.split(':').map(Number);return new Date(2000,0,1,h,m).toLocaleTimeString(appLocale(),{hour:'numeric',minute:'2-digit'});}
function refreshDecisionCard(){
  const now=new Date(),h=now.getHours(),title=$('#decisionTitle'),copy=$('#decisionCopy'),nowBtn=$('#whatNowBtn'),tomorrow=$('#tomorrowBtn'),t=tripContext(now);if(!title)return;
  if(t?.before){const days=daysUntilArrival(t),dest=destinationPreset().short;title.textContent=days<=1?'Nearly adventure time':countdownLabel(days,dest);copy.textContent=days<=2?'Final checks, travel-day basics and a short must-do list — no need to over-plan the fun out of it.':days<=7?`Use the final countdown to sort the useful bits and choose a few ${dest} experiences you really care about.`:`Discover ${dest}, build your must-do list and let the itinerary take shape gradually.`;nowBtn.textContent='Prep checklist';tomorrow.textContent='Build trip ideas';tomorrow.classList.remove('hidden');return;}
  tomorrow.textContent=h<5?'Plan later today':'Plan tomorrow';
  if(h<5){title.textContent='Time to recharge?';copy.textContent=`${contextualRestLine(now)} If you’re still awake, we’ll keep any last idea genuinely close and easy.`;nowBtn.textContent='One last easy option';tomorrow.classList.remove('hidden');}
  else if(h>=22){title.textContent='Wind down or set up tomorrow?';copy.textContent=`${contextualRestLine(now)} If nobody’s ready for bed, we can still find one easy nearby option.`;nowBtn.textContent='Keep tonight easy';tomorrow.classList.remove('hidden');}
  else if(h>=20){title.textContent='One more thing tonight — or save it for tomorrow?';copy.textContent=`If something nearby is genuinely worth it, we’ll find it. Otherwise, tomorrow can do the heavy lifting. ${tripStageLine(t)}`;nowBtn.textContent='Something tonight';tomorrow.classList.remove('hidden');}
  else if(h>=17){title.textContent='How should we finish the day?';copy.textContent=`Closing times and travel matter more now. ${tripStageLine(t)}`;nowBtn.textContent='Plan this evening';tomorrow.classList.remove('hidden');}
  else if(h>=12){title.textContent='What fits the rest of today?';copy.textContent=`Let’s find something worth the time you’ve got left — without turning the day into a mission. ${tripStageLine(t)}`;nowBtn.textContent='Give me some ideas';tomorrow.classList.add('hidden');}
  else{title.textContent='What kind of day shall we make of it?';copy.textContent=`Plenty of day ahead. Let’s find something that suits the weather, your energy and the things you still want to do. ${tripStageLine(t)}`;nowBtn.textContent='Give me some ideas';tomorrow.classList.add('hidden');}
}
function weatherForDate(target){
  const w=state.weather;if(!w)return null;const key=localDateKey(target),days=w.daily?.time||[];let idx=days.indexOf(key);if(idx<0)idx=key===localDateKey()?0:1;const window=weatherWindowForDay(w,idx);
  return {rain:w.daily?.precipitation_probability_max?.[idx]||0,high:w.daily?.temperature_2m_max?.[idx],low:w.daily?.temperature_2m_min?.[idx],feels:idx===0?w.current?.apparent_temperature:null,weatherCode:w.daily?.weather_code?.[idx],bestOutdoor:window?.label||'',bestOutdoorRain:window?.avgRain};
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
    midday:`Let’s keep the journey sensible so there’s still plenty of time to enjoy the place when you get there. ${tripStageLine(t)}`,
    afternoon:`The day’s moving on, so shorter journeys and places that still feel worth the effort rise to the top. ${tripStageLine(t)}`,
    evening:`This is the time for good food, something nearby, or an easy win rather than another massive day out. ${tripStageLine(t)}`,
    late:`If there’s one easy thing nearby that’s worth it, great. If not, calling it a night is a very good holiday plan too. ${tripStageLine(t)}`
  };
  if(isOvernightWindow(now))return {now,phase:'late',mins,label:'WIND-DOWN TIME',title:'One last easy option — or bed',copy:`${contextualRestLine(now)} Anything we suggest now will be close, simple and genuinely worth staying awake for.`};
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
  const travel=estimatedTravelMinutes(a),visit=minimumVisitMinutes(a),status=tripStatus(a.id),wx=weatherForDate(targetDate),nowCtx=mode==='now'?activeNowContext():{};
  const schedule=a.category==='park'?scheduleForActivity(a,targetDate):null,fb=feedbackFor(a.id);
  if(fb.dismissed)return {score:-999,reason:'ruled out for this trip',travelMinutes:travel};
  if(fb.selectedDate===betaLocalDayStamp()&&mode==='now')return {score:-999,reason:'already chosen today',travelMinutes:travel};
  if(status==='skip'||status==='visited')return {score:-999,reason:status==='visited'?'already visited this trip':'hidden for this trip',travelMinutes:travel};
  if(!isFloridaContext()&&!a.discovered&&a.lat&&d!=null&&d>250)return {score:-999,reason:'outside this destination',travelMinutes:travel};
  if(a.discovered&&d!=null&&d>Math.max(120,(p.maxDrive||30)*2))return {score:-999,reason:'outside this travel area',travelMinutes:travel};
  if(status==='repeat'){score+=12;reasons.push('you marked it worth repeating');}
  score+=tripUrgencyBoost(a,targetDate);if(status==='must')reasons.push('one of your must-dos');else if(status==='want')reasons.push('on your want-to-go list');

  if(d!=null){const effectiveMaxDrive=mode==='now'&&nowCtx.drive?Math.max(+p.maxDrive||30,60):(+p.maxDrive||30);score+=Math.max(-25,18-(d*.55));if(d>effectiveMaxDrive){score-=30;reasons.push('further than your travel range');}else if(d<15)reasons.push('fairly close');else if(nowCtx.drive&&d<=effectiveMaxDrive)score+=5;}
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

  if(mode==='now'){
    const commitmentNow=travel==null?visit:travel*2+visit;
    if(nowCtx.time2){if(commitmentNow<=120){score+=12;reasons.push('fits the couple of hours you have');}else{score-=Math.min(55,18+(commitmentNow-120)/3);reasons.push('too much for a two-hour window');}}
    if(nowCtx.cheap){if(a.cost===1){score+=16;reasons.push('keeps the spend down');}else if(a.cost===2)score-=14;else score-=32;}
    if(nowCtx.lowEnergy){if((a.energy||1)<=1){score+=14;reasons.push('easy on the energy');}else{score-=a.energy>=3?30:16;reasons.push('more effort than you fancy today');}}
    if(nowCtx.food){if(a.category==='food'||a.internalView==='food'){score+=28;reasons.push('sorts food at the same time');}else if((a.tags||[]).includes('food'))score+=12;}
  }
  const learned=learnedRecommendationAdjustment(a);score+=learned.adjust;reasons.push(...learned.reasons);

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
  if(isFloridaContext()||!state.coords)return;const searchMiles=activeNowContext().drive?Math.max(+state.profile.maxDrive||30,60):(+state.profile.maxDrive||30);const key=`${state.coords.lat.toFixed(3)},${state.coords.lon.toFixed(3)}:${searchMiles}:${appLanguage()}`;if(state.localSeedKey===key)return;
  if(!consumeFreshIdea('local planning ideas'))return;
  try{const r=await fetch(`/api/discover?category=sights&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(searchMiles)}&lang=${languageQuery()}`);if(!r.ok)throw new Error();const data=await r.json();if(!(data.results||[]).length)throw new Error();(data.results||[]).slice(0,10).forEach(x=>rememberDiscovered(discoveredActivity(x,'sights')));state.localSeedKey=key;}catch(e){refundFreshIdea();}
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
    if(t==='playground'||t.includes('playground'))return 'playground';
    if(t.includes('zoo')||t.includes('wildlife'))return 'wildlife';
    if(t.includes('garden')||t.includes('botanical'))return 'garden';
    if(t.includes('hiking')||t.includes('trail')||t.includes('cycling'))return 'trail';
    if(t.includes('preserve')||t.includes('refuge'))return 'nature';
    if(t.includes('scenic')||t.includes('viewpoint'))return 'scenic';
    if(t.includes('picnic'))return 'picnic';
    if(t.includes('park'))return 'park';
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
function interleaveBySubtype(items,mood){
  // Choice diversity matters more than tiny score differences: show one of each
  // experience subtype before offering a second playground/park/theme park/etc.
  const groups=new Map();
  for(const a of items){const key=moodSubtype(a,mood);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(a);}
  const out=[];let round=0,added=true;
  while(added){added=false;for(const group of groups.values()){if(group[round]){out.push(group[round]);added=true;}}round++;}
  return out;
}
function shapeMoodResults(list,mood){
  // Exact venue de-dupe is already done in allTripPlaces. This pass makes the
  // shortlist feel like genuine choices, not five variations of the same thing.
  const maxMiles=state.profile.maxDrive||30;
  const inRange=list.filter(a=>{const d=distMiles(a);return d==null||d<=maxMiles;});
  const primary=inRange.length>=3?inRange:list;
  const rest=inRange.length>=3?list.filter(a=>!inRange.includes(a)):[];
  return [...interleaveBySubtype(primary,mood),...interleaveBySubtype(rest,mood)];
}
function discoverySubtype(x,category){
  const t=String(x.typeKey||x.type||'').toLowerCase();
  if(category==='outdoors'){
    if(t.includes('playground'))return 'playground';
    if(t.includes('zoo')||t.includes('wildlife'))return 'wildlife';
    if(t.includes('garden')||t.includes('botanical'))return 'garden';
    if(t.includes('hiking')||t.includes('trail')||t.includes('cycling'))return 'trail';
    if(t.includes('preserve')||t.includes('refuge'))return 'nature';
    if(t.includes('scenic')||t.includes('viewpoint'))return 'scenic';
    if(t.includes('picnic'))return 'picnic';
    if(t.includes('park'))return 'park';
  }
  if(category==='indoor'){
    if(t.includes('aquarium'))return 'aquarium';
    if(t.includes('museum')||t.includes('gallery'))return 'museum';
    if(t.includes('movie')||t.includes('theater'))return 'show';
    if(t.includes('bowling'))return 'bowling';
    if(t.includes('playground'))return 'play';
  }
  if(category==='thrills'){
    if(t.includes('amusement_park')||t==='water_park')return 'theme-park';
    if(t.includes('kart'))return 'karting';
    if(t.includes('miniature_golf'))return 'mini-golf';
    if(t.includes('adventure')||t.includes('paintball')||t.includes('off_roading'))return 'adventure';
  }
  if(category==='shopping'){
    if(t.includes('mall'))return 'mall';
    if(t.includes('market'))return 'market';
    if(t.includes('gift'))return 'gifts';
    if(t.includes('book')||t.includes('toy'))return 'books-toys';
    if(t.includes('clothing')||t.includes('shoe')||t.includes('jewelry')||t.includes('cosmetics'))return 'fashion';
  }
  if(category==='chill'){
    if(t==='beach')return 'beach';
    if(t.includes('spa')||t.includes('wellness')||t.includes('sauna'))return 'spa';
    if(t.includes('scenic'))return 'scenic';
  }
  return t||category||'other';
}
function diversifyDiscoveryResults(results,category){
  const groups=new Map();
  for(const x of results){const key=discoverySubtype(x,category);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(x);}
  const out=[];let round=0,added=true;
  while(added){added=false;for(const group of groups.values()){if(group[round]){out.push(group[round]);added=true;}}round++;}
  return out;
}
async function seedMoodDiscovery(mood){
  if(!state.coords)return;
  const category=({chill:'chill',indoor:'indoor',outdoors:'outdoors',thrills:'thrills',shopping:'shopping'}[mood]||'sights');
  if(mood==='food')return;
  const key=`${category}:${state.coords.lat.toFixed(3)},${state.coords.lon.toFixed(3)}:${state.profile.maxDrive||30}:${appLanguage()}`;state.moodSeedKeys=state.moodSeedKeys||{};if(state.moodSeedKeys[key])return;
  if(!consumeFreshIdea('mood ideas'))return;
  try{const r=await fetch(`/api/discover?category=${encodeURIComponent(category)}&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(state.profile.maxDrive||30)}&lang=${languageQuery()}`);if(!r.ok)throw new Error();const data=await r.json();if(!(data.results||[]).length)throw new Error();(data.results||[]).slice(0,10).forEach(x=>rememberDiscovered(discoveredActivity(x,category)));state.moodSeedKeys[key]=true;}catch(e){refundFreshIdea();}
}
function renderTomorrowPlannerContext(){
  const target=tomorrowTargetDate(),t=tripContext(target),wx=weatherForDate(target),plans=plansForDate(target),dest=destinationPreset();
  const bits=[];if(t?.departureDay)bits.push('Departure day');else if(t?.inTrip)bits.push(`Day ${t.index} of ${t.total}`);
  if(wx)bits.push(`${Math.round(wx.high)}°C high`,`${wx.rain}% rain risk`);if(plans.length)bits.push(`${plans.length} fixed plan${plans.length===1?'':'s'}`);
  const planLabel=nextPlanningLabel(),overnight=planLabel==='later today';
  $('#tomorrowPlannerEyebrow').textContent=overnight?'PLAN LATER TODAY':'PLAN TOMORROW';
  $('#tomorrowPlannerTitle').textContent=overnight?'How should later today feel?':'How should tomorrow feel?';
  $('#tomorrowPlannerContext').textContent=`Pick the vibe first and we’ll find a few ${dest.short||dest.name} ideas that suit ${planLabel}’s weather, travel time and your plans.`;
  $('#tomorrowMoodCopy').textContent=overnight?'This is for the daytime ahead — nobody is suggesting you head out at 1am.':'This is just about the kind of day you fancy — we can pick the exact place next.';
  $('#tomorrowBestOverall').textContent=overnight?'Pick for me — later today':'Pick for me — tomorrow';
  $('#tomorrowSnapshot').innerHTML=`<div><span>${overnight?'Later today':'Tomorrow'}</span><b>${bits[0]||'A fresh day'}</b></div><div><span>Conditions</span><b>${wx?`${Math.round(wx.high)}°C · ${wx.rain}% rain`:'Forecast loading'}</b></div><div><span>Diary</span><b>${plans.length?`${plans.length} fixed plan${plans.length===1?'':'s'}`:'Wide open'}</b></div>`;
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
  const displayCount=mode==='tomorrow'?5:3;
  const displayList=rotatingShortlist(list,displayCount,runKey,rerun);
  if(mode==='now'){state.currentRecommendationContext={forcedTag,mode,ids:displayList.map(a=>a.id)};state.currentRecommendationStartedAt=Date.now();if(!options.replacement)trackDecisionEvent('recommendations_generated',{count:displayList.length,rerun,context:nowContextSummary()});}
  const eyebrow=$('#recommendationsEyebrow'),title=$('#recommendationsTitle'),copy=$('#recommendationsContext');
  if(mode==='tomorrow'){
    const t=tripContext(targetDate),wx=weatherForDate(targetDate),plans=plansForDate(targetDate),weather=wx?`${Math.round(wx.high)}°C high · ${wx.rain}% rain risk`:'weather still loading';
    if($('.view.active')?.dataset.view==='tomorrow-planner'){
      state.tomorrowMood=forcedTag||null;localStorage.setItem('ffvp_tomorrow_mood',state.tomorrowMood||'');const mood=tomorrowMoodTitle(forcedTag);
      const planLabel=nextPlanningLabel(now),planEyebrow=nextPlanningEyebrow(now);
      $('#tomorrowResultsEyebrow').textContent=forcedTag?`${mood.toUpperCase()} · ${planEyebrow}`:`A FEW GOOD BETS · ${planEyebrow}`;
      $('#tomorrowResultsTitle').textContent=t?.departureDay?'Best fit for departure day':(forcedTag?`${mood} for ${planLabel}`:(t?.inTrip?`A few good ideas for day ${t.index} of ${t.total}`:`A few good ideas for ${planLabel}`));
      $('#tomorrowResultsContext').textContent=`${weather}${plans.length?` · ${plans.length} fixed plan${plans.length===1?'':'s'} in the diary`:''}. Places you’ve already done stay out of the way unless you marked them Repeat.`;
      $('#tomorrowResults').classList.remove('hidden');$('#tomorrowRecommendationList').innerHTML=displayList.length?displayList.map((a,i)=>placeCard(a,true,i===0)).join(''):'<div class="error-card"><b>Nothing feels quite right for that mood yet.</b><br/>Try another vibe or let us pick the best overall options.</div>';wirePlaceActions($('#tomorrowRecommendationList'));$('#tomorrowResults').scrollIntoView({behavior:'smooth',block:'start'});return;
    }
    const planLabel=nextPlanningLabel(now);eyebrow.textContent=isOvernightWindow(now)?'PLAN LATER TODAY':'PLAN TOMORROW';title.textContent=t?.departureDay?'Departure-day options':(t?.inTrip?`A few good ideas for day ${t.index} of ${t.total}`:`A few good ideas for ${planLabel}`);copy.textContent=`${weather}${plans.length?` · ${plans.length} fixed plan${plans.length===1?'':'s'} already in the diary`:''}. Already-visited places are excluded unless marked Repeat.`;
  }else{eyebrow.textContent=context.label;title.textContent=context.title;copy.textContent=context.copy+' We’ll keep your plans and places you’ve already done in mind. Drive times are a rough guide rather than live traffic.';}
  $('#recommendations').classList.remove('hidden');$('#recommendationList').innerHTML=displayList.length?displayList.map((a,i)=>placeCard(a,true,i===0,true)).join(''):'<div class="error-card"><b>Nothing strong enough yet.</b><br/>Try clearing one of the right-now filters or mix it up.</div>';wirePlaceActions($('#recommendationList'));if(!options.noScroll)$('#recommendations').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#whatNowBtn').addEventListener('click',()=>{if(tripContext()?.before){$('#prepSection').scrollIntoView({behavior:'smooth',block:'start'});return;}trackDecisionEvent('what_now_opened',{context:nowContextSummary()});runRecommendations(null,'now');});
$('#tomorrowBtn').addEventListener('click',openTomorrowPlanner);$('#rerunBtn').addEventListener('click',()=>runRecommendations(state.currentRecommendationContext?.forcedTag||null,'now',{rerun:true}));
$$('.now-context-chip').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.nowContext;state.nowContext={...activeNowContext(),[k]:!activeNowContext()[k]};saveNowContext();trackDecisionEvent('now_context_changed',{key:k,value:!!state.nowContext[k]});if(!$('#recommendations').classList.contains('hidden'))runRecommendations(state.currentRecommendationContext?.forcedTag||null,'now',{noScroll:true});}));
$('#clearNowContext')?.addEventListener('click',()=>{state.nowContext={day:betaLocalDayStamp(),time2:false,cheap:false,lowEnergy:false,drive:false,food:false};saveNowContext();trackDecisionEvent('now_context_cleared');if(!$('#recommendations').classList.contains('hidden'))runRecommendations(state.currentRecommendationContext?.forcedTag||null,'now',{noScroll:true});});
$('#closeRecommendationFeedback')?.addEventListener('click',closeRecommendationFeedback);$('#recommendationFeedbackDialog')?.addEventListener('click',e=>{if(e.target.id==='recommendationFeedbackDialog')closeRecommendationFeedback();});$$('[data-feedback-reason]').forEach(b=>b.addEventListener('click',()=>rejectRecommendation(b.dataset.feedbackReason)));
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
  chill:{eyebrow:'CHILL & RECHARGE',title:'Take it easy',copy:'Beaches, scenic spots and slower places for when the holiday needs a breather.',icon:'🌊',category:'activity',tags:['relax']},
  thrills:{eyebrow:'THRILLS & EXCITEMENT',title:'Turn the energy up',copy:'Theme parks, karting, adventure, big views and anything else that feels like a proper buzz.',icon:'⚡',category:'activity',tags:['rides']},
  indoor:{eyebrow:'INDOOR & EASY',title:'Keep it easy indoors',copy:'Museums, aquariums, entertainment and other good options when you want shade, air-con or an easier pace.',icon:'☂',category:'indoor',tags:['indoor']},
  outdoors:{eyebrow:'OUTDOORS & EXPLORE',title:'Get outside',copy:'Parks, zoos, gardens, trails and other places that make a good outdoor day from here.',icon:'🌿',category:'outdoors',tags:['nature']},
  shopping:{eyebrow:'SHOP & BROWSE',title:'Fancy a browse?',copy:'Malls, markets, local shops and other places where wandering around is part of the fun.',icon:'🛍',category:'shopping',tags:['shopping','indoor']},
  sights:{eyebrow:'EXPLORE LOCALLY',title:'What’s worth a look nearby?',copy:'A mix of landmarks, museums, views, parks and family attractions that are easy to reach from here.',icon:'📍',category:'activity',tags:['nature','indoor']},
  wildlife:{eyebrow:'WILDLIFE & SAFARI',title:'Wildlife worth the trip',copy:'Safari, wildlife, zoo and reserve experiences that feel worth making time for here.',icon:'🦒',category:'outdoors',tags:['nature']},
  beaches:{eyebrow:'BEACHES & COAST',title:'Fancy the coast?',copy:'Beaches and coastal stops that look worth the journey from where you’re staying.',icon:'🌊',category:'beach',tags:['relax']}
};
function discoveredActivity(x,category){
  const m=discoveryMeta[category]||discoveryMeta.sights,level=x.priceLevel==null?2:Math.max(1,Math.min(3,x.priceLevel||1));
  const raw={id:x.id,name:x.name,icon:m.icon,category:m.category,tags:m.tags,cost:level,energy:category==='thrills'?2:1,lat:+x.lat,lon:+x.lon,destination:x.name,note:[x.type,x.rating?`★ ${x.rating.toFixed(1)}`:'',x.address].filter(Boolean).join(' · ')||'Looks worth a look near where you’re staying.',experienceDescription:x.description||'',rating:Number.isFinite(+x.rating)?+x.rating:null,ratingCount:+x.ratingCount||0,discovered:true,provider:x.source||'',mapsUrl:x.mapsUrl||'',sourceCategory:category,placeType:x.typeKey||x.type||'',placeTypes:Array.isArray(x.types)?x.types:[]};
  return inferDiscoveredSemantics(raw);
}
function rememberDiscovered(a){state.discovered[a.id]=a;localStorage.setItem('ffvp_discovered',JSON.stringify(state.discovered));}
function discoveryCard(x,category){
  const a=discoveredActivity(x,category);rememberDiscovered(a);const d=Number(x.distance),distance=Number.isFinite(d)?formatDistance(d):'';
  const rating=x.rating?`★ ${Number(x.rating).toFixed(1)}${x.ratingCount?` · ${Number(x.ratingCount).toLocaleString()} reviews`:''}`:'No rating yet';
  const open=x.openNow===true?'<span class="trip-state-chip state-repeat">Open now</span>':x.openNow===false?'<span class="trip-state-chip state-skip">Closed now</span>':'';
  const s=tripStatus(a.id),saved=state.saved.includes(a.id),type=escapeHtml(x.type||'Local attraction'),address=x.address?escapeHtml(x.address):'',desc=escapeHtml(x.description||a.experienceDescription||'');
  return `<article class="place-card discover-card" data-id="${escapeHtml(a.id)}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${escapeHtml(a.name)}</div>${distance?`<span class="score-pill">${distance}</span>`:''}</div><div class="place-meta">${type}${address?` · ${address}`:''}</div></div></div>${desc?`<div class="experience-description"><b>${t('whatItsLike')}</b> ${desc}</div>`:''}<div class="discover-rating-row"><b>${rating}</b>${open}</div><div class="trip-card-tools">${activityStatusSelect(a)}${s?`<span class="trip-state-chip state-${s}">${statusLabel(s)}</span>`:''}</div><div class="place-actions"><button class="small-btn discover-save">${saved?`♥ ${t('saved')}`:`♡ ${t('save')}`}</button><a class="small-btn primary-small direction-link" href="${x.mapsUrl||directionsUrl(a)}" target="_blank" rel="noopener">${t('directions')}</a></div></article>`;
}
function wireDiscover(root){
  $$('.discover-save',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id;toggleSave(id);renderTripHub();b.textContent=state.saved.includes(id)?`♥ ${t('saved')}`:`♡ ${t('save')}`;}));
  $$('.trip-status-select',root).forEach(sel=>sel.addEventListener('change',()=>{const id=sel.closest('.place-card').dataset.id;setTripStatus(id,sel.value);loadDiscover(state.discoveryCategory,{specialist:!!state.discoverySpecialist});}));
}
async function loadDiscover(category='sights',opts={}){
  state.discoveryCategory=category;const specialist=!!opts.specialist;state.discoverySpecialist=specialist;
  const baseMeta=discoveryMeta[category]||discoveryMeta.sights,sm=specialist?specialistModule():null;
  const meta=sm?{...baseMeta,eyebrow:sm.eyebrow||baseMeta.eyebrow,title:sm.title||baseMeta.title,copy:sm.copy||baseMeta.copy}:baseMeta;
  $$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view==='discover'));$$('.nav-item').forEach(n=>n.classList.toggle('active',specialist?n.dataset.target==='specialist':n.dataset.target==='explore'));window.scrollTo({top:0,behavior:'smooth'});
  $('#discoverEyebrow').textContent=meta.eyebrow;$('#discoverTitle').textContent=meta.title;$('#discoverCopy').textContent=`${meta.copy} We’re looking around ${state.locationName||destinationLabel()}.`;
  if(!state.coords){$('#discoverStatus').innerHTML='<span>📍</span><div><b>Location needed</b><small>Choose a test location or enable device location.</small></div>';$('#discoverResults').innerHTML='';return;}
  if(!consumeFreshIdea('nearby ideas')){$('#discoverStatus').innerHTML='<span>✨</span><div><b>Your saved ideas are still here</b><small>Your free trial has used its Fresh Ideas. Unlock FERDA only if you want another new nearby search.</small></div>';return;}
  $('#discoverStatus').innerHTML='<span class="mini-spinner"></span><div><b>Having a look around…</b><small>Keeping things within the distance you’re happy to travel.</small></div>';$('#discoverResults').innerHTML='';
  try{const r=await fetch(`/api/discover?category=${encodeURIComponent(category)}&lat=${encodeURIComponent(state.coords.lat)}&lon=${encodeURIComponent(state.coords.lon)}&miles=${encodeURIComponent(state.profile.maxDrive||30)}&lang=${languageQuery()}`);if(!r.ok)throw new Error();const data=await r.json();let results=Array.isArray(data.results)?data.results:[];results=results.filter(x=>{const a=discoveredActivity(x,category);return primaryMoodForPlace(a)!==null||category==='sights';}).filter(x=>!['skip','visited'].includes(tripStatus(x.id)));results=diversifyDiscoveryResults(results,category);if(!results.length)throw new Error();
    $('#discoverStatus').innerHTML=`<span>📍</span><div><b>${results.length} ideas worth a look around ${escapeHtml(state.locationName||'your location')}</b><small>A good mix, so you’re not choosing between five versions of the same thing.</small></div>`;$('#discoverResults').innerHTML=results.map(x=>discoveryCard(x,category)).join('');wireDiscover($('#discoverResults'));
  }catch(e){refundFreshIdea();$('#discoverStatus').innerHTML='<span>🧭</span><div><b>Can’t get nearby places just now</b><small>Give it another go in a moment — everything you’ve already saved is still here.</small></div>';$('#discoverResults').innerHTML=`<article class="place-card"><div class="reason">Nearby ideas aren’t loading properly right now.</div><div class="place-actions"><button id="retryDiscover" class="small-btn primary-small">Try again</button></div></article>`;$('#retryDiscover').addEventListener('click',()=>loadDiscover(category,{specialist:!!state.discoverySpecialist}));}
}

function placeCard(a,withScore=false,hero=false,decisionMode=false){
  const d=distMiles(a),saved=!a.transient&&state.saved.includes(a.id),budget=a.foodTier?foodEstimate(a.foodTier):money(a.cost),travel=a.travelMinutes??estimatedTravelMinutes(a);
  const distanceMeta=d!=null?`${formatDistance(d)} · ~${travel} min drive`:(a.category==='stayin'?'No travel':null),commit=a.commitmentMinutes?`~${Math.round(a.commitmentMinutes/15)*15} min total commitment`:null;
  const meta=[distanceMeta,budget,a.category.replace(/^./,x=>x.toUpperCase())].filter(Boolean).join(' · '),fit=familyFitReason(a),s=tripStatus(a.id);
  const saveAction=a.transient?'':`<button class="small-btn save-btn">${saved?`♥ ${t('saved')}`:`♡ ${t('save')}`}</button>`;
  const primaryAction=a.internalView?`<button class="small-btn primary-small internal-view-btn" data-view="${a.internalView}">See ideas</button>`:`<button class="small-btn primary-small directions-btn">${a.search?'Find nearby':'Directions'}</button>`;
  const tripTools=a.transient?'':`<div class="trip-card-tools">${activityStatusSelect(a)}${s?`<span class="trip-state-chip state-${s}">${statusLabel(s)}</span>`:''}</div>`;
  const desc=a.experienceDescription?`<div class="experience-description"><b>${t('whatItsLike')}</b> ${escapeHtml(a.experienceDescription)}</div>`:'';
  const choiceActions=decisionMode?`<div class="decision-choice-actions"><button class="decision-accept-btn" type="button">Let’s do this</button><button class="decision-reject-btn" type="button">Not for us</button></div>`:'';
  return `<article class="place-card${decisionMode?' decision-place-card':''}" data-id="${a.id}" data-score="${withScore?a.score:''}"><div class="place-top"><div class="place-icon">${a.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${hero?'⭐ ':''}${a.name}</div>${withScore?`<span class="score-pill">${a.score}% fit</span>`:''}</div><div class="place-meta">${meta}</div></div></div>${desc}<div class="reason">${withScore?`<b>Why it suits:</b> ${a.reason||a.note}`:a.note}${commit&&withScore?`<br><span class="family-fit">About ${commit.replace('~','')} all-in, including getting there and back.</span>`:''}${fit&&!withScore?`<br><span class="family-fit">${fit}</span>`:''}</div>${choiceActions}${decisionMode?'':tripTools}<div class="place-actions ${decisionMode?'decision-secondary-actions':''}">${saveAction}${primaryAction}</div></article>`;
}
function wirePlaceActions(root){
  $$('.save-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id;toggleSave(id);renderExplore();renderTripHub();if(!$('#recommendations').classList.contains('hidden'))runRecommendations();}));
  $$('.directions-btn',root).forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.place-card').dataset.id,a=allTripPlaces().find(x=>x.id===id);if(!a)return;if(a.mapsUrl){window.open(a.mapsUrl,'_blank','noopener');return;}const q=a.search?`${a.search} near me`:a.destination;window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,'_blank','noopener');}));
  $$('.internal-view-btn',root).forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $$('.trip-status-select',root).forEach(s=>s.addEventListener('change',()=>setTripStatus(s.closest('.place-card').dataset.id,s.value)));
  $$('.decision-accept-btn',root).forEach(b=>b.addEventListener('click',()=>acceptRecommendation(b.closest('.place-card').dataset.id,b.closest('.place-card'))));
  $$('.decision-reject-btn',root).forEach(b=>b.addEventListener('click',()=>openRecommendationFeedback(b.closest('.place-card').dataset.id)));
}
function toggleSave(id){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];localStorage.setItem('ffvp_saved',JSON.stringify(state.saved));showToast(state.saved.includes(id)?'Saved for this trip':'Removed from your trip');}
function renderExplore(){if(!isFloridaContext()&&$('.view.active')?.dataset.view==='explore'){loadDiscover('sights');return;}let list=activities.map(a=>({...a,...recommendationScore(a)}));if(state.filter!=='all'){if(state.filter==='lowcost')list=list.filter(a=>a.cost===1);else list=list.filter(a=>a.category===state.filter||a.tags.includes(state.filter));}list.sort((a,b)=>(distMiles(a)??999)-(distMiles(b)??999));$('#exploreList').innerHTML=list.map(a=>placeCard(a,false)).join('');wirePlaceActions($('#exploreList'));}
$$('#exploreFilters .chip').forEach(c=>c.addEventListener('click',()=>{state.filter=c.dataset.filter;$$('#exploreFilters .chip').forEach(x=>x.classList.toggle('active',x===c));renderExplore();}));
function renderSaved(){renderTripHub();}
function renderTripHub(){
  renderPreviousTrips();
  const summary=$('#tripSummary');if(!summary)return;const t=tripContext(),remaining=Number(state.profile.budgetRemaining);
  if(t?.inTrip)summary.innerHTML=`<div class="trip-summary-main"><div><span class="trip-day-big">Day ${t.index}</span><small>of ${t.total}</small></div><div><b>${t.daysUntilDeparture} day${t.daysUntilDeparture===1?'':'s'} to departure</b><small>${t.fullDaysRemaining} full days after today</small></div>${remaining>0?`<div><b>${tripCurrencyInfo().symbol}${Math.round(remaining)}</b><small>budget remaining</small></div>`:''}</div>`;else if(t?.departureDay)summary.innerHTML=`<div class="trip-summary-main"><div><span class="trip-day-big">Departure</span><small>day</small></div><div><b>Keep it flexible</b><small>Short, nearby options rank higher today</small></div>${remaining>0?`<div><b>${tripCurrencyInfo().symbol}${Math.round(remaining)}</b><small>budget remaining</small></div>`:''}</div>`;
  else summary.innerHTML=`<div class="trip-empty"><b>${t?.before?'Trip countdown ready':'Add your vacation dates'}</b><small>${t?.before?`${daysUntilArrival(t)} days until ${destinationPreset().name}.`:'Add arrival and departure dates so the app knows how much holiday you’ve got to play with.'}</small></div>`;
  renderPlans();
  const ids=new Set([...state.saved,...Object.keys(state.tripStatuses).filter(id=>tripStatus(id))]);const tripPlaces=allTripPlaces();const list=tripPlaces.filter(a=>ids.has(a.id)).map(a=>({...a,...recommendationScore(a)}));
  $('#savedList').innerHTML=list.length?list.map(a=>placeCard(a,false)).join(''):'<div class="error-card"><b>No trip places yet.</b><br/>Save a place or give it a trip status while exploring.</div>';wirePlaceActions($('#savedList'));
  const visited=tripPlaces.filter(a=>['visited','repeat'].includes(tripStatus(a.id))).sort((a,b)=>(tripStatusObj(b.id).visitedAt||'').localeCompare(tripStatusObj(a.id).visitedAt||''));
  $('#memoriesList').innerHTML=visited.length?visited.map(a=>{const o=tripStatusObj(a.id);return `<article class="memory-row" data-id="${a.id}"><div><b>${a.name}</b><small>${o.visitedAt?new Date(`${o.visitedAt}T12:00:00`).toLocaleDateString([], {month:'short',day:'numeric'}):'This trip'} · ${tripStatus(a.id)==='repeat'?'Happy to repeat':'Done'}</small></div><label>Family rating<select class="memory-rating"><option value="0">—</option>${[5,4,3,2,1].map(n=>`<option value="${n}" ${o.rating===n?'selected':''}>${'★'.repeat(n)}</option>`).join('')}</select></label></article>`;}).join(''):'<div class="trip-empty"><b>No memories logged yet.</b><small>Mark a place “Been there” and it will appear here.</small></div>';
  $$('.memory-rating',$('#memoriesList')).forEach(s=>s.addEventListener('change',()=>setTripRating(s.closest('.memory-row').dataset.id,s.value)));
}
function savePlans(){localStorage.setItem('ffvp_plans',JSON.stringify(state.plans));updateTripPulse();}
function renderPlans(){const root=$('#plansList');if(!root)return;const nowKey=localDateKey();const list=[...state.plans].sort((a,b)=>(a.date+(a.time||'23:59')).localeCompare(b.date+(b.time||'23:59')));root.innerHTML=list.length?list.map(p=>`<article class="plan-row ${p.date<nowKey?'past':''}" data-id="${p.id}"><div><b>${escapeHtml(p.title)}</b><small>${new Date(`${p.date}T12:00:00`).toLocaleDateString(appLocale(),{weekday:'short',month:'short',day:'numeric'})}${p.time?` · ${formatPlanTime(p.time)}`:''}${p.location?` · ${escapeHtml(p.location)}`:''}</small></div><button class="icon-btn remove-plan" aria-label="Remove plan">×</button></article>`).join(''):'<div class="trip-empty"><b>No fixed plans yet.</b><small>Add reservations, flights, shows or anything the day needs to work around.</small></div>';$$('.remove-plan',root).forEach(b=>b.addEventListener('click',()=>{state.plans=state.plans.filter(p=>p.id!==b.closest('.plan-row').dataset.id);savePlans();renderTripHub();}));}
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
  const d=formatDistance(x.distance),address=x.address?` · ${escapeHtml(x.address)}`:'';
  return `<article class="place-card essential-result"><div class="place-top"><div class="place-icon">${e.icon}</div><div class="place-main"><div class="place-title-row"><div class="place-title">${escapeHtml(x.name)}</div><span class="score-pill">${d}</span></div><div class="place-meta">${localCostGuide(e.cost)} typical cost guide${address}</div></div></div><div class="reason">${e.costNote}. Treat the price as a rough guide rather than a promise.</div><div class="place-actions"><a class="small-btn primary-small direction-link" href="${directionsUrl(x)}" target="_blank" rel="noopener">${t('directions')}</a></div></article>`;
}
async function loadNearbyEssential(id){
  const e=essentials.find(x=>x.id===id);if(!e)return;
  if(!state.coords){
    $('#essentialsStatus').innerHTML='<span>📍</span><div><b>Location needed</b><small>Turn on location, then tap Try again.</small></div>';
    $('#essentialResults').innerHTML=`<article class="place-card"><div class="reason">We need your location to rank nearby ${e.name.toLowerCase()}.</div><div class="place-actions"><button type="button" class="small-btn primary-small retry-essential">Try again</button></div></article>`;
    $('.retry-essential').addEventListener('click',async()=>{await requestLocation();loadNearbyEssential(id);});
    return;
  }
  if(!consumeFreshIdea('nearby essentials')){$('#essentialsStatus').innerHTML='<span>✨</span><div><b>Your free fresh searches are used</b><small>Everything already saved still works. See plans if you want another live nearby lookup.</small></div>';return;}
  $('#essentialsStatus').innerHTML=`<span class="mini-spinner"></span><div><b>Finding ${e.name.toLowerCase()} near you…</b><small>Checking a few nearby options.</small></div>`;
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
    refundFreshIdea();
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
  const rating=x.rating?`<span class="food-rating">★ ${Number(x.rating).toFixed(1)}${x.userRatingCount?` <small>(${x.userRatingCount})</small>`:''}</span>`:`<span class="food-rating muted-rating">${t('ratingUnavailable')}</span>`;
  const price=foodPriceText(x.priceLevel),estimate=familyMealEstimate(x.priceLevel);
  const d=formatDistance(x.distance);
  const type=x.typeLabel||'Food & drink';
  const open=x.openNow===true?`<span class="open-pill open">${t('openNow')}</span>`:x.openNow===false?'<span class="open-pill closed">Closed</span>':'';
  return `<article class="place-card food-card"><div class="food-card-top"><div><div class="place-title">${escapeHtml(x.name)}</div><div class="place-meta">${escapeHtml(type)} · ${d} ${open}</div></div>${rating}</div><div class="food-budget-row"><span class="price-pill">${price}</span><b>${estimate}</b></div>${x.address?`<div class="reason">${escapeHtml(x.address)}</div>`:''}<div class="place-actions"><a class="small-btn primary-small direction-link" href="${foodDirectionsUrl(x)}" target="_blank" rel="noopener">${t('directions')}</a></div></article>`;
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
  if(!consumeFreshIdea('nearby food')){$('#foodStatus').innerHTML='<span>✨</span><div><b>You’ve used the Fresh Ideas on this plan</b><small>Your saved places and trip plan are still available.</small></div>';return;}
  $('#foodStatus').innerHTML='<span class="mini-spinner"></span><div><b>Finding nearby food…</b><small>Ratings and price guidance where available.</small></div>';
  $('#foodResults').innerHTML='';
  const {lat,lon}=state.coords;
  try{
    const r=await fetch(`/api/food?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,{headers:{Accept:'application/json'}});
    if(!r.ok)throw new Error(`Food ${r.status}`);
    const data=await r.json();foodResultsCache=Array.isArray(data.results)?data.results:[];
    if(!foodResultsCache.length)throw new Error('No food results');
    const rich=foodResultsCache.some(x=>x.rating||x.priceLevel);
    $('#foodStatus').innerHTML=`<span>🍽</span><div><b>${foodResultsCache.length} nearby options</b><small>${rich?'Ratings and price guidance included':'A few nearby choices found'}</small></div>`;
    $('#foodSort').querySelector('[data-food-sort="rating"]').disabled=!foodResultsCache.some(x=>x.rating);
    renderFoodResults();
  }catch(err){
    refundFreshIdea();
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
function timeLabel(d){return d?d.toLocaleTimeString(appLocale(),{hour:'numeric',minute:'2-digit'}):'—';}
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
  return{id:crypto.randomUUID?.()||String(Date.now()+Math.random()),name:seed.name??'',age:seed.age??defaultAge,height:seed.height??defaultHeight,heightBand:seed.heightBand||heightBandFromInches(seed.height??defaultHeight),heightUnit:seed.heightUnit||defaultHeightUnit(),role,thrill:seed.thrill||'medium',avatarKey:seed.avatarKey||''};
}
function memberRow(m,scope='profile',index=0){
  const role=m.role||memberRole(m), unit=m.heightUnit||defaultHeightUnit(), inches=+m.height||0, cm=inches?Math.round(inches*2.54):'', feet=inches?Math.floor(inches/12):'', rem=inches?Math.round(inches-(Math.floor(inches/12)*12)):'';
  const avatar=memberAvatar(m,index), roleLabel=role==='child'?'Child':'Adult', remove=scope==='setup'?'':`<button class="member-remove" type="button" aria-label="Remove ${roleLabel.toLowerCase()}">×</button>`;
  const band=heightBandFromMember(m);
  const setupHeight=`<div class="height-field height-band-field"><span class="member-field-label">Ride height</span><div class="height-band-grid" role="radiogroup" aria-label="Approximate ride height"><button type="button" class="height-band ${band==='under36'?'active':''}" data-height-band="under36"><b>Under 36″</b><small>&lt;92cm</small></button><button type="button" class="height-band ${band==='36to41'?'active':''}" data-height-band="36to41"><b>36–41″</b><small>92–106cm</small></button><button type="button" class="height-band ${band==='42to47'?'active':''}" data-height-band="42to47"><b>42–47″</b><small>107–121cm</small></button><button type="button" class="height-band ${band==='48plus'?'active':''}" data-height-band="48plus"><b>48″+</b><small>122cm+</small></button><button type="button" class="height-band height-band-unknown ${band==='unknown'?'active':''}" data-height-band="unknown"><b>Not sure</b><small>That’s fine</small></button></div><small class="height-band-note">Approximate is enough for planning. Individual rides set their own height rules.</small></div>`;
  const profileHeight=`<div class="height-field"><span class="member-field-label">Height</span><div class="height-control"><select class="member-height-unit" aria-label="Height unit"><option value="metric" ${unit==='metric'?'selected':''}>cm</option><option value="imperial" ${unit==='imperial'?'selected':''}>ft / in</option></select><div class="height-entry height-metric ${unit==='metric'?'':'hidden'}"><input class="member-height-cm" type="number" min="50" max="230" inputmode="decimal" aria-label="Height in centimetres" value="${cm}" placeholder="137"></div><div class="height-entry height-imperial ${unit==='imperial'?'':'hidden'}"><input class="member-height-ft" type="number" min="1" max="7" inputmode="numeric" aria-label="Height feet" value="${feet}" placeholder="4"><span>′</span><input class="member-height-in" type="number" min="0" max="11" inputmode="numeric" aria-label="Height inches" value="${rem}" placeholder="6"><span>″</span></div></div></div>`;
  return `<div class="member-row crew-card" data-id="${m.id}" data-role="${role}" data-role-index="${index}" data-height-band="${band}" data-avatar-key="${avatar.key}"><div class="crew-avatar crew-avatar-ferda ${role}" aria-hidden="true"><img src="${avatar.src}" alt="" /></div><div class="crew-fields"><div class="crew-role-line"><span>${roleLabel} ${index+1}</span></div><div class="member-row-top"><input class="member-name" type="text" maxlength="25" placeholder="Name / nickname" value="${escapeHtml(m.name)}"/>${remove}</div><div class="member-fields"><label>Age<input class="member-age" type="number" min="0" max="99" inputmode="numeric" value="${m.age}"></label>${scope==='setup'?setupHeight:profileHeight}<label>Ride vibe<select class="member-thrill"><option value="low" ${m.thrill==='low'?'selected':''}>Gentle please</option><option value="medium" ${m.thrill==='medium'?'selected':''}>Some thrills</option><option value="high" ${m.thrill==='high'?'selected':''}>Bring it on</option></select></label></div></div></div>`;
}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function wireMemberRow(row){
  $('.member-remove',row)?.addEventListener('click',()=>{const root=row.parentElement;if(root.children.length<=1){showToast('Keep at least one family member');return;}row.remove();});
  const unit=$('.member-height-unit',row);const syncHeightUnit=()=>{if(!unit)return;const metric=unit.value==='metric';$('.height-metric',row)?.classList.toggle('hidden',!metric);$('.height-imperial',row)?.classList.toggle('hidden',metric);};
  unit?.addEventListener('change',syncHeightUnit);syncHeightUnit();
  $$('.height-band',row).forEach(b=>b.addEventListener('click',()=>{row.dataset.heightBand=b.dataset.heightBand;$$('.height-band',row).forEach(x=>x.classList.toggle('active',x===b));}));
}
function renderMemberEditor(rootId,members,scope='profile'){const root=$(rootId);const roleCounts={adult:0,child:0};root.innerHTML=members.map(m=>{const role=m.role||memberRole(m),i=roleCounts[role]++;return memberRow({...m,role},scope,i);}).join('');$$('.member-row',root).forEach(wireMemberRow);}
function collectMembers(rootId){return $$('.member-row',$(rootId)).map(r=>{const band=r.dataset.heightBand||'unknown',unit=$('.member-height-unit',r)?.value||defaultHeightUnit();let height=0;const exactHeight=$('.member-height-unit',r);if(exactHeight){if(unit==='metric'){height=(+$('.member-height-cm',r)?.value||0)/2.54;}else{height=(+$('.member-height-ft',r)?.value||0)*12+(+$('.member-height-in',r)?.value||0);}}return{id:r.dataset.id,name:$('.member-name',r).value.trim()||'Family member',age:+$('.member-age',r).value||0,height:Math.round(height*10)/10,heightBand:exactHeight?(height?heightBandFromInches(height):band):band,heightUnit:unit,role:r.dataset.role||'adult',thrill:$('.member-thrill',r).value,avatarKey:r.dataset.avatarKey||''};});}
function addMemberTo(rootId){const root=$(rootId);const m=newMember({role:'adult'});root.insertAdjacentHTML('beforeend',memberRow(m,'profile',$$('.member-row[data-role="adult"]',root).length));wireMemberRow(root.lastElementChild);}
$('#addMember').addEventListener('click',()=>addMemberTo('#familyMembers'));

function loadProfileForm(){const p=state.profile;$('#familyName').value=p.familyName||'';$('#destinationPreset').value=p.destinationPreset||'orlando';$('#homeBase').value=p.homeBase||'';$('#arrivalDate').value=p.arrivalDate||'';$('#departureDate').value=p.departureDate||'';$('#budgetRemaining').value=p.budgetRemaining||'';$('#walkingTolerance').value=p.walkingTolerance||'medium';$('#maxDrive').value=p.maxDrive;$('#budget').value=p.budget;$('#energy').value=p.energy;$('#heatAware').checked=p.heatAware;$('#familyNotes').value=p.notes||'';renderMemberEditor('#familyMembers',p.members);$$('input[name=interests]').forEach(i=>i.checked=p.interests.includes(i.value));updateUnits();}
$('#familyForm').addEventListener('submit',e=>{e.preventDefault();state.profile={...state.profile,familyName:$('#familyName').value.trim(),destinationPreset:$('#destinationPreset').value,homeBase:$('#homeBase').value.trim(),arrivalDate:$('#arrivalDate').value,departureDate:$('#departureDate').value,budgetRemaining:$('#budgetRemaining').value,walkingTolerance:$('#walkingTolerance').value,members:collectMembers('#familyMembers'),maxDrive:+$('#maxDrive').value,budget:$('#budget').value,energy:$('#energy').value,interests:$$('input[name=interests]:checked').map(x=>x.value),heatAware:$('#heatAware').checked,notes:$('#familyNotes').value.trim()};saveProfile();$('#saveProfileMsg').classList.remove('hidden');setTimeout(()=>$('#saveProfileMsg').classList.add('hidden'),1600);renderExplore();renderTripHub();});
function saveProfile(){localStorage.setItem('ffvp_profile',JSON.stringify(state.profile));updateGreeting();renderTripHub();renderQuickMoods();renderSpecialistNav();updateDistanceOptionLabels();}
function updateUnits(){$('#unitC').classList.toggle('active',state.unit==='c');$('#unitF').classList.toggle('active',state.unit==='f');if(state.weather)renderWeather();}
$$('.segmented button').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;localStorage.setItem('ffvp_unit',state.unit);updateUnits();}));
$('#languageSelect')?.addEventListener('change',e=>setAppLanguage(e.target.value));
$('#setupLanguage')?.addEventListener('change',e=>setAppLanguage(e.target.value));

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
  const progress=$('#setupProgressText');if(progress)progress.textContent=`${ot('step')} ${setupStep+1} / 3`;
  $('.skip-setup').classList.toggle('hidden',setupStep>0);
  onboarding.scrollTop=0;
}
function showOnboarding(){
  const p=state.profile;if($('#setupLanguage'))$('#setupLanguage').value=localStorage.getItem('ffvp_language')||'auto';$('#setupFamilyName').value=p.familyName||'';$('#setupDestinationPreset').value=p.destinationPreset||'orlando';$('#setupHomeBase').value=p.homeBase||'';$('#setupArrivalDate').value=p.arrivalDate||'';$('#setupDepartureDate').value=p.departureDate||'';$('#setupMaxDrive').value=p.maxDrive||30;$('#setupBudget').value=p.budget||'medium';$('#setupNotes').value=p.notes||'';setupQuickNotes=new Set(p.quickNotes||[]);renderSetupQuickNotes();normalizeCrewDraft(p.members?.length?p.members:defaultMembers());renderSetupCrew();showSetupStep(0);$('#onboarding').classList.remove('hidden');
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
  if($('#landingPrimary'))$('#landingPrimary').textContent=hasSaved?t('landingNew'):t('landingStart');
  if($('#landingContinue'))$('#landingContinue').textContent=t('landingContinue');
  landing.classList.remove('hidden');
}
function hideLanding(){ $('#landingScreen')?.classList.add('hidden'); }
$('#landingPrimary')?.addEventListener('click',()=>{const hasSaved=!!localStorage.getItem('ffvp_onboarded');hideLanding();if(hasSaved)openNewTripDialog();else showOnboarding();});
$('#landingContinue')?.addEventListener('click',()=>{hideLanding();});

const destinationFinderProfiles={
  orlando:{tags:{thrills:5,food:4,shopping:4,indoor:4,outdoors:2,chill:2,wildlife:2,sights:3,beach:1},cost:3,length:{short:3,week:5,long:4},climate:['hot','warm'],setting:['mixed'],specialist:'parks',reason:'Theme-park depth, family attractions and strong weather-proof backups.'},
  anaheim:{tags:{thrills:5,food:4,shopping:4,indoor:3,outdoors:3,chill:2,wildlife:1,sights:4,beach:3},cost:3,length:{short:4,week:5,long:3},climate:['warm','hot'],setting:['mixed','coast'],specialist:'parks',reason:'Big theme-park energy with Southern California coast and city options within reach.'},
  'new-york':{tags:{thrills:3,food:5,shopping:5,indoor:5,outdoors:3,chill:1,wildlife:1,sights:5,beach:1},cost:3,length:{short:5,week:5,long:3},climate:['warm','cool'],setting:['city'],specialist:'sights',reason:'A packed family city break for sights, food, museums, shows and shopping.'},
  'san-diego':{tags:{thrills:3,food:4,shopping:3,indoor:3,outdoors:5,chill:4,wildlife:5,sights:4,beach:5},cost:3,length:{short:4,week:5,long:4},climate:['warm'],setting:['coast','mixed'],specialist:'wildlife',reason:'Beaches, wildlife and easy outdoor days with a relaxed Southern California pace.'},
  nairobi:{tags:{thrills:2,food:3,shopping:2,indoor:2,outdoors:5,chill:3,wildlife:5,sights:4,beach:0},cost:2,length:{short:3,week:5,long:5},climate:['warm'],setting:['nature','mixed'],specialist:'wildlife',reason:'Wildlife and safari-style days are the headline, backed by strong outdoor experiences.'},
  kruger:{tags:{thrills:2,food:2,shopping:1,indoor:1,outdoors:5,chill:3,wildlife:5,sights:2,beach:0},cost:3,length:{short:2,week:5,long:5},climate:['warm','hot'],setting:['nature'],specialist:'wildlife',reason:'A wildlife-first trip where safari and nature are the entire point.'},
  'cape-town':{tags:{thrills:4,food:4,shopping:3,indoor:3,outdoors:5,chill:3,wildlife:5,sights:5,beach:4},cost:2,length:{short:4,week:5,long:5},climate:['warm','cool'],setting:['coast','mixed'],specialist:'sights',reason:'Coast, mountains, wildlife and city sights create an unusually varied family trip.'},
  'costa-rica':{tags:{thrills:5,food:3,shopping:1,indoor:1,outdoors:5,chill:4,wildlife:5,sights:3,beach:4},cost:2,length:{short:2,week:5,long:5},climate:['hot','warm'],setting:['nature','coast'],specialist:'wildlife',reason:'Rainforest, wildlife, beaches and adventure for families who want the trip outdoors.'},
  maui:{tags:{thrills:3,food:4,shopping:2,indoor:1,outdoors:5,chill:5,wildlife:3,sights:3,beach:5},cost:3,length:{short:2,week:5,long:5},climate:['hot','warm'],setting:['coast','nature'],specialist:'beaches',reason:'Coast, scenery, water and slower recovery days are the natural strengths.'},
  cancun:{tags:{thrills:4,food:4,shopping:3,indoor:2,outdoors:4,chill:5,wildlife:3,sights:3,beach:5},cost:2,length:{short:3,week:5,long:4},climate:['hot'],setting:['coast','mixed'],specialist:'beaches',reason:'Easy beach time with excursions, water activities and resort convenience.'},
  bali:{tags:{thrills:3,food:4,shopping:3,indoor:2,outdoors:5,chill:5,wildlife:3,sights:4,beach:5},cost:2,length:{short:2,week:5,long:5},climate:['hot'],setting:['coast','nature'],specialist:'beaches',reason:'Beach, scenery, food and slower days with plenty of outdoor exploring.'},
  phuket:{tags:{thrills:4,food:4,shopping:3,indoor:2,outdoors:4,chill:5,wildlife:3,sights:3,beach:5},cost:2,length:{short:2,week:5,long:5},climate:['hot'],setting:['coast'],specialist:'beaches',reason:'A warm island option built around beaches, boat days, food and easy relaxation.'},
  tenerife:{tags:{thrills:4,food:4,shopping:3,indoor:2,outdoors:5,chill:4,wildlife:3,sights:4,beach:5},cost:2,length:{short:3,week:5,long:4},climate:['hot','warm'],setting:['coast','nature'],specialist:'beaches',reason:'Beach weather plus volcanic scenery and family attractions in a compact island trip.'},
  mallorca:{tags:{thrills:3,food:4,shopping:3,indoor:2,outdoors:4,chill:5,wildlife:2,sights:4,beach:5},cost:2,length:{short:3,week:5,long:4},climate:['hot','warm'],setting:['coast','mixed'],specialist:'beaches',reason:'A balanced Mediterranean island for beaches, villages, food and relaxed family days.'},
  algarve:{tags:{thrills:3,food:4,shopping:2,indoor:2,outdoors:4,chill:5,wildlife:2,sights:3,beach:5},cost:2,length:{short:3,week:5,long:4},climate:['hot','warm'],setting:['coast'],specialist:'beaches',reason:'Beach-first Portugal with easy family days, coastal scenery and good-value food.'},
  cornwall:{tags:{thrills:3,food:4,shopping:2,indoor:3,outdoors:5,chill:5,wildlife:3,sights:4,beach:5},cost:2,length:{short:4,week:5,long:3},climate:['cool','warm'],setting:['coast','nature'],specialist:'beaches',reason:'A slower UK coast trip with beaches, walks, attractions and family-friendly towns.'},
  barcelona:{tags:{thrills:3,food:5,shopping:4,indoor:4,outdoors:4,chill:3,wildlife:1,sights:5,beach:4},cost:2,length:{short:5,week:5,long:3},climate:['warm','hot'],setting:['city','coast'],specialist:'sights',reason:'City sights, food and shopping with a beach sitting right alongside the city break.'},
  lisbon:{tags:{thrills:3,food:5,shopping:3,indoor:4,outdoors:4,chill:4,wildlife:2,sights:5,beach:3},cost:2,length:{short:5,week:5,long:3},climate:['warm'],setting:['city','coast'],specialist:'sights',reason:'A warm, food-led city break with viewpoints, neighbourhoods and coast within reach.'},
  rome:{tags:{thrills:2,food:5,shopping:3,indoor:4,outdoors:3,chill:2,wildlife:1,sights:5,beach:0},cost:2,length:{short:5,week:5,long:3},climate:['warm','hot'],setting:['city'],specialist:'sights',reason:'History, landmarks and food dominate a culture-heavy family city break.'},
  paris:{tags:{thrills:2,food:5,shopping:4,indoor:5,outdoors:3,chill:3,wildlife:1,sights:5,beach:0},cost:3,length:{short:5,week:5,long:3},climate:['warm','cool'],setting:['city'],specialist:'sights',reason:'Landmarks, museums, neighbourhoods and food make a strong culture-led family trip.'},
  london:{tags:{thrills:2,food:4,shopping:5,indoor:5,outdoors:4,chill:2,wildlife:2,sights:5,beach:0},cost:3,length:{short:5,week:5,long:4},climate:['cool','warm'],setting:['city'],specialist:'sights',reason:'Major sights, museums, markets and parks with enough variety for a longer city break.'},
  amsterdam:{tags:{thrills:2,food:4,shopping:4,indoor:5,outdoors:4,chill:3,wildlife:1,sights:5,beach:0},cost:2,length:{short:5,week:4,long:2},climate:['cool','warm'],setting:['city'],specialist:'sights',reason:'Compact sights, museums and neighbourhood exploring make a very manageable city break.'},
  copenhagen:{tags:{thrills:3,food:4,shopping:4,indoor:4,outdoors:4,chill:4,wildlife:2,sights:5,beach:1},cost:3,length:{short:5,week:4,long:2},climate:['cool'],setting:['city'],specialist:'sights',reason:'Easy-going city exploring with design, food, waterfronts and family attractions.'},
  edinburgh:{tags:{thrills:2,food:4,shopping:3,indoor:4,outdoors:4,chill:3,wildlife:2,sights:5,beach:1},cost:2,length:{short:5,week:4,long:2},climate:['cool'],setting:['city','nature'],specialist:'sights',reason:'History, walkable sights and easy access to dramatic outdoor scenery.'},
  dubai:{tags:{thrills:5,food:5,shopping:5,indoor:5,outdoors:3,chill:4,wildlife:2,sights:5,beach:4},cost:3,length:{short:4,week:5,long:3},climate:['hot'],setting:['city','mixed'],specialist:'sights',reason:'Big-ticket attractions, beaches, malls and indoor entertainment suit a high-energy family trip.'},
  singapore:{tags:{thrills:3,food:5,shopping:5,indoor:5,outdoors:4,chill:3,wildlife:5,sights:5,beach:1},cost:3,length:{short:4,week:5,long:3},climate:['hot'],setting:['city','mixed'],specialist:'wildlife',reason:'Food, wildlife, gardens and city attractions packed into an easy-to-navigate destination.'},
  tokyo:{tags:{thrills:4,food:5,shopping:5,indoor:5,outdoors:3,chill:2,wildlife:2,sights:5,beach:0},cost:3,length:{short:3,week:5,long:5},climate:['warm','cool'],setting:['city'],specialist:'sights',reason:'Huge variety for food, pop culture, sights, shopping and energetic family days.'},
  kyoto:{tags:{thrills:1,food:4,shopping:3,indoor:3,outdoors:5,chill:4,wildlife:2,sights:5,beach:0},cost:3,length:{short:4,week:5,long:3},climate:['warm','cool'],setting:['city','nature'],specialist:'sights',reason:'Temples, gardens and slower cultural exploring for a calmer Japan trip.'},
  bangkok:{tags:{thrills:3,food:5,shopping:5,indoor:4,outdoors:2,chill:2,wildlife:2,sights:5,beach:0},cost:1,length:{short:4,week:5,long:3},climate:['hot'],setting:['city'],specialist:'sights',reason:'Excellent-value food, markets and sights with a busy, energetic city feel.'},
  iceland:{tags:{thrills:4,food:2,shopping:1,indoor:2,outdoors:5,chill:4,wildlife:3,sights:5,beach:1},cost:3,length:{short:3,week:5,long:5},climate:['cool'],setting:['nature'],specialist:'outdoors',reason:'A scenery-first road-trip destination for waterfalls, geothermal stops and dramatic outdoors.'},
  'swiss-alps':{tags:{thrills:4,food:3,shopping:2,indoor:2,outdoors:5,chill:5,wildlife:2,sights:4,beach:0},cost:3,length:{short:3,week:5,long:5},climate:['cool'],setting:['nature'],specialist:'outdoors',reason:'Mountain scenery, active days and relaxed village time for outdoors-led families.'},
  'lake-garda':{tags:{thrills:3,food:5,shopping:3,indoor:2,outdoors:5,chill:5,wildlife:2,sights:4,beach:3},cost:2,length:{short:3,week:5,long:5},climate:['warm'],setting:['nature','mixed'],specialist:'outdoors',reason:'Lake scenery, food, towns and outdoor days create a relaxed multi-generation option.'},
  yellowstone:{tags:{thrills:2,food:1,shopping:1,indoor:1,outdoors:5,chill:4,wildlife:5,sights:5,beach:0},cost:2,length:{short:2,week:5,long:5},climate:['cool','warm'],setting:['nature'],specialist:'wildlife',reason:'Wildlife, geothermal landscapes and national-park days with very little urban distraction.'},
  winsford:{tags:{thrills:3,food:3,shopping:3,indoor:3,outdoors:5,chill:4,wildlife:4,sights:3,beach:2},cost:1,length:{short:4,week:4,long:3},climate:['cool','warm'],setting:['nature','mixed'],specialist:'outdoors',reason:'Value-friendly countryside, zoos and regional family days out.'},
  manchester:{tags:{thrills:3,food:4,shopping:4,indoor:5,outdoors:3,chill:2,wildlife:2,sights:4,beach:1},cost:2,length:{short:5,week:4,long:2},climate:['cool','warm'],setting:['city'],specialist:'sights',reason:'Indoor attractions, food, shopping and easy regional day trips suit a shorter break.'}
};
function archiveCurrentTrip(){
  if(!localStorage.getItem('ffvp_onboarded'))return;
  const p=state.profile;if(!p.destinationPreset&&!p.arrivalDate&&!state.saved.length&&!state.plans.length)return;
  const snapshot={id:crypto.randomUUID?.()||String(Date.now()),archivedAt:new Date().toISOString(),profile:JSON.parse(JSON.stringify(p)),saved:[...state.saved],tripStatuses:{...state.tripStatuses},plans:JSON.parse(JSON.stringify(state.plans)),discovered:{...state.discovered},recommendationFeedback:JSON.parse(JSON.stringify(state.recommendationFeedback||{})),decisionEvents:JSON.parse(JSON.stringify(state.decisionEvents||[]))};
  state.archives=[snapshot,...(state.archives||[])].slice(0,10);localStorage.setItem('ffvp_trip_archive',JSON.stringify(state.archives));
}
function clearCurrentTripState(){
  state.saved=[];state.tripStatuses={};state.plans=[];state.discovered={};state.prepDone={};state.localSeedKey='';state.recommendationRuns={};state.tomorrowMood=null;state.recommendationFeedback={};state.decisionEvents=[];state.nowContext={day:betaLocalDayStamp(),time2:false,cheap:false,lowEnergy:false,drive:false,food:false};localStorage.removeItem('ffvp_recommendation_feedback');localStorage.removeItem('ffvp_decision_events');localStorage.setItem('ffvp_now_context',JSON.stringify(state.nowContext));
  ['ffvp_saved','ffvp_trip_statuses','ffvp_plans','ffvp_discovered','ffvp_prep_done','ffvp_tomorrow_mood'].forEach(k=>localStorage.removeItem(k));
}
function startNewTrip(destinationKey='orlando'){
  if(commercialTripLimitReached()){openPricing('trip');showToast('The free trial includes one vacation. Your current trip is safe.');return;}
  archiveCurrentTrip();const old=state.profile;clearCurrentTripState();
  state.profile={...defaultProfile,members:JSON.parse(JSON.stringify(old.members?.length?old.members:defaultMembers())),maxDrive:old.maxDrive||30,budget:old.budget||'medium',energy:old.energy||'medium',interests:[...(old.interests||defaultProfile.interests)],heatAware:old.heatAware!==false,notes:old.notes||'',quickNotes:[...(old.quickNotes||[])],walkingTolerance:old.walkingTolerance||'medium',destinationPreset:destinationKey};
  countTripUse();localStorage.removeItem('ffvp_onboarded');saveProfile();closeNewTripDialog();loadProfileForm();showOnboarding();renderTripHub();
}
let destinationFinderRun=0;
function populateDestinationSelects(){
  const entries=Object.entries(locationPresets).sort((a,b)=>a[1].name.localeCompare(b[1].name));
  for(const id of ['setupDestinationPreset','newTripDestination']){
    const sel=$('#'+id);if(!sel)continue;const current=sel.value||state.profile.destinationPreset||'orlando';
    sel.innerHTML=entries.map(([k,p])=>`<option value="${k}">${escapeHtml(p.name)}</option>`).join('');
    sel.value=locationPresets[current]?current:'orlando';
  }
}
function openNewTripDialog(){const d=$('#newTripDialog');if(!d)return;populateDestinationSelects();if($('#finderOrigin'))$('#finderOrigin').value=localStorage.getItem('ffvp_finder_origin')||defaultFinderOrigin();$('#newTripStartPanel')?.classList.remove('hidden');$('#destinationFinderPanel')?.classList.add('hidden');$('#destinationFinderResults').innerHTML='';destinationFinderRun=0;applyTranslations();d.classList.remove('hidden');}
function closeNewTripDialog(){$('#newTripDialog')?.classList.add('hidden');}
function finderSelections(){return $$('.finder-chip.active').map(b=>b.dataset.destMood);}

function defaultFinderOrigin(){
  const saved=localStorage.getItem('ffvp_finder_origin');if(saved)return saved;
  const locale=(navigator.languages?.[0]||navigator.language||'').toLowerCase();
  if(locale.startsWith('en-gb')||locale.startsWith('en-ie'))return 'uk';
  if(locale.startsWith('en-us')||locale.startsWith('en-ca'))return 'us-east';
  if(locale.startsWith('en-au')||locale.startsWith('en-nz'))return 'australia';
  if(/^(fr|de|es|it|nl|pt|pl|da|sv|no|fi)/.test(locale))return 'europe';
  return 'other';
}
const destinationTravelZone={
  orlando:'na-east',anaheim:'na-west','new-york':'na-east','san-diego':'na-west',yellowstone:'na-west',maui:'hawaii',
  cancun:'caribbean','costa-rica':'caribbean',
  cornwall:'uk',london:'uk',edinburgh:'uk',winsford:'uk',manchester:'uk',
  tenerife:'europe',mallorca:'europe',algarve:'europe',barcelona:'europe',lisbon:'europe',rome:'europe',paris:'europe',amsterdam:'europe',copenhagen:'europe',iceland:'europe','swiss-alps':'europe','lake-garda':'europe',
  dubai:'middle-east',nairobi:'africa',kruger:'africa','cape-town':'africa',
  singapore:'asia',tokyo:'asia',kyoto:'asia',bangkok:'asia',bali:'asia',phuket:'asia'
};
const travelBurdenMatrix={
  uk:{uk:0,europe:.6,'middle-east':1.3,africa:1.6,'na-east':1.6,caribbean:1.8,'na-west':2.15,hawaii:2.8,asia:2.3},
  europe:{europe:.2,uk:.4,'middle-east':1.0,africa:1.3,'na-east':1.8,caribbean:2.0,'na-west':2.3,hawaii:2.9,asia:2.0},
  'us-east':{'na-east':.15,caribbean:.65,'na-west':1.1,hawaii:1.8,uk:1.7,europe:1.8,'middle-east':2.3,africa:2.5,asia:2.7},
  'us-west':{'na-west':.15,hawaii:.75,'na-east':1.1,caribbean:1.5,asia:1.8,uk:2.2,europe:2.2,'middle-east':2.5,africa:3.0},
  australia:{asia:1.0,hawaii:1.4,'na-west':1.8,'na-east':2.5,uk:3.0,europe:2.9,'middle-east':2.0,africa:2.6,caribbean:3.0},
  other:{uk:1.2,europe:1.1,'middle-east':1.1,africa:1.3,'na-east':1.4,'na-west':1.6,caribbean:1.5,hawaii:2.0,asia:1.5}
};
function travelBurden(origin,key){
  const zone=destinationTravelZone[key]||'europe';
  return travelBurdenMatrix[origin]?.[zone] ?? travelBurdenMatrix.other[zone] ?? 1.4;
}
function travelBurdenLabel(v){
  if(v<=.35)return 'near-home travel';
  if(v<=.8)return 'short-haul travel';
  if(v<=1.5)return 'mid-haul travel';
  return 'long-haul travel';
}
function climateFit(d,want){if(!want||want==='any')return 0;return d.climate?.includes(want)?12:-8;}
function settingFit(d,want){if(!want||want==='any')return 0;return d.setting?.includes(want)?11:(d.setting?.includes('mixed')?3:-7);}
function scoreDestinations(){
  const moods=finderSelections(),budget=$('#finderBudget')?.value||'medium',length=$('#finderLength')?.value||'week',climate=$('#finderClimate')?.value||'any',setting=$('#finderSetting')?.value||'any',origin=$('#finderOrigin')?.value||defaultFinderOrigin();
  if(!moods.length)return [];
  localStorage.setItem('ffvp_finder_origin',origin);
  const targetCost={low:1,medium:2,high:3}[budget];
  return Object.entries(destinationFinderProfiles).map(([key,d])=>{
    const burden=travelBurden(origin,key),effectiveCost=d.cost+burden;
    let hardFail=false;
    if(budget==='low' && effectiveCost>3.0)hardFail=true;
    if(length==='short' && burden>1.55)hardFail=true;
    let score=(d.length[length]||3)*5+climateFit(d,climate)+settingFit(d,setting);
    const matched=[];let weakest=5;
    for(const mood of moods){const v=d.tags[mood]||0;weakest=Math.min(weakest,v);score+=v*v*2;if(v>=4)matched.push(mood);if(v<=1)score-=25;else if(v===2)score-=8;}
    score-=Math.abs(d.cost-targetCost)*8;
    score-=burden*(budget==='low'?14:budget==='medium'?8:3);
    if(length==='week'&&burden>2.0)score-=12;
    if(length==='short'&&burden>1.0)score-=12;
    if(moods.length>1)score+=weakest*6;
    const fitNotes=[...matched.map(finderMoodLabel)];
    fitNotes.push(length==='short'?'3–4 days':length==='week'?'5–8 days':'9+ days');
    if(budget==='low')fitNotes.push(effectiveCost<=2.35?'strong value':effectiveCost<=3?'budget-conscious':'costly');
    else if(budget==='medium'&&effectiveCost<=3.5)fitNotes.push('comfortable budget fit');
    if(burden<=.8)fitNotes.push(travelBurdenLabel(burden));
    const tradeoffs=[];
    if(burden>1.5)tradeoffs.push(travelBurdenLabel(burden));
    if(d.cost===3&&budget!=='high')tradeoffs.push('higher local costs');
    const preset=presetFor(key);return {key,name:preset?.name||key,score,reason:d.reason,matched,climate:d.climate||[],setting:d.setting||[],weakest,hardFail,effectiveCost,burden,fitNotes,tradeoffs};
  }).filter(x=>!x.hardFail).sort((a,b)=>b.score-a.score);
}
function finderMoodLabel(m){return {thrills:t('thrills','Thrills'),wildlife:t('wildlife','Wildlife'),beach:t('beaches','Beaches'),sights:t('sights','Sights'),outdoors:t('outdoors','Outdoors'),food:t('food','Food'),shopping:t('shopping','Shopping'),chill:t('chill','Relaxing')}[m]||m;}
function renderFinderHint(){const n=finderSelections().length,el=$('#finderSelectionHint');if(el)el.textContent=n?`${n} / 3 priorities selected`:t('finderNeed','Choose at least one priority to get started.');}
function renderDestinationFinder(forceDifferent=false){
  const root=$('#destinationFinderResults');if(!root)return;renderFinderHint();const all=scoreDestinations();
  if(!all.length){root.innerHTML=`<div class="finder-empty">That combination is a bit tight. Try easing the budget, trip length or one priority and we’ll have another look.</div>`;if($('#findDestinations'))$('#findDestinations').textContent=t('showIdeas','Show me ideas');return;}
  const topScore=all[0]?.score||1;
  const qualityPool=all.filter((x,i)=>i<18 && x.score>=topScore-34 && x.weakest>=2);
  const pool=qualityPool.length?qualityPool:all.slice(0,8);
  if(forceDifferent)destinationFinderRun++;
  const pageSize=commercialTier()==='explorer'?3:5;let start=destinationFinderRun*pageSize;
  if(start>=pool.length){destinationFinderRun=0;start=0;}
  let results=pool.slice(start,start+pageSize);if(!results.length)results=pool.slice(0,pageSize);
  const bottomScore=pool[Math.min(pool.length-1,10)]?.score ?? pool[pool.length-1]?.score ?? 0,range=Math.max(1,topScore-bottomScore);
  root.innerHTML=results.map((r,i)=>{
    const pct=Math.max(58,Math.min(98,Math.round(74+((r.score-bottomScore)/range)*24)));
    const fit=r.fitNotes?.length?r.fitNotes.slice(0,4).join(' · '):(r.matched.length?r.matched.map(finderMoodLabel).join(' · '):finderSelections().map(finderMoodLabel).join(' · '));
    const trade=r.tradeoffs?.length?`<div class="destination-tradeoff">Worth knowing: ${escapeHtml(r.tradeoffs.join(' · '))}</div>`:'';
    return `<article class="destination-result"><div class="destination-rank">${start+i+1}</div><div><div class="destination-title-row"><h3>${escapeHtml(r.name)}</h3><span class="destination-match">${pct}% fit</span></div><p>${escapeHtml(r.reason)}</p><div class="destination-fit">Good match for: ${escapeHtml(fit)}</div>${trade}</div><button class="small-btn primary-small choose-destination" data-destination="${r.key}" type="button">${t('planThis')}</button></article>`;
  }).join('');
  if(pool.length<=pageSize)root.insertAdjacentHTML('beforeend',`<div class="finder-empty">These are the ones that genuinely fit what you asked for. Change a priority if you want to widen the net.</div>`);
  else if(start+pageSize>=pool.length)root.insertAdjacentHTML('beforeend',`<div class="finder-empty">That’s the end of the good-fit options for this mix. I’d rather loop back than start suggesting trips that don’t really suit you.</div>`);
  $$('.choose-destination',root).forEach(b=>b.addEventListener('click',()=>startNewTrip(b.dataset.destination)));
  if($('#findDestinations'))$('#findDestinations').textContent=t('finderDifferent','Show me different ideas');
}
function renderPreviousTrips(){const root=$('#previousTripsList');if(!root)return;const list=state.archives||[];root.innerHTML=list.length?list.map(a=>{const p=a.profile||{},dest=presetFor(p.destinationPreset)?.name||p.destinationPreset||'Trip';const when=p.arrivalDate?new Date(`${p.arrivalDate}T12:00:00`).toLocaleDateString(appLocale(),{year:'numeric',month:'short',day:'numeric'}):new Date(a.archivedAt).toLocaleDateString(appLocale(),{year:'numeric',month:'short'});return `<article class="plan-row archive-row" data-id="${a.id}"><div><b>${escapeHtml(p.familyName||dest)}</b><small>${escapeHtml(dest)} · ${when}</small></div><button class="text-btn restore-trip" type="button">${t('restore')}</button></article>`;}).join(''):`<div class="trip-empty"><b>${t('previousTrips')}</b><small>Your completed or replaced trips will appear here.</small></div>`;$$('.restore-trip',root).forEach(b=>b.addEventListener('click',()=>restoreArchivedTrip(b.closest('.archive-row').dataset.id)));}
function restoreArchivedTrip(id){const a=(state.archives||[]).find(x=>x.id===id);if(!a)return;if(!confirm('Replace the current trip with this saved vacation?'))return;archiveCurrentTrip();state.profile=a.profile;state.saved=a.saved||[];state.tripStatuses=a.tripStatuses||{};state.plans=a.plans||[];state.discovered=a.discovered||{};state.recommendationFeedback=a.recommendationFeedback||{};state.decisionEvents=a.decisionEvents||[];localStorage.setItem('ffvp_profile',JSON.stringify(state.profile));localStorage.setItem('ffvp_saved',JSON.stringify(state.saved));localStorage.setItem('ffvp_trip_statuses',JSON.stringify(state.tripStatuses));localStorage.setItem('ffvp_plans',JSON.stringify(state.plans));localStorage.setItem('ffvp_discovered',JSON.stringify(state.discovered));localStorage.setItem('ffvp_recommendation_feedback',JSON.stringify(state.recommendationFeedback));localStorage.setItem('ffvp_decision_events',JSON.stringify(state.decisionEvents));localStorage.setItem('ffvp_onboarded','1');loadProfileForm();renderTripHub();renderExplore();renderDecisionMetrics();renderNowContext();updateGreeting();showToast('Holiday restored');}
$('#newTripBtn')?.addEventListener('click',openNewTripDialog);$('#newTripBtnFamily')?.addEventListener('click',openNewTripDialog);$('#closeNewTrip')?.addEventListener('click',closeNewTripDialog);$('#newTripDialog')?.addEventListener('click',e=>{if(e.target.id==='newTripDialog')closeNewTripDialog();});$('#startKnownTrip')?.addEventListener('click',()=>startNewTrip($('#newTripDestination')?.value||'orlando'));$('#openDestinationFinder')?.addEventListener('click',()=>{$('#newTripStartPanel').classList.add('hidden');$('#destinationFinderPanel').classList.remove('hidden');renderDestinationFinder();});$('#backNewTrip')?.addEventListener('click',()=>{$('#destinationFinderPanel').classList.add('hidden');$('#newTripStartPanel').classList.remove('hidden');});$$('.finder-chip').forEach(b=>b.addEventListener('click',()=>{const active=finderSelections();if(!b.classList.contains('active')&&active.length>=3){showToast('Pick up to 3 things that matter most');return;}b.classList.toggle('active');destinationFinderRun=0;renderDestinationFinder();}));['finderOrigin','finderBudget','finderLength','finderClimate','finderSetting'].forEach(id=>$('#'+id)?.addEventListener('change',()=>{destinationFinderRun=0;renderDestinationFinder();}));$('#findDestinations')?.addEventListener('click',()=>{if(commercialTier()==='explorer'&&$('#destinationFinderResults .destination-result')){openPricing('finder');return;}renderDestinationFinder(true);});

function clearTripLocalData(includeSettings=false){
  const keys=['ffvp_profile','ffvp_onboarded','ffvp_saved','ffvp_trip_statuses','ffvp_plans','ffvp_discovered','ffvp_prep_done','ffvp_recommendation_feedback','ffvp_decision_events','ffvp_now_context'];
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
  $('#newUserTest')?.addEventListener('click',()=>{if(!confirm('Start a clean new-user test? This clears the saved family, trip, shortlist and memories on this device.'))return;const keepForce=localStorage.getItem('ffvp_force_onboarding')??'1';const keepLanding=localStorage.getItem('ffvp_force_landing')??'1';clearTripLocalData(false);['ffvp_commercial_tier','ffvp_fresh_used','ffvp_trip_uses','ffvp_test_ad_hidden'].forEach(k=>localStorage.removeItem(k));localStorage.setItem('ffvp_force_onboarding',keepForce);localStorage.setItem('ffvp_force_landing',keepLanding);location.reload();});
  $('#resetAppData')?.addEventListener('click',()=>{if(!confirm('Reset ALL FERDA data and testing settings on this device?'))return;localStorage.clear();location.reload();});
  $('#openPricingBtn')?.addEventListener('click',()=>openPricing('choice'));
  $('#closePricing')?.addEventListener('click',closePricing);
  $('#pricingDialog')?.addEventListener('click',e=>{if(e.target.id==='pricingDialog')closePricing();});
  $$('.choose-test-plan').forEach(b=>b.addEventListener('click',()=>{setCommercialTier(b.dataset.plan,{resetUsage:true});closePricing();showToast(`${commercialPlan().name} enabled for beta testing — no payment taken.`);}));
  $('#applyCommercialTest')?.addEventListener('click',()=>{setCommercialTier($('#testCommercialPlan').value);setFreshUsed(+$('#testFreshUsed').value||0);localStorage.setItem('ffvp_trip_uses',String(Math.max(0,+$('#testTripUses').value||0)));updateCommercialUI();showToast('Commercial test state applied');});
  $('#exhaustFreshIdeas')?.addEventListener('click',()=>{const p=commercialPlan();setFreshUsed(Math.max(0,p.freshLimit-1));showToast('One Fresh Idea left — ready to test the limit');});
  $('#resetDecisionLearning')?.addEventListener('click',()=>{state.recommendationFeedback={};state.decisionEvents=[];state.nowContext={day:betaLocalDayStamp(),time2:false,cheap:false,lowEnergy:false,drive:false,food:false};localStorage.removeItem('ffvp_recommendation_feedback');localStorage.removeItem('ffvp_decision_events');localStorage.setItem('ffvp_now_context',JSON.stringify(state.nowContext));renderNowContext();renderDecisionMetrics();showToast('What Now learning reset');});
  $('#resetCommercialTest')?.addEventListener('click',()=>{['ffvp_commercial_tier','ffvp_fresh_used','ffvp_trip_uses','ffvp_test_ad_hidden'].forEach(k=>localStorage.removeItem(k));updateCommercialUI();showToast('Commercial test reset to Free Trial');});
  $('#dismissTestAd')?.addEventListener('click',()=>{localStorage.setItem('ffvp_test_ad_hidden','1');updateCommercialUI();});
}
initBetaTestingTools();

function updateOnlineState(){const b=$('#offlineBanner');if(!b)return;b.classList.toggle('hidden',navigator.onLine);}
window.addEventListener('online',updateOnlineState);window.addEventListener('offline',updateOnlineState);updateOnlineState();
setInterval(()=>{updateGreeting();},60000);
weatherRefreshTimer=setInterval(()=>{if(document.visibilityState==='visible'&&state.coords)loadWeather({silent:true});},15*60*1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.coords)loadWeather({silent:true});});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').addEventListener('click',async()=>{if(!state.deferredInstall)return;state.deferredInstall.prompt();await state.deferredInstall.userChoice;state.deferredInstall=null;$('#installBtn').classList.add('hidden');});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

populateDestinationSelects();applyTranslations();updateCommercialUI();loadProfileForm();$('#testLocationSelect').value=presetFor(state.locationMode)?state.locationMode:'gps';updateGreeting();renderExplore();renderTripHub();renderEssentials();requestLocation();if(betaForceLanding())showLanding();else if(betaForceOnboarding()||!localStorage.getItem('ffvp_onboarded'))showOnboarding();

renderNowContext();renderDecisionMetrics();
