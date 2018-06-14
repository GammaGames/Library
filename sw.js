// Ideally you would set the version with a commit hash
var version = new Date();
const cacheName = `library-` + version;
self.addEventListener('install', e => {
    console.log("installing");
    // Forces the new service worker to take over the new one after installing
    if(self.skipWaiting) {
        self.skipWaiting();
    }
    // Cache necessary files
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("caching");
            return cache.addAll([
                // Dependencies
                '/lib/semantic.min.css',
                '/css/main.css',
                '/lib/jquery.min.js',
                '/lib/underscore.min.js',
                '/lib/backbone.min.js',
                '/lib/semantic.min.js',
                // App
                '/',
                '/index.html',
                '/js/models.js',
                '/js/collections.js',
                '/js/router.js',
                '/js/view/views.js',
            ]).then(() => {
                console.log("installed");
            })
        })
    );
});

self.addEventListener('activate', function(event) {
    // From https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#removing_outdated_caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cache) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return /library/.test(cache) && cacheName != cache;
                }).map(function(cache) {
                    return caches.delete(cache);
                })
            );
        })
    );
    console.log("old caches removed");
});

self.addEventListener('fetch', function(event) {
    // From https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
    // If it is a library file, use the cache
    if(/lib/.test(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                // Get cache or fetch if doesn't exist
                return response || fetch(event.request);
            })
        );
    }
    // Else get the live file
    else {
        event.respondWith(
            // Try to fetch, if successful
            fetch(event.request).then(function(response) {
                // Clone response, cache it, and return it
                var clone = response.clone();
                caches.open(cacheName).then(cache => {
                    cache.put(event.request.url, clone)
                });
                return response;
            // If an error, check the cache
            }).catch(function() {
                return caches.match(event.request, {cacheName: cacheName});
            })
        );
    }
});
