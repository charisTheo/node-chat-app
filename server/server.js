const path = require('path');
const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io');
const { webPush } = require('./utils/webPush');
const { isRealString } = require('./utils/validation');
const { Users } = require('./Models/Users');
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
        socket.emit("userJoined", {
            PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY || require('./keys.json').PUBLIC_VAPID_KEY
        });
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

    socket.on('userSubscribed', ({ subscription }) => {
        let user = users.getUser(socket.id);

        if (user) {
            // subscribe user for specific chat and save the username and room name
            user.webPushSubscription = {
                subscription,
                room: user.room,
                username: user.username
            };

            webPush.sendNotification(
                subscription,
                JSON.stringify({
                    title: "Chat App",
                    body: `Yeay! You will now receive notifications for new messages in ${user.room}!`,
                    tag: "subscribed",
                    actions: [
                        {
                            action: 'openRoom',
                            title: `Open ${user.room}`
                        }
                    ],
                    data: {
                        room: user.room,
                        username: user.username
                    }
                })
            ).catch(error => {
                console.error(error.stack);
            });
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
    console.log(`Server started and listening on http://localhost:${PORT}`);
});