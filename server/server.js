const path = require('path');
const http = require('http');
const express = require('express'); 
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const {generateMessage, generateImageMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

let app = express();
// app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);
let protocol;

if (process.env.NODE_ENV == 'production') {
    protocol = 'https';
} else {
    protocol = 'http';
}

// set the protocol by cookie to make the calls to Giphy accordingly    
app.use(express.static(publicPath, {
    setHeaders: function (res, path, stat) {
        res.set('Set-Cookie', `protocol=${protocol};Path=/`)
    }
}));

let users = [];
Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
    });
}

io.on('connection', (socket) => {

    socket.on('userConnected', (message) => {
        users.push(message.user);
        // socket.broadcast.emit("activeUsers", {users: users.unique()});
    });
    
    socket.on("newUser", (message) => {
        //check for duplicates in nicknames
        socket.nickname = message.name;
        users.push(socket.nickname);
        socket.emit("newMessage", generateMessage("Server", `${message.name} is live`));
        socket.broadcast.emit("newMessage", generateMessage("Server", message.name + " has joined the group!"));
    });

    socket.on("createMessage", (message) => {
        io.emit("newMessage", generateMessage(message.from, message.text));
    });

    socket.on("newImage", (message) => {
        io.emit("renderImage", generateImageMessage(message.from, message.url));
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