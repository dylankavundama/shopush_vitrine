const CACHE_NAME = 'shopushindi-cache-v3';

// Chemins relatifs au scope du SW (/shop/ en prod, / en local)
const SCOPE = self.registration.scope;

const PRECACHE_PATHS = [
  'index.html',
  'favicon.png',
  'logo.png',
  'manifest.json'
];

function toScopedUrl(path) {
  return new URL(path, SCOPE).href;
}

function scopedPathname(path) {
  return new URL(path, SCOPE).pathname;
}

async function fetchFollow(url) {
  return fetch(url, {
    redirect: 'follow',
    credentials: 'same-origin',
    cache: 'no-cache'
  });
}

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    PRECACHE_PATHS.map(async (path) => {
      const url = toScopedUrl(path);
      try {
        const response = await fetchFollow(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (err) {
        console.warn('[Service Worker] Precache échoué:', url, err);
      }
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    precacheAssets().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[Service Worker] Suppression ancien cache', key);
            return caches.delete(key);
          })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Ne pas intercepter le hors-scope / cross-origin
  if (!requestUrl.href.startsWith(SCOPE)) return;

  // Navigations : network-first + redirect:follow
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetchFollow(requestUrl.href);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(toScopedUrl('index.html'), networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const cached = await caches.match(toScopedUrl('index.html'));
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  if (
    requestUrl.pathname.includes('/wp-json/') ||
    requestUrl.pathname.includes('/api/')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  const assetsPrefix = scopedPathname('assets/');
  if (requestUrl.pathname.startsWith(assetsPrefix)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetchFollow(requestUrl.href);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(requestUrl.href, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return (await caches.match(requestUrl.href)) || Response.error();
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      const networkPromise = fetchFollow(requestUrl.href)
        .then(async (networkResponse) => {
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(requestUrl.href, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        networkPromise.catch(() => {});
        return cachedResponse;
      }

      const networkResponse = await networkPromise;
      if (networkResponse) return networkResponse;

      if (event.request.headers.get('accept')?.includes('text/html')) {
        return (await caches.match(toScopedUrl('index.html'))) || Response.error();
      }

      return Response.error();
    })()
  );
});
