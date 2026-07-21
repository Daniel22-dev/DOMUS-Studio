import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const CORE_DIR = path.join(ROOT, 'src', 'core');
const GENERATED_DIR = path.join(ROOT, 'src', 'generated');
const DIST = path.join(ROOT, 'dist');
const VERSION = '7.3.0';
const SCHEMA_VERSION = 7;
const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const MODE = modeArg?.split('=')[1] || 'all';
if (!['all', 'development', 'production'].includes(MODE)) throw new Error(`Neznámý build režim: ${MODE}`);
const BUILD_DEV = MODE !== 'production';
const BUILD_PROD = MODE !== 'development';

const fragments = fs.readdirSync(APP_DIR)
  .filter((name) => /^\d+.*\.js$/.test(name))
  .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));
const coreModules = [
  'domus-core.js', 'db.js', 'domus-audit.js', 'domus-backup.js',
  'domus-premium.js', 'domus-performance.js', 'domus-diagnostics.js',
];
if (!fragments.length) throw new Error('Nenalezeny aplikační fragmenty.');
for (const name of coreModules) if (!fs.existsSync(path.join(CORE_DIR, name))) throw new Error(`Chybí modul ${name}.`);
fs.mkdirSync(GENERATED_DIR, { recursive: true });

const appParts = [`/* GENERATED MODULE SOURCE – edit src/app/*.js and run npm run build. DOMUS Studio v${VERSION} */`];
const appFragmentRanges = [];
let generatedLine = 2;
for (const name of fragments) {
  const content = fs.readFileSync(path.join(APP_DIR, name), 'utf8').trimEnd();
  const lineCount = content ? content.split('\n').length : 0;
  appParts.push(`/* BEGIN SOURCE: src/app/${name} */\n${content}\n/* END SOURCE: src/app/${name} */`);
  appFragmentRanges.push({ file: `src/app/${name}`, startLine: generatedLine + 1, endLine: generatedLine + lineCount });
  generatedLine += lineCount + 3;
}
const appSource = `${appParts.join('\n\n')}\n`;
fs.writeFileSync(path.join(GENERATED_DIR, 'app-source.js'), appSource);
const entrySource = `${coreModules.map((name) => `import '../core/${name}';`).join('\n')}\nimport './app-source.js';\n`;
fs.writeFileSync(path.join(GENERATED_DIR, 'domus-entry.js'), entrySource);

const commonJs = {
  entryPoints: [path.join(GENERATED_DIR, 'domus-entry.js')],
  bundle: true,
  platform: 'browser',
  target: ['es2022'],
  format: 'iife',
  charset: 'utf8',
  legalComments: 'none',
  logLevel: 'warning',
  define: { __DOMUS_VERSION__: JSON.stringify(VERSION) },
  external: ['./vendor/*'],
};
const commonCss = {
  entryPoints: [path.join(ROOT, 'src', 'styles', 'main.css')],
  bundle: true,
  target: ['es2022'],
  legalComments: 'none',
  logLevel: 'warning',
};

if (BUILD_DEV) {
  await build({ ...commonJs, outfile: path.join(ROOT, 'app.js'), minify: false, sourcemap: 'external', banner: { js: `/* DOMUS Studio v${VERSION} development bundle */` } });
  await build({ ...commonCss, outfile: path.join(ROOT, 'styles.css'), minify: false, sourcemap: 'external' });
  for (const name of coreModules) fs.copyFileSync(path.join(CORE_DIR, name), path.join(ROOT, name));
}

if (BUILD_PROD) {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  await build({ ...commonJs, outfile: path.join(DIST, 'app.js'), minify: true, sourcemap: 'external', banner: { js: `/* DOMUS Studio v${VERSION} production bundle */` } });
  await build({ ...commonCss, outfile: path.join(DIST, 'styles.css'), minify: true, sourcemap: 'external' });
}

const sourceHash = crypto.createHash('sha256')
  .update(appSource)
  .update(coreModules.map((name) => fs.readFileSync(path.join(CORE_DIR, name))).join(''))
  .update(fs.readFileSync(path.join(ROOT, 'src', 'styles', 'main.css')))
  .digest('hex');

const generated = {
  version: VERSION,
  schemaVersion: SCHEMA_VERSION,
  sourceHash,
  bundler: 'esbuild',
  appFragments: fragments,
  appFragmentRanges,
  coreModules,
  outputs: ['app.js', 'app.js.map', 'styles.css', 'styles.css.map'],
};
fs.writeFileSync(path.join(ROOT, 'build-manifest.json'), `${JSON.stringify(generated, null, 2)}\n`);
if (BUILD_PROD) fs.copyFileSync(path.join(ROOT, 'build-manifest.json'), path.join(DIST, 'build-manifest.json'));

const runtime = ['index.html', 'theme-init.js', 'manifest.webmanifest', 'service-worker.js', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'MANUAL-DOMUS-STUDIO-v7.3.html', 'MANUAL-DOMUS-STUDIO-v7.3.md'];
if (BUILD_PROD) {
  for (const file of runtime) fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
  for (const dir of ['vendor', 'workers']) fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
}
const modeLabel = MODE === 'all' ? 'development + minified production' : MODE;
console.log(`build: OK (esbuild, ${fragments.length} app fragments, ${coreModules.length} core modules, ${modeLabel})`);
