// Phrases and Actions for the Bingo Board
const phrases = [
    "'tag it and bag it'",
    "'Dot the I's and cross the T's'",
    "'Stella'",
    "'Did you know...?'",
    "'love it'",
    "'what it is is'",
    "'fluent'",
    "forgets someone's name mid sentence",
    "makes up a new word",
    "tells someone about a dream",
    "'Glass half full'",
    "'100%, 100%'",
    "'Daz'",
    "'Marko'''",
    "'Chlo'",
    "'What have you'",
    "'Have you ever heard of X?'",
    "'Smashing it/ Smashed it'",
    "Puts 'Cheeky' in front of something",
    "'That old chestnut'",
    "'Really?? Wowwww!'",
    "'G, wait til I tell you'",
    "Mentions a banana",
    "'Gwan P",
    "Mentions breaking up the week",
  ];
  
  const board = document.getElementById("bingo-board");
  const resetBtn = document.getElementById("reset-btn");
  const winModal = document.getElementById("win-modal");
  const closeModal = document.getElementById("close-modal");
  
  // Generate a shuffled bingo board
  function generateBoard() {
    board.innerHTML = "";
    const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);
    const selectedPhrases = shuffledPhrases.slice(0, 25);
  
    selectedPhrases.forEach((phrase, idx) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.textContent = phrase;
      square.dataset.index = idx;
  
      // Restore marked state from localStorage
      if (localStorage.getItem(`square-${idx}`) === "marked") {
        square.classList.add("marked");
      }
  
      // Add click handler
      square.addEventListener("click", () => {
        square.classList.toggle("marked");
  
        // Save state to localStorage
        localStorage.setItem(
          `square-${idx}`,
          square.classList.contains("marked") ? "marked" : ""
        );
  
        checkWin();
      });
  
      board.appendChild(square);
    });
  }
  
  // Check for Bingo (row, column, or diagonal)
  function checkWin() {
    const squares = Array.from(document.querySelectorAll(".square"));
    const rows = Array.from({ length: 5 }, (_, i) =>
      squares.slice(i * 5, i * 5 + 5)
    );
    const cols = Array.from({ length: 5 }, (_, i) =>
      squares.filter((_, idx) => idx % 5 === i)
    );
    const diagonals = [
      squares.filter((_, idx) => idx % 6 === 0),
      squares.filter((_, idx) => idx % 4 === 0 && idx > 0 && idx < 24),
    ];
  
    const isBingo = [...rows, ...cols, ...diagonals].some((line) =>
      line.every((square) => square.classList.contains("marked"))
    );
  
    if (isBingo) {
      winModal.classList.add("visible");
    }
  }
  
  // Reset the board
  resetBtn.addEventListener("click", () => {
    localStorage.clear();
    generateBoard();
  });
  
  // Close modal
  closeModal.addEventListener("click", () => {
    winModal.classList.remove("visible");
  });
  
  // Initialize
  generateBoard();
  