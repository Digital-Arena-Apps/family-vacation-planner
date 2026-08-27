import './styles.css';
import './context.css';
import { FERDA_CONTEXT_OPTIONS } from './context-dataset.js';
import {
  addTypeForIntent,
  buildTransportAdvice,
  getExploreIntent,
  normaliseExploreIntent,
  rankForIntent
} from './context.js';

const FOCUS_LABELS = Object.freeze([
  ['all', 'Explore'],
  ['activities', 'Activities'],
  ['dining', 'Dining'],
  ['shopping', 'Shopping'],
  ['transport', 'Transport']
]);

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function currentPeriod() {
  const hour = new Date().getHours();
  return hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
}

function targetDate(key) {
  const date = new Date(`${key}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function targetLongLabel(key) {
  return targetDate(key).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function targetShortLabel(key) {
  return targetDate(key).toLocaleDateString('en-GB', { weekday: 'short' });
}

function resultCard(option, index, intent, targetKey) {
  const reasons = option.reasons.map(reason => `<li>${esc(reason)}</li>`).join('');
  const isToday = targetKey === todayKey();
  const day = targetShortLabel(targetKey);
  const addLabel = intent === 'dining'
    ? (isToday ? 'Add meal to today' : `Add meal to ${day}`)
    : (isToday ? 'Add to today' : `Add to ${day}`);
  return `
    <article class="ferda-result-card ${index === 0 ? 'top-pick' : ''}">
      <div class="ferda-result-head">
        <span class="ferda-result-icon"><img src="${option.icon}" alt="" /></span>
        <div class="ferda-result-title"><span>${esc(option.category)}</span><h2>${esc(option.name)}</h2></div>
        <div class="ferda-fit"><b>${option.score}%</b><small>crew fit</small></div>
      </div>
      <p class="ferda-result-summary">${esc(option.summary)}</p>
      <ul class="ferda-why">${reasons}</ul>
      ${option.caution ? `<div class="ferda-tradeoff"><b>Worth knowing</b><span>${esc(option.caution)}</span></div>` : ''}
      <div class="ferda-result-actions">
        <button type="button" class="ferda-add-today" data-add-result="${esc(option.id)}">${addLabel}</button>
        <button type="button" class="ferda-secondary" data-more-result="${esc(option.id)}">Why this?</button>
      </div>
    </article>`;
}

function focusTabs(intent) {
  return `
    <div class="ferda-focus-tabs" role="group" aria-label="Ask FERDA focus">
      ${FOCUS_LABELS.map(([key, label]) => `<button type="button" data-ferda-intent="${key}" class="${key === intent ? 'active' : ''}">${label}</button>`).join('')}
    </div>`;
}

function planningTarget(targetKey) {
  if (targetKey === todayKey()) return '';
  return `
    <div class="ferda-plan-target">
      <span>→</span>
      <div><b>Planning ${esc(targetLongLabel(targetKey))}</b><small>Anything you add here goes onto that itinerary day, not Today.</small></div>
    </div>`;
}

function contextStrip(family, preferences, trip) {
  const dietary = family.filter(person => person.dietary?.enabled).length;
  const transport = ({ car: 'car', rideshare: 'rideshare', public: 'public', mixed: 'mixed', none: 'not set' })[trip.transport] || 'not set';
  return `
    <section class="ferda-context-strip">
      <div><b>${family.length}</b><small>travellers</small></div>
      <div><b>${esc(preferences.pace)}</b><small>pace</small></div>
      <div><b>${dietary || '—'}</b><small>dietary profiles</small></div>
      <div><b>${esc(transport)}</b><small>transport</small></div>
    </section>`;
}

function transportMarkup(trip, preferences, dayItems, targetKey) {
  const advice = buildTransportAdvice(trip, preferences, dayItems);
  const isToday = targetKey === todayKey();
  const addLabel = isToday ? 'Add a journey to Today' : `Add journey to ${targetShortLabel(targetKey)}`;
  return `
    <section class="ferda-transport-summary">
      <img src="/brand/ferda-ui-icon-nav-today.webp" alt="" aria-hidden="true" />
      <div>
        <span>YOUR SAVED SETUP</span>
        <h2>${esc(advice.label)}</h2>
        <p>FERDA uses this as the default when it judges how easy a recommendation is to fit into the day.</p>
      </div>
    </section>
    <div class="ferda-transport-actions">
      <button type="button" class="primary" data-add-journey>${esc(addLabel)}</button>
      <button type="button" class="secondary" data-edit-transport>Edit transport setup</button>
    </div>
    <section class="ferda-transport-list">
      ${advice.cards.map((card, index) => `
        <article class="ferda-transport-card">
          <span>${index + 1}</span>
          <div><b>${esc(card.title)}</b><p>${esc(card.detail)}</p></div>
        </article>`).join('')}
    </section>`;
}

export function mountExploreScreen(root, tripStore, familyStore, preferencesStore, todayStore, options = {}) {
  let intent = normaliseExploreIntent(options.intent);
  let config = getExploreIntent(intent);
  let mood = config.moods[0]?.[0] || 'best';
  const requestedTarget = String(options.targetDate || '');
  const targetKey = /^\d{4}-\d{2}-\d{2}$/.test(requestedTarget) ? requestedTarget : todayKey();
  const trip = tripStore.get();
  const family = familyStore.list();
  const preferences = preferencesStore.get();

  function render() {
    config = getExploreIntent(intent);
    if (!config.moods.some(([key]) => key === mood)) mood = config.moods[0]?.[0] || 'best';
    const ranked = intent === 'transport'
      ? []
      : rankForIntent(FERDA_CONTEXT_OPTIONS, { trip, family, preferences }, intent, mood).slice(0, 5);
    const isTransport = intent === 'transport';

    root.innerHTML = `
      <div class="v2-shell explore-shell">
        <header class="v2-topbar">
          <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V3 PREVIEW</small></div></div>
          <div class="v2-status"><span></span> Context-aware</div>
        </header>

        <main class="explore-page">
          <section class="ask-ferda-hero">
            <div class="ask-ferda-mark">F</div>
            <span class="section-kicker">${esc(config.kicker)}</span>
            <h1>${esc(config.title)}</h1>
            <p>${esc(config.intro)}</p>
          </section>

          ${focusTabs(intent)}
          ${planningTarget(targetKey)}
          ${contextStrip(family, preferences, trip)}

          ${isTransport ? transportMarkup(trip, preferences, todayStore.list(targetKey), targetKey) : `
            <section class="ferda-question">
              <span class="section-kicker">${esc(config.question)}</span>
              <div class="ferda-moods" role="group" aria-label="Recommendation priority">
                ${config.moods.map(([key, label]) => `<button type="button" data-mood="${key}" class="${mood === key ? 'active' : ''}">${esc(label)}</button>`).join('')}
              </div>
            </section>

            <section class="ferda-results-heading">
              <div><span class="section-kicker">FERDA RECOMMENDS</span><h2>${esc(config.resultTitle)}</h2></div>
              <small>${esc(config.hint)}</small>
            </section>

            <section class="ferda-results">
              ${ranked.length ? ranked.map((option, index) => resultCard(option, index, intent, targetKey)).join('') : '<div class="ferda-empty-results">FERDA does not have enough suitable options in this prototype yet. Change the focus or priority and keep the rest of the day flexible.</div>'}
            </section>`}
        </main>

        <dialog class="ferda-why-dialog" id="ferdaWhyDialog">
          <form method="dialog">
            <div class="ferda-dialog-head"><div><span class="section-kicker">WHY FERDA PICKED IT</span><h2 id="whyTitle"></h2></div><button value="close">×</button></div>
            <div id="whyBody"></div>
            <button value="close" class="ferda-dialog-close">Got it</button>
          </form>
        </dialog>

        <nav class="v2-nav" aria-label="Primary navigation">
          <button type="button"><span>⌂</span><b>Today</b></button>
          <button class="active" type="button"><span>⌕</span><b>Explore</b></button>
          <button type="button"><span>▣</span><b>Trip</b></button>
          <button type="button"><span>☻</span><b>Family</b></button>
        </nav>
      </div>`;

    root.querySelectorAll('[data-ferda-intent]').forEach(button => button.addEventListener('click', () => {
      intent = normaliseExploreIntent(button.dataset.ferdaIntent);
      const nextConfig = getExploreIntent(intent);
      mood = nextConfig.moods[0]?.[0] || 'best';
      render();
      options.onRebrand?.();
    }));

    root.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', () => {
      mood = button.dataset.mood;
      render();
      options.onRebrand?.();
    }));

    root.querySelectorAll('[data-add-result]').forEach(button => button.addEventListener('click', () => {
      const item = ranked.find(row => row.id === button.dataset.addResult);
      if (!item) return;
      const type = addTypeForIntent(intent);
      todayStore.add(targetKey, {
        period: targetKey === todayKey() ? currentPeriod() : 'morning',
        type,
        title: item.name,
        note: `FERDA recommendation · ${item.category}`
      });
      button.textContent = targetKey === todayKey()
        ? (type === 'meal' ? 'Meal added ✓' : 'Added ✓')
        : `Added to ${targetShortLabel(targetKey)} ✓`;
      button.disabled = true;
    }));

    root.querySelector('[data-add-journey]')?.addEventListener('click', event => {
      todayStore.add(targetKey, {
        period: targetKey === todayKey() ? currentPeriod() : 'morning',
        type: 'travel',
        title: 'Journey / transfer',
        note: 'FERDA added a travel slot — edit it in your itinerary with the destination, time or pickup details.'
      });
      event.currentTarget.textContent = targetKey === todayKey() ? 'Journey added ✓' : `Added to ${targetShortLabel(targetKey)} ✓`;
      event.currentTarget.disabled = true;
      const destination = targetKey === todayKey() ? 'Today' : targetLongLabel(targetKey);
      event.currentTarget.insertAdjacentHTML('afterend', `<div class="ferda-added-note">It is now on ${esc(destination)}. Use Edit in the itinerary to turn it into the real journey.</div>`);
    });

    root.querySelector('[data-edit-transport]')?.addEventListener('click', () => options.onTrip?.());

    const dialog = root.querySelector('#ferdaWhyDialog');
    root.querySelectorAll('[data-more-result]').forEach(button => button.addEventListener('click', () => {
      const rankedItem = ranked.find(row => row.id === button.dataset.moreResult);
      if (!rankedItem) return;
      root.querySelector('#whyTitle').textContent = rankedItem.name;
      root.querySelector('#whyBody').innerHTML = `
        <div class="why-score"><b>${rankedItem.score}%</b><span>crew fit</span></div>
        <p>${esc(rankedItem.summary)}</p>
        <h3>Why it fits</h3>
        <ul>${rankedItem.reasons.map(reason => `<li>${esc(reason)}</li>`).join('')}</ul>
        ${rankedItem.caution ? `<h3>Trade-off</h3><p>${esc(rankedItem.caution)}</p>` : ''}`;
      dialog.showModal();
    }));

    const nav = root.querySelectorAll('.v2-nav button');
    nav[0]?.addEventListener('click', () => options.onToday?.());
    nav[2]?.addEventListener('click', () => options.onTrip?.());
    nav[3]?.addEventListener('click', () => options.onFamily?.());
  }

  render();
  return () => root.querySelector('#ferdaWhyDialog')?.open && root.querySelector('#ferdaWhyDialog').close();
}
