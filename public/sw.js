// This is a placeholder service worker that will be replaced by next-pwa during build
// You don't need to modify this file, as next-pwa will generate the actual service worker

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
