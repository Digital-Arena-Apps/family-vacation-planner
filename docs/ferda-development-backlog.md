# FERDA development backlog

Last updated: 27 August 2026

## P0 — core FERDA and production safety

- [x] Replace release-time data clearing with a non-destructive FERDA release migration for the current local schema.
- [x] Complete the FERDA foundation rebrand and wire approved Drive artwork into launch, onboarding, navigation and Family.
- [x] Add repeatable automated syntax, contract, asset and served-file smoke tests for the existing PWA.
- [ ] Decide and scaffold the cross-platform mobile workspace while retaining the PWA as a behavioural reference.
- [ ] Extract typed entities and recommendation logic from `app.js`.
- [ ] Link the correct Vercel project/account, then discover and provision the real persistence/auth integrations before provider-specific implementation.
- [ ] Implement authenticated users, trip ownership, server-side authorisation and an extensible relational schema.
- [ ] Implement offline-first local persistence, queued sync and conflict handling.
- [ ] Extend onboarding with structured personal interests, group preferences, dietary/accessibility information, fixed bookings and must-dos.
- [ ] Implement full-trip itinerary generation with validated structured output and deterministic constraints.
- [ ] Implement itinerary day/timeline views with add, edit, move, reorder, replace, lock and unlock.
- [ ] Build structured accommodation, transport, dining, activity and booking records without duplicate entry.
- [ ] Make Today answer what, when, where, travel time, booking and meal questions, and identify useful gaps.
- [ ] Bind What Now to itinerary gaps, current/selected location, opening hours, duration, weather and routing.
- [ ] Add foreground location permission education and a first-class manual-location fallback.
- [ ] Replace simulated plans with store-compliant, server-validated trial and £8.99 entitlement configuration.
- [ ] Add unit/integration coverage for date logic, locked items, ranking, permissions, persistence and entitlement.
- [ ] Implement the complete primary E2E journey from first open to adding a live recommendation to Today.

## P1 — commercial release quality

- [ ] Consolidate legacy runtime overlay scripts into maintained components/modules.
- [ ] Complete accessibility audit: screen reader, focus, dynamic text, contrast, reduced motion and touch targets.
- [ ] Add useful native notifications for reservations, leave-soon and material weather/plan changes.
- [ ] Add privacy controls, data export/deletion and plain-language location/learning settings.
- [ ] Add privacy-respecting analytics for onboarding, generation, edits, Today, Explore, trial and purchase.
- [ ] Add operational logging, error reporting, rate limiting and provider-health fallbacks.
- [ ] Complete shared-trip invitations and collaborative editing roles.
- [ ] Finish dietary confidence states and safe wording throughout dining/recommendations.
- [ ] Add destination-timezone, daylight-saving and arrival/departure test coverage.
- [ ] Prepare App Store / Play Store metadata, screenshots, privacy labels and release checklists.
- [ ] Add performance budgets for cold launch, images, lists, API latency and recommendation generation.

## P2 — valuable enhancements

- [ ] Family voting, “who's interested?”, reactions and shortlist comparisons.
- [ ] Richer natural-language trip edits using the same validated itinerary actions.
- [ ] Memories and post-trip history.
- [ ] More Orlando content/provider depth and destination editorial packs.
- [ ] Refined haptics and motion after reduced-motion behaviour is complete.
- [ ] More granular recommendation learning controls and explanations.

## Future — preserve architectural room

- Additional Florida, US, European, cruise and city-break destination packs.
- Destination-specific avatar packs.
- Booking/import integrations.
- Advanced collaborative planning and polls.
- Richer FERDA conversational assistance.
- Reuse of preferences across multiple trips with explicit user control.

## Current delivery slice

1. [x] Audit repository, research and assets.
2. [x] Produce source-of-truth, parity, asset and backlog documents.
3. [x] Optimise and wire real FERDA assets.
4. [x] Remove launch-time data-loss behaviour.
5. [x] Rebrand the existing PWA as the FERDA behavioural reference.
6. [x] Add smoke checks before starting the mobile/data migration.
