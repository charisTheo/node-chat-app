const GIPHY_API_KEY = 'nTqg36BVch3vMJy9ywsmfOz1fl1IzpPG';
const protocol = Cookies.get("protocol");

let query = "";
$('#removeInputBtn').hide();

$('#stickerSearch').on("click", function(e) {
    e.preventDefault();
    if ($('#toggleStickerSearch:checked').length) {
        toggleGifSearch(true);
        $('#inputMessage').attr("placeholder", "GIF search");
        $('#inputMessage').on("input", getGifs);
    } else {
        toggleGifSearch(false);
    }
});
function getGifs() {
    $('#searchResults').empty();
    query = $('#inputMessage').val();
    if (query != "") {
        $.get(protocol + "://api.giphy.com/v1/gifs/search", {
            api_key: GIPHY_API_KEY,
            q: query,
            limit: 5,
            lang: "en"
        }, function(res){
            if (res.meta.status == 200 && res.meta.msg == "OK") {                        
                for (result of res.data) {
                    $('#searchResults').append(`<a href="#" class="giphy-gif"><img src="${result.images.fixed_width_small.url}"></a>`);
                }
            }
        });
    }
}
function toggleGifSearch(bool) {
    if (bool) {
        $('#stickerSearch').css({"opacity": 1, "font-size": "larger"});
        $('div#searchResults').addClass("open");        
        $('#toggleStickerSearch').prop("checked", false);
        $('#removeInputBtn').show()
    } else {        
        $('#stickerSearch').css({"opacity": 0.6, "font-size": "initial"});        
        $('#toggleStickerSearch').prop("checked", true);        
        $('#inputMessage')
            .val("")
            .off("input", "#inputMessage", getGifs);    // remove event listener
        $('#searchResults').removeClass("open")
                        .empty();
        $('#removeInputBtn').hide();
    }
    $('#inputMessage').focus();
}
$(document).on("click", ".giphy-gif", function(e) {
    e.preventDefault();
    const url = $(this).find('img').attr("src");
    socket.emit("newImage", {
        url: url
    });
    //close searchResults
    toggleGifSearch(false);
    return true;
});