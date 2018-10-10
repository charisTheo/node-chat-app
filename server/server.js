const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
var server = http.createServer(app);
var io = socketIO(server);


var users = [];
Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
    });
}

io.on('connection', (socket) => {

    socket.on('userConnected', (message) => {
        users.push(message.user);
        socket.broadcast.emit("activeUsers", {users: users.unique()});
    });
    
    socket.on("newUser", (message) => {
        //check for duplicates in nicknames
        socket.nickname = message.name;
        users.push(socket.nickname);
        socket.emit("newMessage", generateMessage("Server", `Welcome ${message.name}!`));
        socket.broadcast.emit("newMessage", generateMessage("Server", message.name + " has joined the group!"));
    });

    socket.on("createMessage", (message) => {
        io.emit("newMessage", generateMessage(message.from, message.text));
    });

    socket.on('userDisconnected', (message) => {
        //pass the users name to delete his name from .active-members
        // console.log(message);
        io.emit("inactiveUser", {user: message.user});
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit("newLocationMessage", generateLocationMessage('Server', coords.latitude, coords.longitude));
    });
});

server.listen(PORT, () => {
    console.log("Server started and listening on ", PORT);
});