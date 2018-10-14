$('#removeInputBtn').on("click", function(e) {
    e.preventDefault();
    $('#inputMessage').val("");
    $(this).hide("slow");
});

$('#inputMessage').keyup(function(e) {
    if ($(this).val() != "") {
        $('#removeInputBtn').show("slow");
    } else {
        $('#removeInputBtn').hide("slow");
    }
});
if ($('#inputMessage').val() == "") {
    $('#removeInputBtn').hide("slow");
}


// SUBMIT HANDLERS
$('#inputMessage').keypress(function(e) {
    // if enter is pressed on mobile
    if (e.keyCode == 13 || e.key == 'Enter') {
        // fix for: form is not submitted from mobile
        messageFormSubmitHandler();
    }
});
$('#messageForm').submit(function(event){
    event.preventDefault();
    messageFormSubmitHandler();
    $('#removeInputBtn').hide("slow");  // fix for: when form submitted from submit input button 
});
function messageFormSubmitHandler() {
    let mes = $messageForm.find("input[name=message]").val();
    
    if (mes == "") {
        return;
    }
    if (username == "") {
        return showPopup();
    }
    // start animation from sendSvgAnim.js
    createJets(); 
    $('#jet-smoke').show("fast")
        .delay(1000)
        .hide("fast");
                
    socket.emit("createMessage", {
        from: username,
        text: mes
    });
    $('#inputMessage').val("");
}