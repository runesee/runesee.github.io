var board = document.getElementById("pongBoard");

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

populateBoard();
spawnPaddles();
spawnPuck();
console.log(generateVector());

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
  return new Vector(1, 2, 3);
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
