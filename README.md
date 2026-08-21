# Family Vacation Planner — Destination Beta V2.2.3

Mobile-first PWA prototype for family vacation decision support.

## V2.2 — Destination awareness

V2.2 removes the assumption that every trip is a Florida theme-park holiday.

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

V2.2 adds `/api/discover`, implemented by the new root `discover.js` Vercel function.

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

V2.2 adds one new root file:

- `discover.js`

It also changes `vercel.json` to build that function and route `/api/discover` to it. Upload the V2.2 update files to `main`; the connected Vercel project should redeploy automatically.

The PWA cache is `ffvp-v2-1`; fully close/reopen the installed app after deployment.


## V2.2 — Brand refresh + countdown-mode refinement

V2.2 adopts the selected Family Vacation Planner identity concept:
- family-road-wave app mark
- coral, peach, aqua, sky blue, sunshine and dark-slate palette
- refreshed sticky app header
- branded onboarding hero
- replacement PWA install icons

Countdown mode now has a different job from on-trip mode:
- the Quick Start area becomes **Build your trip**
- cards are destination-planning categories such as Must-do experiences, Thrills & Excitement, Food worth planning and Indoor backups
- tapping those cards searches around the trip destination rather than the user's current home location
- Essentials is hidden before arrival
- the live weather card is hidden before arrival to avoid presenting today's destination weather as the trip forecast

Temporary beta testing controls are available under **Family → Testing tools**:
- Force onboarding on launch (enabled by default during beta)
- Restart onboarding with current details pre-filled
- Start as new user (clears trip/profile data)
- Reset all app data

Remove or disable the testing section and forced-onboarding default before production launch.


## V2.2.1 — Dedicated Tomorrow Planner

`Plan tomorrow` now opens a separate planning screen instead of immediately dumping ranked results onto Today. The family first chooses the kind of day they want tomorrow: Chill & Recharge, Indoor & Easy, Food & Treats, Outdoors & Explore, Thrills & Excitement, or Shop & Browse. A Best overall option remains available.

The chosen mood then filters tomorrow-only recommendations while preserving the existing scoring for tomorrow weather, trip progress, distance, fixed plans, family fit, budget, park schedules and visited/repeat status. Results stay on the Tomorrow Planner screen.


## V2.2.2 — Semantic mood filtering

Tomorrow Planner moods now use hard eligibility gates before ranking. A venue can no longer appear in a mood merely because it is nearby, highly rated or coded as low energy. In particular, theme parks are reserved for **Thrills & Excitement** rather than leaking into **Chill & Recharge** through generic nature/energy tags.

- **Chill & Recharge:** stay-in/reset, beaches, gentle parks/gardens/viewpoints.
- **Indoor & Easy:** indoor attractions rather than generic food/shopping.
- **Food & Treats:** food-first options only.
- **Outdoors & Explore:** beaches, nature and outdoor exploration.
- **Thrills & Excitement:** theme parks, rides, karting and high-energy experiences.
- **Shop & Browse:** shopping-first options.

Mood fit is now a semantic gate first, then distance, weather, trip status, time, budget and family fit rank the eligible choices.


## V2.2.3 — Outdoors classification fix

- Outdoors & Explore is now restricted to genuinely outdoor venue types such as parks, zoos, gardens, nature reserves, trails/viewpoints and beaches.
- Shopping, malls, markets and retail are explicitly classified as Shop & Browse and cannot leak into Outdoors.
- Previously cached/discovered places are reclassified at runtime from their provider place type, so users do not need to clear saved app data.
- Broad Explore-locally results no longer receive generic `nature` tags.


## V2.2.4 — local outdoor discovery and diversity
- Outdoors & Explore now queries live nearby outdoor places in Florida as well as other destinations.
- Google Places outdoor discovery is ranked by distance instead of popularity.
- Expanded outdoor types include city/state parks, gardens, zoos, wildlife parks/refuges, playgrounds, picnic grounds and cycling parks.
- Tomorrow outdoor recommendations prefer options inside the family's chosen travel range when at least three are available.
- Result shaping limits repeated subtypes (especially beaches) so the shortlist is more varied.

## V2.2.5 — exclusive mood taxonomy + de-duplication

Mood selection now uses an exclusive primary-mood taxonomy rather than overlapping tags. A venue can belong to only one daily mood:

- Chill & Recharge: stay-in, beaches, spas/wellness and scenic low-effort options.
- Indoor & Easy: museums, aquariums, galleries, cinema, bowling and indoor play.
- Food & Treats: food-first options only.
- Outdoors & Explore: parks, zoos, gardens, trails, wildlife/nature and similar active outdoor experiences.
- Thrills & Excitement: theme/water parks, karting, adventure sports, amusement centres and similar high-energy options.
- Shop & Browse: leisure shopping destinations only; supermarkets, grocery/hypermarkets and other practical retail are left to Essentials.

Google discovery now filters by **primary place type** so secondary provider tags cannot make one place appear in several moods. Recommendation candidates are de-duplicated by normalized venue name + proximity, and mood shortlists apply variety caps so one venue type or retail chain does not dominate the five suggestions. Server discovery also de-duplicates duplicate map records before returning them.


## V2.2.6 — rotating re-runs

Re-run now deliberately rotates to a different high-quality shortlist for the same mood/context. It avoids the immediately previous suggestions when enough alternatives exist, tracks already-shown venues during the session, and only recycles earlier options once the sensible candidate pool has been exhausted. The quality band prevents weak distant filler being shown merely to look different.


## V2.2.7 — Landing screen

- Adds a branded first-launch / welcome screen using the selected Family Vacation Planner identity.
- Primary action opens onboarding; returning beta users can continue a saved trip.
- Adds temporary beta controls for **Force landing screen on launch** and **Show landing screen**.
- Keeps the landing screen enabled by default during beta so the first-impression flow can be repeatedly tested.
- Adds `landing-scenic.png` as the branded hero artwork used by the landing experience.
