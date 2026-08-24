import './styles.css';
import ART_BASE from './artwork-data.js';
import PACE_ART from './artwork-ferda-pace.js';
import BUDGET_ART from './artwork-budget.js';
import RHYTHM_ART from './artwork-ferda-rhythm.js';
import DISCOVERY_ART from './artwork-discovery.js';

const ART = {
  ...ART_BASE,
  pace: PACE_ART,
  budget: BUDGET_ART,
  rhythm: RHYTHM_ART,
  discovery: DISCOVERY_ART
};

const GROUPS = {
  pace: {
    title: 'What pace feels like a good holiday?',
    hint: 'This will influence how much we suggest in a day and when we recommend a breather.',
    options: [
      ['relaxed', 'Easy-going', 'Fewer stops, more breathing room and time to linger.', 0],
      ['balanced', 'Balanced', 'A good amount planned without turning the day into a race.', 1],
      ['full', 'Pack it in', 'We are happy with fuller days when there is plenty worth doing.', 2]
    ]
  },
  budget: {
    title: 'How budget-conscious should suggestions be?',
    hint: 'This is about ranking, not hiding good options completely.',
    options: [
      ['value', 'Value-conscious', 'Prioritise good-value choices and flag expensive extras.', 0],
      ['balanced', 'Balanced', 'Mix value with worthwhile treats and convenience.', 1],
      ['flexible', 'Flexible', 'Fit matters more than price when an option is genuinely better.', 2]
    ]
  },
  rhythm: {
    title: 'What is the crew’s natural day rhythm?',
    hint: 'Useful later for breakfast, park arrival, evening plans and realistic itineraries.',
    options: [
      ['early', 'Early starters', 'Happy to get moving early and make use of quieter mornings.', 0],
      ['flexible', 'Flexible', 'No strong preference — adapt to the day.', 1],
      ['late', 'Later starters', 'Avoid plans that rely on everyone being out at dawn.', 2]
    ]
  },
  discovery: {
    title: 'How adventurous should recommendations be?',
    hint: 'This helps balance dependable favourites with things you might never have searched for.',
    options: [
      ['familiar', 'Familiar favourites', 'Lean toward proven, predictable options.', 0],
      ['mix', 'Mix it up', 'Blend reliable choices with a few interesting discoveries.', 1],
      ['discover', 'Surprise us', 'Give unusual and local discoveries a real chance to rank.', 2]
    ]
  },
  walking: {
    title: 'How much walking is comfortable for the group?',
    hint: 'We can eventually use this when comparing routes, parks, attractions and food options.',
    options: [
      ['low', 'Keep walking lower', 'Prefer compact plans and avoid needless backtracking.', 0],
      ['normal', 'Normal holiday walking', 'Some distance is fine if the day still flows well.', 1],
      ['high', 'Happy to walk lots', 'Distance is less important than getting to the best option.', 2]
    ]
  }
};

const ACCESSIBILITY = [
  ['minimiseWalking', 'Minimise unnecessary walking', 'Prefer closer options and efficient routes where possible.'],
  ['frequentSeating', 'Regular opportunities to sit', 'Factor rest stops and places with seating into longer plans.'],
  ['stepFree', 'Prefer step-free routes', 'Surface step-free access and avoid assuming stairs are suitable.'],
  ['quietBreaks', 'Quieter breaks are useful', 'Allow for lower-stimulation pauses during busy days.']
];

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function groupMarkup(key, value) {
  const group = GROUPS[key];
  const strip = ART[key];
  const positions = ['0%', '50%', '100%'];
  return `
    <fieldset class="preference-section">
      <legend>${group.title}</legend>
      <p>${group.hint}</p>
      <div class="preference-choice-grid">
        ${group.options.map(([optionValue, label, hint, artIndex]) => `
          <label class="preference-choice with-image">
            <input type="radio" name="${key}" value="${optionValue}" ${value === optionValue ? 'checked' : ''} />
            <span class="preference-choice-body has-image">
              <span class="preference-choice-image" role="img" aria-label="${label}" style="background-image:url('${strip}');background-position:${positions[artIndex]} center"></span>
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
          <img class="preferences-principle-art" src="${ART.guidance}" alt="" />
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
            <p>Choose any that matter. These can influence routes, venue suggestions and how demanding a day plan feels.</p>
            <div class="accessibility-grid">
              ${ACCESSIBILITY.map(([key, label, hint]) => `
                <label class="accessibility-choice">
                  <input type="checkbox" name="accessibility" value="${key}" ${value.accessibility[key] ? 'checked' : ''} />
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
