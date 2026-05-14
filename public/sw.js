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
