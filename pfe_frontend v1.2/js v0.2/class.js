class Game {
  constructor(ctx, cv, player_name) {
    this.ctx = ctx;
    this.cv = cv;
    this.scale = 40;

    this.status = "waiting";

    this.map = null;

    this.player_name = player_name;
    this.players = {};
  }

  connected(obj) {
    this.status = "connected";
    this.map = {
      array: obj.content.map, // 2D array
    };
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
    let angle = p.angle;
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
      Math.abs(Math.cos(rayAngle)) > 0.0001 ? Math.cos(rayAngle) > 0 : null;
    const up =
      Math.abs(Math.sin(rayAngle)) > 0.0001 ? Math.sin(rayAngle) > 0 : null;

    let distToWall = 0;
    let hitWall = false;
    let wallX = 0;

    // Player's current cell
    let mapX = Math.floor(playerPos.x);
    let mapY = Math.floor(playerPos.y);

    // Ray's direction vector
    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);

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
    while (!hitWall) {
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

  render(RAYS, FOV, player_name, wallTexture) {
    // playerAngle, playerPos, this.cv, ctx, wallTexture;
    let p = this.players[player_name];
    let playerAngle = p.angle + Math.PI / 2;

    // Clear screen
    this.ctx.fillStyle = "#4a5a6a";
    this.ctx.fillRect(0, 0, this.cv.width, this.cv.height / 2);
    this.ctx.fillStyle = "#3a2a1a";
    this.ctx.fillRect(0, this.cv.height / 2, this.cv.width, this.cv.height / 2);

    // Cast rays
    for (let x = 0; x < RAYS; x++) {
      const rayAngle = playerAngle + (x / RAYS - 0.5) * FOV;
      const ray = this.castRay(rayAngle, player_name);

      // Remove fisheye effect
      const correctDistance = ray.distance * Math.cos(rayAngle - playerAngle);

      // Calculate wall height
      const wallHeight = (this.cv.height * 0.5) / correctDistance;
      const wallTop = (this.cv.height - wallHeight) / 2;
      const wallBottom = (this.cv.height + wallHeight) / 2;

      // Draw wall slice
      if (wallTexture.complete) {
        const textureX = Math.floor(ray.wallX * wallTexture.width);
        const brightness = ray.side === 1 ? 0.7 : 1;
        this.ctx.globalAlpha = brightness / (1 + correctDistance * 0.1);

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

        this.ctx.globalAlpha = 1;
      } else {
        const brightness = ray.side === 1 ? 0.7 : 1;
        const shade = Math.min(
          255,
          Math.floor(255 / (1 + correctDistance * 0.1))
        );
        this.ctx.fillStyle = `rgb(${shade * brightness},${shade * brightness},${
          shade * brightness
        })`;
        this.ctx.fillRect(x, wallTop, 1, wallBottom - wallTop);
      }
    }
  }
}
