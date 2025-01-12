// PARAMETERS ==
const playerName = "player" + Math.floor(Math.random() * 1000);
// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;
const pi2 = Math.PI * 2;

// CHAT ==
const chat = document.getElementById("chat");
const info = document.getElementById("info");
chat.style.display = "none";
// test for start game
let test_obj = {
  map: [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  players_info: [
    {
      name: "player624",
      type: "prey",
      x: 5,
      y: 6,
      angle: 1.57,
      speed: 0.5,
    },
    {
      name: "player269",
      type: "hunter",
      x: 0,
      y: 3,
      angle: 1.57,
      speed: 0.5,
    },
  ],
};
// test for players_position
let test_obj2 = [
  {
    x: 6.9999996829318345,
    y: 5.000796326710733,
    angle: 1.57,
  },
  {
    x: 0,
    y: 0,
    angle: 1.57,
  },
];
