export const AVATAR_OPTIONS = [
  { id: 'explorer', label: 'Explorer', skin: '#D9A77C', hair: '#49342C', shirt: '#08756F', bg: '#DDF5F2', accent: '#F3A76F', style: 'cap' },
  { id: 'sunny', label: 'Sunshine', skin: '#F0BD90', hair: '#8A5B36', shirt: '#E68B45', bg: '#FFF0D9', accent: '#E7B92E', style: 'waves' },
  { id: 'stargazer', label: 'Stargazer', skin: '#8D5F45', hair: '#241D2A', shirt: '#6156A7', bg: '#ECE9FA', accent: '#6C7CF2', style: 'glasses' },
  { id: 'thrill', label: 'Thrill seeker', skin: '#C98663', hair: '#33251F', shirt: '#D65E58', bg: '#FFE8E5', accent: '#F07064', style: 'spike' },
  { id: 'beach', label: 'Beach day', skin: '#7A4A35', hair: '#171C1E', shirt: '#178BB1', bg: '#DFF5FB', accent: '#F2C24D', style: 'visor' },
  { id: 'foodie', label: 'Foodie', skin: '#EDB68E', hair: '#5A382D', shirt: '#A05D87', bg: '#F8E7F1', accent: '#EE826A', style: 'bun' },
  { id: 'wildlife', label: 'Wildlife fan', skin: '#B87355', hair: '#2B211E', shirt: '#477E56', bg: '#E7F3E6', accent: '#85A75F', style: 'curl' },
  { id: 'chill', label: 'Chill mode', skin: '#E0A374', hair: '#6B432D', shirt: '#4E7C9C', bg: '#E8F1F7', accent: '#7BA7C2', style: 'beanie' }
];

const ids = new Set(AVATAR_OPTIONS.map(option => option.id));

export function normaliseAvatar(value) {
  return ids.has(value) ? value : 'explorer';
}

function faceDetails(style, hair, accent) {
  if (style === 'cap') return `<path d="M22 26c2-8 9-13 18-13 8 0 14 3 18 9-10-1-22 1-36 4Z" fill="${accent}"/><path d="M26 22c4-5 9-7 15-7 6 0 11 2 15 6v7H26Z" fill="${hair}"/>`;
  if (style === 'waves') return `<path d="M22 30c0-11 8-18 18-18s18 7 18 18c-4-6-8-8-13-8-6 0-8 5-14 5-4 0-6-1-9-3Z" fill="${hair}"/>`;
  if (style === 'glasses') return `<path d="M22 29c1-11 8-17 18-17s17 7 18 17c-5-5-10-8-18-8s-13 3-18 8Z" fill="${hair}"/><g fill="none" stroke="#24333A" stroke-width="2"><circle cx="34" cy="35" r="5"/><circle cx="46" cy="35" r="5"/><path d="M39 35h2"/></g>`;
  if (style === 'spike') return `<path d="m22 29 4-11 5 4 4-9 5 7 6-9 3 10 7-4 2 12c-6-5-11-7-18-7s-12 2-18 7Z" fill="${hair}"/>`;
  if (style === 'visor') return `<path d="M22 29c2-10 8-17 18-17 9 0 15 5 18 14-8-2-18-2-28 1Z" fill="${hair}"/><path d="M24 23h31l5 6H23Z" fill="${accent}"/>`;
  if (style === 'bun') return `<circle cx="52" cy="17" r="8" fill="${hair}"/><path d="M22 30c1-11 8-18 18-18s17 7 18 18c-5-5-10-8-18-8s-13 3-18 8Z" fill="${hair}"/>`;
  if (style === 'curl') return `<g fill="${hair}"><circle cx="27" cy="23" r="7"/><circle cx="35" cy="17" r="8"/><circle cx="45" cy="17" r="8"/><circle cx="53" cy="23" r="7"/><path d="M23 31c4-7 9-10 17-10s13 3 17 10Z"/></g>`;
  return `<path d="M22 29c2-11 8-17 18-17s16 6 18 17c-6-4-12-6-18-6s-12 2-18 6Z" fill="${hair}"/><path d="M21 25c4-9 10-14 19-14s15 5 19 14Z" fill="${accent}"/>`;
}

export function avatarMarkup(value, options = {}) {
  const avatar = AVATAR_OPTIONS.find(option => option.id === normaliseAvatar(value)) || AVATAR_OPTIONS[0];
  const label = options.label || avatar.label;
  return `<svg class="traveller-avatar-svg" viewBox="0 0 80 80" role="img" aria-label="${label}">
    <circle cx="40" cy="40" r="40" fill="${avatar.bg}"/>
    <path d="M17 80c2-17 11-27 23-27s21 10 23 27Z" fill="${avatar.shirt}"/>
    <circle cx="40" cy="35" r="18" fill="${avatar.skin}"/>
    ${faceDetails(avatar.style, avatar.hair, avatar.accent)}
    <circle cx="34" cy="35" r="1.5" fill="#263238"/><circle cx="46" cy="35" r="1.5" fill="#263238"/>
    <path d="M35 44c3 3 7 3 10 0" fill="none" stroke="#7B4C3C" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="62" cy="61" r="11" fill="white" opacity=".94"/>
    <circle cx="62" cy="61" r="6" fill="none" stroke="${avatar.accent}" stroke-width="2"/>
    <path d="m62 56 2 4 4 1-4 2-2 4-2-4-4-2 4-1Z" fill="${avatar.accent}"/>
  </svg>`;
}
