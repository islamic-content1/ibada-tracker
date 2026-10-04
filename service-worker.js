// رقم الإصدار: غيّريه مع كل تحديث للصفحة عشان الجوال يجيب النسخة الجديدة
const CACHE_VERSION = "ibadah-2026.10.05.1";
// الملفات الموجودة فعلاً بالموقع (ما في index.html، الصفحة اسمها girl.html)
const APP_SHELL = [
  "./girl.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

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
  if (req.method !== "GET") return;

  // الصفحة نفسها: من الإنترنت أولاً، والنسخة المخزّنة بس إذا ما في نت
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req, {cache: "no-store"})
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put("./girl.html", copy));
          return res;
        })
        .catch(() => caches.match("./girl.html"))
    );
    return;
  }

  // باقي الملفات: من الكاش أولاً
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then(cache => cache.put(req, copy));
      return res;
    }))
  );
});
