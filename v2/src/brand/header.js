import { FERDA_ASSETS } from './assets.js';

export function ferdaHeaderMarkup() {
  return `
    <header class="v2-topbar ferda-topbar">
      <div class="v2-brand ferda-brand">
        <span class="ferda-brand-mark" aria-hidden="true">
          <span class="ferda-brand-fallback">F</span>
          <img src="${FERDA_ASSETS.brand.logoMark}" alt="" />
        </span>
        <div class="ferda-brand-copy">
          <b>FERDA</b>
          <small>FAMILY VACATION PLANNER · V2 PREVIEW</small>
        </div>
      </div>
      <div class="v2-status"><span></span> Fresh build</div>
    </header>
  `;
}
