import { Game } from './core/Game';
import { Player, Element, Item, ItemCategory, ItemQuality, EquipmentSlot, InventoryFilter, InventorySort } from './types/index';
import { i18n } from './utils/i18n';
import { MERIDIAN_CONSTANTS, PURITY_THRESHOLDS, MERIDIAN_BREAKTHROUGH } from './core/constants';
import { InventorySystem } from './utils/InventorySystem';
import { ItemInteractionSystem } from './utils/ItemInteractionSystem';
import { LootSystem } from './utils/LootSystem';
import { Random } from './utils/Random';

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
const cultivateBtn = document.getElementById('cultivate-btn') as HTMLButtonElement;
const breakthroughBtn = document.getElementById('breakthrough-btn') as HTMLButtonElement;

// Navigation elements
const navTabs = document.querySelectorAll('.nav-tab');
const overviewPage = document.querySelector('.game-info')!;
const combatPage = document.getElementById('combat-page')!;
const inventoryPage = document.getElementById('inventory-page')!;

// Combat UI elements
const enemyDisplayEl = document.getElementById('enemy-display')!;
const findEnemyBtn = document.getElementById('find-enemy-btn') as HTMLButtonElement;
const attackBtn = document.getElementById('attack-btn') as HTMLButtonElement;
const fleeBtn = document.getElementById('flee-btn') as HTMLButtonElement;
const combatStatsEl = document.getElementById('combat-stats')!;
const combatLootEl = document.getElementById('combat-loot')!;

// Inventory UI elements
const inventorySearchEl = document.getElementById('inventory-search') as HTMLInputElement;
const categoryFilterEl = document.getElementById('category-filter') as HTMLSelectElement;
const qualityFilterEl = document.getElementById('quality-filter') as HTMLSelectElement;
const sortSelectEl = document.getElementById('sort-select') as HTMLSelectElement;
const totalItemsEl = document.getElementById('total-items')!;
const uniqueItemsEl = document.getElementById('unique-items')!;
const totalValueEl = document.getElementById('total-value')!;
const inventoryCapacityEl = document.getElementById('inventory-capacity')!;
const itemGridEl = document.getElementById('item-grid')!;
const itemDetailsEl = document.getElementById('item-details')!;
const itemActionsEl = document.getElementById('item-actions')!;
const weaponSlotEl = document.getElementById('weapon-slot')!;
const armorSlotEl = document.getElementById('armor-slot')!;
const accessory1SlotEl = document.getElementById('accessory1-slot')!;
const accessory2SlotEl = document.getElementById('accessory2-slot')!;

// Legacy inventory elements (for backward compatibility)
const artifactCountEl = document.getElementById('artifact-count')!;
const inventorySpaceEl = document.getElementById('inventory-space')!;
const artifactGridEl = document.getElementById('artifact-grid')!;
const artifactDetailsEl = document.getElementById('artifact-details')!;

// Combat state
let currentEnemy: any = null;
let combatLoot: any[] = [];

// Navigation functionality
function switchPage(pageName: string) {
  // Update navigation tabs
  navTabs.forEach(tab => {
    tab.classList.remove('active');
    if ((tab as HTMLElement).dataset.page === pageName) {
      tab.classList.add('active');
    }
  });

  // Show/hide pages
  overviewPage.classList.toggle('active', pageName === 'overview');
  combatPage.classList.toggle('active', pageName === 'overview' ? false : true);
  inventoryPage.classList.toggle('active', pageName === 'inventory');

  // Update page visibility
  (overviewPage as HTMLElement).style.display = pageName === 'overview' ? 'grid' : 'none';
  (combatPage as HTMLElement).style.display = pageName === 'combat' ? 'block' : 'none';
  (inventoryPage as HTMLElement).style.display = pageName === 'inventory' ? 'block' : 'none';

  // Update inventory display when switching to inventory page
  if (pageName === 'inventory') {
    updateInventoryDisplay();
  }
}

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

// Combat functions
function updateEnemyDisplay() {
  if (!currentEnemy) {
    enemyDisplayEl.innerHTML = '<div class="no-enemy">No enemy encountered. Click "Find Enemy" to search for opponents.</div>';
    attackBtn.disabled = true;
    fleeBtn.disabled = true;
    return;
  }

  const enemyHtml = `
    <div class="enemy-info">
      <div class="enemy-name">${currentEnemy.name}</div>
      <div class="enemy-stats">
        <div class="enemy-stat">Realm: ${game.getRealmName(currentEnemy.realm)}</div>
        <div class="enemy-stat">Qi: ${currentEnemy.qi.toFixed(0)}/${currentEnemy.maxQi.toFixed(0)}</div>
        <div class="enemy-stat">Type: ${currentEnemy.combatType}</div>
        <div class="enemy-stat">Aggression: ${currentEnemy.aggression}%</div>
      </div>
    </div>
  `;
  enemyDisplayEl.innerHTML = enemyHtml;
  attackBtn.disabled = false;
  fleeBtn.disabled = false;
}

