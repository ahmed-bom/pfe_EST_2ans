class Game {
  constructor(ctx, cv, player_name, Textures) {
    this.ctx = ctx;
    this.cv = cv;
    this.FPS = 60 / 1000;
    this.Textures = Textures;

    this.scale = 40;
    this.spectate_mod = false;
    this.map = null;
    this.key_number = 0;
    this.keys = {};

    this.player_name = player_name;
    this.player_name_render = player_name;
    this.player_view_angle = Math.PI / 3;
    this.player_view_distance = 10;
    this.players = {};
  }


  createWallLightSpot(x, centerX, radius) {
    // Calculate distance from center of view
    const distance = Math.abs(x - centerX);
    
    // Create a more circular light spot effect with sharper edges
    let intensity = 1 - Math.pow(distance / radius, 2); // Squared falloff for more circular shape
    intensity = Math.max(0, intensity); // Clamp to positive values
    
    // Make the falloff more pronounced for a spotlight effect
    // Higher exponent = sharper edge transition
    intensity = Math.pow(intensity, 3);
    
    return intensity;
}

  update(obj) {
    this.player_name_render = this.player_name;
    this.map = {
      array: obj.content.map, // 2D array
    };
    this.players = obj.content.players_info;
    this.keys = obj.content.keys;
    this.key_number = Object.keys(obj.content.keys).length;
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
    let p = this.players[this.player_name_render];
    if (p.type == "hunter") {
      return this.kill(p);
    } else if ("prey") {
      return this.get_key(p);
    }
  }

  kill(h) {
    for (let p_name in this.players) {
      if (p_name == this.player_name_render) continue;
      let p = this.players[p_name];

      if (
        Math.floor(h.x) == Math.floor(p.x) &&
        Math.floor(h.y) == Math.floor(p.y)
      ) {
        delete this.players[p_name];
        knife_stab.play();
        return true;
      }
    }
    return false;
  }

  player_get_killed(p_name) {
    if (p_name in this.players) {
      delete this.players[p_name];
    }
    if (this.player_name_render == p_name) {
      this.spectate();
      return 0;
    }
  }

  player_win(p_name) {
    if (p_name in this.players) {
      delete this.players[p_name];
    }
    if (this.player_name_render == p_name) {
      this.spectate();
      return 0;
    }
  }

  spectate() {
    spec.style.display = "block"
    console.log("spectate")
    for (let p in this.players) {
      if(this.player_name_render == p)continue;
      if (this.players[p].type == "prey") {
        this.player_name_render = p;
        spectat_name.innerHTML = p;
        return 0;
      }
    }
  }

  get_key(p) {
    let x = Math.floor(p.x);
    let y = Math.floor(p.y);
    let key = y + "" + x;
    if (key in this.keys) {
      delete this.keys[key];
      this.key_number--;
      get_key_audio.play();
      return true;
    }
    return false;
  }

  player_get_key(key_name) {
    if (key_name in this.keys) {
      delete this.keys[key_name];
      this.key_number--;
    }
  }

  droit(constant_x = 0, constant_y = 0) {
    this.droit_map(constant_x, constant_y);
    this.droit_keys(constant_x, constant_y);
    this.droit_players(constant_x, constant_y);
  }

  droit_keys(constant_x = 0, constant_y = 0) {
    for (let key in this.keys) {
      let key_position = this.keys[key];

      this.ctx.fillStyle = "orange";
      this.ctx.fillRect(
        key_position[1] * this.scale + constant_x,
        key_position[0] * this.scale + constant_y,
        this.scale,
        this.scale
      );
    }
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

  castRay(rayAngle, player_name_render) {
    let p = this.players[player_name_render];
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
    let door = false;
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
      if (map[mapY] && (map[mapY][mapX] === 1 || map[mapY][mapX] === 2)) {
        hitWall = true;
        if (map[mapY][mapX] === 2) {
          door = true;
        }
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
      door: door,
    };
  }
  draw_background(playerAngle) {

    const backgroundTexture = this.Textures.background;

    let sx = Math.sin(playerAngle % Math.PI/2) * cv.width
    //const c = 100
    //let m = Math.abs(xy) % c



    this.ctx.fillStyle = "#6a6a6a";
    this.ctx.fillRect(0, this.cv.height / 2, this.cv.width, this.cv.height );

    //ctx.beginPath();

    //for (let i = -(cv.width / 2); i < cv.width * 1.5; i+= c) {
      //ctx.moveTo(i, cv.height);
      //ctx.lineTo(this.cv.width/2,-100);
    //}
  
  
    //for (let i = cv.height / 2 +10; i < cv.height; i+= c) {
      //ctx.moveTo(0 , i + m);
      //ctx.lineTo(cv.width ,i + m);
    //}

    //ctx.stroke();



    if (backgroundTexture.complete) {
      
      this.ctx.drawImage(backgroundTexture, sx - cv.width, 0,cv.width, cv.height / 2);
      this.ctx.drawImage(backgroundTexture, sx, 0, cv.width, cv.height / 2);
      this.ctx.drawImage(backgroundTexture, sx + cv.width, 0,cv.width, cv.height / 2);
    } else {
      this.ctx.fillStyle = "#4a5a6a";
      this.ctx.fillRect(0, 0, this.cv.width, this.cv.height / 2);
    }
  }


  draw_keys(wallDistances) {
    const player = this.players[this.player_name_render];
    const map = this.map.array;
    
    // Collect and process key sprites
    const keySprites = Object.entries(this.keys)
      .filter(([k, key]) => {
        const mapX = key[1];
        const mapY = key[0];
        return map[mapY] && map[mapY][mapX] === 0;
      })
      .map(([k, key]) => {
        const mapX = key[1];
        const mapY = key[0];
        const dx = mapX + 0.5 - player.x;
        const dy = mapY + 0.5 - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const angleToKey = Math.atan2(dx, dy);
        const normalizedAngleToKey = angleToKey === -Math.PI ? Math.PI : angleToKey;
        const normalizedPlayerAngle = player.angle === -Math.PI ? Math.PI : player.angle;
  
        let relativeAngle = normalizedAngleToKey - normalizedPlayerAngle;
        
        return {
          mapX,
          mapY,
          distance,
          relativeAngle
        };
      })
      .filter(sprite => Math.abs(sprite.relativeAngle) <= this.player_view_angle / 2)
      .sort((a, b) => b.distance - a.distance);
  
    // Render sorted key sprites
    keySprites.forEach(sprite => {
      const dx = sprite.mapX + 0.5 - player.x;
      const dy = sprite.mapY + 0.5 - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const angleToKey = Math.atan2(dx, dy);
      const normalizedAngleToKey = angleToKey === -Math.PI ? Math.PI : angleToKey;
      const normalizedPlayerAngle = player.angle === -Math.PI ? Math.PI : player.angle;
  
      let relativeAngle = normalizedAngleToKey - normalizedPlayerAngle;
      
      const screenX = (0.5 + relativeAngle / this.player_view_angle) * canvas.width;
      const spriteHeight = ((canvas.height * 0.5) / distance) * 0.4;
      const spriteWidth = spriteHeight;
      const spriteTop = (canvas.height - spriteHeight) / 2;
  
      const leftBound = Math.max(0, Math.floor(screenX - spriteWidth / 2));
      const rightBound = Math.min(
        canvas.width,
        Math.ceil(screenX + spriteWidth / 2)
      );
      const keyTexture = this.Textures.key;
  
      if (keyTexture.complete) {
        for (let sx = leftBound; sx < rightBound; sx++) {
          const textureX = ((sx - (screenX - spriteWidth / 2)) / spriteWidth) * keyTexture.width;
  
          const columnDistance = distance * Math.cos(
            normalizedPlayerAngle + (sx / canvas.width - 0.5) * this.player_view_angle - normalizedAngleToKey
          );
  
          if (columnDistance < wallDistances[sx]) {
            const animationTime = Date.now() * 0.005;
            const floatAmplitude = Math.max(0.05 * (1 - distance / 5), 0);
            const floatOffset = Math.sin(animationTime + sprite.mapX + sprite.mapY) * floatAmplitude;
            
            ctx.drawImage(
              keyTexture,
              textureX, 0, 1, keyTexture.height,
              sx, 
              spriteTop + floatOffset * canvas.height, 
              1, 
              spriteHeight
            );
          }
        }
      }
    });
  }

  draw_Players(wallDistances) {
  const player = this.players[this.player_name_render];
  const map = this.map.array;

  // Collect and process player sprites
  const playerSprites = Object.entries(this.players)
    .filter(([p, otherPlayer]) => p !== this.player_name_render)
    .map(([p, otherPlayer]) => {
      const mapX = Math.floor(otherPlayer.x);
      const mapY = Math.floor(otherPlayer.y);

      // Skip if player is in a wall or outside map bounds
      if (!map[mapY] || map[mapY][mapX] !== 0) return null;

      const dx = otherPlayer.x - player.x;
      const dy = otherPlayer.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const angleToPlayer = Math.atan2(dx, dy);
      const normalizedAngleToPlayer = angleToPlayer === -Math.PI ? Math.PI : angleToPlayer;
      const normalizedPlayerAngle = player.angle === -Math.PI ? Math.PI : player.angle;

      let relativeAngle = normalizedAngleToPlayer - normalizedPlayerAngle;

      return {
        player: otherPlayer,
        distance,
        relativeAngle
      };
    })
    .filter(sprite => sprite && Math.abs(sprite.relativeAngle) <= this.player_view_angle / 2)
    .sort((a, b) => b.distance - a.distance);

  // Render sorted player sprites
  playerSprites.forEach(({ player: otherPlayer, distance, relativeAngle }) => {
    const dx = otherPlayer.x - player.x;
    const dy = otherPlayer.y - player.y;
    const angleToPlayer = Math.atan2(dx, dy);
    const normalizedAngleToPlayer = angleToPlayer === -Math.PI ? Math.PI : angleToPlayer;
    const normalizedPlayerAngle = player.angle === -Math.PI ? Math.PI : player.angle;

    const screenX = (0.5 + relativeAngle / this.player_view_angle) * canvas.width;
    const spriteHeight = (canvas.height * 0.5) / distance;
    const spriteWidth = spriteHeight;
    const spriteTop = (canvas.height - spriteHeight) / 2;

    const leftBound = Math.max(0, Math.floor(screenX - spriteWidth / 2));
    const rightBound = Math.min(
      canvas.width,
      Math.ceil(screenX + spriteWidth / 2)
    );

    const angleDiff = (otherPlayer.angle - angleToPlayer + Math.PI * 2) % (Math.PI * 2);
    const side = angleDiff > Math.PI / 2 && angleDiff < (Math.PI * 3) / 2 ? 0 : 1;

    const playerTexture =
      otherPlayer.type == "hunter"
        ? this.Textures.players[0][side]
        : this.Textures.players[1][side];

    if (playerTexture.complete) {
      for (let sx = leftBound; sx < rightBound; sx++) {
        const textureX = ((sx - (screenX - spriteWidth / 2)) / spriteWidth) * playerTexture.width;

        const columnDistance = distance * Math.cos(
          normalizedPlayerAngle + (sx / canvas.width - 0.5) * this.player_view_angle - angleToPlayer
        );

        if (columnDistance < wallDistances[sx]) {
          ctx.drawImage(
            playerTexture,
            textureX, 0, 1, playerTexture.height,
            sx, spriteTop, 1, spriteHeight
          );
        }
      }
    }
  });
}
draw_wal(side, wallX, Distance, x, door,player_type) {
  // Calculate wall height
  const wallHeight = (this.cv.height * 0.5) / Distance;
  const wallTop = (this.cv.height - wallHeight) / 2;
  const wallBottom = (this.cv.height + wallHeight) / 2;

  const centerX = this.cv.width / 2;
  const lightRadius = this.cv.width * 0.12;



    



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
      wallHeight
    );
  } else {
    this.ctx.fillStyle = side == 0 ? "#444444" : "#8d8d8d";
    this.ctx.fillRect(x, wallTop, 1, wallHeight);
  }

  if (door) {
    const doorTexture =
      this.key_number === 0 ? this.Textures.door[0] : this.Textures.door[1];
    const textureX = Math.floor(wallX * doorTexture.width);
    if (doorTexture.complete) {
      this.ctx.drawImage(
        doorTexture,
        textureX,
        0,
        1,
        doorTexture.height,
        x,
        wallTop,
        1,
        wallHeight
      );
    } else {
      this.ctx.fillStyle = "#3a2a1a";
      this.ctx.fillRect(x, wallTop, 1, wallHeight);
    }
  }



  if (player_type == "prey" || player_type == "NULL"){
    // Calculate base brightness from side and distance
    let brightness = side === 1 ? 0.7 : 1;
    brightness = brightness / (1 + Distance * 0.1);
          
    // Get the light spot intensity for this column
    const lightIntensity = this.createWallLightSpot(x, centerX, lightRadius);


      if (lightIntensity > 0.05) {
        const gradientAlpha = lightIntensity * 0.35;
        this.ctx.fillStyle = `rgba(255, 255, 230, ${gradientAlpha})`;
        this.ctx.fillRect(x, wallTop, 1, wallHeight);
        // Subtle highlight in the center
        if (lightIntensity > 0.8) {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${(lightIntensity - 0.8) * 0.5})`;
          this.ctx.fillRect(x, wallTop, 1, wallHeight);
        }
      }
    }


}
  render() {
    const RAYS = this.cv.width;
    const FOV = this.player_view_angle;
    const playerAngle = this.players[this.player_name_render].angle;
    const player_type = this.players[this.player_name_render].type
    const wallDistances = new Array(RAYS).fill(Infinity);
  
    this.draw_background(playerAngle);
  

  
    for (let x = 0; x < RAYS; x++) {
      const rayAngle = playerAngle + (x / RAYS - 0.5) * FOV;
      const ray = this.castRay(rayAngle, this.player_name_render);
  
      // Remove fisheye effect
      const correctDistance = ray.distance * Math.cos(rayAngle - playerAngle);
      wallDistances[x] = correctDistance;
  
      this.draw_wal(ray.side, ray.wallX, correctDistance, x, ray.door , player_type);
  
    }
  
    this.draw_keys(wallDistances);
    this.draw_Players(wallDistances);
    
    
    if ( player_type == "prey" || player_type == "NULL") {
      const handWidth = this.cv.width * 0.6;
      const handHeight = handWidth * (hand_img.height / hand_img.width);
      const handX = this.cv.width - handWidth;
      const handY = this.cv.height - handHeight;
      
      this.ctx.drawImage(hand_img, handX, handY, handWidth, handHeight);
    }
    
    this.droit()
    setTimeout(() => {
      this.render();
    }, this.FPS);
  }
}
