// GET RANDOM MAP ====
function get_map(game) {
  fetch("http://127.0.0.1:8080/generate/DFS/" + (game.map_size - 1) / 2)
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
      delate_from_2DArray(game.map, 2);
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

// DRAW PATH

function draw_path(map, solution) {
  for (let i = 1; i < solution.length - 1; i++) {
    path = solution[i];
    let x = path[0];
    let y = path[1];
    map.array[x][y] = 2;
  }
  delate_from_2DArray(map, 3);
}

// ANIMATE PATH

function animate_path(
  map,
  steps_to_solution,
  solution,
  cycle_delay = 100,
  i = 1
) {
  if (i == steps_to_solution.length - 1) {
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

function delate_from_2DArray(map, v) {
  let l = map.array.length;

  for (let i = 0; i < l; i++) {
    for (let j = 0; j < l; j++) {
      if (map.array[i][j] == v) {
        map.array[i][j] = 0;
      }
    }
  }
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
    game.game_loop();
  }

  setTimeout(() => {
    main_loop(game);
  }, game.cycle_delay);
}
