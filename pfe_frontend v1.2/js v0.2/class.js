class Game {
  constructor(ctx, cv, player_name, Textures) {
    this.ctx = ctx;
    this.cv = cv;
    this.Textures = Textures;

    this.scale = 40;
    this.spectate_mod = false;
    this.map = null;
    this.key_number = null;

    this.player_name = player_name;
    this.player_view_angle = Math.PI / 3;
    this.player_view_distance = 10;
    this.players = {};
  }

  connected(obj) {
    this.map = {
      array: obj.content.map, // 2D array
    };
    this.players = obj.content.players_info;
    for (let p in this.players) {
      this.players[p].color = getRandomColor();
    }
  }

  start(obj) {
    this.map = {
      array: obj.content.map, // 2D array
    };
    this.key_number = obj.number_of_keys_to_win;
    this.players = obj.content.players_info;
    for (let p in this.players) {
      this.players[p].color = getRandomColor();
    }
  }

  player_disconnected(name) {
    delete this.players[name];
  }

  new_connected(obj) {
    this.players[obj.from] = obj.content;
    this.players[obj.from].color = getRandomColor();
  }

  players_update_position(obj) {
    for (let p in obj.content) {
      this.players[p].x = obj.content[p].x;
      this.players[p].y = obj.content[p].y;
      this.players[p].angle = obj.content[p].angle;
    }
  }

  click() {
    let p = this.players[this.player_name];
    if (p.type == "hunter") {
      return this.kill(p);
    } else {
      return this.get_key(p);
    }
  }

  kill(h) {
    for (let p_name in this.players) {
      if (p_name == this.player_name) continue;
      let p = this.players[p_name];

      if (
        Math.floor(h.x) == Math.floor(p.x) &&
        Math.floor(h.y) == Math.floor(p.y)
      ) {
        delete this.players[p_name];
        return true;
      }
    }
    return false;
  }

  player_kill(p_name) {
    delete this.players[p_name];
    if (p_name == this.player_name) {
      this.spectate_mod = true;
      for (p_name in this.players) {
        if (this.players[p_name].type == "prey") {
          this.player_name = p_name;
          break;
        }
      }
      console.log("you are dead");
      this.render()
    }
  }

  get_key(p) {
    let x = Math.floor(p.x);
    let y = Math.floor(p.y);

    if (this.map.array[y][x] == 2) {
      this.map.array[y][x] = 0;
      this.key_number--;
      return true;
    }
    return false;
  }

  player_get_key(position) {
    if (this.map.array[position.y][position.x] === 2) {
      this.map.array[position.y][position.x] = 0;
      this.key_number--;
    }
  }

  droit(constant_x = 0, constant_y = 0) {
    this.droit_map(constant_x, constant_y);
    this.droit_players(constant_x, constant_y);
  }

  droit_map(constant_x = 0, constant_y = 0) {
    let map_length_i = this.map.array.length;
    let map_length_j = this.map.array[0].length;

    for (let i = 0; i < map_length_i; i++) {
      for (let j = 0; j < map_length_j; j++) {
        this.droit_square(i, j, constant_x, constant_y);
      }
    }
  }

  droit_square(i, j, constant_x = 0, constant_y = 0) {
    // constant for adjusting position of map
    let square = this.map.array[i][j];
    const colorMap = {
      0: "white",
      1: "black",
      2: "#ff0000",
      3: "blue",
      4: "green",
      5: "orange",
    };
    // color mapping default = gray
    this.ctx.fillStyle = colorMap[square] || "gray";
    this.ctx.fillRect(
      j * this.scale + constant_x,
      i * this.scale + constant_y,
      this.scale,
      this.scale
    );
  }

  droit_players(constant_x = 0, constant_y = 0) {
    for (let p in this.players) {
      this.droit_player(this.players[p], constant_x, constant_y);
    }
  }

  droit_player(p, constant_x = 0, constant_y = 0) {
    // + 0.5 for center of square
    let x = p.x * this.scale + constant_x;
    let y = p.y * this.scale + constant_y;
    let angle = p.angle; //- Math.PI / 2;
    let color;

    color = "red";
    // Player representation
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.scale / 3, 0, 2 * Math.PI);
    this.ctx.fill();

    // Direction line
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x + Math.sin(angle) * this.scale,
      y + Math.cos(angle) * this.scale
    );
    this.ctx.lineWidth = this.scale / 10;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  castRay(rayAngle, player_name) {
    let p = this.players[player_name];
    let playerPos = { x: p.x, y: p.y };
    const map = game.map.array;

    // Normalize angle
    rayAngle = rayAngle % (2 * Math.PI);
    if (rayAngle < 0) rayAngle += 2 * Math.PI;

    const right =
      Math.abs(Math.sin(rayAngle)) > 0.0001 ? Math.sin(rayAngle) > 0 : null;
    const up =
      Math.abs(Math.cos(rayAngle)) > 0.0001 ? Math.cos(rayAngle) > 0 : null;

    let distToWall = 0;
    let hitWall = false;
    let wallX = 0;

    // Player's current cell
    let mapX = Math.floor(playerPos.x);
    let mapY = Math.floor(playerPos.y);

    // Ray's direction vector
    const rayDirX = Math.sin(rayAngle);
    const rayDirY = Math.cos(rayAngle);

    // Length of ray from current position to next x or y-side
    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);

    // Calculate step and initial sideDist
    const stepX = right ? 1 : -1;
    const stepY = up ? 1 : -1;

    let sideDistX = right
      ? (Math.floor(playerPos.x + 1) - playerPos.x) * deltaDistX
      : (playerPos.x - Math.floor(playerPos.x)) * deltaDistX;

    let sideDistY = up
      ? (Math.floor(playerPos.y + 1) - playerPos.y) * deltaDistY
      : (playerPos.y - Math.floor(playerPos.y)) * deltaDistY;

    // DDA Algorithm
    let side;
    for (let i = 0; i < this.player_view_distance; i++) {
      if (hitWall) break;
      // Jump to next map square
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      // Check if ray has hit a wall
      if (map[mapY] && map[mapY][mapX] === 1) {
        hitWall = true;
        if (side === 0) {
          distToWall = (mapX - playerPos.x + (1 - stepX) / 2) / rayDirX;
          wallX = playerPos.y + distToWall * rayDirY;
        } else {
          distToWall = (mapY - playerPos.y + (1 - stepY) / 2) / rayDirY;
          wallX = playerPos.x + distToWall * rayDirX;
        }
        wallX -= Math.floor(wallX);
      }
    }

    return {
      distance: distToWall,
      side: side,
      wallX: wallX,
    };
  }
  draw_background() {
    const backgroundTexture = this.Textures.background;

    if (backgroundTexture[0].complete) {
      this.ctx.drawImage(
        backgroundTexture[0],
        0,
        0,
        this.cv.width,
        this.cv.height / 2
      );
    } else {
      this.ctx.fillStyle = "#4a5a6a";
      this.ctx.fillRect(0, 0, this.cv.width, this.cv.height / 2);
    }
    if (backgroundTexture[1].complete) {
      this.ctx.drawImage(
        backgroundTexture[1],
        0,
        this.cv.height / 2,
        this.cv.width,
        this.cv.height / 2
      );
    } else {
      this.ctx.fillStyle = "#3a2a1a";
      this.ctx.fillRect(
        0,
        this.cv.height / 2,
        this.cv.width,
        this.cv.height / 2
      );
    }
  }

  draw_wal(side, wallX, Distance, x) {
    // Calculate wall height
    const wallHeight = (this.cv.height * 0.5) / Distance;
    const wallTop = (this.cv.height - wallHeight) / 2;
    const wallBottom = (this.cv.height + wallHeight) / 2;

    const wallTexture =
      side === 0 ? this.Textures.walls[0] : this.Textures.walls[1];

    if (wallTexture.complete) {
      const textureX = Math.floor(wallX * wallTexture.width);

      this.ctx.drawImage(
        wallTexture,
        textureX,
        0,
        1,
        wallTexture.height,
        x,
        wallTop,
        1,
        wallBottom - wallTop
      );
    } else {
      this.ctx.fillStyle = side == 0 ? "#444444" : "#8d8d8d";
      this.ctx.fillRect(x, wallTop, 1, wallBottom - wallTop);
    }
  }

  draw_Players(wallDistances) {
    for (let p in this.players) {
      // Skip current player
      if (p == this.player_name) continue;
      const player = this.players[this.player_name];
      const otherPlayer = this.players[p];

      const mapX = Math.floor(otherPlayer.x);
      const mapY = Math.floor(otherPlayer.y);
      const map = this.map.array;
      // Skip if player is in a wall or outside map bounds
      if (!map[mapY] || map[mapY][mapX] !== 0) continue;

      const dx = otherPlayer.x - player.x;
      const dy = otherPlayer.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angleToPlayer = Math.atan2(dx, dy);

      // Determine relative angle and normalize it
      let relativeAngle = angleToPlayer - player.angle;

      // Check if player is within FOV
      const FOV = this.player_view_angle;
      if (Math.abs(relativeAngle) > FOV / 2) continue;

      const screenX = (0.5 + relativeAngle / FOV) * canvas.width;
      // Calculate wall height
      const spriteHeight = (canvas.height * 0.5) / distance;
      const spriteWidth = spriteHeight; // Assuming square sprite
      const spriteTop = (canvas.height - spriteHeight) / 2;

      // Calculate sprite screen boundaries
      const leftBound = Math.max(0, Math.floor(screenX - spriteWidth / 2));
      const rightBound = Math.min(
        canvas.width,
        Math.ceil(screenX + spriteWidth / 2)
      );

      // Draw sprite
      const playerTexture =
        otherPlayer.type == "hunter"
          ? this.Textures.players[0]
          : this.Textures.players[1];

      if (playerTexture.complete) {
        // Draw sprite column by column
        for (let sx = leftBound; sx < rightBound; sx++) {
          // Calculate texture x-coordinate
          const textureX =
            ((sx - (screenX - spriteWidth / 2)) / spriteWidth) *
            playerTexture.width;

          // Check if this column is behind a wall
          const columnDistance =
            distance *
            Math.cos(
              player.angle + (sx / canvas.width - 0.5) * FOV - angleToPlayer
            );

          if (columnDistance < wallDistances[sx]) {
            // Calculate visible portion of the sprite
            const visibleTop = spriteTop;
            const visibleHeight = spriteHeight;

            ctx.drawImage(
              playerTexture,
              textureX,
              0,
              1,
              playerTexture.height,
              sx,
              visibleTop,
              1,
              visibleHeight
            );
          }
        }
      }
    }
  }

  render() {
    const RAYS = this.cv.width;
    const FOV = this.player_view_angle;

    const playerAngle = this.players[this.player_name].angle;
    const wallDistances = new Array(RAYS).fill(Infinity);

    this.draw_background();

    // Cast rays
    for (let x = 0; x < RAYS; x++) {
      const rayAngle = playerAngle + (x / RAYS - 0.5) * FOV;
      const ray = this.castRay(rayAngle, this.player_name);

      // Remove fisheye effect
      const correctDistance = ray.distance * Math.cos(rayAngle - playerAngle); //cos
      wallDistances[x] = correctDistance;

      // Draw wall slice
      this.draw_wal(ray.side, ray.wallX, correctDistance, x);
    }
    this.draw_Players(wallDistances);
  }
}
