var board = document.getElementById("pongBoard");
var puckVector;
var puckCounter;
var userPaddle = [];
var computerPaddle = [];
let bttn = document.getElementsByClassName("portfolioButton")[0];
bttn.addEventListener("click", navigate);

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
  // TODO: Avoid 0 vectors
  let rX = Math.floor(Math.random() * 4) - 2;
  let rY = Math.floor(Math.random() * 4) - 2;
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
    userPaddle[i - 8] = paddleIndex1;
    paddleIndex2.className = "pongPixel pongPaddle rightPaddle";
    computerPaddle[i - 8] = paddleIndex2;
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

function movePaddle(key, paddle) {
  if (key == "w") {
    let firstElement = paddle[0];
    let y = Number(firstElement.id.split(",")[1]);
    if (y == 0) {
      return null;
    }

    document.getElementById(paddle[paddle.length - 1].id).className =
      "pongPixel";
    paddle.splice(paddle.length - 1, 1);

    let a = [];
    let x = firstElement.id.split(",")[0];
    a[0] = document.getElementById(String(x) + "," + String(y - 1));
    a[0].className = "pongPixel pongPaddle";

    paddle.forEach((element) => {
      a.push(element);
    });

    paddle = a;
    return paddle;
  } else if (key == "s") {
    let lastElement = paddle[paddle.length - 1];
    let y = Number(lastElement.id.split(",")[1]);
    if (y == 20) {
      return null;
    }

    document.getElementById(paddle[0].id).className = "pongPixel";
    paddle.splice(0, 1);

    let a = [];
    let x = lastElement.id.split(",");
    y = Number(x[1]);
    x = Number(x[0]);

    paddle.forEach((element) => {
      a.push(element);
    });
    a[a.length] = document.getElementById(String(x) + "," + String(y + 1));
    a[a.length - 1].className = "pongPixel pongPaddle";
    paddle = a;
    return paddle;
  }
}

function moveLeftPaddle(event) {
  let key = event.key;
  let newPaddle = movePaddle(key, userPaddle);
  if (newPaddle != null) {
    userPaddle = newPaddle;
  }
}

function moveRightPaddle() {
  let x = document.getElementsByClassName("pongPuck")[0].id.split(",");
  let y = Number(x[1]);
  let middle = computerPaddle[2].id.split(",")[1];
  if (middle > y) {
    let newPaddle = movePaddle("w", computerPaddle);
    if (newPaddle != null) {
      computerPaddle = newPaddle;
    }
  } else if (middle < y) {
    let newPaddle = movePaddle("s", computerPaddle);
    if (newPaddle != null) {
      computerPaddle = newPaddle;
    }
  }
}

function start() {
  document
    .getElementsByTagName("body")[0]
    .addEventListener("keydown", moveLeftPaddle);
  populateBoard();
  spawnPaddles();
  spawnPuck();
  puckVector = generateVector();
  puckCounter = 0;
  update();
}

async function update() {
  await sleep(200);
  movePuck();
  moveRightPaddle();
  //update();
}

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
