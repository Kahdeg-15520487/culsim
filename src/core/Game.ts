/**
 * CULSIM - Main Game Class
 * Orchestrates all game subsystems and provides the main game interface.
 * This class has been refactored from a monolithic design into focused subsystems.
 */

import { GameState, Player, Soul, Enemy, CultivationRealm, Element, ElementAffinities, CombatType, Meridian, Item } from '../types';
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
import { HealthSystem } from './systems/HealthSystem';
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
  private healthSystem: HealthSystem;
  private inventorySystem?: InventorySystem;

  constructor(seed?: number, uiUpdateCallback?: () => void, inventorySystem?: InventorySystem) {
    // Store inventory system reference
    this.inventorySystem = inventorySystem;
    
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
    this.healthSystem = new HealthSystem(gameState);
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

    // Process cultivation
    this.cultivationSystem.processCultivation();

    // Process health regeneration
    this.healthSystem.regenerateHealth(gameState.player);

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
    this.combatSystem = new CombatSystem(gameState, random, this.inventorySystem!);
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
  public resolveCombat(enemy: Enemy): { result: 'player_win' | 'enemy_win' | 'flee', droppedLoot: Item[] } {
    return this.combatSystem.resolveCombat(enemy);
  }

  /**
   * Player performs one attack in turn-based combat
   */
  public playerAttack(enemy: Enemy): { damage: number; enemyDefeated: boolean; enemyHealth: number; enemyMaxHealth: number } {
    return this.combatSystem.playerAttack(enemy);
  }

  /**
   * Enemy performs one attack in turn-based combat
   */
  public enemyAttack(enemy: Enemy): { damage: number; playerDefeated: boolean; playerHealth: number; playerMaxHealth: number } {
    const player = this.getState().player;
    return this.combatSystem.enemyAttack(player, enemy);
  }

  /**
   * Attempt to flee from combat
   */
  public attemptFlee(): boolean {
    return this.combatSystem.attemptFlee();
  }

  /**
   * Handle player victory in combat
   */
  public handlePlayerVictory(enemy: Enemy): Item[] {
    return this.combatSystem.handlePlayerVictory(enemy);
  }

  /**
   * Handle player defeat in combat
   */
  public handlePlayerDefeat(enemy: Enemy): Item[] {
    return this.combatSystem.handlePlayerDefeat(enemy);
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
   * Update the inventory system reference (used after loading saved games)
   */
  public updateInventorySystem(inventorySystem: InventorySystem): void {
    this.inventorySystem = inventorySystem;
    // Recreate combat system with new inventory system
    const gameState = this.gameController.getStateReference();
    const random = this.gameController.getRandom();
    this.combatSystem = new CombatSystem(gameState, random, inventorySystem);
  }

}