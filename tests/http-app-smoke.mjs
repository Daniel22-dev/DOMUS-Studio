import assert from 'node:assert/strict';

const cdpPort = process.env.DOMUS_CDP_PORT || '9222';
const httpPort = process.env.DOMUS_HTTP_PORT || '8008';
const httpHost = process.env.DOMUS_HTTP_HOST || '127.0.0.1';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let target = null;
for (let attempt = 0; attempt < 40; attempt += 1) {
  try {
    target = await (await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: 'PUT' })).json();
    if (target?.webSocketDebuggerUrl) break;
  } catch {}
  await sleep(250);
}
if (!target?.webSocketDebuggerUrl) throw new Error('Chromium CDP není dostupné.');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const waiting = new Map();
const errors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && waiting.has(message.id)) {
    const pending = waiting.get(message.id); waiting.delete(message.id);
    message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || 'Runtime exception');
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') errors.push(message.params.entry.text);
});
function send(method, params = {}) {
  const requestId = ++id;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => waiting.set(requestId, { resolve, reject }));
}
async function evaluate(expression, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    } catch (error) {
      const transientNavigation = /Inspected target navigated|Execution context was destroyed|Cannot find context/i.test(String(error?.message || error));
      if (!transientNavigation || attempt === retries) throw error;
      await sleep(200);
    }
  }
  throw new Error('Vyhodnocení v prohlížeči se nepodařilo dokončit.');
}
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
const navigation = await send('Page.navigate', { url: `http://${httpHost}:${httpPort}/index.html` });
if (/ERR_BLOCKED_BY_ADMINISTRATOR/.test(navigation.errorText || '')) {
  console.log('http-app-smoke: SKIPPED – testovací Chromium v tomto prostředí blokuje přístup na loopback. GitHub CI test spustí v běžném runneru.');
  socket.close();
  await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`, { method: 'PUT' }).catch(() => {});
  process.exit(0);
}
let loaded = null;
for (let attempt = 0; attempt < 120; attempt += 1) {
  loaded = await evaluate(`({
    ready: document.readyState === 'complete',
    title: document.title,
    projects: document.querySelectorAll('[data-action="open-project"]').length,
    testLab: !!window.DomusDiagnostics,
    badge: document.getElementById('diagnosticsBadge')?.textContent || '',
    storageError: /Nepodařilo se otevřít lokální úložiště/i.test(document.body.innerText),
    body: document.body.innerText.slice(0, 1200)
  })`);
  if (loaded.ready && /DOMUS Studio/.test(loaded.title) && loaded.testLab && (loaded.projects >= 1 || loaded.storageError)) break;
  await sleep(150);
}
assert.match(loaded?.title || '', /7\.0/);
assert.equal(loaded?.testLab, true, 'Test Lab musí být dostupný jako runtime modul.');
if (!loaded || loaded.projects < 1) {
  const runtime = errors.length ? `\nRuntime chyby:\n${errors.join('\n')}` : '';
  throw new Error(`Reálné HTTP spuštění po čekání nezobrazilo projekt. Stav: ${JSON.stringify(loaded)}${runtime}`);
}
const dashboardReport = await evaluate(`DomusDiagnostics.runAll({includeServices:false})`);
assert.equal(dashboardReport.counts.fail, 0, `Test Lab na dashboardu hlásí FAIL: ${JSON.stringify(dashboardReport.results.filter(r=>r.status==='fail'))}`);
assert.ok(dashboardReport.counts.pass >= 16, `Na HTTP se očekává nejméně 16 PASS, výsledek: ${JSON.stringify(dashboardReport.counts)}`);
const openedProjectId = await evaluate(`(()=>{const button=document.querySelector('[data-action="open-project"]');const id=button?.dataset.id||'';button?.click();return id;})()`);
let workspaceState = null;
for (let attempt = 0; attempt < 80; attempt += 1) {
  workspaceState = await evaluate(`({
    opened: !!document.querySelector('[data-action="back-dashboard"]'),
    title: document.querySelector('.workspace-head h1')?.textContent || '',
    dashboardCards: document.querySelectorAll('[data-action="open-project"]').length,
    body: document.body.innerText.slice(0, 800)
  })`);
  if (workspaceState.opened) break;
  await sleep(100);
}
assert.equal(workspaceState?.opened, true, `Projekt ${openedProjectId || '(bez ID)'} se neotevřel. Stav: ${JSON.stringify(workspaceState)}`);
const projectReport = await evaluate(`DomusDiagnostics.runAll({includeServices:false})`);
assert.equal(projectReport.counts.fail, 0, `Test Lab v projektu hlásí FAIL: ${JSON.stringify(projectReport.results.filter(r=>r.status==='fail'))}`);
const projectSmoke = projectReport.results.find((item) => item.id === 'project-smoke');
assert.equal(projectSmoke?.status, 'pass', `Smoke test otevřeného projektu musí projít. Výsledek: ${JSON.stringify(projectSmoke)}; workspace: ${JSON.stringify(workspaceState)}`);

const premiumUi = await evaluate(`(async()=>{
  const clickTab=(name)=>document.querySelector('[data-tab="'+name+'"]')?.click();
  clickTab('library'); await new Promise(r=>setTimeout(r,80));
  const libraryCards=document.querySelectorAll('[data-library-element], .library-card').length;
  clickTab('plan'); await new Promise(r=>setTimeout(r,80));
  const precision=/Precision 2D/i.test(document.body.innerText);
  const redo=!!document.querySelector('[data-action="redo-plan"]');
  clickTab('pdf'); await new Promise(r=>setTimeout(r,80));
  const report=/Report Studio/i.test(document.body.innerText);
  const threeCoreAsset=(await fetch('vendor/three.core.min.js',{method:'HEAD'})).ok;
  const threeAsset=(await fetch('vendor/three.module.min.js',{method:'HEAD'})).ok;
  let threeImport=false;
  try { const three=await import(new URL('vendor/three.module.min.js', location.href).href); threeImport=typeof three.Scene==='function' && typeof three.WebGLRenderer==='function'; } catch {}
  clickTab('model'); await new Promise(r=>setTimeout(r,1000));
  const modelCanvas=!!document.getElementById('modelCanvas');
  const threeFailure=/nepodařilo načíst/i.test(document.getElementById('threeLoading')?.textContent||'');
  return {libraryCards,precision,redo,report,threeCoreAsset,threeAsset,threeImport,modelCanvas,threeFailure};
})()`);
assert.ok(premiumUi.libraryCards > 0, 'Prémiová knihovna je prázdná.');
assert.equal(premiumUi.precision, true, 'Precision 2D se nevykreslil.');
assert.equal(premiumUi.redo, true, 'Precision 2D nemá Redo.');
assert.equal(premiumUi.report, true, 'Report Studio se nevykreslilo.');
assert.equal(premiumUi.threeCoreAsset, true, 'Three.js core runtime asset není dostupný.');
assert.equal(premiumUi.threeAsset, true, 'Three.js runtime asset není dostupný.');
assert.equal(premiumUi.threeImport, true, 'Three.js modul nebo jeho relativní závislosti nelze importovat.');
assert.equal(premiumUi.modelCanvas, true, 'RealSpace 3D canvas se nevykreslil.');
assert.equal(premiumUi.threeFailure, false, 'RealSpace 3D ohlásil chybu načtení.');

const registration = await evaluate(`(async()=>{const r=await navigator.serviceWorker.getRegistration();return {supported:'serviceWorker' in navigator,registered:!!r};})()`);
assert.equal(registration.supported, true);
assert.equal(registration.registered, true, 'Service worker se při HTTP spuštění nezaregistroval.');
const relevantErrors = errors.filter((item) => !/favicon|404|api\/|Failed to fetch/i.test(item));
if (relevantErrors.length) throw new Error(`Chyby při reálném HTTP spuštění:\n${relevantErrors.join('\n')}`);
console.log(JSON.stringify({ status: 'OK', dashboard: dashboardReport.counts, project: projectReport.counts, premiumUi, serviceWorker: registration }, null, 2));
socket.close();
await fetch(`http://127.0.0.1:${cdpPort}/json/close/${target.id}`, { method: 'PUT' }).catch(() => {});
