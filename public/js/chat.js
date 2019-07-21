let socket = io();
let $messageForm = $('#messageForm');
$('#jet-smoke').hide();

$(document).ready(function() {
    $('#inputMessage').focus();
    let themeColor = window.localStorage.getItem("UI_THEME_COLOR") || 'blue';
    if (themeColor) {
        $(`#${themeColor}`).click();
    }
});


socket.on('newMessage', function(message){
    renderMessage(message);
});
socket.on("renderImage", function(message) {
    renderImage(message);
});
socket.on('updateUserList', function(users) {
    updateUsersList(users);
});
socket.on('connect', function() {
    let params = $.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if (err) {
            return showPopup();
        }
        // render room name
        $('#room-name').text(params.room);
    });
});
socket.on('userJoined', function({PUBLIC_VAPID_KEY}) {
    Cookies.set('PUBLIC_VAPID_KEY', PUBLIC_VAPID_KEY, { expires: 60}); // expire in 2 months
    requestPushNotificationPermissions(PUBLIC_VAPID_KEY);
});
socket.on('newLocationMessage', function(message) {
    renderLocationMessage(message);
});
//-----------------------------End of sockets-----------------------


let notificationsButton = document.getElementById('notifications-button');
notificationsButton.addEventListener("click", function() {
    //TODO: check permissions if notifications icon is clicked
    const PUBLIC_VAPID_KEY = Cookies.get('PUBLIC_VAPID_KEY');
    if (PUBLIC_VAPID_KEY) {
        requestPushNotificationPermissions(PUBLIC_VAPID_KEY);
    }
});

function requestPushNotificationPermissions(PUBLIC_VAPID_KEY) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
        .then(function(registration) {
            if (!registration) {
                console.log("navigator.serviceWorker.getRegistration: no service worker registration found");
                return;
            }

            registration.pushManager.permissionState({userVisibleOnly: true}).then(permission => {
                // Possible values are 'prompt', 'denied', or 'granted'
                if (permission === "prompt") {
                    // request permission only when user has not either denied or accepted notifications 
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                    }).then(function(subscription) {
                        socket.emit('userSubscribed', { subscription });
                    });
                }
    
            }).catch((error) => {
                console.log("pushManager.permissionState: error", error)
            });
        });
    }
}


let locationButton = document.getElementById('send-location');
locationButton.addEventListener("click", function() {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported for your browser!");
    }
    // disable geolocation button
    $('#send-location').attr("disabled", true); 

    navigator.geolocation.getCurrentPosition(function(position) {
        // re-enable geolocation button
        $('#send-location').attr("disabled", false); 
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        //TODO: re-enable geolocation button
        alert("Geolocation is not supported for your browser!");        
    });
});

let previousColor;
$("input[type='radio']").on("click", function(e) {
    e.preventDefault();
    let color = $(this).val();
    $(document.body).removeClass(previousColor);
    $(document.body).addClass(color); 
    
    previousColor = color;
});
//add listener on #selectColor to store color preference in local storage
$('#selectColor label').on("click", function(e) {
    let themeColor = e.target.getAttribute("for");
    window.localStorage.setItem("UI_THEME_COLOR", themeColor);
});

function showPopup() {
    $('.md-trigger').click();
}