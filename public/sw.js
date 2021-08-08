const cacheVersion = "static-v3";

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheVersion).then(function (cache) {
      cache.addAll([
        "/",
        "/index.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/css/help.css",
        "/src/js/material.min.js",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
      ]);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((KeyList) => {
      return Promise.all(
        KeyList.map((key) => {
          if (key != cacheVersion && key != "dynamic") {
              console.log("deleting cache ", key);
              caches.delete(key)
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then((res) => {
        if (res) {
          return res;
        } else {
          return fetch(event.request)
            .then((response) => {
              if (!response.ok) {
                return response;
              }
              return caches.open("dynamic").then((cache) => {
                cache.put(event.request.url, response.clone());
                return response;
              });
            })
            .catch(() => {});
        }
      })
      .catch()
  );
});
