// CONNECT TO SERVER ==
function connect_to_game(gameName, playerName) {
  let ws = new WebSocket(
    "ws://127.0.0.1:8080/ws/" + gameName + "/" + playerName
  );
  return ws;
}

function get_message_from_player(from, message, list_color_players) {
  let color = list_color_players[from];
  if (!(from in list_color_players)) {
    color = getRandomColor();
    list_color_players[from] = color;
  }
  chat_messages.innerHTML +=
    "<br><span style='color:" +
    color +
    "'>" +
    from +
    " :</span><h3>" +
    message +
    "</h3><br>";
}

function get_message_from_server(message) {
    info.innerHTML = "<h1>" + message + "</h1>";
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function listener (data){

  console.log(data);
  if (data.type == "connected_successfully") {
    console.log("connected successfully");
  }

  else if (data.type == "players_position") {
    game.players_update(data.content);
  }

  else if (data.type == "player_disconnected") {
    console.log("player disconnected");
  }

  else if (data.type == "new_player_connected") {
    console.log("new_player_connected");
  }

  else if (data.type == "chat_message") {
    get_message_from_player(data.from, data.content, game.list_color_players);
  }
  
  else if (data.type == "game_start") {
    console.log("game start");
    // game.map.array = data.content.map;
    // game.start_x = data.content.start.x;
    // game.start_y = data.content.start.y;
  }

}