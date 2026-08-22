// V2.5 demo bootstrap: loads the focused decision-engine layer without replacing the existing app.
(async()=>{
  const chunks={
    js:['/.demo-build/js1.txt','/.demo-build/js2.txt','/.demo-build/js3.txt','/.demo-build/js4.txt'],
    css:['/.demo-build/css1.txt','/.demo-build/css2.txt']
  };

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

  try{
    const [cssPayload,jsPayload]=await Promise.all([loadTextParts(chunks.css),loadTextParts(chunks.js)]);
    let [css,js]=await Promise.all([ungzipBase64(cssPayload),ungzipBase64(jsPayload)]);

    // Small demo-only instrumentation repair: keep the rejected id alive until the event is recorded.
    js=js.replace(
      "saveState(); closeFeedback(); updateChosenSummary(); renderWhatNow();\n    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_rejected',{id:pendingRejectId,reason,source:'v2.5-demo'}); } catch {}",
      "saveState(); updateChosenSummary(); renderWhatNow();\n    try { if(typeof trackDecisionEvent==='function') trackDecisionEvent('demo_recommendation_rejected',{id:pendingRejectId,reason,source:'v2.5-demo'}); } catch {}\n    closeFeedback();"
    );

    const style=document.createElement('style');
    style.id='vpDecisionDemoStyles';
    style.textContent=css;
    document.head.appendChild(style);

    const script=document.createElement('script');
    script.id='vpDecisionDemoRuntime';
    script.textContent=js;
    document.body.appendChild(script);

    // Make the hosted demo land on the scenario instead of forcing a first-time viewer through setup.
    setTimeout(()=>{
      const launcher=document.querySelector('#vpLandingDemo:not(.hidden),#vpOnboardingDemo:not(.hidden)');
      if(launcher)launcher.click();
      reveal();
    },40);
    setTimeout(reveal,500);
  }catch(error){
    console.error('Decision demo failed to load',error);
    reveal();
  }
})();
