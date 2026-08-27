import { persistentSetItem } from '../storage/native-persistence.js';

const STORAGE_KEY = 'fvp_v2_trip_preferences_v1';

const DEFAULTS = {
  pace: 'balanced',
  budget: 'balanced',
  rhythm: 'flexible',
  discovery: 'mix',
  walking: 'normal',
  accessibility: {
    minimiseWalking: false,
    frequentSeating: false,
    stepFree: false,
    quietBreaks: false
  },
  notes: ''
};

const VALID = {
  pace: ['relaxed', 'balanced', 'full'],
  budget: ['value', 'balanced', 'flexible'],
  rhythm: ['early', 'flexible', 'late'],
  discovery: ['familiar', 'mix', 'discover'],
  walking: ['low', 'normal', 'high']
};

function clone(value) {
  return {
    ...value,
    accessibility: { ...value.accessibility }
  };
}

function normalise(input) {
  const source = input && typeof input === 'object' ? input : {};
  const accessibility = source.accessibility && typeof source.accessibility === 'object'
    ? source.accessibility
    : {};

  return {
    pace: VALID.pace.includes(source.pace) ? source.pace : DEFAULTS.pace,
    budget: VALID.budget.includes(source.budget) ? source.budget : DEFAULTS.budget,
    rhythm: VALID.rhythm.includes(source.rhythm) ? source.rhythm : DEFAULTS.rhythm,
    discovery: VALID.discovery.includes(source.discovery) ? source.discovery : DEFAULTS.discovery,
    walking: VALID.walking.includes(source.walking) ? source.walking : DEFAULTS.walking,
    accessibility: {
      minimiseWalking: !!accessibility.minimiseWalking,
      frequentSeating: !!accessibility.frequentSeating,
      stepFree: !!accessibility.stepFree,
      quietBreaks: !!accessibility.quietBreaks
    },
    notes: String(source.notes || '').trim().slice(0, 240)
  };
}

export function createTripPreferencesStore() {
  let value = clone(DEFAULTS);
  const listeners = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) value = normalise(saved);
  } catch {}

  function persist() {
    try { persistentSetItem(STORAGE_KEY, JSON.stringify(value)); } catch {}
  }

  function notify() {
    persist();
    const snapshot = clone(value);
    listeners.forEach(listener => listener(snapshot));
  }

  return {
    get() {
      return clone(value);
    },
    save(next) {
      value = normalise(next);
      notify();
      return clone(value);
    },
    reset() {
      value = clone(DEFAULTS);
      notify();
      return clone(value);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
