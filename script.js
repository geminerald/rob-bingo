// Phrases and Actions for the Bingo Board
const phrases = [
    "Phrase: 'Tag it and bag it'",
    "Phrase: 'Dot the I's and cross the T's'",
    "Phrase: 'Stella'",
    "Phrase: 'Did you know...?'",
    "Phrase: 'Love it'",
    "Phrase: 'what it is is'",
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
    "Phrase: 'Gwan P",
    "Action: Mentions breaking up the week",
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
  