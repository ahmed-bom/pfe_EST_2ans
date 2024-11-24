// CANVAS ==

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;

// VAR =====

const pi2 = Math.PI * 2;
let map_size = 10;
//TODO fix map size in dbf
let scale = cv.height / (map_size * 2);

let map = new MAP(scale, create2DArray(map_size));
let player = new PLAYER(1, 1, Math.PI / 2, map);

let mod = "main";
let collision = 1;
let go = 0;
start_i = 0;
start_j = 0;

// FPC
const FPC = 20;
const cycle_delay = Math.floor(1000 / FPC);

// ================================
// ================================

// MOUSE =====
cv.addEventListener("mousedown", (info) => {
  if (mod == "main") {
    let x = Math.floor(info.x / scale);
    let y = Math.floor(info.y / scale);
    if (x < map_size-1 && y <= map_size-1 && x > 0 && y > 0) {
      if (map.array[x][y] == 1 || map.array[x][y] == 0) {
        // switch 1 and 0
        map.array[y][x] = 1 - map.array[y][x];
      }
    }
  }
});

// KEY DOWN ==

document.onkeydown = function KEY_DOWN(event) {
  // CONTROL ===
  switch (event.code) {
    case "KeyG":
      get_map(map, player, map_size, start_i, start_j);
      start_i = 1;
      start_j = 1;
      break;
    case "KeyS":
      if (mod == "main") {
        get_solve(map.array, start_i, start_j, true, cycle_delay);
      } else if (mod == "player") {
        get_solve(map.array, player.y, player.x);
      }
      break;
    case "KeyM":
      mod = switch_mode(mod);
      break;
  }
  //player_control_key_down
  if (mod == "player") {
    switch (event.code) {
      case "Space":
        go = 1;
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
  if (mod == "player") {
    switch (event.code) {
      case "Space":
        go = 0;
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

main_loop(map, player, cycle_delay);
