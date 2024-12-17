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
      pongPixel.id = String(j) + "," + String(i);
      board.appendChild(pongPixel);
    }
  }
}

function generateVector() {
  let rX = Math.floor(Math.random() * 3) + 1;
  let rY = Math.floor(Math.random() * 3) + 1;
  return new Vector(rX, rY);
}

function resetBoard() {
  board.innerHTML = "";
}

function spawnPaddles() {
  for (let i = 8; i < 13; i++) {
    let paddleIndex1 = document.getElementById("1," + String(i));
    let paddleIndex2 = document.getElementById("29," + String(i));
    paddleIndex1.className = "pongPixel pongPaddle leftPaddle";
    paddleIndex2.className = "pongPixel pongPaddle rightPaddle";
  }
}

function spawnPuck() {
  let puck = document.getElementById("15,10");
  puck.className = "pongPixel pongPuck";
}

function movePuck() {
  let puck = document.getElementsByClassName("pongPuck")[0];
  let x = puck.id.split(",");
  let y = Number(x[1]);
  x = Number(x[0]);
  puckCounter++;
  newX = x + puckVector[0];
  newY = y + puckVector[1];
  let newPuck = puck;

  if (newX > 30 || newX < 0) {
    puckVector = new Vector(puckVector[0] * -1, puckVector[1]);
    movePuck();
    return;
  } else if (newY > 20 || newY < 0) {
    puckVector = new Vector(puckVector[0], puckVector[1] * -1);
    movePuck();
    return;
  }
  newPuck = document.getElementById(String(newX) + "," + String(newY));
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
