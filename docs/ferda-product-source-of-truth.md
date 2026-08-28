# FERDA product source of truth

Last audited: 27 August 2026

## Authority order

1. The FERDA Complete Product Development Master Prompt supplied on 27 August 2026.
2. The user's FERDA research and production assets in Google Drive folder `Travel App` (`1aUZm6PscOu6LUPkZ8AIiAVjLKguS1fcs`).
3. Working behaviour and product decisions already present in `Digital-Arena-Apps/family-vacation-planner`.
4. General product and engineering conventions.

Security, legal, app-store and material technical constraints may override a product preference, but the conflict must be documented rather than silently changing FERDA.

## Locked product decisions

- Product name: **FERDA**.
- Promise: **Every adventure. Everyone together.**
- Initial market: families and groups visiting Orlando, Florida.
- Core value: understand the travelling group, create a personalised suggested itinerary, keep the trip organised, and make useful context-aware suggestions during the holiday.
- Core live question: **What should we do now?**
- Commercial intent: a useful free trial followed by a **£8.99 one-time unlock**. Trial length, store product ID, regional price and entitlement must be configuration-driven.
- No advertising, noisy engagement mechanics, generic marketplace positioning or subscription should be introduced without a new explicit product decision.
- Primary mobile navigation: **Today, Explore, Trip, Family**.
- Primary platforms: iOS and Android. Web/PWA may remain as a supporting surface.
- Visual identity: deep teal, warm cream, sunshine orange, warm neutrals, softly sculpted original 3D artwork, premium and playful without feeling childish.
- Custom FERDA assets take precedence over generic icons, emoji, stock art and generated placeholders.
- Orlando comes first; provider abstractions and destination packs should preserve future expansion without diluting the first release.

## Existing behaviour worth preserving

- Destination-, time-, weather-, distance-, budget-, energy- and family-aware recommendation scoring.
- Small recommendation shortlists with accept/reject feedback and explainable reasons.
- Conservative trip-level recommendation learning and a reset control.
- Foreground geolocation with manual/test fallbacks.
- Current weather integration and weather-aware ranking.
- Live Google Places integration with OpenStreetMap/Overpass fallbacks.
- Semantic mood gates, de-duplication, shortlist rotation and result diversity.
- Pre-trip countdown, trip-stage copy, Tomorrow Planner, fixed plans, saved places, trip statuses and archived trips.
- Offline shell/service worker and cached local trip information.
- Localised core navigation and place-search language.
- Existing Family bottom-sheet UX and persistent Add Person control.

## Resolved conflicts

| Existing implementation | FERDA decision |
|---|---|
| “Family Vacation Planner” identity | Rebrand the product and customer-facing shell to FERDA. |
| General multi-destination beta | Keep the abstractions, but make Orlando the production focus. |
| Five-item bottom navigation with a destination-specific tab | Use four primary tabs; keep the specialist module inside Explore rather than deleting it. |
| Explorer plan with ads plus Traveller and annual Pro tiers | Replace with trial plus £8.99 one-time entitlement. No ads or annual subscription in the approved model. |
| Release script clears the user's trip when the release version changes | Treat as a P0 data-loss defect. Migrations must preserve user data. |
| Test controls are visible in the customer surface | Move behind an explicit development flag before release. |
| Browser `localStorage` is the system of record | Retain as an offline cache during migration, not as the authoritative shared data store. |
| PWA is described as a prototype | Preserve it as the behavioural reference while building a production mobile architecture. |

## Product boundaries

- Live facts such as weather, opening times, directions, distance, bookings and entitlements must come from deterministic or authoritative data sources.
- AI may reason over validated facts and return validated structured output; it must not invent live facts.
- Dietary suitability must distinguish confirmed, likely and unknown. It is never a safety guarantee.
- Location must be permission-led, useful without background tracking, and recover gracefully when denied.
- Existing bookings and explicitly locked itinerary items are constraints, not casual suggestions.
- Premium means clarity, speed, reliability and thoughtful interaction—not decorative delay.

## Current technical source material

- `README.md`: release history and current behavioural decisions.
- `app.js`: current state, recommendation, trip, weather, family and discovery logic.
- `decision-demo-loader.js`: Orlando-specific launch/onboarding overlay.
- `decision-demo.js`, `base-location.js`, `family-ui-test.js`: later beta layers that must be consolidated rather than indefinitely stacked.
- `nearby.js`, `food.js`, `discover.js`, `weather.js`, `base-search.js`: current Vercel server functions/provider adapters.
- `manifest.webmanifest`, `sw.js`: current install/offline shell.
- `docs/ferda-asset-manifest.md`: authoritative Drive asset catalogue and production mapping.
- `docs/ferda-feature-parity-matrix.md`: product gap assessment.
- `docs/ferda-development-backlog.md`: prioritised delivery sequence.

## Architecture direction

The current PWA is a valuable behavioural reference, but it cannot safely become the production FERDA app without structural change. The target should be a cross-platform mobile application with shared typed domain logic, an authenticated API, a relational trip model, offline-first local persistence and store-validated entitlements.

The exact database, authentication and AI integrations are deliberately not locked in this audit. The connected Vercel account currently exposes no team/project, and the Vercel integration workflow requires the project to be linked and real integrations to be discovered/provisioned before code is built around a provider.
