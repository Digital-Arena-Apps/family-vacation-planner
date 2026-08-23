# Family Vacation Planner development

## Phase 1 architecture

The app now has a Vite build foundation without changing the existing runtime architecture.

The current `app.js`, CSS and Orlando overlay files are intentionally copied into `dist/` unchanged. They remain classic browser scripts so their existing global variables, execution order and runtime behaviour are preserved while we introduce dependency management safely.

The current service worker is built through `vite-plugin-pwa` using the custom `injectManifest` strategy with manifest injection disabled. This keeps the existing cache strategy intact for Phase 1 while moving service-worker compilation into the build pipeline.

## Commands

```bash
npm install
npm run dev
npm run build
npm run check
npm run preview
```

`npm run check` performs a production build and verifies that the legacy runtime files passed through byte-for-byte and that the expected PWA assets were emitted.

## Full-stack testing

`npm run dev` runs the Vite frontend server. The deployed preview remains the preferred place to test API-backed features such as weather and discovery because the current Vercel serverless functions remain at the repository root during Phase 1.

## Phase 1 guardrails

- No framework rewrite.
- No visual redesign as part of the build migration.
- No conversion of the legacy app runtime to ES modules yet.
- Existing API routes remain unchanged.
- Existing local-storage data model remains unchanged.
- Existing service-worker cache behaviour remains unchanged.

The next phase can introduce reusable UI libraries behind this build system one feature at a time.
