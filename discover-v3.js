const GOOGLE_TYPES = Object.freeze({
  activities: [
    'amusement_park', 'museum', 'aquarium', 'zoo', 'tourist_attraction',
    'bowling_alley', 'movie_theater', 'park', 'art_gallery', 'historical_landmark'
  ],
  dining: ['restaurant', 'cafe', 'fast_food_restaurant'],
  shopping: ['shopping_mall', 'department_store', 'gift_shop', 'clothing_store', 'market']
});

const OSM_FILTERS = Object.freeze({
  activities: [
    '["tourism"="theme_park"]', '["tourism"="attraction"]', '["tourism"="museum"]',
    '["tourism"="zoo"]', '["tourism"="aquarium"]', '["leisure"="miniature_golf"]',
    '["leisure"="bowling_alley"]', '["leisure"="park"]'
  ],
  dining: [
    '["amenity"="restaurant"]', '["amenity"="cafe"]', '["amenity"="fast_food"]'
  ],
  shopping: [
    '["shop"="mall"]', '["shop"="department_store"]', '["shop"="gift"]',
    '["shop"="clothes"]', '["amenity"="marketplace"]'
  ]
});

const ICONS = Object.freeze({
  activities: '/brand/ferda-ui-icon-nav-explore.webp',
  dining: '/brand/ferda-ui-icon-food-dietary.webp',
  shopping: '/brand/ferda-ui-icon-trip-preferences.webp'
});

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function escText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRad = value => value * Math.PI / 180;
  const R = 3958.7613;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function driveMinutes(miles) {
  if (!Number.isFinite(miles)) return 25;
  return Math.max(4, Math.min(120, Math.round(5 + miles * 2.1)));
}

function genericShape(category, rawType = '') {
  const type = String(rawType || '').toLowerCase();
  if (category === 'dining') {
    return {
      category: type.includes('cafe') ? 'Cafe' : type.includes('fast') ? 'Quick food' : 'Restaurant',
      summary: 'A nearby food option FERDA can weigh against dietary needs, cost and the rest of the day.',
      thrill: 1, walking: 1, cost: 2, discovery: 2, duration: 'short', start: 'any', indoor: 3, dietary: 2, minAge: 0
    };
  }
  if (category === 'shopping') {
    return {
      category: 'Shopping',
      summary: 'A nearby shopping stop that can be judged against travel effort, walking and how much time the day has left.',
      thrill: 1, walking: 2, cost: 2, discovery: 2, duration: 'half', start: 'late', indoor: 3, dietary: 1, minAge: 0
    };
  }

  const isPark = type.includes('park') && !type.includes('theme');
  const isMuseum = type.includes('museum') || type.includes('gallery') || type.includes('aquarium');
  const isTheme = type.includes('theme') || type.includes('amusement');
  return {
    category: isTheme ? 'Major attraction' : isMuseum ? 'Indoor attraction' : isPark ? 'Outdoor attraction' : 'Attraction',
    summary: isTheme
      ? 'A higher-commitment attraction that FERDA will only rank highly when the day has enough space for it.'
      : isMuseum
        ? 'A weather-friendly attraction that can work well for a few hours without taking over the whole day.'
        : 'A nearby visitor experience FERDA can compare with the crew, pace and plans already on the day.',
    thrill: isTheme ? 3 : 1,
    walking: isPark || isTheme ? 3 : 2,
    cost: isTheme ? 3 : 2,
    discovery: 2,
    duration: isTheme ? 'full' : 'half',
    start: isTheme ? 'early' : 'any',
    indoor: isMuseum ? 3 : 1,
    dietary: 1,
    minAge: 0
  };
}

function toFerdaOption(raw, category, origin) {
  const lat = Number(raw.lat);
  const lon = Number(raw.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !raw.name) return null;
  const miles = haversineMiles(origin.lat, origin.lon, lat, lon);
  const shape = genericShape(category, raw.type);
  return {
    id: `live:${raw.source}:${raw.id}`,
    name: escText(raw.name),
    ...shape,
    drive: driveMinutes(miles),
    icon: ICONS[category],
    intents: [category],
    live: true,
    source: raw.source,
    address: escText(raw.address),
    lat,
    lon,
    rating: Number.isFinite(raw.rating) ? raw.rating : null,
    ratingCount: Number.isFinite(raw.ratingCount) ? raw.ratingCount : 0,
    mapsUrl: raw.mapsUrl || ''
  };
}

