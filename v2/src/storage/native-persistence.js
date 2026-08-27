import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const MANAGED_KEYS = new Set([
  'fvp_v2_family_v1',
  'fvp_v2_trip_v1',
  'fvp_v2_trip_preferences_v1',
  'fvp_v2_today_plan_v1',
  'ferda_v3_recommendation_feedback'
]);

function isNative() {
  return Capacitor.isNativePlatform();
}

function managed(key) {
  return MANAGED_KEYS.has(String(key));
}

export async function hydrateNativePersistence() {
  if (!isNative()) return;

  await Promise.all([...MANAGED_KEYS].map(async key => {
    try {
      const native = await Preferences.get({ key });
      if (native.value != null) {
        localStorage.setItem(key, native.value);
        return;
      }

      const existing = localStorage.getItem(key);
      if (existing != null) await Preferences.set({ key, value: existing });
    } catch {
      // Keep the app usable with its local WebView storage if native preferences are unavailable.
    }
  }));
}

export function persistentSetItem(key, value) {
  const text = String(value);
  localStorage.setItem(key, text);
  if (isNative() && managed(key)) {
    Preferences.set({ key: String(key), value: text }).catch(() => {});
  }
}

export function persistentRemoveItem(key) {
  localStorage.removeItem(key);
  if (isNative() && managed(key)) {
    Preferences.remove({ key: String(key) }).catch(() => {});
  }
}
