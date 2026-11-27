/* Sahtekâr service worker: tek telefon modu internetsiz çalışsın.
 * Uygulama dosyaları önce ağdan istenir (güncel sürüm gelsin), ağ yoksa önbellekten verilir.
 * Yazı tipleri ilk kullanımda önbelleğe alınır. Supabase'e giden istekler hiç önbelleğe alınmaz. */
const V = 'sahtekar-v2';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'words.js', 'online.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); return res;
    })));
  }
});
