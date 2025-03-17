// export json ==

response = {
  type: "type",
  from: "from_name",
  content: "content",
};

connected_successfully = {
  from: "server",
  type: "enter_lobe",
  content: {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    players_info: {
      player247: {
        type: "NULL",
        x: 1.5,
        y: 1.5,
        angle: 0,
      },
    },
    keys: {},
  },
};

new_player_connected = {
  from: "player428",
  type: "new_connected",
  content: {
    type: "NULL",
    x: 1.5,
    y: 1.5,
    angle: 0,
  },
};

players_position = {
  from: "server",
  type: "players_position",
  content: {
    player598: {
      type: "NULL",
      x: 1.5,
      y: 1.5,
      angle: 0,
    },
  },
};

game_start = {
  from: "server",
  type: "game_start",
  content: {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 2, 0, 0, 1, 2, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    players_info: {
      player247: {
        type: "prey",
        x: 5.5,
        y: 9.5,
        angle: 0,
      },
      player428: {
        type: "hunter",
        x: 1.5,
        y: 9.5,
        angle: 0,
      },
    },
    keys: {
      77: [7, 7],
    },
  },
};

kill = {
  type: "kill",
  from: "player433",
  content: "player200",
};

get_key = {
  type: "get_key",
  from: "player454",
  content: {
    x: 1,
    y: 5,
  },
};

Message = {
  type: "message",
  from: "name",
  content: "message content",
};

function test(data) {
  console.log("test");
  listener(data);
}
