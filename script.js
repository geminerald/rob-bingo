const phrases = [
  "Phrase: 'Tag it and bag it'",
  "Phrase: 'Dot the I's and cross the T's'",
  "Phrase: 'Stella'",
  "Phrase: 'Did you know...?'",
  "Phrase: 'Love it'",
  "Phrase: 'What it is is'",
  "Phrase: 'Fluent'",
  "Action: Forgets someone's name mid sentence",
  "Action: Makes up a new word",
  "Action: Tells someone about a dream",
  "Phrase: 'Glass half full'",
  "Phrase: '100%, 100%'",
  "Phrase: 'Daz'",
  "Phrase: 'Marko'",
  "Phrase: 'Chlo'",
  "Action: Offers to tell you a 'Well known fact'",
  "Phrase: 'Have you ever heard of X?'",
  "Phrase: 'Smashing it/ Smashed it'",
  "Action: Puts 'Cheeky' in front of something",
  "Phrase: 'That old Chestnut'",
  "Phrase: 'Really?? Wowwww!'",
  "Phrase: 'G, wait til I tell you'",
  "Action: Mentions a banana",
  "Phrase: 'Gwan P'",
  "Action: Mentions breaking up the week",
  "Phrase: Heyoo!!",
];

const board = document.getElementById("bingo-board");
const resetBtn = document.getElementById("reset-btn");
const winModal = document.getElementById("win-modal");
const closeModal = document.getElementById("close-modal");

// Save board layout and marked squares to localStorage
function saveBoardToLocalStorage(boardArray, markedSquares) {
  localStorage.setItem("bingoBoard", JSON.stringify(boardArray));
  localStorage.setItem("markedSquares", JSON.stringify(markedSquares));
}

// Load the board layout and marked squares from localStorage
function loadBoardFromLocalStorage() {
  const savedBoard = JSON.parse(localStorage.getItem("bingoBoard"));
  const savedMarkedSquares = JSON.parse(localStorage.getItem("markedSquares"));
  return { savedBoard, savedMarkedSquares };
}

// Generate a new shuffled board with 25 random phrases and save it to localStorage
function generateNewBoard() {
  const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5); // Shuffle the array
  const boardArray = shuffledPhrases.slice(0, 25); // Select the first 25 phrases
  const markedSquares = Array(25).fill(false); // Initialize marked squares
  saveBoardToLocalStorage(boardArray, markedSquares);
  return { boardArray, markedSquares };
}

// Render the bingo board
function renderBoard(boardArray, markedSquares) {
  board.innerHTML = "";
  boardArray.forEach((phrase, idx) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.textContent = phrase;
    square.dataset.index = idx;

    // Mark square if saved as marked
    if (markedSquares[idx]) {
      square.classList.add("marked");
    }

    // Handle square click
    square.addEventListener("click", () => {
      square.classList.toggle("marked");
      markedSquares[idx] = square.classList.contains("marked");
      saveBoardToLocalStorage(boardArray, markedSquares);
      checkWin(boardArray, markedSquares);
    });

    board.appendChild(square);
  });
}

// Check for Bingo (row, column, or diagonal)
function checkWin(boardArray, markedSquares) {
  const rows = Array.from({ length: 5 }, (_, i) =>
    markedSquares.slice(i * 5, i * 5 + 5)
  );
  const cols = Array.from({ length: 5 }, (_, i) =>
    markedSquares.filter((_, idx) => idx % 5 === i)
  );
  const diagonals = [
    markedSquares.filter((_, idx) => idx % 6 === 0),
    markedSquares.filter((_, idx) => idx % 4 === 0 && idx > 0 && idx < 24),
  ];

  const isBingo = [...rows, ...cols, ...diagonals].some((line) =>
    line.every((square) => square)
  );

  if (isBingo) {
    winModal.classList.add("visible");
  }
}

// Reset the board
resetBtn.addEventListener("click", () => {
  localStorage.clear();
  const { boardArray, markedSquares } = generateNewBoard();
  renderBoard(boardArray, markedSquares);
});

// Close modal
closeModal.addEventListener("click", () => {
  winModal.classList.remove("visible");
});

// Initialize the Bingo board
function initializeBoard() {
  const { savedBoard, savedMarkedSquares } = loadBoardFromLocalStorage();
  if (savedBoard && savedMarkedSquares) {
    renderBoard(savedBoard, savedMarkedSquares);
  } else {
    const { boardArray, markedSquares } = generateNewBoard();
    renderBoard(boardArray, markedSquares);
  }
}

// Start the game
initializeBoard();