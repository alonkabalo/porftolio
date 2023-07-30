const height = 40;
const width = screen.width < 400 ? 30 : 50;
const length = 10;
const snake = new Array(length).fill(null).map((n, i) => i);
snake.reverse();
let head = snake[0];
let direction = "right";
let isGameOver = false;
let random;
let interval;
let speed = 200;
let seconds = 0;
let score = 0;
let timerStarted = false;
let timer;
let gameStarted = false;

const divs = [];
const rightBoundaries = [];
const leftBoundaries = [];

// Setting up the boundaries arrays
for (let i = 0; i < height; i++) {
  rightBoundaries.push(width * i - 1);
}

for (let i = 1; i <= height; i++) {
  leftBoundaries.push(width * i);
}

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

// Function to initialize the board with divs
function createBoard() {
  for (let i = 0; i < height * width; i++) {
    const div = document.createElement("div");
    board.appendChild(div);
    divs.push(div);
  }

  color();
  setApple();
}

// Function to color the snake and head on the board
function color() {
  divs.forEach((elem) => {
    elem.classList.remove(
      "active",
      "head",
      "up",
      "right",
      "down",
      "left",
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius"
    );
  });

  snake.forEach((num, i) => {
    divs[num].classList.add("active");
  });

  divs[head].classList.add("head", direction);
}

// Function to move the snake in the given direction
function move(dir) {
  if (isGameOver) {
    return;
  }

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  if (dir === "up") {
    if (direction === "down") {
      return;
    }

    head -= width;

    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir === "down") {
    if (direction === "up") {
      return;
    }

    head += width;

    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir === "left") {
    if (direction === "right") {
      return;
    }

    head++;

    if (leftBoundaries.includes(head)) {
      gameOver();
      return;
    }
  } else if (dir === "right") {
    if (direction === "left") {
      return;
    }

    head--;

    if (rightBoundaries.includes(head)) {
      gameOver();
      return;
    }
  }

  if (snake.includes(head)) {
    gameOver();
    return;
  }

  direction = dir;
  snake.unshift(head);

  if (head === random) {
    setApple();
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
  } else {
    snake.pop();
  }

  color();
  startAuto();
}

// Set the game over flag
// Clears the game and timer intervals
// Shows the game over modal and handles restart
function gameOver() {
  isGameOver = true;
  clearInterval(interval);
  clearInterval(timer);

  var modal = document.getElementById("gameOverModal");
  var modalContent = document.querySelector(".modal-content");
  var restartButton = document.querySelector(".modal-content button");

  modal.style.display = "block";

  restartButton.onclick = function () {
    modalContent.classList.add("out");
    setTimeout(function () {
      modal.style.display = "none";
      location.reload();
    }, 300);
  };
}

// Function to set an apple on the board in a random location
function setApple() {
  random = Math.floor(Math.random() * divs.length);

  if (snake.includes(random)) {
    setApple();
  } else {
    divs.forEach((elem) => elem.classList.remove("apple"));
    divs[random].classList.add("apple");
  }
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), speed);
}

// Listens for keydown events to control the snake
window.addEventListener("keydown", (ev) => {
  ev.preventDefault();

  switch (ev.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "Escape":
      clearInterval(interval);
      break;
  }
});

document.getElementById("easy").addEventListener("click", function () {
  if (!gameStarted) {
    speed = 200;
    startAuto();
    gameStarted = true;
  }
});

document.getElementById("medium").addEventListener("click", function () {
  if (!gameStarted) {
    speed = 100;
    startAuto();
    gameStarted = true;
  }
});

document.getElementById("pro").addEventListener("click", function () {
  if (!gameStarted) {
    speed = 50;
    startAuto();
    gameStarted = true;
  }
});

// Function to start the game timer
// Sets up a 1 second interval to update the elapsed time
function startTimer() {
  timer = setInterval(function () {
    if (!isGameOver) {
      seconds++;
      document.getElementById("timer").innerHTML = `Time: ${seconds} seconds`;
    }
  }, 1000);
}

// Sets up the initial score and calls createBoard to start the game
window.onload = function () {
  document.getElementById("score").innerText = `Score: ${score}`;
  createBoard();
};
