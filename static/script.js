const gameModeSelect = document.getElementById("game-mode");
const player1Container = document.getElementById("player1-container");
const player2Container = document.getElementById("player2-container");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const startGameButton = document.getElementById("start-game");
const resetBoardButton = document.getElementById("reset-board");
const boardCells = document.querySelectorAll(".cell");

let board = Array(9).fill(null);
let currentPlayer = "X";
let isSinglePlayer = false;

gameModeSelect.addEventListener("change", () => {
  if (gameModeSelect.value === "single") {
    player2Container.style.display = "none";
    isSinglePlayer = true;
  } else {
    player2Container.style.display = "block";
    isSinglePlayer = false;
  }
});

startGameButton.addEventListener("click", () => {
    const player1Name = player1NameInput.value.trim();
    const player2Name = isSinglePlayer ? "Computer" : player2NameInput.value.trim();

    if (!player1Name || (player2Name && !player2Name)) {
      alert("Please enter valid player names.");
      return;
    }
  
    resetBoard();
  
    alert(`${player1Name} (X) vs ${player2Name} (O). Let the game begin!`);
  
    if (isSinglePlayer && currentPlayer === "O") {
      computerTurn();
    }
  });
  
boardCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (board[index] || checkWinner()) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
      alert(`${currentPlayer} wins!`);
    } else if (board.every(cell => cell)) {
      alert("It's a draw!");
    } else {
      togglePlayer();

      if (isSinglePlayer && currentPlayer === "O") {
        setTimeout(computerTurn, 500);
      }
    }
  });
});

resetBoardButton.addEventListener("click", resetBoard);

function resetBoard() {
  board = Array(9).fill(null);
  currentPlayer = "X";

  boardCells.forEach(cell => {
    cell.textContent = "";
  });
}

function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function computerTurn() {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null);

  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  board[move] = "O";

  boardCells[move].textContent = "O";

  if (checkWinner()) {
    alert("Computer (O) wins!");
  } else if (board.every(cell => cell)) {
    alert("It's a draw!");
  } else {
    togglePlayer();
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}
