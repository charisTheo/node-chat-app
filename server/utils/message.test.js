var expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = "someone@example.com";
        var text = "Hello there";
        var message = generateMessage(from, text);
        expect(message.createdAt).toBeA('number');
        // expect(message.from).toBe(from);
        // expect(message.text).toBe(text);
        expect(message).toInclude({from, text});
    });
});