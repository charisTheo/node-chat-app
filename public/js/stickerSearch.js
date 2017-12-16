let GIPHY_API_KEY = "Kc3a4yWoqg63GbhhjCARBEta0tDpCHBW";
let query = "";
$('#inputMessage').off();

$('#stickerSearch').on("click", function(e) {
    e.preventDefault();
    if ($('#toggleStickerSearch:checked').length) {
        $('#toggleStickerSearch').prop("checked", false);
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
                            $('#searchResults').append(`<img src="${result.images.fixed_width_small.url}">`);
                        } 
                    }
                });
            }
        });
    } else {
        $('#toggleStickerSearch').prop("checked", true);        
        $('#inputMessage').attr("placeholder", "type message here...");
        //detach event        
        $('#inputMessage').off();
    }
});