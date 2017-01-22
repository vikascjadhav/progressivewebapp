var fileCacheName = 'fileCahce-v1';
var dataCacheName = 'dataCache-v1';
var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';
var filesToBeCached = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/localforage-1.4.0.js',
  '/styles/ud811.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener('install',function(event){
	
	console.log('Service Worker event :- Install')
	event.waitUntil(caches.open(fileCacheName).then(function(cache){
		return cache.addAll(filesToBeCached);
	}));

});


self.addEventListener('activate',function(event){
	console.log('Service Worker event :- activate')
	event.waitUntil(caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key){
					if(key !== fileCacheName &&  key !== dataCacheName) {
						return caches.delete(key);
					}
			}))
	}));

});

self.addEventListener('fetch',function(event){
	console.log('Service Worker event :- fetch');
	if(event.request.url.startsWith(weatherAPIUrlBase)) {
		event.respondWith(
			fetch(event.request).then(function(response) {
				return caches.open(dataCacheName).then(function(cache) {
						cache.put(event.request.url,response.clone());
						return response;
				});
			})
		);		
	} else {
		event.respondWith(
			caches.match(event.request).then(function(resp) {
				return resp || fetch(event.request);
			}));

	}

});