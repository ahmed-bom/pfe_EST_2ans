// CONNECT TO SERVER ==
function connect_to_game(gameType,gameName, playerName) {
  const origin = window.location.origin
  let ws = new WebSocket(
    origin + "/ws/" + gameType + "/" + gameName + "/" + playerName
  );

  ws.onerror = function (event){
    //window.location.href = "/"
  }

  return ws;
}

function get_message_from_player(from, message) {
  let color = game.players[from].color;

  chat_messages.innerHTML +=
    "<br><span style='color:" +
    color +
    "'>" +
    from +
    " :</span><h3>" +
    message +
    "</h3><br>";
}

function get_message_from_server(message,color = "wheat") {
  info.innerHTML = "<h1 style='color: "+color+";'>" + message + "</h1>";
  setTimeout(() => {
    info.innerHTML = "";
  }, 6000);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function listener(data) {
  switch (data.type) {
    case "ban":
      console.log("yor ban")
      window.location.href = data.content
      
    case "enter_lobe":
      console.log("enter_lobe successfully");
      keys_Counter.innerHTML = ""
      rede.style.display = "block"
      spec.style.display = "none"
      //background_song.pause();
      game.update(data);
      game.render(playerName);
      break;

    case "players_position":
      game.players_update_position(data);
      break;

    case "new_connected":
      get_message_from_server(data.from + " connected");
      game.new_connected(data);
      break;

    case "disconnected":
      get_message_from_server(data.from + " disconnected");
      game.player_disconnected(data.from);
      break;

    case "game_start":
      console.log("game start");
      rede.style.display = "none"
      //background_song.play()
      game.update(data);
      key_number_of_game = game.key_number
      keys_Counter.innerHTML = "0/" + key_number_of_game
      console.log("test")
      break;

    case "win":
      get_message_from_server(data.content + " escaped","#ff9216");
      game.player_win(data.content);
      break;

    case "kill":
      get_message_from_server(data.content + " is dead " , "red");
      knife_stab.play();
      game.player_get_killed(data.content);
      break;

    case "get_key":
      get_message_from_server(data.from + " got a key","#ff9216");
      get_key_audio.play();
      game.player_get_key(data.content);
      keys_Counter.innerHTML = ( key_number_of_game - game.key_number) + "/" + key_number_of_game
      break;

    case "player_rede":
      get_message_from_server(data.from + " ready");
      break;

    case "player_not_rede":
      get_message_from_server(data.from + " is not ready");
      break;

    case "message":
      if (data.from == "server") {
        get_message_from_server(data.content);
      } else {
        get_message_from_player(data.from, data.content);
      }
      break;

    default:
      console.log(data);
  }
  // console.log(data);
}
