// GAME ==
const game = new Game(ctx, cv, playerName);
let list_color_players = { playerName: "#0000ff" };

// CONNECT TO SERVER ==
let ws = connect_to_game("test", playerName);

// LISTENER ==
ws.onmessage = function (event) {
  // transformer data on json
  data = JSON.parse(event.data);
  listener(data);
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

// CHAT ==

send.onclick = function () {
  get_message_from_player(playerName, chat_input_text.value, list_color_players);
  ws.send("/"+chat_input_text.value);
  chat_input_text.value = "";
};
