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

START();
