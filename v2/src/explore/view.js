import './styles.css';
import { ORLANDO_OPTIONS } from './dataset.js';
import { rankOptions } from './engine.js';

function esc(value='') {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function resultCard(option, index) {
  const reasons = option.reasons.map(reason => `<li>${esc(reason)}</li>`).join('');
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
        <button type="button" class="ferda-add-today" data-add-result="${esc(option.id)}">Add to today</button>
        <button type="button" class="ferda-secondary" data-more-result="${esc(option.id)}">Why this?</button>
      </div>
    </article>`;
}

export function mountExploreScreen(root, tripStore, familyStore, preferencesStore, todayStore, options={}) {
  let mood = 'best';
  const trip = tripStore.get();
  const family = familyStore.list();
  const preferences = preferencesStore.get();

  function render() {
    const ranked = rankOptions(ORLANDO_OPTIONS, { trip, family, preferences }, mood).slice(0,5);
    root.innerHTML = `
      <div class="v2-shell explore-shell">
        <header class="v2-topbar">
          <div class="v2-brand"><div class="v2-brand-mark">F</div><div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div></div>
          <div class="v2-status"><span></span> Core prototype</div>
        </header>

        <main class="explore-page">
          <section class="ask-ferda-hero">
            <div class="ask-ferda-mark">F</div>
            <span class="section-kicker">ASK FERDA</span>
            <h1>What should we do?</h1>
            <p>FERDA ranks ideas against your actual crew — not a generic “top 10”.</p>
          </section>

          <section class="ferda-context-strip">
            <div><b>${family.length}</b><small>travellers</small></div>
            <div><b>${esc(preferences.pace)}</b><small>pace</small></div>
            <div><b>${esc(preferences.walking)}</b><small>walking</small></div>
            <div><b>${esc(preferences.discovery)}</b><small>discovery</small></div>
          </section>

          <section class="ferda-question">
            <span class="section-kicker">WHAT KIND OF DAY?</span>
            <div class="ferda-moods" role="group" aria-label="Recommendation mood">
              <button type="button" data-mood="best" class="${mood==='best'?'active':''}">Best fit</button>
              <button type="button" data-mood="easy" class="${mood==='easy'?'active':''}">Easy day</button>
              <button type="button" data-mood="big" class="${mood==='big'?'active':''}">Big day</button>
              <button type="button" data-mood="indoor" class="${mood==='indoor'?'active':''}">Mostly indoors</button>
              <button type="button" data-mood="surprise" class="${mood==='surprise'?'active':''}">Surprise us</button>
            </div>
          </section>

          <section class="ferda-results-heading">
            <div><span class="section-kicker">FERDA RECOMMENDS</span><h2>Best matches for your crew</h2></div>
            <small>Prototype scores use your saved profiles and trip preferences.</small>
          </section>

          <section class="ferda-results">${ranked.map(resultCard).join('')}</section>
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

    root.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', () => {
      mood = button.dataset.mood;
      render();
      options.onRebrand?.();
    }));

    root.querySelectorAll('[data-add-result]').forEach(button => button.addEventListener('click', () => {
      const item = ORLANDO_OPTIONS.find(row => row.id === button.dataset.addResult);
      if (!item) return;
      const hour = new Date().getHours();
      const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      todayStore.add(todayKey(), { period, type:'activity', title:item.name, note:`FERDA recommendation · ${item.category}` });
      button.textContent = 'Added ✓';
      button.disabled = true;
    }));

    const dialog = root.querySelector('#ferdaWhyDialog');
    root.querySelectorAll('[data-more-result]').forEach(button => button.addEventListener('click', () => {
      const rankedItem = ranked.find(row => row.id === button.dataset.moreResult);
      if (!rankedItem) return;
      root.querySelector('#whyTitle').textContent = rankedItem.name;
      root.querySelector('#whyBody').innerHTML = `
        <div class="why-score"><b>${rankedItem.score}%</b><span>crew fit</span></div>
        <p>${esc(rankedItem.summary)}</p>
        <h3>Why it fits</h3>
        <ul>${rankedItem.reasons.map(reason=>`<li>${esc(reason)}</li>`).join('')}</ul>
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
