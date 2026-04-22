const ROWS = 6;
const COLS = 7;

let board = createBoard();
let currentPlayer = 1;
let startingPlayer = 1;
let gameOver = false;

let scores = {
  1: 0,
  2: 0
};

const boardEl = document.getElementById("board");
const columnButtonsEl = document.getElementById("columnButtons");
const turnTextEl = document.getElementById("turnText");
const scoreP1El = document.getElementById("scoreP1");
const scoreP2El = document.getElementById("scoreP2");
const messageTextEl = document.getElementById("messageText");
const resetBtn = document.getElementById("resetBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPanel = document.getElementById("helpPanel");

const colorModeSelect = document.getElementById("colorMode");
const savedMode = localStorage.getItem("colorMode");
if (savedMode) {
  changeColorMode(savedMode);
  colorModeSelect.value = savedMode;
}

function changeColorMode(mode) {
  document.body.classList.remove(
    "protanopia",
    "deuteranopia",
    "tritanopia",
    "highContrast"
  );

  if (mode !== "default") {
    document.body.classList.add(mode);
  }
}

function createBoard() {
  return Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function createUi() {
  columnButtonsEl.innerHTML = "";
  for (let col = 0; col < COLS; col++) {
    const btn = document.createElement("button");
    btn.className = "column-btn";
    btn.textContent = col + 1;
    btn.dataset.col = col;
    btn.addEventListener("click", () => handleMove(col));
    columnButtonsEl.appendChild(btn);
  }

  boardEl.innerHTML = "";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      const disc = document.createElement("div");
      disc.className = "disc";
      cell.appendChild(disc);

      boardEl.appendChild(cell);
    }
  }
}

function renderBoard() {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const disc = cell.firstElementChild;

    disc.classList.remove("p1", "p2");
    const value = board[row][col];

    if (value === 1) {
      disc.classList.add("p1");
    } else if (value === 2) {
      disc.classList.add("p2");
    }
  });
}

function updateUi() {
  scoreP1El.textContent = scores[1];
  scoreP2El.textContent = scores[2];
  turnTextEl.textContent = `Player ${currentPlayer}`;
  renderBoard();

  const buttons = columnButtonsEl.querySelectorAll(".column-btn");
  buttons.forEach((btn) => {
    btn.disabled = gameOver;
  });
}

function setMessage(text) {
  messageTextEl.textContent = text;
}

function handleMove(col) {
  if (gameOver) {
    setMessage("The game is over. Press Reset Game to play again.");
    return;
  }

  if (!Number.isInteger(col) || col < 0 || col >= COLS) {
    setMessage("Invalid column. Choose a column from 1 to 7.");
    return;
  }

  const row = findOpenRow(col);
  if (row === -1) {
    setMessage(`Column ${col + 1} Is Full, Please Choose Another Column.`);
    return;
  }

  board[row][col] = currentPlayer;
  renderBoard();

  if (checkWin(row, col, currentPlayer)) {
    scores[currentPlayer] += 1;
    gameOver = true;
    updateUi();
    setMessage(`Player ${currentPlayer} Wins! Press Reset Game To Play Again.`);
    return;
  }

  if (isBoardFull()) {
    gameOver = true;
    updateUi();
    setMessage("The Game Has Tied. Press Reset Game To Play Again.");
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateUi();
  setMessage(`Player ${currentPlayer}'s Turn.`);
}

function findOpenRow(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      return row;
    }
  }
  return -1;
}

function isBoardFull() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}

function checkWin(row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  return directions.some(([dr, dc]) => {
    let count = 1;
    count += countDirection(row, col, dr, dc, player);
    count += countDirection(row, col, -dr, -dc, player);
    return count >= 4;
  });
}

function countDirection(row, col, dr, dc, player) {
  let count = 0;
  let r = row + dr;
  let c = col + dc;

  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

function resetGame() {
  const hadFinishedGame = gameOver;

  board = createBoard();
  gameOver = false;

  if (hadFinishedGame) {
    startingPlayer = startingPlayer === 1 ? 2 : 1;
  }

  currentPlayer = startingPlayer;
  renderBoard();
  updateUi();
  setMessage(`New Game Started. Player ${currentPlayer} Goes First.`);
}

function toggleHelp() {
  helpPanel.classList.toggle("hidden");
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key >= "1" && key <= "7") {
    handleMove(Number(key) - 1);
  } else if (key === "r") {
    resetGame();
  } else if (key === "h") {
    toggleHelp();
  }
});