async function geocode(destination) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', destination);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'FERDA-Family-Travel/1.0 contact: app-support'
    }
  });
  if (!response.ok) throw new Error(`Geocoding failed (${response.status})`);
  const rows = await response.json();
  const hit = rows?.[0];
  if (!hit) throw new Error('Destination not found');
  return {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    label: escText(hit.display_name || destination)
  };
}

function googlePrice(value) {
  const map = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4
  };
  return map[value] ?? null;
}

async function googleNearby(category, origin, radiusMeters) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return [];
  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': [
        'places.id', 'places.displayName', 'places.formattedAddress', 'places.location',
        'places.rating', 'places.userRatingCount', 'places.priceLevel', 'places.primaryType',
        'places.googleMapsUri', 'places.businessStatus'
      ].join(',')
    },
    body: JSON.stringify({
      includedTypes: GOOGLE_TYPES[category],
      maxResultCount: 20,
      rankPreference: 'POPULARITY',
      locationRestriction: {
        circle: {
          center: { latitude: origin.lat, longitude: origin.lon },
          radius: radiusMeters
        }
      }
    })
  });
  if (!response.ok) throw new Error(`Google Places failed (${response.status})`);
  const data = await response.json();
  return (data.places || [])
    .filter(place => place.businessStatus !== 'CLOSED_PERMANENTLY')
    .map(place => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress || '',
      lat: place.location?.latitude,
      lon: place.location?.longitude,
      type: place.primaryType || '',
      rating: Number.isFinite(place.rating) ? place.rating : null,
      ratingCount: place.userRatingCount || 0,
      price: googlePrice(place.priceLevel),
      mapsUrl: place.googleMapsUri || '',
      source: 'google'
    }));
}

async function overpassNearby(category, origin, radiusMeters) {
  const filters = OSM_FILTERS[category] || [];
  const blocks = filters.flatMap(filter => [
    `node${filter}(around:${radiusMeters},${origin.lat},${origin.lon});`,
    `way${filter}(around:${radiusMeters},${origin.lat},${origin.lon});`,
    `relation${filter}(around:${radiusMeters},${origin.lat},${origin.lon});`
  ]).join('');
  const query = `[out:json][timeout:12];(${blocks});out center tags;`;
  const endpoints = [
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass-api.de/api/interpreter'
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'FERDA-Family-Travel/1.0'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      if (!response.ok) throw new Error(`Overpass failed (${response.status})`);
      const data = await response.json();
      return (data.elements || []).map(element => {
        const tags = element.tags || {};
        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;
        const name = tags.name || tags.brand || tags.operator;
        if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
        return {
          id: `${element.type}:${element.id}`,
          name,
          address: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' '),
          lat,
          lon,
          type: tags.tourism || tags.amenity || tags.leisure || tags.shop || '',
          rating: null,
          ratingCount: 0,
          mapsUrl: '',
          source: 'osm'
        };
      }).filter(Boolean);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Discovery service unavailable');
}

function dedupe(rows) {
  const seen = new Set();
  return rows.filter(row => {
    const key = `${normaliseName(row.name)}:${Math.round(row.lat * 1000)}:${Math.round(row.lon * 1000)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normaliseName(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export default async function handler(req, res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const category = String(req.query.category || 'activities').toLowerCase();
  const destination = escText(req.query.destination || '');
  const miles = Math.max(3, Math.min(40, Number(req.query.miles || 18)));

  if (!GOOGLE_TYPES[category] || !destination) {
    res.status(400).json({ error: 'A destination and valid category are required.' });
    return;
  }

  try {
    const origin = await geocode(destination);
    const radiusMeters = Math.round(miles * 1609.344);
    let raw = [];
    let source = 'OpenStreetMap';

    try {
      raw = await googleNearby(category, origin, radiusMeters);
      if (raw.length) source = 'Google Places';
    } catch {}

    if (!raw.length) raw = await overpassNearby(category, origin, radiusMeters);

    const options = dedupe(raw)
      .map(row => toFerdaOption(row, category, origin))
      .filter(Boolean)
      .sort((a, b) => {
        if (b.ratingCount !== a.ratingCount) return b.ratingCount - a.ratingCount;
        if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
        return a.drive - b.drive;
      })
      .slice(0, 20);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    res.status(200).json({
      destination: origin.label,
      category,
      source,
      options
    });
  } catch (error) {
    res.status(502).json({ error: error?.message || 'Unable to discover options right now.' });
  }
}
