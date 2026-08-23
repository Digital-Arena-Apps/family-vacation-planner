import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import Sortable from 'sortablejs';
import './styles.css';
import { createFamilyStore } from './family/store.js';
import { mountFamilyScreen } from './family/view.js';

const store = createFamilyStore();
mountFamilyScreen(document.querySelector('#app'), store, Sortable);
