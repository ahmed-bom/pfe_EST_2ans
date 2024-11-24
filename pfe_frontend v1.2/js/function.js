// GET RANDOM MAP ====
function get_map(map, player, map_size, start_i, start_j) {
  fetch("http://127.0.0.1:8080/generate/DFS/" + map_size)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      map.array = data.maze;
      map.update();
      player.update(map);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// GET SOLVE

function get_solve(array, start_x, start_y,animate =false,cycle_delay = 100) {
  fetch("http://localhost:8080/solve/DFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maze: array,
      start: {
        x: start_x,
        y: start_y,
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
      if (animate){
        animate_path(array, data.all_path, data.solution, cycle_delay);
      }
      else{
        draw_path(array, data.solution);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// ================================

// MINI MAP
function droit_mini_map(map, p) {
  collision_detection(map, p);
  mov_mini_map(map, p);
  map.droit_min_map(p);
  p.droit();
  p.mov();
}

function collision_detection(map, p) {
  // go and collision global variable  I do not know how to fix this because of recursion
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
}

function mov_mini_map(map, p) {
  // go and collision global variable  I do not know how to fix this because of recursion
  // I think I must use pointers
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
}

// ================================

// DRAW PATH

function draw_path(map, solution) {
  for (let i = 0; i < solution.length; i++) {
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map[x][y] = 2;
  }
}

// ANIMATE PATH

function animate_path(map, steps_to_solution, solution, cycle_delay = 100, i = 0) {
  if (i == steps_to_solution.length) {
    draw_path(map, solution);
    return 0;
  }
  path = steps_to_solution[i];
  let x = path[0];
  let y = path[1];
  map[x][y] = 3;
  i++;
  setTimeout(() => {
    animate_path(map, steps_to_solution, solution, cycle_delay, i);
  }, cycle_delay);
}

// ================================

function create2DArray(dim) {
  const array2D = [];
  for (let i = 0; i < dim; i++) {
    array2D.push(new Array(dim).fill(0));
  }
  for (let i = 0; i < dim; i++) {
    array2D[i][0] = 1;
    array2D[i][dim - 1] = 1;
  }
  for (let i = 0; i < dim; i++) {
    array2D[0][i] = 1;
    array2D[dim - 1][i] = 1;
  }
  array2D[1][1] = 4;
  array2D[dim - 2][dim - 2] = 2;
  return array2D;
}

// ================================

function switch_mode(mod) {
  if (mod == "main") {
    mod = "player";
  } else if (mod == "player") {
    mod = "main";
  }
  return mod;
}

function main_loop(map, player, cycle_delay = 100) {
  // mod global variable == "main" or "player" i do not know how to fix this because of recursion
  // refresh screen
  ctx.fillStyle = "#1E3E62";
  ctx.fillRect(0, 0, cv.width, cv.height);
  // =========
  if (mod == "main") {
    map.droit();
  } else if (mod == "player") {
    droit_mini_map(map, player);
  }

  setTimeout(() => { main_loop(map, player, cycle_delay);}, cycle_delay);
}


