import { Game } from './core/Game';
import { Player, Element } from './types/index';
import { i18n } from './utils/i18n';
import { MERIDIAN_CONSTANTS, PURITY_THRESHOLDS, MERIDIAN_BREAKTHROUGH } from './core/constants';

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
const debugTitleEl = document.getElementById('debug-title')!;
const debugAddQiBtn = document.getElementById('debug-add-qi-btn') as HTMLButtonElement;
const debugAddMeridianBtn = document.getElementById('debug-add-meridian-btn') as HTMLButtonElement;
const debugAddElementBtn = document.getElementById('debug-add-element-btn') as HTMLButtonElement;

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

// Add language selector and top controls
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

// Add controls to top-controls container
const topControlsEl = document.querySelector('.top-controls')!;
const languageContainer = document.createElement('div');
languageContainer.className = 'control-group';
languageContainer.innerHTML = '<label for="language-select" style="margin-right: 5px;">🌐</label>';
languageContainer.appendChild(languageSelect);

const saveLoadContainer = document.createElement('div');
saveLoadContainer.className = 'control-group';
saveLoadContainer.appendChild(saveBtn);
saveLoadContainer.appendChild(loadBtn);
saveLoadContainer.appendChild(clearBtn);

topControlsEl.appendChild(languageContainer);
topControlsEl.appendChild(saveLoadContainer);

// Card collapse functionality
function initializeCardCollapse() {
  const toggles = document.querySelectorAll('.card-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const cardName = (toggle as HTMLButtonElement).dataset.card;
      const card = (toggle as HTMLElement).closest('.info-card');
      const content = card?.querySelector('.card-content');
      
      if (card && content) {
        const isCollapsed = card.classList.contains('card-collapsed');
        
        if (isCollapsed) {
          card.classList.remove('card-collapsed');
          (toggle as HTMLButtonElement).textContent = '−';
        } else {
          card.classList.add('card-collapsed');
          (toggle as HTMLButtonElement).textContent = '+';
        }
      }
    });
  });
}

// Game instance
let game: Game;
let isRunning = false;

// Check if a saved game exists
function hasSavedGame(): boolean {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('culsim-save-0') !== null;
  }
  return false;
}

