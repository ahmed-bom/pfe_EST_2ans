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
let solve = false;
let map = new MINI_MAP();
let p = new PLAYER();

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
    case "KeyS":
      get_solve(map.array);
      break;
    case "ArrowRight":
      p.rotate_dir = -pi2;
      break;
    case "ArrowLeft":
      p.rotate_dir = pi2;
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
      p.rotate_dir = 0;
      break;
    case "ArrowLeft":
      p.rotate_dir = 0;
      break;
  }
};

// ================================
// ================================

START();
