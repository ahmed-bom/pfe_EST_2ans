class game_object {
  constructor(ctx, cv) {

    this.ctx = ctx;
    this.mod = "main";
    this.FPS = 20;
    this.cycle_delay = Math.floor(1000 / this.FPS);

    // map size == 2k + 1 for DFS
    this.map_size = 21;
    this.mini_map_visible_part = 7;

    this.smart_scaling();

    this.go = 0;
    this.rotation = 0;

    this.mov_spied = 1;
    this.rotate_spied = Math.PI / 8;
    
    this.map = new MAP(this);
    this.player = new PLAYER(this);
  }
  smart_scaling() {
    // TODO
    this.map_scale = cv.height / this.map_size;
    this.map_center_x = (cv.width - this.map_size * this.map_scale) / 2;
    this.min_map_scale = cv.height / 3 / this.mini_map_visible_part;
  }
  mov_validation(x, y) {
    // collision detection
    let collision = true;
    // if x y in map bounds else is a collision
    if (x > -1 && x < this.map_size && y > -1 && y < this.map_size) {
      collision = this.map.array[y][x] == 1;
    }
    //  mov = if collision false and go true
    return !collision * this.go;
  }
  game_loop() {
    this.player.mov();
    this.map.droit_min_map();
    this.player.droit_in_mini_map();
  }
  ray_cast(angle, MAX_DEPTH) {
    let distance = 0;
    let rayDirX = Math.sin(angle);
    let rayDirY = Math.cos(angle);
    while (distance < MAX_DEPTH) {
      let collision_check_rayX = Math.round(this.player.x + rayDirX * distance);
      let collision_check_rayY = Math.round(this.player.y + rayDirY * distance);
      // Check if ray hit a wall
      if (this.map.array[collision_check_rayY][collision_check_rayX] != 0) {
        return distance;
      }
      distance++;
    }
    return distance;
  }
}
//==================================================================
//==================================================================
class MAP {
  constructor(game) {
    this.game = game;
    this.array = create2DArray(game.map_size);
    // Ensure visible part is correctly
    this.visible_part = Math.min(
      this.game.mini_map_visible_part,
      this.game.map_size
    );
    // start position for min map
    this.start_i = 0;
    this.start_j = 0;
  }

  droit_square(x, y, square, scale, constant_x = 0, constant_y = 0) {
    const colorMap = {
      0: "white",
      1: "black",
      2: "#ff0000",
      3: "blue",
      4: "green",
      5: "orange",
    };
    // color mapping default is gray
    this.game.ctx.fillStyle = colorMap[square] || "gray";
    this.game.ctx.fillRect(
      x * scale + constant_x,
      y * scale + constant_y,
      scale,
      scale
    );
  }

  droit_min_map() {
    let map_i;
    let map_j;
    for (let i = 0; i < this.visible_part; i++) {
      for (let j = 0; j < this.visible_part; j++) {
        map_i = this.start_i + i;
        map_j = this.start_j + j;
        this.droit_square(
          i,
          j,
          this.array[map_j][map_i],
          this.game.min_map_scale
        );
      }
    }
  }
  droit() {
    for (let i = 0; i < this.game.map_size; i++) {
      for (let j = 0; j < this.game.map_size; j++) {
        this.droit_square(
          i,
          j,
          this.array[j][i],
          this.game.map_scale,
          this.game.map_center_x
        );
      }
    }
  }
  mov_mini_map(mov_x, mov_y) {
    let end = this.game.map_size;
    let nex_start_i = this.start_i + mov_x;
    let nex_start_j = this.start_j + mov_y;
    let nex_end_i = nex_start_i + this.visible_part - 1;
    let nex_end_j = nex_start_j + this.visible_part - 1;
    let p_x = this.game.player.x;
    let p_y = this.game.player.y;

    if (
      (nex_end_i - 1 == p_x && mov_x == 1) ||
      (nex_start_i + 1 == p_x && mov_x == -1) ||
      (nex_end_j - 1 == p_y && mov_y == 1) ||
      (nex_start_j + 1 == p_y && mov_y == -1)
    ) {
      if (nex_start_i > -1 && nex_end_i < end) {
        this.start_i = nex_start_i;
      }
      if (nex_start_j > -1 && nex_end_j < end) {
        this.start_j = nex_start_j;
      }
    }
  }
}
//==================================================================
//==================================================================
class PLAYER {
  constructor(game) {
    this.game = game;

    this.x = 1;
    this.y = 1;
    this.angle = Math.PI / 2;

    this.angle_vue = Math.PI / 3;
    this.max_distance = 5;
    this.rey_number = 20;
  }

  mov() {
    // angler movements
    let angle_mov_x = Math.round(Math.sin(this.angle));
    let angle_mov_y = Math.round(Math.cos(this.angle));
    // nex  x y
    let nex_x = this.x + angle_mov_x;
    let nex_y = this.y + angle_mov_y;
    // mov / rotate validation
    let mov = this.game.mov_validation(nex_x, nex_y);
    let rotate = this.game.rotate_spied * this.game.rotation;
    // player movement
    if (mov != 0) {
      let mov_x = mov * angle_mov_x;
      let mov_y = mov * angle_mov_y;

      this.x += mov_x;
      this.y += mov_y;
      this.game.map.mov_mini_map(mov_x, mov_y);
    }
    if (rotate != 0) this.rotate(rotate);
  }
  rotate(rotate) {
    if (this.angle + rotate < 2 * Math.PI && this.angle + rotate > 0) {
      this.angle += rotate;
    } else if (rotate > 0) {
      this.angle = 0;
    } else if (rotate < 0) {
      this.angle = 2 * Math.PI;
    }
  }
  droit_in_mini_map() {
    // + 0.5 for center of square
    let x_scale =
      (this.x - this.game.map.start_i + 0.5) * this.game.min_map_scale;
    let y_scale =
      (this.y - this.game.map.start_j + 0.5) * this.game.min_map_scale;


    this.game.ctx.fillStyle = "Red";
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      x_scale,
      y_scale,
      this.game.min_map_scale / 3,
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();

    // Direction line
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(x_scale, y_scale);
    this.game.ctx.lineTo(
      x_scale + Math.sin(this.angle) * this.game.min_map_scale,
      y_scale + Math.cos(this.angle) * this.game.min_map_scale
    );
    this.game.ctx.lineWidth = this.game.min_map_scale / 10;
    this.game.ctx.strokeStyle = "Red";
    this.game.ctx.stroke();
  }
}
