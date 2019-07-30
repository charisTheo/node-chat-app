importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// ex: "30-07-2019-11-19-52"
const version = new Date().toLocaleString().replace(/\/|,\s|:/g, '-'); 

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  configureWorkbox();

} else {
  console.log(`Boo! Workbox didn't load 😬`);
  
}

function configureWorkbox() {
  workbox.core.setCacheNameDetails({
    prefix: 'chat-app',
    suffix: version,
    precache: 'precache-cache',
    runtime: 'runtime-cache'
  });

  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.StaleWhileRevalidate()
  );
  
  workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate()
  );
  
  workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.StaleWhileRevalidate()
  );
}

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => !key.endsWith(version)))
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
});

self.addEventListener('push', function(event) {
    let options = {};
    if (event.data) {
        const data = event.data.json();
        options = {
            ...data,
            title: "",
            icon: './img/chrome-web-icon-96.png',
            chrome_web_icon: './img/chrome-web-icon-96.png',
            badge: './img/speech-notification-badge-48.png',
            chrome_web_badge: './img/speech-notification-badge-48.png',
            renotify: true
        }
        self.registration.showNotification(data.title, options);
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const data = event.notification.data;

    if (!event.action) {
        // Was a normal notification click
        const room = data.room;
        const username = data.username;
        const navigateTo = room && username ? `/chat.html?username=${username}&room=${room}` : '/index.html' ;

        event.waitUntil(clients.openWindow(navigateTo));
        return;
    }

    switch (event.action) {
        case 'openRoom':
            const room = data.room;
            const username = data.username;

            event.waitUntil(clients.openWindow(`/chat.html?username=${username}&room=${room}`));

        break;
        default:
            console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });
  