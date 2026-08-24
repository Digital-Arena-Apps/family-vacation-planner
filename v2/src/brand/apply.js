import { FERDA_ASSETS } from './assets.js';
import { FERDA_APP_ICON } from './runtime-assets.js';

function image(src, fallback = '', className = 'ferda-ui-image', alt = '') {
  return `<span class="${className}" ${alt ? '' : 'aria-hidden="true"'}><span class="ferda-asset-fallback">${fallback}</span><img src="${src}" alt="${alt}" /></span>`;
}

function wireImageFallbacks(root) {
  root.querySelectorAll('.ferda-brand-mark img, .ferda-ui-image img, .ferda-nav-icon img, .ferda-button-icon img').forEach(img => {
    if (img.dataset.ferdaFallbackWired) return;
    img.dataset.ferdaFallbackWired = 'true';
    img.addEventListener('error', () => {
      img.hidden = true;
      img.parentElement?.classList.add('asset-missing');
    }, { once: true });
  });
}

export function applyFerdaBranding(root) {
  document.title = 'FERDA — Family Vacation Planner';
  const topbar = root.querySelector('.v2-topbar');
  if (topbar) {
    topbar.classList.add('ferda-topbar');
    const brand = topbar.querySelector('.v2-brand');
    if (brand) {
      brand.classList.add('ferda-brand');
      brand.innerHTML = `${image(FERDA_APP_ICON, 'F', 'ferda-brand-mark', 'FERDA app icon')}<span class="ferda-brand-copy"><b>FERDA</b><small>FAMILY VACATION PLANNER · V2 PREVIEW</small></span>`;
    }
  }
  const crewIcon = root.querySelector('.crew-summary-icon');
  if (crewIcon) { crewIcon.classList.add('ferda-ui-image'); crewIcon.innerHTML = `<span class="ferda-asset-fallback">◎</span><img src="${FERDA_ASSETS.ui.holidayCrew}" alt="" />`; }
  const addTop = root.querySelector('#addPersonTop');
  if (addTop) addTop.innerHTML = `${image(FERDA_ASSETS.ui.addPerson, '+', 'ferda-button-icon')}<span>Add person</span>`;
  const foodRow = root.querySelector('#foodNeedsRow .preference-icon');
  if (foodRow) { foodRow.classList.add('ferda-ui-image'); foodRow.innerHTML = `<span class="ferda-asset-fallback">⌁</span><img src="${FERDA_ASSETS.ui.foodDietary}" alt="" />`; }
  const preferencesRow = root.querySelector('#familyPreferences .preference-icon');
  if (preferencesRow) { preferencesRow.classList.add('ferda-ui-image'); preferencesRow.innerHTML = `<span class="ferda-asset-fallback">⚙</span><img src="${FERDA_ASSETS.ui.tripPreferences}" alt="" />`; }
  const nav = root.querySelectorAll('.v2-nav button');
  const navAssets = [FERDA_ASSETS.ui.navToday, FERDA_ASSETS.ui.navExplore, FERDA_ASSETS.ui.navTrip, FERDA_ASSETS.ui.navFamily];
  const navFallbacks = ['⌂', '⌕', '▣', '☻'];
  nav.forEach((button, index) => {
    const slot = button.querySelector('span');
    if (slot && navAssets[index]) {
      slot.className = 'ferda-nav-icon';
      slot.innerHTML = `<span class="ferda-asset-fallback">${navFallbacks[index]}</span><img src="${navAssets[index]}" alt="" />`;
    }
  });
  const dietaryPrinciple = root.querySelector('.dietary-principle > span');
  if (dietaryPrinciple) { dietaryPrinciple.classList.add('ferda-ui-image'); dietaryPrinciple.innerHTML = `<span class="ferda-asset-fallback">!</span><img src="${FERDA_ASSETS.ui.foodDietary}" alt="" />`; }
  const principleImage = root.querySelector('.preferences-principle-art');
  if (principleImage) principleImage.src = FERDA_ASSETS.ui.tripPreferences;
  root.querySelectorAll('.eyebrow, .section-kicker').forEach(el => el.classList.add('ferda-eyebrow'));
  wireImageFallbacks(root);
}
