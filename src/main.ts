import { Game } from './core/Game';

// Web UI elements
const playerStatusEl = document.getElementById('player-status')!;
const cultivationInfoEl = document.getElementById('cultivation-info')!;
const timeInfoEl = document.getElementById('time-info')!;
const gameOutputEl = document.getElementById('game-output')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
const cultivateBtn = document.getElementById('cultivate-btn') as HTMLButtonElement;

// Game instance
let game: Game;
let isRunning = false;

// Update UI with game state
function updateUI() {
  if (!game) return;

  const state = game.getState();
  const player = state.player;

  playerStatusEl.innerHTML = `
    <strong>Name:</strong> ${player.name}<br>
    <strong>Realm:</strong> ${player.realm}<br>
    <strong>Qi:</strong> ${player.qi.toFixed(1)} / ${player.maxQi}
  `;

  cultivationInfoEl.innerHTML = `
    <strong>Talent:</strong> ${player.talent}/100<br>
    <strong>Meridians Open:</strong> ${player.meridians.filter(m => m.isOpen).length}/12<br>
    <strong>Lifetime:</strong> ${player.lifetime} days
  `;

  timeInfoEl.innerHTML = `
    <strong>Game Time:</strong> Day ${state.time}<br>
    <strong>Status:</strong> ${state.isRunning ? 'Running' : 'Paused'}
  `;
}

// Log messages to the game output area
function logMessage(message: string) {
  gameOutputEl.textContent += message + '\n';
  gameOutputEl.scrollTop = gameOutputEl.scrollHeight;
}

// Override console.log to capture game messages
const originalLog = console.log;
console.log = (...args) => {
  const message = args.join(' ');
  logMessage(message);
  originalLog(...args);
};

// Event listeners
startBtn.addEventListener('click', () => {
  if (!game) {
    game = new Game();
    game.start();
    isRunning = true;
    startBtn.textContent = 'Stop Game';
    logMessage('Game started!');
  } else {
    if (isRunning) {
      game.stop();
      isRunning = false;
      startBtn.textContent = 'Start Game';
      logMessage('Game stopped.');
    } else {
      game.start();
      isRunning = true;
      startBtn.textContent = 'Stop Game';
      logMessage('Game started!');
    }
  }
  updateUI();
});

pauseBtn.addEventListener('click', () => {
  // For now, just log status
  logMessage('Manual tick - feature coming soon!');
});

cultivateBtn.addEventListener('click', () => {
  // For now, just log status
  logMessage('Cultivate - feature coming soon!');
});

// Initial UI update
updateUI();