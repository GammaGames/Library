// Ideally you would set the version with a commit hash
var version = new Date();
cacheName = `library-` + version;

// From http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html#.WyPm5Z9Ki9I
function clientPostMessage(client, message){
    return new Promise(function(resolve, reject){
        var channel = new MessageChannel();

        channel.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }
            else {
                resolve(event.data);
            }
        };
        client.postMessage(message, [channel.port2]);
    });
}

self.addEventListener('install', event => {
    console.log("installing");
    // Forces the new service worker to take over the new one after installing
    if(self.skipWaiting) {
        self.skipWaiting();
    }
    // Cache necessary files
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
            ]).then(() => {
                console.log("installed");
            })
        })
    );
});

self.addEventListener('activate', function(event) {
    // From https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker#removing_outdated_caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return /library/.test(cache) && cacheName != cache;
                }).map(cache => {
                    return caches.delete(cache);
                })
            );
        })
    );
    console.log("old caches removed");

    // Get all the clients, and for each post a message
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            // Post "addAll" to get a list of files to cache
            clientPostMessage(client, "addAll").then(message => {
                console.log("caching");
                // For each file, check if it already exists in the cache
                message.forEach(url => {
                    caches.match(url).then(result => {
                        // If there's nothing in the cache, fetch the file and cache it
                        if(!result) {
                            fetch(url).then(response => {
                                caches.open(cacheName).then(cache => {
                                    cache.put(url, response);
                                });
                            });
                        }
                    })
                });
                console.log("done");
            });
        })
    });
});

self.addEventListener('fetch', function(event) {
    // From https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
    // If it is a library file, use the cache
    if(/lib/.test(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then(result => {
                // Get cache or fetch if doesn't exist
                return result || fetch(event.request).then(response => {
                    // Clone response, cache it, and return it
                    var clone = response.clone();
                    caches.open(cacheName).then(cache => {
                        cache.put(event.request.url, clone)
                    });
                    return response;
                });
            })
        );
    }
    // Else get the live file
    else {
        event.respondWith(
            // Try to fetch, if successful
            fetch(event.request).then(response => {
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
