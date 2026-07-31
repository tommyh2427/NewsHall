// v6: HTML is no longer cached or served from cache. The previous version cached
// the app shell but deliberately skipped /_next/ chunks, so a cached shell could
// never boot — it only ever produced a page whose (content-hashed) chunks 404'd
// after a deploy, so React never hydrated and the app was COMPLETELY DEAD until
// the user cleared their cache. Bumping the version purges those poisoned caches.
// v7: purges caches holding the pre-rebrand icons/manifest, and switches the
// non-hashed static assets off pure cache-first (see the fetch handler) so future
// icon/manifest changes reach existing installs without another version bump.
const CACHE = 'newshall-v7';
const PRECACHE = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

// ── Install: pre-cache static, version-independent assets only ────────────
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

  // Navigation (HTML) — ALWAYS straight to the network, never cached.
  // A cached HTML shell can't work here (its hashed /_next/ chunks aren't cached),
  // and serving a stale one breaks hydration and kills the whole app. Letting the
  // browser handle navigation means a network failure shows the browser's own
  // offline page instead of a silently broken app.
  if (request.mode === 'navigate') return;

  // The manifest drives install metadata (name, icons, theme), so it must not go
  // stale: network-first, falling back to cache offline.
  if (url.pathname === '/manifest.json') {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request).then(hit => hit || new Response('{}', { status: 503 })))
    );
    return;
  }

  // Everything else (images, fonts, icons) — stale-while-revalidate.
  // These filenames aren't content-hashed, so pure cache-first pinned them
  // forever: updated icons never reached anyone who'd already installed. Serving
  // the cached copy instantly while refreshing in the background keeps it fast
  // AND self-updating. Never cache an HTML response here (stale-shell hazard).
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(request).then(hit => {
        const network = fetch(request).then(res => {
          const isHtml = (res.headers.get('content-type') || '').includes('text/html');
          if (res.ok && !isHtml) cache.put(request, res.clone());
          return res;
        }).catch(() => hit || new Response('', { status: 503 }));
        return hit || network;
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
