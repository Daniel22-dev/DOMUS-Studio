import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8');
const size = (name) => fs.statSync(path.join(ROOT, name)).size;

for (const file of ['app.js','app.js.map','styles.css','styles.css.map','dist/app.js','dist/app.js.map','dist/styles.css','dist/styles.css.map']) {
  assert.ok(fs.existsSync(path.join(ROOT, file)), `Chybí ${file}`);
}
assert.ok(size('dist/app.js') < size('app.js') * 0.82, 'Produkční JavaScript není účinně minifikovaný.');
assert.ok(size('dist/styles.css') < size('styles.css') * 0.88, 'Produkční CSS není účinně minifikované.');
const jsMap = JSON.parse(read('app.js.map'));
const cssMap = JSON.parse(read('styles.css.map'));
assert.ok(jsMap.sources.some((source) => /src\/generated\/app-source\.js/.test(source)), 'JS source map neobsahuje sjednocený aplikační zdroj.');
assert.ok(jsMap.sources.some((source) => /src\/core\//.test(source)), 'JS source map neobsahuje základní moduly.');
assert.ok(cssMap.sources.filter((source) => /src\/styles\//.test(source)).length >= 6, 'CSS source map neobsahuje rozdělené styly.');
const html = read('index.html');
const scripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(scripts, ['theme-init.js','app.js'], 'Aplikace nemá jediný runtime bundle.');
const serviceWorker = read('service-worker.js');
assert.match(serviceWorker, /domus-studio-v7-3-0/);
assert.doesNotMatch(serviceWorker, /domus-core\.js|domus-diagnostics\.js/, 'Service worker stále cachuje staré samostatné runtime moduly.');
const manifest = JSON.parse(read('build-manifest.json'));
assert.equal(manifest.bundler, 'esbuild');
assert.equal(manifest.version, '7.3.0');
assert.match(manifest.sourceHash, /^[a-f0-9]{64}$/);
assert.ok(Array.isArray(manifest.appFragmentRanges) && manifest.appFragmentRanges.length >= 25, 'Manifest neobsahuje mapu aplikačních fragmentů.');
assert.ok(fs.existsSync(path.join(ROOT, 'dist/MANUAL-DOMUS-STUDIO-v7.3.html')), 'Produkční balík neobsahuje manuál.');
assert.match(read('src/generated/app-source.js'), /BEGIN SOURCE: src\/app\/10-ui-foundation\.js/);
console.log(`build-output-tests: OK (dev JS ${size('app.js')} B, dist JS ${size('dist/app.js')} B)`);
