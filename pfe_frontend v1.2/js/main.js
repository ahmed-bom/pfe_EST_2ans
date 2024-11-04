// CANVAS ==

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = 580;
cv.height = 580;
// VAR =====
let map_size = 10;
let scale = cv.width / map_size;
let map = new MINI_MAP(scale, create2DArray(map_size));
let mouse_x = 0;
let mouse_y = 0;
let start_i = 0;
let start_j = 0;
// FPC
const FPC = 20;
const cycle_delay = Math.floor(1000 / FPC);

cv.addEventListener("mousedown", (info) => {
  let x = Math.floor((info.x - 20) / scale);
  let y = Math.floor((info.y - 20) / scale);
  if (map.array[x][y] == 1 || map.array[x][y] == 0) {
    map.array[y][x] = 1 - map.array[y][x];
  }
  draw();
});

document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case "KeyG":
      fetch("http://127.0.0.1:8080/generate/DBF/" + map_size)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          map.array = data.maze;
          // -1 /2 and *2 +1 for DBF
          map_size = (data.maze.length-1)/2;
          scale = cv.width / map_size/2 -1;
          start_i = 1;
          start_j = 1;
          map.update(scale);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      break;
    case "KeyS":
      get_solve(map.array, start_i, start_j);
      break;
    case "KeyD":
      break;
  }
};

function draw() {
  // refresh screen
  ctx.fillStyle = "#1E3E62";
  ctx.fillRect(0, 0, cv.width, cv.height);
  // =========
  map.droit();
  setTimeout(() => {
    draw();
  }, cycle_delay);
}

draw();
