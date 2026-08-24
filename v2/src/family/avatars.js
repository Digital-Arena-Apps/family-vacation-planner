import FERDA_AVATAR_SPRITE from './ferda-avatar-sprite.js';
import { FERDA_PANTHER } from '../brand/runtime-assets.js';

export const AVATAR_OPTIONS = [
  { id: 'alligator', label: 'Alligator', col: 0, row: 0 },
  { id: 'blackbear', label: 'Black bear', col: 1, row: 0 },
  { id: 'bobcat', label: 'Bobcat', col: 2, row: 0 },
  { id: 'gecko', label: 'Gecko', col: 3, row: 0 },
  { id: 'manatee', label: 'Manatee', col: 0, row: 1 },
  { id: 'osprey', label: 'Osprey', col: 1, row: 1 },
  { id: 'riverotter', label: 'River otter', col: 2, row: 1 },
  { id: 'sea-turtle', label: 'Sea turtle', col: 3, row: 1 },
  { id: 'panther', label: 'Florida panther', src: FERDA_PANTHER }
];

const ids = new Set(AVATAR_OPTIONS.map(option => option.id));
const legacyAliases = {
  explorer: 'alligator', 'explorer-alt': 'alligator',
  sunny: 'blackbear', 'sunny-alt': 'blackbear',
  stargazer: 'bobcat', 'stargazer-alt': 'bobcat',
  thrill: 'gecko', 'thrill-alt': 'gecko',
  beach: 'manatee', 'beach-alt': 'manatee',
  foodie: 'osprey', 'foodie-alt': 'osprey',
  wildlife: 'riverotter', 'wildlife-alt': 'riverotter',
  chill: 'sea-turtle', 'chill-alt': 'sea-turtle'
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
  if (avatar.src) {
    return `<img class="traveller-avatar-img" src="${avatar.src}" alt="${label}" loading="lazy" decoding="async" />`;
  }
  const x = -(avatar.col * 96);
  const y = -(avatar.row * 96);
  return `<svg class="traveller-avatar-svg" viewBox="0 0 96 96" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice"><image href="${FERDA_AVATAR_SPRITE}" x="${x}" y="${y}" width="384" height="192" preserveAspectRatio="none" /></svg>`;
}
