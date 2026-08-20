# Family Vacation Planner — Florida Beta V1.3

A mobile-first Progressive Web App prototype for the question:

> Given where our family is right now, what are the best options for the next few hours?

## V1.3 fix

- Essentials now open into a dedicated in-app results screen instead of placing results below the full category list.
- Nearby lookup uses two Overpass endpoints with timeout/fallback handling.
- Directions are real links, improving reliability inside installed PWAs.
- Service-worker cache bumped so the fix replaces V1.2 cleanly.

## V1.2 additions

- First-run family setup / onboarding
- Per-person age, height and thrill preference
- Family/trip name, home base, budget, drive tolerance and dietary/access notes
- Theme-park family-fit heuristics (clearly separated from official ride eligibility)
- Separate **Stay in** and **Indoor attractions** experiences
- Food categories with dynamic family budget estimates
- **Essentials** hub that keeps nearby discovery in-app, using OpenStreetMap/Overpass data for the beta and opening Maps only for directions
- Vacation-first, three-step onboarding instead of a traditional settings form
- One-tap Google Maps searches / directions
- Existing weather-aware **What Now?** decision engine, saved places and live park wait-time pulse

## Data note

Food spend figures are planning estimates based on broad meal tiers and group composition. They are not live menu prices. Live nearby place discovery currently hands off to Google Maps. Commercial launch should use licensed place/price/opening-hours data and a reviewed commercial weather/park-data stack.


## V1.2 beta data note

Nearby essentials use OpenStreetMap data through the public Overpass API for prototyping. Before commercial launch, move this behind a production places provider or appropriately hosted/licensed infrastructure with defined availability and usage terms. Cost labels are broad category guides, not live prices.
