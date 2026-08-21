# Family Vacation Planner — Florida Beta V1.6

Mobile-first PWA prototype for family vacation decision support.

## What changed in V1.6

### Nearby essentials: server-backed
The browser no longer calls public map infrastructure directly.

`/api/nearby` is now a small Vercel Node function that:
- accepts the user's current coordinates and an essentials category
- checks OpenStreetMap / Overpass server-side
- falls back to a bounded OpenStreetMap Nominatim lookup
- normalises and distance-sorts results before sending a small shortlist back to the app
- keeps Google Maps as a directions/fallback action rather than the discovery experience

This is a more appropriate beta architecture and avoids the browser-side CORS/reliability problem seen in V1.2–V1.4.

For commercial launch, replace the public OSM fallback stack with a contracted places provider or another production-grade data source with suitable terms/SLA.

### Park Pressure
The Parks screen now combines:
- live average and median standby waits
- a colour-coded live wait temperature
- a beta crowd outlook
- a “better / worse than expected” value signal
- tomorrow's crowd outlook
- the existing family-fit steer

Important: the crowd outlook is **not official park attendance or capacity**. V1.6 uses a transparent beta heuristic based on season, day-of-week, weather and a small park-specific pressure modifier. This is intentionally separated from the live wait feed so a licensed historical source or our own recorded history can replace it later without redesigning the feature.

ThemeParks.wiki live data is suitable for wait-time products under its current public API terms, and its terms allow derived analysis and recording your own history. Its maintained historical archive is moving toward paid access, so a commercial launch should use licensed history or a first-party history store rather than scrape third-party crowd calendars.

### Design-system refresh
V1.6 applies the supplied Family Vacation Planner design guidance:
- warm `#F8F9FA` canvas
- deep slate `#0F172A`
- coral `#FF6B6B` primary CTA
- semantic colours for parks, rest, food and logistics
- Plus Jakarta Sans headings + Inter UI text
- larger outdoor-friendly tap targets
- softer card elevation
- stronger “Today” hierarchy
- traffic-light park-pressure components

## Deployment

The project remains deployable directly from the GitHub repo to Vercel.

V1.6 adds one new root file:

- `nearby.js`

`vercel.json` uses Vercel's legacy `builds` routing for this beta so the function can stay at the repository root, which makes mobile GitHub uploads easier. `/api/nearby` routes to that function.

Upload the V1.6 files to the existing repository and commit to `main`; the connected Vercel project should redeploy automatically.

## Data/product notes

- Live theme-park waits: ThemeParks.wiki.
- Weather: Open-Meteo in the prototype; commercial usage terms/provider should be formalised before launch.
- Nearby places: OpenStreetMap public infrastructure for beta only.
- Crowd outlook: our own transparent beta heuristic, not official capacity.
- Maps: used only for final directions/fallback.


## V1.6 food ratings

The Food page works without a paid key using the OpenStreetMap fallback, but ratings and provider price levels require Google Places API (New).

To enable them in Vercel:

1. Enable **Places API (New)** in a Google Cloud project with billing enabled.
2. Create an API key and restrict that key to the Places API.
3. In the Vercel project, add an environment variable named `GOOGLE_PLACES_API_KEY`.
4. Redeploy the project.

The key stays server-side in `food.js`; it is never shipped to the browser. Family spend amounts shown by the app are estimates derived from the provider's price band and the saved family profile.

V1.6 also reads park schedule data from ThemeParks.wiki so closed parks no longer appear as LIVE with missing waits.

## V1.7 UX polish

- Weather now displays Celsius and Fahrenheit side-by-side and adds a likely rain/storm time window from the hourly forecast.
- Weather card is shorter and its sub-card labels use higher-contrast slate tones for bright outdoor conditions.
- The Decision Engine is more compact so the coral `What Now?` CTA sits higher on the first screen.
- Quick Start is now a tighter 2×3 primary grid using consistent inline vector icons; secondary discovery remains available through Explore and Family navigation.
- Essentials uses simpler user-facing copy, neutral slate price notes and a single chevron because the whole row is tappable.
- Bottom navigation has a stronger filled active state.
