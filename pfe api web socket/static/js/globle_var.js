// PARAMETERS ==
 const playerName = document.getElementById("player_name").innerText;
 const game_id = document.getElementById("game_id").innerText;
 const game_type = document.getElementById("game_type").innerText;


// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight - 4;

// DOM ==
const keys_Counter = document.getElementById('keys_Counter')
const spectat_name = document.getElementById('spectat-name')
const info = document.getElementById("info");
const chat = document.getElementById("chat");
chat.style.display = "none";

const chat_messages = document.getElementById("messages");
const chat_input_text = document.getElementById("input_text");
const send = document.getElementById("send");
const rede = document.getElementById("rede");
const spec = document.getElementById("spec");
spec.style.display = "none"



// TEXTURES ==


const origin = window.location.origin

const hand_img = new Image();
hand_img.src = origin + "/static/img/pov.png";
const wallTexture_1 = new Image();
wallTexture_1.src = origin + "/static/img/wall_2d.jpg";
const wallTexture_2 = new Image();
wallTexture_2.src = origin + "/static/img/wall_2w.png";

const playerTexture_1_Front = new Image();
playerTexture_1_Front.src = origin + "/static/img/monsterFront.png";
const playerTexture_1_Back = new Image();
playerTexture_1_Back.src = origin + "/static/img/monsterBack.png";
const playerTexture_1 = [playerTexture_1_Front, playerTexture_1_Back];

const playerTexture_2_Front = new Image();
playerTexture_2_Front.src = origin + "/static/img/player_f.png";
const playerTexture_2_Back = new Image();
playerTexture_2_Back.src = origin + "/static/img/player_b.png";
const playerTexture_2 = [playerTexture_2_Front, playerTexture_2_Back];

const backgroundTexture_1 = new Image();
backgroundTexture_1.src = origin + "/static/img/Sky_2.jpg";

const doorTexture_1 = new Image();
doorTexture_1.src = origin + "/static/img/open_door.jpg";
const doorTexture_2 = new Image();
doorTexture_2.src = origin + "/static/img/door.jpg";

const keyTexture = new Image();
keyTexture.src = origin + "/static/img/key.png";



const Textures = {
  walls: [wallTexture_1, wallTexture_2],
  players: [playerTexture_1, playerTexture_2],
  background: backgroundTexture_1,
  door: [doorTexture_1, doorTexture_2],
  key: keyTexture
};

// AUDIO ==
const knife_stab = new Audio()
knife_stab.src = origin + "/static/audio/knife-stab.mp3";

const background_song = new Audio()
background_song.src = origin + "/static/audio/horror-background.mp3";
const footstep = new Audio()
footstep.src = origin + "/static/audio/footstep.mp3";
const get_key_audio = new Audio()
get_key_audio.src = origin + "/static/audio/key.mp3";

// CONTROLS ==


let key_number_of_game = 0

let MOUSE_CONTROLS = true;
const MOUSE_SENSITIVITY = 5;
let old_movementX = 0;

let AUDIO_ON = false
let KEY_CHAT = "KeyH";
let KEY_CLICK = "KeyK";
let KEY_Left = "ArrowLeft";
let KEY_Right = "ArrowRight";
let KEY_MOV = "Space";



