var socket = io();
var user1 = "Charis";
var user2 = "Giannis";

$(document).on("ready", function(){
    $('#inputMessage').focus();
});

socket.on('newMessage', function(message){
    renderMessage(message);
});

socket.on('connect', function(){
    renderMessage({
        from: "server",
        text: "Connected to server"
    });
    
    socket.emit("newUser", {name: navigator.userAgent});
    socket.emit("createMessage", {
        from: user2,
        text: "Hello!"
    }, function() {
        console.log("Got it!") //callback function for acknoledgment
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');                
});

//on sending message
$('body form').on("submit", function(e){
    e.preventDefault();
    var mes = this.elements["message"].value.toString();
    if (mes == "") {
        return;
    }

    socket.emit("createMessage", {
        from: user1,
        text: mes
    });
    $('#inputMessage').val("");
});


function renderMessage(message) {
    var html = $('#messages').html();
    html += "<br> <strong>" + message.from.toString() + "</strong>:  <i>" + message.text.toString() + "</i><br>";
    $('#messages').html(html)

    // scroll to the bottom of the div
    // $('#messages').scrollTop($('#messages').scrollHeight);
    // $('#messages').stop().animate({
    //     scrollTop: $('#messages').scrollHeight - $('#messages').clientHeight
    // }, 1000);
}