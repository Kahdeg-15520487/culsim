import { Game } from './core/Game';
import { Player, Element } from './types/index';
import { i18n } from './utils/i18n';

// Web UI elements
const playerStatusEl = document.getElementById('player-status')!;
const cultivationInfoEl = document.getElementById('cultivation-info')!;
const meridianInfoEl = document.getElementById('meridian-info')!;
const meridianControlsEl = document.getElementById('meridian-controls')!;
const meridianSelectEl = document.getElementById('meridian-select') as HTMLSelectElement;
const unlockMeridianBtn = document.getElementById('unlock-meridian-btn') as HTMLButtonElement;
const elementsInfoEl = document.getElementById('elements-info')!;
const timeInfoEl = document.getElementById('time-info')!;
const gameOutputEl = document.getElementById('game-output')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
const cultivateBtn = document.getElementById('cultivate-btn') as HTMLButtonElement;
const breakthroughBtn = document.getElementById('breakthrough-btn') as HTMLButtonElement;

// Title elements
const gameTitleEl = document.getElementById('game-title')!;
const playerStatusTitleEl = document.getElementById('player-status-title')!;
const cultivationTitleEl = document.getElementById('cultivation-title')!;
const meridiansTitleEl = document.getElementById('meridians-title')!;
const elementsTitleEl = document.getElementById('elements-title')!;
const timeTitleEl = document.getElementById('time-title')!;

