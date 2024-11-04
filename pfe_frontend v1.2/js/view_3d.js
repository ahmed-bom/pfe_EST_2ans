// CANVAS ==

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;

// VAR =====

const pi2 = Math.PI * 2;
let map_size = 10;
let collision = 1;
let go = 0;
let map_object = new MINI_MAP(30, create2DArray(map_size));
let p_object = new PLAYER(1, 1, Math.PI / 2,map_object);

// FPC 
let siecle = 0;
const FPC = 20;
const cycle_delay = Math.floor(1000 / FPC);

// ================================
// ================================



// KEY DOWN

document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case "Space":
      go = 1;
      break;
    // case "KeyS":
    //   get_solve(map_object.array, p_object.y, p_object.x);
    //   break;
    case "ArrowRight":
      p_object.rotate_dir = -pi2;
      break;
    case "ArrowLeft":
      p_object.rotate_dir = pi2;
      break;
  }
};

// KEY UP

document.onkeyup = function (event) {
  switch (event.code) {
    case "Space":
      go = 0;
      break;
    case "ArrowRight":
      p_object.rotate_dir = 0;
      break;
    case "ArrowLeft":
      p_object.rotate_dir = 0;
      break;
  }
};

// ================================
// ================================

START(map_object, p_object);

