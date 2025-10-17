// Simple Tic Tac Toe frontend game
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const turnEl = document.getElementById('turn');
const restartBtn = document.getElementById('restart');

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
      statusEl.innerHTML = `Winner: <strong>${board[a]}</strong>`;
      return;
    }
  }
  // check draw
  if(board.every(Boolean)){
    running = false;
    statusEl.textContent = 'Draw';
    statusEl.classList.add('draw');
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

// init
renderBoard();
turnEl.textContent = current;
statusEl.textContent = 'Turn:';
