/* DOMUS Studio Test Lab v7.0: safe in-app diagnostics for administrators and releases. */
const DomusDiagnostics = (() => {
  'use strict';

  const RELEASE = Object.freeze({
    app: 'DOMUS Studio',
    version: '7.0.0',
    schemaVersion: 7,
    architecture: 'modular-source/generated-runtime',
  });
  const STATUS_ORDER = Object.freeze({ fail: 0, warn: 1, pass: 2, skip: 3 });
  let config = null;
  let lastReport = null;
  let activeRun = null;

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;',
  }[char]));

  function makeResult(id, category, label, status, detail, durationMs = 0, evidence = null) {
    return { id, category, label, status, detail, durationMs, evidence };
  }

  async function withTimeout(promise, timeoutMs, label) {
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} překročil časový limit ${timeoutMs} ms.`)), timeoutMs); }),
      ]);
    } finally { clearTimeout(timer); }
  }

  async function runCase(definition, context) {
    const started = performance.now();
    try {
      const outcome = await definition.run(context);
      const status = outcome?.status || 'pass';
      return makeResult(definition.id, definition.category, definition.label, status, outcome?.detail || 'Kontrola proběhla bez nálezu.', Math.round(performance.now() - started), outcome?.evidence || null);
    } catch (error) {
      return makeResult(definition.id, definition.category, definition.label, 'fail', error?.message || String(error), Math.round(performance.now() - started));
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function testRelease() {
    const title = document.title || '';
    const versionText = document.querySelector('.brand small')?.textContent || '';
    assert(title.includes('v7'), 'Titulek stránky neobsahuje hlavní verzi aplikace.');
    assert(versionText.includes('v7'), 'Záhlaví aplikace neobsahuje hlavní verzi.');
    return { detail: `${RELEASE.app} ${RELEASE.version} · schéma ${RELEASE.schemaVersion} · ${RELEASE.architecture}` };
  }

  function testRuntimeModules() {
    const modules = ['DomusCore', 'DomusDB', 'DomusAudit', 'DomusBackup', 'DomusPremium', 'DomusPerformance', 'DomusDiagnostics'];
    const missing = modules.filter((name) => !window[name]);
    assert(!missing.length, `Chybějí runtime moduly: ${missing.join(', ')}.`);
    return { detail: `Načteno ${modules.length}/${modules.length} povinných modulů.` };
  }

  function testModalLayer() {
    const expected = ['projectDialog', 'materialDialog', 'costDialog', 'assemblyDialog', 'objectDialog', 'variantDialog', 'diaryDialog', 'warrantyDialog', 'inputDialog', 'storageDialog', 'onboardingDialog', 'settingsDialog', 'diagnosticsDialog'];
    const missing = expected.filter((id) => !document.getElementById(id));
    assert(!missing.length, `Chybějí dialogy: ${missing.join(', ')}.`);
    const unsupported = typeof HTMLDialogElement === 'undefined' || typeof document.getElementById('diagnosticsDialog')?.showModal !== 'function';
    if (unsupported) return { status: 'warn', detail: 'Prohlížeč nemá plnou podporu nativních dialogů; bude nutný kompatibilní prohlížeč.' };
    return { detail: `Modal vrstva je úplná (${expected.length} dialogů).` };
  }

  function testHtmlSmoke() {
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    assert(!duplicates.length, `Duplicitní HTML ID: ${duplicates.join(', ')}.`);
    const inlineHandlers = [...document.querySelectorAll('*')].filter((node) => [...node.attributes].some((attribute) => /^on/i.test(attribute.name)));
    assert(!inlineHandlers.length, `Nalezeny inline event handlery: ${inlineHandlers.length}.`);
    const required = ['app', 'homeBtn', 'newProjectBtn', 'importBtn', 'exportBtn', 'saveStatus'];
    const missing = required.filter((id) => !document.getElementById(id));
    assert(!missing.length, `Chybějí klíčové prvky: ${missing.join(', ')}.`);
    return { detail: `${ids.length} jedinečných ID, bez inline handlerů a s kompletní aplikační kostrou.` };
  }

  async function fetchText(path) {
    if (!location.protocol.startsWith('http')) return null;
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.text();
  }

  async function testActionMap() {
    if (!location.protocol.startsWith('http')) return { status: 'warn', detail: 'Kontrolu úplnosti action routeru nelze ve file:// režimu provést. Spusťte aplikaci přes lokální server.' };
    const [html, appSource] = await Promise.all([fetchText('index.html'), fetchText('app.js')]);
    const combined = `${html}\n${appSource}`;
    const actions = new Set([...combined.matchAll(/data-action=["']([^"']+)/g)].map((match) => match[1]));
    const handled = new Set([...appSource.matchAll(/action\s*===\s*["']([^"']+)/g)].map((match) => match[1]));
    const missing = [...actions].filter((action) => !handled.has(action));
    assert(!missing.length, `Akce bez handleru: ${missing.join(', ')}.`);
    return { detail: `${actions.size} deklarovaných akcí má odpovídající obsluhu.` };
  }

  async function testSecretScanner() {
    const patterns = [
      { name: 'Google API key', regex: /AIza[0-9A-Za-z_-]{30,}/g },
      { name: 'OpenAI-style key', regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
      { name: 'GitHub token', regex: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g },
      { name: 'AWS access key', regex: /\bAKIA[0-9A-Z]{16}\b/g },
      { name: 'Private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
    ];
    const sources = [{ name: 'DOM', text: document.documentElement.outerHTML }];
    try {
      const local = Object.keys(localStorage).map((key) => `${key}=${localStorage.getItem(key)}`).join('\n');
      sources.push({ name: 'localStorage', text: local });
    } catch { /* storage may be unavailable */ }
    if (location.protocol.startsWith('http')) {
      const files = ['app.js', 'domus-core.js', 'db.js', 'domus-audit.js', 'domus-backup.js', 'domus-diagnostics.js'];
      for (const file of files) {
        try { sources.push({ name: file, text: await fetchText(file) }); } catch { /* reported by release tests elsewhere */ }
      }
    }
    const hits = [];
    for (const source of sources) for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(source.text || '')) hits.push(`${pattern.name} v ${source.name}`);
    }
    assert(!hits.length, `Nalezen možný tajný údaj: ${hits.join('; ')}.`);
    const coverage = location.protocol.startsWith('http') ? `${sources.length} zdrojů` : 'DOM a localStorage; zdrojové soubory vyžadují HTTP';
    return { status: location.protocol.startsWith('http') ? 'pass' : 'warn', detail: `SecretScanner bez nálezu (${coverage}).` };
  }

  function testExportGuard() {
    assert(/^"'/.test(DomusCore.csvCell('=HYPERLINK("bad")')), 'CSV vzorec nebyl neutralizován.');
    assert(DomusCore.cleanHttpUrl('javascript:alert(1)') === '', 'Nebezpečná URL nebyla odmítnuta.');
    assert(DomusCore.cleanDataUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=') === null, 'SVG Data URL nebyla odmítnuta.');
    return { detail: 'CSV formula injection, javascript: URL a SVG Data URL jsou blokovány.' };
  }

  function oldProjectFixture() {
    return {
      id: 'diagnostic old project', name: 'Diagnostický projekt', schemaVersion: 3,
      variants: [{ id: 'diagnostic-variant', name: 'Původní varianta', plan: { scale: 100, walls: [], objects: [] } }],
      activeVariantId: 'diagnostic-variant',
    };
  }

  function testMigration(context) {
    assert(typeof context.normalizeProject === 'function', 'Aplikace neposkytla migrační adaptér.');
    const migrated = context.normalizeProject(oldProjectFixture());
    assert(migrated.schemaVersion === RELEASE.schemaVersion, `Migrace skončila na schématu ${migrated.schemaVersion}.`);
    assert(Array.isArray(migrated.variants) && migrated.variants.length === 1, 'Migrace nezachovala variantu.');
    assert(migrated.variants[0].field?.sessions, 'Migrace nedoplnila terénní zaměření.');
    assert(migrated.variants[0].diary?.entries, 'Migrace nedoplnila BuildLog.');
    return { detail: 'Projekt ze schématu 3 byl bezpečně převeden na schéma 7.' };
  }

  function testDataModel(context) {
    const projects = context.getProjects?.() || [];
    for (const project of projects) {
      assert(project && typeof project.id === 'string' && project.id, 'Projekt nemá platné ID.');
      assert(project.schemaVersion === RELEASE.schemaVersion, `Projekt ${project.name || project.id} nemá schéma ${RELEASE.schemaVersion}.`);
      assert(Array.isArray(project.variants) && project.variants.length, `Projekt ${project.name || project.id} nemá variantu.`);
      assert(project.variants.some((variant) => variant.id === project.activeVariantId), `Projekt ${project.name || project.id} nemá platnou aktivní variantu.`);
    }
    return { detail: `${projects.length} projektů odpovídá základním invariantům schématu 7.` };
  }

  function testAuditEngine() {
    const plan = {
      scale: 100,
      walls: [
        { id: 'w1', x1: 0, y1: 0, x2: 400, y2: 0 }, { id: 'w2', x1: 400, y1: 0, x2: 400, y2: 300 },
        { id: 'w3', x1: 400, y1: 300, x2: 0, y2: 300 }, { id: 'w4', x1: 0, y1: 300, x2: 0, y2: 0 },
      ],
      objects: [
        { id: 'socket', type: 'Zásuvka', libraryKey: 'socket', shape: 'circle', layer: 'electricity', x: 250, y: 100, width: 9, depth: 9 },
        { id: 'pipe', type: 'Vodovodní potrubí', libraryKey: 'water-pipe', shape: 'line', layer: 'water', x: 245, y: 95, width: 100, depth: 4 },
      ],
    };
    const variant = { plan, materials: [], audit: { overrides: {} }, field: { sessions: [{ measurements: [{ id: 'm', source: 'measured', verified: true, targetId: 'w1' }] }] } };
    const polygon = DomusAudit.orderedPolygon(plan);
    assert(polygon?.length === 4, 'Audit nevytvořil polygon uzavřené místnosti.');
    const report = DomusAudit.buildReport(variant, { polygon }, 0);
    assert(report.issues.some((issue) => issue.id.startsWith('service-gap-')), 'Audit nezachytil souběh elektro a vody.');
    return { detail: `Audit engine vytvořil polygon a ${report.issues.length} kontrolních nálezů.` };
  }

  async function testBackupRoundTrip() {
    const fixture = DomusCore.secureProject(oldProjectFixture());
    const blob = await DomusBackup.createProjectBackup([fixture]);
    assert(blob instanceof Blob && blob.size > 100, 'ZIP záloha nebyla vytvořena.');
    const file = new File([blob], 'diagnostic.domus.zip', { type: 'application/zip' });
    const restored = await DomusBackup.readProjectBackup(file);
    assert(restored.projects?.length === 1, 'Záloha se neobnovila s jedním projektem.');
    assert(restored.projects[0].id === fixture.id, 'Round-trip změnil ID projektu.');
    return { detail: `ZIP round-trip proběhl úspěšně (${blob.size.toLocaleString('cs-CZ')} B).` };
  }

  async function testStorage() {
    if (!DomusDB?.diagnosticRoundTrip) return { status: 'warn', detail: 'Databázová vrstva nemá izolovaný diagnostický round-trip.' };
    try {
      const outcome = await DomusDB.diagnosticRoundTrip();
      assert(outcome?.ok, 'IndexedDB round-trip nevrátil potvrzení.');
      return { detail: `IndexedDB zápis, načtení, binární příloha a úklid proběhly (${outcome.assetBytes || 0} B).` };
    } catch (error) {
      if (/denied|SecurityError|not allowed|indexeddb/i.test(error?.message || '')) return { status: 'warn', detail: `IndexedDB nelze v tomto režimu ověřit: ${error.message}` };
      throw error;
    }
  }

  function testPwa() {
    const manifest = document.querySelector('link[rel="manifest"]');
    assert(manifest, 'Chybí odkaz na webmanifest.');
    const supported = 'serviceWorker' in navigator;
    if (!location.protocol.startsWith('http')) return { status: 'warn', detail: 'Manifest je připojen, ale service worker se ve file:// režimu nespouští.' };
    if (!supported) return { status: 'warn', detail: 'Prohlížeč nepodporuje service worker.' };
    return { detail: `PWA prostředí je dostupné; secure context: ${window.isSecureContext ? 'ano' : 'ne'}.` };
  }

  async function testManifestAssets() {
    if (!location.protocol.startsWith('http')) return { status: 'warn', detail: 'Dostupnost manifestu a ikon vyžaduje HTTP režim.' };
    const manifestResponse = await fetch('manifest.webmanifest', { cache: 'no-store' });
    assert(manifestResponse.ok, `Manifest vrací HTTP ${manifestResponse.status}.`);
    const manifest = await manifestResponse.json();
    const sources = (manifest.icons || []).map((icon) => icon.src);
    const required = ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
    const missing = required.filter((name) => !sources.includes(name));
    assert(!missing.length, `Manifest neobsahuje ikony: ${missing.join(', ')}.`);
    for (const icon of required) {
      const response = await fetch(icon, { method: 'HEAD', cache: 'no-store' });
      assert(response.ok, `${icon} vrací HTTP ${response.status}.`);
    }
    return { detail: 'Manifest a všechny tři povinné PWA ikony jsou dostupné.' };
  }

  async function testServiceEndpoint(path, label) {
    if (!location.protocol.startsWith('http')) return { status: 'warn', detail: `${label} nelze ve file:// režimu ověřit.` };
    try {
      const response = await withTimeout(fetch(path, { cache: 'no-store' }), 2500, label);
      if (response.status === 404) return { status: 'warn', detail: `${label} není na tomto hostingu aktivní (HTTP 404); na GitHub Pages je to očekávané.` };
      if (!response.ok) return { status: 'warn', detail: `${label} odpověděl HTTP ${response.status}.` };
      return { detail: `${label} odpověděl úspěšně.` };
    } catch (error) {
      return { status: 'warn', detail: `${label} není dostupný: ${error.message}` };
    }
  }

  function testCurrentProject(context) {
    const project = context.getCurrentProject?.();
    if (!project) return { status: 'skip', detail: 'Není otevřen žádný projekt; projektový smoke test byl přeskočen.' };
    const secure = DomusCore.secureProject(project);
    assert(secure.id === project.id, 'Bezpečnostní normalizace změnila ID otevřeného projektu.');
    const active = secure.variants.find((variant) => variant.id === secure.activeVariantId);
    assert(active, 'Otevřený projekt nemá platnou aktivní variantu.');
    const report = DomusAudit.buildReport(active, context.computeMetrics?.(active) || {}, context.budgetTotal?.(active) || 0);
    return { detail: `Projekt „${project.name}“ prošel normalizací; Verify vrátil ${report.issues.length} nálezů.` };
  }


  function testPremiumCore() {
    assert(window.DomusPremium, 'Chybí prémiové doménové jádro.');
    const plan = { scale: 100, walls: [{ id: 'w', x1: 0, y1: 0, x2: 400, y2: 0 }], objects: [{ id: 'o', type: 'Skříň', x: 40, y: 40, width: 80, depth: 50 }] };
    const dxf = DomusPremium.exportDxf(plan, { name: 'Diagnostika' });
    assert(/SECTION/.test(dxf) && /LINE/.test(dxf), 'DXF export nevytvořil platnou základní strukturu.');
    const base = { id: 'p', updatedAt: '2026-01-01T00:00:00Z', variants: [{ id: 'v', name: 'A', updatedAt: '2026-01-01T00:00:00Z', materials: [], costs: { lines: [] }, plan }] };
    const local = structuredClone(base); local.variants[0].name = 'Lokální'; local.variants[0].updatedAt = '2026-02-01T00:00:00Z';
    const remote = structuredClone(base); remote.variants[0].name = 'Vzdálená'; remote.variants[0].updatedAt = '2026-03-01T00:00:00Z';
    const merged = DomusPremium.mergeProjects(local, remote);
    assert(merged.project?.variants?.length === 1, 'Položkové slučování poškodilo varianty.');
    assert(Array.isArray(merged.conflicts), 'Slučování nevrátilo seznam konfliktů.');
    return { detail: `DXF export a položkové slučování prošly; konflikty: ${merged.conflicts.length}.` };
  }

  async function testPerformanceCore() {
    assert(window.DomusPerformance, 'Chybí výkonnostní jádro.');
    const fixture = { variants: [{ plan: { walls: Array.from({ length: 25 }, (_, i) => ({ id: `w${i}` })), objects: Array.from({ length: 40 }, (_, i) => ({ id: `o${i}` })) }, materials: Array.from({ length: 12 }, (_, i) => ({ id: `m${i}` })), diary: { entries: [] } }] };
    const metrics = await DomusPerformance.analyze(fixture);
    assert(metrics && Number.isFinite(metrics.score), 'Výkonnostní profil nevrátil platné skóre.');
    return { status: metrics.level === 'extreme' || metrics.budget === 'exceeded' ? 'warn' : 'pass', detail: `Výkonnostní profil: ${metrics.level}, skóre ${metrics.score}.` };
  }

  function testWebGlCapability() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return { status: 'warn', detail: 'WebGL není dostupné; RealSpace 3D bude omezené.' };
    return { detail: `WebGL je dostupné (${typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? 'WebGL 2' : 'WebGL 1'}).` };
  }

  const SAFE_TESTS = [
    { id: 'release', category: 'Release', label: 'Release metadata', run: testRelease },
    { id: 'runtime', category: 'Runtime', label: 'Povinné moduly', run: testRuntimeModules },
    { id: 'modals', category: 'UI', label: 'Modal vrstva', run: testModalLayer },
    { id: 'html-smoke', category: 'UI', label: 'HTML smoke validátor', run: testHtmlSmoke },
    { id: 'actions', category: 'UI', label: 'Action router', run: testActionMap },
    { id: 'secrets', category: 'Bezpečnost', label: 'SecretScanner', run: testSecretScanner },
    { id: 'export-guard', category: 'Bezpečnost', label: 'Export guard', run: testExportGuard },
    { id: 'migration', category: 'Data', label: 'Migrace datového modelu', run: testMigration },
    { id: 'data-model', category: 'Data', label: 'Invarianta projektů', run: testDataModel },
    { id: 'audit', category: 'Doména', label: 'DOMUS Verify engine', run: testAuditEngine },
    { id: 'premium-core', category: 'Doména', label: 'Premium DXF a slučování', run: testPremiumCore },
    { id: 'performance-core', category: 'Výkon', label: 'Výkonnostní profil projektu', run: testPerformanceCore },
    { id: 'webgl', category: '3D', label: 'WebGL schopnosti', run: testWebGlCapability },
    { id: 'backup', category: 'Data', label: 'ZIP backup round-trip', run: testBackupRoundTrip },
    { id: 'storage', category: 'Data', label: 'IndexedDB round-trip', run: testStorage },
    { id: 'pwa', category: 'PWA', label: 'PWA prostředí', run: testPwa },
    { id: 'manifest', category: 'PWA', label: 'Manifest a ikony', run: testManifestAssets },
    { id: 'project-smoke', category: 'Doména', label: 'Otevřený projekt', run: testCurrentProject },
  ];

  const SERVICE_TESTS = [
    { id: 'ai-service', category: 'Služby', label: 'Lokální AI API', run: () => testServiceEndpoint('/api/ai/status', 'AI API') },
    { id: 'sync-service', category: 'Služby', label: 'LAN synchronizace', run: () => testServiceEndpoint('/api/sync/status', 'Synchronizační API') },
  ];

  function summarize(results) {
    return results.reduce((counts, item) => { counts[item.status] = (counts[item.status] || 0) + 1; return counts; }, { pass: 0, warn: 0, fail: 0, skip: 0 });
  }

  function overallStatus(counts) {
    if (counts.fail) return 'fail';
    if (counts.warn) return 'warn';
    return 'pass';
  }

  function updateBadge(report) {
    const badge = document.getElementById(config?.badgeId || 'diagnosticsBadge');
    const buttons = (config?.buttonIds || []).map((id) => document.getElementById(id)).filter(Boolean);
    if (!report) {
      if (badge) badge.textContent = '—';
      return;
    }
    const status = overallStatus(report.counts);
    if (badge) { badge.textContent = report.counts.fail ? `${report.counts.fail} FAIL` : report.counts.warn ? `${report.counts.warn} WARN` : `${report.counts.pass} PASS`; badge.dataset.status = status; }
    buttons.forEach((button) => { button.dataset.status = status; button.title = `Test Lab: ${report.counts.pass} PASS / ${report.counts.warn} WARN / ${report.counts.fail} FAIL`; });
  }

  function renderIdle() {
    const content = document.getElementById(config?.contentId || 'diagnosticsContent');
    if (!content) return;
    content.innerHTML = `<div class="diagnostics-empty"><strong>Test Lab je připraven.</strong><p>Testy jsou bezpečné a nepřepisují uživatelské projekty. Databázový test používá dočasný izolovaný záznam, který po sobě uklidí.</p></div>`;
  }

  function renderLoading() {
    const content = document.getElementById(config?.contentId || 'diagnosticsContent');
    if (!content) return;
    content.innerHTML = `<div class="diagnostics-empty"><strong>Probíhá diagnostika…</strong><p>Kontroluji runtime, bezpečnost, datový model, zálohy, IndexedDB, PWA a volitelné lokální služby.</p></div>`;
  }

  function renderReport(report) {
    const content = document.getElementById(config?.contentId || 'diagnosticsContent');
    if (!content) return;
    const groups = [...new Set(report.results.map((item) => item.category))];
    content.innerHTML = `
      <div class="diagnostics-summary" data-overall="${overallStatus(report.counts)}">
        <div><small>Verze</small><strong>${escapeHtml(report.release.version)}</strong></div>
        <div><small>PASS</small><strong>${report.counts.pass}</strong></div>
        <div><small>WARN</small><strong>${report.counts.warn}</strong></div>
        <div><small>FAIL</small><strong>${report.counts.fail}</strong></div>
        <div><small>Čas</small><strong>${report.durationMs} ms</strong></div>
      </div>
      <div class="diagnostics-meta">${escapeHtml(new Date(report.ranAt).toLocaleString('cs-CZ'))} · ${escapeHtml(navigator.userAgent)} · ${escapeHtml(location.protocol)}</div>
      ${groups.map((group) => `<section class="diagnostics-group"><h3>${escapeHtml(group)}</h3>${report.results.filter((item) => item.category === group).map((item) => `
        <article class="diagnostic-row ${item.status}">
          <span class="diagnostic-status">${item.status.toUpperCase()}</span>
          <div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.detail)}</p></div>
          <small>${item.durationMs} ms</small>
        </article>`).join('')}</section>`).join('')}`;
  }

  async function executeRun(options = {}) {
    const background = !!options.background;
    const includeServices = options.includeServices !== false;
    if (!background) renderLoading();
    const started = performance.now();
    const context = {
      release: RELEASE,
      getProjects: config?.getProjects,
      getCurrentProject: config?.getCurrentProject,
      getState: config?.getState,
      normalizeProject: config?.normalizeProject,
      computeMetrics: config?.computeMetrics,
      budgetTotal: config?.budgetTotal,
    };
    const definitions = includeServices ? [...SAFE_TESTS, ...SERVICE_TESTS] : SAFE_TESTS;
    const results = [];
    for (const definition of definitions) results.push(await runCase(definition, context));
    results.sort((a, b) => (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) || a.category.localeCompare(b.category, 'cs') || a.label.localeCompare(b.label, 'cs'));
    const report = {
      release: RELEASE,
      ranAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - started),
      location: location.href,
      userAgent: navigator.userAgent,
      counts: summarize(results),
      results,
    };
    lastReport = report;
    updateBadge(report);
    if (!background) renderReport(report);
    return report;
  }

  async function runAll(options = {}) {
    // A background self-test can still be running when an administrator or CI
    // requests a fresh report. Never return a stale dashboard report for a
    // newly opened project: wait for the in-flight run and execute the explicit
    // request against the current application state.
    while (activeRun) {
      const completed = await activeRun;
      if (options.background) return completed;
    }

    const task = executeRun(options);
    activeRun = task;
    try {
      return await task;
    } finally {
      if (activeRun === task) activeRun = null;
    }
  }

  function reportAsText(report) {
    const lines = [
      `${report.release.app} ${report.release.version} – Test Lab`,
      `Datum: ${new Date(report.ranAt).toLocaleString('cs-CZ')}`,
      `Schéma: ${report.release.schemaVersion}`,
      `Architektura: ${report.release.architecture}`,
      `Výsledek: ${report.counts.pass} PASS / ${report.counts.warn} WARN / ${report.counts.fail} FAIL / ${report.counts.skip} SKIP`,
      `Doba: ${report.durationMs} ms`,
      `Adresa: ${report.location}`,
      `Prohlížeč: ${report.userAgent}`,
      '',
    ];
    let category = '';
    for (const item of report.results) {
      if (category !== item.category) { category = item.category; lines.push(`[${category}]`); }
      lines.push(`${item.status.toUpperCase()} · ${item.label} · ${item.detail} (${item.durationMs} ms)`);
    }
    return `${lines.join('\n')}\n`;
  }

  function downloadReport() {
    if (!lastReport) return;
    const blob = new Blob([reportAsText(lastReport)], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DOMUS-Test-Lab-${lastReport.release.version}-${lastReport.ranAt.slice(0, 10)}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function open() {
    const dialog = document.getElementById(config?.dialogId || 'diagnosticsDialog');
    if (!dialog) return;
    dialog.showModal();
    runAll({ includeServices: true });
  }

  function mount(options = {}) {
    config = { buttonIds: ['diagnosticsBtn', 'mobileDiagnosticsBtn'], badgeId: 'diagnosticsBadge', dialogId: 'diagnosticsDialog', contentId: 'diagnosticsContent', runButtonId: 'runDiagnosticsBtn', exportButtonId: 'exportDiagnosticsBtn', ...options };
    for (const id of config.buttonIds) document.getElementById(id)?.addEventListener('click', () => { if (id === 'mobileDiagnosticsBtn') document.getElementById('mobileActions')?.setAttribute('hidden', ''); open(); });
    document.getElementById(config.runButtonId)?.addEventListener('click', () => runAll({ includeServices: true }));
    document.getElementById(config.exportButtonId)?.addEventListener('click', downloadReport);
    renderIdle();
    setTimeout(() => runAll({ background: true, includeServices: false }).catch((error) => console.warn('Test Lab:', error)), 500);
  }

  return Object.freeze({ RELEASE, mount, runAll, downloadReport, getLastReport: () => lastReport });
})();
window.DomusDiagnostics = DomusDiagnostics;
