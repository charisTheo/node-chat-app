const expect = require('expect');
const {Users} = require('./Users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            username: "mouse",
            room: "the room 1"
        },{
            id: 2,
            username: "dog",
            room: "the room 2"
        },{
            id: 3,
            username: "cat",
            room: "the room 1"
        }]
    });
    
    it('should add a new user', () => {
        let users = new Users();
        let user = {
            id: 123,
            username: 'Charis',
            room: "dark room"
        };
        let resUser = users.addUser(user.id, user.username, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for the room 1', () => {
        let userList = users.getUserList("the room 1");

        expect(userList).toEqual(['mouse', 'cat']);
    });

    it('should return names for the room 2', () => {
        let userList = users.getUserList("the room 2");

        expect(userList).toEqual(['dog']);
    });

    it('should find user', () => {
        let userId = 1;
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = 99;
        let user = users.getUser(userId);

        expect(user).toBe(undefined);
    });

    it('should remove a user', () => {
        let userId = 1;
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        let userId = 99;
        let user = users.removeUser(userId);

        expect(user).toBe(undefined);
        expect(users.users.length).toBe(3);
    });
});