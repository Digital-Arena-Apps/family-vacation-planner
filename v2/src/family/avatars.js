export const AVATAR_OPTIONS = [
  { id: 'explorer', label: 'Explorer', scene: 'mountains', skin: '#C9875E', hair: '#3A261F', shirt: '#356E5E', accent: '#E5A95C', hairStyle: 'messy', accessory: 'backpack', detail: 'beard' },
  { id: 'explorer-alt', label: 'Explorer', scene: 'forest', skin: '#9A5F42', hair: '#241A18', shirt: '#6F7D45', accent: '#E2B762', hairStyle: 'braids', accessory: 'scarf', detail: 'none' },
  { id: 'sunny', label: 'Sunshine', scene: 'sunny', skin: '#EFC39B', hair: '#D39A52', shirt: '#F0B83E', accent: '#F39A68', hairStyle: 'waves', accessory: 'flowers', detail: 'none' },
  { id: 'sunny-alt', label: 'Sunshine', scene: 'sunny', skin: '#D99A6D', hair: '#A35E35', shirt: '#E58D4A', accent: '#4BAF9D', hairStyle: 'sweep', accessory: 'sunglasses-up', detail: 'none' },
  { id: 'stargazer', label: 'Stargazer', scene: 'stars', skin: '#C88869', hair: '#292235', shirt: '#4E4E91', accent: '#EFCC5A', hairStyle: 'bob', accessory: 'glasses', detail: 'none' },
  { id: 'stargazer-alt', label: 'Stargazer', scene: 'stars', skin: '#8C5B43', hair: '#1F1B24', shirt: '#345C8D', accent: '#7C79E8', hairStyle: 'quiff', accessory: 'glasses', detail: 'none' },
  { id: 'thrill', label: 'Thrill seeker', scene: 'coaster', skin: '#C98663', hair: '#33251F', shirt: '#CA4F49', accent: '#313C48', hairStyle: 'short', accessory: 'helmet', detail: 'none' },
  { id: 'thrill-alt', label: 'Thrill seeker', scene: 'coaster', skin: '#E1A77C', hair: '#8A4C27', shirt: '#EA7C36', accent: '#2D5367', hairStyle: 'spike', accessory: 'goggles', detail: 'none' },
  { id: 'beach', label: 'Beach day', scene: 'beach', skin: '#A76B4E', hair: '#503128', shirt: '#2CA6AE', accent: '#F2C45E', hairStyle: 'long', accessory: 'sunglasses', detail: 'none' },
  { id: 'beach-alt', label: 'Beach day', scene: 'beach', skin: '#D8996B', hair: '#6E4026', shirt: '#2E8DB6', accent: '#F1A94A', hairStyle: 'surf', accessory: 'none', detail: 'none' },
  { id: 'foodie', label: 'Foodie', scene: 'cafe', skin: '#E7B08A', hair: '#A94D2E', shirt: '#A45D83', accent: '#F18B69', hairStyle: 'curls', accessory: 'chef', detail: 'none' },
  { id: 'foodie-alt', label: 'Foodie', scene: 'market', skin: '#A96D4A', hair: '#202027', shirt: '#3E826F', accent: '#EF9E45', hairStyle: 'sweep', accessory: 'apron', detail: 'moustache' },
  { id: 'wildlife', label: 'Wildlife fan', scene: 'wildlife', skin: '#6D402F', hair: '#231B1B', shirt: '#557A4D', accent: '#DF9855', hairStyle: 'braids', accessory: 'binoculars', detail: 'none' },
  { id: 'wildlife-alt', label: 'Wildlife fan', scene: 'savanna', skin: '#C0845F', hair: '#493026', shirt: '#776A45', accent: '#C89A4B', hairStyle: 'short', accessory: 'safari', detail: 'beard' },
  { id: 'chill', label: 'Chill mode', scene: 'cosy', skin: '#D99C78', hair: '#402A3B', shirt: '#4B6B86', accent: '#8C70A5', hairStyle: 'long', accessory: 'headphones', detail: 'none' },
  { id: 'chill-alt', label: 'Chill mode', scene: 'cosy', skin: '#B87956', hair: '#342B2B', shirt: '#3E566F', accent: '#738CA0', hairStyle: 'short', accessory: 'beanie', detail: 'none' }
];

