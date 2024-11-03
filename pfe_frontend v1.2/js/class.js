// MINI MAP ==
//TODO change this.scale and this.size to var
class MINI_MAP {
  constructor() {}

  new_map(size, scale, map) {
    this.array = map;
    this.size = size * 2 + 1;
    // this.size = size;
    this.scale = scale;

    if (this.size >= 100) {
      this.visible_part = 10;
    } else {
    this.visible_part = this.size;
    }
    this.start_i = 0;
    this.start_j = 0;
    this.dir_i = 0;
    this.dir_j = 0;
  }

  droit() {
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
        if (this.array[j][i] == 1) {
          ctx.fillStyle = "Black";
          ctx.fillRect(
            new_i * this.scale,
            new_j * this.scale,
            this.scale,
            this.scale
          );
        } else if (this.array[j][i] == 2) {
          ctx.fillStyle = "Red";
          ctx.fillRect(
            new_i * this.scale,
            new_j * this.scale,
            this.scale,
            this.scale
          );
        } else if (this.array[j][i] == 3) {
          ctx.fillStyle = "Blue";
          ctx.fillRect(
            new_i * this.scale,
            new_j * this.scale,
            this.scale,
            this.scale
          );
        }
        else {
          ctx.fillStyle = "White";
          ctx.fillRect(
            new_i * this.scale,
            new_j * this.scale,
            this.scale,
            this.scale
          );
        }
      }
    }
  }
}


// ==========================
// ==========================


// PLAYER ==
class PLAYER {
  constructor() {}
  new_player(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dir_x = 0;
    this.dir_y = 0;
    this.new_y = this.x * map.scale;
    this.new_x = this.y * map.scale;
    this.angle = angle;
    this.rotate_dir = 0;
    this.rotate_spied = 0.1;
  }
  mov() {
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);

    if ((mov_x < 0 && this.x > 1) || (mov_x > 0 && this.x < map.size - 2)) {
      this.x += mov_x;
    }
    if ((mov_y < 0 && this.y > 1) || (mov_y > 0 && this.y < map.size - 2)) {
      this.y += mov_y;
    }
    this.angle += this.rotate_spied * this.rotate_dir;
  }

  droit() {
    let mov_x = Math.round(Math.sin(this.angle) * this.dir_x);
    let mov_y = Math.round(Math.cos(this.angle) * this.dir_y);
    if (
      (mov_x < 0 && this.new_x > map.scale) ||
      (mov_x > 0 && this.new_x < map.visible_part * map.scale - 2 * map.scale)
    ) {
      this.new_x += map.scale * mov_x;
    }
    if (
      (mov_y < 0 && this.new_y > map.scale) ||
      (mov_y > 0 && this.new_y < map.visible_part * map.scale - 2 * map.scale)
    ) {
      this.new_y += map.scale * mov_y;
    }

    //Draw a Circle
    ctx.fillStyle = "Red";
    ctx.beginPath();
    ctx.arc(
      this.new_x + map.scale / 2,
      this.new_y + map.scale / 2,
      map.scale / 3,
      0,
      pi2
    );
    ctx.fill();
    // Draw a Line
    ctx.beginPath();
    ctx.moveTo(this.new_x + map.scale / 2, this.new_y + map.scale / 2);
    ctx.lineTo(
      this.new_x + map.scale / 2 + Math.sin(this.angle) * map.scale,
      this.new_y + map.scale / 2 + Math.cos(this.angle) * map.scale
    );
    ctx.lineWidth = map.scale / 10;
    ctx.strokeStyle = "Red";
    ctx.stroke();
  }
}
