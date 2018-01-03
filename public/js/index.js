var socket = io();
var username = window.localStorage.getItem("username") || "";

$('#jet-smoke').hide();

$(document).on("ready", function(){
    $('#inputMessage').focus();
});

socket.on('newMessage', function(message){
    renderMessage(message);
});

socket.on('connect', function(){
    renderMessage({
        from: "Server",
        text: "Connected to server"
    });
    if (username == "") {
        showPopup();
    } else {
        socket.emit("createMessage", {from: "Server", text: `Welcome back ${username}!`});    
    }
});

socket.on('disconnect', function(){
    socket.emit('createMessage', {
        from: "Server",
        text: `${username} has left the chat.` 
    });
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