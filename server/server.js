const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const {generateMessage, generateImageMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, "/../public");
const PORT = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

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
            return callback("Username and room name are required.");
        }

        socket.join(params.room);
        // remove user from any existing rooms
        users.removeUser(socket.id);
        // add user in Users' class array
        users.addUser(socket.id, params.username, params.room);

        // send users list  
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        
        // emit messages
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", params.username + " has joined the group!"));
        socket.emit("newMessage", generateMessage('Admin', 'Welcome to the ' + params.room + ' group'));
        // socket.leave(params.room);
        callback();
    });
    
    socket.on("createMessage", (message) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.username, message.text));
        }
    });

    socket.on("newImage", (message) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit("renderImage", generateImageMessage(user.username, message.url));
        }
    });
    
    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        
        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.username, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.username} has left the group.`));
        }
    });
});

server.listen(PORT, () => {
    console.log("Server started and listening on ", PORT);
});