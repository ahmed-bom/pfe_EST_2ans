// GAME ==
const game = new Game(ctx, cv, playerName, Textures);

// CONNECT TO SERVER ==
let ws = connect_to_game(game_type,game_id, playerName);
//console.log(game_type,game_id, playerName)

// LISTENER ==
ws.onmessage = function (event) {
  // transformer data on json
  data = JSON.parse(event.data);
  listener(data);
};

// KEY DOWN ==
document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case KEY_MOV:
      ws.send("move");
      footstep.play();
      setTimeout(()=>{
        footstep.pause();
      },1000)
      break;

    case KEY_Right:
      ws.send("rotation to right");
      break;

    case KEY_Left:
      ws.send("rotation to left");
      break;

    case KEY_CHAT:
      if (chat.style.display == "none") {
        chat.style.display = "block";
      } else {
        chat.style.display = "none";
      }
      break;

    case KEY_CLICK:
      if (game.click()) {
        ws.send("click");
        keys_Counter.innerHTML = ( key_number_of_game - game.key_number) + "/" + key_number_of_game
      }
      break;
  }
};

// CHAT ==

send.onclick = function () {
  if (chat_input_text.value != "") {
    get_message_from_player(playerName, chat_input_text.value);
    ws.send("/" + chat_input_text.value);
    chat_input_text.value = "";
  }
};

rede.onclick = function () {
  if (rede.innerHTML == "not ready"){
    ws.send("not rede");
    rede.innerHTML = "ready";
  }
  else {
    ws.send("rede");
    rede.innerHTML = "not ready";
  }
};

// MOUSE CONTROLS

cv.addEventListener("click", () => {
  if (MOUSE_CONTROLS) cv.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", updateCamera);
  } else {
    document.removeEventListener("mousemove", updateCamera);
  }
});

function updateCamera(e) {
  if (Math.abs(e.movementX - old_movementX) > MOUSE_SENSITIVITY){
    if (e.movementX > 0) {
      ws.send("rotation to right");
    } else {
      ws.send("rotation to left");
    }
  }
}
