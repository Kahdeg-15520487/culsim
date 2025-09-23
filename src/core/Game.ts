/**
 * CULSIM - Core Game Class
 *
 * Main game controller that manages the game loop, state, and core systems.
 */

import { GameState, Player, Soul, Enemy, TimeTick, CultivationRealm, Element, CombatType } from '../types';
import { Random } from '../utils/Random';

export class Game {
  private state: GameState;
  private gameLoop: NodeJS.Timeout | null = null;
  private random: Random;

  constructor(seed?: number) {
    this.random = new Random(seed);
    this.state = this.initializeGameState();
  }

  /**
   * Initialize the game state with default values
   */
  private initializeGameState(): GameState {
    const player: Player = {
      id: 'player-1',
      name: 'Cultivator',
      realm: CultivationRealm.Mortal, // Mortal
      qi: 0,
      maxQi: 100,
      meridians: this.createInitialMeridians(),
      elements: {
        [Element.Metal]: 0,
        [Element.Wood]: 0,
        [Element.Water]: 0,
        [Element.Fire]: 0,
        [Element.Earth]: 0
      },
      talent: 50, // Average talent
      artifacts: [],
      lifetime: 0
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
      artifacts: []
    };

    return {
      player,
      soul,
      time: 0,
      isRunning: false,
      seed: this.random.getSeed()
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
    if (this.state.player.realm === CultivationRealm.Mortal && this.state.player.qi < this.state.player.maxQi) {
      const qiGain = 0.1 + (this.state.player.talent / 1000); // Talent affects absorption
      this.state.player.qi = Math.min(this.state.player.qi + qiGain, this.state.player.maxQi);
    }

    // Random events (simplified for now)
    if (this.random.chance(0.05)) { // 5% chance per tick
      this.processRandomEvent();
    }

    // Status updates are now handled by the UI in real-time
  }

  /**
   * Process random life events
   */
  private processRandomEvent(): void {
    const events = [
      { name: 'Fortuitous Encounter', chance: 0.3, effect: () => this.fortuitousEncounter() },
      { name: 'Tribulation Challenge', chance: 0.2, effect: () => this.tribulationChallenge() },
      { name: 'Karmic Reward', chance: 0.3, effect: () => this.karmicReward() },
      { name: 'Enemy Encounter', chance: 0.2, effect: () => this.enemyEncounter() }
    ];

    const event = this.random.weightedChoice(events, events.map(e => e.chance));
    console.log(`🎲 Random Event: ${event.name}`);
    event.effect();
  }

  /**
   * Fortuitous encounter - increases talent
   */
  private fortuitousEncounter(): void {
    const talentGain = this.random.int(1, 5);
    this.state.player.talent = Math.min(100, this.state.player.talent + talentGain);
    console.log(`✨ Met a mysterious master! Talent increased by ${talentGain}.`);
  }

  /**
   * Tribulation challenge - potential reward or penalty
   */
  private tribulationChallenge(): void {
    if (this.random.chance(0.7)) {
      const insightGain = this.random.int(1, 3);
      this.state.soul.cultivationInsights.tribulationSurvivals += insightGain;
      console.log(`⚡ Survived a minor tribulation! Gained ${insightGain} tribulation insights.`);
    } else {
      const qiLoss = this.random.int(5, 15);
      this.state.player.qi = Math.max(0, this.state.player.qi - qiLoss);
      console.log(`💥 Failed tribulation challenge! Lost ${qiLoss} qi.`);
    }
  }

  /**
   * Karmic reward - increases karmic balance
   */
  private karmicReward(): void {
    const karmaGain = this.random.int(1, 10);
    this.state.soul.karmicBalance += karmaGain;
    console.log(`🙏 Performed a good deed! Karmic balance increased by ${karmaGain}.`);
  }

  /**
   * Enemy encounter - combat opportunity
   */
  private enemyEncounter(): void {
    const enemy = this.generateRandomEnemy();
    console.log(`👹 Encountered ${enemy.name} (Realm: ${enemy.realm}, Qi: ${enemy.qi}/${enemy.maxQi})`);

    // Simple combat resolution for now
    const playerPower = this.state.player.qi + this.state.player.talent;
    const enemyPower = enemy.qi + (enemy.realm * 50);

    if (this.random.chance(playerPower / (playerPower + enemyPower))) {
      console.log(`✅ Defeated ${enemy.name}!`);
      // TODO: Process loot
    } else {
      const damage = this.random.int(10, 30);
      this.state.player.qi = Math.max(0, this.state.player.qi - damage);
      console.log(`❌ Defeated by ${enemy.name}! Lost ${damage} qi.`);
    }
  }

  /**
   * Display current game status
   */
  private displayStatus(): void {
    const player = this.state.player;
    const soul = this.state.soul;
    console.log(`📊 Status Update (Day ${this.state.time})`);
    console.log(`👤 Player: ${player.name}`);
    console.log(`🏛️  Realm: ${this.getRealmName(player.realm)}`);
    console.log(`💎 Qi: ${player.qi.toFixed(1)} / ${player.maxQi}`);
    console.log(`🎯 Talent: ${player.talent}/100`);
    console.log(`📅 Lifetime: ${player.lifetime} days (Reincarnation: ${soul.lifetimeCount})`);
    console.log(`☯️  Karma: ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}`);
    console.log('─────────────────────────────\n');
  }

  /**
   * Get human-readable realm name
   */
  private getRealmName(realm: CultivationRealm): string {
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

  /**
   * Save game state to local storage (browser)
   */
  public saveGame(): void {
    try {
      const serializedState = this.serializeGameState();
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('culsim-save', serializedState);
        console.log('💾 Game saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  /**
   * Load game state from local storage (browser)
   */
  public loadGame(): boolean {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const serializedState = localStorage.getItem('culsim-save');
        if (serializedState) {
          this.state = this.deserializeGameState(serializedState);
          this.random.setSeed(this.state.seed);
          console.log('📂 Game loaded successfully!');
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load game:', error);
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

    // Ensure all required properties exist with defaults
    return {
      player: parsed.player || this.initializeGameState().player,
      soul: parsed.soul || this.initializeGameState().soul,
      time: parsed.time || 0,
      isRunning: false, // Always start paused when loading
      seed: parsed.seed || this.random.getSeed()
    };
  }

  /**
   * Create a random enemy for combat encounters
   */
  public generateRandomEnemy(): Enemy {
    const realm = this.random.weightedChoice(
      [CultivationRealm.Mortal, CultivationRealm.QiCondensation, CultivationRealm.FoundationEstablishment],
      [0.5, 0.3, 0.2] // Higher chance for lower realm enemies
    );

    const enemyNames = [
      'Wild Beast', 'Bandit', 'Spirit Beast', 'Demon Cultivator',
      'Heavenly Tribulation Remnant', 'Ancient Guardian', 'Chaos Spirit'
    ];

    const enemy: Enemy = {
      id: `enemy-${Date.now()}-${this.random.int(1000, 9999)}`,
      name: this.random.choice(enemyNames),
      realm,
      qi: this.random.int(50, 200),
      maxQi: this.random.int(100, 300),
      elements: {
        [Element.Metal]: this.random.int(0, 50),
        [Element.Wood]: this.random.int(0, 50),
        [Element.Water]: this.random.int(0, 50),
        [Element.Fire]: this.random.int(0, 50),
        [Element.Earth]: this.random.int(0, 50)
      },
      combatType: this.random.choice([CombatType.Melee, CombatType.Ranged]),
      aggression: this.random.int(30, 90),
      lootTable: this.generateLootTable(realm)
    };

    enemy.qi = Math.min(enemy.qi, enemy.maxQi); // Ensure qi doesn't exceed maxQi
    return enemy;
  }

  /**
   * Generate loot table based on enemy realm
   */
  private generateLootTable(realm: CultivationRealm): any[] {
    const lootTable = [];

    // Higher realm enemies have better loot
    const qualityMultiplier = realm + 1;

    // Chance for spirit stones
    if (this.random.chance(0.6)) {
      lootTable.push({
        type: 'resource',
        item: {
          type: 'spirit_stone',
          quality: this.random.int(1 * qualityMultiplier, 20 * qualityMultiplier)
        },
        dropRate: 0.8
      });
    }

    // Chance for elemental crystals
    if (this.random.chance(0.3)) {
      lootTable.push({
        type: 'resource',
        item: {
          type: 'elemental_crystal',
          element: this.random.choice(Object.values(Element)),
          quality: this.random.int(1 * qualityMultiplier, 15 * qualityMultiplier)
        },
        dropRate: 0.5
      });
    }

    // Rare chance for cultivation insight
    if (this.random.chance(0.1)) {
      lootTable.push({
        type: 'insight',
        item: {
          type: 'realm_knowledge',
          realm: Math.min(realm + 1, CultivationRealm.ImmortalAscension),
          value: this.random.int(1, 10)
        },
        dropRate: 0.2
      });
    }

    return lootTable;
  }

  /**
   * Get random instance for external use
   */
  public getRandom(): Random {
    return this.random;
  }
}