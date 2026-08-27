const HIDE_SELECTORS = [
  '.ferda-focus-tabs',
  '.ferda-context-strip',
  '.ferda-live-status',
  '.ferda-question',
  '.ferda-results-heading',
  '.ferda-results',
  '.ferda-transport-summary',
  '.ferda-transport-actions',
  '.ferda-transport-list'
];

function hasDestination(tripStore) {
  return Boolean(String(tripStore.get()?.destination || '').trim());
}

function apply(root, tripStore, options) {
  const main = root.querySelector('.explore-page');
  if (!main) return;

  const existing = main.querySelector('.ferda-explore-setup');
  if (hasDestination(tripStore)) {
    existing?.remove();
    HIDE_SELECTORS.forEach(selector => {
      root.querySelectorAll(selector).forEach(element => element.classList.remove('ferda-launch-hidden'));
    });
    return;
  }

  HIDE_SELECTORS.forEach(selector => {
    root.querySelectorAll(selector).forEach(element => element.classList.add('ferda-launch-hidden'));
  });

  if (existing) return;
  const hero = main.querySelector('.ask-ferda-hero');
  const card = document.createElement('section');
  card.className = 'ferda-explore-setup';
  card.innerHTML = `
    <span class="ferda-explore-setup-icon"><img src="/brand/ferda-ui-icon-nav-trip.webp" alt="" aria-hidden="true" /></span>
    <div>
      <span class="section-kicker">ONE THING FIRST</span>
      <h2>Where are you going?</h2>
      <p>Set your destination and FERDA can look for real activities, food and shopping nearby instead of making generic suggestions.</p>
      <button type="button" data-ferda-set-destination>Set destination</button>
    </div>`;
  hero?.insertAdjacentElement('afterend', card);
  card.querySelector('[data-ferda-set-destination]')?.addEventListener('click', () => options.onTrip?.());
}

export function enhanceExploreLaunchGuard(root, tripStore, options = {}) {
  apply(root, tripStore, options);
  const main = root.querySelector('.explore-page');
  if (!main) return () => {};
  const observer = new MutationObserver(() => apply(root, tripStore, options));
  observer.observe(main, { childList: true, subtree: true });
  return () => observer.disconnect();
}
