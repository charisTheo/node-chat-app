var expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = "someone@example.com";
        var text = "Hello there";
        var message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('string');
        // expect(message.from).toBe(from);
        // expect(message.text).toBe(text);
        expect(message).toMatchObject({from, text});
    });
});