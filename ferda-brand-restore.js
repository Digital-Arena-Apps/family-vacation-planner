(()=>{
  'use strict';
  if(window.__FERDA_BRAND_RESTORE__) return;
  window.__FERDA_BRAND_RESTORE__=true;

  const ASSETS={
    mark:'https://drive.google.com/uc?export=view&id=1qBfwfQmkPur6O1EMWicFIAz2mZo8BoV-',
    today:'https://drive.google.com/uc?export=view&id=17hlTiGUlIH2Z_QmvaA1bUm_sIi8aMe9w',
    explore:'https://drive.google.com/uc?export=view&id=1fdsjrhbK_-_3PTtol7-H3iGvU1FksGF1',
    trip:'https://drive.google.com/uc?export=view&id=1nQI1JHP_jonobokyITe9TC5FMrEVwOBB',
    family:'https://drive.google.com/uc?export=view&id=1HaiRjrXp-1iMgfenllUtVSo8uAj-T4nv'
  };
  const $=(s,r=document)=>r.querySelector(s);

  function addStyles(){
    if($('#ferdaBrandRestoreStyles')) return;
    const l=document.createElement('link');
    l.id='ferdaBrandRestoreStyles'; l.rel='stylesheet'; l.href='ferda-brand-restore.css?v=0.1.1';
    document.head.appendChild(l);
  }
  function img(src,cls,alt=''){
    const el=document.createElement('img'); el.src=src; el.className=cls; el.alt=alt; return el;
  }
  function restoreHeader(){
    const brand=$('.ferda-brand'); if(!brand) return;
    const old=$('.ferda-mark',brand); if(old) old.replaceWith(img(ASSETS.mark,'ferda-production-mark',''));
  }
  function restoreNavigation(){
    const defs={today:ASSETS.today,explore:ASSETS.explore,saved:ASSETS.trip,family:ASSETS.family};
    Object.entries(defs).forEach(([target,src])=>{
      const b=$(`.bottom-nav .nav-item[data-target="${target}"]`); if(!b) return;
      const glyph=$('.ferda-nav-glyph',b); if(glyph) glyph.replaceWith(img(src,'ferda-nav-icon',''));
    });
  }
  function restoreLanding(){
    const copy=$('.ferda-landing-copy'); if(!copy) return;
    const old=$('.ferda-mark-large',copy);
    if(old) old.replaceWith(img(ASSETS.mark,'ferda-landing-logo','FERDA'));
  }
  function restoreOnboarding(){
    const brand=$('.ferda-onboarding-brand'); if(!brand) return;
    const old=$('.ferda-mark',brand); if(old) old.replaceWith(img(ASSETS.mark,'',''));
  }
  function run(){addStyles();restoreHeader();restoreNavigation();restoreLanding();restoreOnboarding();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(run,150));
  else setTimeout(run,150);
  setTimeout(run,700);
})();
