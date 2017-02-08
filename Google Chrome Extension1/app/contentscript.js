//HTML bubble initialization
var bubbleElement = document.createElement("div");
var titleContent = document.createElement("div");
var leftContent = document.createElement("div");
var rightContent = document.createElement("div");

bubbleElement.setAttribute("class", "standard-border");
titleContent.setAttribute("class", "title-content");
leftContent.setAttribute("class", "left-content");
rightContent.setAttribute("class", "right-content");

bubbleElement.appendChild(titleContent);
bubbleElement.appendChild(leftContent);
bubbleElement.appendChild(rightContent);
document.body.appendChild(bubbleElement);


//connection to background script
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
            displayYoutubeBubble(message.data);
        } else {
            bubbleElement.innerHTML = message.Title;
        }
    } else {
        bubbleElement.innerHTML = "No information retrieved.";
    }

    bubbleElement.style.visibility = 'visible';
}

/* Youtube handler function */
function displayYoutubeBubble(data) {
    var likeCount = parseInt(data.items[0].statistics.likeCount);
    var dislikeCount = parseInt(data.items[0].statistics.dislikeCount);
    var ratio = Math.floor(100 * likeCount / (likeCount + dislikeCount));
    var views = parseInt(data.items[0].statistics.viewCount);

    titleContent.innerHTML = '<b>' + data.items[0].snippet.title +
        '</b><hr class="line-hr">';
    leftContent.innerHTML = 'Uploader: ' +data.items[0].snippet.channelTitle + '<br>' +
        'Date: ' + getDateString(data.items[0].snippet.publishedAt);
    rightContent.innerHTML = 'Views: ' + views.toLocaleString() + '<br>' +
        'Rating: ' + likeCount.toLocaleString() + '/' + dislikeCount.toLocaleString() + ' (' + ratio + '%)';
}

/* Function to parse DateTime string and return date without time */
function getDateString(dateString) {
    var date = new Date(dateString);
    // convert 0-11 month value to 1-12
    var month = (parseInt(date.getMonth()) + 1).toString();

    return month + '/' + date.getDate() + '/' + date.getFullYear();
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
