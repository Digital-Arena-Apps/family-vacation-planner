export function wireHomeItineraryLink(root, onItinerary) {
  if (!root || typeof onItinerary !== 'function') return () => {};
  const button = root.querySelector('#homeItinerary');
  if (!button) return () => {};

  const handler = event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    onItinerary();
  };

  button.addEventListener('click', handler, true);
  return () => button.removeEventListener('click', handler, true);
}