// Utility function to format days into years/months/days
function formatDays(days: number): string {
  if (days < 30) {
    return `${days} ${i18n.t('ui.days')}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (remainingDays === 0) {
      return `${months} ${i18n.t('ui.months')}`;
    } else {
      return `${months} ${i18n.t('ui.months')}, ${remainingDays} ${i18n.t('ui.days')}`;
    }
  } else {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    const finalDays = remainingDays % 30;

    let result = `${years} ${i18n.t('ui.years')}`;
    if (months > 0) {
      result += `, ${months} ${i18n.t('ui.months')}`;
    }
    if (finalDays > 0) {
      result += `, ${finalDays} ${i18n.t('ui.days')}`;
    }
    return result;
  }
}

// Add language selector
const languageSelect = document.createElement('select');
languageSelect.id = 'language-select';
const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' }
];
languages.forEach(lang => {
  const option = document.createElement('option');
  option.value = lang.code;
  option.textContent = lang.name;
  if (lang.code === i18n.getLanguage()) {
    option.selected = true;
  }
  languageSelect.appendChild(option);
});

// Add save/load buttons
const saveBtn = document.createElement('button');
saveBtn.textContent = i18n.t('ui.saveGame');
saveBtn.id = 'save-btn';
const loadBtn = document.createElement('button');
loadBtn.textContent = i18n.t('ui.loadGame');
loadBtn.id = 'load-btn';
const clearBtn = document.createElement('button');
clearBtn.textContent = i18n.t('ui.clearSavedGame');
clearBtn.id = 'clear-btn';

// Add language selector to controls
const controlsEl = document.querySelector('.controls')!;
controlsEl.appendChild(languageSelect);

// Add spacing between language selector and save/load buttons
const spacer = document.createElement('span');
spacer.style.display = 'inline-block';
spacer.style.width = '20px';
controlsEl.appendChild(spacer);

controlsEl.appendChild(saveBtn);
controlsEl.appendChild(loadBtn);
controlsEl.appendChild(clearBtn);

// Game instance
let game: Game;
let isRunning = false;
let uiUpdateInterval: NodeJS.Timeout | null = null;

// Check if a saved game exists
function hasSavedGame(): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('culsim-save') !== null;
  }
  return false;
}

// Initialize game on page load
function initializeGame() {
  if (hasSavedGame()) {
    // Auto-load saved game
    logMessage(i18n.t('ui.savedGameDetected'));
    game = new Game();
    const loaded = game.loadGame();
    if (loaded) {
      // Start the game loop for the loaded game
      game.start();
      isRunning = true;
      startBtn.textContent = i18n.t('ui.stopGame');
      startUIUpdates();
      logMessage(i18n.t('ui.gameLoaded'));
      updateUI();
    } else {
      // Fallback to new game if loading failed
      logMessage(i18n.t('ui.startingNewGame'));
      startNewGame();
    }
  } else {
    // No saved game, prompt for new game
    logMessage(i18n.t('ui.welcomeMessage'));
    logMessage(i18n.t('ui.startingNewGame'));
    startNewGame();
  }
}

// Start a new game
function startNewGame() {
  game = new Game();
  game.start();
  isRunning = true;
  startBtn.textContent = i18n.t('ui.stopGame');
  startUIUpdates();
  logMessage(i18n.t('ui.gameStarted'));
  updateUI();
}

// Update UI with game state
function updateUI() {
  if (!game) return;

  const state = game.getState();
  const player = state.player;
  const soul = state.soul;

  playerStatusEl.innerHTML = `
    <strong>${i18n.t('status.player')}:</strong> ${player.name}<br>
    <strong>${i18n.t('status.realm')}:</strong> ${i18n.getRealmName(player.realm)}<br>
    <strong>${i18n.t('status.qi')}:</strong> ${player.qi.toFixed(1)} / ${player.maxQi}
  `;

  cultivationInfoEl.innerHTML = `
    <strong>${i18n.t('status.talent')}:</strong> ${player.talent}/100<br>
    <strong>${i18n.t('ui.qiGathering')}:</strong> ${(game.calculateQiGatheringSpeed()).toFixed(3)} ${i18n.t('ui.qiPerDay')}<br>
    <strong>${i18n.t('status.meridians')}:</strong> ${player.meridians.filter(m => m.isOpen).length}/12 ${i18n.t('ui.meridiansOpen')}<br>
    <strong>${i18n.t('status.lifetime')}:</strong> ${formatDays(player.lifetime)}<br>
    <strong>${i18n.t('status.reincarnation')}:</strong> ${soul.lifetimeCount}<br>
    <strong>${i18n.t('ui.maxRealm')}:</strong> ${i18n.getRealmName(soul.maxRealmAchieved)}<br>
    <strong>${i18n.t('status.karma')}:</strong> ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}<br>
    <strong>${i18n.t('ui.breakthroughs')}:</strong> ${soul.cultivationInsights.realmBreakthroughs.length}
  `;

  meridianInfoEl.innerHTML = player.meridians.map((meridian, index) => {
    const status = meridian.isOpen ? '🟢' : '🔴';
    const purity = meridian.isOpen ? ` (${meridian.purity.toFixed(1)}%)` : '';
    const name = i18n.getMeridianName(index);
    const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name;
    const info = meridian.isOpen ? '' : ` (${i18n.t('ui.meridianReq', { qi: 50 + (index * 25) })})`;
    return `${status} ${displayName}${purity}${info}`;
  }).join('<br>');

  // Update elements info with primary/complementary distinction
  const primaryElement = game.getPrimaryElement();
  const complementaryElements = primaryElement ? game.getComplementaryElements(primaryElement, player.realm) : [];

  elementsInfoEl.innerHTML = `
    <strong>${i18n.getElementName(0)}:</strong> ${player.elements.metal.toFixed(1)}% ${primaryElement === Element.Metal ? '(Primary)' : complementaryElements.includes(Element.Metal) ? '(Complementary)' : ''}<br>
    <strong>${i18n.getElementName(1)}:</strong> ${player.elements.wood.toFixed(1)}% ${primaryElement === Element.Wood ? '(Primary)' : complementaryElements.includes(Element.Wood) ? '(Complementary)' : ''}<br>
    <strong>${i18n.getElementName(2)}:</strong> ${player.elements.water.toFixed(1)}% ${primaryElement === Element.Water ? '(Primary)' : complementaryElements.includes(Element.Water) ? '(Complementary)' : ''}<br>
    <strong>${i18n.getElementName(3)}:</strong> ${player.elements.fire.toFixed(1)}% ${primaryElement === Element.Fire ? '(Primary)' : complementaryElements.includes(Element.Fire) ? '(Complementary)' : ''}<br>
    <strong>${i18n.getElementName(4)}:</strong> ${player.elements.earth.toFixed(1)}% ${primaryElement === Element.Earth ? '(Primary)' : complementaryElements.includes(Element.Earth) ? '(Complementary)' : ''}
  `;

  // Update time info
  const days = Math.floor(state.time); // time is now in days
  timeInfoEl.innerHTML = `
    <strong>${i18n.t('status.time')}:</strong> ${formatDays(days)}<br>
    <strong>${i18n.t('status.gameSpeed')}:</strong> ${isRunning ? '▶️' : '⏸️'} ${isRunning ? i18n.t('status.running') : i18n.t('status.paused')}
  `;

  // Update meridian select dropdown
  updateMeridianSelect();
}

// Update all UI text elements (titles, buttons, etc.)
function updateUIText() {
  gameTitleEl.textContent = i18n.t('ui.gameTitle');
  playerStatusTitleEl.textContent = i18n.t('ui.playerStatus');
  cultivationTitleEl.textContent = i18n.t('ui.cultivationInfo');
  meridiansTitleEl.textContent = i18n.t('ui.meridianInfo');
  elementsTitleEl.textContent = i18n.t('status.elements');
  timeTitleEl.textContent = i18n.t('ui.timeInfo');

  // Update button texts
  startBtn.textContent = isRunning ? i18n.t('ui.stopGame') : i18n.t('ui.startGame');
  pauseBtn.textContent = i18n.t('ui.pauseGame');
  cultivateBtn.textContent = i18n.t('ui.cultivate');
  unlockMeridianBtn.textContent = i18n.t('ui.unlockSelectedMeridian');
  saveBtn.textContent = i18n.t('ui.saveGame');
  loadBtn.textContent = i18n.t('ui.loadGame');
  clearBtn.textContent = i18n.t('ui.clearSavedGame');

  // Update loading text
  if (!game) {
    playerStatusEl.textContent = i18n.t('ui.loading');
    cultivationInfoEl.textContent = i18n.t('ui.loading');
    meridianInfoEl.textContent = i18n.t('ui.loading');
    timeInfoEl.textContent = i18n.t('ui.loading');
  }
}

// Update meridian select dropdown with closed meridians
function updateMeridianSelect() {
  if (!game) return;

  const player = game.getState().player;
  const closedMeridians = player.meridians
    .map((meridian, index) => ({ meridian, index }))
    .filter(({ meridian }) => !meridian.isOpen);

  // Clear existing options
  meridianSelectEl.innerHTML = '';

  if (closedMeridians.length === 0) {
    const option = document.createElement('option');
    option.textContent = i18n.t('ui.allMeridiansOpen');
    option.disabled = true;
    meridianSelectEl.appendChild(option);
    unlockMeridianBtn.disabled = true;
  } else {
    closedMeridians.forEach(({ meridian, index }) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = `${i18n.getMeridianName(index)} (${i18n.t('ui.meridianReq', { qi: 50 + (index * 25) })})`;
      meridianSelectEl.appendChild(option);
    });
    unlockMeridianBtn.disabled = false;
  }
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
    startNewGame();
  } else {
    if (isRunning) {
      game.stop();
      isRunning = false;
      startBtn.textContent = i18n.t('ui.startGame');
      stopUIUpdates();
      logMessage(i18n.t('ui.gameStopped'));
    } else {
      game.start();
      isRunning = true;
      startBtn.textContent = i18n.t('ui.stopGame');
      startUIUpdates();
      logMessage(i18n.t('ui.gameStarted'));
    }
  }
  updateUI();
});

pauseBtn.addEventListener('click', () => {
  // For now, just log status
  logMessage(i18n.t('ui.pauseGame') + ' - feature coming soon!');
});

cultivateBtn.addEventListener('click', () => {
  if (!game) return;

  // Perform manual cultivation
  game.cultivate();
  updateUI(); // Refresh UI to show changes
});

breakthroughBtn.addEventListener('click', () => {
  if (!game) return;

  // Attempt manual breakthrough
  game.attemptBreakthrough();
  updateUI(); // Refresh UI to show changes
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
    logMessage(i18n.t('ui.gameLoaded'));
  } else {
    logMessage(i18n.t('ui.noSavedGame'));
  }
});

clearBtn.addEventListener('click', () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const confirmed = confirm(i18n.t('ui.confirmClearSavedGame'));
    if (confirmed) {
      localStorage.removeItem('culsim-save');
      logMessage(i18n.t('ui.savedGameCleared'));
    }
  }
});

unlockMeridianBtn.addEventListener('click', () => {
  if (!game) return;

  const selectedIndex = parseInt(meridianSelectEl.value);
  if (isNaN(selectedIndex)) return;

  // Attempt to unlock the selected meridian
  const player = game.getState().player;
  if (selectedIndex >= 0 && selectedIndex < player.meridians.length && !player.meridians[selectedIndex].isOpen) {
    // Check if player has enough qi
    const qiRequirement = 50 + (selectedIndex * 25);
    if (player.qi >= qiRequirement) {
      // Attempt meridian opening
      game.attemptMeridianOpening(selectedIndex);
      updateUI(); // Refresh UI to show changes
    } else {
      logMessage(i18n.t('ui.notEnoughQi', {
        qi: qiRequirement,
        meridian: i18n.getMeridianName(selectedIndex)
      }));
    }
  }
});

// Language selector event listener
languageSelect.addEventListener('change', () => {
  const selectedLanguage = languageSelect.value as 'en' | 'vi';
  i18n.setLanguage(selectedLanguage);

  // Update all UI text
  updateUIText();

  // Refresh UI with new language
  updateUI();
});

// Initial UI setup
updateUIText();
updateUI();

// Initialize game on page load
initializeGame();