let socket = io();
let username = window.localStorage.getItem("username") || "";
let $messageForm = $('#messageForm');
$('#jet-smoke').hide();

$(document).ready(function(){
    $('#inputMessage').focus();
    let colorPref = window.localStorage.getItem("color-preference") || undefined;
    if (colorPref) {
        $(`#${colorPref}`).click();
    }
    // render user's username
    if (username) addNewUserName(username);
});

socket.on('newMessage', function(message){
    renderMessage(message);
});
socket.on("renderImage", function(message) {
    renderImage(message);
});
socket.on("inactiveUser", function(message) {
    // console.log(message);
    $(`p.${message.user}`).remove();
});
socket.on('connect', function() {
    let params = $.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if (err) {
            showPopup();
        } else {
            addNewUserName(params.username);
        }
    });
});
socket.on('disconnect', function() {
    socket.emit('createMessage', {
        from: "Server",
        text: `${username} has left the chat.` 
    });
    socket.emit("userDisconnected", {user: username});
});
socket.on('newLocationMessage', function(message) {
    renderLocationMessage(message);
});
//-----------------------------End of sockets-----------------------



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

// $('#join-form').on("submit", function(e){
//     e.preventDefault();
//     const newUserName = $('#username').val();
//     const newRoomName = $('#room').val();

//     socket.emit('join', {
//         username: newUserName,
//         room: newRoomName
//     }, function(err) {
//         if (err) {
//             showPopup();
//         } else {
//             addNewUserName(newUserName);
//         }
//     });
// });
function addNewUserName(_newUserName) {
    // return if unchanged
    if (_newUserName === username) return;

    let userExists = document.getElementById(_newUserName) ? true : false;
    // check if username already exists
    if (userExists) {
        return alert("The name " + _newUserName + " is already taken :/");
    } else if (document.getElementById(username)) {
        // else remove previous username if it exists
        document.getElementById(username).remove();
    }
    username = _newUserName; // save new username in current process memory
    window.localStorage.setItem("username", _newUserName); // save new username in local storage
    socket.emit("newUser", {name: _newUserName});
    // render user
    // TODO: use mustache
    let userIcons = ["astronaut", "ninja", "tie", "secret"];
    let i = Math.floor(Math.random() * userIcons.length - 1);
    let newUser = `<i id="${_newUserName}" class="fas fa-user-${userIcons[i]}">  <span>${_newUserName}</span></i>`;
    $('.active-members').append(newUser);
}


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
    let colorPreference = e.target.getAttribute("for");
    window.localStorage.setItem("color-preference", colorPreference);
});

function showPopup() {
    $('.md-trigger').click();
}