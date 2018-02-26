---
layout: null
---


var urlsToCache = [];

var CACHE_NAME = 'cache-v2';

// Cache assets
{% for asset in site.static_files %}
  {% if asset.path contains '/assets/img' or asset.path contains '/assets/css' or asset.path contains 'assets/js' %}
    urlsToCache.push("{{ asset.path }}")
    {% endif %}
{% endfor %}

// Cache font 

urlsToCache.push('https://fonts.googleapis.com/css?family=PT+Sans:400,400italic,700|Abril+Fatface');

// Cache posts
{% for post in site.posts %}
  urlsToCache.push("{{ post.url }}")
{% endfor %}

// Cache pages
{% for page in site.html_pages %}
  urlsToCache.push("{{ page.url }}")
{% endfor %}


self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      }).catch(function() {
        // Fallback to the offline page if not available in the cache.
        return caches.match('/offline.html');
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function() {
        // Fallback to the offline page if not available in the cache.
        return caches.match('/offline.html');
      })
    );
  });