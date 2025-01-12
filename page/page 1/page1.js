const background = document.getElementById("background");
const m1 = document.getElementById("m1");

const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = window.innerWidth;
cv.height = window.innerHeight;

function resize_monster(monster,factor) {
  monster.size *= factor;
  monster.eye_x *= factor;
  monster.eye_y *= factor;
}

const monster1 = {
  x: cv.width / 2,
  y: cv.height / 2,
  start_size: 100,
  size: 100,
  eye_x: 0,
  eye_y: -17,
  color: "red",
  img: m1,
  mov: true,
};

const monster2 = {
  x: cv.width / 2,
  y: cv.height / 2,
  start_size: 30,
  size: 30,
  color: "#fff",
  mov: true,
};

const monster3 = {
  x: cv.width / 2,
  y: cv.height / 2,
  start_size: 20,
  size: 30,
  color: "#160033",
  mov: true,
};
let monsters = [];
let mouse_x;
let mouse_y;
let mov_monster = true;

function draw_background() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(background, 0, 0, cv.width, cv.height);
}

function draw_eye(monster, cx = 0, cy = 0) {
  let x = mouse_x;
  let y = mouse_y;
  let mov_center_x = monster.x / cv.width;
  let mov_center_y = monster.y / cv.height;
  let radius = monster.size / 6;
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
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.arc(monster.x + cx, monster.y + cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(monster.x + x + cx, monster.y + y + cy, radius / 4, 0, Math.PI * 2);
  ctx.fillStyle = monster.color;
  ctx.fill();
  ctx.stroke();
}

function draw_monster_body(monster) {
  ctx.drawImage(
    monster.img,
    monster.x - monster.size / 2,
    monster.y - monster.size / 2,
    monster.size,
    monster.size
  );
}

function draw_monster_eyes(monster, cx = 0,cy = 0) {
  draw_eye(monster, cx - monster.size / 5, cy);
  draw_eye(monster, cx + monster.size / 5, cy);
}

// add mouse move listener to whole page
addEventListener("mousemove", (e) => {
  // make mouse coords relative to the canvas  ignoring scroll in this case
  const bounds = canvas.getBoundingClientRect();
  mouse_x = e.pageX - bounds.left;
  mouse_y = e.pageY - bounds.top;
});

function lop() {
  draw_background();
  draw_monster(monster1);
  // draw_monster(monster2);
  // draw_monster(monster3);
  setTimeout(() => {
    lop();
  }, 100);
}

lop();

function draw_monster(monster) {
  if (monster.mov) {
    if (monster.size < cv.height / 2) {
      let x = Math.floor((Math.random() * 10 - 5) * 100);
      let mx = mouse_x;

      monster.x = mx + x < 0 ? 0 : mx + x > cv.width ? cv.width : mx + x;

      resize_monster(monster,1.1)

      monster.mov = false;
      setTimeout(() => {
        monster.mov = true;
      }, Math.floor((Math.random() * 10 + 1) * 500));
    } else {
      monster.mov = false;
      setTimeout(() => {
        monster.size = monster.start_size;
        monster.mov = true;
      }, Math.floor((Math.random() * 10 + 1) * 1000));
    }
  }
  draw_monster_body(monster);
  draw_monster_eyes(monster,monster.eye_x,monster.eye_y);
}

function draw_monsters() {}
