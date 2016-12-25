/*ServiceWorker example for caching response of below URLS*/
const PRECACHE = 'precache-v2';

const RUNTIME = 'runtime';

const PRECACHE_URLS = [
  'images/sw.png',
  'style/tyles.css'
];

self.addEventListener('install', event => function(event) {
  	console.log("ServiceWorker Install Event");
  	event.waitUntill(	
  		caches.open(PRECACHE)
  			  .then(caches => caches.addAll(PRECACHE_URLS))
  			  .then(self.skipWaiting())
  		);
});


self.addEventListener('activate', event => {
   	console.log("ServiceWorker activate event");
   	const currentCaches = [PRECACHE,RUNTIME];
	event.waitUntil(
	    caches.keys().then(cacheNames => {	    	
	      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
	    }).then(cachesToDelete => {
	      return Promise.all(cachesToDelete.map(cacheToDelete => {
	        return caches.delete(cacheToDelete);
	      }));
	    }).then(() => self.clients.claim())
	  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  console.log("ServiceWorker fetch event",event.request.PRECACHE_URLS);
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
        //	console.log("cachedResponse",cachedResponse);
          return cachedResponse;
        }
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});