colorModeSelect.addEventListener("change", (e) => {
  const mode = e.target.value;
  changeColorMode(mode);
  localStorage.setItem("colorMode", mode);
});

resetBtn.addEventListener("click", resetGame);
helpBtn.addEventListener("click", toggleHelp);

createUi();
renderBoard();
updateUi();
setMessage("Player 1 Goes First.");


// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢋⣩⣄⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⡿⠿⠿⠿⠿⣿⣿⣿⣿⡿⠿⠿⠟⠛⠛⠛⠻⠿⡿⢋⣵⣾⣿⣿⣿⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⡇⣶⣶⣦⡶⠒⠤⠉⠁⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⢂⠻⣿⣿⣯⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⡇⢯⡿⢋⠐⠁⠀⠰⠀⠀⠀⠀⠁⠀⠀⠀⠀⠁⠀⠈⢢⢉⡛⠿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⡇⠻⢁⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠄⠢⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣇⢀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⣰⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⢠⣿⣦⣀⠀⠀⠀⠀⠀⠑⠦⣀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣷⣶⣦⡵⠒⠀⠀⣈⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣿⣿⡄⠀⠀⠀⠐⠋⠉⢀⣀⣿⣿⣿⣿⣷⣦⣟⣟⡏⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⡿⠃⠀⠀⠀⢰⡶⣟⣿⢽⢿⡉⡄⠆⠯⢹⠿⠋⠀⠀⠀⠀⠀⠀⠀⣠⣄⣤⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣥⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣆⠡⡜⢡⣶⡆⣿⡒⠒⠀⠀⠀⠀⠀⠀⠘⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣿⡦⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣷⣌⡚⣛⣴⣿⣿⡶⠀⠀⠀⣄⣀⣀⡀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣦⣤⣄⣤⢀⣀⠀⠀⠙⠛⠿⠿⠿⠿⠛⡋⠁⠀⠀⠀⠀⠈⠟⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⢋⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⠇⣨⣴⣶⣤⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠔⡛⠛⠣⡘⠄⣦⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⠟⣡⣾⣿⣿⣿⣿⢠⠋⢀⣾⣿⣿⣿⣷⣶⣦⣬⡁⠧⣉⠧⡉⣾⣿⣷⡌⢿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⢋⣴⣿⣿⣿⣿⣿⣿⡟⡠⢃⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡐⠥⡱⣿⣿⣿⣿⣌⠿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡟⡠⠅⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣿⣦⡀⢍⠻⠿⣿⣿⣧⠹⣿⣿⣿⣿⣿
// ⣿⣿⣿⠸⣿⣿⣿⣿⣿⠟⣠⠣⠁⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢸⣿⣿⣦⡁⠍⢮⣝⣿⣷⢸⣿⣿⣿⣿
// ⣿⣿⡿⠁⠿⢿⣿⣿⠋⡴⢡⢃⠘⣿⡿⠿⢛⢋⡝⡩⢍⡩⢛⠿⢿⡌⣿⣿⣿⣿⣦⢁⣿⣿⡿⢸⣿⣿⣿⣿
// ⣿⡿⢃⡰⢄⠌⡛⠏⠴⢡⠎⡜⡀⠙⠣⡰⡘⢬⡑⢣⠜⡡⢎⠴⣈⠃⣻⣿⣿⣿⣿⣾⣿⣿⡇⢸⣿⣿⣿⣿
// ⣿⡇⢆⡱⢊⡜⡰⢂⠦⣠⠉⠄⠀⠀⠀⠀⠙⠢⠙⠂⠙⣀⠉⢀⠁⡁⢿⠿⣟⡻⢻⡟⢫⡿⢡⣿⣿⣿⣿⣿⡇
// ⣿⡇⠘⡔⢣⠜⣡⢋⠖⡁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠰⢀⠀⠰⡁⣑⣗⣧⣵⣽⣧⡾⢃⣾⣿⣿⣿⣿⣿⣿
// ⣿⣿⣆⠉⠢⠙⠤⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠣⠱⠘⠿⠿⠿⠛⣋⠁⢺⣿⣿⣿⣿⣿⣿⣿⡇
// ⣿⣿⣿⢁⢡⢋⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⡜⢢⡙⢤⠣⣆⠹⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⡇⣸⣎⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣡⠚⢤⣾⣿⣷⣶⣶⣬⣉⢿⣿⣿⡇
// ⡿⢟⣰⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢭⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