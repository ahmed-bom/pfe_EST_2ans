// GET RANDOM MAP ====
function get_map(game) {
  fetch("http://127.0.0.1:8080/generate/DFS/" + game.map_size)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      game.map.array = data.maze;
      game.start_x = 1;
      game.start_y = 1;
      game.map.update();
      game.player.update(game.map, game.start_x, game.start_y);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// GET SOLVE

function get_solve(game, animate = false) {
  fetch("http://localhost:8080/solve/DFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maze: game.map.array,
      start: {
        x: game.start_x,
        y: game.start_y,
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
      if (animate) {
        animate_path(
          game.map,
          data.steps_to_solution,
          data.solution,
          game.cycle_delay
        );
      } else {
        draw_path(game.map, data.solution);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// ================================

// MINI MAP
function game_loop(game) {
  collision_detection(game);
  if (game.collision * game.go == 1) {
    game.player.mov()
  }
  game.player.angle += game.player.rotate_spied * game.player.rotate_dir;
  game.map.droit_min_map();
  game.player.droit();
}

function collision_detection(game) {
  let p = game.player;
  let map = game.map;
  let x = p.x + Math.round(Math.sin(p.angle));
  let y = p.y + Math.round(Math.cos(p.angle));

  if (map.array[y][x] == 1) {
    game.collision = 0;
  } else {
    game.collision = 1;
  }
}

// ================================

// DRAW PATH

function draw_path(map, solution) {
  for (let i = 0; i < solution.length; i++) {
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map.array[x][y] = 2;
  }
}

// ANIMATE PATH

function animate_path(
  map,
  steps_to_solution,
  solution,
  cycle_delay = 100,
  i = 0
) {
  if (i == steps_to_solution.length) {
    draw_path(map, solution);
    return 0;
  }
  path = steps_to_solution[i];
  let x = path[0];
  let y = path[1];
  map.array[x][y] = 3;
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
  array2D[dim - 2][dim - 2] = 5;
  return array2D;
}

// ================================

function switch_mode(game) {
  if (game.mod == "main") {
    game.mod = "player";
  } else if (game.mod == "player") {
    game.mod = "main";
  }
}

function main_loop(game) {
  // refresh screen
  game.ctx.fillStyle = "#1E3E62";
  game.ctx.fillRect(0, 0, cv.width, cv.height);
  // =========
  if (game.mod == "main") {
    game.map.droit();
  } else if (game.mod == "player") {
    game_loop(game);
  }

  setTimeout(() => {
    main_loop(game);
  }, game.cycle_delay);
}

