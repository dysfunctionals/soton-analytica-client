/**
 * Game register
 */
var team;
var id;
var isInGame = false;

function lostConnection(disconnectedText) {
    console.log("disconnected");
    $("#warning-info").text(disconnectedText);
    $("#warning-info").show();
}

function pingServer() {
    $.post(path + "/input", {
        id: id,
        direction: 0
    }, function() {
        $("#warning-info").hide();
    }).fail(function() {
        lostConnection("Disconnected, reconnecting...");
    });
}

function register() {
    $("#team-info").text("Registering into a team...");
    $("#team-info").show();
    $.get(path + "/register", function(data) {
        console.log(data);
        team = data.team;
        id = data.id;
        $("#team-info").text("You are in team " + data.team);
        /* Set leave page warning */
        $(window).bind('beforeunload', function(){
            return "Are you sure you want to leave?";
        });
        /* Set ping timer */
        pingTimer = setInterval(pingServer, heartTime);
        /* Start game */
        isInGame = true;
        /* Enable buttons */
        $(".paddle").prop("disabled", false);
        $(".paddle").removeClass("not-enabled btn-outline-secondary");
        /* Set buttons colour */
        if (data.team === "zucc") {
            $(".paddle").addClass("paddle-zucc");
        } else if (data.team === "user") {
            $(".paddle").addClass("paddle-user");
        }
    }).fail(function() {
        $("#team-info").hide();
        lostConnection("Disconnected, please reload the page");
    });
}

function sendMotion(direction) {
    var audio = new Audio("http://soundbible.com/grab.php?id=1705&type=mp3");
    audio.play();
    try {
        var vibrate = window.navigator.vibrate(100);
    } catch (err) {
        console.log("vibrate not supported");
    }
    $.post(path + "/input", {
        id: id,
        direction: direction
    }, function() {
        console.log(direction + " sent");
    }).fail(function() {
        lostConnection("Disconnected, reconnecting...");
    });
}

/* Hide JavaScript warning */
$("#warning-info").hide();

register();

$(".paddle").click(function() {
    if (!isInGame) {
        return;
    }
    direction = parseInt($(this).data("direction"));
    console.log(direction);
    sendMotion(direction);
})

$(document).keydown(function(e) {
    console.log(e.keyCode + " pressed");
    switch(e.keyCode) {
        case 38:
            // move up
            $(".paddle").first().addClass("paddle-" + team +"-active");
            sendMotion(-1);
            break;
        case 40:
            // move down
            $(".paddle").last().addClass("paddle-" + team +"-active");
            sendMotion(1);
            break;
        default:
            break;
    }
});

$(document).keyup(function(e) {
    switch(e.keyCode) {
        case 38:
            // move up
            $(".paddle").first().removeClass("paddle-zucc-active");
            $(".paddle").first().removeClass("paddle-user-active");
            break;
        case 40:
            // move down
            $(".paddle").last().removeClass("paddle-zucc-active");
            $(".paddle").last().removeClass("paddle-user-active");
            break;
        default:
            break;
    }
});
