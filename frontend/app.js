// Simple Tic Tac Toe frontend game
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnEl = document.getElementById('turn');
const restartBtn = document.getElementById('restart');
const resultModal = document.getElementById('result-modal');
const resultTitle = document.getElementById('result-title');
const resultSub = document.getElementById('result-sub');
const resultIcon = document.getElementById('result-icon');
const playAgainBtn = document.getElementById('play-again');
const splash = document.getElementById('splash');
const startBtn = document.getElementById('start-btn');

let board = Array(9).fill(null);
let current = 'X';
let running = true;

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard(){
  boardEl.innerHTML = '';
  board.forEach((v, i) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.setAttribute('data-index', i);
    cell.setAttribute('aria-label', `Cell ${i+1}`);
    cell.setAttribute('role','gridcell');
    cell.textContent = v ? v : '';
    if(!running || v) cell.classList.add('disabled');
    cell.addEventListener('click', onCellClick);
    boardEl.appendChild(cell);
  });
}

function onCellClick(e){
  if(!running) return;
  const idx = Number(e.currentTarget.dataset.index);
  if(board[idx]) return;
  board[idx] = current;
  checkGame();
  if(running) switchTurn();
  renderBoard();
}

function switchTurn(){
  current = current === 'X' ? 'O' : 'X';
  turnEl.textContent = current;
}

function checkGame(){
  // check wins
  for(const line of WIN_LINES){
    const [a,b,c] = line;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      // win
      running = false;
      highlightWin(line);
      const winner = board[a];
      statusEl.innerHTML = `Winner: <strong>${winner}</strong>`;
      // show result modal with animation
      showResult(true, winner);
      return;
    }
  }
  // check draw
  if(board.every(Boolean)){
    running = false;
    statusEl.textContent = 'Draw';
    statusEl.classList.add('draw');
    showResult(false, null, true);
    return;
  }
}

function highlightWin(line){
  // render once so cells exist, then add class to winning cells
  const cells = boardEl.querySelectorAll('.cell');
  line.forEach(i => {
    const c = cells[i];
    if(c) c.classList.add('winner');
  });
}

restartBtn.addEventListener('click', ()=>{
  board = Array(9).fill(null);
  current = 'X';
  running = true;
  statusEl.textContent = 'Turn:';
  statusEl.classList.remove('draw');
  turnEl.textContent = current;
  renderBoard();
});

function showResult(isWin, winner = null, isDraw = false){
  if(isDraw){
    resultIcon.textContent = '🤝';
    resultTitle.textContent = `Draw`;
    resultSub.textContent = `Nobody won — try again.`;
  } else if(isWin){
    resultIcon.textContent = '🏆';
    resultTitle.textContent = `Winner!`;
    resultSub.textContent = `Player ${winner} wins the match.`;
  } else {
    resultIcon.textContent = '😞';
    resultTitle.textContent = `You Lost`;
    resultSub.textContent = `Try again to beat your opponent.`;
  }
  resultModal.setAttribute('aria-hidden','false');
}

function hideResult(){
  resultModal.setAttribute('aria-hidden','true');
}

playAgainBtn.addEventListener('click', ()=>{
  hideResult();
  restartBtn.click();
});

// Splash control
function hideSplash(){
  if(!splash) return;
  // add fade-out class to animate, then remove from layout after animation
  splash.classList.add('fade-out');
  setTimeout(()=>{
    try{ splash.style.display = 'none'; }catch(e){}
  }, 480);
}

startBtn.addEventListener('click', ()=>{
  hideSplash();
});

// auto-hide splash after 2 seconds
setTimeout(()=>{
  hideSplash();
}, 2000);

// allow clicking outside modal to close and restart
resultModal.addEventListener('click', (e)=>{
  if(e.target === resultModal){
    hideResult();
  }
});

// init
renderBoard();
turnEl.textContent = current;
statusEl.textContent = 'Turn:';
