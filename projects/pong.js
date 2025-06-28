var gameOver = false;
var gameStarted = false;
var tickspeed = 400;
var board = document.getElementById("pongBoard");
var puckVector;
var puckCounter;
var userPaddle = [];
var computerPaddle = [];
var intervalId;
let bttn = document.getElementsByClassName("portfolioButton")[0];
bttn.addEventListener("click", navigate);
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", start);
document
  .getElementsByTagName("body")[0]
  .addEventListener("keydown", moveLeftPaddle);

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
  let rX = Math.floor(Math.random()) + 1;
  let rY = Math.floor(Math.random()) + 1;

  let direction = Math.floor(Math.random() * 2);
  if (direction === 0) {
    rX *= -1;
  }
  direction = Math.floor(Math.random() * 2);
  if (direction === 0) {
    rY *= -1;
  }
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
  newX = x + puckVector[0];
  newY = y + puckVector[1];
  let newPuck = puck;

  if (newX > 30 || newX < 0) {
    gameOver = true;
    return;
  } else if (newY > 20 || newY < 0) {
    puckVector = new Vector(puckVector[0], puckVector[1] * -1);
    movePuck();
    return;
  }

  if (newX === 1 || newX === 29) {
    // Within userpaddle column
    let firstUserpaddleElement = userPaddle[0];
    let lastUserpaddleElement = userPaddle[4];
    let firstUserpaddleY = Number(firstUserpaddleElement.id.split(",")[1]);
    let lastUserpaddleY = Number(lastUserpaddleElement.id.split(",")[1]);

    let firstComputerpaddleElement = computerPaddle[0];
    let lastComputerpaddleElement = computerPaddle[4];
    let firstComputerpaddleY = Number(
      firstComputerpaddleElement.id.split(",")[1]
    );
    let lastComputerpaddleY = Number(
      lastComputerpaddleElement.id.split(",")[1]
    );

    if (newX === 1) {
      if (newY >= firstUserpaddleY && newY <= lastUserpaddleY) {
        puckCounter++;
        let diff = newY - firstUserpaddleY;
        let angleMod = diff - 2;
        puckVector = new Vector(puckVector[0] * -1, angleMod);
        movePuck();
        return;
      }
    } else if (newX === 29) {
      if (newY >= firstComputerpaddleY && newY <= lastComputerpaddleY) {
        puckCounter++;
        let diff = newY - firstUserpaddleY;
        let angleMod = diff - 2;
        puckVector = new Vector(puckVector[0] * -1, angleMod);
        movePuck();
        return;
      }
    }
  }
  newPuck = document.getElementById(String(newX) + "," + String(newY));
  puck.className = "pongPixel";
  newPuck.className = "pongPixel pongPuck";
}

function movePaddle(key, paddle) {
  if (key == "w") {
    let firstElement = paddle[0];
    let firstY = Number(firstElement.id.split(",")[1]);
    let firstX = Number(firstElement.id.split(",")[0]);

    // Prevent moving up if roof reached
    if (firstY === 0) {
      return null;
    }

    let puck = document.getElementsByClassName("pongPuck")[0].id.split(",");

    let puckY = Number(puck[1]);
    let puckX = Number(puck[0]);

    if (puckY + 1 === firstY && puckX === firstX) {
      // If puck is already occupying the space, disallow moving into the square
      return null;
    }

    document.getElementById(paddle[paddle.length - 1].id).className =
      "pongPixel";
    paddle.splice(paddle.length - 1, 1);

    let a = [];
    let x = firstElement.id.split(",")[0];
    a[0] = document.getElementById(String(x) + "," + String(firstY - 1));
    a[0].className = "pongPixel pongPaddle";

    paddle.forEach((element) => {
      a.push(element);
    });

    paddle = a;
    return paddle;
  } else if (key == "s") {
    let lastElement = paddle[paddle.length - 1];
    let lastY = Number(lastElement.id.split(",")[1]);
    let lastX = Number(lastElement.id.split(",")[0]);

    // Prevent moving down if floor reached
    if (lastY == 20) {
      return null;
    }

    let puck = document.getElementsByClassName("pongPuck")[0].id.split(",");
    let puckY = Number(puck[1]);
    let puckX = Number(puck[0]);

    if (puckY - 1 === lastY && puckX === lastX) {
      // If puck is already occupying the space, disallow moving into the square
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
    a[a.length] = document.getElementById(String(x) + "," + String(lastY + 1));
    a[a.length - 1].className = "pongPixel pongPaddle";
    paddle = a;
    return paddle;
  }
}

function moveLeftPaddle(event) {
  if (gameOver) {
    return;
  }
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
  startButton.style.visibility = "hidden";
  gameOver = false;
  resetBoard();
  populateBoard();
  spawnPaddles();
  spawnPuck();
  puckVector = generateVector();
  puckCounter = 0;
  gameStarted = true;
  intervalId = setInterval(update, tickspeed);
}

async function update() {
  if (gameOver) {
    startButton.style.visibility = "visible";
    tickspeed = 400;
    puckCounter = 0;
    clearInterval(intervalId);
    return;
  }
  moveRightPaddle();
  movePuck();
  if (puckCounter === 3) {
    puckCounter = 0;
    clearInterval(intervalId);
    tickspeed > 100 ? (tickspeed -= 100) : tickspeed;
    intervalId = setInterval(update, tickspeed);
  }
}
