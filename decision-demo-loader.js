// FERDA Core 0.1 bootstrap — product-first layer over the existing planner engine.
(()=>{
  'use strict';
  if(window.__FERDA_BOOTSTRAP_01__) return;
  window.__FERDA_BOOTSTRAP_01__=true;
  const script=document.createElement('script');
  script.src='ferda-v1.js?v=0.1.0';
  script.defer=true;
  document.head.appendChild(script);
})();
