import FERDA_AVATAR_SPRITE from './ferda-avatar-sprite.js';

export const AVATAR_OPTIONS = [
  { id: 'alligator', label: 'Alligator', x: '0%', y: '0%' },
  { id: 'blackbear', label: 'Black bear', x: '33.333%', y: '0%' },
  { id: 'bobcat', label: 'Bobcat', x: '66.667%', y: '0%' },
  { id: 'gecko', label: 'Gecko', x: '100%', y: '0%' },
  { id: 'manatee', label: 'Manatee', x: '0%', y: '100%' },
  { id: 'osprey', label: 'Osprey', x: '33.333%', y: '100%' },
  { id: 'riverotter', label: 'River otter', x: '66.667%', y: '100%' },
  { id: 'sea-turtle', label: 'Sea turtle', x: '100%', y: '100%' }
];

const ids = new Set(AVATAR_OPTIONS.map(option => option.id));

// Preserve existing V2 family data while migrating the temporary human avatars
// to the permanent FERDA animal character set.
const legacyAliases = {
  explorer: 'alligator',
  'explorer-alt': 'alligator',
  sunny: 'blackbear',
  'sunny-alt': 'blackbear',
  stargazer: 'bobcat',
  'stargazer-alt': 'bobcat',
  thrill: 'gecko',
  'thrill-alt': 'gecko',
  beach: 'manatee',
  'beach-alt': 'manatee',
  foodie: 'osprey',
  'foodie-alt': 'osprey',
  wildlife: 'riverotter',
  'wildlife-alt': 'riverotter',
  chill: 'sea-turtle',
  'chill-alt': 'sea-turtle'
};

function escAttr(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function normaliseAvatar(value) {
  const next = legacyAliases[value] || value;
  return ids.has(next) ? next : 'alligator';
}

export function avatarAsset(value) {
  const id = normaliseAvatar(value);
  return AVATAR_OPTIONS.find(option => option.id === id) || AVATAR_OPTIONS[0];
}

export function avatarMarkup(value, options = {}) {
  const avatar = avatarAsset(value);
  const label = escAttr(options.label || `${avatar.label} FERDA avatar`);
  return `<span class="traveller-avatar-img ferda-avatar-sprite" role="img" aria-label="${label}" style="background-image:url('${FERDA_AVATAR_SPRITE}');background-size:400% 200%;background-position:${avatar.x} ${avatar.y};background-repeat:no-repeat;--avatar-scale:1"></span>`;
}
