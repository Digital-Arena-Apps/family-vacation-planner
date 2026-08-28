# FERDA feature parity matrix

Last audited: 27 August 2026

Status meanings: **Working** is usable in the current PWA; **Partial** has meaningful behaviour but does not satisfy the production requirement; **Missing** has no material implementation; **Unsafe** exists but is not suitable for production.

| Product area | Existing evidence | Current status | FERDA requirement / gap | Delivery state |
|---|---|---:|---|---|
| Brand and visual identity | FERDA launch, header, navigation, PWA icons, crew UI and Florida avatars use approved Drive derivatives | Partial | Continue the asset system through itinerary, preference and content surfaces | Foundation complete |
| Mobile platform | Installable responsive PWA with safe-area handling | Partial | Production iOS and Android application; web remains secondary | Backlog P0 |
| Launch and onboarding | Three-step onboarding, dates, base, crew, ride fit, notes, pace/budget | Partial | Progressive interests, structured dietary/accessibility needs, existing bookings, must-dos and itinerary reveal | Backlog P0 |
| Launch data safety | Release migration records the FERDA version without clearing trip/profile state; smoke guard prevents regression | Working | Extend to versioned schema migrations and recovery tests as persistence evolves | Foundation complete |
| Holiday Crew | Count-first setup; add/edit/delete; persistent Add Person bottom sheet | Partial | FERDA avatars, per-person interests, dietary, accessibility and must-dos | Backlog P0 |
| Personal vs group preferences | Basic member ride preference plus group pace/budget/walking/notes | Partial | Structured personal and group preferences with “preferences, not hard rules” behaviour | Backlog P0 |
| Itinerary generation | Recommendation scoring and Tomorrow Planner | Missing | Generate a complete editable trip itinerary around locked plans | Backlog P0 |
| Itinerary explanations | Scoring produces concise fit reasons | Working | Persist explanation factors with generated itinerary/recommendations | Backlog P0 |
| Itinerary editing | Fixed plans, saved places and statuses | Partial | Day timeline, move/reorder/edit/replace/lock/unlock with conflict checks | Backlog P0 |
| Today | Trip stage, weather, decision card, plans and live recommendations | Partial | Full timeline, next item, leave time, bookings, meals and detected gaps | Backlog P0 |
| What should we do now? | Three ranked options, contextual chips, shortlist rotation and feedback | Working | Bind to real itinerary windows, opening hours, routing and explicit live location permission | Backlog P0 hardening |
| Recommendation learning | Trip-level accepts/rejects/reasons and reset | Working | Sync per trip/account, retain transparency and privacy controls | Backlog P1 |
| Explore | Orlando activity catalogue plus live discovery, filtering and saved status | Partial | Family-match-first Explore with consistent cost, duration, availability and dietary fields | Backlog P1 |
| Dining | Live nearby food, price estimates, ratings and directions | Partial | Structured restaurant/booking model and confirmed/likely/unknown dietary status | Backlog P0 |
| Activities | Rich in-memory activity records and trip statuses | Partial | Persistent typed records, bookings, participants, cost, duration and state transitions | Backlog P0 |
| Accommodation | Free-text home base and optional resolved coordinates | Partial | Structured accommodation, references, contacts, check-in/out, parking and “Take us home” | Backlog P0 |
| Transport | No structured transport records | Missing | Flights, car hire, transfers, parking and timing integration | Backlog P0 |
| Bookings | Generic fixed plan fields | Partial | Reusable structured booking entity attached to travel, stay, dining and activities | Backlog P0 |
| Location | Browser foreground geolocation, preset/manual fallback | Partial | Permission explanation, manual selection, native foreground location and privacy controls | Backlog P0 |
| Weather | Open-Meteo current/hourly data influences rankings | Working | Provider abstraction, freshness UI, errors and destination-timezone tests | Backlog P0 hardening |
| Places/routing providers | Google Places plus OSM/Overpass fallbacks | Partial | Formal provider interfaces; add authoritative routing/travel time | Backlog P0 |
| Offline use | Service worker caches shell; trip lives in localStorage | Partial | Offline database for Today/bookings/trip, queued mutations and conflict-safe sync | Backlog P0 |
| Notifications | None | Missing | Native reservation, leave-soon and meaningful weather/plan notifications | Backlog P1 |
| Accounts and auth | None | Missing | Authenticated private trip data and server-side authorisation | Backlog P0 |
| Shared family trips | One browser/device profile | Missing | Owner, invited members, roles and collaborative trip access | Backlog P0 architecture / P1 UX |
| Data model | One browser state object and multiple localStorage keys | Unsafe | Relational model for users, trips, people, itinerary, places, bookings, recommendations and entitlements | Backlog P0 |
| APIs and secrets | Server-side Google Places key; public OSM/Open-Meteo calls | Partial | Authentication, authorisation, validation, rate limits, provider contracts and operational logging | Backlog P0 |
| AI itinerary intelligence | No LLM/structured generation layer | Missing | Validated structured itinerary generation/refinement over deterministic facts | Backlog P0 |
| Natural-language assistant | None | Missing | Later FERDA assistant without turning every screen into chat | Future-ready |
| Commercial model | Customer-facing beta surface now models Free Trial → FERDA Full at £8.99 once, without ads/subscription | Partial | Replace local simulation with store-compliant, server-validated entitlement | Backlog P0 |
| Analytics | Local decision/onboarding events only | Partial | Privacy-respecting product analytics with no sensitive trip content | Backlog P1 |
| Privacy | No advertising SDK, but no formal controls/data lifecycle | Partial | Consent, data minimisation, location/learning controls, deletion/export and privacy notice | Backlog P0/P1 |
| Accessibility | Semantic controls, labels, reduced-motion snippets and large mobile controls | Partial | Screen-reader and dynamic-text audit across full journey; no colour-only state | Backlog P1 |
| Date/time | Local date helpers and Orlando timezone display | Partial | Explicit trip-local dates and timezone-aware instants across client/API/database | Backlog P0 |
| Empty/loading/error states | Present across many current screens | Partial | Consolidate and cover every production route/action | Backlog P1 |
| Asset performance | Approved Drive sources have optimised PNG/WebP production derivatives (about 1.7 MB total) | Working | Add responsive/native variants and enforce device performance budgets | Foundation complete |
| Automated tests | Repeatable Node smoke test validates syntax, JSON, navigation, data-safe migration and asset references; served-file test covers representative responses | Partial | Add unit, integration, CI and complete mobile E2E journey | Foundation complete / Backlog P0 |
| Deployment | Public GitHub repository and Vercel configuration exist | Partial | Correct Vercel account/project link, preview deployment, observability and release gates | Blocked by Vercel connection |

## Audit conclusion

The repository already proves the hardest differentiator at prototype level: FERDA can rank a small number of context-aware options for a real family rather than showing a generic search list. The principal gap is not ideation; it is production architecture and the complete itinerary lifecycle.

Rewriting the behaviour from scratch would discard valuable work. Equally, continuing to layer production features into the current 205 KB `app.js` plus runtime overlay scripts would amplify data-loss, testability and security risk. The safe route is an incremental strangler migration: protect current behaviour with tests, extract typed domain logic, build the mobile shell and authenticated data layer, then replace PWA surfaces journey by journey.