function updateCombatStats() {
  if (!currentEnemy) {
    combatStatsEl.textContent = 'No active combat';
    return;
  }

  const player = game.getState().player;
  const playerPower = player.qi + (player.talent * 2) + (player.realm * 100);
  const enemyPower = currentEnemy.qi + (currentEnemy.realm * 50);

  combatStatsEl.innerHTML = `
    <strong>Your Power:</strong> ${playerPower.toFixed(0)}<br>
    <strong>Enemy Power:</strong> ${enemyPower.toFixed(0)}<br>
    <strong>Win Chance:</strong> ${((playerPower / (playerPower + enemyPower)) * 100).toFixed(1)}%
  `;
}

function updateCombatLoot() {
  if (combatLoot.length === 0) {
    combatLootEl.textContent = 'No loot available';
    return;
  }

  const lootHtml = combatLoot.map(item => {
    if (item.type === 'artifact') {
      return `📿 ${item.name}: ${item.description} (Value: ${item.value})`;
    } else if (item.type === 'elemental_crystal') {
      return `💎 ${item.element} Crystal: ${item.description} (Value: ${item.value})`;
    } else if (item.type === 'cultivation_insight') {
      return `📚 ${item.name}: ${item.description} (Value: ${item.value})`;
    }
    return `${item.name}: ${item.description}`;
  }).join('<br>');

  combatLootEl.innerHTML = lootHtml;
}

function findEnemy() {
  currentEnemy = game.generateRandomEnemy();
  combatLoot = [];
  updateEnemyDisplay();
  updateCombatStats();
  updateCombatLoot();
  console.log(`🔍 Found enemy: ${currentEnemy.name}`);
}

function attackEnemy() {
  if (!currentEnemy) return;

  // Resolve combat
  const result = game.resolveCombat(currentEnemy);

  if (result === 'player_win') {
    // Get loot from enemy
    combatLoot = currentEnemy.lootTable || [];
    console.log(`🎉 Victory! Gained ${combatLoot.length} loot items.`);
  } else if (result === 'enemy_win') {
    combatLoot = [];
    console.log(`💀 Defeated by ${currentEnemy.name}.`);
  } else {
    combatLoot = [];
    console.log(`🏃 Successfully fled from ${currentEnemy.name}.`);
  }

  // Clear current enemy after combat
  currentEnemy = null;
  updateEnemyDisplay();
  updateCombatStats();
  updateCombatLoot();
}

function fleeFromEnemy() {
  if (!currentEnemy) return;

  // Simple flee mechanic - 70% success rate
  const fleeSuccess = Math.random() < 0.7;

  if (fleeSuccess) {
    console.log(`🏃 Successfully fled from ${currentEnemy.name}.`);
    currentEnemy = null;
  } else {
    console.log(`❌ Failed to flee! ${currentEnemy.name} attacks!`);
    attackEnemy();
    return;
  }

  combatLoot = [];
  updateEnemyDisplay();
  updateCombatStats();
  updateCombatLoot();
}

// Inventory functions
function updateInventoryDisplay() {
  if (!game || !inventorySystem) return;

  const summary = inventorySystem.getInventorySummary();

  // Update stats
  totalItemsEl.textContent = summary.totalItems.toString();
  uniqueItemsEl.textContent = summary.uniqueItems.toString();
  totalValueEl.textContent = summary.totalValue.toString();
  inventoryCapacityEl.textContent = `${summary.weight}/${summary.capacity}`;

  // Update equipment slots
  updateEquipmentDisplay();

  // Apply filters and sorting
  const searchTerm = inventorySearchEl.value;
  const categoryFilter = categoryFilterEl.value as ItemCategory | '';
  const qualityFilter = qualityFilterEl.value as ItemQuality | '';
  const sortBy = sortSelectEl.value as InventorySort['by'];

  const filter: InventoryFilter = {
    searchText: searchTerm || undefined,
    category: categoryFilter || undefined,
    quality: qualityFilter ? (ItemQuality as any)[qualityFilter] : undefined
  };

  const sort: InventorySort = {
    by: sortBy,
    direction: 'asc'
  };

  const filteredItems = inventorySystem.getItems(filter, sort);

  // Update item grid
  updateItemGrid(filteredItems);
}

