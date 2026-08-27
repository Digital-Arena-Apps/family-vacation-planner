import './styles.css';

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function mountTripScreen(root, tripStore, options = {}) {
  const trip = tripStore.get();

  root.innerHTML = `
    <div class="v2-shell trip-shell">
      <header class="v2-topbar">
        <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V3 PREVIEW</small></div></div>
        <div class="v2-status"><span></span> Trip context</div>
      </header>

      <main class="trip-page">
        <button id="tripBack" class="page-back" type="button">← Home</button>
        <section class="trip-hero-copy">
          <div class="eyebrow">WHERE THE ADVENTURE STARTS</div>
          <h1>Trip details</h1>
          <p>Give FERDA the basics once. We’ll use them for countdowns, day plans, travel effort and recommendations that make sense where you’re staying.</p>
        </section>

        <form id="tripForm" class="trip-form">
          <section class="trip-form-card">
            <label class="trip-field full"><span>Trip name <em>optional</em></span><input id="tripName" type="text" maxlength="60" value="${esc(trip.name)}" placeholder="Our Florida adventure" /></label>
            <label class="trip-field full"><span>Destination</span><input id="tripDestination" type="text" maxlength="80" value="${esc(trip.destination)}" placeholder="Orlando, Florida" /></label>
            <label class="trip-field"><span>Arrival</span><input id="tripArrival" type="date" value="${esc(trip.arrivalDate)}" /></label>
            <label class="trip-field"><span>Departure</span><input id="tripDeparture" type="date" value="${esc(trip.departureDate)}" /></label>
            <label class="trip-field full"><span>Where are you staying? <em>optional</em></span><input id="tripAccommodation" type="text" maxlength="100" value="${esc(trip.accommodation)}" placeholder="Hotel, villa, resort or neighbourhood" /></label>
          </section>

          <section class="trip-form-card">
            <div class="trip-field-heading"><b>How will you mainly get around?</b><small>This helps FERDA judge distance and whether something is genuinely convenient.</small></div>
            <div class="trip-transport-grid">
              <label><input type="radio" name="tripTransport" value="car" ${trip.transport === 'car' ? 'checked' : ''}/><span><b>We’ll have a car</b><small>Driving and parking can be part of the plan.</small></span></label>
              <label><input type="radio" name="tripTransport" value="rideshare" ${trip.transport === 'rideshare' ? 'checked' : ''}/><span><b>Rideshare</b><small>Prioritise simple pickups and realistic transfer buffers.</small></span></label>
              <label><input type="radio" name="tripTransport" value="public" ${trip.transport === 'public' ? 'checked' : ''}/><span><b>Public transport</b><small>Prefer clustered plans that work with the route.</small></span></label>
              <label><input type="radio" name="tripTransport" value="mixed" ${trip.transport === 'mixed' ? 'checked' : ''}/><span><b>A mixture</b><small>Choose the easiest transport for each part of the day.</small></span></label>
              <label><input type="radio" name="tripTransport" value="none" ${trip.transport === 'none' ? 'checked' : ''}/><span><b>Not decided yet</b><small>Keep transport assumptions flexible for now.</small></span></label>
            </div>
          </section>

          <label class="trip-notes"><span>Anything useful about this trip? <em>optional</em></span><textarea id="tripNotes" rows="3" maxlength="240" placeholder="For example: staying off-site, airport transfer booked, avoiding toll roads…">${esc(trip.notes)}</textarea></label>

          <div class="trip-actions">
            <button id="resetTrip" class="text-secondary" type="button">Clear trip</button>
            <wa-button id="cancelTrip" appearance="outlined" type="button">Back</wa-button>
            <wa-button variant="brand" type="submit">Save trip</wa-button>
          </div>
        </form>
      </main>
    </div>
  `;

  const form = root.querySelector('#tripForm');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const arrivalDate = root.querySelector('#tripArrival').value;
    const departureDate = root.querySelector('#tripDeparture').value;
    if (arrivalDate && departureDate && departureDate < arrivalDate) {
      root.querySelector('#tripDeparture').setCustomValidity('Departure must be after arrival.');
      root.querySelector('#tripDeparture').reportValidity();
      return;
    }
    root.querySelector('#tripDeparture').setCustomValidity('');
    tripStore.save({
      name: root.querySelector('#tripName').value,
      destination: root.querySelector('#tripDestination').value,
      arrivalDate,
      departureDate,
      accommodation: root.querySelector('#tripAccommodation').value,
      transport: form.querySelector('input[name="tripTransport"]:checked')?.value || 'none',
      notes: root.querySelector('#tripNotes').value
    });
    options.onBack?.();
  });

  root.querySelector('#tripBack').addEventListener('click', () => options.onBack?.());
  root.querySelector('#cancelTrip').addEventListener('click', () => options.onBack?.());
  root.querySelector('#resetTrip').addEventListener('click', () => {
    tripStore.reset();
    options.onRemount?.();
  });

  return () => {};
}
