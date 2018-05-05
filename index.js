/**
 * Game register
 */
var team;
var id;

function register() {
    $("#team-info").text("Registering into a team...");
    $("#team-info").show();
    $.get(path + "/register", function(data) {
        console.log(data);
        team = data.team;
        id = data.id;
        $("#team-info").text("You are in team " + data.team);
    }).fail(function() {
        $("#team-info").hide();
        lostConnection();
    });
}

function lostConnection() {
    console.log("disconnected");
    $("#warning-info").text("Disconnected");
    $("#warning-info").show();
}

function sendMotion(direction) {
    $.post(path + "/input", {
        id: id,
        direction: direction
    }).fail(function() {
        lostConnection();
    });
}

/* Hide JavaScript warning */
$("#warning-info").hide();

register();

$(".paddle").click(function() {
    direction = parseInt($(this).data("direction"));
    console.log(direction);
    sendMotion(direction);
})
