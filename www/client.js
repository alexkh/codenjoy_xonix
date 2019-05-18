
(function($) {
"use strict"

let ws = new WebSocket("ws://localhost:8080")

ws.addEventListener('open', function (event) {
    ws.send('Hello Server!');
});

// Наблюдает за сообщениями
ws.addEventListener('message', function (event) {
	let data = JSON.parse(event.data)
	if(data.type === "game_state") {
		field.player_pos = data.player_pos
		field.player_dir = data.player_dir
		field.ball_pos = data.ball_pos
		field.ball_dir = data.ball_dir
	}
    console.log('Message from server ', event.data);
});



var field = new Field()

function loop() {
	field.sim()
	field.draw()
}

$(function() {
	field.init()
	field.draw()
	setInterval(loop, 1000)
});

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
		ws.send('left')
        break;

        case 38: // up
		ws.send('up')
        break;

        case 39: // right
		ws.send('right')
        break;

        case 40: // down
		ws.send('down')
        break;

	case 32: // stop
		ws.send('stop')
	break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

})(jQuery)
