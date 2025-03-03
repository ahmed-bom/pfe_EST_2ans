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
const rede = document.getElementById("rede");
let ar_you_red = false

// TEXTURES ==
const wallTexture_1 = new Image();
wallTexture_1.src = "img/wall_2.jpg";
const wallTexture_2 = new Image();
wallTexture_2.src = "img/wall_2d.jpg";

const playerTexture_1_Front = new Image();
playerTexture_1_Front.src = "img/monster.png";
const playerTexture_1_Back = new Image();
playerTexture_1_Back.src = "img/monster.png";
const playerTexture_1 = [playerTexture_1_Front, playerTexture_1_Back];

const playerTexture_2_Front = new Image();
playerTexture_2_Front.src = "img/player_1.png";
const playerTexture_2_Back = new Image();
playerTexture_2_Back.src = "img/monster.png";
const playerTexture_2 = [playerTexture_2_Front, playerTexture_2_Back];

const backgroundTexture_1 = new Image();
backgroundTexture_1.src = "img/Sky-night_1.jpg";
const backgroundTexture_2 = new Image();
backgroundTexture_2.src = "img/Stone-Floor_1.jpg";

const doorTexture_1 = new Image();
doorTexture_1.src = "img/old-wooden-door-open.png";
const doorTexture_2 = new Image();
doorTexture_2.src = "img/old-wooden-door.png";

const keyTexture = new Image();
keyTexture.src = "img/key.png";



const Textures = {
  walls: [wallTexture_1, wallTexture_2],
  players: [playerTexture_1, playerTexture_2],
  background: [backgroundTexture_1, backgroundTexture_2],
  door: [doorTexture_1, doorTexture_2],
  key: keyTexture
};

// AUDIO ==
const background_song = new Audio()
background_song.src = "audio/horror-background.mp3";


// CONTROLS ==

let MOUSE_CONTROLS = false;
let AUDIO_ON = false
let KEY_CHAT = "KeyH";
let KEY_CLICK = "KeyK";
let KEY_Left = "ArrowLeft";
let KEY_Right = "ArrowRight";
let KEY_MOV = "Space";



