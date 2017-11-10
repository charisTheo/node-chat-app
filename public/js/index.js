var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
   
    socket.emit('createMessage', {
        from: "client",
        text: "this is a message from " + navigator.userAgent
    });
});

socket.on("invalidMessage", function(message) {
    console.log("invalidMessage", message);
});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');                
});