import { preferenceSummary } from './view.js';

export function wirePreferencesRow(root, store, onOpen) {
  const row = root.querySelector('#familyPreferences');
  if (!row) return () => {};

  const copy = row.querySelector('small');
  const action = row.querySelector('.preference-action');
  row.classList.add('family-preferences-row');
  if (action) action.textContent = 'Manage ›';

  function render(value = store.get()) {
    if (copy) copy.textContent = preferenceSummary(value);
  }

  function open() {
    onOpen?.();
  }

  row.addEventListener('click', open);
  const unsubscribe = store.subscribe(render);
  render();

  return () => {
    row.removeEventListener('click', open);
    unsubscribe();
  };
}
