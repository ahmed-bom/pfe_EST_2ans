// START ====
function START(map,player) {
  fetch("http://127.0.0.1:8080/generate/DBF/" + map_size)//todo map size
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      map.array = data.maze;
      map.update()
      player.update(map)
      // render_mini_map(map, player);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// ================================
// ================================
// MINI MAP
function render_mini_map(map, p) {
  // collision
  collision_detection(map, p);
  // MOV MINI MAP
  mov_mini_map(map, p);
  // DROIT  
  if (siecle == 2) {
    // refresh screen
    ctx.fillStyle = "#1E3E62";
    ctx.fillRect(0, 0, cv.width, cv.height);
    // =========
    map.droit_min_map(p);
    p.droit();
    p.mov();
    siecle = 0;
  }
  siecle++;
  setTimeout(()=>{render_mini_map(map,p)}, cycle_delay);
}

function collision_detection(map, p) {
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
// ================================

// GET SOLVE

function get_solve(array, start_x, start_y) {
  fetch("http://localhost:8080/solve/DBF", {
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
      animate_path(array,data.all_path, data.solution);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// DRAW PATH

function draw_path(map,solution) {
  for (let i = 0; i < solution.length; i++) {
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map[x][y] = 2;
  }
}

// ANIMATE PATH

function animate_path(map,solution_path, solution, i = 0) {
  if (i == solution_path.length) {
    draw_path(map,solution);
    return 0;
  }
  path = solution_path[i];
  let x = path[0];
  let y = path[1];
  map[x][y] = 3;
  i++;
  setTimeout(() => {
    animate_path(map,solution_path, solution, i);
  }, cycle_delay);
}

// ================================
// ================================

function create2DArray(dim) {
  const array2D = [];
  for (let i = 0; i < dim; i++) {
    array2D.push(new Array(dim).fill(0));
  }
  array2D[0][0] = 4;
  array2D[dim - 1][dim - 1] = 2;
  return array2D;
}

