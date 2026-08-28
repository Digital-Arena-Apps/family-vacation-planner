import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(join(root, file), 'utf8');

for (const file of ['manifest.webmanifest', 'vercel.json']) {
  assert.doesNotThrow(() => JSON.parse(read(file)), `${file} must be valid JSON`);
}

const scripts = [
  'app.js',
  'decision-demo-loader.js',
  'decision-demo.js',
  'family-ui-test.js',
  'base-location.js',
  'nearby.js',
  'food.js',
  'discover.js',
  'weather.js',
  'base-search.js',
  'sw.js'
];

for (const file of scripts) {
  const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${file} must parse\n${result.stderr}`);
}

const html = read('index.html');
const loader = read('decision-demo-loader.js');
const family = read('family-ui-test.js');
const app = read('app.js');
const serviceWorker = read('sw.js');

assert.match(html, /<title>FERDA(?:\s[^<]*)?<\/title>/, 'document title must be FERDA');
assert.match(html, /Every adventure\.\s*Everyone together\./, 'FERDA promise must be visible');
assert.doesNotMatch(html, /data-pricing-tier="pro"|Sponsored placements|£29\.99/, 'retired pricing must not be visible');

const nav = html.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
assert.equal((nav.match(/class="nav-item/g) ?? []).length, 4, 'primary navigation must have four items');
for (const label of ['Today', 'Explore', 'Trip', 'Family']) {
  assert.match(nav, new RegExp(`>${label}<`), `primary navigation must include ${label}`);
}

const migration = loader.match(/function migrateReleaseOnce\(\)[\s\S]*?\n  }/)?.[0] ?? '';
assert.ok(migration, 'release migration must exist');
assert.doesNotMatch(migration, /removeItem|localStorage\.clear/, 'release migration must preserve user data');
assert.match(migration, /localStorage\.setItem\(RELEASE_KEY,VERSION\)/, 'release migration must record its version');

const source = [html, app, family, serviceWorker].join('\n');
const assetRefs = new Set(source.match(/assets\/ferda\/[A-Za-z0-9_./-]+\.(?:png|webp)/g) ?? []);
assert.ok(assetRefs.size >= 16, 'FERDA production assets must be wired into the shell');
for (const asset of assetRefs) {
  assert.ok(existsSync(join(root, asset)), `referenced asset is missing: ${asset}`);
}

for (const file of [
  'docs/ferda-feature-parity-matrix.md',
  'docs/ferda-product-source-of-truth.md',
  'docs/ferda-asset-manifest.md',
  'docs/ferda-development-backlog.md'
]) {
  assert.ok(existsSync(join(root, file)), `required audit document is missing: ${file}`);
}

console.log(`FERDA smoke test passed: ${scripts.length} scripts, 2 JSON files, 4 navigation items, ${assetRefs.size} asset references.`);
