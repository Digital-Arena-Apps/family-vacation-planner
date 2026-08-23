import { FERDA_ASSETS } from './assets.js';

function brandedImage(src, fallback, className, alt = '') {
  return `
    <span class="${className}" aria-hidden="${alt ? 'false' : 'true'}">
      <span class="ferda-asset-fallback">${fallback}</span>
      <img src="${src}" alt="${alt}" />
    </span>
  `;
}

function wireImageFallbacks(root) {
  root.querySelectorAll('.ferda-brand img, .ferda-ui-image img, .preferences-principle-art').forEach(img => {
    if (img.dataset.ferdaFallbackWired) return;
    img.dataset.ferdaFallbackWired = 'true';
    img.addEventListener('error', () => {
      img.hidden = true;
      img.closest('.ferda-brand-mark, .ferda-ui-image')?.classList.add('asset-missing');
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
      brand.innerHTML = `
        ${brandedImage(FERDA_ASSETS.brand.logoMark, 'F', 'ferda-brand-mark', 'FERDA')}
        <span class="ferda-brand-copy">
          <b>FERDA</b>
          <small>FAMILY VACATION PLANNER · V2 PREVIEW</small>
        </span>
      `;
    }
  }

  const foodRow = root.querySelector('#foodNeedsRow');
  if (foodRow) {
    const icon = foodRow.querySelector('.preference-icon');
    if (icon) {
      icon.classList.add('ferda-ui-image');
      icon.innerHTML = `<span class="ferda-asset-fallback">⌁</span><img src="${FERDA_ASSETS.ui.foodDietary}" alt="" />`;
    }
  }

  const preferencesRow = root.querySelector('#familyPreferences');
  if (preferencesRow) {
    const icon = preferencesRow.querySelector('.preference-icon');
    if (icon) {
      icon.classList.add('ferda-ui-image');
      icon.innerHTML = `<span class="ferda-asset-fallback">⚙</span><img src="${FERDA_ASSETS.ui.tripPreferences}" alt="" />`;
    }
  }

  const principleImage = root.querySelector('.preferences-principle-art');
  if (principleImage) {
    principleImage.src = FERDA_ASSETS.ui.preferencesGuidance;
    principleImage.alt = '';
  }

  root.querySelectorAll('.eyebrow').forEach(eyebrow => eyebrow.classList.add('ferda-eyebrow'));
  wireImageFallbacks(root);
}
