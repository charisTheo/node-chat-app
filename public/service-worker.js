importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.CacheFirst()
);


// TODO:
// self.addEventListener('push', function(event) {
//     let options = {};
//     if (event.data) {
//         const data = event.data.json();
//         options = {
//             ...data,
//             title: "",
//             icon: '/favicon/-96.png',
//             chrome_web_icon: '/favicon/-96.png',
//             badge: '/favicon/-48x48.png',
//             chrome_web_badge: '/favicon/-48x48.png',
//             renotify: true
//         }
//         self.registration.showNotification(data.title, options);
//     }
// });

// TODO:
// self.addEventListener('notificationclick', function(event) {
//     event.notification.close();
//     const data = event.notification.data;

//     if (!event.action) {
//         // Was a normal notification click
       
//         if (event.notification.tag == "new_notifications") {  // Ex: check notification tag name 
//             event.waitUntil(clients.openWindow("/notification/showAll"));  // and redirect 
//         }
//         return;
//     }

//     switch (event.action) {
//         case 'show-all-notifications':
//             event.waitUntil(clients.openWindow("/notification/showAll"));
//         break;
//         case 'yes':
//             event.waitUntil(clients.openWindow(/userClickedYes));
//         break;
//         case 'no':
//             event.waitUntil(clients.openWindow('/userClickedNo'));
//         break;
//         case 'search':
//             event.waitUntil(clients.openWindow("/search"));
//         break;
//         default:
//             console.log(`Unknown action clicked: '${event.action}'`);
//         break;
//     }
//   });
  