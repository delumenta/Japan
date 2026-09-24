const CACHE_NAME = "travel-shell-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./login.html",
  "./manifest.webmanifest",
  "./pwa.js",
  "./footer.js",
  "./supabase.js",
  "./countries.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if(event.data === "SKIP_WAITING"){
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if(request.method !== "GET"){
    return;
  }

  const url = new URL(request.url);

  if(url.origin !== self.location.origin){
    return;
  }

  event.respondWith(networkFirst(request));
});

async function networkFirst(request){
  const cache = await caches.open(CACHE_NAME);

  try{
    const response = await fetch(request);

    if(response && response.ok){
      cache.put(request, response.clone());
    }

    return response;
  }
  catch(error){
    const cached = await cache.match(request);

    if(cached){
      return cached;
    }

    if(request.mode === "navigate"){
      return (
        await cache.match("./index.html")
        ||
        Response.error()
      );
    }

    return Response.error();
  }
}
