/* Bootstrap, DOM references, application state and shared constants. Source fragment; assembled by scripts/build.mjs. */
/* DOMUS Studio v7.3 – hardened storage, verified planning, supplier RFQ and construction passport */
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
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmForm = document.getElementById('confirmForm');
  const confirmDialogEyebrow = document.getElementById('confirmDialogEyebrow');
  const confirmDialogTitle = document.getElementById('confirmDialogTitle');
  const confirmDialogMessage = document.getElementById('confirmDialogMessage');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  const confirmAcceptBtn = document.getElementById('confirmAcceptBtn');
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
    let serviceWorkerHasController = Boolean(navigator.serviceWorker.controller);
    let serviceWorkerReloading = false;
    let serviceWorkerUpdateRequested = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      const shouldReload = serviceWorkerHasController || serviceWorkerUpdateRequested;
      serviceWorkerHasController = true;
      if (shouldReload && !serviceWorkerReloading) {
        serviceWorkerReloading = true;
        location.reload();
      }
    });
    updateBtn?.addEventListener('click', async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        serviceWorkerUpdateRequested = true;
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        location.reload();
      }
    });
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
    aiStatus: { checked: false, configured: false, model: '', imageModel: '', message: 'Stav připojení nebyl ověřen.' },
    aiBusy: false,
    aiImageBusy: false,
    aiChatBusy: false,
    aiAssistantConsent: false,
    aiWorkspaceMode: safeStorageGet('domusAiWorkspaceMode') || 'vision',
    manualSearch: '',
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
