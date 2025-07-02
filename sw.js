self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('financas-v1').then(function (cache) {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './app.js',
        './manifest.json',
        // se adicionar 'icon.png', coloque aqui também: './icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
