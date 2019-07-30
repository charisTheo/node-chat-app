'use strict';

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./../service-worker.js', { scope: '/' })
    .then(function(_registration) {
      console.log('Registration succeeded. Scope is ' + _registration.scope);
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  });
} 

// function requestPushPermission(registration) {
//     registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY) // PUBLIC_VAPID_KEY is created by a push manager on the back-end
//     }).then(function(subscription) {
//         fetch('/subscribe', { // custom route for handling and saving the push subscription of the user
//             method: 'POST',
//             body: JSON.stringify(subscription),
//             headers: {
//                 'content-type': 'application/json'
//             }
//         });
//         console.log("user subscribed");
//     });
// }