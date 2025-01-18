// AUDIO =====================
const Audio_control = document.getElementById("Audio_control");
const audio = document.getElementById("Audio");
audio.loop = true;
let isPlaying = false;

Audio_control.addEventListener("click", () => {
  isPlaying = !isPlaying;
  isPlaying ? audio.play() : audio.pause();
});

// CANVAS =====================
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight;
// BACKGROUND =====================
const background = document.getElementById("background");
function draw_background() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(background, 0, 0, cv.width, cv.height);
}
// MOUSE =====================
let mouse_x;
let mouse_y;

addEventListener("mousemove", (e) => {
  // make mouse coords relative to the canvas  ignoring scroll in this case
  const bounds = canvas.getBoundingClientRect();
  mouse_x = e.pageX - bounds.left;
  mouse_y = e.pageY - bounds.top;
});

// MONSTER =====================
const m1 = document.getElementById("m1");
const m0 = document.getElementById("m0");
const b = document.getElementById("b");

const monster0 = {
  x: cv.width / 2,
  y: cv.height / 2,
  size: 170,
  eye: {
    x: 0,
    y: -25,
    size: 12,
    color: "#000",
    color_sente: "red",
    distance: 20,
  },
  img: m0,
  b: b,
  mov: true,
};

const monster1 = {
  x: cv.width / 2,
  y: cv.height / 2,
  size: 170,
  eye: {
    x: 0,
    y: 8,
    size: 8,
    color: "#000",
    color_sente: "red",
    distance: 23,
  },
  img: m1,
  b: b,
  mov: true,
};

let monsters = [];
monsters.push(monster0, monster1);

function resize_monster(monster, factor) {
  monster.size *= factor;
  monster.eye.size *= factor;
  monster.eye.distance *= factor;
  monster.eye.y *= factor;
}

function draw_monster_eyes(monster) {
  draw_eye(monster, monster.eye.x - monster.eye.distance, monster.eye.y);
  draw_eye(monster, monster.eye.x + monster.eye.distance, monster.eye.y);
}

function draw_eye(monster, cx = 0, cy = 0) {
  let x = mouse_x;
  let y = mouse_y;
  let mov_center_x = monster.x / cv.width;
  let mov_center_y = monster.y / cv.height;
  let radius = monster.eye.size;
  // 0---1
  // |
  // 1
  x /= canvas.width;
  y /= canvas.height;

  //move look so that  is in center
  x -= mov_center_x;
  y -= mov_center_y;

  // scaling
  x *= radius;
  y *= radius;
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.fillStyle = monster.eye.color;
  ctx.arc(monster.x + cx, monster.y + cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = monster.eye.color_sente;
  ctx.arc(monster.x + x + cx, monster.y + y + cy, radius / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function draw_monster_body(monster) {
  // hed
  ctx.drawImage(
    monster.img,
    monster.x - monster.size / 2,
    monster.y - monster.size / 2,
    monster.size,
    monster.size
  );
  ctx.drawImage(
    monster.b,
    monster.x - monster.size ,
    monster.y + monster.size / 2,
    monster.size *2,
    monster.size *2
  );
  // body
  // ctx.fillStyle = "#000";
  // ctx.fillRect(
  //   monster.x - monster.size / 2,
  //   monster.y + monster.size / 2,
  //   monster.size,
  //   cv.height
  // );
}

function draw_monster(monster) {
  if (monster.mov) {
    if (monster.size < cv.height) {
      let x = Math.floor((Math.random() * 10 - 5) * 100);
      let mx = mouse_x;

      monster.x = mx + x < 0 ? 0 : mx + x > cv.width ? cv.width : mx + x;

      resize_monster(monster, 1.1);

      monster.mov = false;
      setTimeout(() => {
        monster.mov = true;
      }, Math.floor((Math.random() * 10 + 1) * 2000));
    } else {
      monster.mov = false;
      setTimeout(() => {
        resize_monster(monster, 0.5);
        monster.mov = true;
      }, Math.floor((Math.random() * 10 + 1) * 2000));
    }
  }
  draw_monster_body(monster);
  draw_monster_eyes(monster);
}

function draw_monsters() {
  for (let i = 0; i < monsters.length; i++) {
    draw_monster(monsters[i]);
  }
}

function lop() {
  draw_background();
  draw_monsters();
  setTimeout(() => {
    lop();
  }, 100);
}

lop();
