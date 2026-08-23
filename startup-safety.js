// Phase 1 startup escape hatch.
// This is intentionally independent of decision-demo-loader.js so a bootstrap failure
// can never leave the user trapped behind the loading splash indefinitely.
(()=>{
  'use strict';

  const diagnostics=window.__VP_PHASE1_DIAGNOSTICS__ ||= {errors:[],fallbackTriggered:false};
  const record=(kind,value)=>{
    const message=String(value?.message||value||'Unknown startup error');
    diagnostics.errors.push({kind,message,at:new Date().toISOString()});
    if(diagnostics.errors.length>8)diagnostics.errors.shift();
  };

  window.addEventListener('error',event=>record('error',event.error||event.message));
  window.addEventListener('unhandledrejection',event=>record('unhandledrejection',event.reason));

  function escapeStuckSplash(){
    const splash=document.querySelector('#vpStartupSplash');
    if(!splash)return;
    if(window.__VP_BOOT_STATE__?.revealed)return;

    diagnostics.fallbackTriggered=true;
    diagnostics.fallbackAt=new Date().toISOString();

    const landing=document.querySelector('#landingScreen');
    const onboarding=document.querySelector('#onboarding');
    landing?.classList.add('hidden');

    let onboarded=false;
    try{onboarded=!!localStorage.getItem('ffvp_onboarded');}catch{}
    if(onboarded)onboarding?.classList.add('hidden');
    else onboarding?.classList.remove('hidden');

    splash.classList.add('vp-startup-leaving');
    setTimeout(()=>{
      splash.remove();
      document.querySelector('#vpStartupCriticalCss')?.remove();
    },240);

    console.error('[Phase 1] Orlando bootstrap did not reveal the app before the safety deadline.',diagnostics.errors);
  }

  // The loader's own deadline currently lives inside init(). This independent deadline
  // still fires if init() throws before scheduling its timers or never runs at all.
  setTimeout(escapeStuckSplash,3600);
})();