function updateEquipmentDisplay() {
  if (!game) return;

  const player = game.getState().player;
  const inventory = player.inventory;
  if (!inventory) return;

  const equipment = inventory.equippedItems;

  // Update weapon slot
  if (equipment.weapon) {
    weaponSlotEl.innerHTML = `
      <div class="equipment-item" data-item-id="${equipment.weapon.id}">
        <div class="item-name">${equipment.weapon.name}</div>
        <div class="item-quality quality-${equipment.weapon.quality}">${ItemQuality[equipment.weapon.quality]}</div>
      </div>
    `;
  } else {
    weaponSlotEl.innerHTML = '<div class="equipment-empty">Empty</div>';
  }

  // Update armor slot
  if (equipment.armor) {
    armorSlotEl.innerHTML = `
      <div class="equipment-item" data-item-id="${equipment.armor.id}">
        <div class="item-name">${equipment.armor.name}</div>
        <div class="item-quality quality-${equipment.armor.quality}">${ItemQuality[equipment.armor.quality]}</div>
      </div>
    `;
  } else {
    armorSlotEl.innerHTML = '<div class="equipment-empty">Empty</div>';
  }

  // Update accessory slots
  if (equipment.accessory1) {
    accessory1SlotEl.innerHTML = `
      <div class="equipment-item" data-item-id="${equipment.accessory1.id}">
        <div class="item-name">${equipment.accessory1.name}</div>
        <div class="item-quality quality-${equipment.accessory1.quality}">${ItemQuality[equipment.accessory1.quality]}</div>
      </div>
    `;
  } else {
    accessory1SlotEl.innerHTML = '<div class="equipment-empty">Empty</div>';
  }

  if (equipment.accessory2) {
    accessory2SlotEl.innerHTML = `
      <div class="equipment-item" data-item-id="${equipment.accessory2.id}">
        <div class="item-name">${equipment.accessory2.name}</div>
        <div class="item-quality quality-${equipment.accessory2.quality}">${ItemQuality[equipment.accessory2.quality]}</div>
      </div>
    `;
  } else {
    accessory2SlotEl.innerHTML = '<div class="equipment-empty">Empty</div>';
  }
}

function updateItemGrid(items: Item[]) {
  if (items.length === 0) {
    itemGridEl.innerHTML = '<div class="no-items">No items match your filters</div>';
    itemDetailsEl.innerHTML = 'Select an item to view details';
    itemActionsEl.innerHTML = '';
    return;
  }

  const itemHtml = items.map(item => `
    <div class="item-card" data-item-id="${item.id}">
      <div class="item-name">${item.name}</div>
      <div class="item-category">${item.category}</div>
      <div class="item-quality quality-${item.quality}">${ItemQuality[item.quality]}</div>
      <div class="item-quantity">${item.stackable ? `x${item.quantity}` : ''}</div>
      <div class="item-value">${item.value}💰</div>
    </div>
  `).join('');

  itemGridEl.innerHTML = itemHtml;

  // Add click handlers for item cards
  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = (card as HTMLElement).dataset.itemId!;
      selectItem(itemId);
    });
  });
}

