function assert(condition, message) {
  if (!condition) {
    console.error("🐮 Fail:", message);
  } else {
    console.log("🦎 Pass:", message);
  }
}

//board starts empty and is the correct size
function testCreateBoard() {
  const b = createBoard();
  assert(b.length === 6, "Board has 6 rows");
  assert(b[0].length === 7, "Board has 7 columns");
  assert(b.every(row => row.every(cell => cell === 0)), "Board starts empty");
}

//make sure tokens fall to where they should
function testFindOpenRow() {
  board = createBoard();
  let row = findOpenRow(0);
  assert(row === 5, "first piece goes to bottom");

  board[5][0] = 1;
  row = findOpenRow(0);
  assert(row === 4, "next piece stacks on top");
}

//column should be full after 6 pieces
function testFullColumn() {
  board = createBoard();
  for (let r = 0; r < 6; r++) {
    board[r][0] = 1;
  }

  const row = findOpenRow(0);
  assert(row === -1, "column is full");
}

//horizontal win
function testHorizontalWin() {
  board = createBoard();

  for (let c = 0; c < 4; c++) {
    board[5][c] = 1;
  }

  assert(checkWin(5, 3, 1), "horizontal win works");
}

//vertical win
function testVerticalWin() {
  board = createBoard();

  for (let r = 5; r >= 2; r--) {
    board[r][0] = 1;
  }

  assert(checkWin(2, 0, 1), "vertical win works");
}

/// win
function testDiagonalWin1() {
  board = createBoard();

  board[5][0] = 1;
  board[4][1] = 1;
  board[3][2] = 1;
  board[2][3] = 1;

  assert(checkWin(2, 3, 1), "diagonal / win works");
}

//\ win
function testDiagonalWin2() {
  board = createBoard();

  board[2][0] = 1;
  board[3][1] = 1;
  board[4][2] = 1;
  board[5][3] = 1;

  assert(checkWin(5, 3, 1), "diagonal \\ win works");
}

//tie chack
function testBoardFull() {
  board = createBoard();

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      board[r][c] = 1;
    }
  }

  assert(isBoardFull(), "Tie check works");
}

//Invalid column
function testInvalidColumn() {
  const invalidLow = !Number.isInteger(-1) || -1 < 0;
  const invalidHigh = !Number.isInteger(7) || 7 >= COLS;

  assert(invalidLow, "Can't be negative");
  assert(invalidHigh, "Can't be above 7");
}


function runTests() {

  const savedBoard = JSON.parse(JSON.stringify(board));
  const savedPlayer = currentPlayer;
  const savedStarting = startingPlayer;
  const savedGameOver = gameOver;
  const savedScores = { ...scores };

  testCreateBoard();
  testFindOpenRow();
  testFullColumn();
  testHorizontalWin();
  testVerticalWin();
  testDiagonalWin1();
  testDiagonalWin2();
  testBoardFull();
  testInvalidColumn();

  console.log("Tests Done");

  board = savedBoard;
  currentPlayer = savedPlayer;
  startingPlayer = savedStarting;
  gameOver = savedGameOver;
  scores = savedScores;

  renderBoard();
  updateUi();
}

runTests();
