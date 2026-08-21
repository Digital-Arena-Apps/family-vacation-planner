# Family Vacation Planner — Destination Beta V2.2.17

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


## V2.2.7.2 — Landing screen

- Adds a branded first-launch / welcome screen using the selected Family Vacation Planner identity.
- Primary action opens onboarding; returning beta users can continue a saved trip.
- Adds temporary beta controls for **Force landing screen on launch** and **Show landing screen**.
- Keeps the landing screen enabled by default during beta so the first-impression flow can be repeatedly tested.
- Adds `landing-scenic.png` as the branded hero artwork used by the landing experience.


## V2.2.7.2 landing composition
The landing screen now follows the selected mobile mockup: the scenic family artwork fills the screen, the brand and tagline sit over the sky, and the coral primary action is anchored at the bottom rather than using separate logo/image/copy cards.


## V2.2.7.3 — Landing polish

- Uses the approved high-resolution welcome artwork as the landing hero.
- Removes the mock phone status bar and baked-in CTA area from the image.
- Keeps Start planning and Continue saved trip as real accessible app controls.
- Removes the separate logo-card overlay and extra image zoom.
- Uses top-anchored minimal cropping so the full scenic composition retains more sky, coastline and breathing room.
- Bumps the service-worker cache to `ffvp-v2-2-7-3`.

## V2.2.9 onboarding polish

The onboarding flow has been reworked for faster mobile setup and better keyboard behaviour:

- Step 1 keeps a compact branded header; Steps 2 and 3 collapse to a minimal `STEP X OF 3` progress header.
- Progress bars now distinguish completed and current steps correctly.
- Setup field labels sit above controls rather than using card-like/floating label backgrounds.
- Family-member height entry supports centimetres or feet/inches while keeping a normalized height internally for ride-fit logic.
- Member avatars are assigned automatically from age and can be changed with a single tap.
- Common family requirements can be added with quick-select chips: gluten free, stroller required, motion sickness, early risers, accessibility needs and low walking tolerance.
- All forward onboarding CTAs use the same coral pill treatment.
- Mobile spacing is tighter so key controls remain higher above the soft keyboard and screen fold.


## V2.2.9 crew onboarding

Step 2 is now count-first: the user selects the number of adults and children before completing individual profiles. The app creates the required cards immediately and preserves existing details where possible if the counts change. The onboarding Add person control has been removed.

Profile emoji avatars have been replaced by clean initial circles, with subtle adult/child styling. Initials update as names are entered. Height remains localised to cm or ft/in and is normalised internally for ride-height logic.


## V2.2.10 overnight daypart fix

- Midnight–04:59 is treated as late night rather than morning.
- The decision card switches to a late-night context after midnight.
- At that time the planning action says `Plan later today` and targets the coming daylight hours, avoiding the post-midnight off-by-one-day problem.
- Greeting and recommendation headings no longer say `Good morning` / `Best this morning` at 00:xx.


## V2.2.11 contextual holiday copy

The app copy now reacts to daypart and trip stage as well as recommendation data. Overnight mode encourages rest and, when a Tomorrow Planner mood has been chosen, references the kind of day being planned. Countdown wording uses more human milestones such as sleeps-to-go, while early/mid/final-trip wording changes the tone of the dashboard and Quick Start prompts.

Selected Tomorrow Planner mood is persisted locally so a late-night/overnight return to the app can say what the family is resting for.


## V2.2.11.1 overnight planner wording
The Tomorrow Planner now switches all user-facing labels to 'later today' during the 00:00–04:59 overnight planning window, including the page eyebrow, heading, helper copy, snapshot and Best Overall action.


## V2.2.13 simpler ride-height onboarding

Step 2 no longer asks families to type exact heights during onboarding. Instead, each profile uses an approximate ride-height band: under 36 in / under 92 cm, 36–41 in / 92–106 cm, 42–47 in / 107–121 cm, 48 in+ / 122 cm+, or Not sure. This is deliberately planning guidance rather than a claim about universal ride eligibility; individual attractions still have their own height rules.

