const CACHE_NAME = 'ficha-coletiva-v2';
const urlsToCache = [
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json'
];

// Instala e armazena os recursos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Estratégia: Cache First, depois rede (para uso offline do formulário)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        // Não armazene respostas da Cloud Function ou Apps Script, pois são dinâmicas e falham offline mesmo assim
        return response;
      });
    })
  );
});