function selectItem(itemId: string) {
  if (!inventorySystem || !itemInteractionSystem) return;

  // Find item in inventory
  const allItems = inventorySystem.getItems();
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  // Clear previous selection
  document.querySelectorAll('.item-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-item-id="${itemId}"]`)?.classList.add('selected');

  // Update item details
  const effectsHtml = item.effects?.map((effect: any) => {
    const effectType = effect.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return `${effectType}: ${effect.value}${effect.element ? ` (${effect.element})` : ''}`;
  }).join('<br>') || 'No special effects';

  itemDetailsEl.innerHTML = `
    <div class="item-detail-header">
      <h3>${item.name}</h3>
      <div class="item-detail-quality quality-${item.quality}">${ItemQuality[item.quality]}</div>
    </div>
    <div class="item-detail-category">${item.category}</div>
    <div class="item-detail-description">${item.description}</div>
    <div class="item-detail-effects">${effectsHtml}</div>
    <div class="item-detail-value">Value: ${item.value}💰</div>
    ${item.stackable ? `<div class="item-detail-quantity">Quantity: ${item.quantity}</div>` : ''}
  `;

  // Update item actions - simplified for now
  let actionsHtml = '';

  if (item.category === ItemCategory.Pill || item.category === ItemCategory.Drug || item.category === ItemCategory.Herb) {
    actionsHtml += '<button class="action-btn" data-action="use">Use</button>';
  }

  if (item.category === ItemCategory.Weapon || item.category === ItemCategory.Armor || item.category === ItemCategory.Charm) {
    actionsHtml += '<button class="action-btn" data-action="equip">Equip</button>';
  }

  if (item.category === ItemCategory.Manual) {
    actionsHtml += '<button class="action-btn" data-action="study">Study</button>';
  }

  if (item.category === ItemCategory.SpiritStone) {
    actionsHtml += '<button class="action-btn" data-action="absorb">Absorb</button>';
    actionsHtml += '<button class="action-btn" data-action="enhance">Enhance Qi Gathering</button>';
  }

  if (item.stackable && item.quantity > 1) {
    actionsHtml += '<button class="action-btn" data-action="drop">Drop</button>';
  }

  itemActionsEl.innerHTML = actionsHtml || 'No actions available';

  // Add action handlers
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const actionType = (btn as HTMLElement).dataset.action!;
      performItemAction(item, actionType);
    });
  });
}

function performItemAction(item: Item, actionType: string) {
  if (!itemInteractionSystem) return;

  let result: { success: boolean; message: string };

  switch (actionType) {
    case 'use':
    case 'equip':
    case 'study':
    case 'absorb':
    case 'enhance':
      result = itemInteractionSystem.useItem(item.id, actionType);
      break;
    case 'drop':
      result = { success: inventorySystem.removeItem(item.id, 1), message: 'Item dropped' };
      break;
    default:
      result = { success: false, message: 'Unknown action' };
  }

  if (result.success) {
    logMessage(`✅ ${result.message}`);
    updateInventoryDisplay();
    updateUI();
  } else {
    logMessage(`❌ ${result.message}`);
  }
}

function selectArtifact(index: number) {
  if (!game) return;

  const player = game.getState().player;
  const artifact = player.artifacts[index];

  if (!artifact) return;

  // Update selection visual
  document.querySelectorAll('.artifact-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`[data-artifact-index="${index}"]`)?.classList.add('selected');

  // Update details
  const effectsHtml = artifact.effects.map(effect => {
    const effectType = effect.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const elementInfo = effect.element ? ` (${effect.element})` : '';
    return `<div class="artifact-effect"><span class="artifact-effect-type">${effectType}${elementInfo}:</span> <span class="artifact-effect-value">${effect.value}</span></div>`;
  }).join('');

  artifactDetailsEl.innerHTML = `
    <div class="artifact-detail-title">${artifact.name}</div>
    <div class="artifact-detail-type">${artifact.type}</div>
    <div class="artifact-effects-list">${effectsHtml}</div>
  `;
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

// Game systems (initialized after game creation)
let inventorySystem: InventorySystem;
let itemInteractionSystem: ItemInteractionSystem;
let lootSystem: LootSystem;

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
    game = new Game(undefined, updateUI, inventorySystem);
    const loaded = game.loadGame();
    if (loaded) {
      // Initialize game systems with loaded game state
      const player = game.getState().player;
      inventorySystem = new InventorySystem(player);
      lootSystem = new LootSystem(new Random());
      itemInteractionSystem = new ItemInteractionSystem(inventorySystem);

      // Start the game loop for the loaded game
      game.start();
      isRunning = true;
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
  // Create a temporary game to get the player reference
  const tempGame = new Game(undefined, updateUI);
  const player = tempGame.getState().player;
  inventorySystem = new InventorySystem(player);
  lootSystem = new LootSystem(new Random());

  // Recreate game with inventory system
  game = new Game(undefined, updateUI, inventorySystem);
  itemInteractionSystem = new ItemInteractionSystem(inventorySystem);

  game.start();
  isRunning = true;
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

  // Update inventory display if inventory page is active
  if (inventoryPage.classList.contains('active')) {
    updateInventoryDisplay();
  }
}

// Helper function to update panel titles while preserving collapse buttons
function updatePanelTitle(titleId: string, newText: string) {
  const titleEl = document.getElementById(titleId);
  if (titleEl) {
    const titleTextEl = titleEl.querySelector('.title-text');
    if (titleTextEl) {
      titleTextEl.textContent = newText;
    } else {
      // Fallback if no title-text element
      titleEl.textContent = newText;
    }
  }
}

// Update all UI text elements (titles, buttons, etc.)
function updateUIText() {
  gameTitleEl.textContent = i18n.t('ui.gameTitle');
  
  // Update panel titles while preserving collapse buttons
  updatePanelTitle('player-status-title', i18n.t('ui.playerStatus'));
  updatePanelTitle('cultivation-title', i18n.t('ui.cultivationInfo'));
  updatePanelTitle('meridians-title', i18n.t('ui.meridianInfo'));
  updatePanelTitle('elements-title', i18n.t('status.elements'));
  updatePanelTitle('time-title', i18n.t('ui.timeInfo'));
  updatePanelTitle('debug-title', i18n.t('ui.debugTitle'));

  // Update button texts
  cultivateBtn.textContent = i18n.t('ui.cultivate');
  breakthroughBtn.textContent = i18n.t('ui.breakthrough');
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
  
  // Add subtle flash effect for new messages
  gameOutputEl.style.border = '2px solid rgba(74, 158, 255, 0.8)';
  setTimeout(() => {
    gameOutputEl.style.border = '2px solid rgba(255, 255, 255, 0.3)';
  }, 200);
}

// Override console.log to capture game messages
const originalLog = console.log;
console.log = (...args) => {
  const message = args.join(' ');
  logMessage(message);
  originalLog(...args);
};

// Event listeners
// Note: startBtn and pauseBtn removed - game runs automatically

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
    // Create a temporary game to get the player reference for inventory system
    const tempGame = new Game(undefined, updateUI);
    const player = tempGame.getState().player;
    inventorySystem = new InventorySystem(player);
    lootSystem = new LootSystem(new Random());

    // Recreate game with inventory system
    game = new Game(undefined, updateUI, inventorySystem);
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

// Navigation event listeners
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const pageName = (tab as HTMLElement).dataset.page;
    if (pageName) {
      switchPage(pageName);
    }
  });
});

