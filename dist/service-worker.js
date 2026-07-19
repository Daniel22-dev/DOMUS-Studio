const CACHE = 'domus-studio-v7-0-0';
const CORE = [
  './', './index.html', './styles.css', './domus-core.js', './db.js', './domus-audit.js',
  './domus-backup.js', './domus-premium.js', './domus-performance.js', './domus-diagnostics.js', './app.js', './manifest.webmanifest', './icon.svg', './icon-192.png',
  './icon-512.png', './icon-maskable-512.png', './workers/project-metrics-worker.js', './vendor/three.module.min.js', './vendor/OrbitControls.js', './vendor/GLTFExporter.js', './vendor/tauri-core.js', './vendor/tauri-updater.js', './vendor/tauri-process.js', './vendor/external/tslib/tslib.es6.js'
];
const MAX_RUNTIME_ITEMS = 40;

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  while (keys.length > maxItems) await cache.delete(keys.shift());
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response?.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
      await trimCache(CACHE, CORE.length + MAX_RUNTIME_ITEMS);
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match('./index.html'));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const update = fetch(request).then(async (response) => {
    if (response?.ok && response.type !== 'opaque') {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
      await trimCache(CACHE, CORE.length + MAX_RUNTIME_ITEMS);
    }
    return response;
  }).catch(() => null);
  return cached || update || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (event.request.mode === 'navigate' || /\/index\.html$/.test(url.pathname)) event.respondWith(networkFirst(event.request));
  else event.respondWith(staleWhileRevalidate(event.request));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
