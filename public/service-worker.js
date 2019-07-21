importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "css/compressed/chat.min.css",
    "revision": "31a6d6b0edf05b1ae22e6f7af6102b5b"
  },
  {
    "url": "css/compressed/global.min.css",
    "revision": "53fc90d8497eeaebef2f28ab1fa73eff"
  },
  {
    "url": "index.html",
    "revision": "98dc9938529f80b4755e90bd47e59681"
  },
  {
    "url": "chat.html",
    "revision": "b98cd2e3e794367aea71fb9397a2ba30"
  },
  {
    "url": "js/chat.js",
    "revision": "0934fd28af9b269e9029b9ff980ce83e"
  },
  {
    "url": "js/classie.js",
    "revision": "a9df1cfb76ce492afd9d13f3320272fd"
  },
  {
    "url": "js/compressed/bundle.min.js",
    "revision": "d5420cfbda7e6f7a5e9c00601ab686b9"
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
    "revision": "4651e3423a04522a1a84f0b20b728db0"
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
    "revision": "1747aedc962d0865d46c442e60b5553c"
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
    "url": "js/util.js",
    "revision": "7755baf42e68b5d08e5d7d517ae3a160"
  },
  {
    "url": "img/add-ios.png",
    "revision": "cb086c9f343cec9fed1b7e248418ef39"
  },
  {
    "url": "img/chrome-web-icon-96.png",
    "revision": "7616f2454346cd2eb7fc4cfdc1688921"
  },
  {
    "url": "img/send.svg",
    "revision": "6df767495e99da4119f6c6871c2dffaa"
  },
  {
    "url": "img/share-ios.png",
    "revision": "901f67a4101f75da336cbf41e17c8cf4"
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
    "revision": "ce1a303cf8c6fdf8dfad494bb4507f08"
  },
  {
    "url": "img/speech-notification-badge-inverted-48.png",
    "revision": "d6c9317472c50676f820b32a6a68d456"
  },
  {
    "url": "img/speech-notification-badge.svg",
    "revision": "37ab23305a1954266e9c04168b14a986"
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
  