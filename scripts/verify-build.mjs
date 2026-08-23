import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const required = [
  'dist/index.html',
  'dist/app.js',
  'dist/styles.css',
  'dist/decision-demo-loader.js',
  'dist/decision-demo.js',
  'dist/decision-demo.css',
  'dist/orlando-early-access.css',
  'dist/base-location.js',
  'dist/family-ui-test.js',
  'dist/manifest.webmanifest',
  'dist/icon-192.png',
  'dist/icon-512.png',
  'dist/brand-mark.png',
  'dist/brand-logo.png',
  'dist/landing-scenic.png',
  'dist/sw.js'
];

for (const file of required) {
  await access(file, constants.R_OK);
}

const passthrough = [
  'app.js',
  'styles.css',
  'decision-demo-loader.js',
  'decision-demo.js',
  'decision-demo.css',
  'orlando-early-access.css',
  'base-location.js',
  'family-ui-test.js'
];

for (const file of passthrough) {
  const source = await readFile(file);
  const built = await readFile(`dist/${file}`);
  if (!source.equals(built)) {
    throw new Error(`${file} changed during the Phase 1 build; legacy runtime must pass through byte-for-byte.`);
  }
}

const html = await readFile('dist/index.html', 'utf8');
for (const ref of ['styles.css', 'app.js', 'decision-demo-loader.js', 'landing-scenic.png', 'brand-logo.png', 'brand-mark.png']) {
  if (!html.includes(ref)) throw new Error(`Built index.html lost legacy asset reference: ${ref}`);
}
if (html.includes('/assets/')) {
  throw new Error('Phase 1 unexpectedly rewrote legacy UI assets into Vite hashed assets.');
}

const sw = await readFile('dist/sw.js', 'utf8');
if (!sw.includes('ffvp-v2-6-7-startup-state-machine')) {
  throw new Error('Built service worker does not preserve the current cache generation.');
}

console.log('Phase 1 build verification passed: legacy runtime preserved, Vite shell created, service worker emitted.');
