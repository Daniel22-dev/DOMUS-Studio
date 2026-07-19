/* DOMUS Studio IndexedDB repository v6: projects, binary assets, snapshots and trash */
const DomusDB = (() => {
  'use strict';

  const DB_NAME = 'domus-studio';
  const LEGACY_DB_NAME = 'domus-studio-v1';
  const VERSION = 3;
  const STORES = Object.freeze({ projects: 'projects', assets: 'assets', snapshots: 'snapshots', trash: 'trash', meta: 'meta' });
  const ASSET_PREFIX = 'asset://';
  let legacyMigrationChecked = false;

  function requestPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Operace úložiště selhala.'));
    });
  }

  function openNamed(name, version) {
    return new Promise((resolve, reject) => {
      const request = version ? indexedDB.open(name, version) : indexedDB.open(name);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORES.projects)) db.createObjectStore(STORES.projects, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.assets)) db.createObjectStore(STORES.assets, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.snapshots)) db.createObjectStore(STORES.snapshots, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.trash)) db.createObjectStore(STORES.trash, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.meta)) db.createObjectStore(STORES.meta, { keyPath: 'key' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Lokální databázi nelze otevřít.'));
    });
  }

  async function open() {
    const db = await openNamed(DB_NAME, VERSION);
    if (!legacyMigrationChecked) {
      legacyMigrationChecked = true;
      try { await migrateLegacy(db); } catch (error) { console.warn('Migrace původní databáze:', error); }
    }
    return db;
  }

  async function migrateLegacy(targetDb) {
    const marker = await readFromDb(targetDb, STORES.meta, 'legacy-migrated');
    if (marker) return;
    let legacy;
    try { legacy = await openNamed(LEGACY_DB_NAME); } catch { return writeToDb(targetDb, STORES.meta, { key: 'legacy-migrated', at: new Date().toISOString(), count: 0 }); }
    if (!legacy.objectStoreNames.contains('projects')) { legacy.close(); return; }
    const projects = await new Promise((resolve, reject) => {
      const tx = legacy.transaction('projects', 'readonly');
      const request = tx.objectStore('projects').getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    legacy.close();
    for (const project of projects) await put(project, { skipSnapshot: true });
    await writeToDb(targetDb, STORES.meta, { key: 'legacy-migrated', at: new Date().toISOString(), count: projects.length });
  }

  function transaction(db, stores, mode, callback) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      let result;
      try { result = callback(tx); } catch (error) { tx.abort(); reject(error); return; }
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error('Transakce úložiště selhala.'));
      tx.onabort = () => reject(tx.error || new Error('Transakce úložiště byla zrušena.'));
    });
  }

  async function readFromDb(db, storeName, key) {
    const tx = db.transaction(storeName, 'readonly');
    return requestPromise(tx.objectStore(storeName).get(key));
  }

  async function writeToDb(db, storeName, value) {
    await transaction(db, [storeName], 'readwrite', (tx) => tx.objectStore(storeName).put(value));
  }

  function dataUrlToBlob(dataUrl) {
    const [meta, payload = ''] = String(dataUrl).split(',', 2);
    const mime = (/^data:([^;]+)/i.exec(meta)?.[1] || 'application/octet-stream').toLowerCase();
    const binary = /;base64/i.test(meta) ? atob(payload.replace(/\s/g, '')) : decodeURIComponent(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mime });
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Soubor nelze načíst.'));
      reader.readAsDataURL(blob);
    });
  }

  function safePathPart(value) {
    return String(value).replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80) || 'item';
  }

  async function externalize(value, projectId, path = [], assets = []) {
    if (Array.isArray(value)) {
      const result = [];
      for (let index = 0; index < value.length; index += 1) result.push(await externalize(value[index], projectId, [...path, index], assets));
      return result;
    }
    if (!value || typeof value !== 'object') return value;
    const result = {};
    for (const [key, child] of Object.entries(value)) {
      if (/dataUrl$/i.test(key) && typeof child === 'string' && child.startsWith('data:')) {
        const id = `${safePathPart(projectId)}:${[...path, key].map(safePathPart).join(':')}`.slice(0, 900);
        const blob = dataUrlToBlob(child);
        assets.push({ id, projectId, blob, type: blob.type, size: blob.size, updatedAt: new Date().toISOString() });
        result[key] = `${ASSET_PREFIX}${id}`;
      } else result[key] = await externalize(child, projectId, [...path, key], assets);
    }
    return result;
  }

  async function hydrate(value, assetMap) {
    if (Array.isArray(value)) return Promise.all(value.map((item) => hydrate(item, assetMap)));
    if (!value || typeof value !== 'object') {
      if (typeof value === 'string' && value.startsWith(ASSET_PREFIX)) {
        const asset = assetMap.get(value.slice(ASSET_PREFIX.length));
        return asset?.blob ? blobToDataUrl(asset.blob) : null;
      }
      return value;
    }
    const result = {};
    for (const [key, child] of Object.entries(value)) result[key] = await hydrate(child, assetMap);
    return result;
  }

  async function getAssets(db) {
    const tx = db.transaction(STORES.assets, 'readonly');
    const assets = await requestPromise(tx.objectStore(STORES.assets).getAll());
    return new Map((assets || []).map((asset) => [asset.id, asset]));
  }

  async function assetIdsForNamespace(db, namespace) {
    const tx = db.transaction(STORES.assets, 'readonly');
    const assets = await requestPromise(tx.objectStore(STORES.assets).getAll());
    return (assets || []).filter((asset) => asset.projectId === namespace).map((asset) => asset.id);
  }

  async function deleteAssetNamespace(namespace) {
    const db = await open();
    try {
      const ids = await assetIdsForNamespace(db, namespace);
      if (ids.length) await transaction(db, [STORES.assets], 'readwrite', (tx) => ids.forEach((id) => tx.objectStore(STORES.assets).delete(id)));
    } finally { db.close(); }
  }

  async function put(project, options = {}) {
    const secure = window.DomusCore?.secureProject ? window.DomusCore.secureProject(project) : structuredClone(project);
    const assets = [];
    const stored = await externalize(secure, secure.id, [], assets);
    const db = await open();
    try {
      const staleIds = await assetIdsForNamespace(db, secure.id);
      await transaction(db, [STORES.projects, STORES.assets], 'readwrite', (tx) => {
        tx.objectStore(STORES.projects).put(stored);
        const assetStore = tx.objectStore(STORES.assets);
        staleIds.forEach((id) => assetStore.delete(id));
        assets.forEach((asset) => assetStore.put(asset));
      });
      return secure.id;
    } finally { db.close(); }
  }

  async function getAll() {
    const db = await open();
    try {
      const tx = db.transaction(STORES.projects, 'readonly');
      const projects = await requestPromise(tx.objectStore(STORES.projects).getAll());
      const assetMap = await getAssets(db);
      const hydrated = [];
      for (const project of projects || []) hydrated.push(await hydrate(project, assetMap));
      return hydrated;
    } finally { db.close(); }
  }

  async function get(id) {
    const db = await open();
    try {
      const project = await readFromDb(db, STORES.projects, id);
      if (!project) return null;
      return hydrate(project, await getAssets(db));
    } finally { db.close(); }
  }

  async function removeProjectAssets(tx, projectId) {
    const store = tx.objectStore(STORES.assets);
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (cursor.value?.projectId === projectId) cursor.delete();
      cursor.continue();
    };
  }

  async function deleteProject(id) {
    const project = await get(id);
    if (!project) return;
    const deletedAt = new Date().toISOString();
    const trashId = `trash-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const namespace = `trash:${trashId}:${project.id}`;
    const assets = [];
    const stored = await externalize(project, namespace, [], assets);
    const db = await open();
    try {
      const activeIds = await assetIdsForNamespace(db, project.id);
      await transaction(db, [STORES.projects, STORES.assets, STORES.trash], 'readwrite', (tx) => {
        tx.objectStore(STORES.trash).put({ id: trashId, projectId: id, deletedAt, assetNamespace: namespace, project: stored });
        tx.objectStore(STORES.projects).delete(id);
        const assetStore = tx.objectStore(STORES.assets);
        activeIds.forEach((assetId) => assetStore.delete(assetId));
        assets.forEach((asset) => assetStore.put(asset));
      });
      return trashId;
    } finally { db.close(); }
  }

  async function listTrash() {
    const db = await open();
    try {
      const tx = db.transaction(STORES.trash, 'readonly');
      const entries = await requestPromise(tx.objectStore(STORES.trash).getAll());
      const assets = await getAssets(db);
      const result = [];
      for (const entry of entries || []) result.push({ ...entry, project: await hydrate(entry.project, assets) });
      return result.sort((a, b) => String(b.deletedAt).localeCompare(String(a.deletedAt)));
    } finally { db.close(); }
  }

  async function restoreTrash(id) {
    const db = await open();
    let entry;
    let project;
    try {
      entry = await readFromDb(db, STORES.trash, id);
      if (!entry) throw new Error('Projekt v koši nebyl nalezen.');
      project = await hydrate(entry.project, await getAssets(db));
    } finally { db.close(); }
    await put(project, { skipSnapshot: true });
    const db2 = await open();
    try { await transaction(db2, [STORES.trash], 'readwrite', (tx) => tx.objectStore(STORES.trash).delete(id)); }
    finally { db2.close(); }
    if (entry.assetNamespace) await deleteAssetNamespace(entry.assetNamespace);
  }

  async function emptyTrash() {
    const db = await open();
    let entries = [];
    try {
      const tx = db.transaction(STORES.trash, 'readonly');
      entries = await requestPromise(tx.objectStore(STORES.trash).getAll());
      await transaction(db, [STORES.trash], 'readwrite', (writeTx) => writeTx.objectStore(STORES.trash).clear());
    } finally { db.close(); }
    for (const entry of entries || []) if (entry.assetNamespace) await deleteAssetNamespace(entry.assetNamespace);
  }

  async function createSnapshot(projects, label = 'Ruční bod obnovy') {
    const safeProjects = [];
    for (let index = 0; index < projects.length; index += 1) safeProjects.push(window.DomusCore?.secureProject ? window.DomusCore.secureProject(projects[index], index) : structuredClone(projects[index]));
    const id = `snapshot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const namespace = `snapshot:${id}`;
    const storedProjects = [];
    const assets = [];
    for (const project of safeProjects) storedProjects.push(await externalize(project, namespace, [project.id], assets));
    const snapshot = { id, assetNamespace: namespace, createdAt: new Date().toISOString(), label: String(label).slice(0, 160), projects: storedProjects };
    const db = await open();
    try {
      await transaction(db, [STORES.snapshots, STORES.assets], 'readwrite', (tx) => {
        tx.objectStore(STORES.snapshots).put(snapshot);
        const assetStore = tx.objectStore(STORES.assets);
        assets.forEach((asset) => assetStore.put(asset));
      });
    } finally { db.close(); }
    await pruneSnapshots(12);
    return snapshot.id;
  }


  async function listSnapshots() {
    const db = await open();
    try {
      const tx = db.transaction(STORES.snapshots, 'readonly');
      const entries = await requestPromise(tx.objectStore(STORES.snapshots).getAll());
      return (entries || []).map(({ id, createdAt, label, projects }) => ({ id, createdAt, label, projectCount: projects?.length || 0 })).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    } finally { db.close(); }
  }

  async function restoreSnapshot(id) {
    const db = await open();
    try {
      const snapshot = await readFromDb(db, STORES.snapshots, id);
      if (!snapshot) throw new Error('Bod obnovy nebyl nalezen.');
      const assets = await getAssets(db);
      const result = [];
      for (const project of snapshot.projects || []) result.push(await hydrate(project, assets));
      return result;
    } finally { db.close(); }
  }

  async function pruneSnapshots(limit) {
    const db = await open();
    let remove = [];
    try {
      const tx = db.transaction(STORES.snapshots, 'readonly');
      const entries = await requestPromise(tx.objectStore(STORES.snapshots).getAll());
      remove = (entries || []).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(limit);
      if (remove.length) await transaction(db, [STORES.snapshots], 'readwrite', (writeTx) => remove.forEach((entry) => writeTx.objectStore(STORES.snapshots).delete(entry.id)));
    } finally { db.close(); }
    for (const entry of remove) if (entry.assetNamespace) await deleteAssetNamespace(entry.assetNamespace);
  }

  async function replaceProjects(projects) {
    const preparedProjects = [];
    const preparedAssets = [];
    for (const project of projects || []) {
      const safe = window.DomusCore?.secureProject ? window.DomusCore.secureProject(project) : structuredClone(project);
      preparedProjects.push(await externalize(safe, safe.id, [], preparedAssets));
    }
    const db = await open();
    try {
      const tx = db.transaction(STORES.assets, 'readonly');
      const assets = await requestPromise(tx.objectStore(STORES.assets).getAll());
      const activeIds = (assets || []).filter((asset) => !String(asset.projectId || '').startsWith('snapshot:') && !String(asset.projectId || '').startsWith('trash:')).map((asset) => asset.id);
      await transaction(db, [STORES.projects, STORES.assets], 'readwrite', (writeTx) => {
        const projectStore = writeTx.objectStore(STORES.projects);
        const assetStore = writeTx.objectStore(STORES.assets);
        projectStore.clear();
        activeIds.forEach((id) => assetStore.delete(id));
        preparedProjects.forEach((project) => projectStore.put(project));
        preparedAssets.forEach((asset) => assetStore.put(asset));
      });
    } finally { db.close(); }
  }

  async function clear() {
    const db = await open();
    try {
      await transaction(db, Object.values(STORES), 'readwrite', (tx) => Object.values(STORES).forEach((store) => tx.objectStore(store).clear()));
    } finally { db.close(); }
  }

  async function estimate() {
    const browser = navigator.storage?.estimate ? await navigator.storage.estimate() : {};
    const projects = await getAll();
    const approximateProjectBytes = new TextEncoder().encode(JSON.stringify(projects)).length;
    return { usage: browser.usage || approximateProjectBytes, quota: browser.quota || 0, projectBytes: approximateProjectBytes, persistent: navigator.storage?.persisted ? await navigator.storage.persisted() : false };
  }

  async function requestPersistence() {
    return navigator.storage?.persist ? navigator.storage.persist() : false;
  }

  async function diagnosticRoundTrip() {
    const id = `__domus-diagnostic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const project = {
      id, name: 'Dočasný diagnostický projekt', schemaVersion: 7, activeVariantId: `${id}-variant`,
      variants: [{ id: `${id}-variant`, name: 'Diagnostika', photo: { dataUrl: pixel }, plan: { scale: 100, walls: [], objects: [] } }],
    };
    let assetBytes = 0;
    try {
      await put(project, { skipSnapshot: true });
      const loaded = await get(id);
      if (!loaded || loaded.id !== id || !String(loaded.variants?.[0]?.photo?.dataUrl || '').startsWith('data:image/png;base64,')) throw new Error('Dočasný projekt nebo binární příloha se nenačetly správně.');
      const db = await open();
      try {
        const ids = await assetIdsForNamespace(db, id);
        const assetMap = await getAssets(db);
        assetBytes = ids.reduce((sum, assetId) => sum + Number(assetMap.get(assetId)?.size || 0), 0);
      } finally { db.close(); }
      return { ok: true, assetBytes };
    } finally {
      const db = await open();
      try {
        const ids = await assetIdsForNamespace(db, id);
        await transaction(db, [STORES.projects, STORES.assets], 'readwrite', (tx) => {
          tx.objectStore(STORES.projects).delete(id);
          ids.forEach((assetId) => tx.objectStore(STORES.assets).delete(assetId));
        });
      } finally { db.close(); }
    }
  }

  return Object.freeze({
    getAll, get, put, delete: deleteProject, replaceProjects, clear,
    listTrash, restoreTrash, emptyTrash,
    createSnapshot, listSnapshots, restoreSnapshot,
    estimate, requestPersistence, diagnosticRoundTrip,
  });
})();
