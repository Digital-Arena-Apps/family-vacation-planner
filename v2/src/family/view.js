function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function initials(name, fallback) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

function heightLabel(value) {
  return ({
    under36: 'Under 36″',
    '36to41': '36–41″',
    '42to47': '42–47″',
    '48plus': '48″+',
    unknown: 'Height not set'
  })[value] || 'Height not set';
}

function thrillMeta(value) {
  return ({
    low: { label: 'Gentle rides', icon: '◇' },
    medium: { label: 'Some thrills', icon: '≈' },
    high: { label: 'Big thrills', icon: '△' }
  })[value] || { label: 'Some thrills', icon: '≈' };
}

function roleLabel(member) {
  if (member.role === 'child' && member.age >= 13) return 'Teen';
  return member.role === 'child' ? 'Child' : 'Adult';
}

function dietaryConfigured(dietary) {
  return !!dietary && (
    dietary.types?.length || dietary.avoids?.length || dietary.crossContact || dietary.notes
  );
}

export function mountFamilyScreen(root, store, Sortable, options = {}) {
  root.innerHTML = `
    <div class="v2-shell">
      <header class="v2-topbar">
        <div class="v2-brand">
          <div class="v2-brand-mark">F</div>
          <div><b>Family Vacation Planner</b><small>V2 PREVIEW</small></div>
        </div>
        <div class="v2-status"><span></span> Fresh build</div>
      </header>

      <main class="family-page">
        <section class="family-hero">
          <div class="eyebrow">YOUR HOLIDAY CREW</div>
          <h1>Family</h1>
          <p>Set the crew up once. We’ll use this to judge pace, ride fit, cost and who a recommendation actually needs to work for.</p>
        </section>

        <section class="crew-summary" aria-label="Family summary">
          <div class="crew-summary-icon">◎</div>
          <div class="crew-summary-copy"><b>Your holiday crew</b><span id="crewCount"></span></div>
          <wa-button id="addPersonTop" variant="brand" appearance="outlined" size="small">+ Add person</wa-button>
        </section>

        <section id="familyList" class="family-list" aria-label="Family members"></section>

        <button id="foodNeedsRow" class="preference-row food-needs-row" type="button" hidden>
          <span class="preference-icon">⌁</span>
          <span><b>Food & dietary needs</b><small id="foodNeedsSummary"></small></span>
          <span class="preference-action">Manage ›</span>
        </button>

        <button id="familyPreferences" class="preference-row" type="button">
          <span class="preference-icon">⚙</span>
          <span><b>Trip & family preferences</b><small>Budget, accessibility and holiday pace</small></span>
          <span class="preference-action">Coming next ›</span>
        </button>

        <section class="v2-note">
          <b>This is the new foundation.</b>
          <p>No legacy loader, no old service worker and no 200KB global app file. Family is the first vertical slice; the recommendation engine will migrate into this structure next.</p>
        </section>
      </main>

      <button id="familyFab" class="family-fab" type="button" aria-label="Add family member">+</button>

      <nav class="v2-nav" aria-label="V2 preview navigation">
        <button type="button" disabled><span>⌂</span><small>Today</small></button>
        <button type="button" disabled><span>⌕</span><small>Explore</small></button>
        <button type="button" disabled><span>▣</span><small>Trip</small></button>
        <button type="button" class="active"><span>☻</span><small>Family</small></button>
      </nav>

      <wa-drawer id="memberDrawer" placement="bottom" label="Add person" class="member-drawer">
        <form id="memberForm" class="member-form">
          <input id="memberId" type="hidden" />

          <label class="field span-2">
            <span>Name / nickname</span>
            <input id="memberName" type="text" maxlength="25" autocomplete="off" placeholder="e.g. Alex" required />
          </label>

          <label class="field">
            <span>Age</span>
            <input id="memberAge" type="number" min="0" max="99" inputmode="numeric" required />
          </label>

          <label class="field">
            <span>Role</span>
            <select id="memberRole">
              <option value="adult">Adult</option>
              <option value="child">Child / teen</option>
            </select>
          </label>

          <label class="field">
            <span>Ride vibe</span>
            <select id="memberThrill">
              <option value="low">Gentle please</option>
              <option value="medium">Some thrills</option>
              <option value="high">Bring it on</option>
            </select>
          </label>

          <label class="field">
            <span>Approx. ride height</span>
            <select id="memberHeightBand">
              <option value="unknown">Not sure</option>
              <option value="under36">Under 36″ / 92cm</option>
              <option value="36to41">36–41″ / 92–106cm</option>
              <option value="42to47">42–47″ / 107–121cm</option>
              <option value="48plus">48″+ / 122cm+</option>
            </select>
          </label>

          <label class="field span-2 dietary-question">
            <span>Any food allergies, intolerances or dietary needs?</span>
            <select id="memberDietaryEnabled">
              <option value="no">No</option>
              <option value="yes">Yes — set food needs</option>
            </select>
            <small class="field-hint">If yes, we’ll ask a few focused questions after saving and use them in food recommendations later.</small>
          </label>

          <label class="field span-2">
            <span>Anything else useful to remember <em>optional</em></span>
            <textarea id="memberNotes" rows="3" maxlength="180" placeholder="Stroller, gets motion sick, early riser…"></textarea>
          </label>
        </form>

        <div slot="footer" class="drawer-actions">
          <wa-button id="deleteMember" variant="danger" appearance="plain">Delete</wa-button>
          <span></span>
          <wa-button id="cancelMember" appearance="outlined">Cancel</wa-button>
          <wa-button id="saveMember" variant="brand">Save person</wa-button>
        </div>
      </wa-drawer>

      <div id="v2Toast" class="v2-toast" role="status" aria-live="polite"></div>
    </div>
  `;

  const list = root.querySelector('#familyList');
  const count = root.querySelector('#crewCount');
  const foodNeedsRow = root.querySelector('#foodNeedsRow');
  const foodNeedsSummary = root.querySelector('#foodNeedsSummary');
  const drawer = root.querySelector('#memberDrawer');
  const form = root.querySelector('#memberForm');
  const memberId = root.querySelector('#memberId');
  const memberName = root.querySelector('#memberName');
  const memberAge = root.querySelector('#memberAge');
  const memberRole = root.querySelector('#memberRole');
  const memberThrill = root.querySelector('#memberThrill');
  const memberHeightBand = root.querySelector('#memberHeightBand');
  const memberDietaryEnabled = root.querySelector('#memberDietaryEnabled');
  const memberNotes = root.querySelector('#memberNotes');
  const deleteButton = root.querySelector('#deleteMember');
  const toast = root.querySelector('#v2Toast');

  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function render() {
    const members = store.list();
    const adults = members.filter(member => member.role === 'adult').length;
    const children = members.length - adults;
    const dietaryMembers = members.filter(member => member.dietary?.enabled);
    count.textContent = `${members.length} traveller${members.length === 1 ? '' : 's'} · ${adults} adult${adults === 1 ? '' : 's'}${children ? ` · ${children} younger` : ''}`;

    foodNeedsRow.hidden = dietaryMembers.length === 0;
    if (dietaryMembers.length) {
      const names = dietaryMembers.map(member => member.name);
      foodNeedsSummary.textContent = names.length <= 2 ? names.join(' & ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
    }

    list.innerHTML = members.map((member, index) => {
      const thrill = thrillMeta(member.thrill);
      const fallback = member.role === 'adult' ? `A${index + 1}` : `C${index + 1}`;
      const note = member.notes ? `<span class="member-note">${esc(member.notes)}</span>` : '';
      const food = member.dietary?.enabled ? '<span class="member-food">Food needs</span>' : '';
      return `
        <article class="member-card" data-member-id="${esc(member.id)}">
          <button class="drag-handle" type="button" aria-label="Reorder ${esc(member.name)}" title="Drag to reorder"><i></i><i></i><i></i></button>
          <button class="member-main" type="button" data-edit-member="${esc(member.id)}">
            <span class="member-avatar ${member.role}">${esc(initials(member.name, fallback))}</span>
            <span class="member-copy">
              <span class="member-title"><b>${esc(member.name)}</b><small>${roleLabel(member)} · Age ${member.age}</small></span>
              <span class="member-meta"><span>${esc(heightLabel(member.heightBand))}</span><span class="thrill ${member.thrill}">${thrill.icon} ${thrill.label}</span>${food}</span>
              ${note}
            </span>
            <span class="member-chevron">›</span>
          </button>
        </article>
      `;
    }).join('');
  }

  function openMember(member = null) {
    const editing = !!member;
    drawer.label = editing ? `Edit ${member.name}` : 'Add person';
    memberId.value = member?.id || '';
    memberName.value = member?.name || '';
    memberAge.value = member?.age ?? '';
    memberRole.value = member?.role || 'adult';
    memberThrill.value = member?.thrill || 'medium';
    memberHeightBand.value = member?.heightBand || 'unknown';
    memberDietaryEnabled.value = member?.dietary?.enabled ? 'yes' : 'no';
    memberNotes.value = member?.notes || '';
    deleteButton.hidden = !editing;
    drawer.open = true;
    requestAnimationFrame(() => memberName.focus());
  }

  function saveCurrent() {
    if (!form.reportValidity()) return;
    const existing = memberId.value ? store.get(memberId.value) : null;
    const dietaryEnabled = memberDietaryEnabled.value === 'yes';
    const shouldOpenDietary = dietaryEnabled && (!existing?.dietary?.enabled || !dietaryConfigured(existing?.dietary));
    const saved = store.save({
      ...existing,
      id: memberId.value || undefined,
      name: memberName.value,
      age: memberAge.value,
      role: memberRole.value,
      thrill: memberThrill.value,
      heightBand: memberHeightBand.value,
      dietary: {
        ...(existing?.dietary || {}),
        enabled: dietaryEnabled
      },
      notes: memberNotes.value
    });
    drawer.open = false;
    showToast(existing ? 'Person updated' : 'Person added');
    if (shouldOpenDietary) {
      setTimeout(() => options.onDietary?.(saved.id), 180);
    }
  }

  root.querySelector('#addPersonTop').addEventListener('click', () => openMember());
  root.querySelector('#familyFab').addEventListener('click', () => openMember());
  root.querySelector('#cancelMember').addEventListener('click', () => { drawer.open = false; });
  root.querySelector('#saveMember').addEventListener('click', saveCurrent);
  form.addEventListener('submit', event => { event.preventDefault(); saveCurrent(); });

  foodNeedsRow.addEventListener('click', () => {
    const first = store.list().find(member => member.dietary?.enabled);
    if (first) options.onDietary?.(first.id);
  });

  deleteButton.addEventListener('click', () => {
    if (!memberId.value) return;
    if (store.list().length <= 1) {
      showToast('Keep at least one traveller');
      return;
    }
    store.remove(memberId.value);
    drawer.open = false;
    showToast('Person removed');
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-edit-member]');
    if (!button) return;
    const member = store.get(button.dataset.editMember);
    if (member) openMember(member);
  });

  const sortable = new Sortable(list, {
    animation: 180,
    handle: '.drag-handle',
    ghostClass: 'drag-ghost',
    chosenClass: 'drag-chosen',
    dragClass: 'drag-active',
    delayOnTouchOnly: true,
    delay: 120,
    touchStartThreshold: 4,
    onEnd() {
      const order = [...list.querySelectorAll('[data-member-id]')].map(card => card.dataset.memberId);
      store.reorder(order);
      showToast('Crew order saved');
    }
  });

  const unsubscribe = store.subscribe(render);
  render();

  return () => {
    unsubscribe();
    sortable.destroy();
    clearTimeout(toastTimer);
  };
}
