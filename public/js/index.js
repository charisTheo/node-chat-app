var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
    
    socket.emit("newUser", {name: navigator.userAgent})
});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');                
});