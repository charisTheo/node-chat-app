const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.on("newUser", (message) => {
        socket.emit("newMessage", generateMessage("Admin", `Welcome ${message.name}!`));
        socket.broadcast.emit("newMessage", generateMessage("Admin", message.name + " has joined the group!"));
    });

    socket.on("createMessage", (message) => {
        console.log("newMessage", message)
        io.emit("newMessage", generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from client');
    });
});

server.listen(PORT, () => {
    console.log("Server started and listening on ", PORT);
});