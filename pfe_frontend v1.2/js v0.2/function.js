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
  chat.innerHTML +=
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
