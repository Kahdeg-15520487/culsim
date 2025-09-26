/**
 * GameController - Core game management system
 *
 * Handles the main game loop, state initialization, and orchestration of subsystems.
 */

import { GameState, Player, Soul, CultivationRealm, Element, ElementAffinities, Meridian } from '../../types';
import { Random } from '../../utils/Random';
import { i18n } from '../../utils/i18n';
import { INITIAL_GAME_VALUES, AUTO_SAVE } from '../constants';
import { ItemSystem } from '../../utils/ItemSystem';
import { ItemCategory, ItemQuality } from '../../types';
import { HealthSystem } from './HealthSystem';
import { TravelSystem } from './TravelSystem';

export class GameController {
  private state: GameState;
  private gameLoop: NodeJS.Timeout | null = null;
  private random: Random;
  private lastAutoSaveTime: number = 0;
  private readonly AUTO_SAVE_INTERVAL_DAYS = AUTO_SAVE.INTERVAL_DAYS;
  private updateCallback?: () => void;
  private uiUpdateCallback?: () => void;
  private autoSaveCallback?: () => void;

  constructor(seed?: number, updateCallback?: () => void, uiUpdateCallback?: () => void, autoSaveCallback?: () => void) {
    this.random = new Random(seed);
    this.state = this.initializeGameState();
    this.updateCallback = updateCallback;
    this.uiUpdateCallback = uiUpdateCallback;
    this.autoSaveCallback = autoSaveCallback;
  }

  /**
   * Initialize the game state with default values
   */
  private initializeGameState(): GameState {
    const player: Player = {
      id: 'player-1',
      name: 'Cultivator',
      realm: CultivationRealm.Mortal,
      qi: 0,
      maxQi: INITIAL_GAME_VALUES.MAX_QI,
      health: 100, // Start with base health
      maxHealth: 100, // Will be recalculated by HealthSystem
      meridians: this.createInitialMeridians(),
      elements: this.initializeElementAffinities(),
      talent: INITIAL_GAME_VALUES.TALENT,
      items: [], // Start with no items
      lifetime: 0,
      currentLocationId: 'starting-village', // Start in the village
      energy: 100, // Start with full travel energy
      karma: 0 // Start with neutral karma
    };

    const soul: Soul = {
      id: 'soul-1',
      lifetimeCount: 1,
      totalLifetime: 0,
      cultivationInsights: {
        realmBreakthroughs: [],
        techniqueMastery: [],
        elementalUnderstanding: {
          [Element.Metal]: 0,
          [Element.Wood]: 0,
          [Element.Water]: 0,
          [Element.Fire]: 0,
          [Element.Earth]: 0
        },
        tribulationSurvivals: 0
      },
      karmicBalance: 0,
      maxRealmAchieved: CultivationRealm.Mortal,
      items: [] // Start with no items
    };

    const gameState: GameState = {
      player,
      soul,
      time: 0,
      isRunning: false,
      seed: this.random.getSeed(),
      worldMap: [] // Will be initialized after GameState is created
    };

    // Initialize player health using HealthSystem
    const healthSystem = new HealthSystem(gameState);
    healthSystem.initializePlayerHealth(player);

    // Initialize world map using TravelSystem
    const travelSystem = new TravelSystem(gameState, this.random, null as any, null as any);
    gameState.worldMap = travelSystem.generateWorldMap();

    return gameState;
  }

  /**
   * Create initial meridian system (12 major meridians)
   */
  private createInitialMeridians(): Meridian[] {
    const meridianNames = [
      'Governor Vessel', 'Conception Vessel', 'Stomach', 'Spleen',
      'Heart', 'Small Intestine', 'Bladder', 'Kidney',
      'Pericardium', 'Triple Burner', 'Gallbladder', 'Liver'
    ];

    return meridianNames.map((name, index) => ({
      id: `meridian-${index}`,
      name,
      isOpen: false,
      purity: 0,
      breakthroughStage: 0
    }));
  }

  /**
   * Initialize element affinities - assign primary element at birth
   */
  private initializeElementAffinities(): ElementAffinities {
    const elements = [Element.Metal, Element.Wood, Element.Water, Element.Fire, Element.Earth];
    const primaryElement = this.random.choice(elements);

    const affinities: ElementAffinities = {
      [Element.Metal]: 0,
      [Element.Wood]: 0,
      [Element.Water]: 0,
      [Element.Fire]: 0,
      [Element.Earth]: 0
    };

    affinities[primaryElement] = this.random.int(INITIAL_GAME_VALUES.ELEMENT_AFFINITY_BASE.min, INITIAL_GAME_VALUES.ELEMENT_AFFINITY_BASE.max);

    return affinities;
  }

