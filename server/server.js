const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation');
const { users } = require('./utils/users');
const {generateMessage, generateImageMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let protocol;
if (process.env.NODE_ENV == 'production') {
    protocol = 'https';
} else {
    protocol = 'http';
}
// set the protocol by cookie to make the calls to Giphy accordingly    
// app.use(express.static(publicPath));
app.use(express.static(publicPath, {
    setHeaders: function (res, path, stat) {
        res.set('Set-Cookie', `protocol=${protocol};Path=/`)
    }
}));

io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        if (!isRealString(params.username) || !isRealString(params.room)) {
            callback("Username and room name are required.");
        }

        socket.join(params.room);
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", params.username + " has joined the group!"));
        socket.emit("newMessage", generateMessage('Admin', 'Welcome to the ' + params.room + ' group'));
        // socket.leave(params.room);
        callback();
    });
    
    socket.on("newUser", (message) => {
        // socket.broadcast.emit("newMessage", generateMessage("Admin", `${message.name} is live`));
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