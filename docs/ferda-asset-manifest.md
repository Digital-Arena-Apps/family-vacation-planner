# FERDA asset manifest

Authoritative source: Google Drive `Travel App` (`1aUZm6PscOu6LUPkZ8AIiAVjLKguS1fcs`)

Audit date: 27 August 2026

The source files remain unchanged in Google Drive. Production derivatives are stripped and resized WebP files unless an app-store/PWA PNG is required. Several Drive files have a `.webp` title but report and decode as PNG; the application destination corrects that mismatch.

## Branding

| Drive source | Drive ID | Source | Application destination | Use / status |
|---|---|---:|---|---|
| `ferda-brand-app-icon.png` (latest) | `1N0bNNUA_HFy1jsKxZQaBB4PBhkTyXIpO` | 1254×1254 PNG | `assets/ferda/branding/app_icon_1024.png`; root `icon-192.png`, `icon-512.png` | App/store and PWA icons; imported |
| `ferda-splash-main.png` | `1LWoRhhpDzQH2OiWSI0YOdys3X4BdDJTK` | 941×1672 PNG | `assets/ferda/branding/splash_main.webp` (640×1137) | Launch/onboarding artwork; imported |
| `ferda-brand-app-icon.png` (older) | `1hVSD5oAMO4fk6aCigOMLxQjikAwaMl1m` | PNG, 1.67 MB | Not imported | Superseded by later file with same title |
| `ferda-brand-logo-mark.webp` | `1qBfwfQmkPur6O1EMWicFIAz2mZo8BoV-` | 2058×764 PNG despite title | `assets/ferda/branding/brand_logo_mark.webp` (719×267) | Header/onboarding mark; imported |

The previously referenced `ferda-brand-logo.webp` is not present in the current Drive folder. Despite its `-mark` filename, the imported artwork is the complete FERDA compass-and-wordmark lock-up and is used as such.

## Avatars

All current sources are 1254×1254 PNG and produce 512×512 WebP derivatives in `assets/ferda/avatars/`.

| Drive source | Drive ID | Application destination | Status |
|---|---|---|---|
| `ferda_avatar_bobcat.png` | `1GYO-Og3EWRcZmEwmc3oSrr9kTTYxX2BA` | `avatar_bobcat.webp` | Imported |
| `ferda_avatar_manatee.png` | `19W7Y_QxDvCdybDXqu9RFdEvaOxXV5ukQ` | `avatar_manatee.webp` | Imported |
| `ferda_avatar_riverotter.png` | `1lkCdlorOe_bmlLZoEV5dIVzTDIdmrAt_` | `avatar_otter.webp` | Imported |
| `ferda_avatar_blackbear.png` | `13ocYEVuTCR8YydInVwbq-JUvvsUqZeQ9` | `avatar_black_bear.webp` | Imported |
| `ferda_avatar_alligator.png` | `12ZiwtXpjfCq0zL-uttiaI1wNEJECF96T` | `avatar_alligator.webp` | Imported |
| `ferda_avatar_sea_turtle.png` | `1jpuwrb8T1hdRgy9EF3XP7mCUp5bRg5ec` | `avatar_sea_turtle.webp` | Imported |
| `ferda_avatar_gecko.png` | `1SNwu2OLBknU81K52NedemBYa17hna7_R` | `avatar_gecko.webp` | Imported |
| `ferda_avatar_osprey.png` | `1mvE7uT-GDhSZPESdsCPUvvtTjMJ6ovKk` | `avatar_osprey.webp` | Imported |

`avatar_panther` is referenced by the product specification but is absent from Drive. Do not generate a substitute silently.

## Heroes

| Drive source | Drive ID | Source | Application destination | Intended use |
|---|---|---:|---|---|
| `ferda-hero-home.png` | `1ZD2CMLxGLlue6wl0l-vf5c_kYQOUZg4m` | 1672×940 | `hero_home.webp` 1024×576 | Today/home |
| `ferda-hero-itinerary.png` | `1STNXpMguLocD3q3jG5vPTBKF2zlEByyW` | 1672×941 | `hero_itinerary.webp` 1024×576 | Itinerary reveal/Trip |
| `ferda-hero-people.png` | `1PLNtxghpkZGxRpk0kiZiJOJjCmpjQY8u` | 1672×941 | `hero_people.webp` 1024×576 | Holiday Crew/Family |
| `ferda-hero-activities.png` | `1ISqNdbGziRKVK4pH5DKdqTEqQ-uWMDk5` | 1672×941 | `hero_activities.webp` 1024×576 | Activities/Explore |
| `ferda-hero-dining.png` | `1cyblpypMltTSuSkZNHzrYMKrB4bo8Nvg` | 1672×941 | `hero_dining.webp` 1024×576 | Dining |
| `ferda-hero-transport.png` | `1MwU9ochMMxQ6CWnFLLcyJ6kOdDJxTdDr` | 1672×941 | `hero_transport.webp` 1024×576 | Transport |
| `ferda-hero-shopping.png` | `1Ml2Q0mFlThrS0UNiVTOssbLFEk7zYF1F` | 1672×941 | `hero_shopping.webp` 1024×576 | Shopping |

