// CANVAS ==

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;

// VAR =====

const pi2 = Math.PI * 2;
let map_size = 10;
let scale = cv.width / map_size;

let map = new MAP(scale, create2DArray(map_size));
let player = new PLAYER(1, 1, Math.PI / 2, map_object);

let collision = 1;
let go = 0;


// FPC
const FPC = 20;
const cycle_delay = Math.floor(1000 / FPC);

// ================================
// ================================

// VAR =====



let mouse_x = 0;
let mouse_y = 0;
let start_i = 0;
let start_j = 0;
