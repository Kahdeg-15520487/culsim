/**
 * CULSIM - Main Game Class
 * Orchestrates all game subsystems and provides the main game interface.
 * This class has been refactored from a monolithic design into focused subsystems.
 */

import { GameState, Player, Soul, Enemy, CultivationRealm, Element, ElementAffinities, CombatType, Meridian } from '../types';
import { Random } from '../utils/Random';
import { i18n } from '../utils/i18n';
import { GameController } from './systems/GameController';
import { CultivationSystem } from './systems/CultivationSystem';
import { MeridianSystem } from './systems/MeridianSystem';
import { ElementSystem } from './systems/ElementSystem';
import { BreakthroughSystem } from './systems/BreakthroughSystem';
import { CombatSystem } from './systems/CombatSystem';
import { EventSystem } from './systems/EventSystem';
import { SaveLoadSystem } from './systems/SaveLoadSystem';
import { InventorySystem } from '../utils/InventorySystem';

export class Game {
  private gameController: GameController;
  private cultivationSystem: CultivationSystem;
  private meridianSystem: MeridianSystem;
  private elementSystem: ElementSystem;
  private breakthroughSystem: BreakthroughSystem;
  private combatSystem: CombatSystem;
  private eventSystem: EventSystem;
  private saveLoadSystem: SaveLoadSystem;

  constructor(seed?: number, uiUpdateCallback?: () => void, inventorySystem?: InventorySystem) {
    // Initialize core game controller with update callback
    this.gameController = new GameController(seed, () => this.update(), uiUpdateCallback, () => this.saveGame());
    const gameState = this.gameController.getStateReference();
    const random = this.gameController.getRandom();

    // Initialize all subsystems
    this.cultivationSystem = new CultivationSystem(gameState);
    this.meridianSystem = new MeridianSystem(gameState, random);
    this.elementSystem = new ElementSystem(gameState);
    this.breakthroughSystem = new BreakthroughSystem(gameState, random);
    this.combatSystem = new CombatSystem(gameState, random, inventorySystem!);
    this.eventSystem = new EventSystem(gameState, random);
    this.saveLoadSystem = new SaveLoadSystem();
  }

  /**
   * Start the game loop
   */
  public start(): void {
    this.gameController.start();
  }

  /**
   * Stop the game
   */
  public stop(): void {
    this.gameController.stop();
  }

  /**
   * Main game update loop - delegates to subsystems
   */
  private update(): void {
    const gameState = this.gameController.getStateReference();

    // Validate and fix any malformed artifacts
    this.validateAndFixArtifacts(gameState.player.artifacts);
    this.validateAndFixArtifacts(gameState.soul.artifacts);

    // Process cultivation
    this.cultivationSystem.processCultivation();

    // Process random events
    if (this.gameController.getRandom().chance(0.02)) {
      this.eventSystem.processRandomEvent();
    }

    // Update game controller (time progression, auto-save, etc.)
    // Note: The game controller's update method is now private and called internally
  }  /**
   * Manual cultivation - delegates to cultivation system
   */
  public cultivate(): void {
    const qiGained = this.cultivationSystem.cultivate();
    console.log(i18n.t('ui.manualCultivationComplete', { qi: qiGained.toFixed(2) }));
  }

  /**
   * Attempt breakthrough - delegates to breakthrough system
   */
  public attemptBreakthrough(): void {
    this.breakthroughSystem.attemptBreakthrough();
  }

  /**
   * Meridian opening - delegates to meridian system
   */
  public attemptMeridianOpening(specificIndex?: number): void {
    this.meridianSystem.attemptMeridianOpening(specificIndex);
  }

  /**
   * Meridian breakthrough - delegates to meridian system
   */
  public attemptMeridianBreakthrough(meridianIndex: number): void {
    this.meridianSystem.attemptMeridianBreakthrough(meridianIndex);
  }

  /**
   * Get primary element - delegates to element system
   */
  public getPrimaryElement(): Element | null {
    return this.elementSystem.getPrimaryElement();
  }

