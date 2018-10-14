let socket = io();
let $messageForm = $('#messageForm');
$('#jet-smoke').hide();

$(document).ready(function(){
    $('#inputMessage').focus();
    let colorPref = window.localStorage.getItem("color-preference") || undefined;
    if (colorPref) {
        $(`#${colorPref}`).click();
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
            showPopup();
        }
    });
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