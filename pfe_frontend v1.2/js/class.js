class game_object {
  constructor(ctx, cv) {
    this.map_size = 15;
    this.scale = cv.height / this.map_size;
    this.mod = "main";

    this.start_x = 1;
    this.start_y = 1;

    this.ctx = ctx;
    this.map = new MAP(this.scale, create2DArray(this.map_size), ctx);
    this.player = new PLAYER(
      this.start_x,
      this.start_y,
      Math.PI / 2,
      this.map,
      ctx
    );

    this.collision = 1;
    this.go = 0;
    // FPC
    this.FPC = 15;
    this.cycle_delay = Math.floor(1000 / this.FPC);
  }
}

class MAP {
  constructor(scale, map, ctx) {
    this.array = map;
    this.size = map.length;
    this.scale = scale;
    this.ctx = ctx;
    this.vp = 10;

    if (this.size >= this.vp) {
      this.visible_part = this.vp;
    } else {
      this.visible_part = this.size;
    }
    this.start_i = 0;
    this.start_j = 0;
    this.dir_i = 0;
    this.dir_j = 0;
  }

  update() {
    this.size = this.array.length;
    if (this.size >= this.vp) {
      this.visible_part = this.vp;
    } else {
      this.visible_part = this.size;
    }
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

  // mini_map() {
  //   if ((this.visible_part = this.vp)) {
  //     this.droit_min_map();
  //   } else {
  //     this.droit();
  //   }
  // }

  // TODO reviou
  droit_min_map() {
    let new_i;
    let new_j;
    for (let i = this.start_i; i < this.start_i + this.visible_part; i++) {
      for (let j = this.start_j; j < this.start_j + this.visible_part; j++) {
        new_i = i - this.start_i;
        new_j = j - this.start_j;
        this.droit_square(new_i, new_j, this.array[j][i]);
      }
    }
  }

  mov_mini_map(p) {
    let mov_x = Math.round(Math.sin(p.angle)) ;
    let mov_y = Math.round(Math.cos(p.angle)) ;
    //for -2 is because the last line start in 0 an you should end in the last line-1
    // TOD reviou

    // if (
    // (p.screen_x == 1 && mov_x < 0) ||
    // (p.screen_y == 1 && mov_y < 0) ||
    // (p.screen_x == this.visible_part - 2 && mov_x > 0) ||
    // (p.screen_y == this.visible_part - 2 && mov_y > 0)
    // ) {
    // if (
    // this.start_i + mov_x >= 0 &&
    // this.start_i  + mov_x <= this.size - this.visible_part &&
    // this.start_j + mov_y >= 0 &&
    // this.start_j + mov_y <= this.size - this.visible_part
    // ) {
    //   this.start_i += mov_x;
    //   this.start_j += mov_y;
    // }
    // }
    if (
      mov_x + p.screen_x > 0 &&
      mov_x + p.screen_x < this.visible_part - 1 &&
      mov_y + p.screen_y > 0 &&
      mov_y + p.screen_y < this.visible_part - 1
    ) {
      p.screen_x += mov_x;
      p.screen_y += mov_y;
    } else if (
      this.start_i + mov_x >= 0 &&
      this.start_i + mov_x <= this.size - this.visible_part &&
      this.start_j + mov_y >= 0 &&
      this.start_j + mov_y <= this.size - this.visible_part
    ) {
      this.start_i += mov_x;
      this.start_j += mov_y;
      console.log("click map");
    }
  }

  droit() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.droit_square(i, j, this.array[j][i]);
      }
    }
  }
}

// ==========================
// ==========================

class PLAYER {
  constructor(x, y, angle, map_object, ctx) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.map_visible_part = map_object.visible_part;

    this.dir_x = 0;
    this.dir_y = 0;
    this.rotate_dir = 0;
    this.rotate_spied = 0.1;

    this.screen_x = this.x;
    this.screen_y = this.y;
    this.ctx = ctx;
  }

  update(map_object, start_x, start_y) {
    this.x = start_x;
    this.y = start_y;
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.map_visible_part = map_object.visible_part;
  }

  mov(map) {
    // angle movements
    let mov_x = Math.round(Math.sin(this.angle)) ;
    let mov_y = Math.round(Math.cos(this.angle)) ;
    // TODO reviou
    if (
      mov_x + this.x > 0 &&
      mov_x + this.x < this.map_size - 1 &&
      mov_y + this.y > 0 &&
      mov_y + this.y < this.map_size - 1
    ) {
      this.x += mov_x;
      this.y += mov_y;
      map.mov_mini_map(this);
      return true;
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
