// الخدمة القديمة: بنمسح الكاش وبنلغيها، والصفحات الجديدة إلها خدمتها الخاصة
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith('ibadah-app-')).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
  );
});
