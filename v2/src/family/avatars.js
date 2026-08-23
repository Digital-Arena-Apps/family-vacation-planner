export const AVATAR_OPTIONS = [
  { id: 'explorer', label: 'Explorer', src: '/avatars/explorer.webp', cropScale: 1 },
  { id: 'sunny', label: 'Sunshine', src: '/avatars/sunshine.webp', cropScale: 1.23 },
  { id: 'stargazer', label: 'Stargazer', src: '/avatars/stargazer.webp', cropScale: 1.23 },
  { id: 'thrill', label: 'Thrill seeker', src: '/avatars/thrill.webp', cropScale: 1.24 },
  { id: 'beach', label: 'Beach day', src: '/avatars/beach.webp', cropScale: 1.43 },
  { id: 'foodie', label: 'Foodie', src: '/avatars/foodie.webp', cropScale: 1.43 },
  { id: 'wildlife', label: 'Wildlife fan', src: '/avatars/wildlife.webp', cropScale: 1.43 },
  { id: 'chill', label: 'Chill mode', src: '/avatars/chill.webp', cropScale: 1.43 }
];

const ids = new Set(AVATAR_OPTIONS.map(option => option.id));
const legacyAliases = {
  'explorer-alt': 'explorer',
  'sunny-alt': 'sunny',
  'stargazer-alt': 'stargazer',
  'thrill-alt': 'thrill',
  'beach-alt': 'beach',
  'foodie-alt': 'foodie',
  'wildlife-alt': 'wildlife',
  'chill-alt': 'chill'
};

function escAttr(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function normaliseAvatar(value) {
  const next = legacyAliases[value] || value;
  return ids.has(next) ? next : 'explorer';
}

export function avatarAsset(value) {
  const id = normaliseAvatar(value);
  return AVATAR_OPTIONS.find(option => option.id === id) || AVATAR_OPTIONS[0];
}

export function avatarMarkup(value, options = {}) {
  const avatar = avatarAsset(value);
  const label = escAttr(options.label || `${avatar.label} traveller avatar`);
  return `<img class="traveller-avatar-img" src="${avatar.src}" alt="${label}" loading="lazy" decoding="async" style="--avatar-scale:${avatar.cropScale}" />`;
}
