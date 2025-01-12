// GAME ==
const game = new Game(ctx, cv, playerName);
let list_color_players = { playerName: "#0000ff" };

// CONNECT TO SERVER ==
let ws = connect_to_game("test", playerName);

// LISTENER ==
ws.onmessage = function (event) {
  // transformer data on json
  data = JSON.parse(event.data);
  if (data.type == "message") {
    console.log(data)
    if (data.from == "server") {
      get_message_from_server(data.content);
    } else {
      get_message_from_player(data.from, data.content, list_color_players);
    }
  } else if (data.type == "start_round") {
    game.start(data.content);
    game.droit(100, 100);
  } else if (data.type == "players_position") {
    game.players_update(data.content);
    game.droit(100, 100);
  }
};

// KEY DOWN ==
document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case "Space":
      ws.send("move");
      break;
    case "ArrowRight":
      ws.send("rotation to right");
      break;
    case "ArrowLeft":
     ws.send("rotation to left");
      break;
    case "KeyH":
      if (chat.style.display == "none") {
        chat.style.display = "block";
      } else {
        chat.style.display = "none";
      }
  }
};

// game.start(test_obj)
// game.droit(100,100)
