// export json ==

response = {
  type: "type",
  from: "from_name",
  content: "content",
};

connected_successfully = {
  type: "connected_successfully",
  from: "server",
  content: {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    players_info: {
      player341: {
        x: 1,
        y: 1,
        angle: 1.57,
        type: "NULL",
      },
    },
  },
};

new_player_connected = {
  type: "new_connected",
  from: "player847",
  content: {
    x: 1,
    y: 1,
    angle: 1.57,
    type: "NULL",
  },
};

players_position = {
  type: "players_position",
  from: "server",
  content: {
    player341: {
      x: 1.4999998414659172,
      y: 1.0003981633553667,
      angle: 1.57,
    },
    player847: {
      x: 1,
      y: 1,
      angle: 1.57,
    },
  },
};

game_start = {
  type: "game_start",
  from: "server",
  content: {
    map: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ],
    players_info: [
      {
        name: "player228",
        type: "prey",
        x: 1,
        y: 1,
        angle: 1.57,
      },
      {
        name: "player128",
        type: "prey",
        x: 1,
        y: 1,
        angle: 1.57,
      },
      {
        name: "player69",
        type: "hunter",
        x: 6,
        y: 6,
        angle: 1.57,
      },
    ],
    number_of_keys_to_win: 5,
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