// Initialize game on page load
function initializeGame() {
  if (hasSavedGame()) {
    // Auto-load saved game
    logMessage(i18n.t('ui.savedGameDetected'));
    game = new Game(undefined, updateUI);
    const loaded = game.loadGame();
    if (loaded) {
      // Start the game loop for the loaded game
      game.start();
      isRunning = true;
      startBtn.textContent = i18n.t('ui.stopGame');
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
  game = new Game(undefined, updateUI);
  game.start();
  isRunning = true;
  startBtn.textContent = i18n.t('ui.stopGame');
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
    <strong>${i18n.t('status.qi')}:</strong> ${player.qi.toFixed(1)} / ${player.maxQi}<br>
    <strong>${i18n.t('ui.qiGathering')}:</strong> ${(game.calculateQiGatheringSpeed()).toFixed(3)} ${i18n.t('ui.qiPerDay')}<br>
    <strong>${i18n.t('status.meridians')}:</strong> ${player.meridians.filter(m => m.isOpen).length}/12 ${i18n.t('ui.meridiansOpen')}<br>
    <strong>${i18n.t('status.talent')}:</strong> ${player.talent}/100<br>
    <strong>${i18n.t('status.karma')}:</strong> ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}
  `;

  cultivationInfoEl.innerHTML = `
    <strong>${i18n.t('status.lifetime')}:</strong> ${formatDays(player.lifetime)}<br>
    <strong>${i18n.t('status.reincarnation')}:</strong> ${soul.lifetimeCount}<br>
    <strong>${i18n.t('ui.maxRealm')}:</strong> ${i18n.getRealmName(soul.maxRealmAchieved)}<br>
    <strong>${i18n.t('ui.breakthroughs')}:</strong> ${soul.cultivationInsights.realmBreakthroughs.length}
  `;

  meridianInfoEl.innerHTML = player.meridians.map((meridian, index) => {
    const status = meridian.isOpen ? '🟢' : '🔴';
    const purity = meridian.isOpen ? ` (${meridian.purity.toFixed(1)}%)` : '';
    const name = i18n.getMeridianName(index);
    const displayName = name.length > 15 ? name.substring(0, 12) + '...' : name;
    const info = meridian.isOpen ? '' : ` (${i18n.t('ui.meridianReq', { qi: MERIDIAN_CONSTANTS.OPENING_BASE_COST + (index * MERIDIAN_CONSTANTS.OPENING_COST_INCREMENT) })})`;

    // Add breakthrough button if meridian is eligible
    const isBreakthroughEligible = meridian.isOpen && meridian.purity >= game.getMeridianEffectiveCap(meridian) && meridian.breakthroughStage < 3;
    const breakthroughButton = isBreakthroughEligible
      ? (() => {
          const baseQiCost = (index + 1) * MERIDIAN_BREAKTHROUGH.QI_COST_MULTIPLIER;
          const stageMultiplier = 1 + (meridian.breakthroughStage * 10);
          const qiCost = baseQiCost * stageMultiplier;
          return `<button class="meridian-breakthrough-btn" data-meridian-index="${index}" style="background: #007bff; color: white; border: none; padding: 2px 6px; margin-right: 5px; cursor: pointer; border-radius: 3px; font-size: 0.8em;">${qiCost} ${i18n.t('ui.qiUnit')}</button>`;
        })()
      : '';

    return `${status} ${breakthroughButton}${displayName}${purity}${info}`;
  }).join('<br>');  // Update elements info with primary/complementary distinction
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
  debugTitleEl.textContent = i18n.t('ui.debugTitle');

  // Update button texts
  startBtn.textContent = isRunning ? i18n.t('ui.stopGame') : i18n.t('ui.startGame');
  pauseBtn.textContent = i18n.t('ui.pauseGame');
  cultivateBtn.textContent = i18n.t('ui.cultivate');
  unlockMeridianBtn.textContent = i18n.t('ui.unlockSelectedMeridian');
  debugAddQiBtn.textContent = i18n.t('ui.addQi');
  debugAddMeridianBtn.textContent = i18n.t('ui.addMeridians');
  debugAddElementBtn.textContent = i18n.t('ui.addElements');
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
      option.textContent = `${i18n.getMeridianName(index)} (${i18n.t('ui.meridianReq', { qi: MERIDIAN_CONSTANTS.OPENING_BASE_COST + (index * MERIDIAN_CONSTANTS.OPENING_COST_INCREMENT) })})`;
      meridianSelectEl.appendChild(option);
    });
    unlockMeridianBtn.disabled = false;
  }
}

// Start UI update loop
function startUIUpdates() {
  // UI updates are now handled by the game loop
}

function stopUIUpdates() {
  // UI updates are now handled by the game loop
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

debugAddQiBtn.addEventListener('click', () => {
  if (!game) return;

  // Debug: Add 10 qi to player
  game.debugAddQi();
  updateUI(); // Refresh UI to show changes
});

debugAddMeridianBtn.addEventListener('click', () => {
  if (!game) return;

  // Debug: Add 10% to meridians
  game.debugAddMeridianProgress(10);
  updateUI(); // Refresh UI to show changes
});

debugAddElementBtn.addEventListener('click', () => {
  if (!game) return;

  // Debug: Add 10% to elements
  game.debugAddElementProgress(10);
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
    game = new Game(undefined, updateUI);
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
      // Stop current game if running
      if (game && isRunning) {
        game.stop();
        isRunning = false;
        stopUIUpdates();
      }

      // Clear saved game
      localStorage.removeItem('culsim-save');

      // Start new game
      startNewGame();

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
    const qiRequirement = MERIDIAN_CONSTANTS.OPENING_BASE_COST + (selectedIndex * MERIDIAN_CONSTANTS.OPENING_COST_INCREMENT);
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

// Meridian breakthrough event listener (event delegation for dynamic buttons)
meridianInfoEl.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('meridian-breakthrough-btn')) {
    const meridianIndex = parseInt(target.getAttribute('data-meridian-index') || '-1');
    if (meridianIndex >= 0 && game) {
      // Attempt meridian breakthrough
      game.attemptMeridianBreakthrough(meridianIndex);
      updateUI(); // Refresh UI to show changes
    }
  }
});

// Language selector event listener
languageSelect.addEventListener('change', () => {
  const selectedLanguage = languageSelect.value as 'en' | 'vi';
  i18n.setLanguage(selectedLanguage);
  updateUIText(); // Update all UI text elements
  updateUI(); // Refresh UI to show changes
});

// Initial UI setup
initializeCardCollapse(); // Initialize collapsible cards
updateUIText();
updateUI();

// Initialize game on page load
initializeGame();