export function wireV2Navigation(root, handlers = {}) {
  const buttons = [...root.querySelectorAll('.v2-nav button')];
  const callbacks = [handlers.onToday, handlers.onExplore, handlers.onTrip, handlers.onFamily];

  buttons.forEach((button, index) => {
    const callback = callbacks[index];
    if (!callback) return;
    button.disabled = false;
    button.addEventListener('click', callback);
  });

  return () => {
    buttons.forEach((button, index) => {
      const callback = callbacks[index];
      if (callback) button.removeEventListener('click', callback);
    });
  };
}