  /**
   * Start the game loop
   */
  public start(): void {
    console.log(i18n.t('messages.startingJourney'));
    this.state.isRunning = true;
    this.displayStatus();

    this.gameLoop = setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Stop the game
   */
  public stop(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.state.isRunning = false;
    console.log('\n' + i18n.t('messages.cultivationSessionEnded'));
  }

  /**
   * Main game update loop - to be implemented with subsystems
   */
  private update(): void {
    if (!this.state.isRunning) return;

    // Advance time
    this.state.time += 1;
    this.state.player.lifetime += 1;

    // Auto-save every 10 days
    if (this.state.time - this.lastAutoSaveTime >= this.AUTO_SAVE_INTERVAL_DAYS) {
      this.autoSave();
    }

    // Call the update callback if provided (for subsystem updates)
    if (this.updateCallback) {
      this.updateCallback();
    }

    // Call the UI update callback if provided
    if (this.uiUpdateCallback) {
      this.uiUpdateCallback();
    }
  }

  /**
   * Display current game status
   */
  private displayStatus(): void {
    const player = this.state.player;
    const soul = this.state.soul;
    console.log(i18n.t('messages.statusUpdate', { day: Math.floor(this.state.time) }));
    console.log(`${i18n.t('status.player')}: ${player.name}`);
    console.log(`${i18n.t('status.realm')}: ${this.getRealmName(player.realm)}`);
    console.log(`${i18n.t('status.qi')}: ${player.qi.toFixed(1)} / ${player.maxQi}`);
    console.log(`${i18n.t('status.talent')}: ${player.talent}/100`);

    // Show element cultivation status
    const primaryElement = this.getPrimaryElement();
    if (primaryElement) {
      console.log(`${i18n.t('status.primaryElement')}: ${primaryElement} (${player.elements[primaryElement].toFixed(1)})`);
      const complementaryElements = this.getComplementaryElements(primaryElement, player.realm);
      if (complementaryElements.length > 0) {
        console.log(`${i18n.t('status.complementaryElements')}: ${complementaryElements.map(e => `${e} (${player.elements[e]?.toFixed(1) || '0.0'})`).join(', ')}`);
      }
    }

    console.log(`${i18n.t('status.lifetime')}: ${player.lifetime} ${i18n.t('messages.day')} (${i18n.t('status.reincarnation')}: ${soul.lifetimeCount})`);
    console.log(`${i18n.t('status.karma')}: ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}`);
    console.log('─────────────────────────────\n');
  }

  /**
   * Get human-readable realm name
   */
  public getRealmName(realm: CultivationRealm): string {
    return i18n.getRealmName(realm);
  }

  /**
   * Get the player's primary element
   */
  public getPrimaryElement(): Element | null {
    const elements = this.state.player.elements;
    let maxAffinity = 0;
    let primaryElement: Element | null = null;

    Object.entries(elements).forEach(([element, affinity]) => {
      if (affinity > maxAffinity) {
        maxAffinity = affinity;
        primaryElement = element as Element;
      }
    });

    return primaryElement;
  }

  /**
   * Get complementary elements based on primary element and realm
   */
  public getComplementaryElements(primaryElement: Element, realm: CultivationRealm): Element[] {
    const complementary: Element[] = [];

    const generatingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Fire,
      [Element.Fire]: Element.Earth,
      [Element.Earth]: Element.Metal,
      [Element.Metal]: Element.Water,
      [Element.Water]: Element.Wood
    };

    const controllingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Earth,
      [Element.Earth]: Element.Water,
      [Element.Water]: Element.Fire,
      [Element.Fire]: Element.Metal,
      [Element.Metal]: Element.Wood
    };

    if (realm >= CultivationRealm.QiCondensation) {
      complementary.push(generatingCycle[primaryElement]);
    }

    if (realm >= CultivationRealm.CoreFormation) {
      complementary.push(controllingCycle[primaryElement]);
    }

    if (realm >= CultivationRealm.DivineTransformation) {
      const controller = controllingCycle[primaryElement];
      const counterController = Object.entries(controllingCycle).find(([_, controlled]) => controlled === controller)?.[0] as Element;
      if (counterController) {
        complementary.push(counterController);
      }
    }

    return complementary;
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get the actual state reference for internal modifications
   */
  public getStateReference(): GameState {
    return this.state;
  }

  /**
   * Set the game state (used for loading saved games)
   */
  public setState(newState: GameState): void {
    this.state = newState;
  }

  /**
   * Get random instance for external use
   */
  public getRandom(): Random {
    return this.random;
  }

  /**
   * Auto-save game state
   */
  private autoSave(): void {
    if (this.autoSaveCallback) {
      this.autoSaveCallback();
    }
    this.lastAutoSaveTime = this.state.time;
  }

  /**
   * Save game state to local storage
   */
  public saveGame(): void {
    try {
      const serializedState = this.serializeGameState();
      localStorage.setItem('culsim-save', serializedState);
      console.log(i18n.t('messages.gameSaved'));
    } catch (error) {
      console.error(i18n.t('messages.saveError'), error);
    }
  }

  /**
   * Load game state from local storage
   */
  public loadGame(): boolean {
    try {
      const savedState = localStorage.getItem('culsim-save');
      if (savedState) {
        this.state = this.deserializeGameState(savedState);
        console.log(i18n.t('messages.gameLoaded'));
        return true;
      }
    } catch (error) {
      console.error(i18n.t('messages.loadError'), error);
    }
    return false;
  }

  /**
   * Serialize game state to JSON string
   */
  private serializeGameState(): string {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Deserialize game state from JSON string
   */
  private deserializeGameState(jsonString: string): GameState {
    const parsed = JSON.parse(jsonString);

    const gameState = {
      player: parsed.player || this.initializeGameState().player,
      soul: parsed.soul || this.initializeGameState().soul,
      time: parsed.time ? Math.floor(parsed.time / 86400) : 0,
      isRunning: false,
      seed: parsed.seed || this.random.getSeed(),
      worldMap: parsed.worldMap || this.initializeGameState().worldMap
    };

    return gameState;
  }
}