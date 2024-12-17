// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;
const pi2 = Math.PI * 2;

// GAME ==
const game = new game_object(ctx, cv);
const player = game.player;

// ================================
// ================================

// MOUSE =====
let mousedown = false;
let old_x = 0;
let old_y = 0;
cv.addEventListener("mousedown", (info) => {
  if (game.mod == "main") {
    mousedown = true;
    old_x = Math.floor(info.x / game.scale);
    old_y = Math.floor(info.y / game.scale);
    if (
      old_x < game.map_size - 1 &&
      old_y < game.map_size - 1 &&
      old_x > 0 &&
      old_y > 0
    ) {
      if (game.map.array[old_y][old_x] == 1 || game.map.array[old_y][old_x] == 0) {
        // switch 1 and 0
        game.map.array[old_y][old_x] = 1 - game.map.array[old_y][old_x];
      }
    }
  }
});
cv.addEventListener("mouseup", () => {
  mousedown = false;
});
cv.addEventListener("mousemove", (info) => {
  if (game.mod == "main" && mousedown) {
    let x = Math.floor(info.x / game.scale);
    let y = Math.floor(info.y / game.scale);
    if (x < game.map_size - 1 && y < game.map_size - 1 && x > 0 && y > 0) {
      if (game.map.array[y][x] == 1 || game.map.array[y][x] == 0) {
        if (old_x != x || old_y != y) {
          // switch 1 and 0
          game.map.array[y][x] = 1 - game.map.array[y][x];
          old_x = x;
          old_y = y;
        }
      }
    }
  }
});

// KEY DOWN ==

document.onkeydown = function KEY_DOWN(event) {
  // CONTROL ===
  switch (event.code) {
    
    case "KeyG":
      get_map(game);
      break;
    case "KeyQ":
      img_to_map(game,cv)
      break;
    case "KeyS":
      if (game.mod == "main") {
        get_solve(game, true);
      } else if (game.mod == "player") {
        get_solve(game);
      }
      break;
    case "KeyM":
      switch_mode(game);
      break;
  }
  //player_control_key_down
  if (game.mod == "player") {
    switch (event.code) {
      case "Space":
        game.go = 1;
        break;
      case "ArrowRight":
        game.rotation = -1;
        break;
      case "ArrowLeft":
        game.rotation = 1;
        break;
    }
  }
};

// KEY UP ====

document.onkeyup = function (event) {
  //player_control_key_up
  if (game.mod == "player") {
    switch (event.code) {
      case "Space":
        game.go = 0;
        break;
      case "ArrowRight":
        game.rotation = 0;
        break;
      case "ArrowLeft":
        game.rotation = 0;
        break;
    }
  }
};

main_loop(game);
