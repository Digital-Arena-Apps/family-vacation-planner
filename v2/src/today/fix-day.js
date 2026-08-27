import './fix-day.css';

const PERIOD_LABELS = Object.freeze({
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening'
});

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function countByPeriod(items) {
  return items.reduce((counts, item) => {
    if (counts[item.period] !== undefined) counts[item.period] += 1;
    return counts;
  }, { morning: 0, afternoon: 0, evening: 0 });
}

function hasFoodPlan(items) {
  return items.some(item => item.type === 'meal' || /breakfast|brunch|lunch|dinner|tea|food|meal|restaurant|snack/i.test(item.title));
}

function hasResetPlan(items) {
  return items.some(item => /break|rest|reset|pool|chill|downtime|relax/i.test(item.title));
}

function dietaryCrewCount(people = []) {
  return people.filter(person => person?.dietary?.enabled).length;
}

function makeFinding(id, tone, title, detail, action = null) {
  return { id, tone, title, detail, action };
}

export function analyseDay(items = [], preferences = {}, people = []) {
  const plans = Array.isArray(items) ? items : [];
  const counts = countByPeriod(plans);
  const dietaryCount = dietaryCrewCount(people);
  const findings = [];

  if (!plans.length) {
    findings.push(makeFinding(
      'empty-day',
      'info',
      'Nothing is locked in yet',
      'That can be a good thing. Pick one anchor plan first, then let FERDA help shape the rest of the day.'
    ));
    return { score: 68, label: 'Wide open', findings };
  }

  if (plans.length >= 2 && !hasFoodPlan(plans)) {
    findings.push(makeFinding(
      'food-gap',
      dietaryCount ? 'attention' : 'nudge',
      dietaryCount ? 'Protect a crew-friendly food stop' : 'Give yourselves a food break',
      dietaryCount
        ? `${dietaryCount} traveller${dietaryCount === 1 ? '' : 's'} ha${dietaryCount === 1 ? 's' : 've'} dietary needs saved. Planning the stop before everyone is hungry usually makes the day easier.`
        : 'A simple meal or snack window stops a good day turning into a last-minute search when everyone is hungry.',
      { type: 'meal', period: counts.afternoon <= counts.evening ? 'afternoon' : 'evening' }
    ));
  }

  const busiest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const maxComfort = preferences.pace === 'full' ? 4 : preferences.pace === 'relaxed' ? 2 : 3;
  if (busiest?.[1] > maxComfort) {
    findings.push(makeFinding(
      'dense-period',
      'attention',
      `${busiest[0][0].toUpperCase()}${busiest[0].slice(1)} is doing too much`,
      `${busiest[1]} plans are stacked into the ${PERIOD_LABELS[busiest[0]]}. FERDA would keep a little more breathing room around them.`
    ));
  }

  if (preferences.rhythm === 'late' && counts.morning >= 2) {
    findings.push(makeFinding(
      'late-rhythm',
      'nudge',
      'Your crew prefers a later start',
      'You have several morning plans but your trip preference says later starts. Check that the first part of the day still feels realistic.'
    ));
  }

  if ((preferences.pace === 'relaxed' || preferences.walking === 'low' || preferences.accessibility?.quietBreaks) && plans.length >= 4 && !hasResetPlan(plans)) {
    findings.push(makeFinding(
      'reset-gap',
      'nudge',
      'Build in a reset',
      preferences.walking === 'low'
        ? 'This is a fairly full day for a lower-walking preference. A deliberate sit-down or reset window can protect the rest of the day.'
        : 'Your preferences lean toward a gentler pace. A short reset window gives the day somewhere to flex if energy dips.',
      { type: 'other', period: counts.afternoon <= counts.evening ? 'afternoon' : 'evening' }
    ));
  }

  if (preferences.pace === 'full' && plans.length <= 2) {
    findings.push(makeFinding(
      'sparse-full-day',
      'info',
      'You like fuller days',
      'There is still plenty of room here. Keep one slot flexible and use Explore when you are ready to add something nearby.'
    ));
  }

  if (!findings.length) {
    findings.push(makeFinding(
      'balanced',
      'good',
      'This day has a good shape',
      'Nothing obvious needs fixing. You have enough structure to know what you are doing without squeezing out all the flexibility.'
    ));
  }

  let score = 90;
  findings.forEach(finding => {
    if (finding.tone === 'attention') score -= 16;
    else if (finding.tone === 'nudge') score -= 8;
    else if (finding.tone === 'info') score -= 3;
  });
  score = Math.max(45, Math.min(96, score));
  const label = score >= 88 ? 'Nicely balanced' : score >= 72 ? 'A couple of tweaks' : 'Worth a quick fix';
  return { score, label, findings };
}

