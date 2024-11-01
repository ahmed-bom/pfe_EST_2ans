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

// FPC =====

let siecle = 0;
const FPC = 20;
const cycle_delay = Math.floor(1000 / FPC);

// ================================
// ================================

// GET SOLVE

function get_solve(array) {
  fetch("http://localhost:8080/solve/DBF", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maze: array,
      start: {
        x: p.y,
        y: p.x,
      },
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      animate_path(data.all_path , data.solution);
      solve = data.solution
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// DRAW PATH

function draw_path(solution) {
  for (let i = 0; i < solution.length; i++) {
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map.array[x][y] = 2;
  }

}

// ANIMATE PATH

function animate_path(solution,path,i=0) {
  if (i == solution.length) {
    draw_path(solve)
    return 0
  }
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map.array[x][y] = 3;
    i++
  setTimeout(() => {
    animate_path(solution, path , i);
  }, cycle_delay);
}

// ================================
// ================================

// MAIN ====

function main() {
  fetch("http://127.0.0.1:8080/generate/DBF/" + map_size)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      map.new_map(map_size, 30, data.maze);
      p.new_player(1, 1, Math.PI / 2);
      render_mini_map();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// ================================
// ================================

// MINI MAP
function render_mini_map() {
  // collision
  if (
    map.array[p.y + Math.round(Math.cos(p.angle))][
      p.x + Math.round(Math.sin(p.angle))
    ] == 1
  ) {
    collision = 0;
    p.dir_x = collision;
    p.dir_y = collision;
    map.dir_i = collision;
    map.dir_j = collision;
  } else {
    collision = 1;
    p.dir_x = go;
    p.dir_y = go;
  }
  // =========
  // MOV MINI MAP
    if (
        (p.new_x / map.scale == map.visible_part - 2 &&
        Math.round(Math.sin(p.angle)) > 0) ||
        (p.new_x / map.scale == 1 && Math.round(Math.sin(p.angle)) < 0) ||
        (p.new_y / map.scale == map.visible_part - 2 &&
        Math.round(Math.cos(p.angle)) > 0) ||
        (p.new_y / map.scale == 1 && Math.round(Math.cos(p.angle)) < 0)
    ) {
        map.dir_i = collision * go;
        map.dir_j = collision * go;
    }
  // =========
  if (siecle == 2) {
    // refresh screen
    ctx.fillStyle = "#1E3E62";
    ctx.fillRect(0, 0, cv.width, cv.height);
    // =========
    map.droit();
    p.droit();
    p.mov();
    siecle = 0;
  }
  siecle++;
  setTimeout(render_mini_map, cycle_delay);
}

// ================================
// ================================

// KEY DOWN

document.onkeydown = function KEY_DOWN(event) {
  switch (event.code) {
    case "Space":
      go = 1;
      console.log(p.x + "," + p.y);
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

main();
