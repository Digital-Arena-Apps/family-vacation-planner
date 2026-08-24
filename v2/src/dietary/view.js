import './styles.css';
import { avatarMarkup } from '../family/avatars.js';

const TYPE_OPTIONS = [
  ['allergy', 'Food allergy', 'Allergen information and preparation controls matter.'],
  ['coeliac', 'Coeliac / strict gluten', 'Treat gluten-friendly separately from controlled gluten-free provision.'],
  ['intolerance', 'Food intolerance', 'Avoid ingredients, but risk can differ from an allergy.'],
  ['preference', 'Dietary preference', 'Used to improve fit rather than as a safety warning.']
];

const AVOID_OPTIONS = [
  ['gluten', 'Gluten'],
  ['dairy', 'Dairy / lactose'],
  ['peanuts', 'Peanuts'],
  ['tree_nuts', 'Tree nuts'],
  ['eggs', 'Eggs'],
  ['shellfish', 'Shellfish'],
  ['fish', 'Fish'],
  ['soy', 'Soy'],
  ['sesame', 'Sesame'],
  ['vegetarian', 'Vegetarian'],
  ['vegan', 'Vegan'],
  ['other', 'Something else']
];

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function selectedValues(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

export function mountDietaryScreen(root, store, options = {}) {
  let selectedId = options.memberId || store.list().find(member => member.dietary?.enabled)?.id || '';

  root.innerHTML = `
    <div class="v2-shell dietary-shell">
      <header class="v2-topbar">
        <div class="v2-brand">
          <div class="v2-brand-mark">F</div>
          <div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div>
        </div>
        <div class="v2-status"><span></span> Fresh build</div>
      </header>

      <main class="dietary-page">
        <button id="dietaryBack" class="page-back" type="button">← Family</button>
        <section class="dietary-hero">
          <div class="eyebrow">FOOD THAT FITS THE CREW</div>
          <h1>Food & dietary needs</h1>
          <p>Tell us what matters once. Later, restaurant and food suggestions can take it into account automatically instead of making you re-check every search.</p>
        </section>

        <section class="dietary-principle">
          <span>!</span>
          <div><b>We won’t treat “gluten-friendly” as the same thing as gluten-free.</b><small>Where a venue uses shared kitchens, fryers or prep surfaces, we can surface that clearly when cross-contact matters.</small></div>
        </section>

        <section id="dietaryPeople" class="dietary-people" aria-label="People with dietary needs"></section>
        <section id="dietaryEditor" class="dietary-editor"></section>
      </main>
    </div>
  `;

  const people = root.querySelector('#dietaryPeople');
  const editor = root.querySelector('#dietaryEditor');

  function enabledMembers() {
    return store.list().filter(member => member.dietary?.enabled);
  }

  function renderPeople() {
    const members = enabledMembers();
    if (!members.length) {
      people.innerHTML = '';
      return;
    }
    if (!members.some(member => member.id === selectedId)) selectedId = members[0].id;
    people.innerHTML = members.map(member => `
      <button class="dietary-person ${member.id === selectedId ? 'active' : ''}" type="button" data-dietary-person="${esc(member.id)}">
        <span class="dietary-avatar illustrated">${avatarMarkup(member.avatar, { label: `${member.name} avatar` })}</span>
        <span><b>${esc(member.name)}</b><small>${member.dietary.types?.length || member.dietary.avoids?.length ? 'Needs set' : 'Needs details'}</small></span>
      </button>
    `).join('');
  }

  function renderEditor() {
    const member = store.get(selectedId);
    if (!member?.dietary?.enabled) {
      editor.innerHTML = `
        <div class="dietary-empty">
          <b>No food needs to configure.</b>
          <p>Go back to Family and switch the question on for a traveller if you want this feature.</p>
          <wa-button id="emptyBack" variant="brand">Back to Family</wa-button>
        </div>
      `;
      root.querySelector('#emptyBack')?.addEventListener('click', () => options.onBack?.());
      return;
    }

    const dietary = member.dietary;
    editor.innerHTML = `
      <form id="dietaryForm" class="dietary-form">
        <div class="dietary-editor-heading">
          <div><span class="section-kicker">SETTING UP</span><h2>${esc(member.name)}</h2></div>
          <span class="dietary-avatar illustrated">${avatarMarkup(member.avatar, { label: `${member.name} avatar` })}</span>
        </div>

        <fieldset class="dietary-section">
          <legend>What best describes the need?</legend>
          <p>Select everything that applies. These categories affect how strongly we treat a restaurant match.</p>
          <div class="need-type-grid">
            ${TYPE_OPTIONS.map(([value, label, hint]) => `
              <label class="need-type-card">
                <input type="checkbox" name="dietaryType" value="${value}" ${dietary.types?.includes(value) ? 'checked' : ''} />
                <span><b>${label}</b><small>${hint}</small></span>
              </label>
            `).join('')}
          </div>
        </fieldset>

        <fieldset class="dietary-section">
          <legend>What should food suggestions account for?</legend>
          <p>Pick the ingredients or dietary patterns that matter for ${esc(member.name)}.</p>
          <div class="avoid-grid">
            ${AVOID_OPTIONS.map(([value, label]) => `
              <label class="avoid-chip">
                <input type="checkbox" name="dietaryAvoid" value="${value}" ${dietary.avoids?.includes(value) ? 'checked' : ''} />
                <span>${label}</span>
              </label>
            `).join('')}
          </div>
        </fieldset>

        <label class="cross-contact-row">
          <input id="dietaryCrossContact" type="checkbox" ${dietary.crossContact ? 'checked' : ''} />
          <span><b>Shared fryers / prep surfaces matter</b><small>When switched on, “gluten-friendly” or shared-kitchen options should be flagged rather than treated as confidently suitable.</small></span>
        </label>

        <label class="dietary-notes">
          <span>Anything else we should know? <em>optional</em></span>
          <textarea id="dietaryNotes" maxlength="220" rows="3" placeholder="For example: ask staff about a separate fryer, carries an EpiPen, lactose-free dairy is fine…">${esc(dietary.notes || '')}</textarea>
        </label>

        <section class="future-search-card">
          <span>HOW THIS WILL HELP LATER</span>
          <div>✓ Prefer restaurants with clear allergen / dietary information</div>
          <div>✓ Rank places against the needs of the whole crew</div>
          <div>⚠ Surface uncertainty and shared-kitchen warnings instead of hiding them</div>
        </section>

        <div class="dietary-actions">
          <button id="disableDietary" class="text-danger" type="button">No dietary needs</button>
          <span></span>
          <wa-button id="dietaryCancel" appearance="outlined" type="button">Back</wa-button>
          <wa-button id="dietarySave" variant="brand" type="submit">Save food needs</wa-button>
        </div>
      </form>
    `;

    const form = root.querySelector('#dietaryForm');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const current = store.get(selectedId);
      if (!current) return;
      store.save({
        ...current,
        dietary: {
          enabled: true,
          types: selectedValues(form, 'dietaryType'),
          avoids: selectedValues(form, 'dietaryAvoid'),
          crossContact: root.querySelector('#dietaryCrossContact').checked,
          notes: root.querySelector('#dietaryNotes').value
        }
      });
      renderPeople();
      renderEditor();
      root.querySelector('.dietary-page')?.scrollTo?.({ top: 0, behavior: 'smooth' });
    });

    root.querySelector('#dietaryCancel')?.addEventListener('click', () => options.onBack?.());
    root.querySelector('#disableDietary')?.addEventListener('click', () => {
      const current = store.get(selectedId);
      if (!current) return;
      store.save({ ...current, dietary: { ...current.dietary, enabled: false } });
      const next = enabledMembers()[0];
      if (next) {
        selectedId = next.id;
        renderPeople();
        renderEditor();
      } else {
        options.onBack?.();
      }
    });
  }

  people.addEventListener('click', event => {
    const button = event.target.closest('[data-dietary-person]');
    if (!button) return;
    selectedId = button.dataset.dietaryPerson;
    renderPeople();
    renderEditor();
  });

  root.querySelector('#dietaryBack').addEventListener('click', () => options.onBack?.());

  renderPeople();
  renderEditor();

  return () => {};
}
