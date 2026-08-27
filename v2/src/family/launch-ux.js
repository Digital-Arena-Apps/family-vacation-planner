function removePrototypeCopy(root) {
  root.querySelector('.family-page .v2-note')?.remove();
  const preferencesAction = root.querySelector('#familyPreferences .preference-action');
  if (preferencesAction) preferencesAction.textContent = 'Manage ›';
}

function renderEmptyState(root) {
  const list = root.querySelector('#familyList');
  if (!list) return;
  const hasMembers = !!list.querySelector('[data-member-id]');
  const existing = list.querySelector('.ferda-family-empty');

  if (hasMembers) {
    existing?.remove();
    return;
  }
  if (existing) return;

  const empty = document.createElement('section');
  empty.className = 'ferda-family-empty';
  empty.innerHTML = `
    <span class="ferda-family-empty-art"><img src="/brand/ferda-ui-icon-holiday-crew.webp" alt="" aria-hidden="true" /></span>
    <div>
      <span class="section-kicker">START WITH YOUR PEOPLE</span>
      <h2>Who’s coming with you?</h2>
      <p>Add each traveller once. FERDA uses the crew to make better choices about pace, rides, food, walking and the shape of the day.</p>
      <button type="button" data-ferda-start-crew>Add first traveller</button>
    </div>`;
  list.appendChild(empty);

  empty.querySelector('[data-ferda-start-crew]')?.addEventListener('click', () => {
    root.querySelector('#addPersonTop')?.click();
  });
}

export function enhanceFamilyForLaunch(root) {
  removePrototypeCopy(root);
  renderEmptyState(root);

  const list = root.querySelector('#familyList');
  if (!list) return () => {};
  const observer = new MutationObserver(() => {
    removePrototypeCopy(root);
    renderEmptyState(root);
  });
  observer.observe(list, { childList: true });

  return () => observer.disconnect();
}
