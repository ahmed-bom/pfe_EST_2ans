class MAP {
  constructor(scale, map) {
    this.array = map;
    this.size = map.length;
    this.scale = scale;
    this.vp = 5;

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

  droit_square(x, y, color, d = 1) {
    // d = 1 for scaling square 
    ctx.fillStyle = color;
    ctx.fillRect(
      x * this.scale*d,
      y * this.scale*d,
      this.scale * d,
      this.scale * d
    );
  }

  mini_map(p) {
    if ((this.visible_part = this.vp)) {
      this.droit_min_map(p);
    } else {
      this.droit();
    }
  }

  // TODO reviou
  droit_min_map(p) {
    let mov_i = Math.round(Math.sin(p.angle) * this.dir_i);
    let mov_j = Math.round(Math.cos(p.angle) * this.dir_j);
    if (
      (mov_i < 0 && this.start_i >= 1) ||
      (mov_i > 0 && this.start_i + this.visible_part < this.size)
    ) {
      this.start_i += mov_i;
    }
    if (
      (mov_j < 0 && this.start_j >= 1) ||
      (mov_j > 0 && this.start_j + this.visible_part < this.size)
    ) {
      this.start_j += mov_j;
    }
    let new_i;
    let new_j;
    for (let i = this.start_i; i < this.visible_part + this.start_i; i++) {
      for (let j = this.start_j; j < this.visible_part + this.start_j; j++) {
        new_i = i - this.start_i;
        new_j = j - this.start_j;
        switch (this.array[j][i]) {
          case 0:
            this.droit_square(new_i, new_j, "white");
            break;
          case 1:
            this.droit_square(new_i, new_j, "black");
            break;
          case 2:
            this.droit_square(new_i, new_j, "red");
            break;
          case 3:
            this.droit_square(new_i, new_j, "blue");
            break;
          case 4:
            this.droit_square(new_i, new_j, "green");
            break;
        }
      }
    }
  }

  droit() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        switch (this.array[j][i]) {
          case 0:
            this.droit_square(i, j, "white");
            break;
          case 1:
            this.droit_square(i, j, "black");
            break;
          case 2:
            this.droit_square(i, j, "red");
            break;
          case 3:
            this.droit_square(i, j, "blue");
            break;
          case 4:
            this.droit_square(i, j, "green");
            break;
        }
      }
    }
  }
}

// ==========================
// ==========================

class PLAYER {
  constructor(x, y, angle, map_object) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    //  map_object.scale/2 for min map
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.map_visible_part = map_object.visible_part;

    this.dir_x = 0;
    this.dir_y = 0;
    this.rotate_dir = 0;
    this.rotate_spied = 0.1;
  }

  update(map_object) {
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.map_visible_part = map_object.visible_part;
  }

  mov() {
    // angle movements
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);

    // 2 and (this.map_size - 1) => (stare + 1) and (end - 1) of map
    // you should stop 1 square before => 1 and (this.map_size - 2)
    if (
      (mov_x < 0 && this.x > 1) ||
      (mov_x > 0 && this.x < this.map_size - 2)
    ) {
      this.x += mov_x;
    }
    if (
      (mov_y < 0 && this.y > 1) ||
      (mov_y > 0 && this.y < this.map_size - 2)
    ) {
      this.y += mov_y;
    }
    this.angle += this.rotate_spied * this.rotate_dir;
  }

  droit() {
    // move in mini map ===========
    // angle movements
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);

    let x_scale = this.x * this.map_scale;
    let y_scale = this.y * this.map_scale;
    let visible_part_scale = this.map_visible_part * this.map_scale;

    // 2 and (this.map_size - 1) => (stare + 1) and (end - 1) of min map
    // you should stop 1 square before => 1 and (this.map_size - 2)
    // same just change (map size) bay (map visible part) and multiply ale by map scale
    if (
      (mov_x < 0 && x_scale > this.map_scale) ||
      (mov_x > 0 && x_scale < visible_part_scale - 2 * this.map_scale)
    ) {
      x_scale += this.map_scale * mov_x;
    }
    if (
      (mov_y < 0 && y_scale > this.map_scale) ||
      (mov_y > 0 && y_scale < visible_part_scale - 2 * this.map_scale)
    ) {
      y_scale += this.map_scale * mov_y;
    }
    // ============================

    // draw Arrow
    const arrowLength = this.map_scale * 4/6;
    let arrowAngel =   Math.PI/2;
    let x = x_scale + this.map_scale / 6;
    let y = y_scale + this.map_scale / 2;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineTo(
      x + (arrowLength / 3) * Math.sin(this.angle + arrowAngel),
      y + (arrowLength / 3) * Math.cos(this.angle + arrowAngel)
    );

    ctx.lineTo(
      x + arrowLength * Math.sin(this.angle),
      y + arrowLength * Math.cos(this.angle)
    );

    ctx.lineTo(
      x + (arrowLength / 3) * Math.sin(this.angle - arrowAngel),
      y + (arrowLength / 3) * Math.cos(this.angle - arrowAngel)
    );

    ctx.lineTo(x, y);
    ctx.fill();

      ctx.lineTo(x, y);
      ctx.fill();
      ctx.stroke();
  
  }
}
