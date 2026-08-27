# FERDA Launch MVP

## Product promise
FERDA should understand the travelling crew, the trip, the target day and the family's immediate context, then help make the next useful decision.

**Every adventure. Everyone together.**

## Launch-critical experience

### 1. Crew
- Add/edit travellers.
- Age/role and useful preference context.
- Dietary requirements, including strict cross-contact needs.
- Accessibility / walking considerations.

### 2. Trip
- Destination.
- Arrival / departure dates.
- Accommodation/base.
- Transport mode.
- Trip-level preferences: pace, budget, rhythm, discovery, walking/accessibility.

### 3. Itinerary
- Multi-day view generated from trip dates.
- Add, edit, remove and move plans between days.
- Activity / meal / journey / other plan types.
- Same underlying plan data as Today.

### 4. Today
- Clear live view of the current day.
- Quick add and edit.
- Fix My Day / balance check.
- FERDA notices overloaded periods, missing food/rest and preference mismatches.

### 5. Ask FERDA
- Activities, Dining, Shopping and Transport contexts.
- Crew-aware ranking.
- Day-aware ranking: FERDA considers what is already planned on the target date.
- Future-day planning from Itinerary.
- Live destination discovery with curated fallback.
- Immediate-context constraints (time available / budget / energy / willingness to travel).

### 6. Recommendation feedback
- Accept/add recommendation.
- Reject recommendation with useful reason.
- Repeated feedback should influence later FERDA recommendations.

## Premium quality gate
A feature is not launch-ready merely because it works.

- No clipped labels, controls or text on supported mobile sizes.
- Primary tap targets approximately 44px minimum.
- Input/select text 16px minimum on mobile.
- Keyboard must not make modal actions inaccessible.
- No developer/prototype labels in customer-facing UI.
- No visibly pixelated, grainy or over-compressed hero/splash imagery.
- Brand imagery must use consistent FERDA art direction.
- Empty/loading/error states must look intentional.
- Core workflow must remain usable if live discovery is temporarily unavailable.

## Asset production standard
- App icon master: 1024×1024 minimum.
- Hero/splash source art: produce at least 2048px on the long edge; retain a lossless/high-quality master.
- UI illustration/icon masters: produce at least 512×512; 1024×1024 preferred.
- Export WebP/PNG from the master; never upscale a small compressed asset for production.
- Review every hero/splash at high-density phone size before release.

## App Store readiness
Before submission:
- Native wrapper/package configured for iOS (and Android if launching together).
- App icon / native launch screen assets.
- Privacy policy and support URL.
- App Store metadata, screenshots and age/content declarations.
- Analytics/crash reporting decision implemented.
- Persistence/migration behaviour verified across upgrades.
- Fresh-install onboarding tested.
- Offline/degraded network behaviour tested.
- No blocking console/runtime errors in primary flows.

## Deferred until after MVP unless they become blockers
- Booking/ticket purchasing integrations.
- Social/community features.
- Deep map/routing engine.
- Large account/profile platform.
- Complex shared-trip collaboration.
- Full destination editorial catalogue.
- Advanced memories/photo product.

## Current V3 principle
Prefer a smaller feature that completes the loop over a larger feature that creates another disconnected screen.

**Crew + preferences + trip + target day + right-now context → FERDA → recommendation → accept/adapt → Itinerary/Today → learn from feedback.**
