var bubbleElement = document.createElement("div");
bubbleElement.setAttribute("class", "triangle-border");
document.body.appendChild(bubbleElement);

var port = chrome.runtime.connect({name: "Link Foresight"});
port.onMessage.addListener(function (message) {
    showInfo(message);
});

//coordinates for bubbleElement
var x = 0, y = 0;

function getInfo(link) {
    console.log(link.href);
    port.postMessage({url: link.href});
}

function showInfo(message) {
    var bubbleX, bubbleY;

    bubbleX = positionX();
    bubbleY = positionY();

    if (message.Success) {
        if (message.linkType == "youtube") {
            var likeCount = parseInt(message.data.items[0].statistics.likeCount);
            var dislikeCount = parseInt(message.data.items[0].statistics.dislikeCount);
            var ratio = Math.floor(100 * likeCount / (likeCount + dislikeCount));

            bubbleElement.innerHTML = message.data.items[0].snippet.title + '<br>' +
                'Views: ' + message.data.items[0].statistics.viewCount + '<br>' +
                'Likes/Dislikes: ' + likeCount + '/' + dislikeCount + ' (' + ratio + '%)';
        } else {
            bubbleElement.innerHTML = message.Title;
        }
    } else {
        bubbleElement.innerHTML = "No information retrieved.";
    }

    bubbleElement.style.top = bubbleY + 'px';
    bubbleElement.style.left = bubbleX + 'px';
    bubbleElement.style.visibility = 'visible';
}

function hideInfo(message) {
    bubbleElement.style.visibility = 'hidden';
}

function renderBubble(message) {
   
}

function positionX() {
    return (x - 100 > 0) ? x - 100 : x;
}

function positionY() {
    return (y - 100 > 0) ? y - 100 : y;
}

for (var i = 0; i < document.links.length; i++) {
    (function (i) {
        document.links[i].addEventListener("contextmenu", function (e) {
            //update coordinates on right click
            x = e.pageX;
            y = e.pageY;

            getInfo(document.links[i]);
        });

        document.links[i].addEventListener("mouseleave", function () {
            hideInfo(document.links[i]);
        });
    })(i);
}
