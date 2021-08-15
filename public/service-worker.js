const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./css/styles.css",
  "./js/index.js",
  "/manifest.json",
  "/icons/icon-512x512.png",
  "/icons/icon-384x384.png",
  "/icons/icon-192x192.png",
  "/icons/icon-152x152.png",
  "/icons/icon-144x144.png",
  "/icons/icon-128x128.png",
  "/icons/icon-96x96.png",
  "/icons/icon-72x72.png",
  "./js/idb.js"
];

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      let cacheKeeplist = keyList.filter(function(key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// cached resource response
self.addEventListener('fetch', function (e) {
    console.log("fetch request : " + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if (request) {
                // availble; respond w/cache
                console.log('cache response: ' + e.request.url);
                return request;
            } else {
                // not available
                console.log('this file is not cached, attempting to fetch :' + e.request.url)
                return fetch(e.request);
            }
        })
    );
});