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
cv.addEventListener("mousedown", (info) => {
  if (game.mod == "main") {
    let x = Math.floor(info.x / game.scale);
    let y = Math.floor(info.y / game.scale);
    if (x < game.map_size-1 && y <= game.map_size-1 && x > 0 && y > 0) {
      if (game.map.array[x][y] == 1 || game.map.array[x][y] == 0) {
        // switch 1 and 0
        game.map.array[y][x] = 1 - game.map.array[y][x];
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
        player.rotate_dir = -pi2;
        break;
      case "ArrowLeft":
        player.rotate_dir = pi2;
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
        player.rotate_dir = 0;
        break;
      case "ArrowLeft":
        player.rotate_dir = 0;
        break;
    }
  }
};

main_loop(game);
