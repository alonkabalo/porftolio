document.addEventListener("DOMContentLoaded", function (event) {
  var boardElement = document.querySelector(".board");
  var player1ScoreElement = document.getElementById("player1Score");
  var player2ScoreElement = document.getElementById("player2Score");
  var restartButton = document.getElementById("restart");
  var playerTurnElement = document.getElementById("playerTurn");
  var timerElement = document.getElementById("timer");
  var isX = true;
  var winner = undefined;
  var winnerArray = [];
  var gameTimer = 0;
  var gameInterval;
  var player1Score = 0;
  var player2Score = 0;

  restartButton.addEventListener("click", resetGame);

  // Function to start the game timer
  function startTimer() {
    // If there's already a timer, clear it
    if (gameInterval) {
      clearInterval(gameInterval);
    }

    // Start a new timer that updates every second
    gameInterval = window.setInterval(function () {
      gameTimer++;
      timerElement.innerText = "Game Time: ".concat(gameTimer, " seconds");
    }, 1000);
  }
  function resetGame() {
    // Get all the divs in the board element and reset them
    var divs = boardElement.querySelectorAll("div");
    divs.forEach(function (div) {
      div.innerHTML = "";
      div.className = "";
      div.classList.remove("bg");
    });
    winner = undefined;
    isX = true;
    gameTimer = 0;
    playerTurnElement.innerText = "Turn: Player X";
    startTimer();
  }

  // Create the 9 divs that will be used for the tic-tac-toe board
  for (var i = 0; i < 9; i++) {
    var div = document.createElement("div");

    // Event listener for each div on click
    div.addEventListener("click", function (ev) {
      var clickedDiv = ev.target;

      // If the div is empty and there's no winner yet, make a move
      if (!clickedDiv.innerHTML && !winner) {
        clickedDiv.innerHTML = isX ? "X" : "O";
        clickedDiv.className = "dirty";
        isX = !isX;
        playerTurnElement.innerText = "Turn: Player ".concat(isX ? "X" : "O");
        check();
      }
    });
    boardElement.appendChild(div);
  }

  // Function to check for a winner
  function check() {
    var divs = boardElement.querySelectorAll("div");
    var options = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Loop through all the possible combinations
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
      var arr = options_1[_i];
      var res = arr.map(function (index) {
        return divs[index].innerHTML;
      });

      // Check if there's a winner
      if (
        res.every(function (val) {
          return val === "X";
        })
      ) {
        winner = "X";
        winnerArray = arr;
        player1Score++;
        player1ScoreElement.innerText = "Player X Score: ".concat(player1Score);
        break;
      } else if (
        res.every(function (val) {
          return val === "O";
        })
      ) {
        winner = "O";
        winnerArray = arr;
        player2Score++;
        player2ScoreElement.innerText = "Player O Score: ".concat(player2Score);
        break;
      }
    }

    // If there's a winner
    if (winner) {
      clearInterval(gameInterval);
      winnerArray.forEach(function (index) {
        return divs[index].classList.add("bg");
      });
      showWinner("The winner is ".concat(winner));
    }
  }

  // Function to display the winner
  function showWinner(text) {
    var winnerDiv = document.createElement("div");
    winnerDiv.classList.add("winner");
    winnerDiv.innerHTML = text;
    document.body.appendChild(winnerDiv);
    window.confetti({
      particleCount: 100,
      spread: 70,
      decay: 0.9,
      origin: { y: 0.6 },
    });

    // After 2 seconds, remove the winner announcement
    setTimeout(function () {
      document.body.removeChild(winnerDiv);
    }, 2 * 1000);
  }
  playerTurnElement.innerText = "Turn: Player X";
  timerElement.innerText = "Game Time: ".concat(gameTimer, " seconds");
});
