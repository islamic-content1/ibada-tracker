// كاش بسيط للصفحات: الشبكة أولاً، والكاش احتياط لما ما في إنترنت
const CACHE_VERSION = "ibadah-app-2026.10.29.4";

self.addEventListener("install", event => { self.skipWaiting(); });

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_VERSION ? caches.delete(key) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  // طلبات الداتابيس ما بنلمسها أبداً
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  event.respondWith(
    fetch(req, {cache: "no-store"})
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req, {ignoreSearch: true}))
  );
});
