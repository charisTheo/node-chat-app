// Array.prototype.unique = function() {
//     return this.filter(function (value, index, self) { 
//         return self.indexOf(value) === index;
//     });
// }

// user.webPushSubscription = {
//     subscription: '',
//     room: '',
//     username: ''
// };

class Users {
    constructor () {
        this.users = [];
    }
    addUser(id, username, room) {
        let user = {id, username, room};
        this.users.push(user);
        return user;
    } 
    removeUser(id) {
        let userToRemove = this.getUser(id);
        
        if (userToRemove) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return userToRemove;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.username);
        
        return namesArray;
    }
}

module.exports = { Users };