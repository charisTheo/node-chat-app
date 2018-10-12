let socket = io();
let username = window.localStorage.getItem("username") || "";

$('#jet-smoke').hide();

$(document).ready(function(){
    $('#inputMessage').focus();
    var colorPref = window.localStorage.getItem("color-preference") || undefined;
    if (colorPref) {
        $(`#${colorPref}`).click();
    }
});

socket.on('newMessage', function(message){
    renderMessage(message);
});

socket.on("activeUsers", function (message) {
    var activeMembers = $('.active-members').html();
    message.users.forEach(user => {
        activeMembers += `<p class="${user}"><i class="fa fa-dot-circle-o" aria-hidden="true"></i>${user}</p>`;
    });
    $('.active-members').html(activeMembers);
});
socket.on("inactiveUser", function(message) {
    // console.log(message);
    $(`p.${message.user}`).remove();
});

socket.on('connect', function() {    
    if (username == "") {
        showPopup();
    } else {
        socket.emit("createMessage", {from: "Server", text: `Welcome back ${username}!`});
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
    window.open(message.url, '_blank');
});

//on sending message
$('#messageForm').on("submit", function(e){
    e.preventDefault();
    var mes = this.elements["message"].value.toString();
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
                .hide("fast")
                
    socket.emit("createMessage", {
        from: username,
        text: mes
    });
    $('#inputMessage').val("");
});

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

function renderMessage(message) {
    var html = $('#messages').html();
    html += "<br> <strong>" + message.from.toString() + "</strong>:  " + message.text.toString() + "<br>";
    $('#messages').html(html)

    //scroll to bottom of page
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

function showPopup() {
    $('.md-trigger').click();
}

$('#addUsername').on("submit", function(e){
    e.preventDefault();
    username = $('#username').val();
    window.localStorage.setItem("username", username);
    socket.emit("newUser", {name: username});
});

var previousColor;
$("input[type='radio']").on("click", function(e) {
    e.preventDefault();
    var color = $(this).val();
    $(document.body).removeClass(previousColor);
    $(document.body).addClass(color); 
    
    previousColor = color;
});

$('#removeInputBtn').on("click", function(e) {
    e.preventDefault();
    $('#inputMessage').val("");
    $(this).hide("slow");
});

$('#inputMessage').keyup(function() {
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
    var colorPreference = e.target.getAttribute("for");
    window.localStorage.setItem("color-preference", colorPreference);
});