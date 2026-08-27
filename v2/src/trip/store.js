import { persistentRemoveItem, persistentSetItem } from '../storage/native-persistence.js';

const STORAGE_KEY = 'fvp_v2_trip_v1';

const DEFAULT_TRIP = Object.freeze({
  name: '',
  destination: '',
  arrivalDate: '',
  departureDate: '',
  accommodation: '',
  transport: 'none',
  notes: ''
});

function normalise(value = {}) {
  return {
    ...DEFAULT_TRIP,
    ...value,
    name: String(value.name || '').trim(),
    destination: String(value.destination || '').trim(),
    arrivalDate: String(value.arrivalDate || ''),
    departureDate: String(value.departureDate || ''),
    accommodation: String(value.accommodation || '').trim(),
    transport: ['car', 'rideshare', 'public', 'mixed', 'none'].includes(value.transport) ? value.transport : 'none',
    notes: String(value.notes || '').trim()
  };
}

export function createTripStore() {
  const listeners = new Set();

  function get() {
    try {
      return normalise(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch {
      return normalise();
    }
  }

  function emit(value) {
    listeners.forEach(listener => listener(value));
  }

  return {
    get,
    isConfigured() {
      const value = get();
      return !!(value.destination && value.arrivalDate && value.departureDate);
    },
    save(next) {
      const value = normalise(next);
      persistentSetItem(STORAGE_KEY, JSON.stringify(value));
      emit(value);
      return value;
    },
    reset() {
      persistentRemoveItem(STORAGE_KEY);
      const value = normalise();
      emit(value);
      return value;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