  /**
   * Get complementary elements - delegates to element system
   */
  public getComplementaryElements(primaryElement: Element, realm: CultivationRealm): Element[] {
    return this.elementSystem.getComplementaryElements(primaryElement, realm);
  }

  /**
   * Get meridian effective cap - delegates to meridian system
   */
  public getMeridianEffectiveCap(meridian: Meridian): number {
    return this.meridianSystem.getMeridianEffectiveCap(meridian);
  }

  /**
   * Get realm name - delegates to game controller
   */
  public getRealmName(realm: CultivationRealm): string {
    return this.gameController.getRealmName(realm);
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return this.gameController.getState();
  }

  /**
   * Save game - delegates to save/load system
   */
  public saveGame(): void {
    const gameState = this.gameController.getState();
    this.saveLoadSystem.saveGame(gameState);
  }

  /**
   * Load game - delegates to save/load system
   */
  public loadGame(): boolean {
    const loadedState = this.saveLoadSystem.loadGame();
    if (loadedState) {
      console.log('🔄 Loading game state:', {
        meridians: loadedState.player.meridians.map((m, i) => ({ index: i, name: m.name, isOpen: m.isOpen, purity: m.purity }))
      });
      // Update GameController state
      this.gameController.setState(loadedState);
      // Reinitialize subsystems with loaded state
      this.reinitializeSubsystems(loadedState);
      return true;
    }
    return false;
  }

  /**
   * Reinitialize all subsystems with a new game state
   */
  private reinitializeSubsystems(gameState: GameState): void {
    const random = this.gameController.getRandom();
    this.cultivationSystem = new CultivationSystem(gameState);
    this.meridianSystem = new MeridianSystem(gameState, random);
    this.elementSystem = new ElementSystem(gameState);
    this.breakthroughSystem = new BreakthroughSystem(gameState, random);
    this.combatSystem = new CombatSystem(gameState, random);
    this.eventSystem = new EventSystem(gameState, random);
  }

  /**
   * Generate random enemy - delegates to combat system
   */
  public generateRandomEnemy(): Enemy {
    return this.combatSystem.generateRandomEnemy();
  }

  /**
   * Resolve combat with enemy - delegates to combat system
   */
  public resolveCombat(enemy: Enemy): 'player_win' | 'enemy_win' | 'flee' {
    return this.combatSystem.resolveCombat(enemy);
  }

  /**
   * Calculate qi gathering speed - delegates to cultivation system
   */
  public calculateQiGatheringSpeed(): number {
    return this.cultivationSystem.calculateQiGatheringSpeed();
  }

  /**
   * Debug methods - delegate to appropriate systems
   */
  public debugAddQi(): void {
    const gameState = this.gameController.getState();
    const amount = gameState.player.maxQi * 0.1;
    gameState.player.qi = Math.min(gameState.player.qi + amount, gameState.player.maxQi);
    console.log(`🐛 Debug: Added ${amount} qi to player. Current qi: ${gameState.player.qi.toFixed(1)}/${gameState.player.maxQi}`);
  }

  public debugAddMeridianProgress(amount: number = 10): void {
    this.meridianSystem.debugAddMeridianProgress(amount);
  }

  public debugAddElementProgress(amount: number = 10): void {
    this.elementSystem.debugAddElementProgress(amount);
  }

  /**
   * Validate and fix any malformed artifacts in the given array
   */
  private validateAndFixArtifacts(artifacts: any[]): void {
    for (let i = artifacts.length - 1; i >= 0; i--) {
      const artifact = artifacts[i];

      // Check if artifact has required properties
      if (!artifact.id || !artifact.name || !artifact.type) {
        console.warn('Removing malformed artifact:', artifact);
        artifacts.splice(i, 1);
        continue;
      }

      // Ensure effects array exists
      if (!artifact.effects || !Array.isArray(artifact.effects)) {
        console.warn('Fixing artifact with missing effects:', artifact.name);
        artifact.effects = [{
          type: 'qi_absorption',
          value: artifact.value || 10
        }];
      }
    }
  }

  /**
   * Get random instance for external use
   */
  public getRandom(): Random {
    return this.gameController.getRandom();
  }
}