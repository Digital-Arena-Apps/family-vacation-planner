export const FERDA_ASSETS = Object.freeze({
  brand: Object.freeze({
    logoMark: '/brand/ferda-brand-logo-mark.webp',
    wordmark: '/brand/ferda-brand-wordmark.webp',
    appIcon: '/brand/ferda-brand-app-icon.webp'
  }),
  ui: Object.freeze({
    foodDietary: '/brand/ferda-ui-icon-food-dietary.webp',
    tripPreferences: '/brand/ferda-ui-icon-trip-preferences.webp',
    preferencesGuidance: '/brand/ferda-ui-guidance-preferences-not-rules.webp'
  }),
  preferences: Object.freeze({
    pace: Object.freeze({
      relaxed: '/preferences/pace/ferda-preferences-pace-easy-going.webp',
      balanced: '/preferences/pace/ferda-preferences-pace-balanced.webp',
      full: '/preferences/pace/ferda-preferences-pace-pack-it-in.webp'
    }),
    budget: Object.freeze({
      value: '/preferences/budget/ferda-preferences-budget-value-conscious.webp',
      balanced: '/preferences/budget/ferda-preferences-budget-balanced.webp',
      flexible: '/preferences/budget/ferda-preferences-budget-flexible.webp'
    }),
    rhythm: Object.freeze({
      early: '/preferences/rhythm/ferda-preferences-rhythm-early-starters.webp',
      flexible: '/preferences/rhythm/ferda-preferences-rhythm-flexible.webp',
      late: '/preferences/rhythm/ferda-preferences-rhythm-later-starters.webp'
    }),
    discovery: Object.freeze({
      familiar: '/preferences/discovery/ferda-preferences-discovery-familiar-favourites.webp',
      mix: '/preferences/discovery/ferda-preferences-discovery-mix-it-up.webp',
      discover: '/preferences/discovery/ferda-preferences-discovery-surprise-us.webp'
    }),
    walking: Object.freeze({
      low: '/preferences/walking/ferda-preferences-walking-keep-lower.webp',
      normal: '/preferences/walking/ferda-preferences-walking-normal-holiday.webp',
      high: '/preferences/walking/ferda-preferences-walking-happy-to-walk-lots.webp'
    })
  })
});

export function ferdaAsset(path, fallback = '') {
  return path || fallback;
}
