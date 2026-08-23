import './styles.css';

const GROUPS = {
  pace: {
    title: 'What pace feels like a good holiday?',
    hint: 'This will influence how much we suggest in a day and when we recommend a breather.',
    options: [
      ['relaxed', 'Easy-going', 'Fewer stops, more breathing room and time to linger.', '☕', '/preferences/pace-relaxed.webp'],
      ['balanced', 'Balanced', 'A good amount planned without turning the day into a race.', '◐', '/preferences/pace-balanced.webp'],
      ['full', 'Pack it in', 'We are happy with fuller days when there is plenty worth doing.', '⚡', '/preferences/pace-full.webp']
    ]
  },
  budget: {
    title: 'How budget-conscious should suggestions be?',
    hint: 'This is about ranking, not hiding good options completely.',
    options: [
      ['value', 'Value-conscious', 'Prioritise good-value choices and flag expensive extras.', '£'],
      ['balanced', 'Balanced', 'Mix value with worthwhile treats and convenience.', '££'],
      ['flexible', 'Flexible', 'Fit matters more than price when an option is genuinely better.', '£££']
    ]
  },
  rhythm: {
    title: 'What is the crew’s natural day rhythm?',
    hint: 'Useful later for breakfast, park arrival, evening plans and realistic itineraries.',
    options: [
      ['early', 'Early starters', 'Happy to get moving early and make use of quieter mornings.', '☀', '/preferences/rhythm-early.webp'],
      ['flexible', 'Flexible', 'No strong preference — adapt to the day.', '↔', '/preferences/rhythm-flexible.webp'],
      ['late', 'Later starters', 'Avoid plans that rely on everyone being out at dawn.', '☾', '/preferences/rhythm-late.webp']
    ]
  },
  discovery: {
    title: 'How adventurous should recommendations be?',
    hint: 'This helps balance dependable favourites with things you might never have searched for.',
    options: [
      ['familiar', 'Familiar favourites', 'Lean toward proven, predictable options.', '✓', '/preferences/discovery-familiar.webp'],
      ['mix', 'Mix it up', 'Blend reliable choices with a few interesting discoveries.', '✦', '/preferences/discovery-mix.webp'],
      ['discover', 'Surprise us', 'Give unusual and local discoveries a real chance to rank.', '◎', '/preferences/discovery-surprise.webp']
    ]
  },
  walking: {
    title: 'How much walking is comfortable for the group?',
    hint: 'We can eventually use this when comparing routes, parks, attractions and food options.',
    options: [
      ['low', 'Keep walking lower', 'Prefer compact plans and avoid needless backtracking.', '◌', '/preferences/walking-low.webp'],
      ['normal', 'Normal holiday walking', 'Some distance is fine if the day still flows well.', '→', '/preferences/walking-normal.webp'],
      ['high', 'Happy to walk lots', 'Distance is less important than getting to the best option.', '↗', '/preferences/walking-high.webp']
    ]
  }
};

const ACCESSIBILITY = [
  ['minimiseWalking', 'Minimise unnecessary walking', 'Prefer closer options and efficient routes where possible.', '/preferences/minimise-walking.webp'],
  ['frequentSeating', 'Regular opportunities to sit', 'Factor rest stops and places with seating into longer plans.', '/preferences/regular-seating.webp'],
  ['stepFree', 'Prefer step-free routes', 'Surface step-free access and avoid assuming stairs are suitable.', '/preferences/step-free.webp'],
  ['quietBreaks', 'Quieter breaks are useful', 'Allow for lower-stimulation pauses during busy days.', '']
];

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function groupMarkup(key, value) {
  const group = GROUPS[key];
  return `
    <fieldset class="preference-section">
      <legend>${group.title}</legend>
      <p>${group.hint}</p>
      <div class="preference-choice-grid">
        ${group.options.map(([optionValue, label, hint, icon, image]) => `
          <label class="preference-choice ${image ? 'with-image' : ''}">
            <input type="radio" name="${key}" value="${optionValue}" ${value === optionValue ? 'checked' : ''} />
            <span class="preference-choice-body ${image ? 'has-image' : ''}">
              ${image
                ? `<span class="preference-choice-image"><img src="${image}" alt="" loading="lazy" decoding="async" /></span>`
                : `<span class="preference-choice-icon">${icon}</span>`}
              <span class="preference-choice-copy"><b>${label}</b><small>${hint}</small></span>
              <span class="preference-check">✓</span>
            </span>
          </label>
        `).join('')}
      </div>
    </fieldset>
  `;
}

