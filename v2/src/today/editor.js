import './editor.css';

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function enhanceTodayEditor(root, todayStore, options = {}) {
  if (!root || !todayStore?.update) return () => {};

  const currentKey = dateKey();
  const buttons = [];
  let activeId = null;

  root.querySelectorAll('.today-item').forEach(item => {
    const removeButton = item.querySelector('[data-remove-today]');
    const copy = item.querySelector('.today-item-copy');
    if (!removeButton || !copy || copy.querySelector('[data-edit-today]')) return;

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'today-item-edit';
    edit.dataset.editToday = removeButton.dataset.removeToday;
    edit.textContent = 'Edit';
    copy.append(edit);
    buttons.push(edit);
  });

  if (!buttons.length) return () => {};

  const shell = root.querySelector('.v2-shell') || root;
  const dialog = document.createElement('dialog');
  dialog.className = 'today-edit-dialog';
  dialog.innerHTML = `
    <form method="dialog" data-today-edit-form>
      <div class="today-edit-head">
        <div><small>FERDA · TODAY</small><h2>Edit plan</h2></div>
        <button type="button" data-edit-close aria-label="Close">×</button>
      </div>
      <label>Time of day
        <select data-edit-period>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </label>
      <label>Type
        <select data-edit-type>
          <option value="activity">Activity</option>
          <option value="meal">Meal</option>
          <option value="travel">Journey</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>Plan<input data-edit-title maxlength="80" /></label>
      <label>Optional note<input data-edit-note maxlength="140" /></label>
      <div class="today-edit-actions">
        <button type="button" class="secondary" data-edit-close>Cancel</button>
        <button type="submit" class="primary">Save changes</button>
      </div>
    </form>`;
  shell.append(dialog);

  const form = dialog.querySelector('[data-today-edit-form]');
  const period = dialog.querySelector('[data-edit-period]');
  const type = dialog.querySelector('[data-edit-type]');
  const title = dialog.querySelector('[data-edit-title]');
  const note = dialog.querySelector('[data-edit-note]');

  function close() {
    activeId = null;
    if (dialog.open) dialog.close();
  }

  function open(id) {
    const item = todayStore.list(currentKey).find(row => String(row.id) === String(id));
    if (!item) return;
    activeId = item.id;
    period.value = item.period;
    type.value = item.type;
    title.value = item.title;
    note.value = item.note || '';
    dialog.showModal();
    requestAnimationFrame(() => title.focus());
  }

  function submit(event) {
    event.preventDefault();
    if (!activeId) return;
    const nextTitle = title.value.trim();
    if (!nextTitle) {
      title.focus();
      return;
    }
    todayStore.update(currentKey, activeId, {
      period: period.value,
      type: type.value,
      title: nextTitle,
      note: note.value.trim()
    });
    close();
    options.onRemount?.();
  }

  function backdropClose(event) {
    if (event.target === dialog) close();
  }

  buttons.forEach(button => button.addEventListener('click', () => open(button.dataset.editToday)));
  dialog.querySelectorAll('[data-edit-close]').forEach(button => button.addEventListener('click', close));
  form.addEventListener('submit', submit);
  dialog.addEventListener('click', backdropClose);

  return () => {
    buttons.forEach(button => button.remove());
    form.removeEventListener('submit', submit);
    dialog.removeEventListener('click', backdropClose);
    if (dialog.open) dialog.close();
    dialog.remove();
  };
}
