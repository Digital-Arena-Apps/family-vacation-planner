const CURRENT = [
  'temperature_2m','apparent_temperature','relative_humidity_2m','precipitation',
  'weather_code','wind_speed_10m','wind_gusts_10m','is_day'
].join(',');
const HOURLY = [
  'temperature_2m','apparent_temperature','precipitation_probability','precipitation',
  'weather_code','wind_speed_10m','wind_gusts_10m','uv_index','is_day'
].join(',');
const DAILY = [
  'weather_code','temperature_2m_max','temperature_2m_min','precipitation_probability_max',
  'uv_index_max','sunrise','sunset','wind_speed_10m_max','wind_gusts_10m_max'
].join(',');

function numberParam(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lat = numberParam(req.query?.lat, -90, 90);
  const lon = numberParam(req.query?.lon, -180, 180);
  if (lat === null || lon === null) return res.status(400).json({ error: 'Valid lat/lon are required' });

  // Prototype provider restored for Early Access testing. Before paid/public launch,
  // use OPEN_METEO_API_KEY (commercial plan) or swap this route to the selected
  // commercial weather provider.
  const apiKey = process.env.OPEN_METEO_API_KEY || '';
  const base = apiKey ? 'https://customer-api.open-meteo.com/v1/forecast' : 'https://api.open-meteo.com/v1/forecast';
  const url = new URL(base);
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', CURRENT);
  url.searchParams.set('hourly', HOURLY);
  url.searchParams.set('daily', DAILY);
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('precipitation_unit', 'mm');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');
  if (apiKey) url.searchParams.set('apikey', apiKey);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'User-Agent': 'FERDAOrlando/0.1' }
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`Weather provider ${response.status}`);
    const data = await response.json();
    data.provider = 'Open-Meteo';
    data.providerMode = apiKey ? 'commercial' : 'prototype';
    data.fetched_at = new Date().toISOString();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=900');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Weather unavailable', detail: String(error?.message || error) });
  }
};
