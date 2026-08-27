import './itinerary.css';

const ITEM_ICONS = Object.freeze({
  activity: '/brand/ferda-ui-icon-nav-explore.webp',
  meal: '/brand/ferda-ui-icon-food-dietary.webp',
  travel: '/brand/ferda-ui-icon-nav-today.webp',
  other: '/brand/ferda-ui-icon-trip-preferences.webp'
});

const PERIOD_ORDER = Object.freeze({ morning: 1, afternoon: 2, evening: 3 });
const PERIOD_LABELS = Object.freeze({ morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' });

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

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayKey() {
  return dateKey(new Date());
}

function tripDays(trip) {
  const start = parseDate(trip.arrivalDate);
  const end = parseDate(trip.departureDate);
  if (!start || !end || end < start) return [];

  const days = [];
  const cursor = new Date(start);
  for (let i = 0; cursor <= end && i < 45; i += 1) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function formatRange(trip) {
  const start = parseDate(trip.arrivalDate);
  const end = parseDate(trip.departureDate);
  const fmt = date => date?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  return 'Dates not set';
}

function dayHeading(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

function sortedItems(items) {
  return [...items].sort((a, b) => (PERIOD_ORDER[a.period] || 9) - (PERIOD_ORDER[b.period] || 9));
}

function itemMarkup(item, key) {
  const icon = ITEM_ICONS[item.type] || ITEM_ICONS.other;
  return `
    <div class="itinerary-item">
      <span class="itinerary-item-icon"><img src="${icon}" alt="" aria-hidden="true" /></span>
      <div class="itinerary-item-copy">
        <span>${esc(PERIOD_LABELS[item.period] || 'Plan')}</span>
        <b>${esc(item.title)}</b>
        ${item.note ? `<small>${esc(item.note)}</small>` : ''}
      </div>
      <div class="itinerary-item-actions">
        <button type="button" data-itinerary-edit="${esc(item.id)}" data-itinerary-date="${key}" aria-label="Edit ${esc(item.title)}">✎</button>
        <button type="button" data-itinerary-remove="${esc(item.id)}" data-itinerary-date="${key}" aria-label="Remove ${esc(item.title)}">×</button>
      </div>
    </div>`;
}

export function mountItineraryScreen(root, tripStore, todayStore, options = {}) {
  const trip = tripStore.get();
  const days = tripDays(trip);
  let activeDate = '';
  let activeId = null;

  function render() {
    const current = todayKey();
    root.innerHTML = `
      <div class="v2-shell itinerary-shell">
        <header class="v2-topbar">
          <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V3 PREVIEW</small></div></div>
          <div class="v2-status"><span></span> Multi-day plan</div>
        </header>

        <main class="itinerary-page">
          <button class="page-back" type="button" data-itinerary-back>← Home</button>
          <section class="itinerary-hero">
            <div class="eyebrow">YOUR ADVENTURE, DAY BY DAY</div>
            <h1>${esc(trip.name || trip.destination || 'Itinerary')}</h1>
            <p>Plan the anchors now, leave breathing room where you want it, and let Today become the live version of the same plan when each day arrives.</p>
            <div class="itinerary-meta">
              <span>${esc(trip.destination || 'Destination not set')}</span>
              <span>${esc(formatRange(trip))}</span>
              ${trip.accommodation ? `<span>${esc(trip.accommodation)}</span>` : ''}
            </div>
          </section>

          ${days.length ? `
            <section class="itinerary-days">
              ${days.map((date, index) => {
                const key = dateKey(date);
                const items = sortedItems(todayStore.list(key));
                return `
                  <article class="itinerary-day ${key === current ? 'is-today' : ''}">
                    <div class="itinerary-day-head">
                      <div class="itinerary-day-number"><b>${index + 1}</b><small>DAY</small></div>
                      <div class="itinerary-day-title">
                        <h2>${esc(dayHeading(date))}${key === current ? ' · Today' : ''}</h2>
                        <small>${items.length ? `${items.length} plan item${items.length === 1 ? '' : 's'}` : 'Keep it open or add an anchor plan'}</small>
                      </div>
                      <button type="button" class="itinerary-day-add" data-itinerary-add="${key}">+ Add</button>
                    </div>
                    <div class="itinerary-items">
                      ${items.length ? items.map(item => itemMarkup(item, key)).join('') : '<div class="itinerary-empty">Nothing fixed yet. That can be deliberate — FERDA does not need every hour filled.</div>'}
                    </div>
                  </article>`;
              }).join('')}
            </section>` : `
            <section class="itinerary-setup">
              <h2>Set the trip dates first</h2>
              <p>Once FERDA knows the arrival and departure dates, this becomes the shared day-by-day plan for the whole adventure.</p>
              <button type="button" data-itinerary-setup>Set up trip</button>
            </section>`}
        </main>

        <dialog class="itinerary-dialog" id="itineraryDialog">
          <form method="dialog" data-itinerary-form>
            <div class="itinerary-dialog-head">
              <div><span class="section-kicker">ITINERARY</span><h2 data-itinerary-dialog-title>Add a plan</h2></div>
              <button type="button" data-itinerary-close aria-label="Close">×</button>
            </div>
            <label>Date<input type="date" min="${esc(trip.arrivalDate)}" max="${esc(trip.departureDate)}" data-itinerary-date-input /></label>
            <label>Time of day
              <select data-itinerary-period>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
            <label>Type
              <select data-itinerary-type>
                <option value="activity">Activity</option>
                <option value="meal">Meal</option>
                <option value="travel">Journey</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>Plan<input type="text" maxlength="80" data-itinerary-title placeholder="e.g. Epic Universe, pool morning, dinner" /></label>
            <label>Optional note<input type="text" maxlength="140" data-itinerary-note placeholder="Time, booking, meeting point…" /></label>
            <div class="itinerary-dialog-actions">
              <button type="button" class="secondary" data-itinerary-close>Cancel</button>
              <button type="submit" class="primary">Save plan</button>
            </div>
          </form>
        </dialog>

        <nav class="v2-nav" aria-label="Primary navigation">
          <button type="button"><span>⌂</span><b>Today</b></button>
          <button type="button"><span>⌕</span><b>Explore</b></button>
          <button class="active" type="button"><span>▣</span><b>Trip</b></button>
          <button type="button"><span>☻</span><b>Family</b></button>
        </nav>
      </div>`;

    const dialog = root.querySelector('#itineraryDialog');
    const form = root.querySelector('[data-itinerary-form]');
    const dateInput = root.querySelector('[data-itinerary-date-input]');
    const periodInput = root.querySelector('[data-itinerary-period]');
    const typeInput = root.querySelector('[data-itinerary-type]');
    const titleInput = root.querySelector('[data-itinerary-title]');
    const noteInput = root.querySelector('[data-itinerary-note]');
    const dialogTitle = root.querySelector('[data-itinerary-dialog-title]');

    function closeDialog() {
      activeDate = '';
      activeId = null;
      if (dialog?.open) dialog.close();
    }

    function openEditor(key, id = null) {
      activeDate = key;
      activeId = id;
      const item = id ? todayStore.list(key).find(row => String(row.id) === String(id)) : null;
      dialogTitle.textContent = item ? 'Edit plan' : 'Add a plan';
      dateInput.value = key;
      periodInput.value = item?.period || 'morning';
      typeInput.value = item?.type || 'activity';
      titleInput.value = item?.title || '';
      noteInput.value = item?.note || '';
      dialog.showModal();
      requestAnimationFrame(() => titleInput.focus());
    }

    root.querySelectorAll('[data-itinerary-add]').forEach(button => button.addEventListener('click', () => openEditor(button.dataset.itineraryAdd)));
    root.querySelectorAll('[data-itinerary-edit]').forEach(button => button.addEventListener('click', () => openEditor(button.dataset.itineraryDate, button.dataset.itineraryEdit)));
    root.querySelectorAll('[data-itinerary-remove]').forEach(button => button.addEventListener('click', () => {
      todayStore.remove(button.dataset.itineraryDate, button.dataset.itineraryRemove);
      render();
      options.onRebrand?.();
    }));

    root.querySelectorAll('[data-itinerary-close]').forEach(button => button.addEventListener('click', closeDialog));
    dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });

    form?.addEventListener('submit', event => {
      event.preventDefault();
      const key = dateInput.value || activeDate;
      const title = titleInput.value.trim();
      if (!key) {
        dateInput.focus();
        return;
      }
      if (!title) {
        titleInput.focus();
        return;
      }
      const payload = {
        period: periodInput.value,
        type: typeInput.value,
        title,
        note: noteInput.value.trim()
      };
      if (activeId && key !== activeDate) {
        todayStore.remove(activeDate, activeId);
        todayStore.add(key, { ...payload, id: activeId });
      } else if (activeId) {
        todayStore.update(activeDate, activeId, payload);
      } else {
        todayStore.add(key, payload);
      }
      closeDialog();
      render();
      options.onRebrand?.();
    });

    root.querySelector('[data-itinerary-back]')?.addEventListener('click', () => options.onBack?.());
    root.querySelector('[data-itinerary-setup]')?.addEventListener('click', () => options.onTrip?.());

    const nav = root.querySelectorAll('.v2-nav button');
    nav[0]?.addEventListener('click', () => options.onToday?.());
    nav[1]?.addEventListener('click', () => options.onExplore?.());
    nav[2]?.addEventListener('click', () => options.onTrip?.());
    nav[3]?.addEventListener('click', () => options.onFamily?.());
  }

  render();
  return () => root.querySelector('#itineraryDialog')?.open && root.querySelector('#itineraryDialog').close();
}
