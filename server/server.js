const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io'); 
const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User connected');
    
    // socket.emit('newMessage', {
    //     from: 'someone@example.com',
    //     text: 'buongiorno!',
    //     createdAt: new Date().getTime()
    // });

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client');
    });
});

server.listen(PORT, () => {
    console.log("Server started and listening on ", PORT);
});