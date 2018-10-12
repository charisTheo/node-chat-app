let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().toLocaleDateString('en-GB', {weekday: 'long', hour: 'numeric', minute: 'numeric' })   // "Friday 16:36"
    };
};

let generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: new Date().toLocaleDateString('en-GB', {weekday: 'long', hour: 'numeric', minute: 'numeric' })
    };
};

module.exports = {generateMessage, generateLocationMessage};