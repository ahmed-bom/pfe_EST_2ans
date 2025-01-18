class Game {
  constructor(ctx, cv, player_name) {
    this.ctx = ctx;
    this.cv = cv;
    this.scale = 40;

    this.status = "waiting";
    this.player_color = ["#0000ff", "#ff0000", "#00ff00", "#ff00ff"];

    this.map = null;

    this.player_name = player_name;
    this.player_id = null;
    // use id == index in players
    this.players = [];
  }

  update(obj) {
    this.status = "started";
    this.map = {
      array: obj.map, // 2D array
    };
    this.get_players(obj.players_info);
  }

  get_players(players) {
    this.players = [];
    for (let i = 0; i < players.length; i++) {
      let p = players[i];
      if (p.name == this.player_name) {
        this.player_id = i;
      }
      this.players.push(p);
    }
  }
  players_update(obj) {
    
    if (obj.length != this.players.length) {
      console.log("error count players");
      return 1;
    }
    for (let i = 0; i < obj.length; i++) {
      this.players[i].x = obj[i].x;
      this.players[i].y = obj[i].y;
      this.players[i].angle = obj[i].angle;
    }
  }
  droit(constant_x = 0, constant_y = 0) {
    this.droit_map(constant_x, constant_y);
    this.droit_players(constant_x, constant_y);
  }

  droit_min_map(constant_x = 0, constant_y = 0) {}

  droit_map(constant_x = 0, constant_y = 0) {
    let map_length_i = this.map.array.length;
    let map_length_j = this.map.array[0].length;
    for (let i = 0; i < map_length_i; i++) {
      for (let j = 0; j < map_length_j; j++) {
        this.droit_square(i, j, constant_x, constant_y);
      }
    }
  }

  droit_square(x, y, constant_x = 0, constant_y = 0) {
    // constant for adjusting position of map
    let square = this.map.array[x][y];
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
      x * this.scale + constant_x,
      y * this.scale + constant_y,
      this.scale,
      this.scale
    );
  }

  droit_players(constant_x = 0, constant_y = 0) {
    for (let i = 0; i < this.players.length; i++) {
      this.droit_player(this.players[i], constant_x, constant_y);
    }
  }

  droit_player(p, constant_x = 0, constant_y = 0) {
    // + 0.5 for center of square
    let x = p.x * this.scale + constant_x;
    let y = p.y * this.scale + constant_y;
    let angle = p.angle;
    let color;

    if (p.type == "hunter") {
      color = this.player_color[1];
    } else if (p.type == "prey") {
      color = this.player_color[2];
    }
    else if (p.name == this.player_name) {
      color = this.player_color[0];
    } else {
      color = this.player_color[3];
    }
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
}
