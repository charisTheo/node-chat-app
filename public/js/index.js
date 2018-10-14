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
    if (username == "") {
        showPopup();
    } else {
        // socket.emit("createMessage", {from: "Server", text: `Welcome back ${username}!`});
        socket.emit('userConnected', {user: username});
    }
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

function showPopup() {
    $('.md-trigger').click();
}

let previousColor;
$("input[type='radio']").on("click", function(e) {
    e.preventDefault();
    let color = $(this).val();
    $(document.body).removeClass(previousColor);
    $(document.body).addClass(color); 
    
    previousColor = color;
});

$('#removeInputBtn').on("click", function(e) {
    e.preventDefault();
    $('#inputMessage').val("");
    $(this).hide("slow");
});

$('#inputMessage').keyup(function(e) {
    if ($(this).val() != "") {
        $('#removeInputBtn').show("slow");
    } else {
        $('#removeInputBtn').hide("slow");
    }
});
if ($('#inputMessage').val() == "") {
    $('#removeInputBtn').hide("slow");
}

//add listener on #selectColor to store color preference in local storage
$('#selectColor label').on("click", function(e) {
    let colorPreference = e.target.getAttribute("for");
    window.localStorage.setItem("color-preference", colorPreference);
});


// SUBMIT HANDLERS

$('#inputMessage').keypress(function(e) {
    // if enter is pressed on mobile
    if (e.keyCode == 13 || e.key == 'Enter') {
        // fix for: form is not submitted from mobile
        messageFormSubmitHandler();
    }
});
$('#messageForm').submit(function(event){
    event.preventDefault();
    messageFormSubmitHandler();
    $('#removeInputBtn').hide("slow");  // fix for: when form submitted from submit input button 
});
function messageFormSubmitHandler() {
    let mes = $messageForm.find("input[name=message]").val();
    
    if (mes == "") {
        return;
    }
    if (username == "") {
        return showPopup();
    }
    // start animation from sendSvgAnim.js
    createJets(); 
    $('#jet-smoke').show("fast")
        .delay(1000)
        .hide("fast");
                
    socket.emit("createMessage", {
        from: username,
        text: mes
    });
    $('#inputMessage').val("");
}


// addUsername

$('#addUsername').on("submit", function(e){
    e.preventDefault();
    const newUserName = $('#username').val();
    // return if unchanged
    if (newUserName === username) return;
    let userExists = document.getElementById(newUserName) ? true : false;
    // check if username already exists
    if (userExists) {
        return alert("The name " + newUserName + " is already taken :/");
    } else {
        // else remove previous username
        document.getElementById(username).remove();
    }
    addNewUserName(newUserName);
});
function addNewUserName(_newUserName) {
    username = _newUserName; // save new username in current process memory
    window.localStorage.setItem("username", _newUserName); // save new username in local storage
    socket.emit("newUser", {name: _newUserName});
    // render user
    // TODO: use mustache
    let userIcons = ["astronaut", "ninja", "tie", "secret"];
    let i = Math.floor(Math.random() * 4);
    let newUser = `<i id="${_newUserName}" class="fas fa-user-${userIcons[i]}">  <span>${_newUserName}</span></i>`;
    $('.active-members').append(newUser);
}