Exact cm or ft/in height entry remains available later in Family settings for users who want more precision. The app stores the selected band for family-fit logic while retaining backward compatibility with existing saved profiles.

## V2.2.13 — Visitor-experience quality gate

Local discovery now filters more aggressively for places a family can genuinely visit. Outdoors uses a visitor-focused whitelist (public parks, zoos, botanical gardens, nature preserves, trails, playgrounds, scenic spots and similar). Generic `park` results must also look like a real public/visitor place; generic gardens, residential dog parks, landscaping/property businesses and private-access OpenStreetMap features are excluded.

Suggested experience cards now include a short **What it’s like** description. These descriptions are generated from the place's primary venue type and are deliberately concise; they help the family decide whether the experience fits before opening Maps. Google editorial summaries are not requested, avoiding the additional Atmosphere data tier for this beta.


## V2.2.14 — Experience-variety shortlists

Discovery and mood recommendations now diversify by **experience subtype**, not just venue identity. The first pass deliberately shows one of each available kind before repeating a subtype (for example: playground, public park, garden, wildlife/zoo, trail/nature, scenic stop).

For Outdoors & Explore, Google Places discovery now builds its candidate pool by popularity within the selected travel radius, then keeps the nearest candidate inside each subtype. This gives the app a better chance of finding meaningful visitor experiences instead of filling the top of the list with the nearest residential playgrounds.

The same round-robin diversity principle is applied to Indoor, Thrills, Chill and Shopping where possible. If the local area genuinely has only one or two suitable subtypes, repeats are still allowed after the distinct options have been shown.


## V2.2.15 — Destination-aware specialist tab

The centre bottom-nav slot is now destination-aware rather than permanently labelled Parks.

Beta mappings for testing:
- Orlando / Central Florida → Parks (live park-pressure screen)
- Anaheim / Orange County → Parks (local theme-park / thrills discovery)
- Nairobi → Wildlife
- New York / London → Sights
- Paris → Highlights
- Maui → Beaches
- Cheshire / Manchester → Days Out
- Unknown locations → Discover

The temporary Test Location and destination selectors include Nairobi, Anaheim and Maui so the behaviour can be tested directly.


## V2.2.16 — Internationalisation foundation + new vacations

- Adds a global language preference with **Automatic / English / Spanish / French / German**. Automatic follows the device language when supported.
- Core navigation, landing actions, mood names and the new-trip flow are translated; untranslated specialist narrative safely falls back to English while the translation catalogue grows.
- Google Places discovery now receives the selected `languageCode`, and OpenStreetMap lookup prefers `name:<language>` then English then the local/default name.
- Dates/times use the selected locale. Distance presentation switches between miles and kilometres based on the destination while the internal scoring model remains in miles.
- Adds **New vacation** from Trip and Family. Returning users also get this action on the landing screen.
- Starting a new vacation preserves the family/crew defaults but clears trip-specific shortlist, plans and memories. The previous trip is archived locally and can be restored from Trip.
- Adds a beta **Destination Finder** so families can choose holiday priorities (thrills, wildlife, beach, sights, outdoors, food, shopping, relaxing), budget feel and trip length and receive ranked destination ideas from the current beta catalogue.

This is an internationalisation foundation, not a claim that every legacy sentence in the beta is fully translated yet. New UI should be added through the translation dictionary rather than hard-coded strings.


## V2.2.17 — Intuitive destination finder

The destination finder is no longer seeded with the same three active priorities or limited to the original nine test destinations. Users start with a blank brief, choose up to three priorities, then refine by budget, trip length, climate and setting. The beta comparison library now covers a much broader mix of city, beach, wildlife, nature and theme-park destinations.

Scoring now rewards destinations that satisfy the whole selected brief and heavily penalises destinations that are weak against a chosen must-have. `Show me different ideas` rotates through further suitable matches rather than returning the same shortlist. This is still a curated beta destination intelligence layer; it is deliberately separated from the UI so it can later be replaced or augmented with a live destination data service without redesigning the flow.
