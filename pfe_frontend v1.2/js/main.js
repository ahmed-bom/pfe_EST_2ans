// CANVAS ==

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = 580;
cv.height = 580;
// const
const control = document.getElementById("control");
const solve_div = document.getElementById("solve");
const generate = document.getElementById("generate");
// VAR =====
let map = create2DArray(10)
let map_size = map.length;
let scale = cv.width / map_size;
let mouse_x = 0;
let mouse_y = 0;

// let map = new MINI_MAP();

cv.addEventListener("mousedown", (info) => {
  let x = Math.floor((info.x - 20) / scale);
  let y = Math.floor((info.y - 20) / scale);
  if (map[x][y] == 1 || map[x][y] == 0) {
    map[x][y] = 1 - map[x][y];
  }
  draw();
});

document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case "KeyG":
      break;
    case "KeyS":
      // get_solve(map.array);
      break;
    case "KeyD":

      break;
  }
};

function create2DArray(dim) {
  const array2D = [];
  for (let i = 0; i < dim; i++) {
    array2D.push(new Array(dim).fill(0));
  }
  array2D[0][0] = 4;
  array2D[dim-1][dim-1] = 2;
  return array2D;
}

function draw() {
  // refresh screen
  ctx.fillStyle = "#1E3E62";
  ctx.fillRect(0, 0, cv.width, cv.height);
  // =========
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      switch (map[i][j]) {
        case 0:
          ctx.fillStyle = "white";
          ctx.fillRect(i * scale, j * scale, scale-1, scale-1);
          break;
        case 1:
          ctx.fillStyle = "black";
          ctx.fillRect(i * scale, j * scale, scale-1, scale-1);
          break;
        case 2:
          ctx.fillStyle = "red";
          ctx.fillRect(i * scale, j * scale, scale-1, scale-1);
          break;
        case 3:
          ctx.fillStyle = "blue";
          ctx.fillRect(i * scale, j * scale, scale-1, scale-1);
          break;
        case 4:
          ctx.fillStyle = "green";
          ctx.fillRect(i * scale, j * scale, scale-1, scale-1);
          break;
      }
    }
  }
}



draw()