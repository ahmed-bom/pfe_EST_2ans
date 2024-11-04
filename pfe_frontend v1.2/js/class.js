// MINI MAP ==
class MINI_MAP {
  constructor(scale, map) {
    this.array = map;
    this.size = map.length;
    this.scale = scale;

    if (this.size >= 10) {
      this.visible_part = 10;
    } else {
      this.visible_part = this.size;
    }
    this.start_i = 0;
    this.start_j = 0;
    this.dir_i = 0;
    this.dir_j = 0;
  }
  update(scale=this.scale) {
    this.size = this.array.length;
    this.scale = scale
    if (this.size >= 10) {
      this.visible_part = 10;
    } else {
      this.visible_part = this.size;
    }
  }
  droit_carer(x, y, color, d = 0) {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * this.scale,
      y * this.scale,
      this.scale - d,
      this.scale - d
    );
  }
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
            this.droit_carer(new_i, new_j, "white");
            break;
          case 1:
            this.droit_carer(new_i, new_j, "black");
            break;
          case 2:
            this.droit_carer(new_i, new_j, "red");
            break;
          case 3:
            this.droit_carer(new_i, new_j, "blue");
            break;
          case 4:
            this.droit_carer(new_i, new_j, "green");
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
            this.droit_carer(i, j, "white", 1);
            break;
          case 1:
            this.droit_carer(i, j, "black");
            break;
          case 2:
            this.droit_carer(i, j, "red",1);
            break;
          case 3:
            this.droit_carer(i, j, "blue",1);
            break;
          case 4:
            this.droit_carer(i, j, "green");
            break;
        }
      }
    }
  }
}

// ==========================
// ==========================

// PLAYER ==
class PLAYER {
  constructor(x, y, angle, map_object) {
    this.x = x;
    this.y = y;
    this.dir_x = 0;
    this.dir_y = 0;
    this.new_y = this.x * map_object.scale;
    this.new_x = this.y * map_object.scale;
    this.angle = angle;
    this.rotate_dir = 0;
    this.rotate_spied = 0.1;
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.visible_part = map_object.visible_part;
  }
  update(map_object) {
    this.new_y = this.x * map_object.scale;
    this.new_x = this.y * map_object.scale;
    this.map_scale = map_object.scale;
    this.map_size = map_object.size;
    this.visible_part = map_object.visible_part;
  }
  mov() {
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);

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
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);
    if (
      (mov_x < 0 && this.new_x > this.map_scale) ||
      (mov_x > 0 &&
        this.new_x < this.visible_part * this.map_scale - 2 * this.map_scale)
    ) {
      this.new_x += this.map_scale * mov_x;
    }
    if (
      (mov_y < 0 && this.new_y > this.map_scale) ||
      (mov_y > 0 &&
        this.new_y < this.visible_part * this.map_scale - 2 * this.map_scale)
    ) {
      this.new_y += this.map_scale * mov_y;
    }

    //Draw a Circle
    ctx.fillStyle = "Red";
    ctx.beginPath();
    ctx.arc(
      this.new_x + this.map_scale / 2,
      this.new_y + this.map_scale / 2,
      this.map_scale / 3,
      0,
      pi2
    );
    ctx.fill();
    // Draw a Line
    ctx.beginPath();
    ctx.moveTo(
      this.new_x + this.map_scale / 2,
      this.new_y + this.map_scale / 2
    );
    ctx.lineTo(
      this.new_x + this.map_scale / 2 + Math.sin(this.angle) * this.map_scale,
      this.new_y + this.map_scale / 2 + Math.cos(this.angle) * this.map_scale
    );
    ctx.lineWidth = this.map_scale / 10;
    ctx.strokeStyle = "Red";
    ctx.stroke();
  }
}
