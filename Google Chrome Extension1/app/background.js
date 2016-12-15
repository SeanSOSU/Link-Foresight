chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "Link Foresight");

    port.onMessage.addListener(function (message) {
        readURL(port, message);
    });
});

function readURL(port, message) {
    console.log(message);
    var req = new XMLHttpRequest();
    req.open('GET', message.url, false);
    req.send();

    console.log(req.status);

    if (req.status == 200) {
        var title = req.responseText.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        if (title == null) {
            title = "N/A";
        }
        console.log(req.responseText);
        port.postMessage({ Success: true, Title: title });
    } else {
        port.postMessage({ Success: false });
        console.log(req.status);
    }
}