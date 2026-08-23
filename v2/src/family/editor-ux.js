import './editor-ux.css';

export function enhanceMemberEditor(root) {
  const drawer = root.querySelector('#memberDrawer');
  const form = root.querySelector('#memberForm');
  const list = root.querySelector('#familyList');
  if (!drawer || !form) return () => {};

  const shell = document.createElement('div');
  shell.className = 'drawer-body-shell';

  const scrollRegion = document.createElement('div');
  scrollRegion.className = 'drawer-scroll-region';
  scrollRegion.setAttribute('tabindex', '-1');

  const cue = document.createElement('div');
  cue.className = 'drawer-scroll-cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.innerHTML = '<span>More options below</span><b>↓</b>';

  form.before(shell);
  shell.append(scrollRegion, cue);
  scrollRegion.append(form);

  let cueTimer;

  function updateCue() {
    const overflow = scrollRegion.scrollHeight > scrollRegion.clientHeight + 8;
    const untouched = scrollRegion.scrollTop < 12;
    shell.classList.toggle('show-scroll-cue', overflow && untouched);
  }

  function resetEditorViewport() {
    scrollRegion.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(updateCue));
    clearTimeout(cueTimer);
    cueTimer = setTimeout(updateCue, 180);
  }

  scrollRegion.addEventListener('scroll', updateCue, { passive: true });

  root.querySelector('#addPersonTop')?.addEventListener('click', resetEditorViewport);
  root.querySelector('#familyFab')?.addEventListener('click', resetEditorViewport);
  list?.addEventListener('click', event => {
    if (event.target.closest('[data-edit-member]')) resetEditorViewport();
  });

  let observer;
  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(updateCue);
    observer.observe(scrollRegion);
    observer.observe(form);
  }

  resetEditorViewport();

  return () => {
    clearTimeout(cueTimer);
    observer?.disconnect();
  };
}
