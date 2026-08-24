import './styles.css';

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

export function mountHomeScreen(root, tripStore, familyStore, options = {}) {
  const trip = tripStore.get();
  const people = familyStore.list();
  const configured = tripStore.isConfigured();
  const status = tripStatus(trip);

  root.innerHTML = `
    <div class="v2-shell home-shell">
      <header class="v2-topbar">
        <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div></div>
        <div class="v2-status"><span></span> Fresh build</div>
      </header>

      <main class="home-page">
        <section class="home-hero">
          <img class="home-hero-img" src="/ferda-home-hero.webp?v=20260824-2100" alt="" aria-hidden="true" />
          <div class="home-hero-shade"></div>
          <div class="home-hero-copy">
            <div class="eyebrow">${status.eyebrow}</div>
            <h1>${status.headline}</h1>
            <p>${status.detail}</p>
          </div>
        </section>

        <section class="home-trip-card ${configured ? '' : 'is-empty'}">
          <div class="home-trip-copy">
            <span class="section-kicker">YOUR TRIP</span>
            <h2>${esc(trip.name || trip.destination || 'Set up your adventure')}</h2>
            <p>${configured ? `${esc(formatDates(trip))}${trip.accommodation ? ` · ${esc(trip.accommodation)}` : ''}` : 'Tell FERDA where and when you’re going. You can change it any time.'}</p>
          </div>
          <button id="editTripHome" class="home-trip-action" type="button">${configured ? 'Edit trip' : 'Set up trip'} <span>›</span></button>
        </section>

        <section class="home-glance">
          <div class="home-glance-card"><b>${people.length || '—'}</b><small>Travellers</small></div>
          <div class="home-glance-card"><b>${trip.destination ? esc(trip.destination) : 'Not set'}</b><small>Destination</small></div>
          <div class="home-glance-card"><b>${esc(formatDates(trip))}</b><small>Trip dates</small></div>
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

      <nav class="v2-nav" aria-label="Primary navigation">
        <button class="active" type="button"><span>⌂</span><b>Today</b></button>
        <button type="button"><span>⌕</span><b>Explore</b></button>
        <button type="button"><span>▣</span><b>Trip</b></button>
        <button type="button"><span>☻</span><b>Family</b></button>
      </nav>
    </div>
  `;

  root.querySelector('#editTripHome')?.addEventListener('click', () => options.onTrip?.());
  root.querySelector('#homeFamily')?.addEventListener('click', () => options.onFamily?.());
  root.querySelector('#homeItinerary')?.addEventListener('click', () => options.onTrip?.());

  return () => {};
}