## UI icons

All sources are 1254×1254 PNG despite the `.webp` titles. Production files are 320×320 WebP in `assets/ferda/icons/`.

| Drive source | Drive ID | Application destination | Intended use |
|---|---|---|---|
| `ferda-ui-icon-holiday-crew.webp` | `1SsO1Bgx7MmHKyMHxTVNK-dqvXGcWmFbX` | `ferda-ui-icon-holiday-crew.webp` | Crew summary |
| `ferda-ui-icon-add-person.webp` | `1Z9cyGv4UuyvbtOowzlVBnFbap9211KtS` | `ferda-ui-icon-add-person.webp` | Persistent Add Person |
| `ferda-ui-icon-food-dietary.webp` | `12bcnuXQ1ZMMcEg-2g6HQIdEWkZefvI39` | `ferda-ui-icon-food-dietary.webp` | Dietary needs |
| `ferda-ui-icon-trip-preferences.webp` | `1d9DjH8QUWrcvDqRi_Bx1GQRbgv6bk6CI` | `ferda-ui-icon-trip-preferences.webp` | Trip preferences |
| `ferda-ui-icon-nav-today.webp` | `17hlTiGUlIH2Z_QmvaA1bUm_sIi8aMe9w` | `ferda-ui-icon-nav-today.webp` | Today tab |
| `ferda-ui-icon-nav-explore.webp` | `1fdsjrhbK_-_3PTtol7-H3iGvU1FksGF1` | `ferda-ui-icon-nav-explore.webp` | Explore tab |
| `ferda-ui-icon-nav-trip.webp` | `1nQI1JHP_jonobokyITe9TC5FMrEVwOBB` | `ferda-ui-icon-nav-trip.webp` | Trip tab |
| `ferda-ui-icon-nav-family.webp` | `1HaiRjrXp-1iMgfenllUtVSo8uAj-T4nv` | `ferda-ui-icon-nav-family.webp` | Family tab |

## Preference artwork

Production derivatives are WebP at 320 px width in `assets/ferda/preferences/`.

| Source file | Drive ID | Source dimensions | Status |
|---|---|---:|---|
| `ferda-preferences-pace-balanced.png` | `1QHtW4UQqoZ4UThfAqaeHvSklz6SrUNem` | 507×709 | Imported |
| `ferda-preferences-pace-easy-going.png` | `1MulvbEFIlMmmq3B9aJFdRzo9zL0d2xep` | 477×685 | Imported |
| `ferda-preferences-pace-pack-it-in.png` | `1R1FN-IMjSf232SrU1j_7cFoPAGyuxXAU` | 496×673 | Imported |
| `ferda-preferences-budget-value-conscious.png` | `1myB7LeeUyQWsnHZn9Yt73sikN-2gx8-y` | 456×626 | Imported |
| `ferda-preferences-budget-balanced.png` | `12OZ89vrSpFn5zb62tlE3AEHdEUKfktLH` | 465×643 | Imported |
| `ferda-preferences-budget-flexible.png` | `1gH_LKhWA7V9xdSiId9Vlo8vch97Omn4_` | 501×614 | Imported |
| `ferda-preferences-rhythm-early-starters.png` | `1u87jy-52xZQKYtV-C6rH0AxYueHXKISW` | 443×638 | Imported |
| `ferda-preferences-rhythm-flexible.png` | `1qtIwXVRcYNHcsWolhGuKhXPpbtH4MI4M` | 457×633 | Imported |
| `ferda-preferences-rhythm-later-starters.png` | `12qiAa2fwUWzJDcb5oprH-djYEslaY2gv` | 453×640 | Imported |
| `ferda-preferences-discovery-familiar-favourites.png` | `15w7FRjsf971mWx2QO5LQK--APo8OPyGc` | 458×611 | Imported |
| `ferda-preferences-discovery-mix-it-up.png` | `1FTGK4JuW_SPy0fdlXQMwrejeDW25tQTL` | 461×589 | Imported |
| `ferda-preferences-discovery-surprise-us.png` | `1WsdkQjzs6G7sF7AHzlZiIuXBL3gvjzd1` | 475×615 | Imported |
| `ferda-preferences-walking-keep-walking-lower.png` | `1BkM1oZLZS5M9u-jrsDdVRbYBguiwE7Lb` | 490×587 | Imported |
| `ferda-preferences-walking-normal-holiday-walking.png` | `1e05QTrfZ0UFCBnlbaPEOVdRt6JzDhIcO` | 456×619 | Imported |
| `ferda-preferences-walking-happy-to-walk-lots.png` | `1bG_eQWmpBexe7HwqmqtfWzlxlFRWGUzp` | 501×617 | Imported |

## Performance policy

- Do not ship the 1–3 MB source PNGs in the application bundle.
- Use the optimised derivatives for UI.
- Generate platform-specific app/store sizes from `app_icon_1024.png`.
- Supply explicit rendered dimensions and meaningful alt/accessibility text for informative artwork.
- Decorative artwork must be hidden from assistive technology.
- Revisit quality/size with real device screenshots before store release.
