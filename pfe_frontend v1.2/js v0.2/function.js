// CONNECT TO SERVER ==
function connect_to_game(gameName, playerName) {
  let ws = new WebSocket(
    "ws://127.0.0.1:8080/ws/" + gameName + "/" + playerName
  );
  return ws;
}

function get_message_from_player(from, message) {

  // let color = game.players[from].color;
  color = getRandomColor();
  
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

  // console.log(data);
  if (data.type == "connected_successfully") {
    console.log("connected successfully");
    game.connected(data);
    
    game.render(canvas.width, Math.PI / 3, playerName, wallTexture);
    game.droit();
  }

  else if (data.type == "players_position") {
    game.players_update_position(data);
    
    game.render(canvas.width, Math.PI / 3, playerName, wallTexture);
    game.droit();
  }

  else if (data.type == "disconnected") {
    console.log("player disconnected");
    get_message_from_server(data.from + " disconnected");
    game.player_disconnected(data.from);
    game.droit();
  }

  else if (data.type == "new_connected") {
    console.log("new_player_connected");
    get_message_from_server(data.from + " connected");
    game.new_connected(data);
    game.droit();
  } 
  
  else if (data.type == "message") {
    console.log(data);
    if (data.from == "server") {
      get_message_from_server(data.content);
    }else{
      get_message_from_player(data.from, data.content);
    }
  } 
  
  else if (data.type == "game_start") {
    console.log("game start");
    get_message_from_server("Game start");
    game.droit();
    // game.map.array = data.content.map;
    // game.start_x = data.content.start.x;
    // game.start_y = data.content.start.y;
  }

  else {
    console.log(data);
  }

}