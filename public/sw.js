const CACHE = 'newshall-v4';
const PRECACHE = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png'];

// ── Install: pre-cache app shell ──────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: caching strategies ─────────────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // API calls — always network, never cache
  if (url.pathname.startsWith('/api/')) return;

  // Next.js static chunks — skip SW cache entirely.
  // These are content-hashed so the browser HTTP cache (immutable) handles them.
  // Intercepting them here caused stale JS to persist across deploys.
  if (url.pathname.startsWith('/_next/')) return;

  // Navigation (HTML pages) — network-first, fall back to cached shell
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Everything else (images, fonts, icons) — cache-first
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(request).then(hit => {
        if (hit) return hit;
        return fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => new Response('', { status: 503 }));
      })
    )
  );
});

// ── Push notifications ────────────────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Your Morning Brief is ready';
  const options = {
    body: data.body || 'Open NewsHall to read your personalized brief.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'morning-brief',
    renotify: true,
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
