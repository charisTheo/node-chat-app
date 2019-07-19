if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./../service-worker.js');
  });
}