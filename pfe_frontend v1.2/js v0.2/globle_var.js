// PARAMETERS ==
const playerName = "player" + Math.floor(Math.random() * 1000);
const game_id = "test";
const MOUSE_SENSITIVITY = 0.002;

// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;

// DOM ==
const info = document.getElementById("info");
const chat = document.getElementById("chat");
chat.style.display = "none";

const chat_messages = document.getElementById("messages");
const chat_input_text = document.getElementById("input_text");
const send = document.getElementById("send");

// TEXTURES ==
const wallTexture_1 = new Image();
wallTexture_1.src = "img/wall_2.jpg";
const wallTexture_2 = new Image();
wallTexture_2.src = "img/wall_2d.jpg";

const playerTexture_1 = new Image();
playerTexture_1.src = "img/monster.png";
const playerTexture_2 = new Image();
playerTexture_2.src = "img/player_1.png";

const backgroundTexture_1 = new Image();
backgroundTexture_1.src = "img/Sky-night_1.jpg";
const backgroundTexture_2 = new Image();
backgroundTexture_2.src = "img/Stone-Floor_1.jpg";


const Textures = {
  walls: [wallTexture_1, wallTexture_2],
  players: [playerTexture_1, playerTexture_2],
  background: [backgroundTexture_1, backgroundTexture_2],
};

// AUDIO ==
const background_song = new Audio()
background_song.src = "audio/horror-background.mp3";


// CONTROLS ==

let MOUSE_CONTROLS = false;
let AUDIO_ON = false
// let MOUSE_LEFT = false;
// let MOUSE_RIGHT = false;
// let KEY_W = false;
let KEY_CHAT = "KeyH";
let KEY_CLICK = "KeyK";
let KEY_Left = "ArrowLeft";
let KEY_Right = "ArrowRight";
let KEY_MOV = "Space";



