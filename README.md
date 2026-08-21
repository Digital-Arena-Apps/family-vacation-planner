# Family Vacation Planner — Destination Beta V2.1

Mobile-first PWA prototype for family vacation decision support.

## V2.1 — Destination awareness

V2.1 removes the assumption that every trip is a Florida theme-park holiday.

### Mood-led Quick Start

The home grid is now based on the kind of day the family wants rather than a venue type:

- Chill & Recharge
- Indoor & Easy
- Food & Treats
- Outdoors & Explore
- Thrills & Excitement
- Shop & Browse

The copy adapts to the selected/current region. “Thrills & Excitement” can mean theme parks in Central Florida, but can also surface karting, adventure centres, observation experiences, miniature golf and other high-energy options elsewhere.

### Temporary beta location switcher

For testing, the home screen includes a **TEST LOCATION** selector:

- Current device location
- Orlando / Central Florida
- New York City
- Winsford / Cheshire
- London
- Paris
- Manchester

This is a beta/development control and should be removed or hidden behind developer settings before launch.

The selected test location is used by weather, Food, Essentials and local discovery, allowing the same build to be tested as though the family were in different destinations.

### Local discovery API

V2.1 adds `/api/discover`, implemented by the new root `discover.js` Vercel function.

It uses Google Places API (New) when `GOOGLE_PLACES_API_KEY` is configured and falls back to OpenStreetMap / Overpass. It supports discovery categories for thrills, indoor ideas, outdoors, shopping and broad local sights. Results include distance and, when supplied by Google, ratings, review counts and current open state.

Discovered places can be saved and given the existing trip statuses (Must do, Want to go, Been there, Repeat, Skip), so destination-aware discovery feeds into the trip memory model rather than being disposable search results.

### Pre-trip countdown mode

Onboarding and the Family profile now include a trip destination alongside arrival/departure dates.

When arrival is in the future, the Today screen switches into countdown mode:

- days until arrival
- a changing prep checklist based on how close departure is
- destination-specific suggestions (for example Florida heat/rain preparation or city walking/transit prep)
- a **Preview destination** action that moves the beta location to the trip destination so the family can explore and build Must-do / Want-to-go lists before travelling

Checklist completion is stored locally for the trip.

Weather shown while previewing a destination well ahead of the trip is explicitly described as **current destination conditions**, not a future trip forecast.

## Existing V2.0 intelligence retained

- trip day / days remaining
- time-aware Tonight vs Tomorrow decision state
- fixed plans and bookings
- Must do / Want to go / Been / Repeat / Skip
- trip memories and family ratings
- optional budget remaining and walking tolerance
- time-to-value recommendation scoring
- hours-aware Florida park pressure
- Food ratings and price guidance using Google Places when configured
- server-backed Essentials

## Deployment

V2.1 adds one new root file:

- `discover.js`

It also changes `vercel.json` to build that function and route `/api/discover` to it. Upload the V2.1 update files to `main`; the connected Vercel project should redeploy automatically.

The PWA cache is `ffvp-v2-1`; fully close/reopen the installed app after deployment.
