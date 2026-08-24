import './styles.css';
import './today-polish.css';

const TODAY_ICONS = Object.freeze({
  activity: '/brand/ferda-ui-icon-nav-explore.webp',
  meal: '/brand/ferda-ui-icon-food-dietary.webp',
  travel: '/brand/ferda-ui-icon-nav-today.webp',
  other: '/brand/ferda-ui-icon-trip-preferences.webp',
  trip: '/brand/ferda-ui-icon-nav-trip.webp'
});

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dayDiff(from, to) {
  return Math.ceil((to.getTime() - from.getTime()) / 86400000);
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function tripStatus(trip) {
  const start = parseDate(trip.arrivalDate);
  const end = parseDate(trip.departureDate);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (!start) return { eyebrow: 'YOUR NEXT ADVENTURE', headline: 'Ready when you are', detail: 'Add your trip details and FERDA can start planning around your crew.' };

  if (today < start) {
    const days = Math.max(0, dayDiff(today, start));
    return {
      eyebrow: 'COUNTDOWN',
      headline: days === 0 ? 'Your adventure starts today' : `${days} day${days === 1 ? '' : 's'} to go`,
      detail: trip.destination ? `Next stop: ${trip.destination}` : 'Your next adventure is getting closer.'
    };
  }

  if (end && today <= end) {
    const day = Math.max(1, dayDiff(start, today) + 1);
    const total = Math.max(1, dayDiff(start, end) + 1);
    return {
      eyebrow: 'YOU’RE AWAY',
      headline: `Day ${Math.min(day, total)} of ${total}`,
      detail: trip.destination ? `Making memories in ${trip.destination}` : 'Your trip is underway.'
    };
  }

  return {
    eyebrow: 'TRIP COMPLETE',
    headline: 'What an adventure',
    detail: 'Keep the memories — and start planning the next one whenever you’re ready.'
  };
}

function formatDates(trip) {
  const start = parseDate(trip.arrivalDate);
  const end = parseDate(trip.departureDate);
  if (!start && !end) return 'Dates not set';
  const fmt = date => date?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  return start ? `From ${fmt(start)}` : `Until ${fmt(end)}`;
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function ferdaSuggestion(items, preferences) {
  if (!items.length) return 'Start with one anchor plan, then leave enough breathing room for the day to develop naturally.';
  if (preferences.walking === 'low') return 'Keep the next stop compact and avoid unnecessary backtracking — your crew prefers lower walking days.';
  if (preferences.pace === 'relaxed') return 'You prefer easy-going days. Keep at least one open gap rather than filling every hour.';
  if (preferences.pace === 'full') return 'Your crew likes fuller days. There is room to add another anchor without making the plan feel scattered.';
  if (preferences.discovery === 'discover') return 'Your crew is open to surprises — leave one flexible slot for something local or unexpected.';
  if (preferences.rhythm === 'late') return 'You are later starters, so avoid making the morning do too much heavy lifting.';
  return 'This looks balanced. Keep one flexible gap so FERDA can adapt if timing, energy or weather changes.';
}

function todayIcon(type, extraClass = '') {
  const src = TODAY_ICONS[type] || TODAY_ICONS.other;
  return `<span class="today-brand-icon ${extraClass}"><img src="${src}" alt="" aria-hidden="true" /></span>`;
}

function periodMarkup(period, items) {
  const labels = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };
  const rows = items.filter(item => item.period === period);
  const content = rows.length
    ? rows.map(item => `
        <div class="today-item">
          ${todayIcon(item.type, `today-item-icon ${item.type}`)}
          <span class="today-item-copy"><b>${esc(item.title)}</b>${item.note ? `<small>${esc(item.note)}</small>` : ''}</span>
          <button class="today-item-remove" type="button" data-remove-today="${esc(item.id)}" aria-label="Remove ${esc(item.title)}">×</button>
        </div>`).join('')
    : '<div class="today-empty">Nothing planned yet — keep it flexible or add something.</div>';

  return `
    <section class="today-period">
      <div class="today-period-head"><h3>${labels[period]}</h3><button type="button" data-add-period="${period}">+ Add</button></div>
      <div class="today-period-list">${content}</div>
    </section>`;
}

export function mountHomeScreen(root, tripStore, familyStore, preferencesStore, todayStore, options = {}) {
  const trip = tripStore.get();
  const people = familyStore.list();
  const preferences = preferencesStore.get();
  const configured = tripStore.isConfigured();
  const status = tripStatus(trip);
  const currentKey = dateKey(new Date());
  const dayItems = todayStore.list(currentKey);
  const transportLabel = ({ car: 'Car available', rideshare: 'Rideshare', public: 'Public transport', mixed: 'Mixed transport', none: 'Transport not set' })[trip.transport] || 'Transport not set';

  root.innerHTML = `
    <div class="v2-shell home-shell">
      <header class="v2-topbar">
        <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div></div>
        <div class="v2-status"><span></span> Fresh build</div>
      </header>

      <main class="home-page">
        <section class="home-hero">
          <img class="home-hero-img" src="/ferda-home-hero-v4.jpg" alt="" aria-hidden="true" />
          <div class="home-hero-shade"></div>
          <div class="home-hero-copy">
            <div class="eyebrow">${status.eyebrow}</div>
            <h1>${status.headline}</h1>
            <p>${status.detail}</p>
          </div>
        </section>

        <section class="today-overview">
          <div>
            <span class="section-kicker">TODAY · ${esc(todayLabel().toUpperCase())}</span>
            <h2>Your day, without the faff</h2>
            <p>${dayItems.length ? `${dayItems.length} plan item${dayItems.length === 1 ? '' : 's'} saved for today.` : 'Nothing is locked in yet. Build the day around how the crew actually feels.'}</p>
          </div>
          <button id="todayAddPlan" class="today-primary-action" type="button">+ Add plan</button>
        </section>

        <section class="today-context-grid">
          <div class="today-context-card"><b>${people.length || '—'}</b><small>Travellers</small></div>
          <div class="today-context-card"><b>${esc(transportLabel)}</b><small>Getting around</small></div>
          <div class="today-context-card wide"><b>${esc(trip.destination || 'Destination not set')}</b><small>Today’s base</small></div>
        </section>

        <section class="today-ferda-card">
          <div class="today-ferda-badge">F</div>
          <div><span class="section-kicker">FERDA SAYS</span><p>${esc(ferdaSuggestion(dayItems, preferences))}</p></div>
        </section>

        <section class="today-quick-actions" aria-label="Today quick actions">
          <button type="button" data-quick-type="activity">${todayIcon('activity')}<b>Add activity</b></button>
          <button type="button" data-quick-type="meal">${todayIcon('meal')}<b>Add meal</b></button>
          <button type="button" data-quick-type="travel">${todayIcon('travel')}<b>Add journey</b></button>
          <button type="button" id="todayChangeTrip">${todayIcon('trip')}<b>Trip details</b></button>
        </section>

        <section class="today-plan-section">
          <div class="today-section-heading"><span class="section-kicker">TODAY’S PLAN</span><h2>Morning to night</h2></div>
          ${periodMarkup('morning', dayItems)}
          ${periodMarkup('afternoon', dayItems)}
          ${periodMarkup('evening', dayItems)}
        </section>

        <section class="home-trip-card ${configured ? '' : 'is-empty'}">
          <div class="home-trip-copy">
            <span class="section-kicker">YOUR TRIP</span>
            <h2>${esc(trip.name || trip.destination || 'Set up your adventure')}</h2>
            <p>${configured ? `${esc(formatDates(trip))}${trip.accommodation ? ` · ${esc(trip.accommodation)}` : ''}` : 'Tell FERDA where and when you’re going. You can change it any time.'}</p>
          </div>
          <button id="editTripHome" class="home-trip-action" type="button">${configured ? 'Edit trip' : 'Set up trip'} <span>›</span></button>
        </section>

        <section class="home-section">
          <div class="home-section-heading"><div><span class="section-kicker">PLAN YOUR WAY</span><h2>Everything in one place</h2></div></div>
          <div class="home-plan-grid">
            <button class="home-plan-card" id="homeItinerary" type="button"><span class="home-plan-art itinerary"></span><span><b>Itinerary</b><small>Build the shape of your trip</small></span><i>›</i></button>
            <button class="home-plan-card" id="homeActivities" type="button"><span class="home-plan-art activities"></span><span><b>Activities</b><small>Things worth doing together</small></span><i>›</i></button>
            <button class="home-plan-card" id="homeDining" type="button"><span class="home-plan-art dining"></span><span><b>Dining</b><small>Food that works for everyone</small></span><i>›</i></button>
            <button class="home-plan-card" id="homeTransport" type="button"><span class="home-plan-art transport"></span><span><b>Transport</b><small>Get around without the faff</small></span><i>›</i></button>
            <button class="home-plan-card" id="homeShopping" type="button"><span class="home-plan-art shopping"></span><span><b>Shopping</b><small>Save places worth a stop</small></span><i>›</i></button>
            <button class="home-plan-card" id="homeFamily" type="button"><span class="home-plan-art family"></span><span><b>Family</b><small>Your crew and preferences</small></span><i>›</i></button>
          </div>
        </section>
      </main>

      <dialog class="today-dialog" id="todayDialog">
        <form method="dialog" id="todayForm">
          <div class="today-dialog-head"><div><span class="section-kicker">ADD TO TODAY</span><h2>What’s the plan?</h2></div><button value="cancel" aria-label="Close">×</button></div>
          <label>Time of day<select id="todayPeriod"><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label>
          <label>Type<select id="todayType"><option value="activity">Activity</option><option value="meal">Meal</option><option value="travel">Journey</option><option value="other">Other</option></select></label>
          <label>Plan<input id="todayTitle" maxlength="80" placeholder="e.g. Pool morning, Magic Kingdom, dinner" /></label>
          <label>Optional note<input id="todayNote" maxlength="140" placeholder="Time, booking note, meeting point…" /></label>
          <div class="today-dialog-actions"><button value="cancel" class="secondary">Cancel</button><button id="todaySave" value="default" class="primary">Add to today</button></div>
        </form>
      </dialog>

      <nav class="v2-nav" aria-label="Primary navigation">
        <button class="active" type="button"><span>⌂</span><b>Today</b></button>
        <button type="button"><span>⌕</span><b>Explore</b></button>
        <button type="button"><span>▣</span><b>Trip</b></button>
        <button type="button"><span>☻</span><b>Family</b></button>
      </nav>
    </div>
  `;

  const dialog = root.querySelector('#todayDialog');
  const periodInput = root.querySelector('#todayPeriod');
  const typeInput = root.querySelector('#todayType');
  const titleInput = root.querySelector('#todayTitle');
  const noteInput = root.querySelector('#todayNote');

  function openAdd(period = 'morning', type = 'activity') {
    periodInput.value = period;
    typeInput.value = type;
    titleInput.value = '';
    noteInput.value = '';
    dialog.showModal();
    requestAnimationFrame(() => titleInput.focus());
  }

  root.querySelector('#todayAddPlan')?.addEventListener('click', () => openAdd());
  root.querySelectorAll('[data-add-period]').forEach(button => button.addEventListener('click', () => openAdd(button.dataset.addPeriod, 'activity')));
  root.querySelectorAll('[data-quick-type]').forEach(button => button.addEventListener('click', () => openAdd('morning', button.dataset.quickType)));
  root.querySelectorAll('[data-remove-today]').forEach(button => button.addEventListener('click', () => {
    todayStore.remove(currentKey, button.dataset.removeToday);
    options.onRemount?.();
  }));

  root.querySelector('#todaySave')?.addEventListener('click', event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }
    todayStore.add(currentKey, {
      period: periodInput.value,
      type: typeInput.value,
      title,
      note: noteInput.value
    });
    dialog.close();
    options.onRemount?.();
  });

  root.querySelector('#editTripHome')?.addEventListener('click', () => options.onTrip?.());
  root.querySelector('#todayChangeTrip')?.addEventListener('click', () => options.onTrip?.());
  root.querySelector('#homeFamily')?.addEventListener('click', () => options.onFamily?.());
  root.querySelector('#homeItinerary')?.addEventListener('click', () => options.onTrip?.());

  return () => { if (dialog?.open) dialog.close(); };
}
