// START ====

function START() {
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
    collision_detection();
  // MOV MINI MAP
    mov_mini_map()
  // =========
  // CHANGE MAZE 

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


function collision_detection() {
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

function mov_mini_map(){
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
