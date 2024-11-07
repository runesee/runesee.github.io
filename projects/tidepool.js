let navigationButton = document.getElementsByClassName("portfolioButton")[0];
navigationButton.addEventListener("click", navigate);
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

var tidalpool = document.getElementById("tidalpool");
const GRIDSIZE = 30; // Const for adj. grid size
var sleepTime = 100;
var fastMovement = false;
var persistentWall;
var gameEnded = false;
var gameStarted = false;
var score = 0;
var tickSpeed = 300;

/* Create square grid of GRIDSIZE size */
function createGrid() {
  tidalpool.innerHTML = "";
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  for (let i = 0; i < GRIDSIZE; i++) {
    for (let j = 0; j < GRIDSIZE; j++) {
      let pixel = document.createElement("div");
      pixel.className = "tidalPixel";
      pixel.id = String(i) + "," + String(j);
      pixel.style.width = Math.floor(windowHeight / GRIDSIZE);
      pixel.style.height = Math.floor(windowHeight / GRIDSIZE);
      tidalpool.appendChild(pixel);
    }
  }
}

/* Function triggered on keyup event. Controls player movement. */
function movement(e) {
  if (gameEnded || !gameStarted) {
    return;
  }
  if (e.code === "ControlLeft") {
    fastMovement = false;
    return;
  }
  if (fastMovement) {
    moveSteps(5, e.code);
  } else {
    moveSteps(1, e.code);
  }
}

/* Helper function for moving. Moves one step at a time until 'steps' reached, or a wall or border is hit*/
function moveSteps(steps, keycode) {
  let currentIndex = document.getElementsByClassName("tidalPlayer")[0].id;
  let i = currentIndex.split(",");
  let j = parseInt(i[1]);
  i = parseInt(i[0]);
  let newIndex;

  if (keycode === "ArrowUp") {
    for (let a = 0; a < steps; a++) {
      try {
        i--;
        newIndex = String(i) + "," + String(j);
        let cell = document.getElementById(newIndex).className;
        if (cell === "tidalWall") {
          return;
        }
        document.getElementById(currentIndex).className = "tidalPixel";
        document.getElementById(newIndex).className = "tidalPixel tidalPlayer";
        currentIndex = newIndex;
      } catch (error) {
        return;
      }
    }
  } else if (keycode === "ArrowDown") {
    for (let a = 0; a < steps; a++) {
      try {
        i++;
        newIndex = String(i) + "," + String(j);
        let cell = document.getElementById(newIndex).className;
        if (cell === "tidalWall") {
          return;
        }
        document.getElementById(currentIndex).className = "tidalPixel";
        document.getElementById(newIndex).className = "tidalPixel tidalPlayer";
        currentIndex = newIndex;
      } catch (error) {
        return;
      }
    }
  } else if (keycode === "ArrowRight") {
    for (let a = 0; a < steps; a++) {
      try {
        j++;
        newIndex = String(i) + "," + String(j);
        let cell = document.getElementById(newIndex).className;
        if (cell === "tidalWall") {
          return;
        }
        document.getElementById(currentIndex).className = "tidalPixel";
        document.getElementById(newIndex).className = "tidalPixel tidalPlayer";
        currentIndex = newIndex;
      } catch (error) {
        return;
      }
    }
  } else if (keycode === "ArrowLeft") {
    for (let a = 0; a < steps; a++) {
      try {
        j--;
        newIndex = String(i) + "," + String(j);
        let cell = document.getElementById(newIndex).className;
        if (cell === "tidalWall") {
          return;
        }
        document.getElementById(currentIndex).className = "tidalPixel";
        document.getElementById(newIndex).className = "tidalPixel tidalPlayer";
        currentIndex = newIndex;
      } catch (error) {
        return;
      }
    }
  }
}

