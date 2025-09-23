import { Game } from './core/Game';

// Web UI elements
const playerStatusEl = document.getElementById('player-status')!;
const cultivationInfoEl = document.getElementById('cultivation-info')!;
const timeInfoEl = document.getElementById('time-info')!;
const gameOutputEl = document.getElementById('game-output')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
const cultivateBtn = document.getElementById('cultivate-btn') as HTMLButtonElement;

// Add save/load buttons
const saveBtn = document.createElement('button');
saveBtn.textContent = 'Save Game';
saveBtn.id = 'save-btn';
const loadBtn = document.createElement('button');
loadBtn.textContent = 'Load Game';
loadBtn.id = 'load-btn';

// Add buttons to controls
const controlsEl = document.querySelector('.controls')!;
controlsEl.appendChild(saveBtn);
controlsEl.appendChild(loadBtn);

// Game instance
let game: Game;
let isRunning = false;
let uiUpdateInterval: NodeJS.Timeout | null = null;

// Update UI with game state
function updateUI() {
  if (!game) return;

  const state = game.getState();
  const player = state.player;
  const soul = state.soul;

  playerStatusEl.innerHTML = `
    <strong>Name:</strong> ${player.name}<br>
    <strong>Realm:</strong> ${player.realm}<br>
    <strong>Qi:</strong> ${player.qi.toFixed(1)} / ${player.maxQi}
  `;

  cultivationInfoEl.innerHTML = `
    <strong>Talent:</strong> ${player.talent}/100<br>
    <strong>Meridians Open:</strong> ${player.meridians.filter(m => m.isOpen).length}/12<br>
    <strong>Lifetime:</strong> ${player.lifetime} days<br>
    <strong>Reincarnations:</strong> ${soul.lifetimeCount}<br>
    <strong>Max Realm:</strong> ${soul.maxRealmAchieved}<br>
    <strong>Karmic Balance:</strong> ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}
  `;

  timeInfoEl.innerHTML = `
    <strong>Game Time:</strong> Day ${state.time}<br>
    <strong>Status:</strong> ${state.isRunning ? 'Running' : 'Paused'}<br>
    <strong>Seed:</strong> ${state.seed}
  `;
}

// Start UI update loop
function startUIUpdates() {
  if (uiUpdateInterval) {
    clearInterval(uiUpdateInterval);
  }
  uiUpdateInterval = setInterval(updateUI, 1000); // Update UI every second
}

// Stop UI update loop
function stopUIUpdates() {
  if (uiUpdateInterval) {
    clearInterval(uiUpdateInterval);
    uiUpdateInterval = null;
  }
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
    startUIUpdates();
    logMessage('Game started!');
  } else {
    if (isRunning) {
      game.stop();
      isRunning = false;
      startBtn.textContent = 'Start Game';
      stopUIUpdates();
      logMessage('Game stopped.');
    } else {
      game.start();
      isRunning = true;
      startBtn.textContent = 'Stop Game';
      startUIUpdates();
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

saveBtn.addEventListener('click', () => {
  if (game) {
    game.saveGame();
    updateUI();
  }
});

loadBtn.addEventListener('click', () => {
  if (!game) {
    game = new Game();
  }
  const loaded = game.loadGame();
  if (loaded) {
    updateUI();
    logMessage('Game loaded successfully!');
  } else {
    logMessage('No saved game found.');
  }
});

// Initial UI update
updateUI();