function quickFixCopy(action, people = []) {
  if (action.type === 'meal') {
    const dietaryCount = dietaryCrewCount(people);
    return {
      title: dietaryCount ? 'Crew-friendly food break' : 'Flexible food break',
      note: dietaryCount
        ? 'FERDA added this as breathing room — choose somewhere that works for the crew’s saved dietary needs.'
        : 'FERDA added this as breathing room — choose somewhere nearby when you know how the day is running.'
    };
  }
  return {
    title: 'Reset break',
    note: 'A flexible sit-down / recharge window. Move or remove it if the day is flowing well.'
  };
}

export function enhanceFixMyDay(root, todayStore, familyStore, preferencesStore, options = {}) {
  const overview = root?.querySelector('.today-overview');
  if (!overview || !todayStore || !familyStore || !preferencesStore) return () => {};

  const existing = overview.querySelector('[data-fix-my-day]');
  if (existing) return () => {};

  const primaryAction = overview.querySelector('.today-primary-action');
  const actionStack = document.createElement('div');
  actionStack.className = 'today-overview-actions';
  if (primaryAction) {
    primaryAction.before(actionStack);
    actionStack.append(primaryAction);
  } else {
    overview.append(actionStack);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'today-fix-action';
  button.dataset.fixMyDay = 'true';
  button.innerHTML = '<span class="today-fix-mark">F</span><span><b>Fix my day</b><small>FERDA balance check</small></span>';
  actionStack.append(button);

  const shell = root.querySelector('.v2-shell') || root;
  const dialog = document.createElement('dialog');
  dialog.className = 'fix-day-dialog';
  dialog.innerHTML = `
    <div class="fix-day-panel">
      <div class="fix-day-head">
        <div class="fix-day-brand"><span>F</span><div><small>FERDA</small><b>Fix my day</b></div></div>
        <button type="button" data-fix-close aria-label="Close">×</button>
      </div>
      <div data-fix-content></div>
    </div>`;
  shell.append(dialog);

  const content = dialog.querySelector('[data-fix-content]');

  function render() {
    const key = dateKey();
    const items = todayStore.list(key);
    const people = familyStore.list();
    const preferences = preferencesStore.get();
    const result = analyseDay(items, preferences, people);

    content.innerHTML = `
      <section class="fix-day-score">
        <div class="fix-day-score-ring" style="--fix-score:${result.score}"><b>${result.score}</b><small>/100</small></div>
        <div><span>DAY BALANCE</span><h2>${esc(result.label)}</h2><p>FERDA checks the shape of today against your crew and trip preferences. It will never move or delete an existing plan without you doing it.</p></div>
      </section>
      <section class="fix-day-findings">
        ${result.findings.map(finding => `
          <article class="fix-finding ${finding.tone}">
            <span class="fix-finding-dot"></span>
            <div><b>${esc(finding.title)}</b><p>${esc(finding.detail)}</p></div>
            ${finding.action ? `<button type="button" data-fix-action="${esc(finding.id)}">${finding.action.type === 'meal' ? 'Add food break' : 'Add reset'}</button>` : ''}
          </article>`).join('')}
      </section>
      <div class="fix-day-footer"><button type="button" data-fix-close class="fix-day-done">Done</button></div>`;

    content.querySelectorAll('[data-fix-action]').forEach(actionButton => {
      actionButton.addEventListener('click', () => {
        const finding = result.findings.find(row => row.id === actionButton.dataset.fixAction);
        if (!finding?.action) return;
        const copy = quickFixCopy(finding.action, people);
        todayStore.add(key, {
          period: finding.action.period,
          type: finding.action.type,
          title: copy.title,
          note: copy.note
        });
        dialog.close();
        options.onRemount?.();
      });
    });

    content.querySelectorAll('[data-fix-close]').forEach(closeButton => {
      closeButton.addEventListener('click', () => dialog.close());
    });
  }

  function open() {
    render();
    dialog.showModal();
  }

  function closeFromBackdrop(event) {
    if (event.target === dialog) dialog.close();
  }

  button.addEventListener('click', open);
  dialog.querySelector('[data-fix-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', closeFromBackdrop);

  return () => {
    button.removeEventListener('click', open);
    dialog.removeEventListener('click', closeFromBackdrop);
    if (dialog.open) dialog.close();
    dialog.remove();
    if (primaryAction && actionStack.isConnected) overview.append(primaryAction);
    actionStack.remove();
  };
}
