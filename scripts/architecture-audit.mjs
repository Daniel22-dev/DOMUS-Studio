import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const read = (name) => fs.readFileSync(path.join(ROOT, name), 'utf8');
const fragments = fs.readdirSync(path.join(ROOT, 'src', 'app')).filter((name) => name.endsWith('.js')).sort();
const appSource = fragments.map((name) => read(path.join('src', 'app', name))).join('\n');
const declarations = new Map();
for (const match of appSource.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
  const name = match[1];
  declarations.set(name, (declarations.get(name) || 0) + 1);
}
const duplicates = [...declarations].filter(([, count]) => count > 1);
if (duplicates.length) errors.push(`Duplicitní funkce: ${duplicates.map(([name, count]) => `${name} (${count}×)`).join(', ')}`);

const performance = read('src/core/domus-performance.js');
const performanceMarker = 'DOMUS Performance v7:';
if (performance.split(performanceMarker).length - 1 !== 1) errors.push('Výkonnostní modul je ve zdroji vložen více než jednou.');
const html = read('index.html');
const runtimeScripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);
if (runtimeScripts.join(',') !== 'theme-init.js,app.js') errors.push(`Runtime má být jeden bundle; nalezeno: ${runtimeScripts.join(', ')}`);
const packageJson = JSON.parse(read('package.json'));
if (!packageJson.devDependencies?.esbuild) errors.push('Chybí esbuild v devDependencies.');
for (const file of ['app.js', 'app.js.map', 'styles.css', 'styles.css.map', 'dist/app.js', 'dist/app.js.map', 'dist/styles.css', 'dist/styles.css.map']) {
  if (!fs.existsSync(path.join(ROOT, file))) errors.push(`Chybí build výstup ${file}.`);
}
if (!fs.existsSync(path.join(ROOT, 'src', 'styles', 'main.css'))) errors.push('Chybí modulární vstup stylů.');
if (fs.readdirSync(path.join(ROOT, 'src', 'styles')).filter((name) => name.endsWith('.css')).length < 6) errors.push('Styly nejsou rozděleny do komponentových etap.');
const eventSource = fragments.filter((name) => /^7[0-4]-/.test(name)).map((name) => read(path.join('src','app',name))).join('\n');
if (!eventSource.includes("app.addEventListener('click', handleDelegatedAppClick)")) errors.push('Chybí delegace kliknutí na #app.');
if (/querySelectorAll\(['"]\[data-action\]['"]\)[\s\S]{0,100}addEventListener/.test(eventSource)) errors.push('Dynamické data-action prvky stále vážou jednotlivé listenery.');
for (const region of ['projectGrid','materialsResults','budgetResults','auditResults','diaryResults','libraryResults']) {
  if (!appSource.includes(`id="${region}"`)) errors.push(`Chybí cíleně aktualizovaný region ${region}.`);
}
if (!eventSource.includes('refreshFilterRegion')) errors.push('Filtry nepoužívají cílené aktualizace regionů.');
const manifest = JSON.parse(read('build-manifest.json'));
if (manifest.bundler !== 'esbuild') errors.push('Build manifest nepotvrzuje esbuild.');

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join('\n'));
  process.exit(1);
}
console.log(`architecture-audit: OK (${fragments.length} fragmentů, ${declarations.size} pojmenovaných funkcí, 1 runtime bundle)`);
