importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "css/compressed/chat.min.css",
    "revision": "3faf5b3906b7ab0a38d49b1624aae6bc"
  },
  {
    "url": "css/compressed/global.min.css",
    "revision": "93e91671ddea05570fcd36bd852c8461"
  },
  {
    "url": "index.html",
    "revision": "98dc9938529f80b4755e90bd47e59681"
  },
  {
    "url": "chat.html",
    "revision": "55ab7fd516a21fd955fc2e4c6ea3284d"
  },
  {
    "url": "js/chat.js",
    "revision": "08ae60070503fcf3231ce3fe952e8057"
  },
  {
    "url": "js/classie.js",
    "revision": "a9df1cfb76ce492afd9d13f3320272fd"
  },
  {
    "url": "js/compressed/bundle.min.js",
    "revision": "e2b8759be705227e785541cb759d5db9"
  },
  {
    "url": "js/cookie.min.js",
    "revision": "6cd48c176636ab8c478eb0d9434d6f7e"
  },
  {
    "url": "js/cssParser.js",
    "revision": "c095fbe7bcdf49ddd217c27f18c1c97a"
  },
  {
    "url": "js/deparam.js",
    "revision": "4b37d00fa67e22c6c8a6df76dbda39a1"
  },
  {
    "url": "js/index.js",
    "revision": "c7776d62a5e43d161b801bae08c5e193"
  },
  {
    "url": "js/jquery-1.9.1.min.js",
    "revision": "663628f795cb62444143fde1ebdf2b5b"
  },
  {
    "url": "js/jquery-3.2.1.js",
    "revision": "09dd64a64ba840c31a812a3ca25eaeee"
  },
  {
    "url": "js/jquery-ui.js",
    "revision": "d58e88a17267f64f2474295cb6809f49"
  },
  {
    "url": "js/messageFormHandlers.js",
    "revision": "5f9831d61820885c446f56cb3400b015"
  },
  {
    "url": "js/modalEffects.js",
    "revision": "c501996f333d0b2f3187207475b0f4d7"
  },
  {
    "url": "js/mustache.js",
    "revision": "29a2e74483bd2f402bd190db7d7e5bd2"
  },
  {
    "url": "js/rendering.js",
    "revision": "2ca266bfb854ed140d91656fa5333ca7"
  },
  {
    "url": "js/sendSvgAnim.js",
    "revision": "de166f50dcc4dae97b8d9b5a9c76f672"
  },
  {
    "url": "js/stickerSearch.js",
    "revision": "c88fd2f0e7a599530211caa5e444b19f"
  },
  {
    "url": "js/TimelineMax.js",
    "revision": "434fa3882b17ae56a38b9ad5cb78e222"
  },
  {
    "url": "js/TweenMax.js",
    "revision": "baf4488f99b0a984096bb1938b669fd2"
  },
  {
    "url": "js/urlBase64ToUint8Array.js",
    "revision": "f0827d2dbadb9fce1ce51b8013706e3c"
  },
  {
    "url": "img/send.svg",
    "revision": "6df767495e99da4119f6c6871c2dffaa"
  },
  {
    "url": "img/smoke_opt.svg",
    "revision": "c75538907ab5144a46df5b5eacd1f791"
  },
  {
    "url": "img/smoke.svg",
    "revision": "c38508b2cdfe145c3ccefcd120e2a822"
  },
  {
    "url": "img/speech-notification-badge-48.png",
    "revision": "4b2d9b96c21294d225ba25deb67b0da6"
  },
  {
    "url": "img/speech-notification-badge-96.png",
    "revision": "5883d06f76d0969abc7ea5c65b0e5437"
  },
  {
    "url": "manifest.json",
    "revision": "479ae251ec7222439b9cc022df954a20"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "7eef1c9780113c80ce6ba0d76180fc50"
  }
]);

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
  