// GAME ==
const game = new Game(ctx, cv, playerName,Textures);

// CONNECT TO SERVER ==
let ws = connect_to_game(game_id, playerName);

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
      if (game.click()){
         ws.send("click");
         console.log("click")
      };
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
  if (e.movementX > 0){
    ws.send("rotation to right");
  }else {
     ws.send("rotation to left");
  }
}