export function preferenceSummary(value) {
  const pace = ({ relaxed: 'Easy-going pace', balanced: 'Balanced pace', full: 'Full days' })[value.pace] || 'Balanced pace';
  const budget = ({ value: 'value-focused', balanced: 'balanced budget', flexible: 'budget flexible' })[value.budget] || 'balanced budget';
  return `${pace} · ${budget}`;
}

export function mountPreferencesScreen(root, store, options = {}) {
  const value = store.get();

  root.innerHTML = `
    <div class="v2-shell preferences-shell">
      <header class="v2-topbar">
        <div class="v2-brand">
          <div class="v2-brand-mark">F</div>
          <div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div>
        </div>
        <div class="v2-status"><span></span> Fresh build</div>
      </header>

      <main class="preferences-page">
        <button id="preferencesBack" class="page-back" type="button">← Family</button>

        <section class="preferences-hero">
          <div class="eyebrow">HOW YOUR CREW LIKES TO TRAVEL</div>
          <h1>Trip & family preferences</h1>
          <p>Set the group’s default style once. Later, recommendations and day plans can use this automatically instead of asking the same questions every time.</p>
        </section>

        <section class="preferences-principle">
          <span>✦</span>
          <div><b>These are preferences, not hard rules.</b><small>If something is unusually good, the app can still surface it — but it should explain why it is worth bending the usual pattern.</small></div>
        </section>

        <form id="preferencesForm" class="preferences-form">
          ${groupMarkup('pace', value.pace)}
          ${groupMarkup('budget', value.budget)}
          ${groupMarkup('rhythm', value.rhythm)}
          ${groupMarkup('discovery', value.discovery)}
          ${groupMarkup('walking', value.walking)}

          <fieldset class="preference-section accessibility-section">
            <legend>Anything the whole trip should be considerate of?</legend>
            <p>These settings will later influence route and venue suggestions across the holiday.</p>
            <div class="accessibility-grid">
              ${ACCESSIBILITY.map(([key, label, hint, image]) => `
                <label class="accessibility-choice ${image ? 'has-image' : ''}">
                  <input type="checkbox" name="accessibility" value="${key}" ${value.accessibility[key] ? 'checked' : ''} />
                  ${image ? `<span class="accessibility-image"><img src="${image}" alt="" loading="lazy" decoding="async" /></span>` : ''}
                  <span class="accessibility-copy"><b>${label}</b><small>${hint}</small></span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <label class="preferences-notes">
            <span>Anything else about how your family likes to travel? <em>optional</em></span>
            <textarea id="preferencesNotes" rows="3" maxlength="240" placeholder="For example: one big activity per day, avoid back-to-back late nights, prefer indoor plans in the afternoon…">${esc(value.notes)}</textarea>
          </label>

          <section class="preference-future-card">
            <span>HOW THIS WILL HELP LATER</span>
            <div>✓ Rank activities against the way your family actually holidays</div>
            <div>✓ Build more realistic day plans instead of maximising stops</div>
            <div>✓ Explain trade-offs when the best option clashes with a usual preference</div>
          </section>

          <div class="preferences-actions">
            <button id="resetPreferences" class="text-secondary" type="button">Reset defaults</button>
            <span></span>
            <wa-button id="cancelPreferences" appearance="outlined" type="button">Back</wa-button>
            <wa-button id="savePreferences" variant="brand" type="submit">Save preferences</wa-button>
          </div>
        </form>
      </main>
    </div>
  `;

  const form = root.querySelector('#preferencesForm');

  function selected(name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const accessibility = {};
    ACCESSIBILITY.forEach(([key]) => {
      accessibility[key] = !!form.querySelector(`input[name="accessibility"][value="${key}"]:checked`);
    });

    store.save({
      pace: selected('pace'),
      budget: selected('budget'),
      rhythm: selected('rhythm'),
      discovery: selected('discovery'),
      walking: selected('walking'),
      accessibility,
      notes: root.querySelector('#preferencesNotes').value
    });
    options.onBack?.();
  });

  root.querySelector('#preferencesBack').addEventListener('click', () => options.onBack?.());
  root.querySelector('#cancelPreferences').addEventListener('click', () => options.onBack?.());
  root.querySelector('#resetPreferences').addEventListener('click', () => {
    store.reset();
    options.onRemount?.();
  });

  return () => {};
}
