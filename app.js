/* GENERATED FILE – edit src/app/*.js and run npm run build. DOMUS Studio v7.0.0 Premium */
/* Bootstrap, DOM references, application state and shared constants. Source fragment; assembled by scripts/build.mjs. */
/* DOMUS Studio v7.0 – hardened storage, verified planning, supplier RFQ and construction passport */
(() => {
  'use strict';

  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const projectCrumb = document.getElementById('projectCrumb');
  const projectDialog = document.getElementById('projectDialog');
  const projectForm = document.getElementById('projectForm');
  const materialDialog = document.getElementById('materialDialog');
  const materialForm = document.getElementById('materialForm');
  const costDialog = document.getElementById('costDialog');
  const costForm = document.getElementById('costForm');
  const assemblyDialog = document.getElementById('assemblyDialog');
  const assemblyForm = document.getElementById('assemblyForm');
  const objectDialog = document.getElementById('objectDialog');
  const objectForm = document.getElementById('objectForm');
  const variantDialog = document.getElementById('variantDialog');
  const variantForm = document.getElementById('variantForm');
  const backupInput = document.getElementById('backupInput');
  const photoInput = document.getElementById('photoInput');
  const compareBeforeInput = document.getElementById('compareBeforeInput');
  const compareAfterInput = document.getElementById('compareAfterInput');
  const roomPhotosInput = document.getElementById('roomPhotosInput');
  const fieldPhotoInput = document.getElementById('fieldPhotoInput');
  const scanInput = document.getElementById('scanInput');
  const diaryDialog = document.getElementById('diaryDialog');
  const diaryForm = document.getElementById('diaryForm');
  const warrantyDialog = document.getElementById('warrantyDialog');
  const warrantyForm = document.getElementById('warrantyForm');
  const diaryPhotoInput = document.getElementById('diaryPhotoInput');
  const warrantyDocumentInput = document.getElementById('warrantyDocumentInput');
  const printArea = document.getElementById('printArea');
  const installBtn = document.getElementById('installBtn');
  const updateBtn = document.getElementById('updateBtn');
  const saveStatusEl = document.getElementById('saveStatus');
  const undoBtn = document.getElementById('undoBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileActions = document.getElementById('mobileActions');
  const inputDialog = document.getElementById('inputDialog');
  const inputForm = document.getElementById('inputForm');
  const inputDialogTitle = document.getElementById('inputDialogTitle');
  const inputDialogLabel = document.getElementById('inputDialogLabel');
  const inputDialogValue = document.getElementById('inputDialogValue');
  const inputDialogHelp = document.getElementById('inputDialogHelp');
  const storageDialog = document.getElementById('storageDialog');
  const storageDialogContent = document.getElementById('storageDialogContent');
  let deferredInstallPrompt = null;

  const LAYERS = {
    architecture: { label: 'Stavba a vybavení', short: 'ST', color: '#d7aa68' },
    water: { label: 'Voda', short: 'V', color: '#55a9cf' },
    sewer: { label: 'Odpady', short: 'K', color: '#a67ac7' },
    electricity: { label: 'Elektro', short: 'E', color: '#e9c34f' },
    heating: { label: 'Vytápění', short: 'T', color: '#d96f62' },
    ventilation: { label: 'Vzduchotechnika', short: 'VZT', color: '#75c4a0' },
    garden: { label: 'Zahrada a závlaha', short: 'Z', color: '#7eb36a' },
  };

  const ELEMENT_LIBRARY = [
    { key: 'door', name: 'Dveře', layer: 'architecture', width: 900, depth: 150, height: 205, color: '#a67a4d', shape: 'door' },
    { key: 'window', name: 'Okno', layer: 'architecture', width: 1200, depth: 180, height: 120, color: '#77a9bb', shape: 'window' },
    { key: 'column', name: 'Sloup', layer: 'architecture', width: 300, depth: 300, height: 260, color: '#9b8b77', shape: 'box' },
    { key: 'cabinet', name: 'Skříň', layer: 'architecture', width: 800, depth: 600, height: 200, color: '#7b6a57', shape: 'box' },
    { key: 'shower-tray', name: 'Sprchová vanička', layer: 'architecture', width: 1200, depth: 900, height: 12, color: '#d8d8d1', shape: 'box' },
    { key: 'sink', name: 'Umyvadlo', layer: 'water', width: 600, depth: 480, height: 85, color: '#78b9d3', shape: 'oval' },
    { key: 'water-pipe', name: 'Vodovodní potrubí', layer: 'water', width: 2000, depth: 40, height: 10, color: '#55a9cf', shape: 'line' },
    { key: 'valve', name: 'Uzavírací ventil', layer: 'water', width: 120, depth: 120, height: 25, color: '#3f8fb4', shape: 'circle' },
    { key: 'drain', name: 'Odpadní potrubí', layer: 'sewer', width: 2000, depth: 110, height: 11, color: '#a67ac7', shape: 'line' },
    { key: 'floor-drain', name: 'Podlahová vpusť', layer: 'sewer', width: 150, depth: 150, height: 8, color: '#8a5aa8', shape: 'circle' },
    { key: 'manhole', name: 'Revizní šachta', layer: 'sewer', width: 1000, depth: 1000, height: 100, color: '#79518f', shape: 'circle' },
    { key: 'socket', name: 'Zásuvka', layer: 'electricity', width: 90, depth: 90, height: 30, color: '#e9c34f', shape: 'circle' },
    { key: 'light', name: 'Světlo', layer: 'electricity', width: 300, depth: 300, height: 8, color: '#f2d66b', shape: 'circle' },
    { key: 'switchboard', name: 'Rozvaděč', layer: 'electricity', width: 600, depth: 220, height: 120, color: '#c5a437', shape: 'box' },
    { key: 'radiator', name: 'Radiátor', layer: 'heating', width: 1000, depth: 120, height: 60, color: '#d96f62', shape: 'box' },
    { key: 'floor-heating', name: 'Podlahové vytápění', layer: 'heating', width: 2000, depth: 1500, height: 3, color: '#c85b51', shape: 'area' },
    { key: 'ac', name: 'Klimatizační jednotka', layer: 'ventilation', width: 950, depth: 260, height: 32, color: '#75c4a0', shape: 'box' },
    { key: 'recuperation', name: 'Rekuperační jednotka', layer: 'ventilation', width: 500, depth: 250, height: 50, color: '#5aa98a', shape: 'box' },
    { key: 'sprinkler', name: 'Postřikovač', layer: 'garden', width: 160, depth: 160, height: 15, color: '#7eb36a', shape: 'circle' },
    { key: 'irrigation-pipe', name: 'Závlahové potrubí', layer: 'garden', width: 2500, depth: 32, height: 6, color: '#65a450', shape: 'line' },
    { key: 'valve-box', name: 'Ventilová šachta', layer: 'garden', width: 500, depth: 400, height: 35, color: '#527f45', shape: 'box' },
  ];

  const DEFAULT_ASSEMBLIES = {
    floor: [
      { id: 'floor-1', name: 'Finální povrch', thicknessMm: 10, material: 'Dlažba / krytina', color: '#c8b08a', note: '' },
      { id: 'floor-2', name: 'Lepicí nebo vyrovnávací vrstva', thicknessMm: 5, material: 'Lepidlo', color: '#8e8e89', note: '' },
      { id: 'floor-3', name: 'Potěr', thicknessMm: 55, material: 'Cementový potěr', color: '#777b7d', note: '' },
      { id: 'floor-4', name: 'Tepelná izolace', thicknessMm: 100, material: 'EPS / XPS', color: '#b8d4c5', note: '' },
    ],
    wall: [
      { id: 'wall-1', name: 'Vnitřní povrch', thicknessMm: 15, material: 'Omítka / obklad', color: '#d9d3c7', note: '' },
      { id: 'wall-2', name: 'Nosná konstrukce', thicknessMm: 300, material: 'Zdivo', color: '#a67f62', note: '' },
      { id: 'wall-3', name: 'Tepelná izolace', thicknessMm: 120, material: 'PUR / EPS', color: '#b8d4c5', note: '' },
      { id: 'wall-4', name: 'Vnější povrch', thicknessMm: 5, material: 'Fasáda', color: '#d8c7a8', note: '' },
    ],
    ceiling: [
      { id: 'ceiling-1', name: 'Podhled / omítka', thicknessMm: 15, material: 'Sádrokarton / omítka', color: '#dedbd2', note: '' },
      { id: 'ceiling-2', name: 'Nosná konstrukce', thicknessMm: 200, material: 'Stropní konstrukce', color: '#8f8f8b', note: '' },
      { id: 'ceiling-3', name: 'Izolace', thicknessMm: 250, material: 'Minerální vata', color: '#c9d9b6', note: '' },
    ],
  };

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installBtn.hidden = true;
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./service-worker.js').then((registration) => {
      if (registration.waiting) updateBtn.hidden = false;
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) updateBtn.hidden = false; });
      });
    }).catch((error) => console.warn('Service worker:', error));
    navigator.serviceWorker.addEventListener('message', (event) => { if (event.data?.type === 'DOMUS_UPDATE_READY' && navigator.serviceWorker.controller) updateBtn.hidden = false; });
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { refreshing = true; location.reload(); } });
    updateBtn?.addEventListener('click', async () => { const registration = await navigator.serviceWorker.getRegistration(); registration?.waiting?.postMessage({ type: 'SKIP_WAITING' }); if (!registration?.waiting) location.reload(); });
  }

  const safeStorageGet = (key) => { try { return localStorage.getItem(key) || ''; } catch { return ''; } };
  const safeStorageSet = (key, value) => { try { localStorage.setItem(key, String(value)); } catch { } };
  const safeStorageRemove = (key) => { try { localStorage.removeItem(key); } catch { } };

  const state = {
    projects: [],
    currentProjectId: null,
    currentTab: 'overview',
    search: '',
    photoTool: 'measure',
    planTool: 'wall',
    planElementKey: 'door',
    activeLayer: 'architecture',
    modelMode: 'technical',
    threeD: { angle: 42, tilt: 28, zoom: 1, cameraMode: 'perspective', cutaway: 1, shadows: true, ceiling: false, labels: false },
    aiStatus: { checked: false, configured: false, model: '', message: 'Stav připojení nebyl ověřen.' },
    aiBusy: false,
    aiShare: { location: false, materials: true, notes: true },
    diaryFilter: '',
    filters: { materials: '', budget: '', auditText: '', auditSeverity: 'all', auditStatus: 'all' },
    syncStatus: { checked: false, enabled: false, token: safeStorageGet('domusSyncToken'), tokenExpiresAt: safeStorageGet('domusSyncTokenExpiresAt'), pairingCode: '', pairingExpiresAt: '', localClient: false, paired: false, serverUrl: '', deviceName: '', message: 'Synchronizace nebyla ověřena.', projects: [], devices: [] },
    syncBusy: false,
    saveState: { status: 'ready', at: '', error: '' },
    undo: null,
    planHistory: [],
    storageLastCheck: 0,
    presentation: { yaw: 0, pitch: 0, fov: 72, forward: 0, strafe: 0, autoRotate: false, gyro: false },
    pdfOptions: { field: true, ai: true, photo: true, plan: true, section: true, model: true, materials: true, calculations: true, budget: true, comparison: true, audit: true, rfq: true, diary: true, notes: true },
  };

  const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const deepClone = (value) => JSON.parse(JSON.stringify(value));

/* Undo, notifications, validated dialogs and storage UI. Source fragment; assembled by scripts/build.mjs. */
  function pushPlanHistory(project, variant = currentVariant(project)) {
    if (!project || !variant?.plan) return;
    state.planHistory.push({ projectId: project.id, variantId: variant.id, plan: deepClone(variant.plan), at: Date.now() });
    if (state.planHistory.length > 30) state.planHistory.splice(0, state.planHistory.length - 30);
  }
  async function undoPlanChange() {
    const project = currentProject(); const variant = currentVariant(project);
    if (!project || !variant) return;
    let index = -1;
    for (let i = state.planHistory.length - 1; i >= 0; i -= 1) {
      const item = state.planHistory[i];
      if (item.projectId === project.id && item.variantId === variant.id) { index = i; break; }
    }
    if (index < 0) return toast('Pro tento výkres není dostupný předchozí krok.', 'error');
    const [entry] = state.planHistory.splice(index, 1);
    variant.plan = deepClone(entry.plan);
    await saveProject(project);
    toast('Poslední změna výkresu byla vrácena.');
    render();
  }
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const snap = (value, step = 10) => Math.round(value / step) * step;
  const parseNum = (value, fallback = 0) => {
    const normalized = String(value ?? '').trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized) return fallback;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const round = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));
  const money = (value) => `${Math.round(Number(value || 0)).toLocaleString('cs-CZ')} Kč`;
  const measure = (value, unit = 'm²') => `${Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} ${unit}`;
  const formatDate = (value) => new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

  function toast(message, type = '') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.className = 'toast'; }, 3200);
  }

  function setSaveState(status, error = '') {
    state.saveState = { status, error, at: status === 'saved' ? new Date().toISOString() : state.saveState.at };
    if (!saveStatusEl) return;
    saveStatusEl.className = `save-status ${status}`;
    if (status === 'saving') saveStatusEl.textContent = 'Ukládám…';
    else if (status === 'saved') saveStatusEl.textContent = `Uloženo ${new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}`;
    else if (status === 'error') saveStatusEl.textContent = 'Uložení selhalo';
    else saveStatusEl.textContent = 'Připraveno';
    saveStatusEl.title = error || 'Data se ukládají lokálně do tohoto zařízení.';
  }

  function setUndo(label, apply) {
    state.undo = { label, apply };
    if (undoBtn) { undoBtn.hidden = false; undoBtn.textContent = `Vrátit: ${label}`; }
  }

  async function undoLastChange() {
    const undo = state.undo;
    if (!undo) return;
    state.undo = null;
    if (undoBtn) undoBtn.hidden = true;
    try { await undo.apply(); toast(`Změna „${undo.label}“ byla vrácena.`); }
    catch (error) { console.error(error); toast('Poslední změnu se nepodařilo vrátit.', 'error'); }
  }

  function askValue({ title = 'Zadat hodnotu', label = 'Hodnota', value = '', help = '', inputMode = 'text', pattern = '', required = false, type = 'text', min = '', max = '', step = 'any' } = {}) {
    return new Promise((resolve) => {
      inputDialogTitle.textContent = title;
      inputDialogLabel.firstChild.textContent = label;
      inputDialogValue.value = value;
      inputDialogValue.type = type;
      inputDialogValue.inputMode = inputMode;
      inputDialogValue.pattern = pattern;
      inputDialogValue.min = min;
      inputDialogValue.max = max;
      inputDialogValue.step = step;
      inputDialogValue.required = required;
      inputDialogHelp.textContent = help;
      const onSubmit = (event) => {
        event.preventDefault();
        if (event.submitter?.value === 'cancel') { cleanup(); inputDialog.close('cancel'); resolve(null); return; }
        if (!inputForm.reportValidity()) return;
        const result = inputDialogValue.value;
        cleanup(); inputDialog.close('default'); resolve(result);
      };
      const onCancel = () => { cleanup(); resolve(null); };
      const cleanup = () => { inputForm.removeEventListener('submit', onSubmit); inputDialog.removeEventListener('cancel', onCancel); };
      inputForm.addEventListener('submit', onSubmit);
      inputDialog.addEventListener('cancel', onCancel, { once: true });
      inputDialog.showModal();
      queueMicrotask(() => { inputDialogValue.focus(); inputDialogValue.select(); });
    });
  }

  const formatBytes = (bytes) => {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} kB`;
    if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
    return `${(value / 1024 ** 3).toFixed(2)} GB`;
  };

  async function showStorageDialog() {
    try {
      const [estimate, snapshots, trash] = await Promise.all([DomusDB.estimate(), DomusDB.listSnapshots(), DomusDB.listTrash()]);
      const quotaPercent = estimate.quota ? Math.round(estimate.usage / estimate.quota * 100) : 0;
      storageDialogContent.innerHTML = `
        <div class="storage-overview"><div><small>Využito prohlížečem</small><strong>${formatBytes(estimate.usage)}</strong></div><div><small>Dostupná kvóta</small><strong>${estimate.quota ? formatBytes(estimate.quota) : 'nezjištěna'}</strong></div><div><small>Velikost projektů po načtení</small><strong>${formatBytes(estimate.projectBytes)}</strong></div><div><small>Trvalé úložiště</small><strong>${estimate.persistent ? 'povoleno' : 'není potvrzeno'}</strong></div></div>
        ${estimate.quota ? `<div class="storage-meter"><span style="width:${Math.min(100, quotaPercent)}%"></span></div><p>Využití přibližně ${quotaPercent} % dostupné kvóty.</p>` : ''}
        <div class="storage-actions"><button type="button" class="btn btn-secondary" id="requestPersistenceBtn">Požádat o trvalé úložiště</button><button type="button" class="btn btn-secondary" id="storageExportBtn">Exportovat úplnou zálohu</button>${trash.length ? `<button type="button" class="btn btn-danger" id="emptyTrashBtn">Vysypat koš</button>` : ''}</div>
        <h3>Body obnovy</h3>${snapshots.length ? `<div class="storage-list">${snapshots.map((item) => `<article><div><strong>${escapeHtml(item.label)}</strong><small>${formatDateTime(item.createdAt)} · ${item.projectCount} projektů</small></div><button type="button" class="table-action" data-restore-snapshot="${escapeHtml(item.id)}">Obnovit</button></article>`).join('')}</div>` : '<div class="empty-mini">Zatím není vytvořen žádný bod obnovy.</div>'}
        <h3>Koš projektů</h3>${trash.length ? `<div class="storage-list">${trash.map((entry) => `<article><div><strong>${escapeHtml(entry.project?.name || 'Projekt')}</strong><small>Odstraněno ${formatDateTime(entry.deletedAt)}</small></div><button type="button" class="table-action" data-restore-trash="${escapeHtml(entry.id)}">Obnovit</button></article>`).join('')}</div>` : '<div class="empty-mini">Koš je prázdný.</div>'}
      `;
      storageDialogContent.querySelector('#requestPersistenceBtn')?.addEventListener('click', async () => { const granted = await DomusDB.requestPersistence(); toast(granted ? 'Trvalé úložiště bylo povoleno.' : 'Prohlížeč trvalé úložiště nepovolil.', granted ? '' : 'error'); showStorageDialog(); });
      storageDialogContent.querySelector('#storageExportBtn')?.addEventListener('click', exportBackup);
      storageDialogContent.querySelector('#emptyTrashBtn')?.addEventListener('click', async () => { if (!confirm('Trvale odstranit všechny projekty v koši? Tuto operaci nelze vrátit.')) return; await DomusDB.emptyTrash(); toast('Koš byl vyprázdněn.'); showStorageDialog(); });
      storageDialogContent.querySelectorAll('[data-restore-snapshot]').forEach((button) => button.addEventListener('click', async () => {
        if (!confirm('Obnovit tento bod? Současný stav bude předem zazálohován.')) return;
        await DomusDB.createSnapshot(state.projects, 'Před obnovou staršího bodu');
        const projects = (await DomusDB.restoreSnapshot(button.dataset.restoreSnapshot)).map(ensureProjectV6);
        await DomusDB.replaceProjects(projects);
        state.projects = projects; state.currentProjectId = null; storageDialog.close(); render(); toast('Bod obnovy byl načten.');
      }));
      storageDialogContent.querySelectorAll('[data-restore-trash]').forEach((button) => button.addEventListener('click', async () => { await DomusDB.restoreTrash(button.dataset.restoreTrash); state.projects = (await DomusDB.getAll()).map(ensureProjectV6); storageDialog.close(); render(); toast('Projekt byl obnoven z koše.'); }));
      if (!storageDialog.open) storageDialog.showModal();
    } catch (error) { console.error(error); toast('Informace o úložišti nelze načíst.', 'error'); }
  }

/* Premium product foundation: onboarding, project templates, branding, themes and custom library. */
  const PROJECT_TEMPLATES = [
    { id:'blank',name:'Prázdný projekt',category:'Ostatní',summary:'Začněte bez předvyplněné geometrie.' },
    { id:'bathroom',name:'Rekonstrukce koupelny',category:'Koupelna',summary:'Místnost, sanita, voda, odpady, elektro a materiály.',size:[3,2.4],objects:[['door',.05,.7,.15,.9],['shower-tray',1.65,1.25,1.2,.9],['sink',.5,.35,.6,.48],['floor-drain',2.15,1.65,.15,.15]],materials:[['Dlažba','Materiál','floor','m²'],['Obklad stěn','Materiál','walls','m²']],costs:[['Bourací a přípravné práce','Práce'],['Montáž sanity','Práce']]},
    { id:'room',name:'Rekonstrukce místnosti',category:'Interiér',summary:'Půdorys, dveře, okna, povrchy, elektro a vybavení.',size:[4.5,3.6],objects:[['door',.05,1.3,.15,.9],['window',1.6,.03,1.4,.18],['socket',3.7,2.8,.09,.09]],materials:[['Podlahová krytina','Materiál','floor','m²'],['Výmalba','Materiál','walls','m²']],costs:[['Příprava podkladu','Práce'],['Dokončovací práce','Práce']]},
    { id:'flooring',name:'Pokládka podlahy',category:'Podlahy',summary:'Plocha, skladba, materiál, prořez a práce.',size:[5,4],objects:[],materials:[['Podlahová krytina','Materiál','floor','m²'],['Podložka / lepidlo','Materiál','floor','m²']],costs:[['Příprava podkladu','Práce'],['Pokládka','Práce']]},
    { id:'terrace',name:'Terasa',category:'Přístřešek a konstrukce',summary:'Povrch, nosný rošt, odvodnění, osvětlení a rozpočet.',size:[6,4],objects:[['floor-drain',2.9,1.9,.15,.15],['light',.5,.5,.3,.3]],materials:[['Terasový povrch','Materiál','floor','m²'],['Nosný rošt','Materiál','floor','m²']],costs:[['Zemní práce','Práce'],['Montáž terasy','Práce']]},
    { id:'garden',name:'Zahrada a závlaha',category:'Zahrada',summary:'Trávník, trasy potrubí, postřikovače a ventilové šachty.',size:[12,8],objects:[['sprinkler',1,1,.16,.16],['sprinkler',10.7,1,.16,.16],['sprinkler',1,6.7,.16,.16],['sprinkler',10.7,6.7,.16,.16],['valve-box',5.7,.35,.5,.4]],materials:[['Závlahové potrubí','Materiál','manual','bm'],['Postřikovače','Výrobek','manual','ks']],costs:[['Výkop a zásyp','Práce'],['Montáž a zprovoznění','Práce']]},
    { id:'pool',name:'Bazén',category:'Zahrada',summary:'Bazénová vana, okolní plocha, technologie a stavební připravenost.',size:[9,6],objects:[['floor-drain',7.8,4.7,.15,.15],['light',1,1,.3,.3]],materials:[['Bazénová vana','Výrobek','manual','ks'],['Okolní dlažba','Materiál','floor','m²']],costs:[['Zemní práce a základová deska','Práce'],['Montáž technologie','Práce']]},
  ];
  function loadJsonStorage(key,fallback){try{const v=JSON.parse(safeStorageGet(key));return v&&typeof v==='object'?v:fallback;}catch{return fallback;}}
  function saveJsonStorage(key,value){safeStorageSet(key,JSON.stringify(value));}
  function premiumPreferences(){return{theme:'dark',density:'comfortable',reduceMotion:false,...loadJsonStorage('domusUiPreferences',{})};}
  function premiumBranding(){return{company:'',author:'',email:'',phone:'',logoDataUrl:'',footer:'Dokument vytvořen v DOMUS Studio.',...loadJsonStorage('domusBranding',{})};}
  function applyPremiumPreferences(){const p=state.uiPreferences||premiumPreferences();state.uiPreferences=p;const theme=p.theme==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p.theme;document.documentElement.dataset.theme=theme;document.documentElement.dataset.density=p.density;document.documentElement.dataset.reduceMotion=p.reduceMotion?'true':'false';}
  function customElementLibrary(){const v=loadJsonStorage('domusCustomElements',[]);return Array.isArray(v)?v:[];}
  function allElementLibrary(){return[...ELEMENT_LIBRARY,...customElementLibrary()];}
  function templateById(id){return PROJECT_TEMPLATES.find(x=>x.id===id)||PROJECT_TEMPLATES[0];}
  function rectangleWalls(widthM,depthM,scale){const ox=120,oy=110,w=widthM*scale,d=depthM*scale,now=new Date().toISOString();return[{id:uid('wall'),x1:ox,y1:oy,x2:ox+w,y2:oy,updatedAt:now},{id:uid('wall'),x1:ox+w,y1:oy,x2:ox+w,y2:oy+d,updatedAt:now},{id:uid('wall'),x1:ox+w,y1:oy+d,x2:ox,y2:oy+d,updatedAt:now},{id:uid('wall'),x1:ox,y1:oy+d,x2:ox,y2:oy,updatedAt:now}];}
  function applyProjectTemplate(project,templateId){const t=templateById(templateId),v=project.variants[0],scale=v.plan.scale;project.category=t.category||project.category;project.summary||=t.summary;project.templateId=t.id;if(!t.size)return project;v.plan.walls=rectangleWalls(t.size[0],t.size[1],scale);v.plan.objects=(t.objects||[]).map(([key,x,y,w,d])=>{const def=allElementLibrary().find(i=>i.key===key)||ELEMENT_LIBRARY[0];return{id:uid('object'),type:def.name,libraryKey:def.key,layer:def.layer,shape:def.shape,x:120+x*scale,y:110+y*scale,width:w*scale,depth:d*scale,height:def.height,color:def.color,note:'',materialId:'',hingeSide:key==='door'?'left':'',opensTo:key==='door'?'inside':'',rotation:0,updatedAt:new Date().toISOString()};});v.materials=(t.materials||[]).map(([name,category,calculation,unit])=>({id:uid('material'),name,category,manufacturer:'',sku:'',url:'',width:0,depth:0,height:0,calculation,unit,quantity:1,coverage:1,wastePercent:calculation==='manual'?0:10,unitPrice:0,color:'',swatch:'#c7b28e',note:'Doplňte konkrétní výrobek a cenu.',updatedAt:new Date().toISOString()}));v.costs.lines=(t.costs||[]).map(([name,category])=>({id:uid('cost'),name,category,quantity:1,unit:'paušál',unitPrice:0,note:'Doplňte rozsah a cenu.',updatedAt:new Date().toISOString()}));return project;}
  function renderTemplateCards(){return PROJECT_TEMPLATES.map(t=>`<button type="button" class="template-card" data-template-choice="${t.id}"><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.summary)}</span></button>`).join('');}
  function showOnboardingIfNeeded(force=false){const d=document.getElementById('onboardingDialog');if(!d||(!force&&safeStorageGet('domusOnboardingV7')==='done'))return;document.getElementById('onboardingTemplateCards').innerHTML=renderTemplateCards();d.showModal();}
  function finishOnboarding(){safeStorageSet('domusOnboardingV7','done');document.getElementById('onboardingDialog')?.close();}
  function openSettingsDialog(){const d=document.getElementById('settingsDialog'),f=document.getElementById('settingsForm');if(!d||!f)return;const p=state.uiPreferences||premiumPreferences(),b=state.branding||premiumBranding();f.elements.theme.value=p.theme;f.elements.density.value=p.density;f.elements.reduceMotion.checked=p.reduceMotion;['company','author','email','phone','footer'].forEach(k=>{if(f.elements[k])f.elements[k].value=b[k]||'';});const preview=document.getElementById('brandingLogoPreview');if(preview)preview.innerHTML=b.logoDataUrl?`<img src="${b.logoDataUrl}" alt="Náhled loga">`:'<small>Logo zatím není nastaveno.</small>';d.showModal();}
  function savePremiumSettings(form){const prefs={theme:form.elements.theme.value,density:form.elements.density.value,reduceMotion:form.elements.reduceMotion.checked};const branding={company:form.elements.company.value.trim(),author:form.elements.author.value.trim(),email:form.elements.email.value.trim(),phone:form.elements.phone.value.trim(),footer:form.elements.footer.value.trim()||'Dokument vytvořen v DOMUS Studio.',logoDataUrl:state.branding?.logoDataUrl||''};state.uiPreferences=prefs;state.branding=branding;saveJsonStorage('domusUiPreferences',prefs);saveJsonStorage('domusBranding',branding);applyPremiumPreferences();}
  function premiumBootstrap(){state.uiPreferences=premiumPreferences();state.branding=premiumBranding();state.selectedPlanIds=new Set();state.redoPlanHistory=[];state.planSnap={grid:true,endpoints:true,orthogonal:true,gridMm:100,...loadJsonStorage('domusPlanSnap',{})};state.librarySearch='';state.libraryCategory='all';state.reportRevision=1;state.projectPerformance={};state.threeD={cameraMode:'perspective',cutaway:1,shadows:true,ceiling:false,labels:false,...state.threeD};applyPremiumPreferences();queueMicrotask(()=>showOnboardingIfNeeded(false));if(typeof scheduleDesktopUpdateCheck==='function')scheduleDesktopUpdateCheck();}
  function renderLibraryTab(){const query=String(state.librarySearch||'').toLowerCase(),category=state.libraryCategory||'all';const items=allElementLibrary().filter(i=>(category==='all'||i.layer===category)&&(!query||`${i.name} ${i.key} ${LAYERS[i.layer]?.label||''}`.toLowerCase().includes(query)));return`<div class="panel"><div class="panel-head"><div><p class="eyebrow">Parametrická knihovna</p><h2>Objekty, instalace a vlastní šablony</h2><p>Prvky lze vložit do výkresu, upravit a uložit jako vlastní šablonu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="open-plan-from-library">Otevřít 2D výkres</button></div></div><div class="panel-body"><div class="list-filter"><label>Hledat<input id="librarySearch" value="${escapeHtml(state.librarySearch)}"></label><label>Kategorie<select id="libraryCategory"><option value="all">Všechny vrstvy</option>${Object.entries(LAYERS).map(([k,l])=>`<option value="${k}" ${category===k?'selected':''}>${escapeHtml(l.label)}</option>`).join('')}</select></label><span>${items.length} prvků</span></div><div class="premium-library-grid">${items.map(i=>`<article class="library-card"><div class="library-symbol" style="--symbol:${i.color}"><span>${escapeHtml(LAYERS[i.layer]?.short||'PR')}</span></div><div><strong>${escapeHtml(i.name)}</strong><small>${escapeHtml(LAYERS[i.layer]?.label||i.layer)} · ${i.width} × ${i.depth} mm</small></div><button class="btn btn-primary" data-action="insert-library-item" data-id="${i.key}">Vložit</button>${i.custom?`<button class="table-action danger" data-action="remove-custom-library" data-id="${i.key}">Odstranit</button>`:''}</article>`).join('')}</div></div></div>`;}

  function scheduleProjectPerformance(project){if(!project)return;const cached=state.projectPerformance?.[project.id];if(cached?.updatedAt===project.updatedAt)return;DomusPerformance.idle(()=>DomusPerformance.analyze(project).then(result=>{state.projectPerformance[project.id]={...result,updatedAt:project.updatedAt};if(currentProject()?.id===project.id&&state.currentTab==='overview')render();}).catch(()=>{}));}

/* Project factories, migration and persistence orchestration. Source fragment; assembled by scripts/build.mjs. */
  function defaultLayerVisibility() {
    return Object.fromEntries(Object.keys(LAYERS).map((key) => [key, true]));
  }

  function blankFieldSession(name = 'První zaměření') {
    const now = new Date().toISOString();
    return {
      id: uid('field'), name, status: 'Rozpracováno', createdAt: now, updatedAt: now,
      notes: '', device: navigator.userAgent.includes('Mobile') ? 'Telefon' : 'Notebook',
      location: null, measurements: [], photos: [], scans: [],
    };
  }

  function blankVariant(name = 'Varianta A · základní návrh') {
    const fieldSession = blankFieldSession();
    return {
      id: uid('variant'),
      name,
      createdAt: new Date().toISOString(),
      photo: { dataUrl: null, annotations: [], calibration: null },
      plan: { scale: 50, wallHeight: 2.6, wallThickness: 0.15, walls: [], objects: [], layerVisibility: defaultLayerVisibility(), layerLocks: {}, showDimensions: true },
      materials: [],
      costs: { lines: [], contingencyPercent: 10, vatPercent: 0 },
      section: { name: 'Řez A–A', orientation: 'x', position: 50, showDimensions: true },
      assemblies: deepClone(DEFAULT_ASSEMBLIES),
      comparison: { beforeDataUrl: null, afterDataUrl: null, slider: 50, beforeLabel: 'Původní stav', afterLabel: 'Navrhovaný stav', notes: '' },
      appearance: { wallMaterialId: '', floorMaterialId: '', ceilingMaterialId: '' },
      metricsOverrides: { floorArea: '', wallArea: '' },
      field: { sessions: [fieldSession], activeSessionId: fieldSession.id, sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } },
      presentation: { cameraX: null, cameraY: null, yaw: 0, pitch: 0, fov: 72, showObjects: true, showLabels: true },
      ai: {
        photoSet: [], activePhotoId: '',
        analysis: null, localAnalysis: null,
        proposedPlan: { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: 2.6 },
        variantIdeas: [], lastSource: '', lastRunAt: '',
      },
      audit: { overrides: {}, manualChecks: [], lastRunAt: '' },
      rfq: { mode: 'technical', title: '', recipient: '', contact: '', deadline: '', scope: '', exclusions: '', questions: '', responseInstructions: '', includePhotos: true, includePrices: false, anonymizeLocation: true, removeGps: true, revision: 0, lastExportAt: '', lastExportHash: '', exportedVariantId: '', projectUpdatedAt: '' },
      diary: { entries: [], warranties: [], passport: [] },
      notes: '',
    };
  }

  function createProject(data) {
    const variant = blankVariant();
    const project = ensureProjectV6({
      id: uid('project'),
      schemaVersion: 7,
      name: data.name,
      category: data.category || 'Ostatní',
      status: data.status || 'Nápad',
      location: data.location || '',
      summary: data.summary || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeVariantId: variant.id,
      variants: [variant],
      survey: { photo: variant.photo, field: variant.field },
      lifecycle: variant.diary,
      reportRevision: 1, reportRevisionLabel: 'R1', templateId: data.template || 'blank',
    });
    return applyProjectTemplate(project, data.template || 'blank');
  }

  function inferLayer(type = '') {
    const value = String(type).toLowerCase();
    if (/voda|umyvad|ventil/.test(value)) return 'water';
    if (/odpad|vpusť|kanal|šacht/.test(value)) return 'sewer';
    if (/zásuv|svět|rozvad|elektr/.test(value)) return 'electricity';
    if (/radiátor|topen|kotel/.test(value)) return 'heating';
    if (/klimat|rekuper|vzduch/.test(value)) return 'ventilation';
    if (/postřik|závlah|trávník/.test(value)) return 'garden';
    return 'architecture';
  }

  function ensureProjectV6(project) {
    project.schemaVersion = 7;
    project.reportRevision = Math.max(1, parseNum(project.reportRevision, 1));
    project.reportRevisionLabel ||= `R${project.reportRevision}`;
    project.variants = Array.isArray(project.variants) && project.variants.length ? project.variants : [blankVariant()];
    const firstVariant = project.variants[0];
    project.survey ||= {
      photo: firstVariant.photo || { dataUrl: null, annotations: [], calibration: null },
      field: firstVariant.field || { sessions: [blankFieldSession()], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } },
    };
    project.survey.photo ||= { dataUrl: null, annotations: [], calibration: null };
    project.survey.field ||= { sessions: [blankFieldSession()], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } };
    project.lifecycle ||= firstVariant.diary || { entries: [], warranties: [], passport: [] };
    project.lifecycle.entries = Array.isArray(project.lifecycle.entries) ? project.lifecycle.entries : [];
    project.lifecycle.warranties = Array.isArray(project.lifecycle.warranties) ? project.lifecycle.warranties : [];
    project.lifecycle.passport = Array.isArray(project.lifecycle.passport) ? project.lifecycle.passport : [];
    project.variants.forEach((variant) => {
      const legacyPhoto = variant.photo; const legacyField = variant.field; const legacyDiary = variant.diary;
      if (!project.survey.photo && legacyPhoto) project.survey.photo = legacyPhoto;
      if (!project.survey.field && legacyField) project.survey.field = legacyField;
      if (!project.lifecycle && legacyDiary) project.lifecycle = legacyDiary;
      try { delete variant.photo; delete variant.field; delete variant.diary; } catch { }
      Object.defineProperty(variant, 'photo', { configurable: true, enumerable: false, get: () => project.survey.photo, set: (value) => { project.survey.photo = value; } });
      Object.defineProperty(variant, 'field', { configurable: true, enumerable: false, get: () => project.survey.field, set: (value) => { project.survey.field = value; } });
      Object.defineProperty(variant, 'diary', { configurable: true, enumerable: false, get: () => project.lifecycle, set: (value) => { project.lifecycle = value; } });
      variant.photo ||= { dataUrl: null, annotations: [], calibration: null };
      variant.photo.annotations ||= [];
      variant.plan ||= { scale: 50, wallHeight: 2.6, wallThickness: 0.15, walls: [], objects: [] };
      variant.plan.scale = Number(variant.plan.scale || 50);
      variant.plan.wallHeight = Number(variant.plan.wallHeight || 2.6);
      variant.plan.wallThickness = Number(variant.plan.wallThickness || 0.15);
      variant.plan.walls ||= [];
      variant.plan.objects ||= [];
      variant.plan.layerVisibility = { ...defaultLayerVisibility(), ...(variant.plan.layerVisibility || {}) };
      variant.plan.layerLocks = { ...(variant.plan.layerLocks || {}) };
      variant.plan.showDimensions = variant.plan.showDimensions !== false;
      variant.plan.objects.forEach((object) => {
        object.layer ||= inferLayer(object.type);
        object.shape ||= ELEMENT_LIBRARY.find((item) => item.name === object.type)?.shape || 'box';
        object.libraryKey ||= ELEMENT_LIBRARY.find((item) => item.name === object.type)?.key || '';
        object.note ||= '';
        object.materialId ||= '';
        object.rotation = parseNum(object.rotation, 0);
        object.updatedAt ||= project.updatedAt || new Date().toISOString();
      });
      variant.materials ||= [];
      variant.materials.forEach((item, index) => {
        item.manufacturer ||= '';
        item.sku ||= '';
        item.unit ||= 'ks';
        item.quantity = parseNum(item.quantity, 1);
        item.unitPrice = parseNum(item.unitPrice, parseNum(item.price, 0));
        item.calculation ||= 'manual';
        item.coverage = parseNum(item.coverage, 1);
        item.wastePercent = parseNum(item.wastePercent, item.calculation === 'manual' ? 0 : 10);
        item.swatch ||= ['#e4e2dc','#8a7760','#6e8291','#a79a85','#9aafa5','#b18268','#6d7075'][index % 7];
        item.updatedAt ||= project.updatedAt || new Date().toISOString();
        delete item.price;
      });
      variant.costs ||= { lines: [], contingencyPercent: 10, vatPercent: 0 };
      variant.costs.lines ||= [];
      variant.costs.lines.forEach((item) => { item.updatedAt ||= project.updatedAt || new Date().toISOString(); });
      variant.costs.contingencyPercent = parseNum(variant.costs.contingencyPercent, 10);
      variant.costs.vatPercent = parseNum(variant.costs.vatPercent, 0);
      variant.section = { name: 'Řez A–A', orientation: 'x', position: 50, showDimensions: true, ...(variant.section || {}) };
      variant.assemblies ||= deepClone(DEFAULT_ASSEMBLIES);
      ['floor','wall','ceiling'].forEach((type) => { variant.assemblies[type] ||= deepClone(DEFAULT_ASSEMBLIES[type]); });
      variant.comparison = { beforeDataUrl: null, afterDataUrl: null, slider: 50, beforeLabel: 'Původní stav', afterLabel: 'Navrhovaný stav', notes: '', ...(variant.comparison || {}) };
      variant.appearance = { wallMaterialId: '', floorMaterialId: '', ceilingMaterialId: '', ...(variant.appearance || {}) };
      variant.metricsOverrides = { floorArea: '', wallArea: '', ...(variant.metricsOverrides || {}) };
      variant.ai = {
        photoSet: [], activePhotoId: '', analysis: null, localAnalysis: null,
        proposedPlan: { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: variant.plan.wallHeight || 2.6 },
        variantIdeas: [], lastSource: '', lastRunAt: '', ...(variant.ai || {})
      };
      variant.ai.photoSet = Array.isArray(variant.ai.photoSet) ? variant.ai.photoSet : [];
      variant.ai.photoSet.forEach((photo, index) => { photo.id ||= uid('roomphoto'); photo.name ||= `Snímek ${index + 1}`; photo.view ||= 'detail'; photo.note ||= ''; });
      if (!variant.ai.activePhotoId || !variant.ai.photoSet.some((photo) => photo.id === variant.ai.activePhotoId)) variant.ai.activePhotoId = variant.ai.photoSet[0]?.id || '';
      variant.ai.proposedPlan = { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: variant.plan.wallHeight || 2.6, ...(variant.ai.proposedPlan || {}) };
      variant.field ||= { sessions: [], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } };
      variant.field.sessions = Array.isArray(variant.field.sessions) ? variant.field.sessions : [];
      if (!variant.field.sessions.length) variant.field.sessions.push(blankFieldSession());
      variant.field.sessions.forEach((session, index) => {
        session.id ||= uid('field'); session.name ||= `Zaměření ${index + 1}`; session.status ||= 'Rozpracováno';
        session.createdAt ||= new Date().toISOString(); session.updatedAt ||= session.createdAt; session.notes ||= '';
        session.device ||= 'Neurčené zařízení'; session.location ||= null;
        session.measurements = Array.isArray(session.measurements) ? session.measurements : [];
        session.photos = Array.isArray(session.photos) ? session.photos : [];
        session.scans = Array.isArray(session.scans) ? session.scans : [];
      });
      if (!variant.field.activeSessionId || !variant.field.sessions.some((item) => item.id === variant.field.activeSessionId)) variant.field.activeSessionId = variant.field.sessions[0].id;
      variant.field.sync = { autoSync: false, lastPushAt: '', lastPullAt: '', ...(variant.field.sync || {}) };
      variant.presentation = { cameraX: null, cameraY: null, yaw: 0, pitch: 0, fov: 72, showObjects: true, showLabels: true, ...(variant.presentation || {}) };
      variant.audit = { overrides: {}, manualChecks: [], lastRunAt: '', ...(variant.audit || {}) };
      variant.audit.overrides ||= {}; variant.audit.manualChecks = Array.isArray(variant.audit.manualChecks) ? variant.audit.manualChecks : [];
      variant.rfq = { mode: 'technical', title: '', recipient: '', contact: '', deadline: '', scope: '', exclusions: '', questions: '', responseInstructions: '', includePhotos: true, includePrices: false, anonymizeLocation: true, removeGps: true, lastExportAt: '', ...(variant.rfq || {}) };
      variant.diary = { entries: [], warranties: [], passport: [], ...(variant.diary || {}) };
      variant.diary.entries = Array.isArray(variant.diary.entries) ? variant.diary.entries : [];
      variant.diary.warranties = Array.isArray(variant.diary.warranties) ? variant.diary.warranties : [];
      variant.diary.passport = Array.isArray(variant.diary.passport) ? variant.diary.passport : [];
      variant.diary.entries.forEach((entry) => { entry.photos = Array.isArray(entry.photos) ? entry.photos : []; entry.documents = Array.isArray(entry.documents) ? entry.documents : []; entry.plannedCost = parseNum(entry.plannedCost); entry.actualCost = parseNum(entry.actualCost); });
      variant.diary.warranties.forEach((item) => { item.documents = Array.isArray(item.documents) ? item.documents : []; item.warrantyMonths = parseNum(item.warrantyMonths, 24); });
      variant.field.sessions.forEach((session) => session.measurements.forEach((item) => { item.source ||= item.verified ? 'measured' : 'estimate'; item.confidence = parseNum(item.confidence, item.verified ? 100 : 40); }));
      variant.notes ||= '';
    });
    if (!project.activeVariantId || !project.variants.some((variant) => variant.id === project.activeVariantId)) project.activeVariantId = project.variants[0].id;
    return project;
  }

  function seedProject() {
    const project = createProject({
      name: 'Sprchový kout · pilotní projekt',
      category: 'Koupelna',
      status: 'Rozpracováno',
      location: 'Bravantice · přízemí',
      summary: 'Referenční projekt pro ověření fotografií, asistované analýzy, návrhu půdorysu, variant, vrstev instalací, rozpočtu, 3D materiálů a dokumentace pro dodavatele.',
    });
    const variant = project.variants[0];
    variant.plan.scale = 100;
    variant.plan.walls = [
      { id: uid('wall'), x1: 380, y1: 210, x2: 680, y2: 210 },
      { id: uid('wall'), x1: 680, y1: 210, x2: 680, y2: 450 },
      { id: uid('wall'), x1: 680, y1: 450, x2: 380, y2: 450 },
      { id: uid('wall'), x1: 380, y1: 450, x2: 380, y2: 210 },
    ];
    variant.plan.objects = [
      { id: uid('object'), type: 'Sprchová vanička', libraryKey: 'shower-tray', layer: 'architecture', shape: 'box', x: 540, y: 345, width: 120, depth: 90, height: 12, color: '#d6d6d0', note: '', materialId: '' },
      { id: uid('object'), type: 'Dveře', libraryKey: 'door', layer: 'architecture', shape: 'door', x: 372, y: 265, width: 15, depth: 90, height: 205, color: '#9b774d', note: '', materialId: '' },
      { id: uid('object'), type: 'Podlahová vpusť', libraryKey: 'floor-drain', layer: 'sewer', shape: 'circle', x: 600, y: 382, width: 15, depth: 15, height: 8, color: '#8a5aa8', note: 'Polohu přesně doměřit.', materialId: '' },
      { id: uid('object'), type: 'Vodovodní potrubí', libraryKey: 'water-pipe', layer: 'water', shape: 'line', x: 430, y: 258, width: 200, depth: 4, height: 10, color: '#55a9cf', note: '', materialId: '' },
    ];
    variant.materials.push(
      { id: uid('material'), name: 'Sprchová vanička 1200 × 900 mm', category: 'Výrobek', manufacturer: '', sku: '', url: '', width: 1200, depth: 900, height: 40, unit: 'ks', quantity: 1, unitPrice: 8500, calculation: 'manual', coverage: 1, wastePercent: 0, color: 'Bílá, matná', swatch: '#e4e2dc', note: 'Ukázková položka. Nahraďte ji konkrétním výrobkem z odkazu.' },
      { id: uid('material'), name: 'Dlažba 60 × 60 cm', category: 'Materiál', manufacturer: '', sku: '', url: '', width: 600, depth: 600, height: 10, unit: 'balení', quantity: 1, unitPrice: 799, calculation: 'floor', coverage: 1.44, wastePercent: 10, color: 'Šedá, matná', swatch: '#777b7d', note: 'Množství se dopočítává z plochy podlahy.' },
      { id: uid('material'), name: 'Obklad stěn', category: 'Materiál', manufacturer: '', sku: '', url: '', width: 600, depth: 300, height: 9, unit: 'balení', quantity: 1, unitPrice: 899, calculation: 'walls', coverage: 1.26, wastePercent: 12, color: 'Světlý kámen', swatch: '#c8b08a', note: 'Výpočet z čisté plochy stěn po odečtení otvorů.' }
    );
    variant.costs.lines = [
      { id: uid('cost'), name: 'Montáž sprchového koutu', category: 'Práce', quantity: 1, unit: 'paušál', unitPrice: 8500, note: 'Orientační položka.' },
      { id: uid('cost'), name: 'Doprava materiálu', category: 'Doprava', quantity: 1, unit: 'paušál', unitPrice: 1500, note: '' },
    ];
    variant.appearance.floorMaterialId = variant.materials[1].id;
    variant.appearance.wallMaterialId = variant.materials[2].id;
    variant.ai.proposedPlan = { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: 2.6 };
    variant.ai.variantIdeas = buildLocalVariantIdeas(project, variant);
    variant.notes = 'Doměřit přesnou polohu odpadu a výšku napojení. Ověřit skladbu podlahy před objednávkou vaničky.';
    const field = currentFieldSession(variant);
    field.name = 'První zaměření sprchového koutu';
    field.measurements = [
      { id: uid('measure'), label: 'šířka prostoru', value: '1640', unit: 'mm', category: 'Rozměr', verified: true, source: 'measured', confidence: 100, note: '', createdAt: new Date().toISOString() },
      { id: uid('measure'), label: 'výška vývodu vody', value: '1100', unit: 'mm', category: 'Výška', verified: false, source: 'estimate', confidence: 40, note: 'Před montáží znovu ověřit.', createdAt: new Date().toISOString() },
    ];
    variant.rfq.scope = 'Dodání a montáž sprchového koutu podle přiloženého půdorysu, ověření napojení vody a odpadu a utěsnění všech kritických detailů.';
    variant.rfq.questions = 'Je navržená vanička kompatibilní se skutečnou polohou odpadu?\nJaké stavební úpravy a hydroizolační vrstvy budou nutné?\nJaká je délka záruky na montáž a těsnost?';
    variant.diary.entries.push({id:uid('diary'),date:new Date().toISOString().slice(0,10),type:'Příprava',title:'Založení realizačního deníku',contractor:'',status:'Rozpracováno',plannedCost:0,actualCost:0,note:'Před zakrytím vody, odpadu a elektroinstalace pořídit fotografie s měřítkem.',photos:[],documents:[],createdAt:new Date().toISOString()});
    return project;
  }

  function currentProject() {
    return state.projects.find((item) => item.id === state.currentProjectId) || null;
  }

  function currentVariant(project = currentProject()) {
    if (!project) return null;
    return project.variants.find((item) => item.id === project.activeVariantId) || project.variants[0];
  }

  async function checkStoragePressure(force = false) {
    const now = Date.now();
    if (!force && now - state.storageLastCheck < 5 * 60 * 1000) return;
    state.storageLastCheck = now;
    try {
      const estimate = await DomusDB.estimate();
      if (estimate.quota && estimate.usage / estimate.quota >= 0.8) toast('Úložiště je zaplněno z více než 80 %. Vytvořte zálohu a zkontrolujte koš.', 'error');
    } catch (error) { console.warn('Kontrola kapacity:', error); }
  }

  async function saveProject(project, quiet = true, skipAutoSync = false) {
    if (!project) return;
    setSaveState('saving');
    try {
      ensureProjectV6(project);
      project.updatedAt = new Date().toISOString();
      await DomusDB.put(project, { skipSnapshot: true });
      setSaveState('saved');
      checkStoragePressure();
      if (!quiet) toast('Projekt byl uložen do zařízení.');
      const variant = currentVariant(project);
      if (!skipAutoSync && variant?.field?.sync?.autoSync && state.syncStatus.enabled && state.syncStatus.paired) setTimeout(() => pushCurrentProjectToSync(true), 120);
    } catch (error) {
      setSaveState('error', error.message || 'Neznámá chyba ukládání');
      throw error;
    }
  }

/* Initialization, dashboard, workspace and shared calculations. Source fragment; assembled by scripts/build.mjs. */
  async function init() {
    try {
      premiumBootstrap();
      state.projects = (await DomusDB.getAll()).map((project, index) => ensureProjectV6(DomusCore.secureProject(project, index)));
      state.projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      if (!state.projects.length) {
        const pilot = seedProject();
        state.projects = [pilot];
        await DomusDB.put(pilot, { skipSnapshot: true });
      } else {
        for (const project of state.projects) await DomusDB.put(project, { skipSnapshot: true });
      }
      const todayKey = new Date().toISOString().slice(0, 10);
      if (safeStorageGet('domusLastDailySnapshot') !== todayKey) {
        try { await DomusDB.createSnapshot(state.projects, 'Automatický denní bod obnovy'); safeStorageSet('domusLastDailySnapshot', todayKey); }
        catch (snapshotError) { console.warn('Automatický bod obnovy:', snapshotError); }
      }
      bindGlobalEvents();
      DomusDiagnostics.mount({
        getProjects: () => state.projects,
        getCurrentProject: currentProject,
        getState: () => state,
        normalizeProject: (project) => ensureProjectV6(DomusCore.secureProject(project)),
        computeMetrics: computeProjectMetrics,
        budgetTotal: (variant) => budgetSummary(variant).total,
        toast,
      });
      setSaveState('ready');
      render();
    } catch (error) {
      console.error(error);
      app.innerHTML = `<div class="dashboard"><div class="empty-state"><strong>Nepodařilo se otevřít lokální úložiště</strong><p>${escapeHtml(error.message || 'Neznámá chyba')}</p></div></div>`;
    }
  }

  function render() {
    if (state.currentTab !== 'model' && state.threeRuntime) disposeThreeRuntime();
    const project = currentProject();
    projectCrumb.innerHTML = project ? `<strong>${escapeHtml(project.name)}</strong> &nbsp;/&nbsp; ${escapeHtml(currentVariant(project)?.name || '')}` : 'Lokální projektové centrum';
    document.getElementById('exportBtn').disabled = !state.projects.length;
    app.innerHTML = project ? renderWorkspace(project) : renderDashboard();
    bindRenderedEvents();
    if(project) scheduleProjectPerformance(project);
    queueMicrotask(setupActiveView);
  }

  function renderDashboard() {
    const filtered = state.projects.filter((project) => {
      const haystack = `${project.name} ${project.category} ${project.location} ${project.status}`.toLowerCase();
      return haystack.includes(state.search.toLowerCase());
    });
    const totalVariants = state.projects.reduce((sum, project) => sum + project.variants.length, 0);
    const activeCount = state.projects.filter((project) => !['Dokončeno'].includes(project.status)).length;
    return `
      <section class="dashboard app-shell">
        <div class="dashboard-hero">
          <div>
            <p class="eyebrow">DOMUS Studio Premium</p>
            <h1>Od reálného stavu k přesnému záměru.</h1>
            <p class="lead">Od zaměření přes Precision 2D a RealSpace 3D až po profesionální report, poptávku, realizaci a technický pas.</p>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>${state.projects.length}</strong><span>projektů</span></div>
            <div class="stat"><strong>${activeCount}</strong><span>aktivních</span></div>
            <div class="stat"><strong>${totalVariants}</strong><span>variant</span></div>
          </div>
        </div>
        <div class="toolbar-row">
          <div class="search-wrap"><input id="projectSearch" value="${escapeHtml(state.search)}" placeholder="Hledat projekt, kategorii nebo umístění…" /></div>
          <div class="toolbar-actions"><button class="btn btn-ghost" data-action="open-onboarding">Průvodce</button><button class="btn btn-secondary" data-action="sync-import-projects">Načíst projekty z notebooku</button><button class="btn btn-primary" data-action="new-project">+ Založit nový projekt</button></div>
        </div>
        <div class="project-grid">
          ${filtered.length ? filtered.map(renderProjectCard).join('') : `
            <div class="empty-state">
              <strong>Žádný projekt neodpovídá hledání</strong>
              <p>Změňte hledaný výraz nebo založte nový projekt.</p>
            </div>`}
        </div>
      </section>`;
  }

  function renderProjectCard(project) {
    const variant = currentVariant(project);
    const cover = variant?.photo?.dataUrl;
    return `
      <article class="project-card">
        <div class="project-cover">
          ${cover ? `<img src="${cover}" alt="" />` : `<div class="project-cover-placeholder">D</div>`}
          <span class="status-pill">${escapeHtml(project.status)}</span>
        </div>
        <div class="card-actions">
          <button data-action="delete-project" data-id="${project.id}" title="Odstranit projekt">×</button>
        </div>
        <div class="card-body">
          <p class="eyebrow">${escapeHtml(project.category)}</p>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.summary || 'Bez popisu projektu.')}</p>
          <div class="card-meta"><span>${escapeHtml(project.location || 'Umístění neuvedeno')}</span><span>${project.variants.length} var.</span></div>
        </div>
        <button class="card-open" data-action="open-project" data-id="${project.id}" aria-label="Otevřít projekt ${escapeHtml(project.name)}"></button>
      </article>`;
  }

  function orderedPlanPolygon(plan) {
    return DomusAudit.orderedPolygon(plan);
  }

  function polygonArea(points) {
    if (!points?.length) return 0;
    let sum = 0;
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      sum += point[0] * next[1] - next[0] * point[1];
    });
    return Math.abs(sum) / 2;
  }

  function planGeometryBounds(plan) {
    const points = [];
    (plan.walls || []).forEach((wall) => points.push([wall.x1, wall.y1], [wall.x2, wall.y2]));
    (plan.objects || []).forEach((object) => points.push([object.x, object.y], [object.x + object.width, object.y + object.depth]));
    return points.length ? computeBounds(points) : null;
  }

  function transformPlanGeometry(plan, ratio, centerX, centerY, targetCenterX = centerX, targetCenterY = centerY) {
    const point = (x, y) => ({ x: targetCenterX + (x - centerX) * ratio, y: targetCenterY + (y - centerY) * ratio });
    plan.walls.forEach((wall) => {
      const a = point(wall.x1, wall.y1); const b = point(wall.x2, wall.y2);
      wall.x1 = a.x; wall.y1 = a.y; wall.x2 = b.x; wall.y2 = b.y;
    });
    plan.objects.forEach((object) => {
      const p = point(object.x, object.y); object.x = p.x; object.y = p.y; object.width *= ratio; object.depth *= ratio;
    });
  }

  function rescalePlan(plan, newScale) {
    const oldScale = Math.max(1, parseNum(plan.scale, 50));
    const targetScale = clamp(parseNum(newScale, oldScale), 20, 160);
    if (Math.abs(targetScale - oldScale) < 0.001) return;
    const bounds = planGeometryBounds(plan);
    if (bounds) transformPlanGeometry(plan, targetScale / oldScale, bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2);
    plan.scale = targetScale;
  }

  function fitPlanToCanvas(plan, width = 1100, height = 700) {
    const bounds = planGeometryBounds(plan);
    if (!bounds) return;
    const physicalWidth = Math.max(0.2, bounds.width / plan.scale);
    const physicalHeight = Math.max(0.2, bounds.height / plan.scale);
    const targetScale = clamp(Math.floor(Math.min((width - 240) / physicalWidth, (height - 190) / physicalHeight) / 10) * 10, 20, 140);
    const ratio = targetScale / plan.scale;
    transformPlanGeometry(plan, ratio, bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2, width / 2, height / 2);
    plan.scale = targetScale;
  }

  function computeProjectMetrics(variant) {
    const plan = variant.plan;
    const polygon = orderedPlanPolygon(plan);
    const computedFloorArea = polygon ? polygonArea(polygon) / (plan.scale * plan.scale) : 0;
    const floorArea = parseNum(variant.metricsOverrides?.floorArea, computedFloorArea);
    const perimeter = plan.walls.reduce((sum, wall) => sum + Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) / plan.scale, 0);
    const grossWallArea = perimeter * plan.wallHeight;
    const openingsArea = plan.objects
      .filter((object) => object.layer === 'architecture' && ['door', 'window'].includes(object.libraryKey))
      .reduce((sum, object) => sum + (object.width / plan.scale) * (Number(object.height || 0) / 100), 0);
    const computedWallArea = Math.max(0, grossWallArea - openingsArea);
    const wallArea = parseNum(variant.metricsOverrides?.wallArea, computedWallArea);
    return {
      polygon,
      closed: Boolean(polygon),
      floorArea: round(floorArea),
      computedFloorArea: round(computedFloorArea),
      ceilingArea: round(floorArea),
      perimeter: round(perimeter),
      grossWallArea: round(grossWallArea),
      openingsArea: round(openingsArea),
      wallArea: round(wallArea),
      objectFootprint: round(plan.objects.reduce((sum, object) => sum + object.width * object.depth / (plan.scale * plan.scale), 0)),
      floorBuildUp: round((variant.assemblies?.floor || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
      wallBuildUp: round((variant.assemblies?.wall || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
      ceilingBuildUp: round((variant.assemblies?.ceiling || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
    };
  }

  function calculationLabel(value) {
    return ({ manual: 'Ručně', floor: 'Plocha podlahy', walls: 'Plocha stěn', ceiling: 'Plocha stropu', perimeter: 'Obvod' })[value] || 'Ručně';
  }

  function materialTarget(item, metrics) {
    if (item.calculation === 'floor') return metrics.floorArea;
    if (item.calculation === 'walls') return metrics.wallArea;
    if (item.calculation === 'ceiling') return metrics.ceilingArea;
    if (item.calculation === 'perimeter') return metrics.perimeter;
    return 0;
  }

  function materialQuantity(item, metrics) {
    if (!item || item.calculation === 'manual') return Math.max(0, parseNum(item?.quantity, 0));
    const target = materialTarget(item, metrics);
    const coverage = Math.max(0.0001, parseNum(item.coverage, 1));
    const raw = target * (1 + parseNum(item.wastePercent, 0) / 100) / coverage;
    return ['ks', 'balení'].includes(item.unit) ? Math.ceil(raw) : round(raw);
  }

  function materialTotal(item, metrics) {
    return materialQuantity(item, metrics) * parseNum(item.unitPrice, 0);
  }

  function budgetSummary(variant) {
    const metrics = computeProjectMetrics(variant);
    const materials = variant.materials.reduce((sum, item) => sum + materialTotal(item, metrics), 0);
    const services = variant.costs.lines.reduce((sum, item) => sum + parseNum(item.quantity, 0) * parseNum(item.unitPrice, 0), 0);
    const base = materials + services;
    const contingency = base * parseNum(variant.costs.contingencyPercent, 0) / 100;
    const subtotal = base + contingency;
    const vat = subtotal * parseNum(variant.costs.vatPercent, 0) / 100;
    return { metrics, materials, services, base, contingency, subtotal, vat, total: subtotal + vat };
  }

  function renderWorkspace(project) {
    const variant = currentVariant(project);
    const tabGroups = [
      { label: 'Projekt', tabs: [['overview', '01', 'Přehled'], ['field', '02', 'Zaměření'], ['photo', '03', 'Fotografie'], ['ai', '04', 'Analýza snímků']] },
      { label: 'Návrh', tabs: [['plan', '05', 'Precision 2D'], ['library', '06', 'Knihovna'], ['section', '07', 'Řezy a skladby'], ['model', '08', 'RealSpace 3D'], ['presentation', '09', 'Prezentace a VR'], ['comparison', '10', 'Před / po']] },
      { label: 'Příprava', tabs: [['materials', '11', 'Materiály'], ['budget', '12', 'Rozpočet'], ['audit', '13', 'Kontrola'], ['rfq', '14', 'Poptávka']] },
      { label: 'Realizace', tabs: [['diary', '15', 'Deník a pasport'], ['pdf', '16', 'Report Studio']] },
    ];
    return `
      <section class="workspace app-shell">
        <aside class="sidebar">
          <div class="project-mini">
            <p class="eyebrow">${escapeHtml(project.category)}</p>
            <h2>${escapeHtml(project.name)}</h2>
            <p>${escapeHtml(project.location || 'Umístění neuvedeno')} · ${escapeHtml(project.status)}</p>
            <span class="version-chip">DOMUS v7.0 Premium · Precision 2D + RealSpace 3D</span>
          </div>
          <nav class="nav-stack nav-stack-compact">
            ${tabGroups.map((group) => `<div class="nav-group"><small>${group.label}</small>${group.tabs.map(([id, index, label]) => `<button class="nav-btn ${state.currentTab === id ? 'active' : ''}" data-tab="${id}"><span class="nav-index">${index}</span>${label}</button>`).join('')}</div>`).join('')}
          </nav>
          <div class="sidebar-footer">
            <button class="btn btn-ghost" data-action="storage-info">Úložiště a obnova</button>
            <button class="btn btn-ghost" data-action="save-project">Uložit projekt</button>
            <button class="btn btn-ghost" data-action="back-dashboard">Zpět na projekty</button>
          </div>
        </aside>
        <div class="workspace-main">
          <header class="workspace-head">
            <div class="workspace-head-left"><h1>${escapeHtml(project.name)}</h1><p>Poslední změna ${formatDate(project.updatedAt)} · local-first data · schéma projektu v7</p></div>
            <div class="variant-controls">
              <select id="variantSelect" aria-label="Aktivní varianta">${project.variants.map((item) => `<option value="${item.id}" ${item.id === project.activeVariantId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>
              <button class="btn btn-secondary" data-action="new-variant">+ Varianta</button>
            </div>
          </header>
          <div class="workspace-content">${renderActiveTab(project, variant)}</div>
        </div>
      </section>`;
  }

  function renderActiveTab(project, variant) {
    if (state.currentTab === 'field') return renderFieldTab(project, variant);
    if (state.currentTab === 'ai') return renderAiTab(project, variant);
    if (state.currentTab === 'photo') return renderPhotoTab(project, variant);
    if (state.currentTab === 'plan') return renderPlanTab(project, variant);
    if (state.currentTab === 'library') return renderLibraryTab(project, variant);
    if (state.currentTab === 'section') return renderSectionTab(project, variant);
    if (state.currentTab === 'model') return renderModelTab(project, variant);
    if (state.currentTab === 'presentation') return renderPresentationTab(project, variant);
    if (state.currentTab === 'materials') return renderMaterialsTab(project, variant);
    if (state.currentTab === 'budget') return renderBudgetTab(project, variant);
    if (state.currentTab === 'comparison') return renderComparisonTab(project, variant);
    if (state.currentTab === 'audit') return renderAuditTab(project, variant);
    if (state.currentTab === 'rfq') return renderRfqTab(project, variant);
    if (state.currentTab === 'diary') return renderDiaryTab(project, variant);
    if (state.currentTab === 'pdf') return renderPdfTab(project, variant);
    return renderOverviewTab(project, variant);
  }

  function projectWorkflow(variant) {
    const summary = budgetSummary(variant);
    const report = DomusAudit.buildReport(variant, summary.metrics, summary.total);
    const measured = variant.field.sessions.flatMap((session) => session.measurements || []).some((item) => item.verified && item.source === 'measured');
    const hasPhoto = Boolean(variant.photo.dataUrl || variant.field.sessions.some((session) => session.photos?.length));
    return [
      { tab: 'field', label: 'Zaměřit skutečný stav', done: measured, detail: measured ? 'Je evidován fyzicky ověřený rozměr.' : 'Doplňte alespoň jeden fyzicky změřený a navázaný rozměr.' },
      { tab: 'photo', label: 'Doplnit fotodokumentaci', done: hasPhoto, detail: hasPhoto ? 'Projekt obsahuje fotografický podklad.' : 'Přidejte celkový pohled a kritické detaily.' },
      { tab: 'plan', label: 'Uzavřít 2D půdorys', done: summary.metrics.closed, detail: summary.metrics.closed ? 'Plocha je geometricky vypočitatelná.' : 'Propojte stěny do skutečného polygonu.' },
      { tab: 'materials', label: 'Specifikovat výrobky', done: variant.materials.length > 0, detail: variant.materials.length ? `${variant.materials.length} položek je specifikováno.` : 'Vyberte hlavní materiály a výrobky.' },
      { tab: 'budget', label: 'Sestavit orientační rozpočet', done: summary.total > 0, detail: summary.total > 0 ? `Aktuální součet je ${money(summary.total)}.` : 'Doplňte materiály, práci a rezervu.' },
      { tab: 'audit', label: 'Vyřešit kritické nálezy', done: !report.technicalOpen.some((item) => item.severity === 'critical'), detail: report.technicalOpen.some((item) => item.severity === 'critical') ? `${report.technicalOpen.filter((item) => item.severity === 'critical').length} kritických nálezů vyžaduje technickou změnu.` : 'Kontrola nemá otevřenou technickou kritickou chybu.' },
      { tab: 'rfq', label: 'Připravit poptávku', done: Boolean(variant.rfq.scope?.trim()), detail: variant.rfq.scope?.trim() ? 'Rozsah poptávky je popsán.' : 'Vymezte rozsah, výjimky a otázky pro dodavatele.' },
      { tab: 'diary', label: 'Dokumentovat realizaci', done: variant.diary.entries.length > 0, detail: variant.diary.entries.length ? `${variant.diary.entries.length} záznamů v realizačním deníku.` : 'Při zahájení prací založte první záznam.' },
    ];
  }

/* Overview, field capture, image analysis and photo editor views. Source fragment; assembled by scripts/build.mjs. */
  function renderOverviewTab(project, variant) {
    const summary = budgetSummary(variant);
    const metrics = summary.metrics;
    const workflow = projectWorkflow(variant);
    const nextStep = workflow.find((item) => !item.done) || workflow.at(-1);
    const performance = state.projectPerformance?.[project.id] || DomusPremium.complexity(project);
    const performanceLabel = ({small:'Lehký projekt',medium:'Střední projekt',large:'Velký projekt',extreme:'Velmi velký projekt'})[performance.level] || 'Projekt';
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Projektový přehled</h2><p>Záměr, automatické výpočty a stav aktuální varianty.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="edit-project">Upravit údaje</button></div></div>
        <div class="panel-body overview-grid overview-grid-v2">
          <div class="overview-card">
            <p class="eyebrow">Záměr projektu</p><h3>${escapeHtml(project.name)}</h3>
            <p class="summary-text">${escapeHtml(project.summary || 'Doplňte stručný popis zamýšleného výsledku.')}</p>
            <label>Pracovní poznámky varianty<textarea id="variantNotes" rows="10" placeholder="Co je třeba doměřit, ověřit nebo rozhodnout?">${escapeHtml(variant.notes || '')}</textarea></label>
          </div>
          <div class="overview-card">
            <p class="eyebrow">Rozměry a plochy</p><h3>${escapeHtml(variant.name)}</h3>
            <div class="kpi-grid">
              <div class="kpi"><strong>${measure(metrics.floorArea)}</strong><span>plocha podlahy</span></div>
              <div class="kpi"><strong>${measure(metrics.wallArea)}</strong><span>čistá plocha stěn</span></div>
              <div class="kpi"><strong>${measure(metrics.perimeter, 'm')}</strong><span>obvod / délka stěn</span></div>
              <div class="kpi"><strong>${metrics.closed ? 'UZAVŘENÝ' : 'NEUZAVŘENÝ'}</strong><span>stav půdorysu</span></div>
            </div>
            <div class="info-box ${metrics.closed ? 'success' : 'warning'}" style="margin-top:18px"><strong>${metrics.closed ? 'Plocha je vypočtena z uzavřeného půdorysu.' : 'Půdorys není uzavřený.'}</strong><br>${metrics.closed ? 'Výpočty spotřeby lze použít jako orientační podklad.' : 'Plochu podlahy zadejte ručně nebo propojte stěny do uzavřeného obvodu.'}</div>
          </div>
          <div class="overview-card overview-wide workflow-card">
            <div class="workflow-head"><div><p class="eyebrow">Průvodce projektem</p><h3>Další doporučený krok: ${escapeHtml(nextStep.label)}</h3><p>${escapeHtml(nextStep.detail)}</p></div><button class="btn btn-primary" data-tab-jump="${nextStep.tab}">Pokračovat</button></div>
            <div class="workflow-steps">${workflow.map((item, index) => `<button class="workflow-step ${item.done ? 'done' : item === nextStep ? 'current' : ''}" data-tab-jump="${item.tab}"><span>${item.done ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></button>`).join('')}</div>
          </div>
          <div class="overview-card overview-wide">
            <div class="overview-split">
              <div><p class="eyebrow">Orientační rozpočet</p><h3>${money(summary.total)}</h3><p>Materiály ${money(summary.materials)} · práce a služby ${money(summary.services)} · rezerva ${money(summary.contingency)}.</p></div>
              <div class="mini-progress"><span style="width:${summary.total ? Math.min(100, summary.materials / summary.total * 100) : 0}%"></span></div>
              <button class="btn btn-secondary" data-tab-jump="budget">Otevřít rozpočet</button>
            </div>
            <div class="timeline">
              <div class="timeline-item"><time>Vytvořeno</time><span>${formatDate(project.createdAt)}</span></div>
              <div class="timeline-item"><time>Aktualizace</time><span>${formatDate(project.updatedAt)}</span></div>
              <div class="timeline-item"><time>Materiály</time><span>${variant.materials.length} položek</span></div>
              <div class="timeline-item"><time>Vrstvy instalací</time><span>${Object.values(variant.plan.layerVisibility).filter(Boolean).length}/${Object.keys(LAYERS).length} viditelných</span></div><div class="timeline-item"><time>Výkon</time><span>${performanceLabel} · skóre ${performance.score}</span></div>
            </div>
          </div>
        </div>
      </div>`;
  }


  function activeRoomPhoto(variant) {
    return variant.ai.photoSet.find((photo) => photo.id === variant.ai.activePhotoId) || variant.ai.photoSet[0] || null;
  }

  function confidenceLabel(value) {
    const percent = Math.round(clamp(parseNum(value, 0), 0, 1) * 100);
    return `${percent} %`;
  }

  function renderAnalysisList(items, emptyText) {
    if (!Array.isArray(items) || !items.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
    return `<ul class="ai-result-list">${items.map((item) => `<li>${escapeHtml(typeof item === 'string' ? item : item.name || item.label || item.notes || JSON.stringify(item))}</li>`).join('')}</ul>`;
  }

  function renderDetectedElements(analysis) {
    const elements = analysis?.elements || [];
    if (!elements.length) return '<div class="empty-mini">Zatím nebyly identifikovány žádné prvky.</div>';
    return elements.map((item, index) => {
      const confidence = item.confidence == null ? '' : `<span class="confidence-chip">${confidenceLabel(item.confidence)}</span>`;
      return `<article class="detected-card"><div><span class="layer-dot" style="background:${LAYERS[item.layer]?.color || '#8ea0aa'}"></span><strong>${escapeHtml(item.name || 'Neurčený prvek')}</strong>${confidence}</div><p>${escapeHtml(item.notes || item.reason || 'Bez doplňujícího popisu.')}</p><button class="btn btn-ghost btn-small" data-action="add-detected-element" data-index="${index}">Vložit do 2D výkresu</button></article>`;
    }).join('');
  }

  function renderVariantIdeas(variant) {
    const ideas = variant.ai.variantIdeas || [];
    if (!ideas.length) return '<div class="empty-mini">Vygenerujte tři návrhové směry. Nejdříve vzniknou jako návrhy, nikoli jako automaticky přepsaný projekt.</div>';
    return ideas.map((idea, index) => `<article class="idea-card"><div class="idea-card-top"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(idea.name)}</strong><small>${escapeHtml(idea.style || '')}</small></div></div><p>${escapeHtml(idea.description || '')}</p><ul>${(idea.changes || []).slice(0, 4).map((change) => `<li>${escapeHtml(change)}</li>`).join('')}</ul><div class="idea-budget">Rozpočtový koeficient <strong>${planNumber(idea.budgetFactor || 1)}×</strong></div><button class="btn btn-secondary" data-action="create-idea-variant" data-index="${index}">Vytvořit projektovou variantu</button></article>`).join('');
  }

  function currentFieldSession(variant = currentVariant()) {
    const field = variant?.field;
    return field?.sessions?.find((item) => item.id === field.activeSessionId) || field?.sessions?.[0] || null;
  }

  function formatDateTime(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  }

  function renderFieldPhoto(photo) {
    return `<article class="field-photo-card"><img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || 'Terénní fotografie')}" /><div><input value="${escapeHtml(photo.name || '')}" data-field-photo-name="${photo.id}" aria-label="Název fotografie" /><textarea rows="2" data-field-photo-note="${photo.id}" placeholder="Poznámka k fotografii">${escapeHtml(photo.note || '')}</textarea><small>${formatDateTime(photo.capturedAt)}</small><button class="table-action danger" data-action="remove-field-photo" data-id="${photo.id}">Odstranit</button></div></article>`;
  }

  function renderFieldTab(project, variant) {
    const field = variant.field;
    const session = currentFieldSession(variant);
    const sync = state.syncStatus;
    const mobileUrl = sync.serverUrl ? `${sync.serverUrl.replace(/\/$/, '')}/?mobile=1` : '';
    const targetOptions = [
      ...variant.plan.walls.map((wall, index) => ({ id: wall.id, label: `Stěna ${index + 1}` })),
      ...variant.plan.objects.map((object) => ({ id: object.id, label: object.type || object.libraryKey || 'Prvek' })),
    ];
    const targetSelect = (selected = '') => `<option value="">Bez vazby</option>${targetOptions.map((target) => `<option value="${escapeHtml(target.id)}" ${target.id === selected ? 'selected' : ''}>${escapeHtml(target.label)}</option>`).join('')}`;
    return `<div class="field-workspace">
      <section class="panel field-main-panel">
        <div class="panel-head"><div><p class="eyebrow">Terénní režim v6</p><h2>Mobilní zaměření a fotodokumentace</h2><p>Na telefonu lze zapisovat rozměry, fotografovat, ukládat polohu a importovat prostorové skeny.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="new-field-session">+ Nové zaměření</button><button class="btn btn-ghost" data-action="capture-field-photo">Vyfotit / nahrát</button></div></div>
        <div class="field-session-bar"><label>Aktivní zaměření<select id="fieldSessionSelect">${field.sessions.map((item) => `<option value="${item.id}" ${item.id === field.activeSessionId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select></label><label>Stav<select id="fieldSessionStatus"><option ${session.status === 'Rozpracováno' ? 'selected' : ''}>Rozpracováno</option><option ${session.status === 'Připraveno k přenosu' ? 'selected' : ''}>Připraveno k přenosu</option><option ${session.status === 'Ověřeno' ? 'selected' : ''}>Ověřeno</option></select></label><button class="btn btn-ghost danger-soft" data-action="delete-field-session">Odstranit zaměření</button></div>
        <div class="field-grid">
          <article class="overview-card field-entry-card"><p class="eyebrow">Rychlý zápis rozměru</p><div class="field-measure-form"><input id="fieldMeasureLabel" placeholder="Např. šířka niky" /><input id="fieldMeasureValue" inputmode="decimal" placeholder="1200" /><select id="fieldMeasureUnit"><option>mm</option><option>cm</option><option>m</option><option>m²</option><option>ks</option></select><select id="fieldMeasureCategory"><option>Rozměr</option><option>Výška</option><option>Vzdálenost</option><option>Průměr</option><option>Plocha</option><option>Technická poznámka</option></select><select id="fieldMeasureTarget" aria-label="Navázat na prvek">${targetSelect()}</select><button class="btn btn-primary" data-action="add-field-measurement">Uložit</button></div><div class="preset-row">${['šířka prostoru','výška prostoru','vzdálenost od rohu','výška vývodu','průměr potrubí','rozměr otvoru'].map((item) => `<button data-measure-preset="${item}">${item}</button>`).join('')}</div></article>
          <article class="overview-card field-entry-card"><p class="eyebrow">Místo a poznámky</p><div class="field-location">${session.location ? `<strong>${session.location.latitude.toFixed(5)}, ${session.location.longitude.toFixed(5)}</strong><span>Přesnost přibližně ${Math.round(session.location.accuracy || 0)} m</span>` : '<span>Poloha není uložena. U interiéru obvykle není nutná.</span>'}<button class="btn btn-secondary" data-action="save-field-location">Uložit aktuální polohu</button></div><textarea id="fieldSessionNotes" rows="5" placeholder="Co ještě doměřit, odkud byla fotografie pořízena, přístupová omezení…">${escapeHtml(session.notes || '')}</textarea></article>
        </div>
        <div class="subsection-head"><div><h3>Naměřené údaje</h3><p>${session.measurements.length} položek · hodnoty označ jako ověřené až po kontrole.</p></div></div>
        <div class="table-wrap"><table><thead><tr><th>Údaj</th><th>Kategorie</th><th>Hodnota</th><th>Vazba</th><th>Zdroj a jistota</th><th>Ověřeno</th><th></th></tr></thead><tbody>${session.measurements.length ? session.measurements.map((item) => `<tr><td><strong>${escapeHtml(item.label)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</td><td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(String(item.value))} ${escapeHtml(item.unit)}</strong></td><td><select class="compact-select" data-field-measure-target="${item.id}">${targetSelect(item.targetId || '')}</select></td><td><select class="compact-select confidence-${escapeHtml(item.source || 'estimate')}" data-field-measure-source="${item.id}"><option value="measured" ${(item.source||'')==='measured'?'selected':''}>Fyzicky změřeno</option><option value="derived" ${(item.source||'')==='derived'?'selected':''}>Odvozeno</option><option value="estimate" ${(item.source||'estimate')==='estimate'?'selected':''}>Odhad</option><option value="ai" ${(item.source||'')==='ai'?'selected':''}>AI návrh</option></select><small>${Math.round(parseNum(item.confidence, item.verified ? 100 : 40))} %</small></td><td><label class="mini-check"><input type="checkbox" data-field-measure-verified="${item.id}" ${item.verified ? 'checked' : ''}/> ano</label></td><td><button class="table-action danger" data-action="remove-field-measurement" data-id="${item.id}">Smazat</button></td></tr>`).join('') : '<tr><td colspan="7"><div class="empty-mini">Zatím nebyl zapsán žádný rozměr.</div></td></tr>'}</tbody></table></div>
        <div class="subsection-head"><div><h3>Fotografie z terénu</h3><p>Na mobilu se otevře fotoaparát. Snímky se zmenší a uloží přímo do projektu.</p></div><button class="btn btn-secondary" data-action="capture-field-photo">+ Přidat fotografie</button></div>
        <div class="field-photo-grid">${session.photos.length ? session.photos.map(renderFieldPhoto).join('') : '<div class="empty-mini">Žádná terénní fotografie.</div>'}</div>
        <div class="subsection-head"><div><h3>LiDAR a prostorové skeny</h3><p>Import metadat USDZ/OBJ/GLB/PLY nebo datového JSON. U RoomPlan JSON lze vytvořit pracovní obrys stěn.</p></div><button class="btn btn-secondary" data-action="import-lidar">Importovat sken</button></div>
        <div class="scan-list">${session.scans.length ? session.scans.map((scan) => `<article class="scan-card"><div><strong>${escapeHtml(scan.name)}</strong><span>${escapeHtml(scan.format.toUpperCase())} · ${(scan.size / 1024 / 1024).toFixed(2)} MB · ${formatDateTime(scan.importedAt)}</span><p>${escapeHtml(scan.summary || 'Soubor je evidován jako externí podklad.')}</p></div><div>${scan.roomPlan?.walls?.length ? `<button class="btn btn-secondary btn-small" data-action="apply-roomplan" data-id="${scan.id}">Převést stěny do 2D</button>` : ''}<button class="table-action danger" data-action="remove-scan" data-id="${scan.id}">Odstranit</button></div></article>`).join('') : '<div class="empty-mini">Nebyl přidán žádný prostorový sken.</div>'}</div>
        <div class="info-box warning"><strong>LiDAR není automaticky stavební zaměření.</strong><br>Importované geometrie jsou pracovní podklad. Rozměry a polohu konstrukcí před realizací fyzicky ověř.</div>
      </section>
      <aside class="panel sync-panel"><div class="panel-head"><div><p class="eyebrow">Notebook ↔ telefon</p><h2>Lokální synchronizace</h2></div></div><div class="panel-body">
        <div class="sync-state ${sync.enabled ? 'ready' : 'offline'}"><span></span><strong>${sync.enabled ? 'Mobilní přístup je aktivní' : 'Mobilní přístup není povolen'}</strong><p>${escapeHtml(sync.message || '')}</p></div>
        ${sync.enabled ? (sync.localClient ? `<div class="pair-code"><small>Jednorázový párovací kód pro telefon</small><strong>${escapeHtml(sync.pairingCode || '------')}</strong><span>Platnost do ${formatDateTime(sync.pairingExpiresAt)}</span></div><label>Adresa pro telefon<div class="copy-field"><input readonly value="${escapeHtml(mobileUrl)}" /><button class="btn btn-ghost" data-action="copy-mobile-url">Kopírovat</button></div></label><ol class="sync-steps"><li>Telefon i notebook připoj ke stejné důvěryhodné Wi-Fi.</li><li>Adresu otevři v telefonu.</li><li>Zadej jednorázový kód. Aplikace uloží dlouhý token, nikoliv párovací kód.</li></ol>${sync.devices?.length ? `<div class="paired-devices"><strong>Spárovaná zařízení</strong>${sync.devices.map((device)=>`<div><span>${escapeHtml(device.name||'Zařízení')}<small>naposledy ${formatDateTime(device.lastSeenAt)} · platnost do ${formatDateTime(device.expiresAt)}</small></span><button class="table-action danger" data-action="revoke-sync-device" data-id="${escapeHtml(device.id)}">Zrušit</button></div>`).join('')}</div>` : `<div class="info-box">Zatím není spárováno žádné mobilní zařízení.</div>`}` : (sync.paired ? `<div class="info-box success"><strong>Telefon je bezpečně spárován.</strong><br>Přístupový token je uložen pouze v tomto prohlížeči a lze jej kdykoliv zrušit na notebooku.</div>` : `<label>Jednorázový kód z notebooku<div class="copy-field"><input id="syncPairCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="" placeholder="000000" /><button class="btn btn-primary" data-action="pair-sync-device">Spárovat</button></div></label><div class="info-box"><strong>Mobilní zařízení:</strong><br>Kód platí pouze deset minut a po úspěšném spárování se automaticky znehodnotí.</div>`)) : '<div class="info-box"><strong>První aktivace:</strong><br>V kořenové složce spusť jako správce soubor <b>Povolit-mobilni-pristup.bat</b> a poté DOMUS Studio restartuj.</div>'}
        ${sync.enabled ? '<div class="info-box warning"><strong>Síťový přenos není šifrován jako HTTPS.</strong><br>Používej pouze vlastní důvěryhodnou Wi-Fi. Mobilní přístup nezapínej na veřejné, hotelové, školní ani cizí síti.</div>' : ''}
        <button class="btn btn-secondary" style="width:100%" data-action="refresh-sync-status">Ověřit stav</button><button class="btn btn-primary" style="width:100%" data-action="sync-push" ${sync.enabled && (sync.localClient || sync.paired) ? '' : 'disabled'}>Odeslat aktuální projekt</button><button class="btn btn-secondary" style="width:100%" data-action="sync-pull" ${sync.enabled && (sync.localClient || sync.paired) ? '' : 'disabled'}>Načíst poslední verzi projektu</button>
        <label class="check-row"><input id="autoSyncToggle" type="checkbox" ${field.sync.autoSync ? 'checked' : ''} ${sync.enabled ? '' : 'disabled'}/> Automaticky odeslat po uložení</label><div class="sync-times"><span>Odesláno: ${formatDateTime(field.sync.lastPushAt)}</span><span>Načteno: ${formatDateTime(field.sync.lastPullAt)}</span></div>
      </div></aside>
    </div>`;
  }

  function renderAiTab(project, variant) {
    const ai = variant.ai;
    const active = activeRoomPhoto(variant);
    const analysis = ai.analysis || ai.localAnalysis;
    const plan = analysis?.proposedPlan || ai.proposedPlan;
    const statusClass = state.aiStatus.configured ? 'success' : 'warning';
    const source = ai.analysis ? 'Cloudová obrazová AI' : ai.localAnalysis ? 'Kontrola fotografie a detekce linií' : 'Bez analýzy';
    return `
      <div class="ai-workspace">
        <section class="panel ai-hero-panel">
          <div class="panel-head"><div><p class="eyebrow">DOMUS Vision · obrazová analýza</p><h2>Od více fotografií k ověřitelnému návrhu</h2><p>Složte pohledy prostoru, nechte aplikaci vyhledat konstrukční znaky a vytvořte pracovní půdorys, který následně potvrdíte skutečnými rozměry.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="upload-room-photos">+ Přidat fotografie</button><button class="btn btn-ghost" data-action="add-main-photo-to-set">Použít hlavní fotografii</button></div></div>
          <div class="ai-status-strip"><div class="info-box ${statusClass}"><strong>${state.aiStatus.configured ? 'Cloudová AI je připravena' : 'Cloudová AI není nastavena'}</strong><br>${escapeHtml(state.aiStatus.configured ? `Model: ${state.aiStatus.model || 'nastavený model'}` : state.aiStatus.message || 'Lokální nástroje zůstávají dostupné.')}</div><button class="btn btn-ghost" data-action="refresh-ai-status">Ověřit připojení</button></div>
          <div class="ai-sharing"><strong>Údaje odesílané do cloudové AI</strong><label class="check-row"><input id="aiShareLocation" type="checkbox" ${state.aiShare.location ? 'checked' : ''}/> Lokalita projektu</label><label class="check-row"><input id="aiShareMaterials" type="checkbox" ${state.aiShare.materials ? 'checked' : ''}/> Materiály a orientační ceny</label><label class="check-row"><input id="aiShareNotes" type="checkbox" ${state.aiShare.notes ? 'checked' : ''}/> Poznámky projektu</label><small>Fotografie se odesílají pouze po potvrzení spuštění cloudové analýzy.</small></div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h2>1. Sada fotografií prostoru</h2><p>Přední, boční, zadní a detailní pohledy zůstávají společně v jedné variantě projektu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="upload-room-photos">Nahrát více snímků</button><button class="btn btn-ghost" data-action="export-photo-mosaic">Uložit přehled snímků</button></div></div>
          <div class="photo-set-layout">
            <div class="photo-set-grid">${ai.photoSet.length ? ai.photoSet.map((photo, index) => `<article class="room-photo-card ${photo.id === ai.activePhotoId ? 'active' : ''}"><button class="room-photo-preview" data-action="select-room-photo" data-id="${photo.id}"><img src="${photo.dataUrl}" alt="${escapeHtml(photo.name)}"><span>${String(index + 1).padStart(2, '0')}</span></button><label>Název<input data-room-photo-name="${photo.id}" value="${escapeHtml(photo.name)}"></label><label>Pohled<select data-room-photo-view="${photo.id}">${[['front','Čelní'],['left','Levý'],['right','Pravý'],['back','Zadní'],['ceiling','Strop'],['floor','Podlaha'],['detail','Detail']].map(([value,label]) => `<option value="${value}" ${photo.view === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label><label>Poznámka<textarea rows="2" data-room-photo-note="${photo.id}">${escapeHtml(photo.note || '')}</textarea></label><button class="table-action danger" data-action="remove-room-photo" data-id="${photo.id}">Odstranit</button></article>`).join('') : '<div class="empty-state compact"><strong>Chybí sada snímků</strong><p>Nahrajte 2–6 fotografií stejného prostoru z různých směrů.</p></div>'}</div>
            <aside class="mosaic-panel"><div class="tool-title">Kontaktní přehled</div><div class="canvas-wrap mosaic-wrap"><canvas id="photoMosaicCanvas" width="1000" height="700"></canvas></div><div class="info-box"><strong>Aktivní snímek:</strong><br>${active ? escapeHtml(active.name) : 'není vybrán'}.</div></aside>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h2>2. Analýza prostoru</h2><p>Lokální režim pouze kontroluje kvalitu snímku a hledá dominantní linie; nerozpoznává spolehlivě stavební prvky. Cloudový režim navíc popíše konstrukce, instalace, nejistoty a doporučená měření.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="run-local-analysis" ${active || variant.photo.dataUrl ? '' : 'disabled'}>Kontrola fotografie a linií</button><button class="btn btn-primary" data-action="run-cloud-analysis" ${active || variant.photo.dataUrl ? '' : 'disabled'}>${state.aiBusy ? 'Analyzuji…' : 'Spustit obrazovou AI'}</button></div></div>
          <div class="analysis-grid">
            <article class="analysis-summary"><p class="eyebrow">Poslední výsledek</p><h3>${escapeHtml(source)}</h3>${analysis ? `<p>${escapeHtml(analysis.summary || 'Analýza dokončena.')}</p><div class="analysis-kpis"><div><strong>${confidenceLabel(analysis.confidence || 0)}</strong><span>celková jistota</span></div><div><strong>${escapeHtml(analysis.roomType || project.category)}</strong><span>typ prostoru</span></div><div><strong>${analysis.elements?.length || 0}</strong><span>nalezených prvků</span></div></div><small>${ai.lastRunAt ? `Aktualizováno ${formatDate(ai.lastRunAt)}` : ''}</small>` : '<div class="empty-mini">Zvolte aktivní fotografii a spusťte analýzu.</div>'}</article>
            <article><p class="eyebrow">Konstrukce a zařízení</p><div class="detected-grid">${renderDetectedElements(analysis)}</div></article>
            <article><p class="eyebrow">Rizika a nejistoty</p>${renderAnalysisList(analysis?.risks, 'Zatím bez záznamu.')}</article>
            <article><p class="eyebrow">Co je třeba doměřit</p>${renderAnalysisList(analysis?.measurementsToVerify || analysis?.recommendations, 'Zatím bez záznamu.')}</article>
          </div>
          <div class="info-box warning"><strong>Bezpečnostní pravidlo:</strong> žádný rozměr odhadnutý z fotografie se automaticky nepovažuje za ověřený. Před objednávkou nebo realizací jej potvrďte fyzickým měřením.</div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h2>3. Návrh základního půdorysu</h2><p>Rozměry potvrďte ručně. Aplikace vytvoří čistou geometrii a nepřepíše existující výkres bez potvrzení.</p></div><div class="panel-actions"><button class="btn btn-primary" data-action="apply-proposed-plan">Vytvořit 2D půdorys</button></div></div>
          <div class="plan-assistant-grid"><label>Tvar místnosti<select id="aiPlanShape"><option value="rectangle" ${plan.shape === 'rectangle' ? 'selected' : ''}>Obdélník</option><option value="l-shape" ${plan.shape === 'l-shape' ? 'selected' : ''}>Tvar L</option></select></label><label>Šířka (mm)<input id="aiPlanWidth" inputmode="decimal" value="${parseNum(plan.widthMm, 3000)}"></label><label>Hloubka (mm)<input id="aiPlanDepth" inputmode="decimal" value="${parseNum(plan.depthMm, 2400)}"></label><label>Výška stěn (m)<input id="aiPlanHeight" inputmode="decimal" value="${parseNum(plan.wallHeightM, 2.6)}"></label></div>
          <div class="info-box"><strong>Doporučený postup:</strong> nejprve potvrďte celkovou šířku a hloubku, poté v editoru 2D doplňte dveře, okna, odpady a skutečné instalační body.</div>
        </section>

        <section class="panel">
          <div class="panel-head"><div><h2>4. Generátor návrhových variant</h2><p>Vytvoří tři směry: úsporný, vyvážený a prémiový. Každý návrh lze převést na samostatnou kopii aktuální varianty.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="generate-local-variants">Vytvořit návrhy lokálně</button><button class="btn btn-primary" data-action="generate-cloud-variants">Navrhnout pomocí AI</button></div></div>
          <div class="idea-grid">${renderVariantIdeas(variant)}</div>
        </section>
      </div>`;
  }

  function renderPhotoTab(project, variant) {
    const calibrated = Boolean(variant.photo.calibration);
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Fotografie skutečného stavu</h2><p>Nahrajte fotografii, určete měřítko a zakreslete kóty nebo poznámky.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="upload-photo">${variant.photo.dataUrl ? 'Nahradit fotografii' : 'Nahrát fotografii'}</button><button class="btn btn-ghost" data-action="undo-photo">Zpět</button><button class="btn btn-ghost btn-danger" data-action="clear-photo">Vymazat značky</button></div></div>
        <div class="editor-layout">
          <div class="editor-tools"><div class="tool-group"><div class="tool-title">Nástroje</div><button class="tool-btn ${state.photoTool === 'measure' ? 'active' : ''}" data-photo-tool="measure">Kóta / vzdálenost</button><button class="tool-btn ${state.photoTool === 'calibrate' ? 'active' : ''}" data-photo-tool="calibrate">Kalibrace měřítka</button><button class="tool-btn ${state.photoTool === 'note' ? 'active' : ''}" data-photo-tool="note">Textová poznámka</button></div><div class="tool-group"><div class="tool-title">Stav</div><div class="info-box ${calibrated ? 'success' : 'warning'}">${calibrated ? `<strong>Měřítko nastaveno.</strong><br>${Math.round(variant.photo.calibration.mm)} mm odpovídá ${Math.round(variant.photo.calibration.pixels)} px.` : '<strong>Měřítko není nastaveno.</strong><br>Nejdříve označte známou vzdálenost.'}</div></div></div>
          <div class="editor-stage"><div class="canvas-wrap" id="photoCanvasWrap">${variant.photo.dataUrl ? '<canvas id="photoCanvas"></canvas>' : `<div class="empty-canvas"><strong>Začněte fotografií skutečného stavu</strong><p>Ideální je co nejrovnější záběr bez výrazné perspektivy.</p><button class="btn btn-primary" data-action="upload-photo">Nahrát fotografii</button></div>`}</div></div>
          <div class="editor-properties"><div class="tool-title">Jak postupovat</div><div class="property-list"><div class="info-box"><strong>1. Fotografie</strong><br>Vyfoťte prostor pokud možno kolmo.</div><div class="info-box"><strong>2. Kalibrace</strong><br>Táhněte přes známý rozměr a zadejte hodnotu v milimetrech.</div><div class="info-box"><strong>3. Kóty</strong><br>Další čáry se dopočítají podle kalibrace.</div><div class="info-box warning"><strong>Upozornění:</strong> měření z jediné fotografie je orientační.</div></div></div>
        </div>
      </div>`;
  }

/* Plan, section, 3D, presentation, materials and budget views. Source fragment; assembled by scripts/build.mjs. */
  function renderPlanTab(project, variant) {
    const plan = variant.plan;
    const metrics = computeProjectMetrics(variant);
    const elements = ELEMENT_LIBRARY.filter((item) => item.layer === state.activeLayer);
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>2D výkres a vrstvy instalací</h2><p>Půdorys, stavební prvky, voda, odpady, elektro, vytápění, vzduchotechnika i závlaha.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="fit-plan">Přizpůsobit plátnu</button><button class="btn btn-ghost" data-action="undo-plan">Zpět</button><button class="btn btn-ghost btn-danger" data-action="clear-plan">Vymazat výkres</button></div></div>
        <div class="editor-layout editor-layout-wide-tools">
          <div class="editor-tools">
            <div class="tool-group"><div class="tool-title">Kreslení</div>
              <button class="tool-btn ${state.planTool === 'select' ? 'active' : ''}" data-plan-tool="select">Vybrat / upravit</button>
              <button class="tool-btn ${state.planTool === 'wall' ? 'active' : ''}" data-plan-tool="wall">Stěna</button>
              <button class="tool-btn ${state.planTool === 'object' ? 'active' : ''}" data-plan-tool="object">Vložit prvek</button>
              <button class="tool-btn ${state.planTool === 'delete' ? 'active' : ''}" data-plan-tool="delete">Odstranit prvek</button>
            </div>
            <div class="tool-group"><div class="tool-title">Vrstvy</div>
              ${Object.entries(LAYERS).map(([key, layer]) => `<div class="layer-row ${state.activeLayer === key ? 'active' : ''}"><label title="Zobrazit nebo skrýt vrstvu"><input type="checkbox" data-layer-toggle="${key}" ${plan.layerVisibility[key] ? 'checked' : ''} /><span class="layer-dot" style="background:${layer.color}"></span></label><button data-active-layer="${key}">${escapeHtml(layer.label)}</button></div>`).join('')}
            </div>
            <div class="tool-group"><div class="tool-title">Knihovna · ${escapeHtml(LAYERS[state.activeLayer].label)}</div>
              ${elements.map((element) => `<button class="tool-btn library-btn ${state.planElementKey === element.key ? 'active' : ''}" data-library-element="${element.key}"><span style="background:${element.color}"></span>${escapeHtml(element.name)}</button>`).join('')}
            </div>
          </div>
          <div class="editor-stage"><div class="canvas-wrap"><canvas id="planCanvas" width="1100" height="700" role="img" aria-label="Interaktivní půdorys projektu"></canvas></div><details class="canvas-object-list"><summary>Textový seznam prvků výkresu (${plan.walls.length + plan.objects.length})</summary><div class="table-wrap"><table><thead><tr><th>Prvek</th><th>Vrstva</th><th>Poloha / rozměr</th><th></th></tr></thead><tbody>${plan.walls.map((wall,index)=>`<tr><td>Stěna ${index+1}</td><td>Stavba</td><td>${planNumber(Math.hypot(wall.x2-wall.x1,wall.y2-wall.y1)/plan.scale)} m</td><td><button class="table-action" data-action="edit-plan-wall" data-id="${wall.id}">Upravit délku</button></td></tr>`).join('')}${plan.objects.map((object)=>`<tr><td>${escapeHtml(object.type)}</td><td>${escapeHtml(LAYERS[object.layer]?.label||object.layer)}</td><td>x ${Math.round(object.x)}, y ${Math.round(object.y)} · ${Math.round(object.width/plan.scale*1000)} × ${Math.round(object.depth/plan.scale*1000)} mm</td><td><button class="table-action" data-action="edit-plan-object" data-id="${object.id}">Upravit</button></td></tr>`).join('')}</tbody></table></div></details></div>
          <div class="editor-properties"><div class="tool-title">Parametry výkresu</div><div class="property-list">
            <label>Měřítko plátna<select id="planScale">${[20,40,50,60,80,100,120,140].map((value) => `<option value="${value}" ${plan.scale === value ? 'selected' : ''}>${value} px = 1 m</option>`).join('')}</select></label>
            <label>Výška stěn (m)<input id="wallHeight" type="number" min="1" max="8" step="0.05" value="${plan.wallHeight}" /></label>
            <label>Tloušťka stěn (m)<input id="wallThickness" type="number" min="0.05" max="0.8" step="0.01" value="${plan.wallThickness}" /></label>
            <label>Ruční plocha podlahy (m²)<input id="floorAreaOverride" inputmode="decimal" placeholder="automaticky: ${metrics.computedFloorArea}" value="${escapeHtml(variant.metricsOverrides.floorArea)}" /></label>
            <label>Ruční čistá plocha stěn (m²)<input id="wallAreaOverride" inputmode="decimal" placeholder="automaticky: ${round(metrics.grossWallArea - metrics.openingsArea)}" value="${escapeHtml(variant.metricsOverrides.wallArea)}" /></label>
            <div class="info-box"><strong>${plan.walls.length} stěn · ${plan.objects.length} prvků</strong><br>Podlaha ${measure(metrics.floorArea)} · stěny ${measure(metrics.wallArea)}.</div>
            <div class="info-box warning"><strong>Ovládání:</strong> kliknutí v režimu „Vložit prvek“ použije výchozí rozměr. Tažením určíte vlastní půdorysnou velikost. V režimu „Vybrat“ lze objekt upravit.</div>
          </div></div>
        </div>
      </div>`;
  }

  function renderAssemblyList(variant, type, label) {
    const layers = variant.assemblies[type] || [];
    const total = layers.reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0);
    return `<div class="assembly-card"><div class="assembly-head"><div><strong>${label}</strong><span>Celkem ${total} mm</span></div><button class="icon-add" data-action="add-assembly" data-type="${type}" title="Přidat vrstvu">+</button></div><div class="assembly-list">${layers.map((layer) => `<div class="assembly-layer"><span class="assembly-color" style="background:${escapeHtml(layer.color)}"></span><div><strong>${escapeHtml(layer.name)}</strong><small>${escapeHtml(layer.material || '')} · ${parseNum(layer.thicknessMm)} mm</small></div><button data-action="remove-assembly" data-type="${type}" data-id="${layer.id}" title="Odstranit">×</button></div>`).join('') || '<p class="muted">Bez vrstev.</p>'}</div></div>`;
  }

  function renderSectionTab(project, variant) {
    const metrics = computeProjectMetrics(variant);
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Řezy a konstrukční skladby</h2><p>Automatický schematický řez přes půdorys a evidence vrstev podlahy, stěny a stropu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="reset-assemblies">Obnovit výchozí skladby</button></div></div>
        <div class="section-layout">
          <div class="section-main">
            <div class="section-controls">
              <label>Název řezu<input id="sectionName" value="${escapeHtml(variant.section.name)}" /></label>
              <label>Směr řezu<select id="sectionOrientation"><option value="x" ${variant.section.orientation === 'x' ? 'selected' : ''}>Svislá čára v půdorysu</option><option value="y" ${variant.section.orientation === 'y' ? 'selected' : ''}>Vodorovná čára v půdorysu</option></select></label>
              <label>Poloha řezu <span id="sectionPositionValue">${variant.section.position} %</span><input id="sectionPosition" type="range" min="0" max="100" value="${variant.section.position}" /></label>
              <label class="check-row"><input id="sectionDimensions" type="checkbox" ${variant.section.showDimensions ? 'checked' : ''} /> Zobrazit hlavní kóty</label>
            </div>
            <div class="canvas-wrap section-canvas-wrap"><canvas id="sectionCanvas" width="1200" height="700"></canvas></div>
            <div class="info-box"><strong>Výpočet:</strong> výška stěn ${planNumber(variant.plan.wallHeight)} m · skladba podlahy ${metrics.floorBuildUp} mm · skladba stěny ${metrics.wallBuildUp} mm · strop ${metrics.ceilingBuildUp} mm.</div>
          </div>
          <aside class="assembly-panel">
            ${renderAssemblyList(variant, 'floor', 'Podlaha')}
            ${renderAssemblyList(variant, 'wall', 'Stěna')}
            ${renderAssemblyList(variant, 'ceiling', 'Strop / podhled')}
            <div class="info-box warning"><strong>Řez je schematický.</strong><br>Výšky a tloušťky vycházejí z vašich vstupů. Statické, hydroizolační a instalační detaily musí ověřit odborník.</div>
          </aside>
        </div>
      </div>`;
  }

  function planNumber(value) { return Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 2 }); }

  function materialOptions(variant, selected = '') {
    return `<option value="">Bez přiřazeného materiálu</option>${variant.materials.map((item) => `<option value="${item.id}" ${selected === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}`;
  }

  function renderModelTab(project, variant) {
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>3D model s materiály</h2><p>Prostorový náhled vzniká z půdorysu a může používat barvy skutečných materiálů projektu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="reset-camera">Výchozí pohled</button></div></div>
        <div class="editor-layout" style="grid-template-columns:210px minmax(600px,1fr) 280px">
          <div class="editor-tools"><div class="tool-group"><div class="tool-title">Zobrazení</div><button class="tool-btn ${state.modelMode === 'technical' ? 'active' : ''}" data-model-mode="technical">Technický model</button><button class="tool-btn ${state.modelMode === 'material' ? 'active' : ''}" data-model-mode="material">Materiálový model</button><button class="tool-btn" disabled title="Fotorealistický render není součástí přesného lokálního modelu">Fotorealistický render</button></div><div class="tool-group"><div class="tool-title">Viditelné instalace</div>${Object.entries(LAYERS).map(([key, layer]) => `<span class="legend-row ${variant.plan.layerVisibility[key] ? '' : 'muted'}"><i style="background:${layer.color}"></i>${escapeHtml(layer.label)}</span>`).join('')}</div></div>
          <div class="editor-stage"><div class="canvas-wrap"><canvas id="modelCanvas" width="1100" height="700"></canvas></div></div>
          <div class="editor-properties"><div class="tool-title">Kamera a povrchy</div><div class="property-list">
            <label>Otočení<input id="cameraAngle" type="range" min="0" max="360" value="${state.threeD.angle}" /></label><label>Náklon<input id="cameraTilt" type="range" min="10" max="55" value="${state.threeD.tilt}" /></label><label>Přiblížení<input id="cameraZoom" type="range" min="0.5" max="2" step="0.05" value="${state.threeD.zoom}" /></label>
            <label>Materiál stěn<select id="wallMaterialSelect">${materialOptions(variant, variant.appearance.wallMaterialId)}</select></label>
            <label>Materiál podlahy<select id="floorMaterialSelect">${materialOptions(variant, variant.appearance.floorMaterialId)}</select></label>
            <label>Materiál stropu<select id="ceilingMaterialSelect">${materialOptions(variant, variant.appearance.ceilingMaterialId)}</select></label>
            <div class="info-box"><strong>Materiálový režim</strong><br>Používá povrchy a barvy z knihovny projektu. Jde o prostorový návrh, nikoli fotorealistický stavební render.</div>
          </div></div>
        </div>
      </div>`;
  }

  function renderPresentationTab(project, variant) {
    const support = state.xrSupport || { checked: false, vr: false, ar: false, secure: window.isSecureContext };
    return `<div class="presentation-layout"><section class="panel presentation-stage"><div class="panel-head"><div><p class="eyebrow">Prezentační režim v6</p><h2>Průchod návrhem a virtuální prostor</h2><p>Pohybuj se návrhem jako v jednoduché 3D prohlídce; na telefonu lze použít orientaci zařízení.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="fullscreen-presentation">Celá obrazovka</button><button class="btn btn-primary" data-action="start-webxr" ${support.vr ? '' : 'disabled'}>Spustit ve VR</button></div></div><div class="walkthrough-wrap" id="walkthroughWrap"><canvas id="walkthroughCanvas" width="1280" height="760"></canvas><div class="walkthrough-hud"><span>WASD / šipky · tažením rozhlížení</span><strong id="walkthroughPosition">—</strong></div></div></section><aside class="panel presentation-controls"><div class="panel-body"><p class="eyebrow">Ovládání</p><div class="move-pad"><button data-walk="forward">▲</button><button data-walk="left">◀</button><button data-walk="back">▼</button><button data-walk="right">▶</button></div><label>Úhel pohledu<input id="presentationFov" type="range" min="45" max="105" value="${variant.presentation.fov}" /></label><label class="check-row"><input id="presentationObjects" type="checkbox" ${variant.presentation.showObjects ? 'checked' : ''}/> zobrazit vybavení</label><label class="check-row"><input id="presentationLabels" type="checkbox" ${variant.presentation.showLabels ? 'checked' : ''}/> zobrazit názvy prvků</label><button class="btn btn-secondary" style="width:100%" data-action="reset-walkthrough">Vrátit kameru doprostřed</button><button class="btn btn-secondary" style="width:100%" data-action="toggle-gyro">${state.presentation.gyro ? 'Vypnout gyroskop' : 'Zapnout gyroskop telefonu'}</button><button class="btn btn-ghost" style="width:100%" data-action="check-xr">Ověřit VR/AR podporu</button><div class="xr-status"><strong>${support.checked ? (support.vr ? 'VR režim je dostupný' : 'VR režim není v tomto prohlížeči dostupný') : 'Podpora XR nebyla ověřena'}</strong><span>${support.secure ? 'Zabezpečený kontext: ano' : 'Zabezpečený kontext: ne – WebXR může být blokován'}</span><span>AR: ${support.ar ? 'podporováno' : 'nezjištěno / nepodporováno'}</span></div><div class="info-box"><strong>Bez headsetu:</strong><br>Režim průchodu, celá obrazovka a gyroskop fungují jako prezentační náhled. Skutečné VR se zobrazí jen na kompatibilním zařízení a prohlížeči.</div></div></aside></div>`;
  }

  function renderMaterialsTab(project, variant) {
    const metrics = computeProjectMetrics(variant);
    const total = variant.materials.reduce((sum, item) => sum + materialTotal(item, metrics), 0);
    const query = state.filters.materials.trim().toLowerCase();
    const filtered = variant.materials.filter((item) => !query || `${item.name} ${item.category} ${item.manufacturer} ${item.sku} ${item.note}`.toLowerCase().includes(query));
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Výrobky, materiály a spotřeba</h2><p>Konkrétní položky, automatický výpočet množství, prořez a cena za jednotku.</p></div><div class="panel-actions"><span class="btn btn-ghost">Materiály: ${money(total)}</span><button class="btn btn-primary" data-action="add-material">+ Přidat položku</button></div></div>
        <div class="panel-body">
          <div class="calculation-strip"><span><strong>${measure(metrics.floorArea)}</strong> podlaha</span><span><strong>${measure(metrics.wallArea)}</strong> stěny</span><span><strong>${measure(metrics.ceilingArea)}</strong> strop</span><span><strong>${measure(metrics.perimeter, 'm')}</strong> obvod</span></div>
          <div class="list-filter"><label>Hledat v materiálech<input id="materialsSearch" value="${escapeHtml(state.filters.materials)}" placeholder="název, výrobce, kategorie, kód…"></label><span>${filtered.length} / ${variant.materials.length}</span></div>
          <div class="material-grid">${filtered.length ? filtered.map((item) => renderMaterialCard(item, metrics)).join('') : variant.materials.length ? '<div class="empty-mini">Žádná položka neodpovídá filtru.</div>' : `<div class="empty-state"><strong>Zatím zde nejsou žádné položky</strong><p>Přidejte konkrétní výrobek nebo materiál a určete způsob výpočtu spotřeby.</p><button class="btn btn-primary" data-action="add-material">Přidat první položku</button></div>`}</div>
        </div>
      </div>`;
  }

  function renderMaterialCard(item, metrics) {
    const dims = [item.width, item.depth, item.height].filter(Boolean).join(' × ');
    const quantity = materialQuantity(item, metrics);
    const total = materialTotal(item, metrics);
    const target = materialTarget(item, metrics);
    return `
      <article class="material-card">
        <div class="card-icon-actions"><button data-action="edit-material" data-id="${item.id}" title="Upravit">✎</button><button data-action="remove-material" data-id="${item.id}" title="Odstranit">×</button></div>
        <div class="material-top"><div class="swatch" style="background:${escapeHtml(item.swatch || '#647580')}"></div><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.manufacturer || item.category || 'Položka')}${item.sku ? ` · ${escapeHtml(item.sku)}` : ''}</p></div></div>
        <div class="material-details">
          <span>Rozměry <b>${dims ? `${escapeHtml(dims)} mm` : 'neuvedeny'}</b></span>
          <span>Výpočet <b>${calculationLabel(item.calculation)}</b></span>
          ${item.calculation !== 'manual' ? `<span>Výpočtový základ <b>${measure(target, item.calculation === 'perimeter' ? 'm' : 'm²')}</b></span><span>Vydatnost / rezerva <b>${parseNum(item.coverage)} / ${parseNum(item.wastePercent)} %</b></span>` : ''}
          <span>Množství <b>${planNumber(quantity)} ${escapeHtml(item.unit)}</b></span>
          <span>Jednotková cena <b>${money(item.unitPrice)}</b></span>
          <span class="material-total">Celkem <b>${money(total)}</b></span>
          ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
        </div>
        ${item.url ? `<a class="material-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Otevřít zdrojový odkaz ↗</a>` : ''}
      </article>`;
  }

  function renderBudgetTab(project, variant) {
    const summary = budgetSummary(variant);
    const query = state.filters.budget.trim().toLowerCase();
    const materials = variant.materials.filter((item) => !query || `${item.name} ${item.category} ${item.manufacturer} ${item.sku} ${item.note}`.toLowerCase().includes(query));
    const costLines = variant.costs.lines.filter((item) => !query || `${item.name} ${item.category} ${item.unit} ${item.note}`.toLowerCase().includes(query));
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Orientační rozpočet</h2><p>Materiály se přebírají z výpočtu spotřeby. Samostatně lze evidovat práci, dopravu, pronájem a další náklady.</p></div><div class="panel-actions"><button class="btn btn-primary" data-action="add-cost">+ Přidat náklad</button></div></div>
        <div class="panel-body budget-body">
          <div class="budget-kpis"><div><span>Materiály</span><strong>${money(summary.materials)}</strong></div><div><span>Práce a služby</span><strong>${money(summary.services)}</strong></div><div><span>Rezerva</span><strong>${money(summary.contingency)}</strong></div><div class="budget-total"><span>Celkem</span><strong>${money(summary.total)}</strong></div></div>
          <div class="budget-settings"><label>Rezerva (%)<input id="contingencyPercent" type="number" min="0" max="100" step="1" value="${variant.costs.contingencyPercent}" /></label><label>DPH (%)<input id="vatPercent" type="number" min="0" max="30" step="1" value="${variant.costs.vatPercent}" /></label><div class="info-box">DPH je ve výchozím nastavení 0 %, protože u nabídek se může lišit způsob uvedení ceny. Zadejte ji pouze tehdy, když ji chcete do součtu zahrnout.</div></div>
          <div class="list-filter"><label>Hledat v rozpočtu<input id="budgetSearch" value="${escapeHtml(state.filters.budget)}" placeholder="položka, kategorie, poznámka…"></label><span>${materials.length + costLines.length} / ${variant.materials.length + variant.costs.lines.length}</span></div>
          <div class="budget-table-wrap"><table class="budget-table"><thead><tr><th>Položka</th><th>Typ</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th><th></th></tr></thead><tbody>
            ${materials.map((item) => { const qty = materialQuantity(item, summary.metrics); return `<tr><td><span class="table-swatch" style="background:${escapeHtml(item.swatch)}"></span><strong>${escapeHtml(item.name)}</strong></td><td>Materiál</td><td>${planNumber(qty)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(materialTotal(item, summary.metrics))}</strong></td><td><button class="table-action" data-action="edit-material" data-id="${item.id}">Upravit</button></td></tr>`; }).join('')}
            ${costLines.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</td><td>${escapeHtml(item.category)}</td><td>${planNumber(item.quantity)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(parseNum(item.quantity) * parseNum(item.unitPrice))}</strong></td><td><button class="table-action" data-action="edit-cost" data-id="${item.id}">Upravit</button><button class="table-action danger" data-action="remove-cost" data-id="${item.id}">Smazat</button></td></tr>`).join('')}
            ${!materials.length && !costLines.length ? '<tr><td colspan="6"><div class="empty-mini">Žádná položka neodpovídá filtru.</div></td></tr>' : ''}
          </tbody><tfoot><tr><td colspan="4">Mezisoučet</td><td>${money(summary.base)}</td><td></td></tr><tr><td colspan="4">Rezerva ${variant.costs.contingencyPercent} %</td><td>${money(summary.contingency)}</td><td></td></tr>${variant.costs.vatPercent ? `<tr><td colspan="4">DPH ${variant.costs.vatPercent} %</td><td>${money(summary.vat)}</td><td></td></tr>` : ''}<tr class="grand-total"><td colspan="4">Orientační celek</td><td>${money(summary.total)}</td><td></td></tr></tfoot></table></div>
          <div class="info-box warning"><strong>Rozpočet je orientační.</strong><br>Nezahrnuje automaticky skryté práce, technické návaznosti, dopravu ani cenové změny. Pro objednávku jej porovnejte s konkrétní nabídkou.</div>
        </div>
      </div>`;
  }

  function renderComparisonTab(project, variant) {
    const comparison = variant.comparison;
    const before = comparison.beforeDataUrl || variant.photo.dataUrl;
    const after = comparison.afterDataUrl;
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Porovnání před / po</h2><p>Fotografie původního stavu a plánovaná vizualizace v jednom interaktivním pohledu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="use-project-photo-before">Použít projektovou fotografii</button><button class="btn btn-secondary" data-action="generate-model-after">Vytvořit „po“ z 3D modelu</button></div></div>
        <div class="comparison-layout">
          <div class="comparison-main">
            <div class="comparison-frame" id="comparisonFrame">
              ${after ? `<div class="compare-image compare-after"><img src="${after}" alt="Navrhovaný stav" /></div>` : '<div class="compare-placeholder after"><strong>Chybí plánovaný stav</strong><span>Nahrajte vizualizaci nebo ji vytvořte z 3D modelu.</span></div>'}
              ${before ? `<div class="compare-image compare-before" id="compareBeforeLayer" style="clip-path:inset(0 ${100-comparison.slider}% 0 0)"><img src="${before}" alt="Původní stav" /></div>` : '<div class="compare-placeholder before"><strong>Chybí původní stav</strong><span>Nahrajte fotografii nebo použijte projektovou fotografii.</span></div>'}
              <div class="compare-divider" id="compareDivider" style="left:${comparison.slider}%"><span>↔</span></div>
              <span class="compare-label left">${escapeHtml(comparison.beforeLabel)}</span><span class="compare-label right">${escapeHtml(comparison.afterLabel)}</span>
            </div>
            <label class="comparison-slider">Poměr zobrazení<input id="comparisonSlider" type="range" min="0" max="100" value="${comparison.slider}" /></label>
          </div>
          <aside class="comparison-panel">
            <button class="btn btn-primary" data-action="upload-compare-before">Nahrát fotografii „před“</button><button class="btn btn-primary" data-action="upload-compare-after">Nahrát vizualizaci „po“</button><button class="btn btn-ghost" data-action="swap-comparison">Prohodit obrázky</button>
            <label>Popisek vlevo<input id="comparisonBeforeLabel" value="${escapeHtml(comparison.beforeLabel)}" /></label><label>Popisek vpravo<input id="comparisonAfterLabel" value="${escapeHtml(comparison.afterLabel)}" /></label><label>Poznámka k porovnání<textarea id="comparisonNotes" rows="6">${escapeHtml(comparison.notes || '')}</textarea></label>
            <div class="info-box"><strong>Tip:</strong> pro nejlepší porovnání použijte shodný úhel pohledu a podobný poměr stran obou obrázků.</div>
          </aside>
        </div>
      </div>`;
  }

/* DOMUS Precision 2D: premium plan workspace and layer controls. */
  function renderPlanTab(project,variant){const plan=variant.plan,metrics=computeProjectMetrics(variant),selected=state.selectedPlanIds||new Set(),elements=allElementLibrary().filter(i=>i.layer===state.activeLayer);plan.layerLocks||={};plan.showDimensions=plan.showDimensions!==false;return`<div class="panel precision-panel"><div class="panel-head"><div><p class="eyebrow">DOMUS Precision 2D</p><h2>Přesný půdorys, kóty a instalační vrstvy</h2><p>Magnetické body, ortogonální kreslení, vícenásobný výběr, uzamykání vrstev a export DXF.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="fit-plan">Přizpůsobit</button><button class="btn btn-ghost" data-action="undo-plan" ${state.planHistory.length?'':'disabled'}>Zpět</button><button class="btn btn-ghost" data-action="redo-plan" ${state.redoPlanHistory?.length?'':'disabled'}>Vpřed</button><button class="btn btn-secondary" data-action="export-dxf">Export DXF</button><button class="btn btn-ghost btn-danger" data-action="clear-plan">Vymazat</button></div></div>${selected.size?`<div class="selection-toolbar"><strong>Vybráno: ${selected.size}</strong><button class="btn btn-ghost" data-action="duplicate-selection">Duplikovat</button><button class="btn btn-ghost" data-action="mirror-selection-x">Zrcadlit X</button><button class="btn btn-ghost" data-action="mirror-selection-y">Zrcadlit Y</button><button class="btn btn-ghost" data-action="align-selection-left">Zarovnat vlevo</button><button class="btn btn-ghost" data-action="align-selection-top">Zarovnat nahoru</button><button class="btn btn-ghost" data-action="save-selection-library">Uložit prvek</button><button class="btn btn-danger" data-action="delete-selection">Odstranit</button></div>`:''}<div class="editor-layout editor-layout-wide-tools"><div class="editor-tools"><div class="tool-group"><div class="tool-title">Kreslení</div>${[['select','Vybrat'],['wall','Stěna'],['object','Vložit prvek'],['delete','Odstranit']].map(([k,l])=>`<button class="tool-btn ${state.planTool===k?'active':''}" data-plan-tool="${k}">${l}</button>`).join('')}</div><div class="tool-group"><div class="tool-title">Magnetické body</div><label class="check-row"><input id="snapGrid" type="checkbox" ${state.planSnap.grid?'checked':''}> mřížka</label><label class="check-row"><input id="snapEndpoints" type="checkbox" ${state.planSnap.endpoints?'checked':''}> rohy a konce</label><label class="check-row"><input id="snapOrthogonal" type="checkbox" ${state.planSnap.orthogonal?'checked':''}> pravé úhly</label><label>Rozteč (mm)<input id="snapGridMm" type="number" min="10" max="2000" step="10" value="${state.planSnap.gridMm}"></label></div><div class="tool-group"><div class="tool-title">Vrstvy</div>${Object.entries(LAYERS).map(([k,l])=>`<div class="layer-row ${state.activeLayer===k?'active':''}"><label><input type="checkbox" data-layer-toggle="${k}" ${plan.layerVisibility[k]?'checked':''}><span class="layer-dot" style="background:${l.color}"></span></label><button data-active-layer="${k}">${escapeHtml(l.label)}</button><label title="Zamknout"><input type="checkbox" data-layer-lock="${k}" ${plan.layerLocks[k]?'checked':''}>🔒</label></div>`).join('')}</div><div class="tool-group"><div class="tool-title">Knihovna</div>${elements.map(e=>`<button class="tool-btn library-btn ${state.planElementKey===e.key?'active':''}" data-library-element="${e.key}"><span style="background:${e.color}"></span>${escapeHtml(e.name)}</button>`).join('')}</div></div><div class="editor-stage"><div class="canvas-wrap"><canvas id="planCanvas" width="1100" height="700" aria-label="Přesný 2D výkres"></canvas><div id="planCoordinateHud" class="coordinate-hud">x 0 mm · y 0 mm</div></div><details class="canvas-object-list"><summary>Seznam prvků (${plan.walls.length+plan.objects.length})</summary><div class="table-wrap"><table><tbody>${plan.walls.map((w,i)=>`<tr><td><input type="checkbox" data-plan-select="${w.id}" ${selected.has(w.id)?'checked':''}></td><td>Stěna ${i+1}</td><td>${planNumber(Math.hypot(w.x2-w.x1,w.y2-w.y1)/plan.scale)} m</td><td><button class="table-action" data-action="edit-plan-wall" data-id="${w.id}">Upravit</button></td></tr>`).join('')}${plan.objects.map(o=>`<tr><td><input type="checkbox" data-plan-select="${o.id}" ${selected.has(o.id)?'checked':''}></td><td>${escapeHtml(o.type)}</td><td>${Math.round(o.width/plan.scale*1000)} × ${Math.round(o.depth/plan.scale*1000)} mm · ${Math.round(o.rotation||0)}°</td><td><button class="table-action" data-action="edit-plan-object" data-id="${o.id}">Upravit</button></td></tr>`).join('')}</tbody></table></div></details></div><aside class="editor-properties"><div class="tool-title">Parametry</div><div class="property-list"><label>Měřítko<select id="planScale">${[20,40,50,60,80,100,120,140].map(v=>`<option value="${v}" ${plan.scale===v?'selected':''}>${v} px = 1 m</option>`).join('')}</select></label><label>Výška stěn (m)<input id="wallHeight" type="number" min="1" max="8" step=".05" value="${plan.wallHeight}"></label><label>Tloušťka stěn (m)<input id="wallThickness" type="number" min=".05" max=".8" step=".01" value="${plan.wallThickness}"></label><label class="check-row"><input id="showPlanDimensions" type="checkbox" ${plan.showDimensions?'checked':''}> automatické kóty</label><div class="info-box"><strong>${plan.walls.length} stěn · ${plan.objects.length} prvků</strong><br>Podlaha ${measure(metrics.floorArea)} · stěny ${measure(metrics.wallArea)}.</div><div class="info-box warning">Shift přidává prvky do výběru. Ctrl/Cmd+Z vrací krok, Shift+Ctrl/Cmd+Z jej obnoví.</div></div></aside></div></div>`;}

/* Verify, Tender, BuildLog and PDF views. Source fragment; assembled by scripts/build.mjs. */
  const AUDIT_SEVERITY = DomusAudit.SEVERITY;
  const SOURCE_META = {
    measured: { label: 'Fyzicky změřeno', confidence: 100, className: 'verified' },
    derived: { label: 'Odvozeno', confidence: 75, className: 'derived' },
    estimate: { label: 'Odhad', confidence: 40, className: 'estimate' },
    ai: { label: 'AI návrh', confidence: 25, className: 'ai' },
  };

  function buildAuditReport(variant) {
    const summary = budgetSummary(variant);
    return DomusAudit.buildReport(variant, summary.metrics, summary.total);
  }
  function auditBadge(score){return score>=85?'Připravenější':score>=60?'Vyžaduje kontrolu':'Vysoké riziko';}
  function renderAuditTab(project, variant) {
    const report = buildAuditReport(variant), counts = { critical: 0, warning: 0, info: 0 };
    report.open.forEach((item) => counts[item.severity]++);
    const query = state.filters.auditText.trim().toLowerCase();
    const visibleIssues = report.issues.filter((item) => (state.filters.auditSeverity === 'all' || item.severity === state.filters.auditSeverity) && (state.filters.auditStatus === 'all' || item.status === state.filters.auditStatus) && (!query || `${item.title} ${item.detail} ${item.overrideNote || ''}`.toLowerCase().includes(query)));
    const grouped = ['critical', 'warning', 'info'].map((severity) => {
      const items = visibleIssues.filter((item) => item.severity === severity);
      return `<section class="audit-group"><div class="audit-group-head"><h3>${AUDIT_SEVERITY[severity].label}</h3><span>${items.filter((item) => item.status === 'open').length} otevřených</span></div>${items.length ? items.map((item) => `<article class="audit-item ${severity} ${item.status !== 'open' ? 'muted' : ''}"><div class="audit-icon">${severity === 'critical' ? '!' : severity === 'warning' ? '△' : 'i'}</div><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><small>Stav: ${item.status === 'resolved' ? 'doloženě vyřešeno' : item.status === 'ignored' ? 'přijaté riziko' : 'otevřeno'}${item.overrideNote ? ` · ${escapeHtml(item.overrideNote)}` : ''}</small></div><div class="audit-actions"><button class="table-action" data-tab-jump="${item.tab}">Otevřít část</button>${item.status === 'open' ? `<button class="table-action" data-action="set-audit-status" data-id="${item.id}" data-fingerprint="${item.fingerprint}" data-status="resolved">Vyřešeno</button><button class="table-action" data-action="set-audit-status" data-id="${item.id}" data-fingerprint="${item.fingerprint}" data-status="ignored">Přijmout riziko</button>` : `<button class="table-action" data-action="set-audit-status" data-id="${item.id}" data-status="open">Obnovit</button>`}</div></article>`).join('') : '<div class="empty-mini">Bez nálezů v této kategorii.</div>'}</section>`;
    }).join('');
    return `<div class="panel"><div class="panel-head"><div><p class="eyebrow">DOMUS Verify</p><h2>Kontrola kolizí, rozměrů a připravenosti</h2><p>Automatická předběžná kontrola skutečného polygonu, vedení instalací a původu údajů. Nenahrazuje autorizované posouzení.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="reset-audit-overrides">Obnovit všechna rozhodnutí</button><button class="btn btn-primary" data-action="print-audit">Vytisknout kontrolní protokol</button></div></div>
      <div class="audit-score-pair"><div class="audit-score"><strong>${report.technicalScore}</strong><span>/ 100</span><small>technický stav</small></div><div class="audit-score accepted"><strong>${report.acceptedScore}</strong><span>/ 100</span><small>po přijetí rizik</small></div></div>
      <div class="audit-kpis"><div><small>Kritické</small><strong>${counts.critical}</strong></div><div><small>Varování</small><strong>${counts.warning}</strong></div><div><small>Neověřené rozměry</small><strong>${report.source.unverified}</strong></div><div><small>Navázaná měření</small><strong>${report.source.linked}/${report.source.measured}</strong></div></div>
      <div class="audit-domains">${report.domains.map((domain) => `<div class="${domain.critical ? 'critical' : domain.open ? 'warning' : 'ok'}"><strong>${escapeHtml(domain.label)}</strong><span>${domain.open ? `${domain.open} otevřených` : 'bez otevřených nálezů'}</span></div>`).join('')}</div>
      <div class="confidence-legend">${Object.entries(SOURCE_META).map(([key, item]) => `<span class="confidence-chip ${item.className}"><i></i>${item.label} · výchozí jistota ${item.confidence} %</span>`).join('')}</div>
      <div class="audit-filter"><label>Hledat<input id="auditSearch" value="${escapeHtml(state.filters.auditText)}" placeholder="nález, detail, zdůvodnění…"></label><label>Závažnost<select id="auditSeverity"><option value="all">Všechny</option><option value="critical" ${state.filters.auditSeverity === 'critical' ? 'selected' : ''}>Kritické</option><option value="warning" ${state.filters.auditSeverity === 'warning' ? 'selected' : ''}>Varování</option><option value="info" ${state.filters.auditSeverity === 'info' ? 'selected' : ''}>Informace</option></select></label><label>Stav<select id="auditStatus"><option value="all">Všechny</option><option value="open" ${state.filters.auditStatus === 'open' ? 'selected' : ''}>Otevřené</option><option value="resolved" ${state.filters.auditStatus === 'resolved' ? 'selected' : ''}>Vyřešené</option><option value="ignored" ${state.filters.auditStatus === 'ignored' ? 'selected' : ''}>Přijaté riziko</option></select></label><span>${visibleIssues.length} / ${report.issues.length}</span></div>
      <div class="audit-groups">${grouped}</div><div class="info-box warning"><strong>Bezpečnostní hranice:</strong><br>Technické skóre se nezvyšuje pouhým přijetím rizika. Statiku, hydroizolaci, požární bezpečnost, elektroinstalaci, plyn a technologické odstupy musí ověřit kvalifikovaný odborník.</div></div>`;
  }


  function renderRfqTab(project,variant){const rfq=variant.rfq, report=buildAuditReport(variant), summary=budgetSummary(variant);return `<div class="panel"><div class="panel-head"><div><p class="eyebrow">DOMUS Tender</p><h2>Poptávkový balíček pro dodavatele</h2><p>Jednoznačné zadání, výkresové podklady, seznam položek a otevřené otázky v jednom souboru.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="download-rfq-csv">Tabulka pro nacenění</button><button class="btn btn-secondary" data-action="download-rfq-html">Stáhnout ZIP balíček</button><button class="btn btn-primary" data-action="print-rfq">Uložit jako PDF</button></div></div><div class="rfq-layout"><div class="rfq-form"><div class="form-grid"><label>Typ balíčku<select id="rfqMode"><option value="technical" ${rfq.mode!=='presentation'?'selected':''}>Technický balíček</option><option value="presentation" ${rfq.mode==='presentation'?'selected':''}>Prezentační balíček</option></select></label><label>Název poptávky<input id="rfqTitle" value="${escapeHtml(rfq.title||`Poptávka · ${project.name}`)}" /></label><label>Požadovaný termín nabídky<input id="rfqDeadline" type="date" value="${escapeHtml(rfq.deadline||'')}" /></label></div><div class="form-grid"><label>Oslovená firma<input id="rfqRecipient" value="${escapeHtml(rfq.recipient||'')}" placeholder="Lze ponechat prázdné pro univerzální balíček" /></label><label>Kontaktní osoba / spojení<input id="rfqContact" value="${escapeHtml(rfq.contact||'')}" /></label></div><label>Rozsah požadovaných prací<textarea id="rfqScope" rows="6" placeholder="Co přesně má firma dodat, namontovat, ověřit a uvést do provozu?">${escapeHtml(rfq.scope||project.summary||'')}</textarea></label><label>Co není součástí poptávky<textarea id="rfqExclusions" rows="3" placeholder="Např. bourací práce, elektro příprava, odvoz suti…">${escapeHtml(rfq.exclusions||'')}</textarea></label><label>Otázky, které má nabídka zodpovědět<textarea id="rfqQuestions" rows="5" placeholder="Každou otázku napište na samostatný řádek.">${escapeHtml(rfq.questions||'')}</textarea></label><label>Pokyny pro zpracování nabídky<textarea id="rfqInstructions" rows="4">${escapeHtml(rfq.responseInstructions||'Uveďte cenu materiálu a práce odděleně, termín realizace, délku záruky, platební podmínky a seznam předpokladů nabídky.')}</textarea></label><div class="rfq-options"><label class="check-row"><input id="rfqIncludePhotos" type="checkbox" ${rfq.includePhotos?'checked':''}/> Zahrnout fotografie</label><label class="check-row"><input id="rfqIncludePrices" type="checkbox" ${rfq.includePrices?'checked':''}/> Zahrnout moje orientační ceny</label><label class="check-row"><input id="rfqAnonymizeLocation" type="checkbox" ${rfq.anonymizeLocation?'checked':''}/> Skrýt přesné umístění</label><label class="check-row"><input id="rfqRemoveGps" type="checkbox" ${rfq.removeGps?'checked':''}/> Neuvádět GPS údaje</label></div><button class="btn btn-primary" data-action="save-rfq">Uložit nastavení poptávky</button></div><aside class="rfq-preview"><p class="eyebrow">Kontrola před odesláním</p><h3>${escapeHtml(rfq.title||`Poptávka · ${project.name}`)}</h3><div class="rfq-readiness ${report.technicalScore>=75?'good':'warn'}"><strong>${report.technicalScore}/100</strong><span>${auditBadge(report.technicalScore)}</span></div><ul class="check-list"><li>${variant.plan.walls.length?'✓':'!'} 2D půdorys a ${variant.plan.objects.length} prvků</li><li>${variant.materials.length?'✓':'!'} ${variant.materials.length} výrobků a materiálů</li><li>${variant.field.sessions.flatMap((s)=>s.measurements).filter((m)=>m.verified).length?'✓':'!'} ověřené rozměry</li><li>${report.open.filter((i)=>i.severity==='critical').length?'!':'✓'} ${report.open.filter((i)=>i.severity==='critical').length} kritických nálezů</li><li>Orientační rozsah ${money(summary.total)}</li></ul><div class="info-box"><strong>Anonymizovaná kopie</strong><br>Balíček může vynechat přesné umístění a GPS. Původní projekt v aplikaci se tím nemění.</div></aside></div></div>`;}

  function diaryTotals(variant){const entries=variant.diary.entries||[];return {planned:entries.reduce((s,e)=>s+parseNum(e.plannedCost),0),actual:entries.reduce((s,e)=>s+parseNum(e.actualCost),0)};}
  function warrantyExpiry(item){if(!item.purchaseDate)return null;const date=new Date(`${item.purchaseDate}T12:00:00`);date.setMonth(date.getMonth()+parseNum(item.warrantyMonths,24));return date;}
  function renderDiaryTab(project, variant) {
    const diary = variant.diary;
    const totals = diaryTotals(variant);
    const budget = budgetSummary(variant);
    const query = state.diaryFilter.trim().toLowerCase();
    const entries = [...(diary.entries || [])]
      .filter((entry) => !query || `${entry.date} ${entry.type} ${entry.title} ${entry.contractor} ${entry.responsible} ${entry.weather} ${entry.status} ${entry.note}`.toLowerCase().includes(query))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const passport = (diary.passport || []).filter((item) => !query || `${item.category} ${item.name} ${item.location} ${item.depth} ${item.description}`.toLowerCase().includes(query));
    const warranties = (diary.warranties || []).filter((item) => !query || `${item.item} ${item.supplier} ${item.serial} ${item.note} ${(item.documents || []).map((doc) => doc.name).join(' ')}`.toLowerCase().includes(query));
    const today = new Date();
    return `<div class="panel">
      <div class="panel-head"><div><p class="eyebrow">DOMUS BuildLog</p><h2>Stavební deník a technický pas</h2><p>Průběh realizace, skutečné náklady, skryté rozvody, záruky a dokumenty zůstávají u projektu i po dokončení.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="new-warranty">+ Záruka / doklad</button><button class="btn btn-primary" data-action="new-diary-entry">+ Záznam realizace</button></div></div>
      <div class="diary-stats"><div><small>Plánované náklady z deníku</small><strong>${money(totals.planned)}</strong></div><div><small>Skutečné náklady</small><strong>${money(totals.actual)}</strong></div><div><small>Rozdíl proti plánu deníku</small><strong class="${totals.actual > totals.planned ? 'negative' : 'positive'}">${money(totals.actual - totals.planned)}</strong></div><div><small>Rozpočet projektu</small><strong>${money(budget.total)}</strong></div></div>
      <div class="diary-toolbar"><label>Hledat v realizaci<input id="diarySearch" value="${escapeHtml(state.diaryFilter)}" placeholder="záznam, firma, skrytý prvek, záruka, doklad…"></label><span>${entries.length} záznamů</span></div>
      <div class="diary-layout"><section><div class="subsection-head"><div><h3>Chronologie realizace</h3><p>Fotografie před zakrytím instalací mají nejvyšší budoucí hodnotu.</p></div></div>
      <div class="timeline">${entries.length ? entries.map((entry) => `<article class="timeline-entry"><div class="timeline-date"><strong>${entry.date ? formatDate(entry.date) : 'Bez data'}</strong><span>${escapeHtml(entry.type || 'Záznam')}</span></div><div class="timeline-card"><div class="timeline-top"><div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.contractor || 'Dodavatel neuveden')} · ${escapeHtml(entry.status || 'Rozpracováno')}</p><small>${entry.responsible ? `Odpovědná osoba: ${escapeHtml(entry.responsible)} · ` : ''}${entry.workers ? `${planNumber(entry.workers)} pracovníků · ` : ''}${entry.weather ? escapeHtml(entry.weather) : ''}</small></div><div class="timeline-cost"><small>skutečnost</small><strong>${money(entry.actualCost)}</strong></div></div><p>${escapeHtml(entry.note || 'Bez poznámky.')}</p>${entry.history?.length ? `<details><summary>Historie změn (${entry.history.length})</summary><ul>${entry.history.slice().reverse().map((change) => `<li>${formatDateTime(change.changedAt)} · ${escapeHtml(change.snapshot?.title || 'Předchozí verze')} · ${escapeHtml(change.snapshot?.status || '')}</li>`).join('')}</ul></details>` : ''}${entry.photos?.length ? `<div class="diary-photo-strip">${entry.photos.map((photo) => `<figure><img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || entry.title)}"><figcaption>${escapeHtml(photo.name || 'Fotografie')}</figcaption></figure>`).join('')}</div>` : ''}<div class="timeline-actions"><button class="table-action" data-action="upload-diary-photo" data-id="${entry.id}">Přidat fotografie</button><button class="table-action" data-action="edit-diary-entry" data-id="${entry.id}">Upravit</button><button class="table-action danger" data-action="remove-diary-entry" data-id="${entry.id}">Smazat</button></div></div></article>`).join('') : '<div class="empty-mini">Žádný záznam neodpovídá filtru nebo zatím nebyla realizace zaznamenána.</div>'}</div></section>
      <aside><section class="passport-panel"><div class="subsection-head"><div><h3>Technický pas skrytých prvků</h3><p>Kde přesně vedou kabely, trubky a další konstrukce.</p></div></div>${passport.length ? passport.map((item) => `<article class="passport-card"><span>${escapeHtml(item.category || 'Skrytý prvek')}</span><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.location || 'Poloha neuvedena')}${item.depth ? ` · ${escapeHtml(item.depth)}` : ''}</p><small>${escapeHtml(item.description || '')}</small><div><button class="table-action" data-action="edit-passport-item" data-id="${item.id}">Upravit</button><button class="table-action danger" data-action="remove-passport-item" data-id="${item.id}">Odstranit</button></div></article>`).join('') : '<div class="empty-mini">Technický pas je prázdný. Přidá se automaticky ze záznamu, pokud vyplníte skrytý prvek.</div>'}</section>
      <section class="passport-panel"><div class="subsection-head"><div><h3>Záruky a dokumenty</h3><p>Termíny, sériová čísla, dodavatelé a přiložené doklady.</p></div></div>${warranties.length ? warranties.map((item) => { const expiry = warrantyExpiry(item); const days = expiry ? Math.ceil((expiry - today) / 86400000) : null; const expired = days != null && days < 0; const soon = days != null && days >= 0 && days <= 60; return `<article class="warranty-card ${expired ? 'expired' : soon ? 'warning' : ''}"><div><span>${expired ? 'Záruka skončila' : soon ? `Končí za ${days} dní` : 'Záruka / doklad'}</span><strong>${escapeHtml(item.item)}</strong><p>${escapeHtml(item.supplier || 'Dodavatel neuveden')}</p><small>${expiry ? `do ${formatDate(expiry)}` : 'datum konce nelze určit'}${item.serial ? ` · S/N ${escapeHtml(item.serial)}` : ''}</small></div><div>${item.documents?.map((doc) => `<button class="table-action" data-action="download-warranty-document" data-id="${item.id}" data-doc-id="${doc.id}">${escapeHtml(doc.name)}</button>`).join('') || ''}<button class="table-action" data-action="edit-warranty" data-id="${item.id}">Upravit</button><button class="table-action" data-action="upload-warranty-document" data-id="${item.id}">Přiložit doklad</button><button class="table-action danger" data-action="remove-warranty" data-id="${item.id}">Smazat</button></div></article>`; }).join('') : '<div class="empty-mini">Zatím nejsou evidovány záruky ani návody.</div>'}</section></aside></div></div>`;
  }

  function collectRfqForm(variant){const rfq=variant.rfq; const get=(id)=>document.getElementById(id);rfq.mode=get('rfqMode')?.value||'technical';rfq.title=get('rfqTitle')?.value.trim()||'';rfq.deadline=get('rfqDeadline')?.value||'';rfq.recipient=get('rfqRecipient')?.value.trim()||'';rfq.contact=get('rfqContact')?.value.trim()||'';rfq.scope=get('rfqScope')?.value.trim()||'';rfq.exclusions=get('rfqExclusions')?.value.trim()||'';rfq.questions=get('rfqQuestions')?.value.trim()||'';rfq.responseInstructions=get('rfqInstructions')?.value.trim()||'';rfq.includePhotos=!!get('rfqIncludePhotos')?.checked;rfq.includePrices=!!get('rfqIncludePrices')?.checked;rfq.anonymizeLocation=!!get('rfqAnonymizeLocation')?.checked;rfq.removeGps=!!get('rfqRemoveGps')?.checked;}
  function rfqContent(project,variant){const rfq=variant.rfq,summary=budgetSummary(variant),report=buildAuditReport(variant),location=rfq.anonymizeLocation?'Umístění bude sděleno vybranému dodavateli':project.location||'Neuvedeno';const rows=[...variant.materials.map((item)=>({name:item.name,category:item.category,qty:`${planNumber(materialQuantity(item,summary.metrics))} ${item.unit}`,price:rfq.includePrices?money(item.unitPrice):'',note:item.note||item.url||''})),...variant.costs.lines.map((item)=>({name:item.name,category:item.category,qty:`${planNumber(item.quantity)} ${item.unit}`,price:rfq.includePrices?money(item.unitPrice):'',note:item.note||''}))];return {rfq,summary,report,location,rows};}
  function buildRfqDocument(project,variant,standalone=false){
    const {rfq,summary,report,location,rows}=rfqContent(project,variant); const technical=rfq.mode!=='presentation';
    const photo=rfq.includePhotos?(variant.photo.dataUrl||variant.field.sessions.flatMap((s)=>s.photos||[])[0]?.dataUrl||''):'';
    const planCanvas=document.createElement('canvas');planCanvas.width=1400;planCanvas.height=900;drawPlanCanvas(planCanvas,variant);const planImage=planCanvas.toDataURL('image/png');
    const modelCanvas=document.createElement('canvas');modelCanvas.width=1400;modelCanvas.height=900;drawModelCanvas(modelCanvas,variant.plan,variant,'material');const modelImage=modelCanvas.toDataURL('image/jpeg',.9);
    const style=standalone?`<style>body{font-family:Arial,sans-serif;color:#1b252b;max-width:1000px;margin:40px auto;padding:0 24px}h1{font-size:34px}h2{margin-top:34px;border-bottom:2px solid #c59b62;padding-bottom:8px}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.meta div{background:#f3f0eb;padding:14px;border-radius:8px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d6d0c7;padding:8px;text-align:left;vertical-align:top}img{max-width:100%;max-height:620px;display:block;margin:14px auto}.visuals{display:grid;grid-template-columns:1fr 1fr;gap:16px}.warning{padding:14px;background:#fff4df;border-left:4px solid #d68d27}small{color:#667}@media(max-width:700px){.meta,.visuals{grid-template-columns:1fr}}</style>`:'';
    const table=technical?`<h2>Položky k nacenění</h2><table><thead><tr><th>Položka</th><th>Kategorie</th><th>Množství</th>${rfq.includePrices?'<th>Orientační cena</th>':''}<th>Poznámka / specifikace</th><th>Nabídková cena</th></tr></thead><tbody>${rows.map((row)=>`<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.qty)}</td>${rfq.includePrices?`<td>${escapeHtml(row.price)}</td>`:''}<td>${escapeHtml(row.note)}</td><td></td></tr>`).join('')}</tbody></table>`:`<h2>Požadovaný výsledek</h2><p>Prezentační balíček shrnuje vzhled a hlavní záměr. Přesné položkové nacenění si dodavatel připraví podle technické prohlídky a následně odsouhlasené specifikace.</p>`;
    return `${standalone?'<!doctype html><html lang="cs"><meta charset="utf-8"><title>'+escapeHtml(rfq.title||project.name)+'</title>'+style+'<body>':''}<h1>${escapeHtml(rfq.title||`Poptávka · ${project.name}`)}</h1><p><strong>Revize ${parseNum(rfq.revision,0)} · ${escapeHtml(rfq.exportedVariantId||variant.id)}</strong>${rfq.lastExportHash?` · kontrolní kód ${escapeHtml(rfq.lastExportHash.slice(0,16))}`:''}</p><p>${escapeHtml(rfq.scope||project.summary||'')}</p><div class="meta"><div><small>Typ balíčku</small><br><strong>${technical?'Technický':'Prezentační'}</strong></div><div><small>Projekt</small><br><strong>${escapeHtml(project.name)}</strong></div><div><small>Varianta</small><br><strong>${escapeHtml(variant.name)}</strong></div><div><small>Umístění</small><br><strong>${escapeHtml(location)}</strong></div><div><small>Firma</small><br><strong>${escapeHtml(rfq.recipient||'Univerzální poptávka')}</strong></div><div><small>Termín nabídky</small><br><strong>${escapeHtml(rfq.deadline||'Dohodou')}</strong></div></div>${photo?`<h2>Současný stav</h2><img src="${photo}" alt="Současný stav">`:''}<h2>Navrhovaný stav</h2><div class="visuals"><div><h3>2D podklad</h3><img src="${planImage}" alt="2D výkres"></div><div><h3>3D vizualizace</h3><img src="${modelImage}" alt="3D vizualizace"></div></div><h2>Rozsah a hranice dodávky</h2><p><strong>Požadované práce:</strong><br>${escapeHtml(rfq.scope||project.summary||'').replace(/\n/g,'<br>')}</p><p><strong>Není součástí:</strong><br>${escapeHtml(rfq.exclusions||'Není výslovně stanoveno.').replace(/\n/g,'<br>')}</p>${table}<h2>Otázky pro dodavatele</h2>${renderAnalysisList((rfq.questions||'').split(/\n+/).filter(Boolean),'Bez zvláštních otázek.')}<h2>Požadovaná struktura nabídky</h2><p>${escapeHtml(rfq.responseInstructions||'').replace(/\n/g,'<br>')}</p><div class="warning"><strong>Stav podkladů:</strong> technické skóre ${report.technicalScore}/100; po přijetí rizik ${report.acceptedScore}/100; otevřeno ${report.open.filter((i)=>i.severity==='critical').length} kritických nálezů a ${report.open.filter((i)=>i.severity==='warning').length} varování. Dodavatel musí před cenovou nabídkou nebo realizací ověřit skutečný stav, rozměry a technické návaznosti.</div>${standalone?'</body></html>':''}`;
  }

  async function printAuditProtocol(){const project=currentProject(),variant=currentVariant(project),report=buildAuditReport(variant);printArea.innerHTML=`<div class="print-cover"><div><div class="print-brand">DOMUS Verify · kontrolní protokol</div><h1>${escapeHtml(project.name)}</h1><p class="subtitle">${escapeHtml(variant.name)}</p></div><div><div class="print-meta"><div><small>Technické skóre</small><strong>${report.technicalScore}/100</strong></div><div><small>Po přijetí rizik</small><strong>${report.acceptedScore}/100</strong></div><div><small>Kritické nálezy</small><strong>${report.open.filter((i)=>i.severity==='critical').length}</strong></div><div><small>Varování</small><strong>${report.open.filter((i)=>i.severity==='warning').length}</strong></div></div></div></div><section class="print-section"><h2>Výsledky kontroly</h2>${report.issues.map((item)=>`<div class="print-note"><strong>${AUDIT_SEVERITY[item.severity].label}: ${escapeHtml(item.title)}</strong><br>${escapeHtml(item.detail)}<br><small>Stav: ${escapeHtml(item.status)}</small></div>`).join('')}<p class="print-note">Protokol je automatická předběžná kontrola. Nenahrazuje odborné posouzení.</p></section>`;setTimeout(()=>window.print(),250);}
  async function sha256Text(value) {
    if (!crypto?.subtle) return '';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  async function prepareRfqRevision(project, variant) {
    const rfq = variant.rfq;
    rfq.revision = parseNum(rfq.revision, 0) + 1;
    rfq.lastExportAt = new Date().toISOString();
    rfq.exportedVariantId = variant.id;
    rfq.projectUpdatedAt = project.updatedAt;
    rfq.lastExportHash = '';
    const draft = buildRfqDocument(project, variant, true);
    rfq.lastExportHash = await sha256Text(draft);
    await saveProject(project);
    return buildRfqDocument(project, variant, true);
  }

  async function printRfq() {
    const project = currentProject(), variant = currentVariant(project);
    collectRfqForm(variant);
    await prepareRfqRevision(project, variant);
    printArea.innerHTML = `<section class="print-section rfq-print">${buildRfqDocument(project, variant, false)}</section>`;
    setTimeout(() => window.print(), 250);
  }

  async function downloadRfqHtml() {
    const project = currentProject(), variant = currentVariant(project);
    collectRfqForm(variant);
    let html = await prepareRfqRevision(project, variant);
    const extracted = [];
    let index = 0;
    html = html.replace(/data:(image\/(?:jpeg|png|webp));base64,[a-z0-9+/=\r\n]+/gi, (dataUrl, mime) => {
      index += 1;
      const ext = mime.toLowerCase().includes('png') ? 'png' : mime.toLowerCase().includes('webp') ? 'webp' : 'jpg';
      const name = `obrazek-${String(index).padStart(2, '0')}`;
      extracted.push({ name, dataUrl });
      return `prilohy/${name}.${ext}`;
    });
    const packageBlob = await DomusBackup.createRfqPackage({ html, files: extracted, metadata: { revision: variant.rfq.revision, exportedAt: variant.rfq.lastExportAt, hash: variant.rfq.lastExportHash, projectId: project.id, variantId: variant.id, projectUpdatedAt: project.updatedAt } });
    downloadBlob(packageBlob, `${safeFilename(project.name)}-poptavka-revize-${variant.rfq.revision}.zip`);
    toast('Poptávkový ZIP obsahuje HTML, samostatné obrázky a údaje o revizi.');
  }

  async function downloadRfqCsv() {
    const project = currentProject(), variant = currentVariant(project);
    collectRfqForm(variant);
    await prepareRfqRevision(project, variant);
    const { rows } = rfqContent(project, variant);
    const lines = [
      ['Revize', variant.rfq.revision, 'Varianta', variant.id, 'Kontrolní kód', variant.rfq.lastExportHash],
      [],
      ['Položka','Kategorie','Množství','Specifikace','Cena materiál/práce','Cena nabídky bez DPH','DPH','Cena nabídky s DPH','Poznámka dodavatele'],
      ...rows.map((row) => [row.name,row.category,row.qty,row.note,row.price,'','','','']),
    ];
    const csv = '\ufeff' + lines.map((row) => row.map(DomusCore.csvCell).join(';')).join('\r\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${safeFilename(project.name)}-tabulka-revize-${variant.rfq.revision}.csv`);
    toast('Tabulka pro nacenění byla stažena s ochranou proti vzorcům a označením revize.');
  }

  function safeFilename(value){return String(value||'projekt').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase();}

  function openDiaryDialog(entry=null){diaryForm.reset();delete diaryForm.dataset.editingId;diaryForm.elements.date.value=new Date().toISOString().slice(0,10);diaryForm.elements.status.value='Rozpracováno';if(entry){diaryForm.dataset.editingId=entry.id;['date','type','title','contractor','responsible','workers','weather','status','plannedCost','actualCost','note'].forEach((key)=>{if(diaryForm.elements[key])diaryForm.elements[key].value=entry[key]??'';});const passport=currentVariant()?.diary?.passport?.find((item)=>item.entryId===entry.id);if(passport){diaryForm.elements.hiddenName.value=passport.name||'';diaryForm.elements.hiddenCategory.value=passport.category||'Jiné';diaryForm.elements.hiddenLocation.value=passport.location||'';diaryForm.elements.hiddenDepth.value=passport.depth||'';diaryForm.elements.hiddenDescription.value=passport.description||'';}}diaryDialog.showModal();}
  function openWarrantyDialog(item=null){warrantyForm.reset();delete warrantyForm.dataset.editingId;warrantyForm.elements.purchaseDate.value=new Date().toISOString().slice(0,10);warrantyForm.elements.warrantyMonths.value='24';if(item){warrantyForm.dataset.editingId=item.id;['item','supplier','purchaseDate','warrantyMonths','serial','note'].forEach((key)=>warrantyForm.elements[key].value=item[key]??'');}warrantyDialog.showModal();}
  async function editPassportItem(item) {
    if (!item) return;
    const name = await askValue({ title: 'Upravit technický pas', label: 'Název skrytého prvku', value: item.name || '', required: true }); if (!name) return;
    const category = await askValue({ title: 'Upravit technický pas', label: 'Kategorie', value: item.category || 'Jiné', required: true }); if (!category) return;
    const location = await askValue({ title: 'Upravit technický pas', label: 'Poloha', value: item.location || '' }); if (location === null) return;
    const depth = await askValue({ title: 'Upravit technický pas', label: 'Hloubka / výška', value: item.depth || '' }); if (depth === null) return;
    const description = await askValue({ title: 'Upravit technický pas', label: 'Popis', value: item.description || '' }); if (description === null) return;
    Object.assign(item, { name, category, location, depth, description, updatedAt: new Date().toISOString() });
    await saveProject(currentProject()); toast('Položka technického pasu byla upravena.'); render();
  }

  async function importDiaryPhotos(){const entryId=diaryPhotoInput.dataset.entryId,files=Array.from(diaryPhotoInput.files||[]).slice(0,12);diaryPhotoInput.value='';if(!entryId||!files.length)return;const project=currentProject(),entry=currentVariant(project).diary.entries.find((e)=>e.id===entryId);if(!entry)return;for(const file of files){try{entry.photos.push({id:uid('diaryphoto'),name:file.name,dataUrl:await resizeImage(file,1600,1200,.82),createdAt:new Date().toISOString(),private:true});}catch(error){console.warn(error);}}await saveProject(project);toast('Fotografie byly přidány do stavebního deníku.');render();}
  async function importWarrantyDocument(){const warrantyId=warrantyDocumentInput.dataset.warrantyId,file=warrantyDocumentInput.files?.[0];warrantyDocumentInput.value='';if(!warrantyId||!file)return;const project=currentProject(),item=currentVariant(project).diary.warranties.find((w)=>w.id===warrantyId);if(!item)return;if(file.size>4*1024*1024){item.documents.push({id:uid('doc'),name:file.name,size:file.size,type:file.type,dataUrl:'',note:'Soubor je větší než 4 MB; evidován pouze názvem. Uložte originál také mimo aplikaci.'});toast('Velký soubor byl evidován pouze názvem.','error');}else{const dataUrl=await readFileDataUrl(file);item.documents.push({id:uid('doc'),name:file.name,size:file.size,type:file.type,dataUrl});toast('Doklad byl uložen do projektu.');}await saveProject(project);render();}
  function readFileDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}

  function renderPdfTab(project, variant) {
    const summary = budgetSummary(variant);
    return `
      <div class="pdf-layout">
        <article class="pdf-preview"><p class="eyebrow" style="color:#86643f">DOMUS Studio v7.0 · prémiová projektová dokumentace</p><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(project.summary || 'Bez popisu projektu.')}</p><div class="pdf-meta"><div><small>Varianta</small><strong>${escapeHtml(variant.name)}</strong></div><div><small>Stav</small><strong>${escapeHtml(project.status)}</strong></div><div><small>Rozpočet</small><strong>${money(summary.total)}</strong></div></div><h2>Obsah dokumentace</h2><p>${state.pdfOptions.field ? '✓ Mobilní zaměření a seznam ověřených rozměrů<br>' : ''}${state.pdfOptions.ai ? '✓ AI analýza a body k ověření<br>' : ''}${state.pdfOptions.photo ? '✓ Fotografie a zakreslené rozměry<br>' : ''}${state.pdfOptions.plan ? '✓ Půdorys, vrstvy a automatické kóty<br>' : ''}${state.pdfOptions.section ? '✓ Řez a konstrukční skladby<br>' : ''}${state.pdfOptions.model ? '✓ Materiálový prostorový náhled<br>' : ''}${state.pdfOptions.calculations ? '✓ Výpočet ploch a spotřeby<br>' : ''}${state.pdfOptions.materials ? `✓ Výrobky a materiály (${variant.materials.length})<br>` : ''}${state.pdfOptions.budget ? '✓ Orientační rozpočet<br>' : ''}${state.pdfOptions.comparison ? '✓ Porovnání před / po<br>' : ''}${state.pdfOptions.audit ? '✓ Kontrola kolizí a důvěryhodnosti<br>' : ''}${state.pdfOptions.rfq ? '✓ Zadání pro dodavatele<br>' : ''}${state.pdfOptions.diary ? '✓ Stavební deník a technický pas<br>' : ''}${state.pdfOptions.notes ? '✓ Poznámky a body k ověření' : ''}</p><h2>Technická poznámka</h2><p>Dokument slouží ke komunikaci záměru. Rozměry, výpočty spotřeby a rozpočet musí před realizací ověřit dodavatel podle skutečného stavu a technologických požadavků.</p></article>
        <aside class="pdf-options"><p class="eyebrow">Nastavení exportu</p><h3>Sestavit dokument</h3>${[['field','Mobilní zaměření'],['ai','AI analýza a nejistoty'],['photo','Fotografie a kóty'],['plan','2D výkres a vrstvy'],['section','Řez a skladby'],['model','3D náhled'],['calculations','Výpočty ploch'],['materials','Výrobky a materiály'],['budget','Orientační rozpočet'],['comparison','Porovnání před / po'],['audit','Kontrola projektu'],['rfq','Zadání pro dodavatele'],['diary','Stavební deník a pasport'],['notes','Poznámky a upozornění']].map(([key,label]) => `<label class="check-row"><input type="checkbox" data-pdf-option="${key}" ${state.pdfOptions[key] ? 'checked' : ''} /> ${label}</label>`).join('')}<div class="info-box" style="margin:16px 0"><strong>Jak vznikne PDF:</strong><br>Aplikace připraví tiskovou dokumentaci. V systémovém dialogu zvolte „Uložit jako PDF“.</div><button class="btn btn-primary" style="width:100%" data-action="print-pdf">Vytvořit PDF</button></aside>
      </div>`;
  }

/* Premium Report Studio: branded multi-chapter output and professional export. */
  function renderPdfTab(project, variant) {
    const summary = budgetSummary(variant); const report = buildAuditReport(variant);
    const options = state.pdfOptions;
    const chapters = [
      ['field','Zaměření'],['photo','Fotodokumentace'],['plan','Půdorys a kóty'],['section','Řezy a skladby'],
      ['model','3D pohledy'],['calculations','Výpočty'],['materials','Materiály'],['budget','Rozpočet'],
      ['comparison','Před / po'],['audit','DOMUS Verify'],['rfq','Zadání dodavateli'],['diary','Stavební deník'],['notes','Poznámky']
    ];
    return `<div class="panel report-studio"><div class="panel-head"><div><p class="eyebrow">DOMUS Report Studio</p><h2>Profesionální projektový dokument</h2><p>Jednotný výstup s vlastní značkou, revizí, kontrolou projektu, rozpočtem a realizační dokumentací.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="open-settings">Značka a vzhled</button><button class="btn btn-secondary" data-action="export-dxf">DXF</button><button class="btn btn-secondary" data-action="export-warranty-calendar">Kalendář záruk</button><button class="btn btn-ghost" data-action="export-report-html">HTML balíček</button><button class="btn btn-primary" data-action="print-pdf">Tisk / PDF</button></div></div><div class="report-layout"><section class="report-preview-card"><div class="report-cover-mini">${state.branding?.logoDataUrl?`<img src="${state.branding.logoDataUrl}" alt="Logo">`:'<div class="report-mark">DS</div>'}<p class="eyebrow">${escapeHtml(state.branding?.company||'DOMUS Studio')}</p><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(project.summary||'Projektová dokumentace')}</p><div class="report-meta-grid"><span><small>Varianta</small><strong>${escapeHtml(variant.name)}</strong></span><span><small>Revize</small><strong>${escapeHtml(project.reportRevisionLabel||`R${project.reportRevision||1}`)}</strong></span><span><small>Rozpočet</small><strong>${money(summary.total)}</strong></span><span><small>Verify</small><strong>${report.technicalScore}/100</strong></span></div></div><div class="report-readiness"><strong>Dokument je připraven k exportu</strong><span>${chapters.filter(([key])=>options[key]).length} kapitol · ${variant.materials.length} materiálů · ${variant.costs.lines.length} nákladových položek</span></div></section><aside class="report-options"><div class="tool-title">Revize dokumentu</div><label>Označení revize<input id="reportRevisionLabel" value="${escapeHtml(project.reportRevisionLabel||`R${project.reportRevision||1}`)}" maxlength="30"></label><label>Číslo revize<input id="reportRevision" type="number" min="1" max="999" value="${project.reportRevision||1}"></label><div class="tool-title">Kapitoly</div><div class="report-chapters">${chapters.map(([key,label])=>`<label class="check-row"><input type="checkbox" data-pdf-option="${key}" ${options[key]?'checked':''}> ${label}</label>`).join('')}</div><div class="info-box"><strong>Výstup je verzovaný.</strong><br>Revize, datum, varianta a identifikace projektu jsou součástí každého exportu.</div></aside></div></div>`;
  }

  async function exportPremiumReportHtml() {
    const html = await prepareAndPrint({ skipPrint: true });
    if (!html) return;
    const project = currentProject();
    downloadText(`<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(project.name)} – DOMUS Report</title><style>${Array.from(document.styleSheets).map((sheet)=>{try{return Array.from(sheet.cssRules||[]).map(rule=>rule.cssText).join('\n');}catch{return'';}}).join('\n')}</style></head><body><main id="printArea" class="print-area">${html}</main></body></html>`, `${DomusCore.safeId(project.name,'projekt')}-report-${project.reportRevisionLabel||`R${project.reportRevision||1}`}.html`, 'text/html;charset=utf-8');
    toast('HTML projektový report byl vytvořen.');
  }

/* Global/rendered event binding, action router and dialogs. Source fragment; assembled by scripts/build.mjs. */
  function bindGlobalEvents() {
    document.getElementById('homeBtn').addEventListener('click', () => { state.currentProjectId = null; state.currentTab = 'overview'; render(); });
    document.getElementById('newProjectBtn').addEventListener('click', () => openProjectDialog());
    document.getElementById('exportBtn').addEventListener('click', exportBackup);
    document.getElementById('importBtn').addEventListener('click', () => backupInput.click());
    document.getElementById('mobileImportBtn')?.addEventListener('click', () => { mobileActions.hidden = true; backupInput.click(); });
    document.getElementById('mobileExportBtn')?.addEventListener('click', () => { mobileActions.hidden = true; exportBackup(); });
    document.getElementById('storageInfoBtn')?.addEventListener('click', () => { mobileActions.hidden = true; showStorageDialog(); });
    document.getElementById('createSnapshotBtn')?.addEventListener('click', async () => { await DomusDB.createSnapshot(state.projects, 'Ruční bod obnovy'); toast('Bod obnovy byl vytvořen.'); showStorageDialog(); });
    mobileMenuBtn?.addEventListener('click', () => { mobileActions.hidden = !mobileActions.hidden; mobileMenuBtn.setAttribute('aria-expanded', String(!mobileActions.hidden)); });
    undoBtn?.addEventListener('click', undoLastChange);
    document.addEventListener('keydown', (event) => {
      const key=event.key.toLowerCase(); if((event.ctrlKey||event.metaKey)&&key==='z'&&state.currentTab==='plan'){event.preventDefault();return event.shiftKey?redoPlanChange():undoPlanChange();}
      if((event.ctrlKey||event.metaKey)&&key==='z'&&state.undo){event.preventDefault();undoLastChange();}
      if((event.key==='Delete'||event.key==='Backspace')&&state.currentTab==='plan'&&state.selectedPlanIds?.size&&!/input|textarea|select/i.test(event.target.tagName)){event.preventDefault();deletePlanSelection();}
    });
    document.getElementById('settingsBtn')?.addEventListener('click',openSettingsDialog);
    document.getElementById('mobileSettingsBtn')?.addEventListener('click',()=>{mobileActions.hidden=true;openSettingsDialog();});
    document.getElementById('onboardingStartBtn')?.addEventListener('click',()=>{const template=document.getElementById('onboardingTemplateSelect')?.value||'blank';finishOnboarding();openProjectDialog();if(projectForm.elements.template)projectForm.elements.template.value=template;});
    document.getElementById('onboardingCloseBtn')?.addEventListener('click',finishOnboarding);
    document.getElementById('onboardingCloseBtnSecondary')?.addEventListener('click',finishOnboarding);
    document.getElementById('settingsForm')?.addEventListener('submit',(event)=>{event.preventDefault();if(event.submitter?.value==='cancel')return document.getElementById('settingsDialog').close();savePremiumSettings(event.currentTarget);document.getElementById('settingsDialog').close();render();});
    document.getElementById('brandingLogoInput')?.addEventListener('change',async(event)=>{const file=event.target.files?.[0];if(!file)return;try{state.branding.logoDataUrl=await imageFileToDataUrl(file,800,400,.88);saveJsonStorage('domusBranding',state.branding);openSettingsDialog();}catch(error){toast(error.message,'error');}});
    document.getElementById('checkDesktopUpdateBtn')?.addEventListener('click',()=>checkDesktopUpdates(true));
    document.addEventListener('click',(event)=>{const card=event.target.closest('[data-template-choice]');if(!card)return;document.querySelectorAll('[data-template-choice]').forEach(x=>x.classList.remove('active'));card.classList.add('active');const select=document.getElementById('onboardingTemplateSelect');if(select)select.value=card.dataset.templateChoice;});
    backupInput.addEventListener('change', importBackup);
    photoInput.addEventListener('change', importPhoto);
    compareBeforeInput.addEventListener('change', (event) => importComparisonImage(event, 'before'));
    compareAfterInput.addEventListener('change', (event) => importComparisonImage(event, 'after'));
    roomPhotosInput.addEventListener('change', importRoomPhotos);
    fieldPhotoInput.addEventListener('change', importFieldPhotos);
    scanInput.addEventListener('change', importScanFile);
    diaryPhotoInput.addEventListener('change', importDiaryPhotos);
    warrantyDocumentInput.addEventListener('change', importWarrantyDocument);

    diaryForm.addEventListener('submit', async (event) => {
      event.preventDefault(); if (event.submitter?.value === 'cancel') return diaryDialog.close();
      const project=currentProject(),variant=currentVariant(project),data=Object.fromEntries(new FormData(diaryForm).entries());
      const payload={date:data.date,type:data.type,title:data.title,contractor:data.contractor||'',responsible:data.responsible||'',workers:parseNum(data.workers),weather:data.weather||'',status:data.status,plannedCost:parseNum(data.plannedCost),actualCost:parseNum(data.actualCost),note:data.note||'',updatedAt:new Date().toISOString()};
      const editingId=diaryForm.dataset.editingId; let entry;
      if(editingId){entry=variant.diary.entries.find((item)=>item.id===editingId);entry.history=entry.history||[];entry.history.push({changedAt:new Date().toISOString(),snapshot:{date:entry.date,type:entry.type,title:entry.title,contractor:entry.contractor,responsible:entry.responsible,workers:entry.workers,weather:entry.weather,status:entry.status,plannedCost:entry.plannedCost,actualCost:entry.actualCost,note:entry.note}});entry.history=entry.history.slice(-20);Object.assign(entry,payload);}else{entry={id:uid('diary'),...payload,photos:[],documents:[],history:[],createdAt:new Date().toISOString()};variant.diary.entries.push(entry);}
      if(data.hiddenName){const passportPayload={entryId:entry.id,name:data.hiddenName,category:data.hiddenCategory||'Skrytý prvek',location:data.hiddenLocation||'',depth:data.hiddenDepth||'',description:data.hiddenDescription||'',updatedAt:new Date().toISOString()};const existingPassport=variant.diary.passport.find((item)=>item.entryId===entry.id);if(existingPassport)Object.assign(existingPassport,passportPayload);else variant.diary.passport.push({id:uid('passport'),...passportPayload,createdAt:new Date().toISOString()});}
      await saveProject(project);diaryDialog.close();diaryForm.reset();delete diaryForm.dataset.editingId;toast(editingId?'Záznam byl upraven.':'Záznam byl přidán do deníku.');render();
    });
    warrantyForm.addEventListener('submit', async (event) => {
      event.preventDefault(); if (event.submitter?.value === 'cancel') return warrantyDialog.close();
      const project=currentProject(),variant=currentVariant(project),data=Object.fromEntries(new FormData(warrantyForm).entries());
      const payload={item:data.item,supplier:data.supplier||'',purchaseDate:data.purchaseDate||'',warrantyMonths:parseNum(data.warrantyMonths,24),serial:data.serial||'',note:data.note||'',updatedAt:new Date().toISOString()};
      const editingId=warrantyForm.dataset.editingId;if(editingId)Object.assign(variant.diary.warranties.find((item)=>item.id===editingId),payload);else variant.diary.warranties.push({id:uid('warranty'),...payload,documents:[],createdAt:new Date().toISOString()});
      await saveProject(project);warrantyDialog.close();warrantyForm.reset();delete warrantyForm.dataset.editingId;toast('Záruka nebo doklad byl uložen.');render();
    });

    projectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return projectDialog.close();
      const formData = Object.fromEntries(new FormData(projectForm).entries());
      formData.template ||= 'blank';
      const editingId = projectForm.dataset.editingId;
      if (editingId) {
        const project = state.projects.find((item) => item.id === editingId);
        if (project) { Object.assign(project, formData); await saveProject(project); toast('Údaje projektu byly upraveny.'); }
      } else {
        const project = createProject(formData);
        state.projects.unshift(project);
        await DomusDB.put(project);
        state.currentProjectId = project.id;
        state.currentTab = 'overview';
        toast('Nový projekt byl vytvořen.');
      }
      projectDialog.close(); projectForm.reset(); delete projectForm.dataset.editingId; render();
    });

    document.getElementById('parseUrlBtn').addEventListener('click', importProductFromUrl);

    materialForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return materialDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(materialForm).entries());
      const payload = {
        name: data.name, category: data.category, manufacturer: data.manufacturer || '', sku: data.sku || '', url: DomusCore.cleanHttpUrl(data.url || ''),
        width: parseNum(data.width), depth: parseNum(data.depth), height: parseNum(data.height),
        calculation: data.calculation || 'manual', unit: data.unit || 'ks', quantity: parseNum(data.quantity, 1), coverage: Math.max(0.0001, parseNum(data.coverage, 1)),
        wastePercent: parseNum(data.wastePercent), unitPrice: parseNum(data.unitPrice), color: data.color || '', swatch: data.swatch || '#d6d6d0', note: data.note || '', updatedAt: new Date().toISOString(),
      };
      const editingId = materialForm.dataset.editingId;
      if (editingId) Object.assign(variant.materials.find((item) => item.id === editingId), payload);
      else variant.materials.push({ id: uid('material'), ...payload });
      await saveProject(project);
      materialDialog.close(); materialForm.reset(); delete materialForm.dataset.editingId;
      toast(editingId ? 'Položka byla upravena.' : 'Položka byla přidána do projektu.'); render();
    });

    costForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return costDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(costForm).entries());
      const payload = { name: data.name, category: data.category, quantity: parseNum(data.quantity, 1), unit: data.unit, unitPrice: parseNum(data.unitPrice), note: data.note || '', updatedAt: new Date().toISOString() };
      const editingId = costForm.dataset.editingId;
      if (editingId) Object.assign(variant.costs.lines.find((item) => item.id === editingId), payload);
      else variant.costs.lines.push({ id: uid('cost'), ...payload });
      await saveProject(project); costDialog.close(); costForm.reset(); delete costForm.dataset.editingId;
      toast(editingId ? 'Náklad byl upraven.' : 'Náklad byl přidán.'); render();
    });

    assemblyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return assemblyDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(assemblyForm).entries());
      const type = assemblyForm.dataset.type || 'floor';
      variant.assemblies[type].push({ id: uid('layer'), name: data.name, thicknessMm: parseNum(data.thicknessMm), material: data.material || '', color: data.color || '#999999', note: data.note || '' });
      await saveProject(project); assemblyDialog.close(); assemblyForm.reset(); toast('Vrstva byla přidána do skladby.'); render();
    });

    objectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return objectDialog.close();
      const project = currentProject(); const variant = currentVariant(project); const plan = variant.plan;
      const object = plan.objects.find((item) => item.id === objectForm.dataset.editingId);
      if (!object) return objectDialog.close();
      pushPlanHistory(project, variant);
      const data = Object.fromEntries(new FormData(objectForm).entries());
      object.type = data.type; object.width = parseNum(data.widthMm) / 1000 * plan.scale; object.depth = parseNum(data.depthMm) / 1000 * plan.scale;
      object.height = parseNum(data.heightCm); object.rotation = parseNum(data.rotation); object.layer = data.layer; object.materialId = data.materialId || ''; object.note = data.note || ''; object.updatedAt = new Date().toISOString(); object.hingeSide = data.hingeSide || 'left'; object.opensTo = data.opensTo || 'inside';
      object.color = variant.materials.find((item) => item.id === object.materialId)?.swatch || LAYERS[object.layer]?.color || object.color;
      await saveProject(project); objectDialog.close(); delete objectForm.dataset.editingId; toast('Objekt byl upraven.'); render();
    });

    variantForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return variantDialog.close();
      const project = currentProject(); const formData = new FormData(variantForm); const name = String(formData.get('name') || '').trim();
      if (!name) return;
      const duplicate = formData.get('duplicate') === 'on'; const source = currentVariant(project); const variant = duplicate ? deepClone(source) : blankVariant(name);
      variant.id = uid('variant'); variant.name = name; variant.createdAt = new Date().toISOString(); ensureProjectV6({ variants: [variant], activeVariantId: variant.id });
      project.variants.push(variant); project.activeVariantId = variant.id; await saveProject(project);
      variantDialog.close(); variantForm.reset(); toast('Nová varianta byla vytvořena.'); render();
    });
  }

  function bindRenderedEvents() {
    document.querySelectorAll('[data-layer-lock]').forEach((input)=>input.addEventListener('change',()=>{const p=currentProject(),v=currentVariant(p);v.plan.layerLocks[input.dataset.layerLock]=input.checked;saveProject(p,true,true);render();}));
    document.querySelectorAll('[data-plan-select]').forEach((input)=>input.addEventListener('change',()=>{input.checked?state.selectedPlanIds.add(input.dataset.planSelect):state.selectedPlanIds.delete(input.dataset.planSelect);render();}));
    document.getElementById('snapGrid')?.addEventListener('change',(e)=>{state.planSnap.grid=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapEndpoints')?.addEventListener('change',(e)=>{state.planSnap.endpoints=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapOrthogonal')?.addEventListener('change',(e)=>{state.planSnap.orthogonal=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapGridMm')?.addEventListener('change',(e)=>{state.planSnap.gridMm=clamp(parseNum(e.target.value,100),10,2000);saveJsonStorage('domusPlanSnap',state.planSnap);render();});
    document.getElementById('showPlanDimensions')?.addEventListener('change',async(e)=>{const p=currentProject();currentVariant(p).plan.showDimensions=e.target.checked;await saveProject(p);render();});
    document.getElementById('librarySearch')?.addEventListener('input',(e)=>{state.librarySearch=e.target.value;render();});
    document.getElementById('libraryCategory')?.addEventListener('change',(e)=>{state.libraryCategory=e.target.value;render();});
    document.getElementById('reportRevision')?.addEventListener('change',async(e)=>{const p=currentProject();p.reportRevision=Math.max(1,parseNum(e.target.value,1));if(!p.reportRevisionLabel)p.reportRevisionLabel=`R${p.reportRevision}`;await saveProject(p,true,true);render();});
    document.getElementById('reportRevisionLabel')?.addEventListener('change',async(e)=>{const p=currentProject();p.reportRevisionLabel=e.target.value.trim()||`R${p.reportRevision||1}`;await saveProject(p,true,true);render();});
    [['threeCameraMode','cameraMode'],['threeCutaway','cutaway'],['threeShadows','shadows'],['threeCeiling','ceiling'],['threeLabels','labels']].forEach(([id,key])=>document.getElementById(id)?.addEventListener('change',(e)=>{state.threeD[key]=e.target.type==='checkbox'?e.target.checked:(e.target.type==='range'?parseNum(e.target.value):e.target.value);setupModelCanvas();}));
    app.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', handleAction));
    app.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { state.currentTab = button.dataset.tab; render(); }));
    app.querySelectorAll('[data-tab-jump]').forEach((button) => button.addEventListener('click', () => { state.currentTab = button.dataset.tabJump; render(); }));
    app.querySelectorAll('[data-photo-tool]').forEach((button) => button.addEventListener('click', () => { state.photoTool = button.dataset.photoTool; render(); }));
    app.querySelectorAll('[data-plan-tool]').forEach((button) => button.addEventListener('click', () => { state.planTool = button.dataset.planTool; render(); }));
    app.querySelectorAll('[data-library-element]').forEach((button) => button.addEventListener('click', () => {
      state.planElementKey = button.dataset.libraryElement; state.activeLayer = allElementLibrary().find((item) => item.key === state.planElementKey)?.layer || state.activeLayer; state.planTool = 'object'; render();
    }));
    app.querySelectorAll('[data-active-layer]').forEach((button) => button.addEventListener('click', () => {
      state.activeLayer = button.dataset.activeLayer;
      const first = allElementLibrary().find((item) => item.layer === state.activeLayer); if (first) state.planElementKey = first.key;
      render();
    }));
    app.querySelectorAll('[data-layer-toggle]').forEach((checkbox) => checkbox.addEventListener('change', async () => {
      const project = currentProject(); currentVariant(project).plan.layerVisibility[checkbox.dataset.layerToggle] = checkbox.checked; await saveProject(project); setupPlanCanvas();
    }));
    app.querySelectorAll('[data-model-mode]').forEach((button) => button.addEventListener('click', () => { state.modelMode = button.dataset.modelMode; render(); }));
    app.querySelectorAll('[data-pdf-option]').forEach((checkbox) => checkbox.addEventListener('change', () => { state.pdfOptions[checkbox.dataset.pdfOption] = checkbox.checked; render(); }));

    const diarySearch = document.getElementById('diarySearch');
    if (diarySearch) diarySearch.addEventListener('input', (event) => { state.diaryFilter = event.target.value; render(); requestAnimationFrame(() => { const input = document.getElementById('diarySearch'); input?.focus(); input?.setSelectionRange(state.diaryFilter.length, state.diaryFilter.length); }); });

    const bindLiveFilter = (id, key) => { const input = document.getElementById(id); if (!input) return; input.addEventListener('input', (event) => { state.filters[key] = event.target.value; render(); requestAnimationFrame(() => { const fresh = document.getElementById(id); fresh?.focus(); fresh?.setSelectionRange?.(state.filters[key].length, state.filters[key].length); }); }); };
    bindLiveFilter('materialsSearch', 'materials');
    bindLiveFilter('budgetSearch', 'budget');
    bindLiveFilter('auditSearch', 'auditText');
    const auditSeverity = document.getElementById('auditSeverity');
    if (auditSeverity) auditSeverity.addEventListener('change', () => { state.filters.auditSeverity = auditSeverity.value; render(); });
    const auditStatus = document.getElementById('auditStatus');
    if (auditStatus) auditStatus.addEventListener('change', () => { state.filters.auditStatus = auditStatus.value; render(); });

    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) projectSearch.addEventListener('input', (event) => { state.search = event.target.value; render(); requestAnimationFrame(() => { const input = document.getElementById('projectSearch'); input?.focus(); input?.setSelectionRange(state.search.length, state.search.length); }); });

    const variantSelect = document.getElementById('variantSelect');
    if (variantSelect) variantSelect.addEventListener('change', async () => { const project = currentProject(); project.activeVariantId = variantSelect.value; await saveProject(project); render(); });

    const notes = document.getElementById('variantNotes');
    if (notes) notes.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).notes = notes.value; await saveProject(project); toast('Poznámky byly uloženy.'); });

    const planInputs = [
      ['planScale', (variant, input) => { rescalePlan(variant.plan, Number(input.value)); }],
      ['wallHeight', (variant, input) => { variant.plan.wallHeight = parseNum(input.value, 2.6); }],
      ['wallThickness', (variant, input) => { variant.plan.wallThickness = parseNum(input.value, 0.15); }],
      ['floorAreaOverride', (variant, input) => { variant.metricsOverrides.floorArea = input.value; }],
      ['wallAreaOverride', (variant, input) => { variant.metricsOverrides.wallArea = input.value; }],
    ];
    planInputs.forEach(([id, setter]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); setter(currentVariant(project), input); await saveProject(project); render(); }); });

    const sectionName = document.getElementById('sectionName');
    const sectionOrientation = document.getElementById('sectionOrientation');
    const sectionPosition = document.getElementById('sectionPosition');
    const sectionDimensions = document.getElementById('sectionDimensions');
    if (sectionName) sectionName.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.name = sectionName.value; await saveProject(project); });
    if (sectionOrientation) sectionOrientation.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.orientation = sectionOrientation.value; await saveProject(project); setupSectionCanvas(); });
    if (sectionPosition) {
      sectionPosition.addEventListener('input', () => { const variant = currentVariant(); variant.section.position = Number(sectionPosition.value); const value = document.getElementById('sectionPositionValue'); if (value) value.textContent = `${sectionPosition.value} %`; setupSectionCanvas(); });
      sectionPosition.addEventListener('change', () => saveProject(currentProject()));
    }
    if (sectionDimensions) sectionDimensions.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.showDimensions = sectionDimensions.checked; await saveProject(project); setupSectionCanvas(); });

    ['cameraAngle','cameraTilt','cameraZoom'].forEach((id) => { const input = document.getElementById(id); if (!input) return; input.addEventListener('input', () => { if (id === 'cameraAngle') state.threeD.angle = Number(input.value); if (id === 'cameraTilt') state.threeD.tilt = Number(input.value); if (id === 'cameraZoom') state.threeD.zoom = Number(input.value); setupModelCanvas(); }); });
    [['wallMaterialSelect','wallMaterialId'],['floorMaterialSelect','floorMaterialId'],['ceilingMaterialSelect','ceilingMaterialId']].forEach(([id,key]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).appearance[key] = input.value; await saveProject(project); setupModelCanvas(); }); });

    const contingency = document.getElementById('contingencyPercent'); const vat = document.getElementById('vatPercent');
    if (contingency) contingency.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).costs.contingencyPercent = parseNum(contingency.value); await saveProject(project); render(); });
    if (vat) vat.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).costs.vatPercent = parseNum(vat.value); await saveProject(project); render(); });

    const comparisonSlider = document.getElementById('comparisonSlider');
    if (comparisonSlider) {
      comparisonSlider.addEventListener('input', () => { const value = Number(comparisonSlider.value); currentVariant().comparison.slider = value; const layer = document.getElementById('compareBeforeLayer'); const divider = document.getElementById('compareDivider'); if (layer) layer.style.clipPath = `inset(0 ${100-value}% 0 0)`; if (divider) divider.style.left = `${value}%`; });
      comparisonSlider.addEventListener('change', () => saveProject(currentProject()));
    }
    [['comparisonBeforeLabel','beforeLabel'],['comparisonAfterLabel','afterLabel'],['comparisonNotes','notes']].forEach(([id,key]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).comparison[key] = input.value; await saveProject(project); render(); }); });

    app.querySelectorAll('[data-room-photo-name]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoName, 'name', input.value)));
    app.querySelectorAll('[data-room-photo-view]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoView, 'view', input.value)));
    app.querySelectorAll('[data-room-photo-note]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoNote, 'note', input.value)));
    const fieldSessionSelect = document.getElementById('fieldSessionSelect');
    if (fieldSessionSelect) fieldSessionSelect.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.activeSessionId = fieldSessionSelect.value; await saveProject(project); render(); });
    const fieldSessionStatus = document.getElementById('fieldSessionStatus');
    if (fieldSessionStatus) fieldSessionStatus.addEventListener('change', async () => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.status = fieldSessionStatus.value; session.updatedAt = new Date().toISOString(); await saveProject(project); });
    const fieldSessionNotes = document.getElementById('fieldSessionNotes');
    if (fieldSessionNotes) fieldSessionNotes.addEventListener('change', async () => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.notes = fieldSessionNotes.value; session.updatedAt = new Date().toISOString(); await saveProject(project); });
    app.querySelectorAll('[data-measure-preset]').forEach((button) => button.addEventListener('click', () => { const input = document.getElementById('fieldMeasureLabel'); if (input) { input.value = button.dataset.measurePreset; input.focus(); } }));
    app.querySelectorAll('[data-field-measure-verified]').forEach((input) => input.addEventListener('change', async () => { const project = currentProject(); const item = currentFieldSession(currentVariant(project)).measurements.find((entry) => entry.id === input.dataset.fieldMeasureVerified); if (item) { item.verified = input.checked; if(input.checked){item.source='measured';item.confidence=100;} } await saveProject(project); render(); }));
    app.querySelectorAll('[data-field-measure-source]').forEach((input) => input.addEventListener('change', async () => { const project=currentProject(); const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureSource); if(item){item.source=input.value;item.confidence=SOURCE_META[input.value]?.confidence||40;item.verified=input.value==='measured';} await saveProject(project);render(); }));
    app.querySelectorAll('[data-field-measure-target]').forEach((input) => input.addEventListener('change', async () => { const project=currentProject(); const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureTarget); if(item)item.targetId=input.value; await saveProject(project); render(); }));
    app.querySelectorAll('[data-field-photo-name]').forEach((input) => input.addEventListener('change', () => updateFieldPhoto(input.dataset.fieldPhotoName, 'name', input.value)));
    app.querySelectorAll('[data-field-photo-note]').forEach((input) => input.addEventListener('change', () => updateFieldPhoto(input.dataset.fieldPhotoNote, 'note', input.value)));
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    if (autoSyncToggle) autoSyncToggle.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.sync.autoSync = autoSyncToggle.checked; await saveProject(project, true, true); });
    const presentationFov = document.getElementById('presentationFov');
    if (presentationFov) presentationFov.addEventListener('input', async () => { const project = currentProject(); currentVariant(project).presentation.fov = Number(presentationFov.value); drawWalkthrough(); });
    const presentationObjects = document.getElementById('presentationObjects');
    if (presentationObjects) presentationObjects.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showObjects = presentationObjects.checked; await saveProject(project); drawWalkthrough(); });
    const presentationLabels = document.getElementById('presentationLabels');
    if (presentationLabels) presentationLabels.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showLabels = presentationLabels.checked; await saveProject(project); drawWalkthrough(); });
    app.querySelectorAll('[data-walk]').forEach((button) => button.addEventListener('click', () => moveWalkthrough(button.dataset.walk)));
  }

  async function handleAction(event) {
    const action = event.currentTarget.dataset.action; const id = event.currentTarget.dataset.id; const type = event.currentTarget.dataset.type;
    if (action === 'new-project') return openProjectDialog();
    if (action === 'open-project') { state.currentProjectId = id; state.currentTab = 'overview'; return render(); }
    if (action === 'storage-info') return showStorageDialog();
    if (action === 'delete-project') { event.stopPropagation(); const project = state.projects.find((item) => item.id === id); if (!project || !confirm(`Opravdu přesunout projekt „${project.name}“ do koše?`)) return; const index=state.projects.indexOf(project); const trashId=await DomusDB.delete(id); state.projects = state.projects.filter((item) => item.id !== id); setUndo(`projekt ${project.name}`, async()=>{await DomusDB.restoreTrash(trashId);state.projects.splice(index,0,ensureProjectV6(project));render();}); toast('Projekt byl přesunut do koše.'); return render(); }
    if (action === 'back-dashboard') { state.currentProjectId = null; state.currentTab = 'overview'; return render(); }
    if (action === 'save-project') return saveProject(currentProject(), false);
    if (action === 'edit-project') return openProjectDialog(currentProject());
    if (action === 'new-variant') { variantForm.reset(); variantDialog.showModal(); return; }
    if (action === 'upload-photo') return photoInput.click();
    if (action === 'undo-photo') { const project = currentProject(); currentVariant(project).photo.annotations.pop(); await saveProject(project); return render(); }
    if (action === 'clear-photo') { const project = currentProject(); if (!confirm('Odstranit všechny kóty a poznámky z fotografie?')) return; const photo=currentVariant(project).photo, before={annotations:deepClone(photo.annotations),calibration:deepClone(photo.calibration)}; photo.annotations = []; photo.calibration = null; await saveProject(project); setUndo('kóty fotografie',async()=>{photo.annotations=before.annotations;photo.calibration=before.calibration;await saveProject(project);render();}); return render(); }
    if (action === 'fit-plan') { const project = currentProject(); const plan = currentVariant(project).plan; if (!plan.walls.length && !plan.objects.length) return toast('Výkres zatím neobsahuje žádné prvky.', 'error'); pushPlanHistory(project); fitPlanToCanvas(plan); await saveProject(project); toast('Výkres byl vystředěn a přizpůsoben plátnu.'); return render(); }
    if (action === 'undo-plan') return undoPlanChange();
    if (action === 'clear-plan') { const project = currentProject(); if (!confirm('Odstranit celý 2D výkres aktuální varianty?')) return; pushPlanHistory(project); const plan = currentVariant(project).plan, before={walls:deepClone(plan.walls),objects:deepClone(plan.objects)}; plan.walls = []; plan.objects = []; await saveProject(project); setUndo('celý 2D výkres',async()=>{plan.walls=before.walls;plan.objects=before.objects;await saveProject(project);render();}); return render(); }
    if (action === 'reset-camera') { state.threeD = { angle: 42, tilt: 28, zoom: 1 }; return render(); }
    if (action === 'add-material') return openMaterialDialog();
    if (action === 'edit-material') return openMaterialDialog(currentVariant().materials.find((item) => item.id === id));
    if (action === 'remove-material') { const project = currentProject(); const variant = currentVariant(project); const item = variant.materials.find((entry) => entry.id === id); if (!item || !confirm(`Odstranit položku „${item.name}“?`)) return; const index=variant.materials.indexOf(item), links=variant.plan.objects.filter((object)=>object.materialId===id).map((object)=>object.id); variant.materials = variant.materials.filter((entry) => entry.id !== id); variant.plan.objects.forEach((object) => { if (object.materialId === id) object.materialId = ''; }); await saveProject(project); setUndo(`materiál ${item.name}`,async()=>{variant.materials.splice(index,0,item);variant.plan.objects.forEach((object)=>{if(links.includes(object.id))object.materialId=item.id;});await saveProject(project);render();}); toast('Položka byla odstraněna.'); return render(); }
    if (action === 'add-cost') return openCostDialog();
    if (action === 'edit-cost') return openCostDialog(currentVariant().costs.lines.find((item) => item.id === id));
    if (action === 'remove-cost') { const project = currentProject(); const variant = currentVariant(project); const item=variant.costs.lines.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit náklad „${item.name}“?`))return;const index=variant.costs.lines.indexOf(item);variant.costs.lines = variant.costs.lines.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`náklad ${item.name}`,async()=>{variant.costs.lines.splice(index,0,item);await saveProject(project);render();}); toast('Náklad byl odstraněn.'); return render(); }
    if (action === 'add-assembly') return openAssemblyDialog(type);
    if (action === 'remove-assembly') { const project = currentProject(); const variant = currentVariant(project);const item=variant.assemblies[type].find((layer)=>layer.id===id);if(!item||!confirm(`Odstranit vrstvu „${item.name}“?`))return;const index=variant.assemblies[type].indexOf(item); variant.assemblies[type] = variant.assemblies[type].filter((layer) => layer.id !== id); await saveProject(project);setUndo(`vrstvu ${item.name}`,async()=>{variant.assemblies[type].splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'reset-assemblies') { if (!confirm('Nahradit všechny konstrukční skladby výchozími hodnotami?')) return; const project = currentProject(),variant=currentVariant(project),before=deepClone(variant.assemblies); variant.assemblies = deepClone(DEFAULT_ASSEMBLIES); await saveProject(project); setUndo('konstrukční skladby',async()=>{variant.assemblies=before;await saveProject(project);render();}); toast('Výchozí skladby byly obnoveny.'); return render(); }
    if (action === 'upload-compare-before') return compareBeforeInput.click();
    if (action === 'upload-compare-after') return compareAfterInput.click();
    if (action === 'use-project-photo-before') { const project = currentProject(); const variant = currentVariant(project); if (!variant.photo.dataUrl) return toast('Projekt zatím nemá fotografii.', 'error'); variant.comparison.beforeDataUrl = null; await saveProject(project); toast('Jako stav „před“ se používá projektová fotografie.'); return render(); }
    if (action === 'generate-model-after') { const project = currentProject(); const variant = currentVariant(project); const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 900; drawModelCanvas(canvas, variant.plan, variant, 'material'); variant.comparison.afterDataUrl = canvas.toDataURL('image/jpeg', 0.9); await saveProject(project); toast('Vizualizace „po“ byla vytvořena z 3D modelu.'); return render(); }
    if (action === 'swap-comparison') { const project = currentProject(); const comparison = currentVariant(project).comparison; const before = comparison.beforeDataUrl || currentVariant(project).photo.dataUrl; const after = comparison.afterDataUrl; comparison.beforeDataUrl = after || null; comparison.afterDataUrl = before || null; [comparison.beforeLabel, comparison.afterLabel] = [comparison.afterLabel, comparison.beforeLabel]; await saveProject(project); return render(); }
    if (action === 'upload-room-photos') return roomPhotosInput.click();
    if (action === 'add-main-photo-to-set') return addMainPhotoToSet();
    if (action === 'select-room-photo') { const project = currentProject(); currentVariant(project).ai.activePhotoId = id; await saveProject(project); return render(); }
    if (action === 'remove-room-photo') { const project = currentProject(); const ai = currentVariant(project).ai;const item=ai.photoSet.find((photo)=>photo.id===id);if(!item||!confirm(`Odstranit fotografii „${item.name}“?`))return;const index=ai.photoSet.indexOf(item),wasActive=ai.activePhotoId===id; ai.photoSet = ai.photoSet.filter((photo) => photo.id !== id); if (wasActive) ai.activePhotoId = ai.photoSet[0]?.id || ''; await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{ai.photoSet.splice(index,0,item);if(wasActive)ai.activePhotoId=item.id;await saveProject(project);render();}); return render(); }
    if (action === 'export-photo-mosaic') return exportPhotoMosaic();
    if (action === 'refresh-ai-status') return checkAiStatus(true);
    if (action === 'run-local-analysis') return runLocalAnalysis();
    if (action === 'run-cloud-analysis') return runCloudAnalysis('space');
    if (action === 'apply-proposed-plan') return applyProposedPlan();
    if (action === 'add-detected-element') return addDetectedElement(Number(event.currentTarget.dataset.index));
    if (action === 'generate-local-variants') { const project = currentProject(); const variant = currentVariant(project); variant.ai.variantIdeas = buildLocalVariantIdeas(project, variant); await saveProject(project); toast('Byly připraveny tři návrhové směry.'); return render(); }
    if (action === 'generate-cloud-variants') return runCloudAnalysis('variants');
    if (action === 'create-idea-variant') return createVariantFromIdea(Number(event.currentTarget.dataset.index));
    if (action === 'new-field-session') { const project = currentProject(); const name = await askValue({ title: 'Nové zaměření', label: 'Název zaměření', value: `Zaměření ${currentVariant(project).field.sessions.length + 1}`, required: true }); if (!name) return; const session = blankFieldSession(name); currentVariant(project).field.sessions.push(session); currentVariant(project).field.activeSessionId = session.id; await saveProject(project); return render(); }
    if (action === 'delete-field-session') { const project = currentProject(); const field = currentVariant(project).field; if (field.sessions.length <= 1) return toast('Projekt musí obsahovat alespoň jedno zaměření.', 'error'); const session = currentFieldSession(currentVariant(project)); if (!confirm(`Odstranit zaměření „${session.name}“?`)) return; const index=field.sessions.indexOf(session),previousActive=field.activeSessionId; field.sessions = field.sessions.filter((item) => item.id !== session.id); field.activeSessionId = field.sessions[0].id; await saveProject(project); setUndo(`zaměření ${session.name}`,async()=>{field.sessions.splice(index,0,session);field.activeSessionId=previousActive;await saveProject(project);render();}); return render(); }
    if (action === 'add-field-measurement') return addFieldMeasurement();
    if (action === 'remove-field-measurement') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.measurements.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit měření „${item.label}“?`))return;const index=session.measurements.indexOf(item); session.measurements = session.measurements.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`měření ${item.label}`,async()=>{session.measurements.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'capture-field-photo') return fieldPhotoInput.click();
    if (action === 'remove-field-photo') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.photos.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit fotografii „${item.name}“?`))return;const index=session.photos.indexOf(item); session.photos = session.photos.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{session.photos.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'save-field-location') return saveFieldLocation();
    if (action === 'import-lidar') return scanInput.click();
    if (action === 'remove-scan') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.scans.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit sken „${item.name}“?`))return;const index=session.scans.indexOf(item); session.scans = session.scans.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`sken ${item.name}`,async()=>{session.scans.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'apply-roomplan') return applyRoomPlanScan(id);
    if (action === 'refresh-sync-status') return checkSyncStatus(true);
    if (action === 'copy-mobile-url') { const url = `${state.syncStatus.serverUrl.replace(/\/$/, '')}/?mobile=1`; try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url); else throw new Error('Clipboard není dostupný'); toast('Adresa pro telefon byla zkopírována.'); } catch { await askValue({ title: 'Adresa pro telefon', label: 'Zkopírujte adresu ručně', value: url }); } return; }
    if (action === 'pair-sync-device') { const input = document.getElementById('syncPairCode'); return pairSyncDevice(String(input?.value || '')); }
    if (action === 'revoke-sync-device') { if(!confirm('Zrušit přístup tomuto zařízení?'))return;const response=await fetch('/api/sync/revoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const payload=await response.json();if(!response.ok||!payload.ok)return toast(payload.error||'Přístup se nepodařilo zrušit.','error');toast('Přístup zařízení byl zrušen.');await checkSyncStatus(false);return render(); }
    if (action === 'sync-push') return pushCurrentProjectToSync();
    if (action === 'sync-pull') return pullCurrentProjectFromSync();
    if (action === 'sync-import-projects') return importProjectsFromSync();
    if (action === 'edit-plan-object') return openObjectDialog(currentVariant().plan.objects.find((object)=>object.id===id));
    if (action === 'edit-plan-wall') { const project=currentProject(),plan=currentVariant(project).plan,wall=plan.walls.find((item)=>item.id===id);if(!wall)return;const pixels=Math.hypot(wall.x2-wall.x1,wall.y2-wall.y1),currentLength=pixels/plan.scale;const entered=await askValue({title:'Upravit stěnu',label:'Přesná délka v metrech',value:currentLength.toFixed(2),type:'number',min:.01,required:true});const exact=parseNum(entered,currentLength);if(entered!==null&&exact>0){pushPlanHistory(project);const ux=(wall.x2-wall.x1)/pixels,uy=(wall.y2-wall.y1)/pixels;wall.x2=wall.x1+ux*exact*plan.scale;wall.y2=wall.y1+uy*exact*plan.scale;wall.updatedAt=new Date().toISOString();await saveProject(project);render();}return; }
    if (action === 'fullscreen-presentation') return openPresentationFullscreen();
    if (action === 'reset-walkthrough') { resetWalkthroughCamera(); return drawWalkthrough(); }
    if (action === 'toggle-gyro') return toggleGyroscope();
    if (action === 'check-xr') return checkXRSupport(true);
    if (action === 'start-webxr') return startWebXRPresentation();
    if (action === 'set-audit-status') {
      const project = currentProject(), audit = currentVariant(project).audit;
      const status = event.currentTarget.dataset.status || 'open';
      if (status === 'open') delete audit.overrides[id];
      else {
        const note = await askValue({ title: status === 'ignored' ? 'Přijmout technické riziko' : 'Potvrdit vyřešení nálezu', label: 'Zdůvodnění nebo důkaz', help: status === 'ignored' ? 'U kritického rizika uveďte, kdo a proč jej přijal. Technické skóre se tím nezmění.' : 'Uveďte provedenou změnu, nové měření nebo kontrolní dokument.', required: true });
        if (!note?.trim()) return;
        audit.overrides[id] = { status, note: note.trim(), fingerprint: event.currentTarget.dataset.fingerprint || '', updatedAt: new Date().toISOString() };
      }
      await saveProject(project); return render();
    }
    if (action === 'reset-audit-overrides') { const project=currentProject();currentVariant(project).audit.overrides={};await saveProject(project);toast('Všechny automatické nálezy jsou znovu aktivní.');return render(); }
    if (action === 'print-audit') return printAuditProtocol();
    if (action === 'save-rfq') { const project=currentProject();collectRfqForm(currentVariant(project));await saveProject(project);toast('Nastavení poptávky bylo uloženo.');return render(); }
    if (action === 'print-rfq') return printRfq();
    if (action === 'download-rfq-html') return downloadRfqHtml();
    if (action === 'download-rfq-csv') return downloadRfqCsv();
    if (action === 'new-diary-entry') return openDiaryDialog();
    if (action === 'edit-diary-entry') return openDiaryDialog(currentVariant().diary.entries.find((item)=>item.id===id));
    if (action === 'remove-diary-entry') { const project=currentProject(),diary=currentVariant(project).diary;const item=diary.entries.find((entry)=>entry.id===id);if(!item||!confirm('Odstranit tento záznam včetně připojených fotografií?'))return;const index=diary.entries.indexOf(item),passport=diary.passport.filter((entry)=>entry.entryId===id);diary.entries=diary.entries.filter((entry)=>entry.id!==id);diary.passport=diary.passport.filter((entry)=>entry.entryId!==id);await saveProject(project);setUndo(`záznam ${item.title}`,async()=>{diary.entries.splice(index,0,item);diary.passport.push(...passport);await saveProject(project);render();});return render(); }
    if (action === 'upload-diary-photo') { diaryPhotoInput.dataset.entryId=id;return diaryPhotoInput.click(); }
    if (action === 'new-warranty') return openWarrantyDialog();
    if (action === 'edit-warranty') return openWarrantyDialog(currentVariant().diary.warranties.find((item)=>item.id===id));
    if (action === 'remove-warranty') { const project=currentProject(),items=currentVariant(project).diary.warranties,item=items.find((entry)=>entry.id===id);if(!item||!confirm(`Smazat záruku nebo doklad „${item.item}“?`))return;const index=items.indexOf(item);currentVariant(project).diary.warranties=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`záruku ${item.item}`,async()=>{currentVariant(project).diary.warranties.splice(index,0,item);await saveProject(project);render();});return render(); }
    if (action === 'upload-warranty-document') { warrantyDocumentInput.dataset.warrantyId=id;return warrantyDocumentInput.click(); }
    if (action === 'download-warranty-document') { const item=currentVariant().diary.warranties.find((w)=>w.id===id),doc=item?.documents?.find((d)=>d.id===event.currentTarget.dataset.docId);if(!doc?.dataUrl)return toast(doc?.note||'Soubor není uložen v aplikaci.','error');const link=document.createElement('a');link.href=doc.dataUrl;link.download=doc.name;link.click();return; }
    if (action === 'edit-passport-item') return editPassportItem(currentVariant().diary.passport.find((item)=>item.id===id));
    if (action === 'remove-passport-item') { const project=currentProject(),items=currentVariant(project).diary.passport,item=items.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit položku technického pasu „${item.name}“?`))return;const index=items.indexOf(item);currentVariant(project).diary.passport=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`položku pasu ${item.name}`,async()=>{currentVariant(project).diary.passport.splice(index,0,item);await saveProject(project);render();});return render(); }
    if (action === 'open-settings') return openSettingsDialog();
    if (action === 'open-onboarding') return showOnboardingIfNeeded(true);
    if (action === 'open-plan-from-library') { state.currentTab='plan'; return render(); }
    if (action === 'insert-library-item') return insertLibraryItem(id);
    if (action === 'remove-custom-library') return removeCustomLibrary(id);
    if (action === 'redo-plan') return redoPlanChange();
    if (action === 'export-dxf') return exportCurrentDxf();
    if (action === 'duplicate-selection') return duplicatePlanSelection();
    if (action === 'mirror-selection-x') return transformSelection('mirror-x');
    if (action === 'mirror-selection-y') return transformSelection('mirror-y');
    if (action === 'align-selection-left') return transformSelection('align-left');
    if (action === 'align-selection-top') return transformSelection('align-top');
    if (action === 'save-selection-library') return saveSelectionToLibrary();
    if (action === 'delete-selection') return deletePlanSelection();
    if (action === 'export-report-html') return exportPremiumReportHtml();
    if (action === 'export-warranty-calendar') return exportWarrantyCalendar();
    if (action === 'export-glb') return exportCurrentGlb();
    if (action === 'fullscreen-3d') return fullscreenThree();
    if (action === 'capture-3d') return captureThreeImage();
    if (action === 'retry-3d') return setupModelCanvas();
    if (action === 'print-pdf') return prepareAndPrint();
  }

  function openMaterialDialog(item = null) {
    materialForm.reset(); delete materialForm.dataset.editingId;
    materialForm.elements.quantity.value = '1'; materialForm.elements.coverage.value = '1'; materialForm.elements.wastePercent.value = '10'; materialForm.elements.swatch.value = '#d6d6d0';
    if (item) {
      materialForm.dataset.editingId = item.id;
      ['url','name','category','manufacturer','sku','width','depth','height','calculation','unit','quantity','coverage','wastePercent','unitPrice','color','swatch','note'].forEach((key) => { if (materialForm.elements[key]) materialForm.elements[key].value = item[key] ?? ''; });
    }
    materialDialog.showModal();
  }

  function openCostDialog(item = null) {
    costForm.reset(); delete costForm.dataset.editingId; costForm.elements.quantity.value = '1';
    if (item) { costForm.dataset.editingId = item.id; ['name','category','quantity','unit','unitPrice','note'].forEach((key) => { costForm.elements[key].value = item[key] ?? ''; }); }
    costDialog.showModal();
  }

  function openAssemblyDialog(type = 'floor') {
    assemblyForm.reset(); assemblyForm.dataset.type = type; assemblyForm.elements.color.value = type === 'floor' ? '#c8b08a' : type === 'wall' ? '#a67f62' : '#dedbd2'; assemblyDialog.showModal();
  }

  function openObjectDialog(object) {
    if (!object) return;
    const variant = currentVariant(); const plan = variant.plan;
    objectForm.reset(); objectForm.dataset.editingId = object.id;
    objectForm.elements.type.value = object.type;
    objectForm.elements.widthMm.value = Math.round(object.width / plan.scale * 1000);
    objectForm.elements.depthMm.value = Math.round(object.depth / plan.scale * 1000);
    objectForm.elements.heightCm.value = object.height;
    objectForm.elements.rotation.value = object.rotation || 0;
    objectForm.elements.layer.innerHTML = Object.entries(LAYERS).map(([key, layer]) => `<option value="${key}" ${object.layer === key ? 'selected' : ''}>${escapeHtml(layer.label)}</option>`).join('');
    objectForm.elements.materialId.innerHTML = materialOptions(variant, object.materialId);
    objectForm.elements.hingeSide.value = object.hingeSide || 'left';
    objectForm.elements.opensTo.value = object.opensTo || 'inside';
    objectForm.elements.note.value = object.note || '';
    objectDialog.showModal();
  }

  function openProjectDialog(project = null) {
    projectForm.reset();
    if (project) {
      projectForm.dataset.editingId = project.id;
      projectForm.elements.name.value = project.name;
      projectForm.elements.category.value = project.category;
      projectForm.elements.status.value = project.status;
      projectForm.elements.location.value = project.location;
      projectForm.elements.summary.value = project.summary;
    } else {
      delete projectForm.dataset.editingId;
      if(projectForm.elements.template) projectForm.elements.template.value='blank';
    }
    projectDialog.showModal();
  }

  function setupActiveView() {
    if (state.currentTab === 'field') { checkSyncStatus(false); }
    if (state.currentTab === 'ai') setupAiWorkspace();
    if (state.currentTab === 'photo') setupPhotoCanvas();
    if (state.currentTab === 'plan') setupPlanCanvas();
    if (state.currentTab === 'section') setupSectionCanvas();
    if (state.currentTab === 'model') setupModelCanvas();
    if (state.currentTab === 'presentation') setupWalkthrough();
  }

/* Premium 2D, library and export actions. */
  function downloadText(text,name,type='text/plain;charset=utf-8'){downloadBlob(new Blob([text],{type}),name);}
  function exportCurrentDxf(){const p=currentProject(),v=currentVariant(p);downloadText(DomusPremium.exportDxf(v.plan,{projectName:p.name,variantName:v.name}),`${DomusCore.safeId(p.name,'projekt')}-${DomusCore.safeId(v.name,'varianta')}.dxf`,'application/dxf');toast('DXF výkres byl vytvořen.');}
  function planSelectionItems(plan){const ids=state.selectedPlanIds||new Set();return{walls:plan.walls.filter(x=>ids.has(x.id)),objects:plan.objects.filter(x=>ids.has(x.id))};}
  async function duplicatePlanSelection(){const p=currentProject(),v=currentVariant(p),plan=v.plan,{walls,objects}=planSelectionItems(plan);if(!walls.length&&!objects.length)return;pushPlanHistory(p,v);const ids=new Set();walls.forEach(w=>{const n={...deepClone(w),id:uid('wall'),x1:w.x1+20,y1:w.y1+20,x2:w.x2+20,y2:w.y2+20,updatedAt:new Date().toISOString()};plan.walls.push(n);ids.add(n.id);});objects.forEach(o=>{const n={...deepClone(o),id:uid('object'),x:o.x+20,y:o.y+20,updatedAt:new Date().toISOString()};plan.objects.push(n);ids.add(n.id);});state.selectedPlanIds=ids;await saveProject(p);render();}
  async function transformSelection(kind){const p=currentProject(),v=currentVariant(p),plan=v.plan,{walls,objects}=planSelectionItems(plan);if(!walls.length&&!objects.length)return;pushPlanHistory(p,v);const xs=[...walls.flatMap(w=>[w.x1,w.x2]),...objects.flatMap(o=>[o.x,o.x+o.width])],ys=[...walls.flatMap(w=>[w.y1,w.y2]),...objects.flatMap(o=>[o.y,o.y+o.depth])],cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;if(kind==='mirror-x'){walls.forEach(w=>{w.x1=2*cx-w.x1;w.x2=2*cx-w.x2;});objects.forEach(o=>o.x=2*cx-o.x-o.width);}if(kind==='mirror-y'){walls.forEach(w=>{w.y1=2*cy-w.y1;w.y2=2*cy-w.y2;});objects.forEach(o=>o.y=2*cy-o.y-o.depth);}if(kind==='align-left'&&objects.length>1){const x=Math.min(...objects.map(o=>o.x));objects.forEach(o=>o.x=x);}if(kind==='align-top'&&objects.length>1){const y=Math.min(...objects.map(o=>o.y));objects.forEach(o=>o.y=y);}[...walls,...objects].forEach(x=>x.updatedAt=new Date().toISOString());await saveProject(p);render();}
  async function deletePlanSelection(){const p=currentProject(),v=currentVariant(p),ids=state.selectedPlanIds||new Set();if(!ids.size)return;pushPlanHistory(p,v);v.plan.walls=v.plan.walls.filter(x=>!ids.has(x.id));v.plan.objects=v.plan.objects.filter(x=>!ids.has(x.id));state.selectedPlanIds=new Set();await saveProject(p);render();}
  async function saveSelectionToLibrary(){const v=currentVariant(),items=planSelectionItems(v.plan).objects;if(items.length!==1)return toast('Vyberte právě jeden objekt.','error');const o=items[0],name=await askValue('Uložit do vlastní knihovny','Název vlastní šablony',o.type,'Název se zobrazí v parametrické knihovně.');if(!name)return;const itemsStored=customElementLibrary(),key=`custom-${DomusCore.safeId(name,'prvek')}-${Date.now().toString(36)}`;itemsStored.push({key,name,layer:o.layer,width:Math.round(o.width/v.plan.scale*1000),depth:Math.round(o.depth/v.plan.scale*1000),height:o.height,color:o.color,shape:o.shape,custom:true,note:o.note||''});saveJsonStorage('domusCustomElements',itemsStored);toast('Prvek byl uložen do vlastní knihovny.');}
  async function insertLibraryItem(key){const p=currentProject(),v=currentVariant(p),def=allElementLibrary().find(x=>x.key===key);if(!def)return;pushPlanHistory(p,v);const o={id:uid('object'),type:def.name,libraryKey:def.key,layer:def.layer,shape:def.shape,x:180,y:180,width:def.width/1000*v.plan.scale,depth:def.depth/1000*v.plan.scale,height:def.height,color:def.color,note:def.note||'',materialId:'',rotation:0,updatedAt:new Date().toISOString()};v.plan.objects.push(o);state.selectedPlanIds=new Set([o.id]);state.currentTab='plan';await saveProject(p);render();}
  function removeCustomLibrary(key){saveJsonStorage('domusCustomElements',customElementLibrary().filter(x=>x.key!==key));render();}
  function exportWarrantyCalendar(){const p=currentProject();downloadText(DomusPremium.warrantyIcs(p),`${DomusCore.safeId(p.name,'projekt')}-zaruky.ics`,'text/calendar;charset=utf-8');toast('Kalendář záruk byl vytvořen.');}

/* AI workspace, field capture, RoomPlan and LAN synchronization. Source fragment; assembled by scripts/build.mjs. */


  async function updateRoomPhotoField(id, key, value) {
    const project = currentProject();
    const photo = currentVariant(project)?.ai?.photoSet?.find((item) => item.id === id);
    if (!photo) return;
    photo[key] = value;
    await saveProject(project);
  }

  async function importRoomPhotos() {
    const files = Array.from(roomPhotosInput.files || []).slice(0, 8);
    roomPhotosInput.value = '';
    if (!files.length) return;
    const project = currentProject(); const variant = currentVariant(project);
    toast(`Zpracovávám ${files.length} snímků…`);
    for (const file of files) {
      try {
        const dataUrl = await resizeImage(file, 1600, 1200, 0.82);
        const item = { id: uid('roomphoto'), name: file.name.replace(/\.[^.]+$/, '') || `Snímek ${variant.ai.photoSet.length + 1}`, view: 'detail', note: '', dataUrl, createdAt: new Date().toISOString() };
        variant.ai.photoSet.push(item);
        if (!variant.ai.activePhotoId) variant.ai.activePhotoId = item.id;
      } catch (error) { console.warn('Room photo:', error); }
    }
    await saveProject(project); toast('Sada fotografií byla doplněna.'); render();
  }

  async function addMainPhotoToSet() {
    const project = currentProject(); const variant = currentVariant(project);
    if (!variant.photo.dataUrl) return toast('Hlavní projektová fotografie zatím není vložena.', 'error');
    const existing = variant.ai.photoSet.find((photo) => photo.dataUrl === variant.photo.dataUrl);
    if (existing) { variant.ai.activePhotoId = existing.id; await saveProject(project); return render(); }
    const item = { id: uid('roomphoto'), name: 'Hlavní projektová fotografie', view: 'front', note: 'Převzato z karty Fotografie.', dataUrl: variant.photo.dataUrl, createdAt: new Date().toISOString() };
    variant.ai.photoSet.unshift(item); variant.ai.activePhotoId = item.id; await saveProject(project); toast('Hlavní fotografie byla přidána do sady.'); render();
  }

  function setupAiWorkspace() {
    setupPhotoMosaic();
    if (!state.aiStatus.checked) checkAiStatus(false);
  }

  function setupPhotoMosaic() {
    const canvas = document.getElementById('photoMosaicCanvas'); const variant = currentVariant();
    if (!canvas || !variant) return;
    drawPhotoMosaic(canvas, variant.ai.photoSet).catch(console.warn);
  }

  async function drawPhotoMosaic(canvas, photos) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#101a20'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const selected = (photos || []).slice(0, 6);
    if (!selected.length) { ctx.fillStyle = '#7f919b'; ctx.font = '600 30px system-ui'; ctx.textAlign = 'center'; ctx.fillText('Nahrajte fotografie prostoru', canvas.width / 2, canvas.height / 2); return; }
    const cols = selected.length === 1 ? 1 : 2; const rows = Math.ceil(selected.length / cols); const gap = 18;
    const cellW = (canvas.width - gap * (cols + 1)) / cols; const cellH = (canvas.height - gap * (rows + 1)) / rows;
    const loaded = await Promise.all(selected.map((photo) => loadImage(photo.dataUrl).then((image) => ({ photo, image })).catch(() => null)));
    loaded.filter(Boolean).forEach(({ photo, image }, index) => {
      const col = index % cols, row = Math.floor(index / cols); const x = gap + col * (cellW + gap), y = gap + row * (cellH + gap);
      const ratio = Math.max(cellW / image.width, cellH / image.height); const w = image.width * ratio, h = image.height * ratio;
      ctx.save(); roundRect(ctx, x, y, cellW, cellH, 16); ctx.clip(); ctx.drawImage(image, x + (cellW - w) / 2, y + (cellH - h) / 2, w, h); ctx.fillStyle = 'rgba(7,13,17,.66)'; ctx.fillRect(x, y + cellH - 48, cellW, 48); ctx.fillStyle = '#fff'; ctx.font = '600 20px system-ui'; ctx.textAlign = 'left'; ctx.fillText(photo.name.slice(0, 42), x + 16, y + cellH - 17); ctx.restore();
    });
  }

  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

  async function exportPhotoMosaic() {
    const variant = currentVariant(); if (!variant?.ai.photoSet.length) return toast('Sada fotografií je prázdná.', 'error');
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1100; await drawPhotoMosaic(canvas, variant.ai.photoSet);
    canvas.toBlob((blob) => blob && downloadBlob(blob, `DOMUS-fotoprehled-${Date.now()}.png`), 'image/png');
  }

  async function checkAiStatus(showToast = false) {
    try {
      const response = await fetch('/api/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('Lokální server nevrátil stav AI.');
      const data = await response.json();
      state.aiStatus = { checked: true, configured: Boolean(data.configured), model: data.model || '', message: data.message || '' };
      if (showToast) toast(data.configured ? 'Cloudová AI je připravena.' : 'AI klíč zatím není nastaven.', data.configured ? '' : 'error');
    } catch (error) {
      state.aiStatus = { checked: true, configured: false, model: '', message: 'Aplikace běží bez lokálního AI proxy. Spusťte ji přes hlavní BAT soubor.' };
      if (showToast) toast(state.aiStatus.message, 'error');
    }
    if (state.currentTab === 'ai') render();
  }

  async function analyzeImageLocally(dataUrl) {
    const image = await loadImage(dataUrl); const canvas = document.createElement('canvas');
    const max = 520; const ratio = Math.min(max / image.width, max / image.height, 1); canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio));
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height); const gray = new Float32Array(canvas.width * canvas.height);
    let brightness = 0, saturation = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) { const r=data[i],g=data[i+1],b=data[i+2]; gray[p]=0.299*r+0.587*g+0.114*b; brightness += gray[p]; saturation += Math.max(r,g,b)-Math.min(r,g,b); }
    brightness /= gray.length; saturation /= gray.length;
    let vertical=0,horizontal=0,edge=0;
    for (let y=1;y<canvas.height-1;y+=2) for (let x=1;x<canvas.width-1;x+=2) { const p=y*canvas.width+x; const gx=Math.abs(gray[p+1]-gray[p-1]); const gy=Math.abs(gray[p+canvas.width]-gray[p-canvas.width]); vertical += gx; horizontal += gy; edge += Math.hypot(gx,gy); }
    const samples=Math.max(1,Math.floor((canvas.width-2)/2)*Math.floor((canvas.height-2)/2)); vertical/=samples; horizontal/=samples; edge/=samples;
    const quality = clamp((edge / 42) * 0.45 + (1 - Math.abs(brightness - 135) / 180) * 0.4 + Math.min(1, image.width / 1200) * 0.15, 0.15, 0.88);
    const variant=currentVariant(); const currentMetrics=computeProjectMetrics(variant); const bounds=planBounds(variant.plan);
    const widthMm = bounds ? Math.max(1000, Math.round(bounds.width / variant.plan.scale * 1000)) : variant.ai.proposedPlan.widthMm;
    const depthMm = bounds ? Math.max(1000, Math.round(bounds.height / variant.plan.scale * 1000)) : variant.ai.proposedPlan.depthMm;
    const lineDiagnostics = [
      vertical > 10 ? `Výrazné svislé linie: ${Math.round(vertical)}` : '',
      horizontal > 10 ? `Výrazné vodorovné linie: ${Math.round(horizontal)}` : '',
    ].filter(Boolean);
    return { summary:`Kontrola snímku ${image.width} × ${image.height} px nalezla ${edge > 14 ? 'dobře čitelné' : 'spíše slabé'} linie. Jas ${Math.round(brightness)}/255, barevná členitost ${Math.round(saturation)}/255.${lineDiagnostics.length ? ` ${lineDiagnostics.join('. ')}.` : ''}`, confidence:quality, roomType:currentProject()?.category || 'Neurčeno', proposedPlan:{shape:'rectangle',widthMm,depthMm,wallHeightM:variant.plan.wallHeight}, elements:[], risks:[brightness<55?'Snímek je velmi tmavý; linie mohou splývat.':'Perspektiva jediné fotografie může významně zkreslit vzdálenosti.',edge<10?'Snímek má málo výrazných linií; pořiďte rovnější a ostřejší záběr.':'Detekovaná linie sama o sobě nedokazuje přítomnost konkrétní konstrukce.'], measurementsToVerify:['Celková šířka a hloubka prostoru','Výška stropu','Poloha a rozměry otvorů','Vzdálenosti instalačních bodů od pevných rohů'], diagnostics:{brightness, saturation, edge, vertical, horizontal, width:image.width, height:image.height} };
  }

  function planBounds(plan) {
    const points=[]; (plan.walls||[]).forEach((wall)=>points.push([wall.x1,wall.y1],[wall.x2,wall.y2])); (plan.objects||[]).forEach((object)=>points.push([object.x,object.y],[object.x+object.width,object.y+object.depth]));
    if (!points.length) return null; const xs=points.map((p)=>p[0]), ys=points.map((p)=>p[1]); return {minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
  }

  async function runLocalAnalysis() {
    const project=currentProject(), variant=currentVariant(project), photo=activeRoomPhoto(variant); const dataUrl=photo?.dataUrl || variant.photo.dataUrl;
    if (!dataUrl) return toast('Nejdříve vložte fotografii.', 'error');
    try { state.aiBusy=true; toast('Probíhá kontrola kvality fotografie a detekce linií…'); const result=await analyzeImageLocally(dataUrl); variant.ai.localAnalysis=result; variant.ai.analysis=null; variant.ai.proposedPlan={...variant.ai.proposedPlan,...result.proposedPlan}; variant.ai.lastSource='local'; variant.ai.lastRunAt=new Date().toISOString(); await saveProject(project); toast('Kontrola fotografie byla dokončena.'); }
    catch(error){console.error(error);toast('Kontrolu fotografie se nepodařilo dokončit.','error');} finally {state.aiBusy=false;render();}
  }

  function extractJsonText(text) {
    const clean=String(text||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
    try{return JSON.parse(clean);}catch{}
    const start=clean.indexOf('{'), end=clean.lastIndexOf('}'); if(start>=0&&end>start) return JSON.parse(clean.slice(start,end+1));
    throw new Error('AI nevrátila čitelný strukturovaný výsledek.');
  }

  async function runCloudAnalysis(task='space') {
    const project=currentProject(), variant=currentVariant(project), photo=activeRoomPhoto(variant); const dataUrl=photo?.dataUrl || variant.photo.dataUrl;
    if (task==='space' && !dataUrl) return toast('Nejdříve vložte fotografii.', 'error');
    if (!state.aiStatus.checked) await checkAiStatus(false);
    if (!state.aiStatus.configured) return toast('Nejdříve spusťte „Nastavit-AI-pripojeni.bat“ v adresáři aplikace.', 'error');
    state.aiBusy=true; render();
    try {
      state.aiShare.location = Boolean(document.getElementById('aiShareLocation')?.checked);
      state.aiShare.materials = Boolean(document.getElementById('aiShareMaterials')?.checked);
      state.aiShare.notes = Boolean(document.getElementById('aiShareNotes')?.checked);
      const orderedPhotos = task === 'space' ? [photo, ...variant.ai.photoSet.filter((item) => item.id !== photo?.id)].filter(Boolean).slice(0, 4) : [];
      const categories = [`${orderedPhotos.length} fotografie`, 'název a kategorie projektu'];
      if (state.aiShare.location && project.location) categories.push('lokalita');
      if (state.aiShare.materials) categories.push('materiály a orientační ceny');
      if (state.aiShare.notes && variant.notes) categories.push('poznámky');
      if (!confirm(`Do cloudové AI budou odeslány: ${categories.join(', ')}. Pokračovat?`)) return;
      const payload={task, imageDataUrl:task==='space'?dataUrl:null, imageDataUrls:orderedPhotos.map((item)=>item.dataUrl), project:{name:project.name,category:project.category,summary:project.summary,location:state.aiShare.location?project.location:''}, current:{plan:variant.ai.proposedPlan,materials:state.aiShare.materials?variant.materials.map((item)=>({name:item.name,category:item.category,color:item.color,price:item.unitPrice})):[],notes:state.aiShare.notes?variant.notes:''}, photoViews:variant.ai.photoSet.map((item)=>({name:item.name,view:item.view,note:item.note})).slice(0,8)};
      const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); const data=await response.json(); if(!response.ok||!data.ok) throw new Error(data.error||'AI služba odpověděla chybou.');
      const rawResult=extractJsonText(data.text);
      if(task==='variants'){ variant.ai.variantIdeas=DomusCore.validateAiVariants(rawResult); toast('AI připravila tři validované návrhové varianty.'); }
      else { const result=DomusCore.validateAiAnalysis(rawResult); variant.ai.analysis=result; variant.ai.proposedPlan={...variant.ai.proposedPlan,...(result.proposedPlan||{})}; variant.ai.lastSource='cloud'; variant.ai.lastRunAt=new Date().toISOString(); toast('Obrazová AI dokončila validovanou analýzu.'); }
      await saveProject(project);
    } catch(error){console.error(error);toast(error.message||'AI analýza se nezdařila.','error');} finally {state.aiBusy=false;render();}
  }

  function buildPlanWalls(plan, shape, widthMm, depthMm) {
    const scale=plan.scale; const w=widthMm/1000*scale, d=depthMm/1000*scale; const x=500-w/2, y=360-d/2; const pts=shape==='l-shape' ? [[x,y],[x+w,y],[x+w,y+d*.58],[x+w*.64,y+d*.58],[x+w*.64,y+d],[x,y+d]] : [[x,y],[x+w,y],[x+w,y+d],[x,y+d]];
    return pts.map((point,index)=>{const next=pts[(index+1)%pts.length];return{id:uid('wall'),x1:point[0],y1:point[1],x2:next[0],y2:next[1]};});
  }

  async function applyProposedPlan() {
    const width=parseNum(document.getElementById('aiPlanWidth')?.value,0), depth=parseNum(document.getElementById('aiPlanDepth')?.value,0), height=parseNum(document.getElementById('aiPlanHeight')?.value,2.6), shape=document.getElementById('aiPlanShape')?.value||'rectangle';
    if(width<500||depth<500) return toast('Zadejte potvrzenou šířku a hloubku alespoň 500 mm.','error');
    const project=currentProject(), variant=currentVariant(project); if((variant.plan.walls.length||variant.plan.objects.length)&&!confirm('Nahradit stávající geometrii půdorysu navrženým tvarem? Materiály a rozpočet zůstanou zachovány.')) return;
    pushPlanHistory(project, variant); variant.plan.walls=buildPlanWalls(variant.plan,shape,width,depth); variant.plan.objects=[]; variant.plan.wallHeight=height; variant.ai.proposedPlan={shape,widthMm:width,depthMm:depth,wallHeightM:height,verifiedByUser:true}; fitPlanToCanvas(variant.plan); await saveProject(project); state.currentTab='plan'; toast('Základní půdorys byl vytvořen. Doplňte skutečné otvory a instalační body.'); render();
  }

  async function addDetectedElement(index) {
    const project=currentProject(), variant=currentVariant(project), analysis=variant.ai.analysis||variant.ai.localAnalysis, item=analysis?.elements?.[index]; if(!item)return;
    const template=ELEMENT_LIBRARY.find((element)=>element.key===(item.typeKey||item.libraryKey))||ELEMENT_LIBRARY.find((element)=>element.layer===(item.layer||'architecture'))||ELEMENT_LIBRARY[0]; const plan=variant.plan;
    pushPlanHistory(project, variant); plan.objects.push({id:uid('object'),type:item.name||template.name,libraryKey:template.key,layer:item.layer||template.layer,shape:template.shape,x:550+plan.objects.length*12,y:350+plan.objects.length*12,width:template.width/1000*plan.scale,depth:template.depth/1000*plan.scale,height:template.height,color:template.color,note:`Rozpoznáno z fotografie (${confidenceLabel(item.confidence||0)}). Polohu a rozměr ověřit. ${item.notes||''}`,materialId:''}); await saveProject(project); toast('Prvek byl vložen do středu 2D výkresu. Upravte jeho polohu a rozměry.');
  }

  function buildLocalVariantIdeas(project, variant) {
    const category=project.category||'projekt';
    return [
      {name:'Varianta A · účelná',style:'Úsporné a jednoduše realizovatelné řešení',description:`Minimalizuje počet atypických detailů a drží se standardních prvků pro oblast ${category.toLowerCase()}.`,budgetFactor:.82,contingencyPercent:12,changes:['Standardizované rozměry a dostupné materiály','Minimum zakázkových prvků','Priorita snadné údržby','Rezerva na skryté práce 12 %']},
      {name:'Varianta B · vyvážená',style:'Poměr vzhledu, životnosti a ceny',description:'Zachovává praktickou realizaci, ale dovoluje kvalitnější povrchy a promyšlenější detaily.',budgetFactor:1,contingencyPercent:10,changes:['Kvalitnější hlavní viditelné materiály','Standardní technické řešení','Vyvážená životnost a servisovatelnost','Rezerva 10 %']},
      {name:'Varianta C · prémiová',style:'Důraz na vzhled, komfort a dlouhodobou hodnotu',description:'Počítá s prémiovými povrchy, přesnějšími detaily a větším podílem zakázkového řešení.',budgetFactor:1.32,contingencyPercent:15,changes:['Prémiové povrchy a designové prvky','Vyšší důraz na skryté detaily','Příprava na budoucí rozšíření','Rezerva 15 %']},
    ];
  }

  async function createVariantFromIdea(index) {
    const project=currentProject(), source=currentVariant(project), idea=source.ai.variantIdeas[index]; if(!idea)return;
    const variant=deepClone(source); variant.id=uid('variant'); variant.name=idea.name; variant.createdAt=new Date().toISOString(); variant.costs.contingencyPercent=parseNum(idea.contingencyPercent,10); variant.materials.forEach((item)=>{item.unitPrice=round(parseNum(item.unitPrice)*parseNum(idea.budgetFactor,1),0);}); variant.costs.lines.forEach((item)=>{item.unitPrice=round(parseNum(item.unitPrice)*parseNum(idea.budgetFactor,1),0);}); variant.notes=`${variant.notes ? variant.notes+'\n\n':''}Návrhový směr: ${idea.description}\n${(idea.changes||[]).map((item)=>'• '+item).join('\n')}\nCeny byly pro scénář orientačně přepočteny koeficientem ${idea.budgetFactor || 1}× a musí být nahrazeny konkrétními nabídkami.`; variant.ai.variantIdeas=[]; project.variants.push(variant); project.activeVariantId=variant.id; await saveProject(project); toast('Byla vytvořena samostatná projektová varianta.'); render();
  }

  async function importProductFromUrl() {
    const urlField=materialForm.elements.url, button=document.getElementById('parseUrlBtn'); if(!urlField.value)return toast('Nejdříve vložte odkaz.','error');
    let url; try{url=new URL(urlField.value);}catch{return toast('Odkaz nemá platný formát.','error');}
    button.disabled=true; button.textContent='Načítám…';
    try{
      const response=await fetch('/api/product',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url.href})}); const payload=await response.json(); if(!response.ok||!payload.ok)throw new Error(payload.error||'Stránku se nepodařilo načíst.'); const product=extractProductData(payload.html||'',payload.url||url.href);
      if(product.name) materialForm.elements.name.value=product.name; if(product.manufacturer)materialForm.elements.manufacturer.value=product.manufacturer; if(product.sku)materialForm.elements.sku.value=product.sku; if(product.width)materialForm.elements.width.value=product.width; if(product.depth)materialForm.elements.depth.value=product.depth; if(product.height)materialForm.elements.height.value=product.height; if(product.price)materialForm.elements.unitPrice.value=product.price; if(product.color)materialForm.elements.color.value=product.color;
      materialForm.elements.note.value=[materialForm.elements.note.value,`Automaticky načteno z ${url.hostname}. ${product.evidence||'Údaje před objednávkou ověřte na stránce výrobce.'}`].filter(Boolean).join('\n'); toast(`Načteno: ${product.name||url.hostname}. Zkontrolujte rozměry a cenu.`);
    }catch(error){console.warn(error); const slug=decodeURIComponent(url.pathname.split('/').filter(Boolean).pop()||url.hostname).replace(/[-_]+/g,' ').replace(/\.(html?|php)$/i,'').replace(/\b\w/g,(char)=>char.toUpperCase()); if(!materialForm.elements.name.value)materialForm.elements.name.value=slug; materialForm.elements.note.value=materialForm.elements.note.value||`Zdroj: ${url.hostname}. Automatické načtení selhalo; údaje doplňte ručně.`; toast(error.message||'Automatický import se nezdařil.','error'); }
    finally{button.disabled=false;button.textContent='Načíst parametry z odkazu';}
  }

  function extractProductData(html, sourceUrl) {
    const doc=new DOMParser().parseFromString(html,'text/html'); let product={};
    const jsonScripts=Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    function findProduct(value){if(!value)return null;if(Array.isArray(value)){for(const item of value){const found=findProduct(item);if(found)return found;}}else if(typeof value==='object'){const type=value['@type'];if(type==='Product'||(Array.isArray(type)&&type.includes('Product')))return value;for(const key of ['@graph','mainEntity','itemListElement']){const found=findProduct(value[key]);if(found)return found;}}return null;}
    for(const script of jsonScripts){try{const found=findProduct(JSON.parse(script.textContent));if(found){product=found;break;}}catch{}}
    const meta=(...names)=>{for(const name of names){const el=doc.querySelector(`meta[property="${name}"],meta[name="${name}"]`);if(el?.content)return el.content.trim();}return'';};
    const text=(doc.body?.innerText||'').replace(/\s+/g,' ').slice(0,500000); const name=product.name||meta('og:title','twitter:title')||doc.title||''; const manufacturer=typeof product.brand==='string'?product.brand:product.brand?.name||product.manufacturer?.name||''; const sku=product.sku||product.mpn||'';
    const offers=Array.isArray(product.offers)?product.offers[0]:product.offers||{}; let price=parseNum(offers.price||meta('product:price:amount'),0); if(!price){const match=text.match(/(?:Cena\s*)?([1-9]\d{0,2}(?:[ .]\d{3})+|[1-9]\d{2,5})\s*Kč/i);if(match)price=parseNum(match[1].replace(/[ .]/g,''),0);}
    const normalizeDimension=(value)=>{if(value==null)return 0;if(typeof value==='number')return value;const raw=typeof value==='object'?`${value.value||''} ${value.unitCode||value.unitText||''}`:String(value);const m=raw.match(/([\d.,]+)\s*(mm|cm|m)?/i);if(!m)return 0;let v=parseNum(m[1]);const unit=(m[2]||'mm').toLowerCase();if(unit==='cm')v*=10;if(unit==='m')v*=1000;return Math.round(v);};
    let width=normalizeDimension(product.width),depth=normalizeDimension(product.depth),height=normalizeDimension(product.height); const props=[...(product.additionalProperty||[])]; for(const prop of props){const key=String(prop.name||'').toLowerCase(),value=normalizeDimension(prop.value);if(/šíř|width/.test(key)&&!width)width=value;if(/hloub|depth|délk|length/.test(key)&&!depth)depth=value;if(/výšk|height|tloušť|thick/.test(key)&&!height)height=value;}
    if(!width||!depth){const dim=text.match(/(?:rozměr[^\d]{0,30})?(\d{2,4})\s*[x×]\s*(\d{2,4})(?:\s*[x×]\s*(\d{1,4}))?\s*(mm|cm)?/i);if(dim){const factor=(dim[4]||'mm').toLowerCase()==='cm'?10:1;width=width||parseNum(dim[1])*factor;depth=depth||parseNum(dim[2])*factor;height=height||(dim[3]?parseNum(dim[3])*factor:0);}}
    const color=product.color||''; return {name:String(name).replace(/\s*[|–-].*$/,'').trim(),manufacturer,sku,width,depth,height,price,color,evidence:`Zdroj ${new URL(sourceUrl).hostname}; nalezené hodnoty: ${[width&&`šířka ${width} mm`,depth&&`hloubka ${depth} mm`,height&&`výška ${height} mm`,price&&`cena ${price} Kč`].filter(Boolean).join(', ')||'jen název produktu'}.`};
  }

  async function addFieldMeasurement() {
    const label = document.getElementById('fieldMeasureLabel')?.value.trim();
    const value = document.getElementById('fieldMeasureValue')?.value.trim();
    if (!label || !value) return toast('Doplň název i hodnotu rozměru.', 'error');
    const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    session.measurements.push({ id: uid('measure'), label, value: value.replace(',', '.'), unit: document.getElementById('fieldMeasureUnit').value, category: document.getElementById('fieldMeasureCategory').value, targetId: document.getElementById('fieldMeasureTarget')?.value || '', verified: false, source: 'estimate', confidence: 40, note: '', createdAt: new Date().toISOString() });
    session.updatedAt = new Date().toISOString(); await saveProject(project); toast('Rozměr byl uložen.'); render();
  }

  async function updateFieldPhoto(id, key, value) {
    const project = currentProject(); const photo = currentFieldSession(currentVariant(project)).photos.find((item) => item.id === id); if (!photo) return; photo[key] = value; await saveProject(project);
  }

  async function importFieldPhotos() {
    const files = Array.from(fieldPhotoInput.files || []); fieldPhotoInput.value = ''; if (!files.length) return;
    const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    for (const file of files.slice(0, 12)) {
      try { const dataUrl = await resizeImage(file, 1800, 1400, 0.82); session.photos.push({ id: uid('fieldphoto'), name: file.name.replace(/\.[^.]+$/, ''), note: '', dataUrl, capturedAt: new Date().toISOString(), source: file.type || 'image' }); } catch (error) { console.warn(error); }
    }
    session.updatedAt = new Date().toISOString(); await saveProject(project); toast(`${Math.min(files.length, 12)} fotografií bylo uloženo do zaměření.`); render();
  }

  async function saveFieldLocation() {
    if (!navigator.geolocation) return toast('Zařízení neposkytuje geolokaci.', 'error');
    navigator.geolocation.getCurrentPosition(async (position) => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, capturedAt: new Date().toISOString() }; await saveProject(project); toast('Poloha byla uložena pouze do projektu.'); render(); }, (error) => toast(error.message || 'Poloha nebyla povolena.', 'error'), { enableHighAccuracy: true, timeout: 12000 });
  }

  function parseRoomPlanJson(value) {
    const root = value?.capturedRoom || value?.room || value;
    const walls = Array.isArray(root?.walls) ? root.walls : [];
    const doors = Array.isArray(root?.doors) ? root.doors : [];
    const windows = Array.isArray(root?.windows) ? root.windows : [];
    const objects = Array.isArray(root?.objects) ? root.objects : [];
    const parsedWalls = [];
    const dimension = (item, index, fallback = 0) => { const d = item?.dimensions || item?.dimension || []; const v = Array.isArray(d) ? Number(d[index]) : Number(d?.[index === 0 ? 'x' : index === 1 ? 'y' : 'z']); return Number.isFinite(v) ? v : fallback; };
    const transform = (item) => { const raw = item?.transform; if (Array.isArray(raw) && raw.length === 16) return { x: Number(raw[12]) || 0, z: Number(raw[14]) || 0, yaw: Math.atan2(Number(raw[8]) || 0, Number(raw[0]) || 1) }; if (Array.isArray(raw) && Array.isArray(raw[0])) return { x: Number(raw[3]?.[0] ?? raw[0]?.[3]) || 0, z: Number(raw[3]?.[2] ?? raw[2]?.[3]) || 0, yaw: Math.atan2(Number(raw[2]?.[0]) || 0, Number(raw[0]?.[0]) || 1) }; const center = item?.center || item?.position || {}; return { x: Number(center.x ?? center[0]) || 0, z: Number(center.z ?? center[2]) || 0, yaw: Number(item?.yaw) || 0 }; };
    walls.forEach((item, index) => { const width = dimension(item, 0, 1); const height = dimension(item, 1, 2.5); const t = transform(item); const dx = Math.cos(t.yaw) * width / 2; const dz = Math.sin(t.yaw) * width / 2; parsedWalls.push({ id: item.identifier || `wall-${index}`, x1: t.x - dx, y1: t.z - dz, x2: t.x + dx, y2: t.z + dz, width, height }); });
    return { walls: parsedWalls, counts: { walls: walls.length, doors: doors.length, windows: windows.length, objects: objects.length } };
  }

  async function importScanFile() {
    const file = scanInput.files?.[0]; scanInput.value = ''; if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase(); const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    const scan = { id: uid('scan'), name: file.name, format: ext || 'soubor', size: file.size, importedAt: new Date().toISOString(), summary: 'Externí prostorový podklad; původní soubor zůstává mimo zálohu DOMUS.', roomPlan: null };
    if (ext === 'json' && file.size < 20 * 1024 * 1024) {
      try { const data = JSON.parse(await file.text()); scan.roomPlan = parseRoomPlanJson(data); const c = scan.roomPlan.counts; scan.summary = `Datový sken: ${c.walls} stěn, ${c.doors} dveří, ${c.windows} oken a ${c.objects} objektů. Geometrii je nutné ověřit.`; } catch (error) { scan.summary = `JSON se nepodařilo rozpoznat jako RoomPlan: ${error.message}`; }
    }
    session.scans.push(scan); session.updatedAt = new Date().toISOString(); await saveProject(project); toast('Prostorový sken byl zaevidován.'); render();
  }

  async function applyRoomPlanScan(id) {
    const project = currentProject(); const variant = currentVariant(project); const scan = currentFieldSession(variant).scans.find((item) => item.id === id); const walls = scan?.roomPlan?.walls || [];
    if (!walls.length) return toast('Sken neobsahuje převoditelné stěny.', 'error');
    if (variant.plan.walls.length && !confirm('Nahradit současné stěny pracovním obrysem z RoomPlan?')) return;
    pushPlanHistory(project, variant);
    const xs = walls.flatMap((item) => [item.x1, item.x2]); const ys = walls.flatMap((item) => [item.y1, item.y2]); const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys); const width = Math.max(0.1, maxX - minX), depth = Math.max(0.1, maxY - minY); const scale = variant.plan.scale;
    const uniformScale = Math.min(scale, 760 / width, 500 / depth);
    const offsetX = 140 + (760 - width * uniformScale) / 2;
    const offsetY = 100 + (500 - depth * uniformScale) / 2;
    variant.plan.walls = walls.map((item) => ({ id: uid('wall'), x1: offsetX + (item.x1 - minX) * uniformScale, y1: offsetY + (item.y1 - minY) * uniformScale, x2: offsetX + (item.x2 - minX) * uniformScale, y2: offsetY + (item.y2 - minY) * uniformScale, layer: 'architecture', source: 'roomplan-unverified' }));
    variant.plan.scale = uniformScale;
    variant.plan.wallHeight = round(Math.max(...walls.map((item) => item.height || 2.5)), 2); fitPlanToCanvas(variant.plan); await saveProject(project); state.currentTab = 'plan'; toast('Pracovní stěny byly převedeny do 2D. Všechny rozměry ověř.'); render();
  }

  function syncAuthHeaders() {
    return state.syncStatus.token ? { Authorization: `Bearer ${state.syncStatus.token}` } : {};
  }

  function clearSyncToken() {
    state.syncStatus.token = '';
    state.syncStatus.tokenExpiresAt = '';
    state.syncStatus.paired = false;
    safeStorageRemove('domusSyncToken');
    safeStorageRemove('domusSyncTokenExpiresAt');
  }

  async function checkSyncStatus(showToast = false) {
    const before = JSON.stringify({ enabled: state.syncStatus.enabled, paired: state.syncStatus.paired, localClient: state.syncStatus.localClient, serverUrl: state.syncStatus.serverUrl, message: state.syncStatus.message });
    try {
      const response = await fetch('/api/sync/status', { cache: 'no-store', headers: syncAuthHeaders() });
      const payload = await response.json();
      state.syncStatus = {
        ...state.syncStatus,
        checked: true,
        enabled: !!payload.enabled,
        localClient: !!payload.localClient,
        paired: !!payload.paired || !!payload.localClient,
        pairingCode: payload.pairingCode || '',
        pairingExpiresAt: payload.pairingExpiresAt || '',
        serverUrl: payload.serverUrl || '',
        deviceName: payload.deviceName || '',
        message: payload.message || '',
      };
      if (payload.localClient && payload.enabled) {
        try { const devicesResponse = await fetch('/api/sync/devices', { cache: 'no-store' }); const devicesPayload = await devicesResponse.json(); state.syncStatus.devices = devicesPayload.devices || []; }
        catch { state.syncStatus.devices = []; }
      }
      if (!state.syncStatus.localClient && state.syncStatus.tokenExpiresAt && new Date(state.syncStatus.tokenExpiresAt) <= new Date()) clearSyncToken();
      if (showToast) toast(payload.enabled ? (state.syncStatus.paired ? 'Synchronizace je připravena.' : 'Server je dostupný; zařízení ještě spárujte.') : payload.message || 'Synchronizace není aktivní.', payload.enabled ? '' : 'error');
    } catch (error) {
      state.syncStatus = { ...state.syncStatus, checked: true, enabled: false, paired: false, message: 'Aplikace běží bez synchronizačního serveru.' };
      if (showToast) toast(state.syncStatus.message, 'error');
    }
    const after = JSON.stringify({ enabled: state.syncStatus.enabled, paired: state.syncStatus.paired, localClient: state.syncStatus.localClient, serverUrl: state.syncStatus.serverUrl, message: state.syncStatus.message });
    if (state.currentTab === 'field' && before !== after) render();
    return state.syncStatus;
  }

  async function pairSyncDevice(rawCode) {
    const code = String(rawCode || '').replace(/\D/g, '').slice(0, 6);
    if (!/^\d{6}$/.test(code)) return toast('Zadejte přesně šestimístný jednorázový kód.', 'error');
    try {
      const response = await fetch('/api/sync/pair', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, deviceName: `${navigator.platform || 'Zařízení'} · ${navigator.userAgentData?.platform || 'prohlížeč'}`.slice(0, 80) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok || !payload.token) throw new Error(payload.error || 'Spárování se nezdařilo.');
      state.syncStatus.token = payload.token;
      state.syncStatus.tokenExpiresAt = payload.expiresAt || '';
      state.syncStatus.paired = true;
      safeStorageSet('domusSyncToken', payload.token);
      safeStorageSet('domusSyncTokenExpiresAt', payload.expiresAt || '');
      toast('Zařízení bylo bezpečně spárováno.');
      await checkSyncStatus(false);
      render();
    } catch (error) { toast(error.message || 'Spárování se nezdařilo.', 'error'); }
  }

  async function syncFetch(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { ...syncAuthHeaders(), ...(options.headers || {}) } });
    let payload = {};
    try { payload = await response.json(); } catch { }
    if (response.status === 401) clearSyncToken();
    if (!response.ok || payload.ok === false) throw new Error(payload.error || 'Synchronizační požadavek selhal.');
    return payload;
  }

  async function pushCurrentProjectToSync(silent = false) {
    if (state.syncBusy) return;
    state.syncBusy = true;
    try {
      if (!state.syncStatus.checked) await checkSyncStatus(false);
      if (!state.syncStatus.enabled || (!state.syncStatus.localClient && !state.syncStatus.paired)) throw new Error('Zařízení není spárováno se synchronizačním serverem.');
      const project = DomusCore.secureProject(currentProject());
      await syncFetch('/api/sync/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project }) });
      currentVariant(project).field.sync.lastPushAt = new Date().toISOString();
      await saveProject(project, true, true);
      if (!silent) toast('Projekt byl odeslán do lokální synchronizace.');
    } catch (error) { if (!silent) toast(error.message, 'error'); }
    finally { state.syncBusy = false; if (state.currentTab === 'field' && !silent) render(); }
  }

  async function pullSyncProject(projectId) {
    const payload = await syncFetch('/api/sync/pull', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId }) });
    return ensureProjectV6(DomusCore.secureProject(payload.project));
  }

  async function pullCurrentProjectFromSync() {
    try {
      if (!state.syncStatus.checked) await checkSyncStatus(false);
      const local = currentProject();
      const remote = await pullSyncProject(local.id);
      if (new Date(remote.updatedAt) <= new Date(local.updatedAt) && !confirm('Lokální projekt není starší. Přesto jej nahradit verzí ze synchronizace?')) return;
      await DomusDB.createSnapshot(state.projects, `Před načtením projektu ${local.name} ze synchronizace`);
      const index = state.projects.findIndex((item) => item.id === remote.id);
      if (index >= 0) state.projects[index] = remote; else state.projects.unshift(remote);
      remote.variants.forEach((variant) => { variant.field.sync.lastPullAt = new Date().toISOString(); });
      await DomusDB.put(remote, { skipSnapshot: true });
      state.currentProjectId = remote.id;
      toast('Projekt byl načten ze synchronizace.'); render();
    } catch (error) { toast(error.message, 'error'); }
  }

  async function importProjectsFromSync() {
    try {
      await checkSyncStatus(false);
      if (!state.syncStatus.enabled || (!state.syncStatus.localClient && !state.syncStatus.paired)) throw new Error('Zařízení není spárováno se synchronizačním serverem.');
      const payload = await syncFetch('/api/sync/list', { cache: 'no-store' });
      if (!payload.projects?.length) return toast('Synchronizační úložiště je prázdné.', 'error');
      await DomusDB.createSnapshot(state.projects, 'Před hromadným načtením ze synchronizace');
      let imported = 0;
      for (const meta of payload.projects) {
        const project = await pullSyncProject(meta.id);
        const index = state.projects.findIndex((item) => item.id === project.id);
        if (index >= 0) {
          if (new Date(project.updatedAt) > new Date(state.projects[index].updatedAt)) { state.projects[index] = project; await DomusDB.put(project, { skipSnapshot: true }); imported += 1; }
        } else { state.projects.unshift(project); await DomusDB.put(project, { skipSnapshot: true }); imported += 1; }
      }
      toast(imported ? `Načteno nebo aktualizováno ${imported} projektů.` : 'Všechny místní projekty jsou aktuální.'); render();
    } catch (error) { toast(error.message, 'error'); }
  }

/* Conflict-aware local-first synchronization. */
  async function mergeRemoteProject(local, remote, sourceLabel = 'synchronizace') {
    const result = DomusPremium.mergeProjects(local, remote);
    if (result.conflicts.length) {
      const approved = confirm(`Bylo nalezeno ${result.conflicts.length} souběžných změn. DOMUS je bezpečně sloučí po jednotlivých položkách a u každého konfliktu ponechá novější verzi. Pokračovat?`);
      if (!approved) return null;
    }
    const merged = ensureProjectV6(result.project);
    merged.syncMerge = { ...(merged.syncMerge||{}), source: sourceLabel, at: new Date().toISOString(), conflictCount: result.conflicts.length };
    return { project: merged, conflicts: result.conflicts };
  }

  async function pullCurrentProjectFromSync() {
    try {
      if (!state.syncStatus.checked) await checkSyncStatus(false);
      const local = currentProject(); const remote = await pullSyncProject(local.id);
      const result = await mergeRemoteProject(local, remote, 'ruční stažení'); if (!result) return;
      await DomusDB.createSnapshot(state.projects, `Před sloučením projektu ${local.name} ze synchronizace`);
      const index = state.projects.findIndex((item)=>item.id===result.project.id);
      if(index>=0) state.projects[index]=result.project; else state.projects.unshift(result.project);
      result.project.variants.forEach((variant)=>{variant.field.sync.lastPullAt=new Date().toISOString();});
      await DomusDB.put(result.project,{skipSnapshot:true}); state.currentProjectId=result.project.id;
      toast(result.conflicts.length?`Projekt sloučen. Vyřešeno ${result.conflicts.length} konfliktů.`:'Projekt byl bezpečně synchronizován.'); render();
    } catch(error){toast(error.message,'error');}
  }

  async function importProjectsFromSync() {
    try {
      await checkSyncStatus(false);
      if (!state.syncStatus.enabled || (!state.syncStatus.localClient && !state.syncStatus.paired)) throw new Error('Zařízení není spárováno se synchronizačním serverem.');
      const payload=await syncFetch('/api/sync/list',{cache:'no-store'}); if(!payload.projects?.length)return toast('Synchronizační úložiště je prázdné.','error');
      await DomusDB.createSnapshot(state.projects,'Před hromadným sloučením ze synchronizace'); let imported=0,conflicts=0;
      for(const meta of payload.projects){const remote=await pullSyncProject(meta.id),index=state.projects.findIndex(item=>item.id===remote.id);if(index<0){state.projects.unshift(remote);await DomusDB.put(remote,{skipSnapshot:true});imported++;continue;}const result=await mergeRemoteProject(state.projects[index],remote,'hromadná synchronizace');if(!result)continue;state.projects[index]=result.project;await DomusDB.put(result.project,{skipSnapshot:true});imported++;conflicts+=result.conflicts.length;}
      toast(`Synchronizováno ${imported} projektů${conflicts?` · vyřešeno ${conflicts} konfliktů`:''}.`);render();
    } catch(error){toast(error.message,'error');}
  }

/* Image handling, photo annotations and 2D plan canvas. Source fragment; assembled by scripts/build.mjs. */
  async function importPhoto() {
    const file = photoInput.files?.[0];
    photoInput.value = '';
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 1800, 1300, 0.86);
      const project = currentProject();
      const photo = currentVariant(project).photo;
      photo.dataUrl = dataUrl;
      photo.annotations = [];
      photo.calibration = null;
      await saveProject(project);
      toast('Fotografie byla vložena do projektu.');
      render();
    } catch (error) {
      console.error(error);
      toast('Fotografii se nepodařilo načíst.', 'error');
    }
  }

  async function importComparisonImage(event, kind) {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 1800, 1300, 0.88);
      const project = currentProject();
      const comparison = currentVariant(project).comparison;
      if (kind === 'before') comparison.beforeDataUrl = dataUrl;
      else comparison.afterDataUrl = dataUrl;
      await saveProject(project);
      toast(kind === 'before' ? 'Fotografie „před“ byla vložena.' : 'Vizualizace „po“ byla vložena.');
      render();
    } catch (error) {
      console.error(error);
      toast('Obrázek se nepodařilo načíst.', 'error');
    }
  }

  function resizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function setupPhotoCanvas() {
    const canvas = document.getElementById('photoCanvas');
    const project = currentProject();
    const variant = currentVariant(project);
    if (!canvas || !variant?.photo?.dataUrl) return;
    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      const draw = (preview = null) => drawPhotoCanvas(canvas, image, variant.photo, preview);
      draw();
      let start = null;
      canvas.style.cursor = state.photoTool === 'note' ? 'text' : 'crosshair';

      canvas.onpointerdown = async (event) => {
        const point = pointerPoint(canvas, event);
        if (state.photoTool === 'note') {
          const text = await askValue({ title: 'Poznámka do fotografie', label: 'Text poznámky', required: true });
          if (!text) return;
          variant.photo.annotations.push({ id: uid('annotation'), type: 'note', x: point.x, y: point.y, text });
          saveProject(project);
          draw();
          return;
        }
        start = point;
        canvas.setPointerCapture(event.pointerId);
      };

      canvas.onpointermove = (event) => {
        if (!start) return;
        const point = pointerPoint(canvas, event);
        draw({ x1: start.x, y1: start.y, x2: point.x, y2: point.y, type: state.photoTool });
      };

      canvas.onpointerup = async (event) => {
        if (!start) return;
        const end = pointerPoint(canvas, event);
        const distance = Math.hypot(end.x - start.x, end.y - start.y);
        if (distance < 8) {
          start = null;
          draw();
          return;
        }
        if (state.photoTool === 'calibrate') {
          const mm = Number(await askValue({ title: 'Kalibrace fotografie', label: 'Skutečná vzdálenost v milimetrech', value: '1000', type: 'number', min: 1, required: true }));
          if (mm > 0) {
            variant.photo.calibration = { pixels: distance, mm };
            variant.photo.annotations.push({ id: uid('annotation'), type: 'calibration', x1: start.x, y1: start.y, x2: end.x, y2: end.y, label: `${Math.round(mm)} mm · kalibrační rozměr` });
            toast('Měřítko fotografie bylo nastaveno.');
          }
        } else {
          let computed = null;
          if (variant.photo.calibration) {
            computed = distance * (variant.photo.calibration.mm / variant.photo.calibration.pixels);
          }
          const defaultLabel = computed ? `${Math.round(computed)} mm` : '';
          const label = await askValue({ title: 'Kóta ve fotografii', label: 'Popisek nebo ověřená hodnota', value: defaultLabel, help: computed ? 'Hodnota byla odvozena z kalibrace. Před realizací ji ověřte.' : 'Bez kalibrace zadejte hodnotu ručně.' });
          if (label !== null) {
            variant.photo.annotations.push({ id: uid('annotation'), type: 'measure', x1: start.x, y1: start.y, x2: end.x, y2: end.y, label: label || 'Rozměr neuveden', derived: Boolean(computed) });
          }
        }
        start = null;
        await saveProject(project);
        draw();
        if (state.photoTool === 'calibrate') render();
      };
    };
    image.src = variant.photo.dataUrl;
  }

  function drawPhotoCanvas(canvas, image, photo, preview = null) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
    overlay.addColorStop(0, 'rgba(6,12,17,.02)');
    overlay.addColorStop(1, 'rgba(6,12,17,.12)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    photo.annotations.forEach((annotation) => drawPhotoAnnotation(ctx, annotation));
    if (preview) drawPhotoAnnotation(ctx, { ...preview, label: preview.type === 'calibrate' ? 'Kalibrační rozměr' : 'Nová kóta' }, true);
  }

  function drawPhotoAnnotation(ctx, item, preview = false) {
    ctx.save();
    ctx.lineWidth = Math.max(2, ctx.canvas.width / 650);
    ctx.font = `700 ${Math.max(15, ctx.canvas.width / 70)}px system-ui`;
    ctx.textBaseline = 'middle';
    if (item.type === 'note') {
      const padding = 10;
      const metrics = ctx.measureText(item.text);
      const width = metrics.width + padding * 2;
      ctx.fillStyle = 'rgba(9,17,22,.86)';
      roundRect(ctx, item.x, item.y - 19, width, 38, 8);
      ctx.fill();
      ctx.fillStyle = '#f3d09b';
      ctx.fillText(item.text, item.x + padding, item.y);
      ctx.restore();
      return;
    }
    const color = item.type === 'calibration' ? '#6fd1a5' : (preview ? '#f1ce95' : '#f5bd6b');
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.setLineDash(item.derived ? [12, 7] : []);
    ctx.beginPath();
    ctx.moveTo(item.x1, item.y1);
    ctx.lineTo(item.x2, item.y2);
    ctx.stroke();
    drawArrowHead(ctx, item.x2, item.y2, item.x1, item.y1, color);
    drawArrowHead(ctx, item.x1, item.y1, item.x2, item.y2, color);
    const midX = (item.x1 + item.x2) / 2;
    const midY = (item.y1 + item.y2) / 2;
    const label = item.label || '';
    const metrics = ctx.measureText(label);
    const boxWidth = metrics.width + 22;
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8,15,20,.88)';
    roundRect(ctx, midX - boxWidth / 2, midY - 18, boxWidth, 36, 8);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(label, midX - metrics.width / 2, midY);
    ctx.restore();
  }

  function drawArrowHead(ctx, x, y, fromX, fromY, color) {
    const angle = Math.atan2(y - fromY, x - fromX);
    const size = Math.max(11, ctx.canvas.width / 90);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - Math.PI / 7), y - size * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(x - size * Math.cos(angle + Math.PI / 7), y - size * Math.sin(angle + Math.PI / 7));
    ctx.closePath();
    ctx.fill();
  }

  function pointerPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function selectedElementDefinition() {
    return ELEMENT_LIBRARY.find((item) => item.key === state.planElementKey) || ELEMENT_LIBRARY.find((item) => item.layer === state.activeLayer) || ELEMENT_LIBRARY[0];
  }

  function setupPlanCanvas() {
    const canvas = document.getElementById('planCanvas');
    const project = currentProject(); const variant = currentVariant(project);
    if (!canvas || !variant) return;
    const plan = variant.plan;
    let start = null; let current = null;
    const draw = () => drawPlanCanvas(canvas, variant, start && current ? { start, end: current, tool: state.planTool, definition: selectedElementDefinition() } : null);
    draw();
    canvas.style.cursor = state.planTool === 'delete' ? 'not-allowed' : state.planTool === 'select' ? 'pointer' : 'crosshair';

    canvas.onpointerdown = async (event) => {
      const raw = pointerPoint(canvas, event); const point = { x: snap(raw.x, 10), y: snap(raw.y, 10) };
      if (state.planTool === 'delete') {
        const target = findPlanTarget(plan, point, variant);
        if (target) pushPlanHistory(project, variant);
        if (target?.kind === 'wall') plan.walls = plan.walls.filter((wall) => wall.id !== target.id);
        if (target?.kind === 'object') plan.objects = plan.objects.filter((object) => object.id !== target.id);
        if (target) { await saveProject(project); draw(); toast('Prvek byl odstraněn.'); }
        return;
      }
      if (state.planTool === 'select') {
        const target = findPlanTarget(plan, point, variant);
        if (target?.kind === 'object') openObjectDialog(plan.objects.find((object) => object.id === target.id));
        if (target?.kind === 'wall') {
          const wall = plan.walls.find((item) => item.id === target.id); const pixels = Math.hypot(wall.x2-wall.x1, wall.y2-wall.y1); const currentLength = pixels / plan.scale;
          const entered = await askValue({ title: 'Délka stěny', label: 'Přesná délka v metrech', value: currentLength.toFixed(2), type: 'number', min: 0.01, required: true });
          const exact = parseNum(entered, currentLength);
          if (entered !== null && exact > 0) { pushPlanHistory(project, variant); const ux=(wall.x2-wall.x1)/pixels; const uy=(wall.y2-wall.y1)/pixels; wall.x2=wall.x1+ux*exact*plan.scale; wall.y2=wall.y1+uy*exact*plan.scale; await saveProject(project); draw(); }
        }
        return;
      }
      start = point; current = point; canvas.setPointerCapture(event.pointerId);
    };

    canvas.onpointermove = (event) => {
      if (!start) return;
      const raw = pointerPoint(canvas, event); current = { x: snap(raw.x, 10), y: snap(raw.y, 10) };
      if (state.planTool === 'wall' && event.shiftKey) { if (Math.abs(current.x - start.x) > Math.abs(current.y - start.y)) current.y = start.y; else current.x = start.x; }
      draw();
    };

    canvas.onpointerup = async () => {
      if (!start || !current) return;
      const width = Math.abs(current.x - start.x); const depth = Math.abs(current.y - start.y);
      if (state.planTool === 'wall') {
        const drawnPixels = Math.hypot(current.x - start.x, current.y - start.y);
        if (drawnPixels > 12) {
          pushPlanHistory(project, variant);
          const drawnMeters = drawnPixels / plan.scale; const entered = await askValue({ title: 'Nová stěna', label: 'Přesná délka v metrech', value: drawnMeters.toFixed(2), type: 'number', min: 0.01, required: true });
          let end = current; const exactMeters = entered === null ? drawnMeters : parseNum(entered, drawnMeters);
          if (exactMeters > 0) { const ux=(current.x-start.x)/drawnPixels; const uy=(current.y-start.y)/drawnPixels; end={x:start.x+ux*exactMeters*plan.scale,y:start.y+uy*exactMeters*plan.scale}; }
          plan.walls.push({ id: uid('wall'), x1: start.x, y1: start.y, x2: end.x, y2: end.y });
        }
      } else if (state.planTool === 'object') {
        pushPlanHistory(project, variant);
        const definition = selectedElementDefinition();
        let exactWidth = definition.width / 1000 * plan.scale; let exactDepth = definition.depth / 1000 * plan.scale;
        let x = start.x - exactWidth / 2; let y = start.y - exactDepth / 2;
        if (width > 15 || depth > 15) {
          const defaultValue = `${Math.round(Math.max(width, 10) / plan.scale * 1000)} × ${Math.round(Math.max(depth, 10) / plan.scale * 1000)}`;
          const entered = await askValue({ title: 'Rozměry prvku', label: 'Šířka × hloubka v mm', value: defaultValue, required: true, help: 'Použijte například 900 × 150.' });
          const parts = String(entered || defaultValue).split(/[x×;,]/i).map((part) => parseNum(part)).filter((value) => value > 0);
          exactWidth = (parts[0] || definition.width) / 1000 * plan.scale; exactDepth = (parts[1] || definition.depth) / 1000 * plan.scale;
          x = Math.min(start.x, current.x); y = Math.min(start.y, current.y);
        }
        plan.objects.push({ id: uid('object'), type: definition.name, libraryKey: definition.key, layer: definition.layer, shape: definition.shape, x, y, width: exactWidth, depth: exactDepth, height: definition.height, color: definition.color, note: '', materialId: '', hingeSide: definition.key === 'door' ? 'left' : '', opensTo: definition.key === 'door' ? 'inside' : '' });
      }
      start = null; current = null; await saveProject(project); draw();
    };
  }

  function drawPlanCanvas(canvas, variantOrPlan, preview = null) {
    const variant = variantOrPlan?.plan ? variantOrPlan : { plan: variantOrPlan, section: null, materials: [] };
    const plan = variant.plan;
    const ctx = canvas.getContext('2d'); const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = '#111b22'; ctx.fillRect(0, 0, width, height); drawGrid(ctx, plan.scale);

    if (plan.layerVisibility?.architecture !== false) plan.walls.forEach((wall, index) => drawWall2D(ctx, wall, plan, index + 1));
    plan.objects.filter((object) => plan.layerVisibility?.[object.layer] !== false).forEach((object) => drawObject2D(ctx, object, plan, variant));
    if (variant.section) drawSectionLineOnPlan(ctx, variant);

    if (preview) {
      ctx.save(); ctx.globalAlpha = 0.75;
      if (preview.tool === 'wall') drawWall2D(ctx, { id: 'preview', x1: preview.start.x, y1: preview.start.y, x2: preview.end.x, y2: preview.end.y }, plan, null, true);
      if (preview.tool === 'object') {
        const def = preview.definition; const draggedWidth = Math.abs(preview.end.x - preview.start.x); const draggedDepth = Math.abs(preview.end.y - preview.start.y);
        const w = draggedWidth > 15 ? draggedWidth : def.width / 1000 * plan.scale; const d = draggedDepth > 15 ? draggedDepth : def.depth / 1000 * plan.scale;
        drawObject2D(ctx, { type:def.name, layer:def.layer, shape:def.shape, x:draggedWidth>15?Math.min(preview.start.x,preview.end.x):preview.start.x-w/2, y:draggedDepth>15?Math.min(preview.start.y,preview.end.y):preview.start.y-d/2, width:w, depth:d, color:def.color, height:def.height }, plan, variant, true);
      }
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '12px system-ui';
    ctx.fillText(`Měřítko: ${plan.scale} px = 1 m · Shift drží směr · aktivní vrstva: ${LAYERS[state.activeLayer]?.label || ''}`, 18, height - 18);
  }

  function drawGrid(ctx, scale) {
    const small = scale / 5;
    for (let x = 0; x <= ctx.canvas.width; x += small) { ctx.strokeStyle = x % scale === 0 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.03)'; ctx.lineWidth = x % scale === 0 ? 1.2 : 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke(); }
    for (let y = 0; y <= ctx.canvas.height; y += small) { ctx.strokeStyle = y % scale === 0 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.03)'; ctx.lineWidth = y % scale === 0 ? 1.2 : 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke(); }
  }

  function drawWall2D(ctx, wall, plan, index, preview = false) {
    const thickness = Math.max(8, plan.wallThickness * plan.scale);
    ctx.save(); ctx.strokeStyle = preview ? '#e9c38c' : LAYERS.architecture.color; ctx.lineWidth = thickness; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();
    const lengthM = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) / plan.scale; const midX = (wall.x1 + wall.x2) / 2; const midY = (wall.y1 + wall.y2) / 2; const label = `${lengthM.toFixed(2)} m${index ? ` · S${index}` : ''}`;
    if(plan.showDimensions!==false){ctx.font = '700 12px system-ui'; const metrics = ctx.measureText(label); ctx.fillStyle = 'rgba(7,13,18,.9)'; roundRect(ctx, midX - metrics.width / 2 - 7, midY - 25, metrics.width + 14, 21, 6); ctx.fill(); ctx.fillStyle = preview ? '#f1ce95' : '#f4dfbf'; ctx.fillText(label, midX - metrics.width / 2, midY - 14);} ctx.restore();
  }

  function drawObject2D(ctx, object, plan, variant = currentVariant(), preview = false) {
    const linked = variant?.materials?.find((item) => item.id === object.materialId);
    const color = linked?.swatch || object.color || LAYERS[object.layer]?.color || '#71838f';
    ctx.save(); const objectCx=object.x+object.width/2,objectCy=object.y+object.depth/2; if(object.rotation){ctx.translate(objectCx,objectCy);ctx.rotate((Number(object.rotation)||0)*Math.PI/180);ctx.translate(-objectCx,-objectCy);} ctx.globalAlpha = preview ? .55 : .86; ctx.fillStyle = color; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5;
    const shape = object.shape || 'box';
    if (shape === 'circle' || shape === 'oval') { ctx.beginPath(); ctx.ellipse(object.x + object.width/2, object.y + object.depth/2, Math.max(4,object.width/2), Math.max(4,object.depth/2), 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
    else { roundRect(ctx, object.x, object.y, Math.max(4,object.width), Math.max(4,object.depth), shape === 'line' ? Math.min(8,object.depth/2) : 4); ctx.fill(); ctx.stroke(); }
    if (shape === 'door') { ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.beginPath(); ctx.arc(object.x, object.y + object.depth, Math.max(object.width, object.depth), -Math.PI/2, 0); ctx.stroke(); }
    if (shape === 'area') { ctx.strokeStyle='rgba(255,255,255,.25)'; for(let x=object.x;x<object.x+object.width;x+=12){ctx.beginPath();ctx.moveTo(x,object.y);ctx.lineTo(x+object.depth,object.y+object.depth);ctx.stroke();} }
    ctx.globalAlpha = 1; const labelY = object.y + Math.min(16, Math.max(12, object.depth/2)); ctx.fillStyle = '#eef4f6'; ctx.font = '700 10px system-ui'; ctx.fillText(object.type, object.x + 6, labelY);
    if (plan.showDimensions!==false && object.width > 45 && object.depth > 24) { ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(238,244,246,.78)'; ctx.fillText(`${(object.width/plan.scale).toFixed(2)} × ${(object.depth/plan.scale).toFixed(2)} m`, object.x + 6, labelY + 13); }
    const layer = LAYERS[object.layer]; if (layer) { ctx.fillStyle = layer.color; ctx.font = '800 9px system-ui'; ctx.fillText(layer.short, object.x + Math.max(4,object.width) - ctx.measureText(layer.short).width - 4, object.y + Math.min(12, Math.max(10,object.depth-3))); }
    ctx.restore();
  }

  function drawSectionLineOnPlan(ctx, variant) {
    const points = [];
    variant.plan.walls.forEach((wall) => points.push([wall.x1,wall.y1],[wall.x2,wall.y2]));
    if (!points.length) return;
    const bounds = computeBounds(points); const ratio = clamp(parseNum(variant.section.position,50)/100,0,1); const vertical = variant.section.orientation === 'x';
    const value = vertical ? bounds.minX + bounds.width * ratio : bounds.minY + bounds.height * ratio;
    ctx.save(); ctx.strokeStyle='#ef8e7a'; ctx.lineWidth=2; ctx.setLineDash([10,7]); ctx.beginPath(); if(vertical){ctx.moveTo(value,bounds.minY-50);ctx.lineTo(value,bounds.maxY+50);}else{ctx.moveTo(bounds.minX-50,value);ctx.lineTo(bounds.maxX+50,value);} ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#ef8e7a'; ctx.font='800 12px system-ui'; if(vertical){ctx.fillText('A',value-4,bounds.minY-58);ctx.fillText('A',value-4,bounds.maxY+70);}else{ctx.fillText('A',bounds.minX-68,value+4);ctx.fillText('A',bounds.maxX+58,value+4);} ctx.restore();
  }

  function findPlanTarget(plan, point, variant = currentVariant()) {
    const object = [...plan.objects].reverse().find((item) => plan.layerVisibility?.[item.layer] !== false && point.x >= item.x && point.x <= item.x + item.width && point.y >= item.y && point.y <= item.y + item.depth);
    if (object) return { kind: 'object', id: object.id };
    if (plan.layerVisibility?.architecture === false) return null;
    let closest = null;
    plan.walls.forEach((wall) => { const distance = pointToSegmentDistance(point.x, point.y, wall.x1, wall.y1, wall.x2, wall.y2); if (distance < 18 && (!closest || distance < closest.distance)) closest = { kind: 'wall', id: wall.id, distance }; });
    return closest;
  }

  function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1; const dy = y2 - y1;
    if (!dx && !dy) return Math.hypot(px - x1, py - y1);
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function objectColor(type) {
    return ELEMENT_LIBRARY.find((item) => item.name === type)?.color || LAYERS[inferLayer(type)]?.color || '#71838f';
  }

/* Precision 2D interaction engine: snapping, multi-selection, redo and premium canvas overlays. */
  function pushPlanHistory(project, variant = currentVariant(project)) {
    state.planHistory.push({ projectId: project.id, variantId: variant.id, plan: deepClone(variant.plan) });
    if (state.planHistory.length > 80) state.planHistory.shift();
    state.redoPlanHistory = [];
  }
  async function undoPlanChange(){const p=currentProject(),v=currentVariant(p),entry=state.planHistory.pop();if(!entry)return;state.redoPlanHistory.push({projectId:p.id,variantId:v.id,plan:deepClone(v.plan)});v.plan=entry.plan;state.selectedPlanIds=new Set();await saveProject(p);render();}
  async function redoPlanChange(){const p=currentProject(),v=currentVariant(p),entry=state.redoPlanHistory.pop();if(!entry)return;state.planHistory.push({projectId:p.id,variantId:v.id,plan:deepClone(v.plan)});v.plan=entry.plan;state.selectedPlanIds=new Set();await saveProject(p);render();}
  function selectedElementDefinition(){return allElementLibrary().find((item)=>item.key===state.planElementKey)||allElementLibrary().find((item)=>item.layer===state.activeLayer)||allElementLibrary()[0];}
  function snapPlanPoint(point,plan,anchor=null){let p={...point};const snap=state.planSnap||{};if(snap.grid){const step=Math.max(1,(Number(snap.gridMm)||100)/1000*plan.scale);p.x=Math.round(p.x/step)*step;p.y=Math.round(p.y/step)*step;}if(snap.endpoints){const candidates=plan.walls.flatMap(w=>[{x:w.x1,y:w.y1},{x:w.x2,y:w.y2}]);let best=null,d=14;for(const c of candidates){const dist=Math.hypot(c.x-p.x,c.y-p.y);if(dist<d){best=c;d=dist;}}if(best)p={...best};}if(anchor&&snap.orthogonal){const dx=Math.abs(p.x-anchor.x),dy=Math.abs(p.y-anchor.y);if(dx<dy*.35)p.x=anchor.x;else if(dy<dx*.35)p.y=anchor.y;}return p;}
  function drawSelectionOverlay(canvas,variant){const ctx=canvas.getContext('2d'),ids=state.selectedPlanIds||new Set();ctx.save();ctx.strokeStyle='#f4c16f';ctx.fillStyle='rgba(244,193,111,.12)';ctx.lineWidth=3;variant.plan.walls.filter(w=>ids.has(w.id)).forEach(w=>{ctx.beginPath();ctx.moveTo(w.x1,w.y1);ctx.lineTo(w.x2,w.y2);ctx.stroke();});variant.plan.objects.filter(o=>ids.has(o.id)).forEach(o=>{ctx.strokeRect(o.x-4,o.y-4,o.width+8,o.depth+8);ctx.fillRect(o.x-4,o.y-4,o.width+8,o.depth+8);});ctx.restore();}
  function setupPlanCanvas(){const canvas=document.getElementById('planCanvas'),variant=currentVariant();if(!canvas||!variant)return;const plan=variant.plan;drawPlanCanvas(canvas,variant);drawSelectionOverlay(canvas,variant);let start=null,drag=null,preview=null;
    const repaint=()=>{drawPlanCanvas(canvas,variant,preview);drawSelectionOverlay(canvas,variant);};
    canvas.addEventListener('pointermove',(event)=>{const raw=pointerPoint(canvas,event),point=snapPlanPoint(raw,plan,start);const hud=document.getElementById('planCoordinateHud');if(hud)hud.textContent=`x ${Math.round(point.x/plan.scale*1000)} mm · y ${Math.round(point.y/plan.scale*1000)} mm`;if(start&&state.planTool==='wall'){preview={tool:'wall',start:{...start},end:{...point}};repaint();}if(drag){const dx=point.x-drag.last.x,dy=point.y-drag.last.y;drag.items.forEach(item=>{if(item.kind==='object'){item.ref.x+=dx;item.ref.y+=dy;}else{item.ref.x1+=dx;item.ref.y1+=dy;item.ref.x2+=dx;item.ref.y2+=dy;}item.ref.updatedAt=new Date().toISOString();});drag.last=point;repaint();}});
    canvas.addEventListener('pointerdown',(event)=>{const point=snapPlanPoint(pointerPoint(canvas,event),plan);if(plan.layerLocks?.[state.activeLayer]&&state.planTool!=='select')return toast('Aktivní vrstva je zamknutá.','error');if(state.planTool==='wall'){start=point;preview=null;canvas.setPointerCapture(event.pointerId);return;}const found=findPlanTarget(plan,point,variant);const target=found?{...found,item:found.kind==='wall'?plan.walls.find(x=>x.id===found.id):plan.objects.find(x=>x.id===found.id)}:null;if(state.planTool==='delete'&&target){pushPlanHistory(currentProject(),variant);if(target.kind==='wall')plan.walls=plan.walls.filter(x=>x.id!==target.item.id);else plan.objects=plan.objects.filter(x=>x.id!==target.item.id);saveProject(currentProject()).then(render);return;}if(state.planTool==='object'){const def=selectedElementDefinition();pushPlanHistory(currentProject(),variant);const obj={id:uid('object'),type:def.name,libraryKey:def.key,layer:def.layer,shape:def.shape,x:point.x,y:point.y,width:def.width/1000*plan.scale,depth:def.depth/1000*plan.scale,height:def.height,color:def.color,note:'',materialId:'',rotation:0,updatedAt:new Date().toISOString()};plan.objects.push(obj);state.selectedPlanIds=new Set([obj.id]);saveProject(currentProject()).then(render);return;}if(target){if(event.shiftKey){state.selectedPlanIds.has(target.item.id)?state.selectedPlanIds.delete(target.item.id):state.selectedPlanIds.add(target.item.id);}else if(!state.selectedPlanIds.has(target.item.id))state.selectedPlanIds=new Set([target.item.id]);const chosen=planSelectionItems(plan);drag={last:point,items:[...chosen.objects.map(ref=>({kind:'object',ref})),...chosen.walls.map(ref=>({kind:'wall',ref}))]};pushPlanHistory(currentProject(),variant);canvas.setPointerCapture(event.pointerId);repaint();}else{state.selectedPlanIds=new Set();repaint();}});
    canvas.addEventListener('pointerup',async(event)=>{if(state.planTool==='wall'&&start){const end=snapPlanPoint(pointerPoint(canvas,event),plan,start);if(Math.hypot(end.x-start.x,end.y-start.y)>5){pushPlanHistory(currentProject(),variant);plan.walls.push({id:uid('wall'),x1:start.x,y1:start.y,x2:end.x,y2:end.y,updatedAt:new Date().toISOString()});await saveProject(currentProject());}start=null;preview=null;render();return;}if(drag){drag=null;await saveProject(currentProject(),true,true);render();}});
  }

/* Section renderer, 3D model, walkthrough and WebXR. Source fragment; assembled by scripts/build.mjs. */
  function setupSectionCanvas() {
    const canvas = document.getElementById('sectionCanvas');
    const variant = currentVariant();
    if (!canvas || !variant) return;
    drawSectionCanvas(canvas, variant);
  }

  function drawSectionCanvas(canvas, variant) {
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height; const plan = variant.plan;
    ctx.clearRect(0,0,w,h);
    const bg = ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#182630'); bg.addColorStop(1,'#0c151b'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    const sourcePoints=[]; plan.walls.forEach((wall)=>sourcePoints.push([wall.x1,wall.y1],[wall.x2,wall.y2]));
    if (!sourcePoints.length) {
      ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='700 25px system-ui';ctx.textAlign='center';ctx.fillText('Řez zatím nemá z čeho vzniknout',w/2,h/2-10);ctx.font='14px system-ui';ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillText('Nejdříve vytvořte stěny v části 2D výkres.',w/2,h/2+24);ctx.textAlign='left';return;
    }
    const bounds=computeBounds(sourcePoints); const vertical=variant.section.orientation==='x'; const ratio=clamp(parseNum(variant.section.position,50)/100,0,1);
    const cut=vertical?bounds.minX+bounds.width*ratio:bounds.minY+bounds.height*ratio;
    const axisMin=(vertical?bounds.minY:bounds.minX)/plan.scale; const axisMax=(vertical?bounds.maxY:bounds.maxX)/plan.scale; const span=Math.max(1,axisMax-axisMin);
    const sectionScale=Math.min(145,(w-180)/(span+0.8)); const sectionWidth=span*sectionScale; const left=Math.max(90,(w-sectionWidth)/2); const baseline=Math.round(h*0.73); const axisX=(world)=>left+(world-axisMin)*sectionScale;
    const wallHeightPx=plan.wallHeight*sectionScale; const top=baseline-wallHeightPx;

    // subtle meter grid
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.045)';ctx.lineWidth=1;
    for(let m=Math.floor(axisMin);m<=Math.ceil(axisMax);m++){const x=axisX(m);ctx.beginPath();ctx.moveTo(x,55);ctx.lineTo(x,h-55);ctx.stroke();}
    for(let z=0;z<=Math.ceil(plan.wallHeight+1);z++){const y=baseline-z*sectionScale;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(w-50,y);ctx.stroke();}
    ctx.restore();

    const floorLayers=variant.assemblies.floor||[]; let floorY=baseline;
    floorLayers.forEach((layer)=>{const thickness=Math.max(1,parseNum(layer.thicknessMm)/1000*sectionScale);ctx.fillStyle=layer.color||'#777';ctx.fillRect(left-35,floorY,span*sectionScale+70,thickness);ctx.strokeStyle='rgba(255,255,255,.16)';ctx.strokeRect(left-35,floorY,span*sectionScale+70,thickness);floorY+=thickness;});
    ctx.fillStyle='#273239';ctx.fillRect(left-35,floorY,span*sectionScale+70,Math.max(24,h-floorY-55));

    const ceilingLayers=variant.assemblies.ceiling||[]; let ceilingY=top;
    ceilingLayers.forEach((layer)=>{const thickness=Math.max(1,parseNum(layer.thicknessMm)/1000*sectionScale);ceilingY-=thickness;ctx.fillStyle=layer.color||'#888';ctx.fillRect(left-35,ceilingY,span*sectionScale+70,thickness);ctx.strokeStyle='rgba(255,255,255,.14)';ctx.strokeRect(left-35,ceilingY,span*sectionScale+70,thickness);});

    const wallColor=variant.materials.find((item)=>item.id===variant.appearance.wallMaterialId)?.swatch||'#b88852';
    const intersections=[];
    plan.walls.forEach((wall,index)=>{
      const a=vertical?wall.x1:wall.y1;const b=vertical?wall.x2:wall.y2;
      const min=Math.min(a,b)-plan.wallThickness*plan.scale/2;const max=Math.max(a,b)+plan.wallThickness*plan.scale/2;
      if(cut<min||cut>max)return;
      const denom=b-a;let t=Math.abs(denom)<0.0001?0.5:(cut-a)/denom;t=clamp(t,0,1);
      const cross=vertical?wall.y1+(wall.y2-wall.y1)*t:wall.x1+(wall.x2-wall.x1)*t;
      intersections.push({position:cross/plan.scale,index:index+1});
    });
    intersections.forEach((hit)=>{const x=axisX(hit.position);const thickness=Math.max(8,plan.wallThickness*sectionScale);ctx.fillStyle=wallColor;ctx.fillRect(x-thickness/2,top,thickness,wallHeightPx);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.strokeRect(x-thickness/2,top,thickness,wallHeightPx);ctx.fillStyle='#f4dfbf';ctx.font='700 11px system-ui';ctx.fillText(`S${hit.index}`,x-7,top+18);});

    plan.objects.filter((object)=>plan.layerVisibility?.[object.layer]!==false).forEach((object)=>{
      const start=vertical?object.x:object.y;const sizeCut=vertical?object.width:object.depth;
      if(cut<start||cut>start+sizeCut)return;
      const horizontalStart=(vertical?object.y:object.x)/plan.scale;const horizontalSize=(vertical?object.depth:object.width)/plan.scale;
      const x=axisX(horizontalStart);const ww=Math.max(5,horizontalSize*sectionScale);const hh=Math.max(5,parseNum(object.height,10)/100*sectionScale);const color=variant.materials.find((item)=>item.id===object.materialId)?.swatch||object.color||LAYERS[object.layer]?.color||'#71838f';
      ctx.fillStyle=color;ctx.globalAlpha=.9;ctx.fillRect(x,baseline-hh,ww,hh);ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.strokeRect(x,baseline-hh,ww,hh);ctx.fillStyle='#eef4f6';ctx.font='700 10px system-ui';ctx.fillText(object.type,x+5,baseline-hh+15);
    });

    ctx.strokeStyle='#e9c38c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left-45,baseline);ctx.lineTo(left+span*sectionScale+45,baseline);ctx.stroke();
    ctx.fillStyle='#f0d6ad';ctx.font='800 17px system-ui';ctx.fillText(variant.section.name||'Řez A–A',55,38);
    ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='12px system-ui';ctx.fillText(`Poloha řezu ${Math.round(ratio*100)} % · ${vertical?'svislá':'vodorovná'} řezná čára · skutečné měřítko vrstev`,55,60);

    if(variant.section.showDimensions){
      drawSectionDimension(ctx,left-62,baseline,top,`${planNumber(plan.wallHeight)} m`);
      const floorTotal=(variant.assemblies.floor||[]).reduce((sum,layer)=>sum+parseNum(layer.thicknessMm),0);drawSectionDimension(ctx,Math.min(w-66,left+sectionWidth+62),baseline,floorY,`${floorTotal} mm`);
      ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,baseline+38);ctx.lineTo(left+span*sectionScale,baseline+38);ctx.stroke();ctx.beginPath();ctx.moveTo(left,baseline+30);ctx.lineTo(left,baseline+46);ctx.moveTo(left+span*sectionScale,baseline+30);ctx.lineTo(left+span*sectionScale,baseline+46);ctx.stroke();ctx.fillStyle='#dce6ea';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText(`${planNumber(span)} m`,left+span*sectionScale/2,baseline+57);ctx.textAlign='left';
    }
    ctx.fillStyle='rgba(255,255,255,.48)';ctx.font='11px system-ui';ctx.fillText(`Průsečíky stěn: ${intersections.length} · zobrazené objekty: ${plan.objects.filter((object)=>plan.layerVisibility?.[object.layer]!==false).length}`,55,h-25);
  }

  function drawSectionDimension(ctx,x,y1,y2,label){
    ctx.save();ctx.strokeStyle='#ef8e7a';ctx.fillStyle='#ef8e7a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.stroke();
    [[y1,-1],[y2,1]].forEach(([y,dir])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+dir*8);ctx.lineTo(x+5,y+dir*8);ctx.closePath();ctx.fill();});
    ctx.translate(x-10,(y1+y2)/2);ctx.rotate(-Math.PI/2);ctx.font='700 12px system-ui';const m=ctx.measureText(label);ctx.fillStyle='rgba(8,15,20,.9)';roundRect(ctx,-m.width/2-6,-15,m.width+12,22,5);ctx.fill();ctx.fillStyle='#f4b3a7';ctx.fillText(label,-m.width/2,1);ctx.restore();
  }

  function setupModelCanvas() {
    const canvas = document.getElementById('modelCanvas');
    const variant = currentVariant();
    if (!canvas || !variant) return;
    drawModelCanvas(canvas, variant.plan, variant, state.modelMode);
  }

  function drawModelCanvas(canvas, plan, variant = currentVariant(), mode = state.modelMode) {
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mode === 'material' ? '#20313a' : '#17242d'); bg.addColorStop(1, '#0d151b'); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    const visibleObjects = plan.objects.filter((object) => plan.layerVisibility?.[object.layer] !== false);
    const visibleWalls = plan.layerVisibility?.architecture !== false ? plan.walls : [];
    const points = [];
    visibleWalls.forEach((wall) => points.push([wall.x1 / plan.scale, wall.y1 / plan.scale], [wall.x2 / plan.scale, wall.y2 / plan.scale]));
    visibleObjects.forEach((object) => points.push([object.x / plan.scale, object.y / plan.scale], [(object.x + object.width) / plan.scale, (object.y + object.depth) / plan.scale]));
    const bounds = computeBounds(points.length ? points : [[0,0],[8,6]]); const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
    const angle = state.threeD.angle * Math.PI / 180; const tilt = state.threeD.tilt * Math.PI / 180; const baseScale = Math.min(78, 570 / Math.max(bounds.width, bounds.height, 6)) * state.threeD.zoom;
    const projectPoint = (x, y, z) => { const rx = (x-center.x)*Math.cos(angle)-(y-center.y)*Math.sin(angle); const ry=(x-center.x)*Math.sin(angle)+(y-center.y)*Math.cos(angle); return {x:w/2+rx*baseScale,y:h*.72+ry*baseScale*Math.sin(tilt)-z*baseScale*Math.cos(tilt),depth:ry+z*.1}; };

    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1; const gridPad=2; const minGX=Math.floor(bounds.minX-gridPad),maxGX=Math.ceil(bounds.maxX+gridPad),minGY=Math.floor(bounds.minY-gridPad),maxGY=Math.ceil(bounds.maxY+gridPad);
    for(let gx=minGX;gx<=maxGX;gx++){const a=projectPoint(gx,minGY,0),b=projectPoint(gx,maxGY,0);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let gy=minGY;gy<=maxGY;gy++){const a=projectPoint(minGX,gy,0),b=projectPoint(maxGX,gy,0);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();} ctx.restore();

    const floorPolygon = orderedPlanPolygon(plan);
    if (floorPolygon) {
      const floorColor = mode === 'material' ? (variant?.materials?.find((item)=>item.id===variant?.appearance?.floorMaterialId)?.swatch || '#747a7d') : '#38464e';
      const projected=floorPolygon.map(([x,y])=>projectPoint(x/plan.scale,y/plan.scale,0.005));ctx.beginPath();projected.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=floorColor;ctx.globalAlpha=mode==='material'?.72:.38;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.2)';ctx.stroke();
      if(mode==='material'){ctx.save();ctx.clip();ctx.strokeStyle='rgba(255,255,255,.12)';for(let x=-w;x<w*2;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();}ctx.restore();}
    }

    const faces=[];
    const wallBase = mode === 'material' ? (variant?.materials?.find((item)=>item.id===variant?.appearance?.wallMaterialId)?.swatch || '#b88852') : '#b88852';
    visibleWalls.forEach((wall) => {
      const x1=wall.x1/plan.scale,y1=wall.y1/plan.scale,x2=wall.x2/plan.scale,y2=wall.y2/plan.scale,thickness=plan.wallThickness,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=-dy/len*thickness/2,ny=dx/len*thickness/2,z=plan.wallHeight;
      const corners=[[x1+nx,y1+ny,0],[x2+nx,y2+ny,0],[x2-nx,y2-ny,0],[x1-nx,y1-ny,0],[x1+nx,y1+ny,z],[x2+nx,y2+ny,z],[x2-nx,y2-ny,z],[x1-nx,y1-ny,z]];
      const defs=[{ids:[4,5,6,7],fill:lighten(wallBase,.18)},{ids:[0,1,5,4],fill:darken(wallBase,.08)},{ids:[1,2,6,5],fill:darken(wallBase,.18)},{ids:[2,3,7,6],fill:wallBase},{ids:[3,0,4,7],fill:darken(wallBase,.1)}];
      defs.forEach((face)=>{const projected=face.ids.map((id)=>projectPoint(...corners[id]));faces.push({points:projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/projected.length,fill:face.fill,stroke:'rgba(255,255,255,.18)'});});
    });

    visibleObjects.forEach((object) => {
      const x=object.x/plan.scale,y=object.y/plan.scale,ww=Math.max(.04,object.width/plan.scale),dd=Math.max(.04,object.depth/plan.scale),hh=Math.max(.06,parseNum(object.height,10)/100);
      const corners=[[x,y,0],[x+ww,y,0],[x+ww,y+dd,0],[x,y+dd,0],[x,y,hh],[x+ww,y,hh],[x+ww,y+dd,hh],[x,y+dd,hh]];
      const linked=variant?.materials?.find((item)=>item.id===object.materialId); const color=mode==='material'?(linked?.swatch||object.color||LAYERS[object.layer]?.color||'#71838f'):(LAYERS[object.layer]?.color||object.color||'#71838f');
      const defs=[{ids:[4,5,6,7],fill:lighten(color,.18)},{ids:[0,1,5,4],fill:darken(color,.08)},{ids:[1,2,6,5],fill:darken(color,.16)},{ids:[2,3,7,6],fill:color},{ids:[3,0,4,7],fill:darken(color,.04)}];
      defs.forEach((face)=>{const projected=face.ids.map((id)=>projectPoint(...corners[id]));faces.push({points:projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/projected.length,fill:face.fill,stroke:'rgba(255,255,255,.24)'});});
    });

    faces.sort((a,b)=>a.depth-b.depth); faces.forEach((face)=>{ctx.beginPath();face.points.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=face.fill;ctx.fill();ctx.strokeStyle=face.stroke;ctx.lineWidth=1;ctx.stroke();});

    if (!visibleWalls.length && !visibleObjects.length) { ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='700 24px system-ui';ctx.textAlign='center';ctx.fillText('3D model zatím nemá žádné viditelné prvky',w/2,h/2-10);ctx.font='14px system-ui';ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillText('Nakreslete prvky nebo zapněte příslušné vrstvy.',w/2,h/2+24);ctx.textAlign='left'; }
    ctx.fillStyle='rgba(255,255,255,.52)';ctx.font='12px system-ui';ctx.fillText(`${mode==='material'?'Materiálový':'Technický'} režim · výška ${plan.wallHeight.toFixed(2)} m · ${visibleWalls.length} stěn · ${visibleObjects.length} viditelných prvků`,18,h-18);
  }

  function computeBounds(points) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    return { minX, maxX, minY, maxY, width: Math.max(1,maxX-minX), height: Math.max(1,maxY-minY) };
  }

  function colorToRgb(hex) {
    const value = String(hex || '#777777').replace('#','');
    const normalized = value.length === 3 ? value.split('').map((c) => c+c).join('') : value.padEnd(6,'7').slice(0,6);
    return { r: parseInt(normalized.slice(0,2),16), g: parseInt(normalized.slice(2,4),16), b: parseInt(normalized.slice(4,6),16) };
  }
  function rgbToHex({r,g,b}) { return `#${[r,g,b].map((v) => clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')}`; }
  function mixColor(hex, amount) {
    const rgb = colorToRgb(hex);
    const target = amount >= 0 ? 255 : 0;
    const ratio = Math.abs(amount);
    return rgbToHex({ r: rgb.r + (target-rgb.r)*ratio, g: rgb.g + (target-rgb.g)*ratio, b: rgb.b + (target-rgb.b)*ratio });
  }
  const lighten = (hex, amount) => mixColor(hex, amount);
  const darken = (hex, amount) => mixColor(hex, -amount);

  function resetWalkthroughCamera() {
    const variant = currentVariant(); const bounds = planGeometryBounds(variant.plan); const depth = Math.max(1, bounds.maxY - bounds.minY); variant.presentation.cameraX = (bounds.minX + bounds.maxX) / 2; variant.presentation.cameraY = bounds.maxY - Math.min(variant.plan.scale * 0.45, depth * 0.18); variant.presentation.yaw = 0;
  }

  function setupWalkthrough() {
    const canvas = document.getElementById('walkthroughCanvas'); if (!canvas) return; const variant = currentVariant(); if (!Number.isFinite(variant.presentation.cameraX) || !Number.isFinite(variant.presentation.cameraY)) resetWalkthroughCamera();
    let dragging = false, lastX = 0;
    canvas.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener('pointermove', (event) => { if (!dragging) return; variant.presentation.yaw += (event.clientX - lastX) * 0.006; lastX = event.clientX; drawWalkthrough(); });
    canvas.addEventListener('pointerup', () => { dragging = false; saveProject(currentProject(), true, true); });
    window.onkeydown = (event) => { if (state.currentTab !== 'presentation') return; const key = ({ ArrowUp: 'forward', w: 'forward', W: 'forward', ArrowDown: 'back', s: 'back', S: 'back', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' })[event.key]; if (key) { event.preventDefault(); moveWalkthrough(key); } };
    drawWalkthrough(); checkXRSupport(false);
  }

  function moveWalkthrough(direction) {
    const variant = currentVariant(); const camera = variant.presentation; const step = Math.max(10, variant.plan.scale * 0.18); const forwardX = Math.sin(camera.yaw), forwardY = -Math.cos(camera.yaw); const rightX = Math.cos(camera.yaw), rightY = Math.sin(camera.yaw);
    if (direction === 'forward') { camera.cameraX += forwardX * step; camera.cameraY += forwardY * step; }
    if (direction === 'back') { camera.cameraX -= forwardX * step; camera.cameraY -= forwardY * step; }
    if (direction === 'left') { camera.cameraX -= rightX * step; camera.cameraY -= rightY * step; }
    if (direction === 'right') { camera.cameraX += rightX * step; camera.cameraY += rightY * step; }
    saveProject(currentProject(), true, true); drawWalkthrough();
  }

  function drawWalkthrough() {
    const canvas = document.getElementById('walkthroughCanvas'); if (!canvas) return; const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); const width = Math.max(320, rect.width || 1280), height = Math.max(260, rect.height || 760); const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr); if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; } const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const variant = currentVariant(); const plan = variant.plan; const camera = variant.presentation; const horizon = height * 0.5; const focal = width / (2 * Math.tan((camera.fov || 72) * Math.PI / 360)); const camHeight = 1.65 * plan.scale; const wallHeight = plan.wallHeight * plan.scale; const near = 8;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon); sky.addColorStop(0, '#14232d'); sky.addColorStop(1, '#263844'); ctx.fillStyle = sky; ctx.fillRect(0, 0, width, horizon); const floor = ctx.createLinearGradient(0, horizon, 0, height); floor.addColorStop(0, '#4a4a45'); floor.addColorStop(1, '#191c1d'); ctx.fillStyle = floor; ctx.fillRect(0, horizon, width, height - horizon);
    const transform = (x, y) => { const dx = x - camera.cameraX, dy = y - camera.cameraY; const sin = Math.sin(camera.yaw), cos = Math.cos(camera.yaw); return { side: dx * cos + dy * sin, forward: dx * sin - dy * cos }; };
    const project = (side, forward, vertical) => ({ x: width / 2 + side / forward * focal, y: horizon - (vertical - camHeight) / forward * focal });
    const segments = [];
    plan.walls.forEach((wall, index) => { let a = transform(wall.x1, wall.y1), b = transform(wall.x2, wall.y2); if (a.forward <= near && b.forward <= near) return; if (a.forward <= near || b.forward <= near) { const t = (near - a.forward) / (b.forward - a.forward); const side = a.side + (b.side - a.side) * t; if (a.forward <= near) a = { side, forward: near }; else b = { side, forward: near }; } const p1f = project(a.side, a.forward, 0), p2f = project(b.side, b.forward, 0), p1c = project(a.side, a.forward, wallHeight), p2c = project(b.side, b.forward, wallHeight); segments.push({ depth: (a.forward + b.forward) / 2, points: [p1c, p2c, p2f, p1f], color: index % 2 ? '#a5937a' : '#b3a28b' }); });
    segments.sort((a, b) => b.depth - a.depth).forEach((segment) => { ctx.beginPath(); ctx.moveTo(segment.points[0].x, segment.points[0].y); segment.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.fillStyle = segment.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 2; ctx.stroke(); });
    if (variant.presentation.showObjects) plan.objects.map((object) => { const center = transform(object.x + object.width / 2, object.y + object.depth / 2); return { object, center }; }).filter((item) => item.center.forward > near).sort((a, b) => b.center.forward - a.center.forward).forEach(({ object, center }) => { const w = Math.max(8, object.width / center.forward * focal), h = Math.max(8, (object.height / 100 * plan.scale) / center.forward * focal); const base = project(center.side, center.forward, 0); ctx.fillStyle = object.color || '#7eb3aa'; ctx.fillRect(base.x - w / 2, base.y - h, w, h); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.strokeRect(base.x - w / 2, base.y - h, w, h); if (variant.presentation.showLabels && w > 24) { ctx.fillStyle = '#fff'; ctx.font = '15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(object.type, base.x, base.y - h - 8); } });
    // Compact live minimap: keeps the walkthrough understandable even when the camera faces a nearby wall.
    const bounds = planGeometryBounds(plan); const mapW = 194, mapH = 132, mapX = 18, mapY = 18, mapPad = 16; const mapScale = Math.min((mapW - mapPad * 2) / Math.max(1, bounds.maxX - bounds.minX), (mapH - mapPad * 2) / Math.max(1, bounds.maxY - bounds.minY));
    ctx.save(); ctx.globalAlpha = .96; ctx.fillStyle = 'rgba(9,18,24,.86)'; roundRect(ctx, mapX, mapY, mapW, mapH, 14); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.17)'; ctx.lineWidth = 1; ctx.stroke();
    const mapPoint = (x, y) => ({ x: mapX + mapPad + (x - bounds.minX) * mapScale, y: mapY + mapPad + (y - bounds.minY) * mapScale });
    ctx.strokeStyle = 'rgba(235,226,211,.92)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; plan.walls.forEach((wall) => { const a = mapPoint(wall.x1, wall.y1), b = mapPoint(wall.x2, wall.y2); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
    if (variant.presentation.showObjects) { ctx.fillStyle = 'rgba(92,189,169,.72)'; plan.objects.forEach((object) => { const p = mapPoint(object.x, object.y); const w = Math.max(3, object.width * mapScale), h = Math.max(3, object.depth * mapScale); ctx.fillRect(p.x, p.y, w, h); }); }
    const cam = mapPoint(camera.cameraX, camera.cameraY); ctx.fillStyle = '#f5b764'; ctx.beginPath(); ctx.arc(cam.x, cam.y, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#f5b764'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cam.x, cam.y); ctx.lineTo(cam.x + Math.sin(camera.yaw) * 22, cam.y - Math.cos(camera.yaw) * 22); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = '600 11px system-ui'; ctx.textAlign = 'left'; ctx.fillText('PŮDORYS', mapX + 12, mapY + mapH - 9); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(width / 2 - 10, horizon); ctx.lineTo(width / 2 + 10, horizon); ctx.moveTo(width / 2, horizon - 10); ctx.lineTo(width / 2, horizon + 10); ctx.stroke(); const pos = document.getElementById('walkthroughPosition'); if (pos) pos.textContent = `x ${Math.round(camera.cameraX)} · y ${Math.round(camera.cameraY)} · ${Math.round(camera.yaw * 180 / Math.PI)}°`;
  }

  async function openPresentationFullscreen() { const wrap = document.getElementById('walkthroughWrap'); if (!wrap) return; try { await wrap.requestFullscreen(); setTimeout(drawWalkthrough, 100); } catch (error) { toast('Celou obrazovku se nepodařilo otevřít.', 'error'); } }

  async function toggleGyroscope() {
    if (state.presentation.gyro) { state.presentation.gyro = false; window.removeEventListener('deviceorientation', handleDeviceOrientation); toast('Gyroskop byl vypnut.'); return render(); }
    try { if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { const permission = await DeviceOrientationEvent.requestPermission(); if (permission !== 'granted') throw new Error('Přístup k orientaci zařízení nebyl povolen.'); } window.addEventListener('deviceorientation', handleDeviceOrientation); state.presentation.gyro = true; toast('Pohled nyní sleduje otáčení telefonu.'); render(); } catch (error) { toast(error.message || 'Gyroskop není dostupný.', 'error'); }
  }

  function handleDeviceOrientation(event) { if (!state.presentation.gyro || state.currentTab !== 'presentation') return; const variant = currentVariant(); if (Number.isFinite(event.alpha)) variant.presentation.yaw = event.alpha * Math.PI / 180; drawWalkthrough(); }

  async function checkXRSupport(showToast = false) { const before = JSON.stringify(state.xrSupport || {}); const support = { checked: true, vr: false, ar: false, secure: window.isSecureContext }; try { if (navigator.xr) { support.vr = await navigator.xr.isSessionSupported('immersive-vr'); support.ar = await navigator.xr.isSessionSupported('immersive-ar'); } } catch {} state.xrSupport = support; if (showToast) toast(support.vr ? 'Zařízení podporuje imerzivní VR.' : 'Imerzivní VR zde není dostupné.', support.vr ? '' : 'error'); if (state.currentTab === 'presentation' && before !== JSON.stringify(support)) render(); return support; }

  function xrSceneGeometry(variant) {
    const plan = variant.plan, bounds = planGeometryBounds(plan), cx = (bounds.minX + bounds.maxX) / 2, cy = (bounds.minY + bounds.maxY) / 2, vertices = [], colors = [];
    const addTri = (a, b, c, color) => { [a, b, c].forEach((v) => vertices.push(...v)); for (let i = 0; i < 3; i++) colors.push(...color); };
    const wallColor = [0.68, 0.58, 0.46, 1]; plan.walls.forEach((wall) => { const x1 = (wall.x1 - cx) / plan.scale, z1 = (wall.y1 - cy) / plan.scale, x2 = (wall.x2 - cx) / plan.scale, z2 = (wall.y2 - cy) / plan.scale, h = plan.wallHeight; addTri([x1,0,z1],[x2,0,z2],[x2,h,z2],wallColor); addTri([x1,0,z1],[x2,h,z2],[x1,h,z1],wallColor); });
    const floorColor = [0.26,0.27,0.25,1]; addTri([-20,0,-20],[20,0,-20],[20,0,20],floorColor); addTri([-20,0,-20],[20,0,20],[-20,0,20],floorColor); return { vertices: new Float32Array(vertices), colors: new Float32Array(colors) };
  }

  function multiply4(a, b) { const out = new Float32Array(16); for (let row=0; row<4; row++) for (let col=0; col<4; col++) out[col*4+row] = a[0*4+row]*b[col*4+0]+a[1*4+row]*b[col*4+1]+a[2*4+row]*b[col*4+2]+a[3*4+row]*b[col*4+3]; return out; }

  async function startWebXRPresentation() {
    const support = await checkXRSupport(false); if (!support.vr || !navigator.xr) return toast('Kompatibilní WebXR headset nebyl nalezen.', 'error');
    try { const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] }); const canvas = document.createElement('canvas'); canvas.className = 'xr-canvas'; document.body.appendChild(canvas); const gl = canvas.getContext('webgl', { xrCompatible: true, antialias: true }); if (gl.makeXRCompatible) await gl.makeXRCompatible(); session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) }); const refSpace = await session.requestReferenceSpace('local-floor').catch(() => session.requestReferenceSpace('local'));
      const vertex = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vertex, 'attribute vec3 p;attribute vec4 c;uniform mat4 mvp;varying vec4 vc;void main(){gl_Position=mvp*vec4(p,1.0);vc=c;}'); gl.compileShader(vertex); const fragment = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fragment, 'precision mediump float;varying vec4 vc;void main(){gl_FragColor=vc;}'); gl.compileShader(fragment); const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); const geo = xrSceneGeometry(currentVariant()); const pos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW); const col = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, col); gl.bufferData(gl.ARRAY_BUFFER, geo.colors, gl.STATIC_DRAW); const pLoc = gl.getAttribLocation(program, 'p'), cLoc = gl.getAttribLocation(program, 'c'), mvpLoc = gl.getUniformLocation(program, 'mvp'); gl.enable(gl.DEPTH_TEST);
      const frame = (time, xrFrame) => { const pose = xrFrame.getViewerPose(refSpace); const layer = session.renderState.baseLayer; gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer); gl.clearColor(0.05,0.08,0.1,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); if (pose) for (const view of pose.views) { const viewport = layer.getViewport(view); gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.enableVertexAttribArray(pLoc); gl.vertexAttribPointer(pLoc,3,gl.FLOAT,false,0,0); gl.bindBuffer(gl.ARRAY_BUFFER,col); gl.enableVertexAttribArray(cLoc); gl.vertexAttribPointer(cLoc,4,gl.FLOAT,false,0,0); gl.uniformMatrix4fv(mvpLoc,false,multiply4(view.projectionMatrix,view.transform.inverse.matrix)); gl.drawArrays(gl.TRIANGLES,0,geo.vertices.length/3); } session.requestAnimationFrame(frame); }; session.requestAnimationFrame(frame); session.addEventListener('end', () => canvas.remove());
    } catch (error) { console.error(error); toast(error.message || 'VR relaci se nepodařilo spustit.', 'error'); }
  }

/* RealSpace 3D: WebGL scene, materials, cutaway, shadows and GLB export. */
  let threeModulesPromise=null;
  async function loadThreeModules(){if(!threeModulesPromise)threeModulesPromise=Promise.all([import('./vendor/three.module.min.js'),import('./vendor/OrbitControls.js'),import('./vendor/GLTFExporter.js')]).then(([THREE,controls,exporter])=>({THREE,OrbitControls:controls.OrbitControls,GLTFExporter:exporter.GLTFExporter}));return threeModulesPromise;}
  function renderModelTab(project,variant){return`<div class="panel realspace-panel"><div class="panel-head"><div><p class="eyebrow">DOMUS RealSpace 3D</p><h2>Skutečný prostorový model</h2><p>WebGL model se stíny, perspektivní i ortografickou kamerou, řezy, popisky a exportem GLB.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="reset-camera">Výchozí pohled</button><button class="btn btn-secondary" data-action="fullscreen-3d">Celá obrazovka</button><button class="btn btn-secondary" data-action="capture-3d">Uložit obrázek</button><button class="btn btn-primary" data-action="export-glb">Export GLB</button></div></div><div class="realspace-layout"><div class="realspace-stage" id="realspaceStage"><canvas id="modelCanvas" aria-label="Interaktivní 3D model"></canvas><div id="threeLoading" class="three-loading">Načítám 3D engine…</div></div><aside class="realspace-controls"><label>Kamera<select id="threeCameraMode"><option value="perspective" ${state.threeD.cameraMode==='perspective'?'selected':''}>Perspektivní</option><option value="orthographic" ${state.threeD.cameraMode==='orthographic'?'selected':''}>Ortografická</option></select></label><label>Řez modelem <span>${Math.round(state.threeD.cutaway*100)} %</span><input id="threeCutaway" type="range" min="0.1" max="1" step=".05" value="${state.threeD.cutaway}"></label><label class="check-row"><input id="threeShadows" type="checkbox" ${state.threeD.shadows?'checked':''}> stíny</label><label class="check-row"><input id="threeCeiling" type="checkbox" ${state.threeD.ceiling?'checked':''}> strop</label><label class="check-row"><input id="threeLabels" type="checkbox" ${state.threeD.labels?'checked':''}> popisky</label><label>Materiál stěn<select id="wallMaterialSelect">${materialOptions(variant,variant.appearance.wallMaterialId)}</select></label><label>Materiál podlahy<select id="floorMaterialSelect">${materialOptions(variant,variant.appearance.floorMaterialId)}</select></label><div class="info-box"><strong>Model je odvozen z 2D půdorysu.</strong><br>Export GLB lze otevřít v běžných 3D prohlížečích a dále zpracovat.</div></aside></div></div>`;}
  function threeColor(THREE,value,fallback='#8c8175'){try{return new THREE.Color(value||fallback);}catch{return new THREE.Color(fallback);}}
  function disposeThreeRuntime(){const r=state.threeRuntime;if(!r)return;r.stop?.();r.resizeObserver?.disconnect();r.controls?.dispose();r.scene?.traverse?.((node)=>{node.geometry?.dispose?.();const mats=Array.isArray(node.material)?node.material:[node.material];mats.filter(Boolean).forEach((mat)=>{Object.values(mat).forEach((value)=>value?.isTexture&&value.dispose?.());mat.dispose?.();});});r.renderer?.renderLists?.dispose?.();r.renderer?.dispose();state.threeRuntime=null;}
  function pbrMaterial(THREE,source={},fallback='#8c8175'){const text=`${source.name||''} ${source.category||''} ${source.note||''}`.toLowerCase();const metal=/nerez|ocel|kov|hliník|mosaz|chrom/.test(text),glass=/sklo|glass/.test(text),wood=/dřevo|dub|buk|smrk|wood/.test(text),stone=/kámen|beton|dlaž|keram|stone/.test(text);return new THREE.MeshStandardMaterial({color:threeColor(THREE,source.swatch||source.color,fallback),roughness:glass?.12:metal?.28:wood?.7:stone?.82:.62,metalness:metal?.58:0,transparent:glass,opacity:glass?.42:1,side:glass?THREE.DoubleSide:THREE.FrontSide});}
  function fullscreenThree(){const stage=document.getElementById('realspaceStage');if(!stage)return;if(document.fullscreenElement)return document.exitFullscreen?.();stage.requestFullscreen?.().catch(()=>toast('Režim celé obrazovky není v tomto prostředí dostupný.','error'));}
  function createLabelSprite(THREE,text){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='rgba(10,18,24,.85)';x.fillRect(0,0,c.width,c.height);x.fillStyle='#f4d39a';x.font='700 40px system-ui';x.textAlign='center';x.fillText(String(text).slice(0,30),256,78);const texture=new THREE.CanvasTexture(c),mat=new THREE.SpriteMaterial({map:texture,transparent:true});const s=new THREE.Sprite(mat);s.scale.set(2.4,.6,1);s.userData.domusDisposable=true;return s;}
  async function buildThreeModel(){const {THREE}=await loadThreeModules(),project=currentProject(),variant=currentVariant(project),plan=variant.plan,group=new THREE.Group();group.name='DOMUS_MODEL';const scale=Math.max(1,plan.scale),wallMat=pbrMaterial(THREE,variant.materials.find(m=>m.id===variant.appearance.wallMaterialId)||{},'#b48a62'),floorMat=pbrMaterial(THREE,variant.materials.find(m=>m.id===variant.appearance.floorMaterialId)||{},'#797b78'),height=plan.wallHeight||2.6,cut=state.threeD.cutaway||1;
    const poly=orderedPlanPolygon(plan);if(poly?.length>=3){const shape=new THREE.Shape();poly.forEach(([x,y],i)=>{const px=x/scale,py=-y/scale;i?shape.lineTo(px,py):shape.moveTo(px,py);});const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),floorMat);mesh.rotation.x=-Math.PI/2;mesh.position.y=.01;mesh.receiveShadow=true;group.add(mesh);}
    plan.walls.forEach((w,index)=>{if(index/Math.max(1,plan.walls.length)>cut)return;const x1=w.x1/scale,z1=-w.y1/scale,x2=w.x2/scale,z2=-w.y2/scale,len=Math.hypot(x2-x1,z2-z1);if(len<.01)return;const geo=new THREE.BoxGeometry(len,height,plan.wallThickness||.15),mesh=new THREE.Mesh(geo,wallMat);mesh.position.set((x1+x2)/2,height/2,(z1+z2)/2);mesh.rotation.y=-Math.atan2(z2-z1,x2-x1);mesh.castShadow=mesh.receiveShadow=state.threeD.shadows;group.add(mesh);});
    plan.objects.filter(o=>plan.layerVisibility?.[o.layer]!==false).forEach(o=>{const w=Math.max(.03,o.width/scale),d=Math.max(.03,o.depth/scale),h=Math.max(.04,parseNum(o.height,20)/100),mat=pbrMaterial(THREE,variant.materials.find(m=>m.id===o.materialId)||{name:o.type,color:o.color||LAYERS[o.layer]?.color},o.color||LAYERS[o.layer]?.color);const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(o.x/scale+w/2,h/2,-o.y/scale-d/2);mesh.rotation.y=-(Number(o.rotation)||0)*Math.PI/180;mesh.castShadow=mesh.receiveShadow=state.threeD.shadows;mesh.name=o.type;group.add(mesh);if(state.threeD.labels){const label=createLabelSprite(THREE,o.type);label.position.set(mesh.position.x,h+.45,mesh.position.z);group.add(label);}});
    if(state.threeD.ceiling&&poly?.length>=3){const shape=new THREE.Shape();poly.forEach(([x,y],i)=>{const px=x/scale,py=-y/scale;i?shape.lineTo(px,py):shape.moveTo(px,py);});const mat=new THREE.MeshStandardMaterial({color:'#dedbd2',transparent:true,opacity:.35,side:THREE.DoubleSide}),ceiling=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat);ceiling.rotation.x=Math.PI/2;ceiling.position.y=height;group.add(ceiling);}return group;}
  async function setupModelCanvas(){disposeThreeRuntime();const canvas=document.getElementById('modelCanvas'),stage=document.getElementById('realspaceStage');if(!canvas||!stage)return;try{const {THREE,OrbitControls}=await loadThreeModules(),renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=state.threeD.shadows;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor('#101a20');const scene=new THREE.Scene();scene.background=new THREE.Color('#101a20');const aspect=Math.max(1,stage.clientWidth)/Math.max(1,stage.clientHeight),camera=state.threeD.cameraMode==='orthographic'?new THREE.OrthographicCamera(-6*aspect,6*aspect,6,-6,.01,1000):new THREE.PerspectiveCamera(48,aspect,.01,1000);camera.position.set(7,6,8);const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.target.set(2,1,0);scene.add(new THREE.HemisphereLight('#d9edff','#293018',1.8));const sun=new THREE.DirectionalLight('#fff3d3',2.4);sun.position.set(5,10,4);sun.castShadow=state.threeD.shadows;scene.add(sun);const grid=new THREE.GridHelper(24,48,'#51616b','#28343b');scene.add(grid);const model=await buildThreeModel();scene.add(model);const resize=()=>{const w=Math.max(320,stage.clientWidth),h=Math.max(320,stage.clientHeight);renderer.setSize(w,h,false);if(camera.isPerspectiveCamera){camera.aspect=w/h;camera.updateProjectionMatrix();}else{const a=w/h;camera.left=-6*a;camera.right=6*a;camera.updateProjectionMatrix();}};resize();const ro=new ResizeObserver(resize);ro.observe(stage);let alive=true;const loop=()=>{if(!alive)return;controls.update();renderer.render(scene,camera);requestAnimationFrame(loop);};state.threeRuntime={THREE,renderer,scene,camera,controls,model,resizeObserver:ro,stop:()=>{alive=false;}};document.getElementById('threeLoading')?.remove();loop();}catch(error){console.error(error);const loading=document.getElementById('threeLoading');if(loading)loading.innerHTML=`3D engine se nepodařilo načíst.<br><button class="btn btn-secondary" data-action="retry-3d">Zkusit znovu</button>`;}}
  async function exportCurrentGlb(){const r=state.threeRuntime;if(!r)return toast('Nejprve otevřete 3D model.','error');const {GLTFExporter}=await loadThreeModules();new GLTFExporter().parse(r.model,(data)=>{const blob=new Blob([data],{type:'model/gltf-binary'});downloadBlob(blob,`${DomusCore.safeId(currentProject().name,'projekt')}.glb`);toast('GLB model byl vytvořen.');},(error)=>toast(error.message,'error'),{binary:true,onlyVisible:true});}
  function captureThreeImage(){const r=state.threeRuntime;if(!r)return toast('3D model není připraven.','error');r.renderer.render(r.scene,r.camera);r.renderer.domElement.toBlob(blob=>blob&&downloadBlob(blob,`${DomusCore.safeId(currentProject().name,'projekt')}-3d.png`),'image/png');}

/* Backup import/export, RFQ/PDF preparation and report images. Source fragment; assembled by scripts/build.mjs. */
  async function exportBackup() {
    try {
      setSaveState('saving');
      const blob = await DomusBackup.createProjectBackup(state.projects);
      downloadBlob(blob, `DOMUS-Studio-v7-zaloha-${new Date().toISOString().slice(0,10)}.domus.zip`);
      setSaveState('saved');
      toast('ZIP záloha v7 byla vytvořena včetně příloh a kontrolních součtů.');
    } catch (error) {
      setSaveState('error', error.message);
      toast(error.message || 'Zálohu se nepodařilo vytvořit.', 'error');
    }
  }

  function assignImportedIdentity(project, usedIds) {
    const copy = deepClone(project);
    let nextId = DomusCore.safeId(copy.id, 'project');
    while (usedIds.has(nextId)) nextId = uid('project');
    copy.id = nextId;
    copy.name = `${copy.name} (importovaná kopie)`;
    copy.variants = (copy.variants || []).map((variant) => ({ ...variant, id: uid('variant') }));
    copy.activeVariantId = copy.variants[0]?.id || '';
    usedIds.add(nextId);
    return ensureProjectV6(copy);
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const validated = await DomusBackup.readProjectBackup(file);
      const raw = validated.projects || [];
      if (!raw.length) throw new Error('Záloha neobsahuje žádné projekty.');
      const incoming = raw.map((project, index) => ensureProjectV6(DomusCore.secureProject(project, index)));
      const collisions = incoming.filter((project) => state.projects.some((existing) => existing.id === project.id)).length;
      const replace = collisions ? confirm(`Záloha obsahuje ${incoming.length} projektů a ${collisions} shodných identifikátorů.\n\nOK = nahradit shodné projekty\nZrušit = importovat je jako nové kopie`) : true;
      if (!collisions && !confirm(`Importovat ${incoming.length} projektů? Před importem bude vytvořen bod obnovy.`)) return;
      await DomusDB.createSnapshot(state.projects, `Před importem ${file.name}`);
      const map = new Map(state.projects.map((project) => [project.id, project]));
      const usedIds = new Set(map.keys());
      const prepared = incoming.map((project) => (!replace && usedIds.has(project.id) ? assignImportedIdentity(project, usedIds) : project));
      for (const project of prepared) map.set(project.id, project);
      const nextProjects = Array.from(map.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      for (const project of prepared) await DomusDB.put(project, { skipSnapshot: true });
      state.projects = nextProjects;
      state.currentProjectId = null;
      toast(`Import dokončen: ${prepared.length} projektů. Původní stav lze obnovit v Úložišti.`);
      render();
    } catch (error) {
      console.error(error);
      toast(error.message || 'Soubor zálohy se nepodařilo bezpečně načíst.', 'error');
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printAssemblyTable(variant) {
    const labels={floor:'Podlaha',wall:'Stěna',ceiling:'Strop / podhled'};
    return Object.entries(labels).map(([type,label])=>`<h3>${label}</h3><table class="print-table compact"><thead><tr><th>Vrstva</th><th>Materiál</th><th>Tloušťka</th><th>Poznámka</th></tr></thead><tbody>${(variant.assemblies[type]||[]).map((layer)=>`<tr><td><span class="print-swatch" style="background:${escapeHtml(layer.color)}"></span>${escapeHtml(layer.name)}</td><td>${escapeHtml(layer.material||'—')}</td><td>${parseNum(layer.thicknessMm)} mm</td><td>${escapeHtml(layer.note||'—')}</td></tr>`).join('')}</tbody></table>`).join('');
  }

  async function prepareAndPrint(options = {}) {
    const project = currentProject(); const variant = currentVariant(project); if (!project || !variant) return;
    const summary = budgetSummary(variant); const metrics = summary.metrics;
    const photoImage = state.pdfOptions.photo && variant.photo.dataUrl ? await photoReportImage(variant.photo) : '';
    const planCanvas = document.createElement('canvas'); planCanvas.width=1400;planCanvas.height=900;if(state.pdfOptions.plan)drawPlanCanvas(planCanvas,variant);const planImage=state.pdfOptions.plan?planCanvas.toDataURL('image/png'):'';
    const sectionCanvas = document.createElement('canvas'); sectionCanvas.width=1400;sectionCanvas.height=850;if(state.pdfOptions.section)drawSectionCanvas(sectionCanvas,variant);const sectionImage=state.pdfOptions.section?sectionCanvas.toDataURL('image/png'):'';
    const modelCanvas = document.createElement('canvas'); modelCanvas.width=1400;modelCanvas.height=900;if(state.pdfOptions.model)drawModelCanvas(modelCanvas,variant.plan,variant,'material');const modelImage=state.pdfOptions.model?modelCanvas.toDataURL('image/png'):'';
    const comparisonBefore=variant.comparison.beforeDataUrl||variant.photo.dataUrl||'';const comparisonAfter=variant.comparison.afterDataUrl||'';

    printArea.innerHTML = `
      <div class="print-cover">
        <div><div class="print-brand">${escapeHtml(state.branding?.company || 'DOMUS Studio')} · projektová dokumentace</div><h1>${escapeHtml(project.name)}</h1><p class="subtitle">${escapeHtml(project.summary || '')}</p></div>
        <div><div class="print-meta"><div><small>Varianta</small><strong>${escapeHtml(variant.name)}</strong></div><div><small>Stav</small><strong>${escapeHtml(project.status)}</strong></div><div><small>Datum</small><strong>${formatDate(new Date())}</strong></div><div><small>Umístění</small><strong>${escapeHtml(project.location || 'neuvedeno')}</strong></div><div><small>Plocha podlahy</small><strong>${measure(metrics.floorArea)}</strong></div><div><small>Orientační rozpočet</small><strong>${money(summary.total)}</strong></div></div><p class="print-footer">${escapeHtml(state.branding?.footer || 'Vytvořeno v DOMUS Studio v7. Dokument slouží ke komunikaci záměru, nikoli jako autorizovaná projektová dokumentace.')} Revize ${escapeHtml(project.reportRevisionLabel || `R${project.reportRevision || 1}`)}.</p></div>
      </div>
      ${state.pdfOptions.field ? (() => { const session = currentFieldSession(variant); return `<section class="print-section"><h2>Mobilní zaměření</h2><p><strong>${escapeHtml(session?.name || 'Bez zaměření')}</strong> · ${session?.measurements?.length || 0} údajů · ${session?.photos?.length || 0} fotografií · ${session?.scans?.length || 0} prostorových podkladů</p>${session?.location ? `<p>Poloha: ${session.location.latitude.toFixed(5)}, ${session.location.longitude.toFixed(5)} · přesnost přibližně ${Math.round(session.location.accuracy || 0)} m</p>` : ''}${session?.measurements?.length ? `<table class="print-table"><thead><tr><th>Údaj</th><th>Kategorie</th><th>Hodnota</th><th>Ověřeno</th></tr></thead><tbody>${session.measurements.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(String(item.value))} ${escapeHtml(item.unit)}</strong></td><td>${item.verified ? 'ano' : 'ne'}</td></tr>`).join('')}</tbody></table>` : '<p>Bez zaznamenaných rozměrů.</p>'}<p class="print-note">Údaje označené jako neověřené jsou pracovní poznámky z terénu a nesmí být použity k objednávce bez kontroly.</p></section>`; })() : ''}
      ${state.pdfOptions.ai && (variant.ai.analysis || variant.ai.localAnalysis) ? (() => { const analysis = variant.ai.analysis || variant.ai.localAnalysis; return `<section class="print-section"><h2>Asistovaná analýza prostoru</h2><p><strong>Zdroj:</strong> ${variant.ai.analysis ? 'cloudová obrazová AI' : 'kontrola fotografie a detekce linií'} · jistota ${confidenceLabel(analysis.confidence || 0)}</p><p>${escapeHtml(analysis.summary || '')}</p><h3>Identifikované prvky</h3>${renderAnalysisList(analysis.elements?.map((item) => `${item.name}${item.notes ? ` – ${item.notes}` : ''}`), 'Bez identifikovaných prvků.')}<h3>Rizika a nejistoty</h3>${renderAnalysisList(analysis.risks, 'Bez záznamu.')}<h3>Rozměry k fyzickému ověření</h3>${renderAnalysisList(analysis.measurementsToVerify || analysis.recommendations, 'Bez záznamu.')}<p class="print-note">Výsledek obrazové analýzy není měřením ani autorizovaným posouzením. Každý rozměr a konstrukční závěr musí být ověřen na místě.</p></section>`; })() : ''}
      ${photoImage ? `<section class="print-section"><h2>Fotografie skutečného stavu a kóty</h2><img src="${photoImage}" alt="Fotografie s kótami"><p class="print-note">Rozměry odvozené z fotografie jsou orientační. Ručně naměřené údaje mají přednost.</p></section>` : ''}
      ${planImage ? `<section class="print-section"><h2>2D výkres, instalační vrstvy a řezná čára</h2><img src="${planImage}" alt="2D výkres"><p class="print-note">Měřítko pracovní plochy: ${variant.plan.scale} px = 1 m. Zobrazení vrstev odpovídá nastavení aktuální varianty.</p></section>` : ''}
      ${sectionImage ? `<section class="print-section"><h2>${escapeHtml(variant.section.name)} a konstrukční skladby</h2><img src="${sectionImage}" alt="Schematický řez">${printAssemblyTable(variant)}<p class="print-note">Řez je schematický a vychází ze zadané výšky, polohy řezné čáry a tlouštěk vrstev.</p></section>` : ''}
      ${modelImage ? `<section class="print-section"><h2>Materiálový prostorový náhled</h2><img src="${modelImage}" alt="3D náhled"><p class="print-note">Barevné povrchy vycházejí z materiálů přiřazených v knihovně projektu.</p></section>` : ''}
      ${state.pdfOptions.calculations ? `<section class="print-section"><h2>Výpočet rozměrů a ploch</h2><table class="print-table"><tbody><tr><th>Plocha podlahy</th><td>${measure(metrics.floorArea)}</td><th>Plocha stropu</th><td>${measure(metrics.ceilingArea)}</td></tr><tr><th>Obvod</th><td>${measure(metrics.perimeter,'m')}</td><th>Hrubá plocha stěn</th><td>${measure(metrics.grossWallArea)}</td></tr><tr><th>Plocha otvorů</th><td>${measure(metrics.openingsArea)}</td><th>Čistá plocha stěn</th><td>${measure(metrics.wallArea)}</td></tr><tr><th>Skladba podlahy</th><td>${metrics.floorBuildUp} mm</td><th>Skladba stěny</th><td>${metrics.wallBuildUp} mm</td></tr></tbody></table><p class="print-note">${metrics.closed?'Půdorys je uzavřený a plocha byla vypočtena geometricky.':'Půdorys není uzavřený; plocha může být ručně zadaná nebo neúplná.'}</p></section>` : ''}
      ${state.pdfOptions.materials ? `<section class="print-section"><h2>Výrobky, materiály a spotřeba</h2>${variant.materials.length ? `<table class="print-table"><thead><tr><th>Položka</th><th>Výpočet</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th><th>Poznámka</th></tr></thead><tbody>${variant.materials.map((item)=>{const qty=materialQuantity(item,metrics);return `<tr><td><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.manufacturer||item.category||'')}</td><td>${calculationLabel(item.calculation)}${item.calculation!=='manual'?`<br>rezerva ${parseNum(item.wastePercent)} %`:''}</td><td>${planNumber(qty)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(materialTotal(item,metrics))}</strong></td><td>${escapeHtml(item.note||item.url||'—')}</td></tr>`;}).join('')}</tbody><tfoot><tr><th colspan="4">Materiály celkem</th><th>${money(summary.materials)}</th><th></th></tr></tfoot></table>` : '<p>Nejsou evidovány žádné položky.</p>'}</section>` : ''}
      ${state.pdfOptions.budget ? `<section class="print-section"><h2>Orientační rozpočet</h2><table class="print-table"><thead><tr><th>Práce / služba</th><th>Kategorie</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th></tr></thead><tbody>${variant.costs.lines.map((item)=>`<tr><td><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.note||'')}</td><td>${escapeHtml(item.category)}</td><td>${planNumber(item.quantity)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td>${money(parseNum(item.quantity)*parseNum(item.unitPrice))}</td></tr>`).join('')}</tbody></table><div class="print-budget-summary"><span>Materiály <strong>${money(summary.materials)}</strong></span><span>Práce a služby <strong>${money(summary.services)}</strong></span><span>Rezerva ${variant.costs.contingencyPercent} % <strong>${money(summary.contingency)}</strong></span>${variant.costs.vatPercent?`<span>DPH ${variant.costs.vatPercent} % <strong>${money(summary.vat)}</strong></span>`:''}<span class="total">Celkem <strong>${money(summary.total)}</strong></span></div><p class="print-note">Rozpočet je orientační a musí být porovnán s konkrétní nabídkou dodavatele.</p></section>` : ''}
      ${state.pdfOptions.comparison && (comparisonBefore||comparisonAfter) ? `<section class="print-section"><h2>Porovnání před / po</h2><div class="print-comparison"><div><h3>${escapeHtml(variant.comparison.beforeLabel)}</h3>${comparisonBefore?`<img src="${comparisonBefore}" alt="Před">`:'<p>Obrázek není vložen.</p>'}</div><div><h3>${escapeHtml(variant.comparison.afterLabel)}</h3>${comparisonAfter?`<img src="${comparisonAfter}" alt="Po">`:'<p>Obrázek není vložen.</p>'}</div></div>${variant.comparison.notes?`<p>${escapeHtml(variant.comparison.notes)}</p>`:''}</section>` : ''}
      ${state.pdfOptions.audit ? (()=>{const report=buildAuditReport(variant);return `<section class="print-section"><h2>Kontrola projektu</h2><p><strong>Technické skóre: ${report.technicalScore}/100</strong> · ${auditBadge(report.technicalScore)}<br><strong>Po přijetí rizik: ${report.acceptedScore}/100</strong></p>${report.open.length?report.open.map((item)=>`<div class="print-note"><strong>${AUDIT_SEVERITY[item.severity].label}: ${escapeHtml(item.title)}</strong><br>${escapeHtml(item.detail)}</div>`).join(''):'<p>Automatická kontrola nenalezla otevřené problémy.</p>'}<p class="print-note">Automatická kontrola nenahrazuje posouzení odborníka.</p></section>`;})() : ''}
      ${state.pdfOptions.rfq && variant.rfq.scope ? `<section class="print-section"><h2>Zadání pro dodavatele</h2><p>${escapeHtml(variant.rfq.scope).replace(/\n/g,'<br>')}</p><h3>Výjimky z rozsahu</h3><p>${escapeHtml(variant.rfq.exclusions||'Nejsou uvedeny.').replace(/\n/g,'<br>')}</p><h3>Otázky k nabídce</h3>${renderAnalysisList((variant.rfq.questions||'').split(/\n+/).filter(Boolean),'Bez zvláštních otázek.')}</section>` : ''}
      ${state.pdfOptions.diary && variant.diary.entries.length ? `<section class="print-section"><h2>Stavební deník a technický pas</h2><table class="print-table"><thead><tr><th>Datum</th><th>Záznam</th><th>Dodavatel</th><th>Stav</th><th>Skutečný náklad</th></tr></thead><tbody>${[...variant.diary.entries].sort((a,b)=>String(a.date).localeCompare(String(b.date))).map((entry)=>`<tr><td>${escapeHtml(entry.date||'')}</td><td><strong>${escapeHtml(entry.title)}</strong><br>${escapeHtml(entry.note||'')}</td><td>${escapeHtml(entry.contractor||'')}</td><td>${escapeHtml(entry.status||'')}</td><td>${money(entry.actualCost)}</td></tr>`).join('')}</tbody></table>${variant.diary.passport.length?`<h3>Skryté prvky</h3><table class="print-table"><tbody>${variant.diary.passport.map((item)=>`<tr><th>${escapeHtml(item.name)}</th><td>${escapeHtml(item.location||'')} ${escapeHtml(item.depth||'')}<br>${escapeHtml(item.description||'')}</td></tr>`).join('')}</tbody></table>`:''}</section>` : ''}
      ${state.pdfOptions.notes ? `<section class="print-section"><h2>Poznámky, nejasnosti a body k ověření</h2><div class="print-note">${escapeHtml(variant.notes || 'Bez pracovních poznámek.').replace(/\n/g,'<br>')}</div><h2>Technické upozornění</h2><p>Veškeré rozměry, skladby konstrukcí, napojení instalací, únosnost, hydroizolace, elektroinstalace, spotřeby a cenové údaje musí před realizací ověřit příslušný odborník nebo dodavatel na místě.</p></section>` : ''}
    `;
    const html = printArea.innerHTML;
    if (options.skipPrint) return html;
    printArea.setAttribute('aria-hidden','false');
    document.body.classList.add('printing');
    setTimeout(() => window.print(), 300);
    return html;
  }

  async function photoReportImage(photo) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        drawPhotoCanvas(canvas, image, photo);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      image.onerror = () => resolve('');
      image.src = photo.dataUrl;
    });
  }

/* Tauri desktop update bridge. Web/PWA mode remains fully functional. */
  function isTauriDesktop(){return Boolean(window.__TAURI_INTERNALS__||window.__TAURI__);}
  async function checkDesktopUpdates(manual=false){if(!isTauriDesktop()){if(manual)toast('Automatické desktopové aktualizace jsou dostupné v instalované verzi DOMUS Studio.');return;}const status=document.getElementById('desktopUpdateStatus');try{if(status)status.textContent='Kontroluji aktualizace…';const {check}=await import('./vendor/tauri-updater.js'),update=await check();if(!update){if(status)status.textContent='Používáte aktuální verzi.';if(manual)toast('DOMUS Studio je aktuální.');return;}if(status)status.textContent=`Dostupná verze ${update.version}.`;if(confirm(`Je dostupná verze ${update.version}. Stáhnout a nainstalovat aktualizaci?`)){await update.downloadAndInstall();const {relaunch}=await import('./vendor/tauri-process.js');await relaunch();}}catch(error){if(status)status.textContent='Kontrola aktualizací selhala.';if(manual)toast(error.message||'Aktualizaci se nepodařilo ověřit.','error');}}
  function scheduleDesktopUpdateCheck(){if(!isTauriDesktop())return;setTimeout(()=>checkDesktopUpdates(false),3500);}

/* Canvas utility and application start. Source fragment; assembled by scripts/build.mjs. */
  function roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  init();
})();
