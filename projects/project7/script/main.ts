document.addEventListener('DOMContentLoaded', (event: Event) => {
  const boardElement = document.querySelector('.board') as HTMLElement;
  const player1ScoreElement = document.getElementById('player1Score') as HTMLElement;
  const player2ScoreElement = document.getElementById('player2Score') as HTMLElement;
  const restartButton = document.getElementById('restart') as HTMLButtonElement;
  const playerTurnElement = document.getElementById('playerTurn') as HTMLElement;
  const timerElement = document.getElementById('timer') as HTMLElement;

  let isX: boolean = true;
  let winner: 'X' | 'O' | undefined = undefined;
  let winnerArray: number[] = [];
  let gameTimer: number = 0;
  let gameInterval: number;
  let player1Score: number = 0;
  let player2Score: number = 0;

  restartButton.addEventListener('click', resetGame);

  // Function to start game timer
  function startTimer(): void {
    if(gameInterval) {
      clearInterval(gameInterval);
    }

    gameInterval = window.setInterval(() => {
      gameTimer++;
      timerElement.innerText = `Game Time: ${gameTimer} seconds`;
    }, 1000);
  }

    // Function to reset the game state
  function resetGame(): void {
    const divs = boardElement.querySelectorAll('div');
    divs.forEach(div => {
      div.innerHTML = '';
      div.className = '';
      div.classList.remove('bg');
    });

    winner = undefined;
    isX = true;
    gameTimer = 0;
    playerTurnElement.innerText = `Turn: Player X`;
    startTimer();
  }

  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");

    div.addEventListener("click", (ev: MouseEvent) => {
      const clickedDiv = ev.target as HTMLElement;

    // Checks if cell is clicked, if it is empty and if there's no winner yet
    if (!clickedDiv.innerHTML && !winner) {
    clickedDiv.innerHTML = isX ? 'X' : 'O';
    clickedDiv.className = 'dirty';
    isX = !isX;
    playerTurnElement.innerText = `Turn: Player ${isX ? 'X' : 'O'}`;
        check();
      }
    });

    boardElement.appendChild(div);
  }
  
  // Function to check for a win
  function check(): void {
    const divs = boardElement.querySelectorAll('div');
    const options = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    for (const arr of options) {
      const res = arr.map(index => (divs[index] as HTMLElement).innerHTML);

      if (res.every(val => val === 'X')) {
        winner = 'X';
        winnerArray = arr;
        player1Score++;
        player1ScoreElement.innerText = `Player X Score: ${player1Score}`; 
        break;
      } else if (res.every(val => val === 'O')) {
        winner = 'O';
        winnerArray = arr;
        player2Score++;
        player2ScoreElement.innerText = `Player O Score: ${player2Score}`; 
        break;
      }
    }
    
    // If there is a winner, highlight winning cells and display winner message
    if (winner) {
      clearInterval(gameInterval);
      winnerArray.forEach(index => (divs[index] as HTMLElement).classList.add('bg'));
      showWinner(`The winner is ${winner}`);
    }
  }


  // Function to display winner message and confetti effect
  function showWinner(text: string): void {
    const winnerDiv = document.createElement("div");
    winnerDiv.classList.add("winner");
    winnerDiv.innerHTML = text;

    document.body.appendChild(winnerDiv);

    (window as any).confetti({
      particleCount: 100,
      spread: 70,
      decay: 0.9,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      document.body.removeChild(winnerDiv);
    }, 2 * 1000);
  }

  playerTurnElement.innerText = `Turn: Player X`;
  timerElement.innerText = `Game Time: ${gameTimer} seconds`;
});
