// FERDA Core 0.1 bootstrap — product-first layer over the existing planner engine.
(()=>{
  'use strict';
  if(window.__FERDA_BOOTSTRAP_01__) return;
  window.__FERDA_BOOTSTRAP_01__=true;
  const core=document.createElement('script');
  core.src='ferda-v1.js?v=0.1.1';
  core.defer=true;
  core.onload=()=>{
    const brand=document.createElement('script');
    brand.src='ferda-brand-restore.js?v=0.1.1';
    brand.defer=true;
    document.head.appendChild(brand);
  };
  document.head.appendChild(core);
})();
