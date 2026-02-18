const phrases = [
"Customer asks for agents name",
"Customer is born in February",
"Customers mobile starts with 089",
"Customer has the same name as a phone agent",
"Customer has a funny email address",
"Customer has more than 1 product with us",
"Customer says they don’t have an account number",
"This is a new customer(came onto supply in February)",
"Quality: 1st evaluator to complete their weeks evals",
"Quality: NPS categorisation completed",
"BB: Customer wants an engineer out today",
"BB: Customer says the dog ate the cable",
"Yuno: Customer wants to change their billing date",
"Yuno: Customer wants to make payment over the phone",
"CX Ops: Customer gives incorrect last 6 in AC Requests",
"CX Ops: Customer selects incorrect meter type",
];

const board = document.getElementById("bingo-board");
const resetBtn = document.getElementById("reset-btn");
const winModal = document.getElementById("win-modal");
const closeModal = document.getElementById("close-modal");

// Save board layout, marked squares and crn values to localStorage
function saveBoardToLocalStorage(boardArray, markedSquares, crnValues) {
  localStorage.setItem('bingoBoard', JSON.stringify(boardArray));
  localStorage.setItem('markedSquares', JSON.stringify(markedSquares));
  localStorage.setItem('crnValues', JSON.stringify(crnValues));
}

// Load the board layout, marked squares and crn values from localStorage
function loadBoardFromLocalStorage() {
  const savedBoard = JSON.parse(localStorage.getItem('bingoBoard'));
  const savedMarkedSquares = JSON.parse(localStorage.getItem('markedSquares'));
  const savedCrnValues = JSON.parse(localStorage.getItem('crnValues'));
  return { savedBoard, savedMarkedSquares, savedCrnValues };
}

// Generate a new shuffled board with 16 random phrases and save it to localStorage
function generateNewBoard() {
  const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5); // Shuffle the array
  const boardArray = shuffledPhrases.slice(0, 16); // Select the first 16 phrases
  const markedSquares = Array(16).fill(false); // Initialize marked squares
  const crnValues = Array(16).fill(null); // Initialize per-square CRN values
  saveBoardToLocalStorage(boardArray, markedSquares, crnValues);
  return { boardArray, markedSquares, crnValues };
}

// Render the bingo board
function renderBoard(boardArray, markedSquares, crnValues) {
  board.innerHTML = '';
  boardArray.forEach((phrase, idx) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.dataset.index = idx;

    // If already marked, show phrase and CRN label
    if (markedSquares[idx]) {
      square.classList.add('marked');
      const phraseDiv = document.createElement('div');
      phraseDiv.textContent = phrase;
      square.appendChild(phraseDiv);
      if (crnValues && crnValues[idx]) {
        const crnTag = document.createElement('div');
        crnTag.classList.add('crn-tag');
        crnTag.style.fontSize = '0.8em';
        crnTag.style.marginTop = '6px';
        crnTag.textContent = `CRN: ${crnValues[idx]}`;
        square.appendChild(crnTag);
      }
    } else {
      // Not marked: show phrase, input, and button
      const phraseDiv = document.createElement('div');
      phraseDiv.textContent = phrase;
      square.appendChild(phraseDiv);
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'CRN/Call ID';
      input.className = 'crn-square-input';
      input.style.marginTop = '6px';
      input.style.width = '70px';
      input.value = crnValues[idx] || '';
      square.appendChild(input);
      const btn = document.createElement('button');
      btn.textContent = 'Submit';
      btn.className = 'crn-square-btn';
      btn.style.marginLeft = '4px';
      btn.style.fontSize = '0.8em';
      square.appendChild(btn);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = (input.value || '').trim();
        if (!val) {
          alert('Please enter a CRN before submitting.');
          return;
        }
        markedSquares[idx] = true;
        crnValues[idx] = val;
        saveBoardToLocalStorage(boardArray, markedSquares, crnValues);
        renderBoard(boardArray, markedSquares, crnValues);
        checkWin(boardArray, markedSquares, crnValues);
      });
    }

    board.appendChild(square);
  });
}

