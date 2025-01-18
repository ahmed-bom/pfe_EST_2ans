// PARAMETERS ==
const playerName = "player" + Math.floor(Math.random() * 1000);
// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;
const pi2 = Math.PI * 2;
// DOM ==
// const ready_button = document.getElementById("ready_button");

const info = document.getElementById("info");
const chat = document.getElementById("chat");
const chat_messages = document.getElementById("messages");

const chat_input_text = document.getElementById("input_text");
const send = document.getElementById("send");
chat.style.display = "none";

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
    players_info: [
      {
        name: "player228",
        type: "NULL",
        x: 1,
        y: 1,
        angle: 1.57,
      },
    ],
  },
};

new_player_connected = {
  type: "new_connected",
  from: "player402",
  content: {
    name: "player402",
    type: "NULL",
    x: 1,
    y: 1,
    angle: 1.57,
  },
};

players_position = {
  type: "players_position",
  from: "server",
  content: [
    {
      x: 2.4999995243977517,
      y: 1.0011944900661,
      angle: 1.57,
    },
    {
      x: 1,
      y: 1,
      angle: 1.57,
    },
  ],
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

Message = {
  type: "message",
  from: "name",
  content: "message content",
};

function test(data) {
  console.log("test");
  console.log(data);
}
