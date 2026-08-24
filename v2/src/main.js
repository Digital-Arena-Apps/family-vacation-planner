import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import Sortable from 'sortablejs';
import './styles.css';
import './brand/styles.css';
import './family/crew-ux.css';
import './family/avatar-ux.css';
import './family/dietary-trigger.css';
import { applyFerdaBranding } from './brand/apply.js';
import { createFamilyStore } from './family/store.js';
import { mountFamilyScreen } from './family/view.js';
import { enhanceMemberEditor } from './family/editor-ux.js';
import { mountDietaryScreen } from './dietary/view.js';
import { createTripPreferencesStore } from './preferences/store.js';
import { mountPreferencesScreen } from './preferences/view.js';
import { wirePreferencesRow } from './preferences/trigger.js';
import { createTripStore } from './trip/store.js';
import { mountTripScreen } from './trip/view.js';
import { createTodayStore } from './today/store.js';
import { mountHomeScreen } from './home/view.js';
import { wireV2Navigation } from './navigation/wire.js';

const store = createFamilyStore();
const preferencesStore = createTripPreferencesStore();
const tripStore = createTripStore();
const todayStore = createTodayStore();
const root = document.querySelector('#app');
let cleanup = [];

function unmount() {
  cleanup.forEach(fn => {
    try { fn?.(); } catch {}
  });
  cleanup = [];
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function brandAndScroll() {
  applyFerdaBranding(root);
  scrollTop();
}

function showHome() {
  unmount();
  const homeCleanup = mountHomeScreen(root, tripStore, store, preferencesStore, todayStore, {
    onTrip: showTrip,
    onFamily: showFamily,
    onRemount: showHome
  });
  const navCleanup = wireV2Navigation(root, {
    onToday: showHome,
    onExplore: showHome,
    onTrip: showTrip,
    onFamily: showFamily
  });
  brandAndScroll();
  cleanup = [homeCleanup, navCleanup];
}

function showFamily() {
  unmount();
  const viewCleanup = mountFamilyScreen(root, store, Sortable, {
    onDietary: memberId => showDietary(memberId)
  });
  const editorCleanup = enhanceMemberEditor(root);
  const preferencesCleanup = wirePreferencesRow(root, preferencesStore, showPreferences);
  const navCleanup = wireV2Navigation(root, {
    onToday: showHome,
    onExplore: showHome,
    onTrip: showTrip,
    onFamily: showFamily
  });
  brandAndScroll();
  cleanup = [viewCleanup, editorCleanup, preferencesCleanup, navCleanup];
}

function showDietary(memberId) {
  unmount();
  const dietaryCleanup = mountDietaryScreen(root, store, {
    memberId,
    onBack: showFamily
  });
  brandAndScroll();
  cleanup = [dietaryCleanup];
}

function showPreferences() {
  unmount();
  const preferencesCleanup = mountPreferencesScreen(root, preferencesStore, {
    onBack: showFamily,
    onRemount: showPreferences
  });
  brandAndScroll();
  cleanup = [preferencesCleanup];
}

function showTrip() {
  unmount();
  const tripCleanup = mountTripScreen(root, tripStore, {
    onBack: showHome,
    onRemount: showTrip
  });
  brandAndScroll();
  cleanup = [tripCleanup];
}

showHome();