// Check for Bingo (any 8 of 16 squares must be marked)
function checkWin(boardArray, markedSquares, crnValues) {
  const markedCount = markedSquares.filter(Boolean).length;
  if (markedCount >= 8) {
    winModal.classList.add('visible');
    addEmailButtonToModal(boardArray, crnValues);
  }
}

// Add an email button to the win modal that creates a mailto link with phrase->CRN pairs
function addEmailButtonToModal(boardArray, crnValues) {
  if (!winModal) return;
  // avoid creating multiple buttons
  let emailBtn = document.getElementById('email-crn-btn');
  if (!emailBtn) {
    emailBtn = document.createElement('button');
    emailBtn.id = 'email-crn-btn';
    emailBtn.textContent = 'Email CRNs';
    emailBtn.style.marginLeft = '8px';
    // If the modal has a content area, append there; otherwise append to modal
    const contentArea = winModal.querySelector('.modal-content') || winModal;
    contentArea.appendChild(emailBtn);
  }

  emailBtn.onclick = () => {
    // Build body with key=value pairs for each phrase that has a CRN
    const lines = [];
    for (let i = 0; i < boardArray.length; i++) {
      const crn = crnValues && crnValues[i];
      if (crn) {
        const key = boardArray[i];
        lines.push(`${key} = ${crn}`);
      }
    }
    if (lines.length === 0) {
      alert('No CRNs found to email.');
      return;
    }
    showEmailModal(lines.join('\n'));
  };
}

// Show modal explaining mailto behavior with option to copy to clipboard
function showEmailModal(crnText) {
  // Create modal if it doesn't exist
  let emailModal = document.getElementById('email-modal');
  if (!emailModal) {
    emailModal = document.createElement('div');
    emailModal.id = 'email-modal';
    emailModal.className = 'modal';
    emailModal.innerHTML = `
      <div class="modal-content">
        <h2>Opening Email</h2>
        <p>Give it a minute for your email client to open with the CRNs pre-filled.</p>
        <p>If it doesn't work, click the button below to copy the CRNs to your clipboard:</p>
        <button id="copy-crn-btn" class="copy-btn">Copy CRNs to Clipboard</button>
        <button id="close-email-modal" class="close-btn">Close</button>
      </div>
    `;
    document.body.appendChild(emailModal);
  }

  // Update the copy button with current CRN data
  const copyBtn = emailModal.querySelector('#copy-crn-btn');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(crnText).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy CRNs to Clipboard';
      }, 2000);
    }).catch(() => {
      alert('Failed to copy. Please try again.');
    });
  };

  // Close button
  const closeEmailBtn = emailModal.querySelector('#close-email-modal');
  closeEmailBtn.onclick = () => {
    emailModal.classList.remove('visible');
  };

  // Show the modal
  emailModal.classList.add('visible');

  // Also trigger the mailto link
  const subject = encodeURIComponent('Bingo CRNs');
  const body = encodeURIComponent(crnText);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Reset the board
resetBtn.addEventListener('click', () => {
  // Clear board-specific storage but keep currentCRN (user may want to keep it)
  localStorage.removeItem('bingoBoard');
  localStorage.removeItem('markedSquares');
  localStorage.removeItem('crnValues');
  try {
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
} catch (e) {}

  const { boardArray, markedSquares, crnValues } = generateNewBoard();
  renderBoard(boardArray, markedSquares, crnValues);
});

// Close modal
closeModal.addEventListener('click', () => {
  winModal.classList.remove('visible');
});

// Initialize the Bingo board
function initializeBoard() {
  const { savedBoard, savedMarkedSquares, savedCrnValues } = loadBoardFromLocalStorage();
  if (savedBoard && savedMarkedSquares) {
    // Ensure crnValues array exists and has correct length
    const crnValues = Array.isArray(savedCrnValues) && savedCrnValues.length === 16
      ? savedCrnValues
      : Array(16).fill(null);
    renderBoard(savedBoard, savedMarkedSquares, crnValues);
  } else {
    const { boardArray, markedSquares, crnValues } = generateNewBoard();
    renderBoard(boardArray, markedSquares, crnValues);
  }
}

// Start the game
initializeBoard();
