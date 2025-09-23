/**
 * CULSIM - Core Game Class
 *
 * Main game controller that manages the game loop, state, and core systems.
 */

import { GameState, Player, TimeTick } from '../types';

export class Game {
  private state: GameState;
  private gameLoop: NodeJS.Timeout | null = null;

  constructor() {
    this.state = this.initializeGameState();
  }

  /**
   * Initialize the game state with default values
   */
  private initializeGameState(): GameState {
    const player: Player = {
      id: 'player-1',
      name: 'Cultivator',
      realm: 0, // Mortal
      qi: 0,
      maxQi: 100,
      meridians: this.createInitialMeridians(),
      elements: {
        metal: 0,
        wood: 0,
        water: 0,
        fire: 0,
        earth: 0
      },
      talent: 50, // Average talent
      artifacts: [],
      lifetime: 0
    };

    return {
      player,
      time: 0,
      isRunning: false
    };
  }

  /**
   * Create initial meridian system (12 major meridians)
   */
  private createInitialMeridians() {
    const meridianNames = [
      'Governor Vessel', 'Conception Vessel', 'Stomach', 'Spleen',
      'Heart', 'Small Intestine', 'Bladder', 'Kidney',
      'Pericardium', 'Triple Burner', 'Gallbladder', 'Liver'
    ];

    return meridianNames.map((name, index) => ({
      id: `meridian-${index}`,
      name,
      isOpen: false,
      purity: 0
    }));
  }

  /**
   * Start the game loop
   */
  public start(): void {
    console.log('🌅 Starting your cultivation journey...\n');

    this.state.isRunning = true;
    this.displayStatus();

    // Start the game loop (1 tick = 1 second for development)
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
    console.log('\n🏮 Cultivation session ended.');
  }

  /**
   * Main game update loop
   */
  private update(): void {
    if (!this.state.isRunning) return;

    // Advance time
    this.state.time += 1;
    this.state.player.lifetime += 1;

    // Basic qi absorption for mortal realm
    if (this.state.player.realm === 0 && this.state.player.qi < this.state.player.maxQi) {
      this.state.player.qi += 0.1; // Slow absorption
    }

    // Display status every 10 seconds
    if (this.state.time % 10 === 0) {
      this.displayStatus();
    }
  }

  /**
   * Display current game status
   */
  private displayStatus(): void {
    const player = this.state.player;
    console.log(`📊 Status Update (Day ${this.state.time})`);
    console.log(`👤 Player: ${player.name}`);
    console.log(`🏛️  Realm: ${this.getRealmName(player.realm)}`);
    console.log(`💎 Qi: ${player.qi.toFixed(1)} / ${player.maxQi}`);
    console.log(`🎯 Talent: ${player.talent}/100`);
    console.log(`📅 Lifetime: ${player.lifetime} days`);
    console.log('─────────────────────────────\n');
  }

  /**
   * Get human-readable realm name
   */
  private getRealmName(realm: number): string {
    const realmNames = [
      'Mortal (Phàm Nhân)',
      'Qi Condensation (Luyện Khí)',
      'Foundation Establishment (Trúc Cơ)',
      'Core Formation (Kim Đan)',
      'Nascent Soul (Nguyên Anh)',
      'Divine Transformation (Hóa Thần)',
      'Void Refinement (Luyện Không)',
      'Immortal Ascension (Phi Thăng)'
    ];
    return realmNames[realm] || 'Unknown';
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return { ...this.state };
  }
}