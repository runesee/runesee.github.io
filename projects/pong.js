var board = document.getElementById("pongBoard");
var puckVector;
var puckCounter;
let bttn = document.getElementsByClassName("portfolioButton")[0];
bttn.addEventListener("click", navigate);

/* Possibly the goofiest way to do page navigation. Because why not. */
function navigate() {
  let currHref = window.location.href;
  currHref = currHref.replace("projects/pong.html", "index.html");
  window.location.href = currHref;
}

class Vector extends Array {
  add(other) {
    return this.map((e, i) => e + other[i]);
  }
}

start();

function populateBoard() {
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 31; j++) {
      let pongPixel = document.createElement("div");
      pongPixel.className = "pongPixel";
      pongPixel.id = String(i) + "," + String(j);
      board.appendChild(pongPixel);
    }
  }
}

function generateVector() {
  return new Vector(-1, 2);
}

function resetBoard() {
  board.innerHTML = "";
}

function spawnPaddles() {
  for (let i = 8; i < 13; i++) {
    let paddleIndex1 = document.getElementById(String(i) + ",1");
    let paddleIndex2 = document.getElementById(String(i) + ",29");
    paddleIndex1.className = "pongPixel pongPaddle leftPaddle";
    paddleIndex2.className = "pongPixel pongPaddle rightPaddle";
  }
}

function spawnPuck() {
  let puck = document.getElementById("10,15");
  puck.className = "pongPixel pongPuck";
}

function movePuck() {
  let puck = document.getElementsByClassName("pongPuck")[0];
  let x = puck.id.split(",");
  let y = Number(x[1]);
  x = Number(x[0]);
  puckCounter++;
  x += puckVector[0];
  y += puckVector[1];
  let newPuck = document.getElementById(String(x) + "," + String(y));
  puck.className = "pongPixel";
  newPuck.className = "pongPixel pongPuck";
}

function start() {
  populateBoard();
  spawnPaddles();
  spawnPuck();
  puckVector = generateVector();
  puckCounter = 0;
  //update();
}

async function update() {
  await sleep(200);
  movePuck();
  update();
}

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