/* Returns true if a wall is blocking the target endpoint or path to it. Otherwise returns true*/
function wallBlockingPath(i, j, index, keycode) {
  // Check if endpoint index has a wall
  let endpoint = document.getElementById(index);
  if (endpoint.className === "tidalWall") {
    return null;
  } // Check if path between start and endpoint has a wall
  else if (fastMovement) {
    if (keycode === "ArrowUp") {
      for (let a = 1; a < 5; a++) {
        let tempElement = document.getElementById(
          String(parseInt(i) + a) + "," + j
        );
        if (tempElement.className === "tidalWall") {
          return tempElement.id;
        }
      }
    } else if (keycode === "ArrowDown") {
      for (let a = 1; a < 5; a++) {
        let tempElement = document.getElementById(
          String(parseInt(i) - a) + "," + j
        );
        if (tempElement.className === "tidalWall") {
          return tempElement.id;
        }
      }
    } else if (keycode === "ArrowRight") {
      for (let a = 1; a < 5; a++) {
        let tempElement = document.getElementById(
          i + "," + String(parseInt(j) - a)
        );
        if (tempElement.className === "tidalWall") {
          return tempElement.id;
        }
      }
    } else {
      for (let a = 1; a < 5; a++) {
        let tempElement = document.getElementById(
          i + "," + String(parseInt(j) + a)
        );
        if (tempElement.className === "tidalWall") {
          return tempElement.id;
        }
      }
    }
  }
  return endpoint.id;
}

/* Toggle 5x movement if left control is pressed */
function enableFastMovement(e) {
  if (gameEnded || !gameStarted) {
    return;
  }
  if (e.code === "ControlLeft") {
    fastMovement = true;
  }
}

/* Returns element of index if within bounds. Otherwise returns null. */
function setIndexIfWithinBounds(index) {
  try {
    return document.getElementById(index);
  } catch (error) {
    return null;
  }
}

/* Function for spawning a wall in one of four 'cardinal' directions */
function spawnWall() {
  let direction = Math.floor(Math.random() * 4);
  let currentWall = new Array();
  let dict = new Map();

  if (direction === 0) {
    for (let i = 0; i < GRIDSIZE; i++) {
      currentWall.push(String(i) + ",0");
    }
  } else if (direction === 1) {
    for (let i = 0; i < GRIDSIZE; i++) {
      currentWall.push("0," + String(i));
    }
  } else if (direction === 2) {
    for (let i = 0; i < GRIDSIZE; i++) {
      currentWall.push(String(i) + ",29");
    }
  } else {
    for (let i = 0; i < GRIDSIZE; i++) {
      currentWall.push("29," + String(i));
    }
  }
  let porousWall = generateHoles(direction, currentWall);
  porousWall.forEach((element) => {
    document.getElementById(element).className = "tidalWall";
  });
  dict.set(direction, porousWall);
  return dict;
}

/* Helper function for generating holes in the spawned wall */
function generateHoles(direction, currentWall) {
  let porousWall = currentWall.slice();

  // Generate a hole in the wall at a random position
  let holePosition = Math.floor(Math.random() * porousWall.length);

  // Select a size of the hole
  let holeSize = Math.floor(Math.random() * 5) + 1;

  let adjacentHoles = locateAdjacentHoles(holePosition, direction, holeSize);
  adjacentHoles.forEach((element) => {
    porousWall.splice(porousWall.indexOf(element), 1);
  });
  return porousWall;
}
/* Helper function for getting a new index based on step-sized changes */
function newIndex(index, direction, step) {
  let i = index.split(",");
  let j = parseInt(i[1]);
  i = parseInt(i[0]);

  if (direction == 0) {
    i += step;
  } else if (direction == 1) {
    j += step;
  } else if (direction == 2) {
    i -= step;
  } else {
    j -= step;
  }
  return String(i) + "," + String(j);
}

/* Helper function for joining starting index with direction */
function cartesianIndex(i, direction) {
  if (direction == 0) {
    return String(i) + ",0";
  } else if (direction == 1) {
    return "0," + String(i);
  } else if (direction == 2) {
    return String(i) + ",29";
  }
  return "29," + String(i);
}

/* Helper function for locating nearest a holes adjacent indexes that are within bounds */
function locateAdjacentHoles(position, direction, size) {
  let indexes = [];
  position = cartesianIndex(position, direction);
  indexes.push(position);

  // Set planned hole indexes
  if (size >= 2) {
    indexes.push(newIndex(position, direction, 1));
  }
  if (size >= 3) {
    indexes.push(newIndex(position, direction, -1));
  }
  if (size >= 4) {
    indexes.push(newIndex(position, direction, 2));
  }
  if (size == 5) {
    indexes.push(newIndex(position, direction, -2));
  }

  // Add only indexes within bounds to list
  let legalIndexes = [];
  indexes.forEach((element) => {
    let k = setIndexIfWithinBounds(element);
    if (k != null) {
      legalIndexes.push(k.id);
      k.className = "tidalPixel";
    }
  });
  return legalIndexes;
}

