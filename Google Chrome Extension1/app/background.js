var YOUTUBE_API_KEY = "AIzaSyAqsi80Qbj5OYw_ND94Yb3xeGtcHBWQkTY";

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "Link Foresight");

    port.onMessage.addListener(function (message) {
        readURL(port, message);
    });
});

function readURL(port, message) {
    if (isYoutubeURL(message.url)) {
        console.log("Youtube URL");
        handleYoutubeLink(message.url, port);
    } else {
        console.log("Not a youtube URL");
        handleDefaultLink(message.url, port);
    }
}

function parseInfo(data, textStatus) {
    console.log("data.title");
    console.log("Test 1 Success");
}

function isYoutubeURL(url) {
    var youtubeRX = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    
    return youtubeRX.test(url);
}

/* Handler for youtube links.
   Retrieves video information in json format. */
function handleYoutubeLink(url, port) {
    var videoID = url.match(/watch\?v=([a-zA-Z0-9\-_]+)|.be\/([a-zA-Z0-9\-_]+)/);
    //var videoID = "1Psa4giWBiY";
    var queryString = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + YOUTUBE_API_KEY +
        "&part=snippet,contentDetails,statistics,status";

    $.ajax({
        url: queryString,
        type:"GET",
        dataType:"json",
        success: function(data, textStatus) {
            console.log(textStatus);
            console.log(data.items[0].snippet.channelTitle);
            port.postMessage({ Success: true, linkType: "youtube", data: data });
        }
    })
}

/* Handler for links which are not youtube.
   Retrieves title from HTMLstring */
function handleDefaultLink(url, port) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "html",
        error: function (textStatus) {
            console.log(textStatus);
        },
        success: function (data, textStatus) {
            console.log(textStatus);

            var title = $(data).filter("title").text();
            port.postMessage({ Success: true, linkType: "default", Title: title });
        }
    });
}