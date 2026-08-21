# Family Vacation Planner — Florida Beta V2.0

Mobile-first PWA prototype for a trip-aware family vacation decision engine.

## V2.0 — Trip Awareness

V2.0 moves the product from “nearby holiday ideas” toward an assistant that understands where the family is in the trip.

### Trip context
- Arrival and departure dates in onboarding and Family settings.
- Day-of-trip and days-remaining summary on Today and Trip.
- Late-day Decision Engine changes automatically from “What Now?” to “Tonight or tomorrow?”.
- A dedicated **Plan tomorrow** path uses tomorrow’s weather, fixed plans, trip progress and remaining must-dos.

### Trip statuses and memories
Every curated place can be marked:
- Must do
- Want to go
- Been there
- Happy to repeat
- Don’t suggest again

Places marked **Been there** or **Don’t suggest again** are removed from What Now recommendations. Must-do items gain urgency as departure approaches. Visited/repeat places appear in Trip Memories and can be given a simple family star rating.

### Fixed plans / bookings
The Trip screen can store dated commitments such as dining reservations, flights, shows and ticketed events. The decision engine penalises suggestions that do not fit comfortably before the next commitment and considers tomorrow’s bookings during tomorrow planning.

### Time-to-value
Recommendations consider:
- current device time
- current location and planning drive estimate
- round-trip travel + minimum worthwhile activity time
- weather
- family energy and walking tolerance
- budget mood and optional remaining trip budget
- trip status / visited history
- remaining vacation days
- fixed plans

The app explains why a recommendation ranks well and shows an approximate total commitment time. Drive times remain planning estimates rather than live traffic in this beta.

### Offline / degraded mode
The static PWA shell remains service-worker cached. V2.0 adds an offline banner so users know that saved trip information still works while live weather, wait times and nearby searches may not.

## Existing data sources
- Live theme-park waits and schedules: ThemeParks.wiki.
- Weather: Open-Meteo in the prototype.
- Food: Google Places API (New) when `GOOGLE_PLACES_API_KEY` is configured; OpenStreetMap fallback otherwise.
- Nearby essentials: OpenStreetMap public infrastructure for beta only.
- Crowd outlook: transparent beta heuristic, not official capacity.

## Deployment
Upload the V2.0 update files to the existing GitHub repository root and commit to `main`. The connected Vercel project should redeploy automatically. Fully close/reopen the installed PWA after deployment so the new service-worker cache takes effect.
