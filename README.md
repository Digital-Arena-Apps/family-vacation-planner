# Florida Family Vacation Planner — V1 Beta

A dependency-free, mobile-first Progressive Web App prototype intended to answer:

> Given where our family is right now, what are the best options for the next few hours?

## V1 features

- Device geolocation with Orlando fallback for demo use
- Live weather via Open-Meteo
- "What Now?" recommendation engine using weather, distance, budget, energy and interests
- Curated Florida family activity catalogue
- Live Orlando theme-park wait-time pulse via ThemeParks.wiki
- Saved places and family profile stored locally on-device
- One-tap Google Maps search/directions
- Installable PWA with offline app shell
- Celsius/Fahrenheit preference

## Run locally

No Node/npm is required.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Geolocation requires HTTPS on a normal remote deployment (localhost is allowed by browsers).

## Deploy to Vercel

This is a static site, so you can import the folder/repository into Vercel with no framework preset required. Vercel will serve `index.html` directly.

Recommended route:

1. Create a GitHub repo, e.g. `florida-family-vacation-planner`.
2. Upload/commit these files to the repo root.
3. In Vercel choose **Add New → Project**, import the GitHub repo, and deploy.
4. Open the HTTPS Vercel URL on Android/iPhone and allow location access.
5. Use **Add to Home screen** / **Install app**.

## Commercial-launch notes

This beta deliberately proves the user experience before committing to paid data infrastructure.

Before selling the app:

- Review/contract weather data suitable for commercial usage. Open-Meteo distinguishes commercial API access and reserved resources in its current documentation.
- Review the commercial terms and operational dependency for ThemeParks.wiki data. Its software clients/back-end are MIT-licensed, but upstream park data sources can have separate terms. Treat this as beta/research data until reviewed.
- Replace curated/Google-Maps handoff discovery with a production places provider (for example Google Places or another licensed places/search provider) so nearby results, opening hours, ratings and drive times can appear inside the app.
- Add authentication, cloud trip sync, privacy policy/consent, analytics, subscription/trip-pass billing, and backend rate limiting/cache.
- Avoid implying affiliation with Disney, Universal, SeaWorld or other destination brands unless licensed.

## Suggested V2 architecture

Once product fit is validated, migrate this prototype to a typed app stack (e.g. Next.js/TypeScript) with server-side provider adapters, persistent accounts/trips, and Capacitor packaging for Android and iOS.
