class game_object {
  constructor(ctx, cv) {
    this.map_size = 21;
    this.scale = cv.height / this.map_size;
    this.mini_map_visible_part = 10;

    this.mod = "main";
    this.collision = 1;
    this.go = 0;
    this.test_mov = 1;

    this.FPC = 20;
    this.cycle_delay = Math.floor(1000 / this.FPC);

    this.start_x = 1;
    this.start_y = 1;
    this.start_angle = Math.PI / 2;

    this.ctx = ctx;

    this.map = new MAP(this);
    this.player = new PLAYER(this);
  }

  collision_detection() {
    let p = this.player;
    let map = this.map;

    let x = p.x + Math.round(Math.sin(p.angle));
    let y = p.y + Math.round(Math.cos(p.angle));

    if (map.array[y][x] == 1) {
      this.collision = 0;
    } else {
      this.collision = 1;
    }
  }

  game_loop() {
    this.player.angle += this.player.rotate_spied * this.player.rotation;
    this.collision_detection();
    //  mov = if collision and go == 1  else 0
    let mov = this.collision * this.go;
    // angle movements * mov
    let mov_x = Math.round(Math.sin(this.player.angle)) * mov;
    let mov_y = Math.round(Math.cos(this.player.angle)) * mov;

    this.player.mov(mov_x, mov_y, this.map);

    this.map.droit_min_map();
    this.player.droit();

  }
}

class MAP {
  constructor(game) {
    this.game = game;
    this.array = create2DArray(game.map_size);
    this.size = game.map_size;
    this.scale = game.scale;
    this.ctx = game.ctx;
    this.vp = game.mini_map_visible_part;

    if (this.size >= this.vp) {
      this.visible_part = this.vp;
    } else {
      this.visible_part = this.size;
    }

    this.start_i = 0;
    this.start_j = 0;
  }

  droit_square(x, y, square) {
    let color;
    switch (square) {
      case 0:
        color = "white";
        break;
      case 1:
        color = "black";
        break;
      case 2:
        color = "red";
        break;
      case 3:
        color = "blue";
        break;
      case 4:
        color = "green";
        break;
      case 5:
        color = "orange";
        break;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
  }

  // TODO reviou
  droit_min_map() {
    let new_i = this.start_i;
    let new_j = this.start_j;
    for (let i = 0; i < this.visible_part; i++) {
      for (let j = 0; j < this.visible_part; j++) {
        this.droit_square(i, j, this.array[new_i][new_j]);
        new_j += 1;
      }
      new_j = this.start_j;
      new_i += 1;
    }
  }

  droit() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.droit_square(i, j, this.array[j][i]);
      }
    }
  }

  mov_mini_map(mov_x, mov_y) {
    let start = -1;
    let end = this.size;
    let nex_start_i = this.start_i + mov_x;
    let nex_start_j = this.start_j + mov_y;
    let nex_end_i = nex_start_i + this.visible_part - 1;
    let nex_end_j = nex_start_j + this.visible_part - 1;

    if (nex_start_i > start && nex_end_i < end ) {
      this.start_i += mov_x;
    }
    if (nex_start_j > start && nex_end_j < end) {
      this.start_j += mov_y;
    }

    // if (
    //   nex_start_i > start &&
    //   nex_start_j > start &&
    //   nex_end_i < end &&
    //   nex_end_j < end &&
    //   mov_x + mov_y != 0
    // ) {
    //   this.start_i += mov_x;
    //   this.start_j += mov_y;
    //   this.game.test_mov += 1;
    // }
  }
}

// ==========================
// ==========================

class PLAYER {
  constructor(game) {
    this.game = game;

    this.x = game.start_x;
    this.y = game.start_x;

    this.angle = game.start_angle;
    this.rotation = 0;
    this.rotate_spied = 0.1;

    this.map_scale = game.scale;;

    this.screen_x = this.x;
    this.screen_y = this.y;
    this.ctx = ctx;
  }

  mov(mov_x, mov_y, map) {
    let start = 0;
    let end = this.game.map_size - 1;
    let new_x = this.x + mov_x;
    let new_y = this.y + mov_y;
    // let mov = 0;
    // if (
    //   mov_x != 0 &&
    //   this.x + mov_x > limit_start &&
    //   this.x + mov_x < limit_end
    // ) {
    //   this.x += mov_x;
    //   mov = 1;
    // }
    // if (
    //   mov_y != 0 &&
    //   this.y + mov_y > limit_start &&
    //   this.y + mov_y < limit_end
    // ) {
    //   this.y += mov_y;
    //   mov = 1;
    // }
    // if (mov) {
    //   this.mov_in_mini_map(mov_x, mov_y, map);
    // }
    if (
      new_x > start &&
      new_y > start &&
      new_x < end &&
      new_y < end &&
      (mov_x != 0 || mov_y != 0) 
    ) {
      this.x += mov_x;
      this.y += mov_y;
      this.mov_in_mini_map(mov_x, mov_y, map);
    } 
  }

  mov_in_mini_map(mov_x, mov_y, map) {
    let start = 0;
    let end = this.game.mini_map_visible_part - 1;
    let new_screen_x = this.screen_x + mov_x;
    let new_screen_y = this.screen_y + mov_y;
    // let mov = 0;
    // if (
    //   mov_x != 0 &&
    //   this.screen_x + mov_x > limit_start &&
    //   this.screen_x + mov_x < limit_end
    // ) {
    //   this.screen_x += mov_x;
    //   mov = 1;
    // }
    // if (
    //   mov_y != 0 &&
    //   this.screen_y + mov_y > limit_start &&
    //   this.screen_y + mov_y < limit_end
    // ) {
    //   this.screen_y += mov_y;
    //   mov = 1;
    // }
    // if (!mov) {
    //   map.mov_mini_map(mov_x, mov_y);
    // }
    if (
      new_screen_x > start &&
      new_screen_y > start &&
      new_screen_x < end &&
      new_screen_y < end
    ) {
      this.screen_x += mov_x;
      this.screen_y += mov_y;
    } else {
      map.mov_mini_map(mov_x, mov_y);
    }
  }
  droit() {
    // move in mini map ===========
    let x_scale = this.screen_x * this.map_scale;
    let y_scale = this.screen_y * this.map_scale;

    //Draw a Circle
    this.ctx.fillStyle = "Red";
    this.ctx.beginPath();
    this.ctx.arc(
      x_scale + this.map_scale / 2,
      y_scale + this.map_scale / 2,
      this.map_scale / 3,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    // Draw a Line
    this.ctx.beginPath();
    this.ctx.moveTo(x_scale + this.map_scale / 2, y_scale + this.map_scale / 2);
    this.ctx.lineTo(
      x_scale + this.map_scale / 2 + Math.sin(this.angle) * this.map_scale,
      y_scale + this.map_scale / 2 + Math.cos(this.angle) * this.map_scale
    );
    this.ctx.lineWidth = this.map_scale / 10;
    this.ctx.strokeStyle = "Red";
    this.ctx.stroke();
  }
}
