const CACHE_NAME = "portfolio-v2"; // Binago ang version para ma-refresh
const ASSETS = [
  "./",
  "./index.html",
  "./data.json",
  "./weather.html",
  "./manifest.json",
  "./css/style.css",
  "./js/script.js",
  "./css/apps/about.css",
  "./js/apps/about.js",
  "./css/apps/calc.css",
  "./js/apps/calc.js",
  "./css/apps/contact.css",
  "./js/apps/contact.js",
  "./css/apps/gallery.css",
  "./js/apps/gallery.js",
  "./css/apps/game.css",
  "./js/apps/game.js",
  "./css/apps/notes.css",
  "./js/apps/notes.js",
  "./css/apps/projects.css",
  "./js/apps/projects.js",
  "./css/apps/skills.css",
  "./js/apps/skills.js",
  "./css/apps/weather.css",
  "./js/apps/weather.js",
  "./css/apps/dashboard.css",
  "./js/apps/dashboard.js",
  "./css/apps/music.css",
  "./js/apps/music.js",
  "./css/apps/settings.css",
  "./js/apps/settings.js",
  // Images base sa data.json
  "./images/python1.png",
  "./images/html1.png",
  "./images/css1.png",
  "./images/javascript1.png",
  "./images/csharp1.png",
  "./images/myprofile.jpg",
  // Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install — i-cache lahat
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      .catch((err) => console.warn("Cache error:", err))
  );
  self.skipWaiting();
});

// Activate — linisin ang lumang cache
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first, tapos network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => caches.match("./index.html"));
    })
  );
});
