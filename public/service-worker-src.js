importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);

} else {
  console.log(`Boo! Workbox didn't load 😬`);
  
}

workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.CacheFirst()
);

self.addEventListener('push', function(event) {
    let options = {};
    if (event.data) {
        const data = event.data.json();
        options = {
            ...data,
            title: "",
            icon: './img/speech-notification-badge-96.png',
            chrome_web_icon: './img/speech-notification-badge-96.png',
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
  