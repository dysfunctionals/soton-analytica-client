/**
 * Program config
 */
var path = "http://example.com";

/**
 * Game register
 */
var team;
var token;

var direction = 0;

register();

function register() {
    $("#team-info").text("Registering into a team...");
    $.post(path + "/regiter", function(data) {
        team = data.team;
        token = data.token;
        $("#team-info").text("You are in team " + team);
    }).fail(function() {
        $("#team-info").text("Disconnected");
    });
}

function lostConnection() {
    console.log("lost connection");
}

function sendUpdate() {
    $.post(path + "/update", {
        token: token,
        motion: direction
    }).fail();
}

$(".paddle").click(function() {
    console.log("h");
    direction = parseInt($(this).data("direction"));
    console.log(direction);
    sendUpdate();
})