// Combat event listeners
findEnemyBtn.addEventListener('click', () => {
  if (!game) return;
  findEnemy();
});

attackBtn.addEventListener('click', () => {
  if (!game) return;
  attackEnemy();
});

fleeBtn.addEventListener('click', () => {
  if (!game) return;
  fleeFromEnemy();
});

// Inventory event listeners
inventorySearchEl.addEventListener('input', () => {
  updateInventoryDisplay();
});

categoryFilterEl.addEventListener('change', () => {
  updateInventoryDisplay();
});

qualityFilterEl.addEventListener('change', () => {
  updateInventoryDisplay();
});

sortSelectEl.addEventListener('change', () => {
  updateInventoryDisplay();
});

// Equipment slot click handlers
weaponSlotEl.addEventListener('click', () => {
  if (!itemInteractionSystem) return;
  const result = itemInteractionSystem.unequipItem(EquipmentSlot.Weapon);
  if (result.success) {
    logMessage(`✅ ${result.message}`);
    updateInventoryDisplay();
    updateUI();
  } else {
    logMessage(`❌ ${result.message}`);
  }
});

armorSlotEl.addEventListener('click', () => {
  if (!itemInteractionSystem) return;
  const result = itemInteractionSystem.unequipItem(EquipmentSlot.Armor);
  if (result.success) {
    logMessage(`✅ ${result.message}`);
    updateInventoryDisplay();
    updateUI();
  } else {
    logMessage(`❌ ${result.message}`);
  }
});

accessory1SlotEl.addEventListener('click', () => {
  if (!itemInteractionSystem) return;
  const result = itemInteractionSystem.unequipItem(EquipmentSlot.Accessory1);
  if (result.success) {
    logMessage(`✅ ${result.message}`);
    updateInventoryDisplay();
    updateUI();
  } else {
    logMessage(`❌ ${result.message}`);
  }
});

accessory2SlotEl.addEventListener('click', () => {
  if (!itemInteractionSystem) return;
  const result = itemInteractionSystem.unequipItem(EquipmentSlot.Accessory2);
  if (result.success) {
    logMessage(`✅ ${result.message}`);
    updateInventoryDisplay();
    updateUI();
  } else {
    logMessage(`❌ ${result.message}`);
  }
});

// Initial UI setup
initializeCardCollapse(); // Initialize collapsible cards
switchPage('overview'); // Start with overview page
updateUIText();
updateUI();

// Add initial log message to make log visible
logMessage('🏮 Welcome to CULSIM - Cultivation Simulator');
logMessage('📜 Game log initialized');

// Initialize game on page load
initializeGame();