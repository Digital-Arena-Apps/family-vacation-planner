import { Capacitor } from '@capacitor/core';

const CACHE = new Map();

function categoryForIntent(intent) {
  if (intent === 'dining') return 'dining';
  if (intent === 'shopping') return 'shopping';
  return 'activities';
}

function configuredApiBase() {
  return String(import.meta.env.VITE_FERDA_API_BASE || '').trim().replace(/\/$/, '');
}

function discoveryUrl(params) {
  const base = configuredApiBase();
  if (Capacitor.isNativePlatform() && !base) {
    throw new Error('Live discovery is waiting for the FERDA release API. Curated suggestions are still available.');
  }
  return `${base}/api/discover?${params.toString()}`;
}

export function canDiscover(trip = {}, intent = 'all') {
  return Boolean(String(trip.destination || '').trim()) && intent !== 'transport';
}

export async function discoverForIntent(trip = {}, intent = 'all', signal) {
  if (!canDiscover(trip, intent)) return { options: [], source: '', destination: '' };
  const destination = String(trip.destination || '').trim();
  const category = categoryForIntent(intent);
  const key = `${destination.toLowerCase()}::${category}`;
  if (CACHE.has(key)) return CACHE.get(key);

  const params = new URLSearchParams({ destination, category, miles: '18' });
  const response = await fetch(discoveryUrl(params), { signal });
  if (!response.ok) {
    let message = 'Live discovery is unavailable right now.';
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  const data = await response.json();
  const result = {
    options: Array.isArray(data.options) ? data.options : [],
    source: String(data.source || ''),
    destination: String(data.destination || destination)
  };
  CACHE.set(key, result);
  return result;
}
