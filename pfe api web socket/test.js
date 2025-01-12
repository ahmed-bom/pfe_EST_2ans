const playerName = "player" + Math.floor(Math.random() * 1000);
const info = document.getElementById("info");
const game = null;
try {
  var ws = new WebSocket("ws://127.0.0.1:8080/ws/test/" + playerName);
} catch (e) {
  console.log(e);
}

ws.onmessage = function (event) {
  data = JSON.parse(event.data);
  if (data.type == "message") {
    info.innerHTML += "<br>" + data.from + " :" + data.content + "<br>";
  }
  else if (data.type == "start_round") {
    console.log(data);
  } else if (data.type == "players_info") {
    players = data.content;
    clear();
    for (p in players) {
      droit(players[p]);
    }
  }
};

function send_data(data) {
  ws.send(data);
}

// CANVAS ==
const cv = document.getElementById("canvas");
const ctx = cv.getContext("2d");
cv.width = 800;
cv.height = 600;
const pi2 = Math.PI / 2;
const scale = 20;
// ================================
// ================================
// KEY DOWN ==

document.onkeydown = function KEY_DOWN(event) {
  //player_control_key_down
    switch (event.code) {
      case "Space":
        console.log("move");
        send_data('move');
        break;
    }
};

// KEY UP ====

// document.onkeyup = function (event) {
//   //player_control_key_up
//     switch (event.code) {
//       case "Space":
//         // send_data('stop mov');
//         break;
//     }
// };



function clear() {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, cv.width, cv.height);
}
function droit(p) {
  
  let x_scale = p.x * scale+scale/2;
  let y_scale = p.y * scale+scale/2;
  ctx.fillStyle = "Red";
  ctx.beginPath();
  ctx.arc(x_scale, y_scale, scale / 2, 0, 2 * Math.PI);
  ctx.fill();
  // Direction line
  ctx.beginPath();
  ctx.moveTo(x_scale, y_scale);
  ctx.lineTo(
    x_scale + Math.sin(p.angle) * scale + scale / 2,
    y_scale + Math.cos(p.angle) * scale + scale / 2
  );
  ctx.lineWidth = scale / 10;
  ctx.strokeStyle = "Red";
  ctx.stroke();
}
