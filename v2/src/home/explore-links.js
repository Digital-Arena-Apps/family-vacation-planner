const HOME_EXPLORE_LINKS = Object.freeze({
  homeActivities: 'activities',
  homeDining: 'dining',
  homeShopping: 'shopping',
  homeTransport: 'transport'
});

export function wireHomeExploreLinks(root, onExplore) {
  if (!root || typeof onExplore !== 'function') return () => {};

  const bindings = [];
  Object.entries(HOME_EXPLORE_LINKS).forEach(([id, intent]) => {
    const button = root.querySelector(`#${id}`);
    if (!button) return;
    const handler = () => onExplore(intent);
    button.addEventListener('click', handler);
    bindings.push([button, handler]);
  });

  return () => bindings.forEach(([button, handler]) => button.removeEventListener('click', handler));
}
