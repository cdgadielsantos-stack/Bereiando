// Service Worker for Bereiando
// Precaches core assets for offline functionality

const CACHE_NAME = 'bereiando-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/catalog.html',
  '/pages/authors.html',
  '/pages/articles.html',
  '/pages/book.html',
  '/pages/author.html',
  '/pages/article.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/search.js',
  '/assets/js/data-loader.js',
  '/assets/js/components.js',
  '/data/livros.json',
  '/data/autores.json',
  '/data/categorias.json',
  '/data/artigos.json',
  '/data/recomendados.json',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a one-time use
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, show offline fallback
        // For simplicity, we'll just return an error response
        // In a production app, you might want to show a custom offline page
        return new Response('Offline fallback content would go here', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
  );
});