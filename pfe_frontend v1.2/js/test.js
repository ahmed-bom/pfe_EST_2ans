class game_object {
  constructor(ctx, cv) {
    this.ctx = ctx;
    // map size == 2k + 1 for DFS
    this.map_size = 21;
    this.mini_map_visible_part = 7;

    this.map_scale = cv.height / this.map_size;
    this.min_map_scale = cv.height / 3 / this.mini_map_visible_part;
    this.player_scale = this.min_map_scale / 3;

    this.mod = "main";
    this.go = 0;
    this.rotation = 0;
    this.rotate_spied = Math.PI / 8;

    this.FPS = 20;
    this.cycle_delay = Math.floor(1000 / this.FPS);

    this.start_x = 1;
    this.start_y = 1;
    this.start_angle = Math.PI / 2;

    this.map = new MAP(this);
    this.player = new PLAYER(this);
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
  Mov_sin(player_angle) {
    const PI_025 = Math.PI / 4;
    const e = 0.1;
    let R = 0;
    if (PI_025 - e < player_angle && player_angle < 3 * PI_025 + e) R = 1;
    else if (5 * PI_025 - e < player_angle && player_angle < 7 * PI_025 + e)
      R = -1;
    return R;
  }
  Mov_cos(player_angle) {
    const PI_025 = Math.PI / 4;
    const e = 0.1;
    let R = 0;
    if (7 * PI_025 - e < player_angle || player_angle < PI_025 + e) R = 1;
    else if (3 * PI_025 - e < player_angle && player_angle < 5 * PI_025 + e)
      R = -1;
    return R;
  }
  game_loop() {
    // angler movements
    let angle_mov_x = this.Mov_sin(this.player.angle);
    let angle_mov_y = this.Mov_cos(this.player.angle);
    // mov validation
    let nex_x = this.player.x + angle_mov_x;
    let nex_y = this.player.y + angle_mov_y;
    let mov = this.mov_validation(nex_x, nex_y);
    let rotate = this.rotate_spied * this.rotation;
    let mov_x = mov * angle_mov_x;
    let mov_y = mov * angle_mov_y;
    // player movement
    if (mov != 0) this.player.mov(mov_x, mov_y);
    if (rotate != 0) this.player.rotate(rotate);

    this.map.droit_min_map();
    this.player.droit_in_mini_map();
  }
  castRay(angle, MAX_DEPTH) {
    let rayX = this.player.x;
    let rayY = this.player.y;
    let distance = 0;

    let rayDirX = this.Mov_sin(angle);
    let rayDirY = this.Mov_cos(angle);

    while (distance < MAX_DEPTH) {
      distance++;
      let collision_check_rayX = player.x + rayDirX * distance;
      let collision_check_rayY = player.y + rayDirY * distance;
      rayX =
        Math.sin(angle) * this.min_map_scale * distance +
        this.min_map_scale / 2;
      rayY =
        Math.cos(angle) * this.min_map_scale * distance +
        this.min_map_scale / 2;

      // Check if ray is out of bounds
      if (
        collision_check_rayX < 0 ||
        collision_check_rayY < 0 ||
        collision_check_rayX > this.map_size ||
        collision_check_rayY > this.map_size
      ) {
        break;
      }

      // Check if ray hit a wall
      if (this.map.array[collision_check_rayY][collision_check_rayX] == 1) {
        console.log("test");
        return {
          distance: distance,
          rayX: rayX,
          rayY: rayY,
        };
      }
    }
    return {
      distance: MAX_DEPTH,
      rayX: rayX,
      rayY: rayY,
    };
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

  droit_square(x, y, square, scale) {
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
    this.game.ctx.fillRect(x * scale, y * scale, scale, scale);
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
        this.droit_square(i, j, this.array[j][i], this.game.map_scale);
      }
    }
    this.droit_square(1, 1, this.array[1][1]);
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

    this.x = game.start_x;
    this.y = game.start_y;
    this.angle = game.start_angle;
    this.angle_vue = Math.PI / 3;
    this.max_distance = 2;
    this.rey_number = 30;
  }

  mov(mov_x, mov_y) {
    this.x += mov_x;
    this.y += mov_y;
    this.game.map.mov_mini_map(mov_x, mov_y);
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
    let x_scale =
      (this.x - this.game.map.start_i) * this.game.min_map_scale +
      this.game.min_map_scale / 2;
    let y_scale =
      (this.y - this.game.map.start_j) * this.game.min_map_scale +
      this.game.min_map_scale / 2;
    // Cast rays
    let rayAngleStep = this.angle_vue / this.rey_number;
    let startAngle = this.angle - this.angle_vue / 2;

    for (let i = 0; i < this.rey_number; i++) {
      let rayAngle = startAngle + rayAngleStep * i;
      // let rayAngle = this.angle;
      let ray = this.game.castRay(rayAngle, this.max_distance);
      // Draw ray
      this.game.ctx.strokeStyle = "Red";
      this.game.ctx.beginPath();
      this.game.ctx.moveTo(x_scale, y_scale);
      this.game.ctx.lineTo(x_scale + ray.rayX, y_scale + ray.rayY);
      this.game.ctx.stroke();
    }
    // Player representation
    this.game.ctx.fillStyle = "Red";
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      x_scale,
      y_scale,
      this.game.player_scale / 2,
      0,
      2 * Math.PI
    );
    this.game.ctx.fill();

    // Direction line
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(x_scale, y_scale);
    this.game.ctx.lineTo(
      x_scale + Math.sin(this.angle) * this.game.player_scale * 2,
      y_scale + Math.cos(this.angle) * this.game.player_scale * 2
    );
    // this.game.ctx.lineWidth = this.game.min_map_scale / 10;
    this.game.ctx.strokeStyle = "Red";
    this.game.ctx.stroke();
  }
}
