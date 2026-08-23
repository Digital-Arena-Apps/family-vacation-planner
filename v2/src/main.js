import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import Sortable from 'sortablejs';
import './styles.css';
import './family/crew-ux.css';
import './family/avatar-ux.css';
import './family/dietary-trigger.css';
import { createFamilyStore } from './family/store.js';
import { mountFamilyScreen } from './family/view.js';
import { enhanceMemberEditor } from './family/editor-ux.js';
import { mountDietaryScreen } from './dietary/view.js';

const store = createFamilyStore();
const root = document.querySelector('#app');
let cleanup = [];

function unmount() {
  cleanup.forEach(fn => {
    try { fn?.(); } catch {}
  });
  cleanup = [];
}

function showFamily() {
  unmount();
  const viewCleanup = mountFamilyScreen(root, store, Sortable, {
    onDietary: memberId => showDietary(memberId)
  });
  const editorCleanup = enhanceMemberEditor(root);
  cleanup = [viewCleanup, editorCleanup];
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showDietary(memberId) {
  unmount();
  const dietaryCleanup = mountDietaryScreen(root, store, {
    memberId,
    onBack: showFamily
  });
  cleanup = [dietaryCleanup];
  window.scrollTo({ top: 0, behavior: 'instant' });
}

showFamily();
