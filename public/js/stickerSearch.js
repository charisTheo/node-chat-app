let GIPHY_API_KEY = "Kc3a4yWoqg63GbhhjCARBEta0tDpCHBW";
let query = "";
$('#inputMessage').off();
//$('#closeResultsBtn').hide();

$('#stickerSearch').on("click", function(e) {
    e.preventDefault();
    if ($('#toggleStickerSearch:checked').length) {
        toggleGifSearch(true);
        $('#inputMessage').attr("placeholder", "search stickers");
        $('#inputMessage').on("input", function() {
            $('#searchResults').empty();
            query = $(this).val();
            if (query != "") {
                $.get("http://api.giphy.com/v1/gifs/search", {
                    api_key: GIPHY_API_KEY,
                    q: query,
                    limit: 5,
                    lang: "en"
                }, function(res){
                    if (res.meta.status == 200 && res.meta.msg == "OK") {                        
                        for (result of res.data) {
                            $('#searchResults').append(`<a href="#" onclick="return renderImage(this)"><img src="${result.images.fixed_width_small.url}"></a>`);
                        }
                    }
                });
            }
        });
    } else {
        toggleGifSearch(false);
    }
});
function toggleGifSearch(bool) {
    if (bool) {
        $('div#searchResults').addClass("open");        
        $('#toggleStickerSearch').prop("checked", false);
        $('#closeResultsBtn').show()
    } else {        
        $('#toggleStickerSearch').prop("checked", true);        
        $('#inputMessage').attr("placeholder", "type message here...")
                    .val("")
                    .off();
        $('#searchResults').removeClass("open")
                        .empty();
        $('#closeResultsBtn').hide();
    }
}
function renderImage(anchor){
    $('#messages').append("<br> <strong>" + username + "</strong>:  ")
                .append(anchor.children[0])
                .append("<br>");
    //close searchResults
    toggleGifSearch(false);
    return true;
};

$('#closeResultsBtn').on("click", function(e) {
    e.preventDefault();

});