function moveWall(wall) {
  let direction = wall.keys().next().value;
  let newCells = [];
  let newCell;
  let newId;
  let firstElementInWall = wall.get(direction)[0];
  let x = firstElementInWall.split(",");
  let y = Number(x[1]);
  x = Number(x[0]);

  // Check if next move is legal
  if (direction == 0) {
    newId = String(x) + "," + String(y + 1);
  } else if (direction == 1) {
    newId = String(x + 1) + "," + String(y);
  } else if (direction == 2) {
    newId = String(x) + "," + String(y - 1);
  } else {
    newId = String(x - 1) + "," + String(y);
  }
  newCell = setIndexIfWithinBounds(newId);
  if (newCell == null) {
    // Moving wall one more time will move it outside of the grid
    return false;
  }
  wall.get(direction).forEach((element) => {
    // Redefine x and y values for each cell in wall
    x = element.split(",");
    y = Number(x[1]);
    x = Number(x[0]);

    // Clear current wall cells
    document.getElementById(element).className = "tidalPixel";

    // Update positions based on direction
    if (direction == 0) {
      y++;
      newId = String(x) + "," + String(y);
    } else if (direction == 1) {
      x++;
      newId = String(x) + "," + String(y);
    } else if (direction == 2) {
      y--;
      newId = String(x) + "," + String(y);
    } else {
      x--;
      newId = String(x) + "," + String(y);
    }
    // Add new wall cells
    newCells.push(newId);
    document.getElementById(newId).className = "tidalWall";
  });
  wall.set(direction, newCells);
  // Check if player within new wall position. Should update game state if true.
  try {
    wall
      .get(direction)
      .includes(document.getElementsByClassName("tidalPlayer")[0].id);
  } catch (error) {
    gameEnded = true;
    return false;
  }
  return true;
}

/* Spawns a player cell roughly in the center of the grid */
function spawnPlayer() {
  let player = tidalpool.children[465];
  player.className = "tidalPixel tidalPlayer";
}

/* Initializing function */
function start() {
  // Create or reset grid
  createGrid();

  // Set global game started flag
  gameStarted = true;
  gameEnded = false;

  // Reset wall, score and wall speed for replaying
  persistentWall = null;
  score = 0;
  tickSpeed = 300;

  // Spawn the player character
  spawnPlayer();

  // Start the game loop
  update();
}

/* Main gameloop function */
async function update() {
  if (!gameStarted || gameEnded) {
    return;
  }
  if (persistentWall == null) {
    persistentWall = spawnWall();
    tickSpeed = tickSpeed > 120 ? tickSpeed - 40 : tickSpeed;
  }
  let direction = persistentWall.keys().next().value;
  await sleep(tickSpeed);
  score += 1;
  let result = moveWall(persistentWall);
  if (result) {
    update();
  } else if (!gameEnded) {
    // Spawn a new wave and clear previous one
    clearWall();
    persistentWall = null;
    update();
  } else {
    gameOver();
  }
}

function clearWall() {
  let currentWall = document.getElementsByClassName("tidalWall");
  Array.from(currentWall).forEach((element) => {
    element.className = "tidalPixel";
  });
}

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

function startGame() {
  // Hide start menu
  document.getElementById("gameStateMenu").style.visibility = "hidden";
  document.getElementById("gameOverMessage").style.visibility = "hidden";
  document.getElementById("tidalScore").style.visibility = "hidden";
  // Start the game
  start();
}

function gameOver() {
  gameStarted = false;
  document.getElementById("gameStateMenu").style.visibility = "visible";
  document.getElementById("gameOverMessage").style.visibility = "visible";
  let scoreEl = document.getElementById("tidalScore");
  scoreEl.style.visibility = "visible";
  scoreEl.innerHTML = "Score: " + String(score);
}

// Add event listeners
window.addEventListener("keyup", movement);
window.addEventListener("keydown", enableFastMovement);

/* Possibly the goofiest way to do page navigation. Because why not. */
function navigate() {
  let currHref = window.location.href;
  currHref = currHref.replace("projects/tidepool.html", "index.html");
  window.location.href = currHref;
}
