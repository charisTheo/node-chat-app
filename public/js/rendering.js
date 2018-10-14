function renderMessage(message) {
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        // createdAt, from, text
        ...message
    });
    $('#messages').append(html);

    setInputPlaceholder();
    scrollToBottom();
}
function renderImage(message) {    
    let template = $('#image-message-template').html();
    let html = Mustache.render(template, {
        // createdAt, from, url
        ...message
    });
    $('#messages').append(html);
    
    setInputPlaceholder();
    scrollToBottom();
}
function renderLocationMessage(message) {
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        // createdAt, from, url
        ...message
    });
    $('#messages').append(html);

    scrollToBottom();
}
function scrollToBottom() {
    const $messages = $('#messages');
    const $newMessage = $messages.children('div:last-child');

    const clientHeight = $messages.prop("clientHeight");
    const scrollTop = $messages.prop("scrollTop");
    const scrollHeight = $messages.prop("scrollHeight");
    const newMessageHeight = $newMessage.innerHeight();
    const lastMessageHeight =  $newMessage.prev().innerHeight();
                                                                // + 15px of #messages padding
    if (clientHeight + scrollTop + lastMessageHeight + newMessageHeight + 15 >= scrollHeight) {
        // scroll to bottom
        $messages.animate({ scrollTop: scrollHeight }, "slow");
    }
}

function setInputPlaceholder() {
    const phrases = [
        "I love everyone", 
        "You make me laugh", 
        "I am feeling great today", 
        "How can I help you?", 
        "I'm listening", 
        "You are right", 
        "I understand what you say", 
        "How do you feel about that?",
        "Thanks for sharing",
        "You are all brilliant people"
    ];
    let i = Math.floor(Math.random() * phrases.length - 1);
    $('#inputMessage').attr("placeholder", phrases[i]);
}