const ids = new Set(AVATAR_OPTIONS.map(option => option.id));

function escAttr(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function normaliseAvatar(value) {
  return ids.has(value) ? value : 'explorer';
}

function sceneMarkup(scene) {
  const map = {
    mountains: '<circle cx="75" cy="21" r="10" fill="#FFE2A0"/><path d="M0 61 22 38l13 13 15-22 27 32Z" fill="#8DB8A7"/><path d="M15 62 35 43l9 10 12-17 25 26Z" fill="#D8E9DF"/><path d="M0 66c22-8 52-8 96 2v28H0Z" fill="#90B89D"/>',
    forest: '<circle cx="76" cy="18" r="9" fill="#F8D27B"/><path d="M4 67 18 37l14 30ZM18 70l16-40 16 40ZM55 70l15-42 18 42Z" fill="#75A36E"/><path d="M0 72h96v24H0Z" fill="#C8D5A8"/>',
    sunny: '<circle cx="75" cy="20" r="12" fill="#FFD85B"/><g stroke="#FFD85B" stroke-width="3" stroke-linecap="round"><path d="M75 3v7M75 30v7M58 20h7M85 20h7M63 8l5 5M82 27l5 5M87 8l-5 5M68 27l-5 5"/></g><path d="M0 66c20-9 45-8 96 2v28H0Z" fill="#B8DFC7"/>',
    stars: '<rect width="96" height="96" rx="48" fill="#25345E"/><g fill="#F8D76A"><circle cx="18" cy="17" r="2"/><circle cx="74" cy="15" r="1.5"/><circle cx="83" cy="34" r="2"/><circle cx="15" cy="43" r="1.5"/><path d="m62 9 2 4 4 1-4 2-2 4-2-4-4-2 4-1Z"/><path d="m29 27 1.5 3 3.5.7-3.5 1.7-1.5 3-1.5-3-3.5-1.7 3.5-.7Z"/></g><path d="M5 75c22-16 55-18 86-4v25H5Z" fill="#384C78"/>',
    coaster: '<rect width="96" height="96" rx="48" fill="#DDF3F7"/><path d="M0 58c18-23 34-30 52-10 15 17 23 7 44-15" fill="none" stroke="#4B8EA2" stroke-width="4"/><path d="M4 72h88" stroke="#9AC3CA" stroke-width="2"/><circle cx="78" cy="28" r="8" fill="#FFD96B"/>',
    beach: '<rect width="96" height="96" rx="48" fill="#CBEAF1"/><circle cx="77" cy="19" r="10" fill="#FFD66B"/><path d="M0 58c14-6 30-6 48 0s34 7 48 0v18H0Z" fill="#55B8CB"/><path d="M0 73c25-8 57-4 96 3v20H0Z" fill="#F0D39D"/><path d="M10 58c10-8 18-9 26-1" fill="none" stroke="#FFF" stroke-width="3"/>',
    cafe: '<rect width="96" height="96" rx="48" fill="#F5DDCF"/><path d="M0 32h96v13H0Z" fill="#EF9D77"/><path d="M7 32h12v13H7ZM31 32h12v13H31ZM55 32h12v13H55ZM79 32h12v13H79Z" fill="#FFF0E6"/><circle cx="79" cy="22" r="7" fill="#F4C460"/><path d="M0 66h96v30H0Z" fill="#EEC9B4"/>',
    market: '<rect width="96" height="96" rx="48" fill="#F2E1C2"/><path d="M0 30h96v16H0Z" fill="#E46F56"/><path d="M8 30h12v16H8ZM32 30h12v16H32ZM56 30h12v16H56ZM80 30h12v16H80Z" fill="#FFF0D8"/><circle cx="77" cy="65" r="11" fill="#E4A04D"/><circle cx="17" cy="68" r="9" fill="#73A45B"/>',
    wildlife: '<rect width="96" height="96" rx="48" fill="#DDEBD2"/><path d="M0 66c14-16 28-19 42-9 14-14 32-16 54-3v42H0Z" fill="#8AB376"/><path d="M75 43c8-4 13 0 13 7-5 1-8-1-10-4-1 5-4 8-9 9 0-6 2-10 6-12Z" fill="#D47743"/><circle cx="83" cy="48" r="1.5" fill="#2F342E"/>',
    savanna: '<rect width="96" height="96" rx="48" fill="#F1DFC0"/><circle cx="75" cy="20" r="10" fill="#F2B85B"/><path d="M0 66c25-6 55-7 96-1v31H0Z" fill="#C6B36B"/><path d="M23 60c0-16 8-26 18-26-1 10-7 18-18 26Z" fill="#667B49"/><path d="M26 56v22" stroke="#5D6041" stroke-width="3"/>',
    cosy: '<rect width="96" height="96" rx="48" fill="#DDCFCB"/><rect x="64" y="12" width="25" height="39" rx="4" fill="#6C4D4A"/><path d="M70 45c1-12 11-17 14-1-2 5-6 8-8 8s-5-3-6-7Z" fill="#F29A57"/><path d="M0 67h96v29H0Z" fill="#B99F92"/><rect x="7" y="51" width="25" height="6" rx="3" fill="#6E687B"/><rect x="10" y="44" width="21" height="5" rx="2" fill="#8397A7"/>'
  };
  return map[scene] || map.sunny;
}

function hairMarkup(style, hair) {
  const map = {
    messy: `<path d="M25 38c-2-18 8-29 24-29 13 0 23 8 24 23-7-8-14-11-24-10-10 1-16 7-24 16Z" fill="${hair}"/><path d="m30 14 8-8 2 9 10-8-1 9 12-5-5 10" fill="${hair}"/>`,
    braids: `<path d="M24 38c-1-19 8-29 24-29 15 0 24 10 24 29-7-8-15-12-24-12s-17 4-24 12Z" fill="${hair}"/><path d="M29 29c-5 17-3 31 3 42M67 29c5 17 3 31-3 42" fill="none" stroke="${hair}" stroke-width="7" stroke-linecap="round" stroke-dasharray="4 2"/>`,
    waves: `<path d="M21 39C20 19 31 8 48 8c17 0 28 11 27 31-8-11-16-14-25-12-8 2-13 8-22 7-3 0-5 2-7 5Z" fill="${hair}"/><path d="M22 37c-5 19 1 34 10 40M73 37c5 19-1 34-10 40" fill="none" stroke="${hair}" stroke-width="8" stroke-linecap="round"/>`,
    sweep: `<path d="M23 38c-2-17 8-29 24-29 14 0 24 9 25 25-9-8-17-11-26-9-8 1-14 7-23 13Z" fill="${hair}"/><path d="M31 15c14-8 28-4 36 8-15-5-27-3-36 6Z" fill="${hair}"/>`,
    bob: `<path d="M21 40c-1-20 9-31 27-31 17 0 27 12 26 31l-7 24-7-16c-4 6-20 6-24 0l-7 16Z" fill="${hair}"/>`,
    quiff: `<path d="M23 38c0-15 8-27 23-28 14-1 25 7 27 23-7-6-14-9-22-8-11 1-17 7-28 13Z" fill="${hair}"/><path d="M32 13c5-10 15-10 20 0 5-8 13-7 17 2-13-3-25-1-37 5Z" fill="${hair}"/>`,
    short: `<path d="M25 37c-1-17 8-27 23-27s24 10 23 27c-6-7-13-10-23-10s-17 3-23 10Z" fill="${hair}"/>`,
    spike: `<path d="M24 37 27 20l7 5 4-15 8 10 7-14 4 15 10-8-2 18 7-4-1 12c-7-8-14-12-23-12s-17 3-24 10Z" fill="${hair}"/>`,
    long: `<path d="M21 39C20 19 30 8 48 8c18 0 28 12 27 31-7-9-15-13-27-13-11 0-19 4-27 13Z" fill="${hair}"/><path d="M24 35c-6 22-1 38 8 46M72 35c6 22 1 38-8 46" fill="none" stroke="${hair}" stroke-width="10" stroke-linecap="round"/>`,
    surf: `<path d="M23 38c-1-16 8-28 25-28 15 0 24 9 25 24-8-7-16-10-25-8-9 1-15 6-25 12Z" fill="${hair}"/><path d="M31 14c11-9 26-6 36 4-14-2-24 1-36 9Z" fill="${hair}"/>`,
    curls: `<g fill="${hair}"><circle cx="29" cy="22" r="10"/><circle cx="40" cy="15" r="10"/><circle cx="53" cy="15" r="10"/><circle cx="65" cy="23" r="10"/><circle cx="23" cy="35" r="9"/><circle cx="72" cy="35" r="9"/><path d="M25 44c4-13 12-20 23-20 13 0 21 7 24 20Z"/></g>`
  };
  return map[style] || map.short;
}

function accessoryMarkup(accessory, accent) {
  const map = {
    backpack: `<path d="M20 55c-8 4-10 13-8 24h12Z" fill="#835E42"/><circle cx="17" cy="62" r="3" fill="${accent}"/>`,
    scarf: `<path d="M31 65c12 6 23 6 34 0l-3 9c-10 5-19 5-29 0Z" fill="${accent}"/>`,
    flowers: `<g fill="${accent}"><circle cx="30" cy="19" r="4"/><circle cx="34" cy="17" r="4"/><circle cx="32" cy="22" r="4"/><circle cx="63" cy="20" r="4"/><circle cx="67" cy="18" r="4"/></g>`,
    'sunglasses-up': `<path d="M28 22c5-4 11-4 16 0M52 22c5-4 11-4 16 0" fill="none" stroke="#34444A" stroke-width="3"/>`,
    glasses: '<g fill="none" stroke="#28353C" stroke-width="2.4"><circle cx="39" cy="43" r="6"/><circle cx="57" cy="43" r="6"/><path d="M45 43h6"/></g>',
    helmet: `<path d="M22 35c1-17 11-27 26-27s25 10 26 27Z" fill="${accent}"/><path d="M26 27h44" stroke="#D95045" stroke-width="5"/><rect x="65" y="28" width="7" height="12" rx="3" fill="#1C2D38"/>`,
    goggles: '<path d="M27 35h42" stroke="#5F7782" stroke-width="4"/><g fill="#9AD5E6" stroke="#334A55" stroke-width="2"><rect x="29" y="29" width="14" height="9" rx="4"/><rect x="53" y="29" width="14" height="9" rx="4"/></g>',
    sunglasses: '<g fill="#263238"><rect x="31" y="39" width="14" height="8" rx="4"/><rect x="51" y="39" width="14" height="8" rx="4"/><path d="M45 42h6v2h-6Z"/></g>',
    chef: '<path d="M27 27c-3-6 1-11 7-10 2-7 11-9 15-3 5-5 14-2 14 5 7-1 10 7 6 12l-3 7H29Z" fill="#FFF7F1"/><rect x="29" y="32" width="37" height="8" rx="3" fill="#F7E7DF"/>',
    apron: `<path d="M31 64h34l-3 28H34Z" fill="#E8D5B8"/><path d="M38 64c1-7 19-7 20 0" fill="none" stroke="${accent}" stroke-width="3"/>`,
    binoculars: '<g fill="#34433A"><circle cx="29" cy="65" r="7"/><circle cx="43" cy="65" r="7"/><rect x="29" y="61" width="14" height="7"/></g><path d="M32 58c1-8 10-8 11 0" fill="none" stroke="#34433A" stroke-width="3"/>',
    safari: `<path d="M22 28c3-12 11-19 26-19s23 7 26 19Z" fill="${accent}"/><path d="M17 29h62" stroke="#725A37" stroke-width="5" stroke-linecap="round"/>`,
    headphones: `<path d="M23 43c0-19 10-30 25-30s25 11 25 30" fill="none" stroke="${accent}" stroke-width="6"/><rect x="18" y="40" width="9" height="17" rx="4" fill="${accent}"/><rect x="69" y="40" width="9" height="17" rx="4" fill="${accent}"/>`,
    beanie: `<path d="M24 31c2-15 10-23 24-23s22 8 24 23Z" fill="${accent}"/><path d="M23 29h50v9H23Z" fill="#586D7D"/>`,
    none: ''
  };
  return map[accessory] || '';
}

function detailMarkup(detail, hair) {
  if (detail === 'beard') return `<path d="M34 54c3 11 9 16 14 16s11-5 14-16c-4 5-9 7-14 7s-10-2-14-7Z" fill="${hair}" opacity=".92"/>`;
  if (detail === 'moustache') return `<path d="M39 54c4-5 8-4 9 0 1-4 5-5 9 0-3 4-7 5-9 2-2 3-6 2-9-2Z" fill="${hair}"/>`;
  return '';
}

export function avatarMarkup(value, options = {}) {
  const avatar = AVATAR_OPTIONS.find(option => option.id === normaliseAvatar(value)) || AVATAR_OPTIONS[0];
  const label = escAttr(options.label || avatar.label);
  return `<svg class="traveller-avatar-svg" viewBox="0 0 96 96" role="img" aria-label="${label}" focusable="false">
    <defs><clipPath id="portraitClip"><circle cx="48" cy="48" r="48"/></clipPath></defs>
    <g clip-path="url(#portraitClip)">
      ${sceneMarkup(avatar.scene)}
      <path d="M12 96c4-22 17-35 36-35s32 13 36 35Z" fill="${avatar.shirt}"/>
      ${avatar.accessory === 'apron' ? accessoryMarkup('apron', avatar.accent) : ''}
      <ellipse cx="48" cy="44" rx="22" ry="25" fill="${avatar.skin}"/>
      ${hairMarkup(avatar.hairStyle, avatar.hair)}
      ${avatar.accessory !== 'apron' ? accessoryMarkup(avatar.accessory, avatar.accent) : ''}
      <ellipse cx="40" cy="45" rx="2.3" ry="2.8" fill="#253138"/><ellipse cx="56" cy="45" rx="2.3" ry="2.8" fill="#253138"/>
      <circle cx="39.4" cy="44.2" r=".7" fill="#FFF"/><circle cx="55.4" cy="44.2" r=".7" fill="#FFF"/>
      <path d="M42 56c4 4 8 4 12 0" fill="none" stroke="#8A4E42" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M47 47c-1 4-1 6 2 7" fill="none" stroke="#A86E59" stroke-width="1.2" stroke-linecap="round" opacity=".65"/>
      ${detailMarkup(avatar.detail, avatar.hair)}
      <circle cx="77" cy="76" r="12" fill="rgba(255,255,255,.94)"/>
      <circle cx="77" cy="76" r="7" fill="none" stroke="${avatar.accent}" stroke-width="2"/>
      <path d="m77 70 2 4 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="${avatar.accent}"/>
    </g>
    <circle cx="48" cy="48" r="46.5" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="3"/>
  </svg>`;
}
