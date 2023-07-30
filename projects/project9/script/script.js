const amount = 12;
let attempts = 0;
let timer = 0;
let timerInterval = null;

// Adding paths of the images for the 12 fruits
const images = [
  "./images/banana.jpg",
  "./images/watermelon.jpg",
  "./images/apple.jpg",
  "./images/pear.jpg",
  "./images/strawberry.jpg",
  "./images/orange.jpg",
  "./images/kiwi.jpg",
  "./images/mango.jpg",
  "./images/pineapple.jpg",
  "./images/cherry.jpg",
  "./images/pomegranate.jpg",
  "./images/grape.jpg",
];

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(6, 1fr)`;

// Function to start timer for the game
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;

    const date = new Date(timer * 1000);
    const m = date.getMinutes();
    const s = date.getSeconds();

    document.querySelector(".timer").innerHTML = `${m < 10 ? "0" + m : m}:${
      s < 10 ? "0" + s : s
    }`;
  }, 1000);
}

// Push each image twice into the array
let numbers = [];
images.forEach((image) => {
  numbers.push(image, image);
});

// Shuffle numbers array for randomness
numbers.sort(() => Math.random() - 0.5);

function createBoard() {
  for (let i = 0; i < amount * 2; i++) {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${numbers[i]}" alt="fruit">`;
    board.appendChild(div);

    div.addEventListener("click", (ev) => {
      if (ev.currentTarget.classList.contains("hidden")) {
        return;
      }

      if (board.querySelectorAll(".showing").length == 2) {
        return;
      }

      ev.currentTarget.classList.add("showing");

      if (timerInterval === null) {
        startTimer();
      }

      check();
    });
  }
}
createBoard();

// Function to check if a match is found
function check() {
  const cards = board.querySelectorAll(".showing");

  if (cards.length == 2) {
    const first = cards[0].querySelector("img").src;
    const last = cards[1].querySelector("img").src;
    document.querySelector(".counter").innerHTML = ++attempts;

    if (first == last) {
      setTimeout(() => {
        cards[0].classList.remove("showing");
        cards[1].classList.remove("showing");

        cards[0].classList.add("hidden");
        cards[1].classList.add("hidden");

        checkIsComplete();
      }, 1000);
    } else {
      setTimeout(() => {
        cards[0].classList.remove("showing");
        cards[1].classList.remove("showing");
      }, 1500);
    }
  }
}

function checkIsComplete() {
  const cards = board.querySelectorAll("div:not(.hidden)");

  if (!cards.length) {
    clearInterval(timerInterval);

    confetti({
      particleCount: 100,
      spread: 70,
      decay: 0.9,
      origin: { y: 0.6 },
    });
  }
}

document.querySelector(".restart").addEventListener("click", function () {
  // Clear the game board
  board.innerHTML = "";

  // Reset the game variables
  attempts = 0;
  timer = 0;
  document.querySelector(".counter").innerHTML = attempts;
  document.querySelector(".timer").innerHTML = "00:00";
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Reshuffle and re-create the game board
  numbers.sort(() => Math.random() - 0.5);
  createBoard();
});
