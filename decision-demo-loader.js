// V2.5.3 demo bootstrap: clean first-use onboarding before the focused decision-engine scenario.
(async()=>{
  const DEMO_SESSION_KEY='vp_v253_clean_session';
  const chunks={
    js:['/.demo-build/js1.txt','/.demo-build/js2.txt','/.demo-build/js3.txt','/.demo-build/js4.txt'],
    css:['/.demo-build/css1.txt','/.demo-build/css2.txt']
  };

  // A new browser session should feel like a genuine first-time demo, but a refresh in the
  // same session must not erase the onboarding the viewer has just completed.
  if(!sessionStorage.getItem(DEMO_SESSION_KEY)){
    const resetKeys=[
      'ffvp_profile','ffvp_onboarded','ffvp_saved','ffvp_trip_statuses','ffvp_plans',
      'ffvp_discovered','ffvp_prep_done','ffvp_recommendation_feedback','ffvp_decision_events',
      'ffvp_now_context','ffvp_tomorrow_mood','ffvp_trip_archive','ffvp_commercial_tier',
      'ffvp_fresh_used','ffvp_trip_uses','ffvp_test_ad_hidden','ffvp_force_onboarding',
      'ffvp_force_landing'
    ];
    resetKeys.forEach(k=>localStorage.removeItem(k));
    // Remove only prior decision-demo state; leave unrelated UI preferences such as language alone.
    for(let i=localStorage.length-1;i>=0;i--){
      const key=localStorage.key(i);
      if(key && (/demo/i.test(key)||key.startsWith('vp_')))localStorage.removeItem(key);
    }
    localStorage.setItem('ffvp_force_landing','1');
    sessionStorage.setItem(DEMO_SESSION_KEY,'1');
    location.reload();
    return;
  }

  async function loadTextParts(paths){
    const responses=await Promise.all(paths.map(path=>fetch(path,{cache:'no-store'})));
    for(const r of responses){if(!r.ok)throw new Error(`Demo payload failed: ${r.url} (${r.status})`);}
    return (await Promise.all(responses.map(r=>r.text()))).map(s=>s.trim()).join('');
  }

  async function ungzipBase64(value){
    if(typeof DecompressionStream==='undefined')throw new Error('This browser does not support the demo decompression stream.');
    const binary=atob(value);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }

  function reveal(){document.documentElement.classList.add('vp-demo-ready');}
  function demoLauncher(){return document.querySelector('#vpLandingDemo:not(.hidden),#vpOnboardingDemo:not(.hidden)');}
  function launchDecisionDemo(){
    const launcher=demoLauncher();
    if(launcher){launcher.click();return true;}
    return false;
  }
  function launchWhenReady(attempt=0){
    if(launchDecisionDemo())return;
    if(attempt<20)setTimeout(()=>launchWhenReady(attempt+1),75);
  }

  try{
    const [cssPayload,jsPayload]=await Promise.all([loadTextParts(chunks.css),loadTextParts(chunks.js)]);
    let [css,js]=await Promise.all([ungzipBase64(cssPayload),ungzipBase64(jsPayload)]);

    // Keep the rejected id alive until the demo analytics event is recorded.
    js=js.replace(
      "saveState(); closeFeedback(); updateChosenSummary(); renderWhatNow();\n    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_rejected',{id:pendingRejectId,reason,source:'v2.5-demo'}); } catch {}",
      "saveState(); updateChosenSummary(); renderWhatNow();\n    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_rejected',{id:pendingRejectId,reason,source:'v2.5-demo'}); } catch {}\n    closeFeedback();"
    );

    const style=document.createElement('style');
    style.id='vpDecisionDemoStyles';
    style.textContent=css+`\n/* Clean demo: onboarding is intentionally required. */\n#skipSetup{display:none!important}`;
    document.head.appendChild(style);

    const script=document.createElement('script');
    script.id='vpDecisionDemoRuntime';
    script.textContent=js;
    document.body.appendChild(script);

    // The Orlando scenario is the deliberate wedge for this demonstration. Keep the onboarding
    // experience real, but prevent a destination choice that would contradict the seeded demo data.
    const destination=document.querySelector('#setupDestinationPreset');
    if(destination){
      destination.value='orlando';
      destination.disabled=true;
      const help=destination.parentElement?.querySelector('small');
      if(help)help.textContent='This decision-engine demo is set in Orlando / Central Florida.';
    }

    // Landing is shown only to introduce the product; after the viewer starts, do not force it again.
    document.querySelector('#landingPrimary')?.addEventListener('click',()=>{
      localStorage.removeItem('ffvp_force_landing');
    },{once:true});

    // Completing onboarding is the gate into the seeded decision-engine scenario.
    document.querySelector('#onboardingForm')?.addEventListener('submit',()=>{
      localStorage.removeItem('ffvp_force_landing');
      setTimeout(()=>launchWhenReady(),120);
    });

    // If the viewer refreshes after completing onboarding in this same browser session, resume the demo.
    if(localStorage.getItem('ffvp_onboarded'))setTimeout(()=>launchWhenReady(),120);

    reveal();
  }catch(error){
    console.error('Decision demo failed to load',error);
    reveal();
  }
})();
