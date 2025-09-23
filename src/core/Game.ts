/**
 * CULSIM - Core Game Class
 *
 * Main game controller that manages the game loop, state, and core systems.
 */

import { GameState, Player, Soul, Enemy, TimeTick, CultivationRealm, Element, CombatType } from '../types';
import { Random } from '../utils/Random';
import { i18n } from '../utils/i18n';

export class Game {
  private state: GameState;
  private gameLoop: NodeJS.Timeout | null = null;
  private random: Random;
  private lastAutoSaveTime: number = 0;
  private readonly AUTO_SAVE_INTERVAL_DAYS = 10; // Auto-save every 10 days

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
    console.log(i18n.t('messages.startingJourney'));

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
    console.log('\n' + i18n.t('messages.cultivationSessionEnded'));
  }

  /**
   * Main game update loop
   */
  private update(): void {
    if (!this.state.isRunning) return;

    // Advance time
    this.state.time += 1; // 1 tick = 1 day
    this.state.player.lifetime += 1;

    // Auto-save every 10 days
    if (this.state.time - this.lastAutoSaveTime >= this.AUTO_SAVE_INTERVAL_DAYS) {
      this.autoSave();
    }

    // Cultivation progression
    this.processCultivation();

    // Random events (simplified for now)
    if (this.random.chance(0.02)) { // 2% chance per tick (less frequent)
      this.processRandomEvent();
    }

    // Status updates are now handled by the UI in real-time
  }

  /**
   * Process cultivation mechanics based on current realm
   */
  private processCultivation(): void {
    const player = this.state.player;

    // Process meridian purification
    this.processMeridianPurification();

    switch (player.realm) {
      case CultivationRealm.Mortal:
        this.cultivateMortalRealm();
        break;
      case CultivationRealm.QiCondensation:
        this.cultivateQiCondensationRealm();
        break;
      case CultivationRealm.FoundationEstablishment:
        this.cultivateFoundationEstablishmentRealm();
        break;
      // Add other realms as implemented
      default:
        // Basic qi absorption for unimplemented realms
        this.basicQiAbsorption();
        break;
    }
  }

  /**
   * Mortal realm cultivation - sensing and absorbing ambient qi
   */
  private cultivateMortalRealm(): void {
    const player = this.state.player;

    // Basic qi absorption even without meridians (very slow spiritual awareness)
    const basicAbsorption = 0.1; // Noticeable base absorption for mortals
    const talentMultiplier = 1 + (player.talent / 500); // Reduced talent impact for basic absorption
    let qiGain = basicAbsorption * talentMultiplier;

    // Enhanced absorption with open meridians
    const openMeridians = player.meridians.filter(m => m.isOpen).length;
    if (openMeridians > 0) {
      const baseAbsorption = 0.05; // Base qi per day with meridians
      const meridianBonus = this.calculateMeridianBonus();
      const enhancedGain = baseAbsorption * talentMultiplier * meridianBonus;
      qiGain += enhancedGain;
    }

    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Check for realm breakthrough
    this.checkMortalBreakthrough();
  }

  /**
   * Qi Condensation realm - condensing qi into dantian
   */
  private cultivateQiCondensationRealm(): void {
    const player = this.state.player;

    // Higher absorption rate in Qi Condensation
    const baseAbsorption = 0.2; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 150);
    const meridianBonus = this.calculateMeridianBonus();
    const qiGain = baseAbsorption * talentMultiplier * meridianBonus;

    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Check for realm breakthrough
    this.checkQiCondensationBreakthrough();
  }

  /**
   * Foundation Establishment realm - forming qi vortex
   */
  private cultivateFoundationEstablishmentRealm(): void {
    const player = this.state.player;

    // Even higher absorption rate in Foundation Establishment
    const baseAbsorption = 0.5; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 120);
    const meridianBonus = this.calculateMeridianBonus();
    const qiGain = baseAbsorption * talentMultiplier * meridianBonus;

    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Foundation Establishment focuses on stability and defense

    // Check for realm breakthrough
    this.checkFoundationEstablishmentBreakthrough();
  }

  /**
   * Calculate cultivation bonus from open meridians
   */
  private calculateMeridianBonus(): number {
    const player = this.state.player;
    const openMeridians = player.meridians.filter(m => m.isOpen);

    if (openMeridians.length === 0) return 1;

    // Base bonus per meridian + purity bonus
    const baseBonus = openMeridians.length * 0.1; // 10% per meridian
    const purityBonus = openMeridians.reduce((sum, m) => sum + (m.purity / 1000), 0); // 0.1% per purity point

    return 1 + baseBonus + purityBonus;
  }

  /**
   * Basic qi absorption for unimplemented realms
   */
  private basicQiAbsorption(): void {
    const player = this.state.player;
    const qiGain = 0.1 + (player.talent / 1000);
    player.qi = Math.min(player.qi + qiGain, player.maxQi);
  }

  /**
   * Attempt to open meridians based on current cultivation (public for UI access)
   */
  public attemptMeridianOpening(specificIndex?: number): void {
    const player = this.state.player;
    const closedMeridians = player.meridians
      .map((meridian, index) => ({ meridian, index }))
      .filter(({ meridian }) => !meridian.isOpen);

    if (closedMeridians.length === 0) return;

    // Choose which meridian to attempt
    const target = specificIndex !== undefined && specificIndex < player.meridians.length
      ? { meridian: player.meridians[specificIndex], index: specificIndex }
      : this.random.choice(closedMeridians);

    // Success chance based on qi level and talent
    const qiRequirement = 50 + (target.index * 25); // Increasing difficulty
    const talentBonus = player.talent / 200;
    const successChance = Math.min(0.8, (player.qi / qiRequirement) * (0.5 + talentBonus));

    if (this.random.chance(successChance)) {
      player.meridians[target.index].isOpen = true;
      player.meridians[target.index].purity = 10; // Start with some purity
      console.log(i18n.t('ui.meridianOpened', { meridian: i18n.getMeridianName(target.index) }));
    }
  }

  /**
   * Process meridian purification and enhancement
   */
  private processMeridianPurification(): void {
    const player = this.state.player;

    player.meridians.forEach((meridian, index) => {
      if (meridian.isOpen && meridian.purity < 100) {
        // Purification rate based on realm and qi level
        const basePurification = 0.1; // Base purity gain per day
        const realmMultiplier = Math.max(1, player.realm + 1); // Higher realms purify faster
        const qiBonus = player.qi / player.maxQi * 0.5; // More qi = faster purification
        const talentBonus = player.talent / 1000;

        const purificationRate = basePurification * realmMultiplier * (1 + qiBonus + talentBonus);
        meridian.purity = Math.min(100, meridian.purity + purificationRate);
      }
    });
  }

  /**
   * Check for breakthrough from Mortal to Qi Condensation
   */
  private checkMortalBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Mortal -> Qi Condensation breakthrough
    const qiRequirement = 100;
    const meridianRequirement = 1; // At least 1 meridian open
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement) {
      // Chance of successful breakthrough
      const breakthroughChance = 0.3 + (player.talent / 500);

      if (this.random.chance(breakthroughChance)) {
        this.performBreakthrough(CultivationRealm.QiCondensation);
      } else {
        // Failed breakthrough - lose some qi
        const qiLoss = this.random.int(10, 30);
        player.qi = Math.max(0, player.qi - qiLoss);
        console.log(`💥 Breakthrough failed! Lost ${qiLoss} qi.`);
      }
    }
  }

  /**
   * Check for breakthrough from Qi Condensation to Foundation Establishment
   */
  private checkQiCondensationBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Qi Condensation -> Foundation Establishment
    const qiRequirement = 1000;
    const meridianRequirement = 6; // At least 6 meridians open
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement) {
      const breakthroughChance = 0.2 + (player.talent / 600);

      if (this.random.chance(breakthroughChance)) {
        this.performBreakthrough(CultivationRealm.FoundationEstablishment);
      } else {
        const qiLoss = this.random.int(50, 150);
        player.qi = Math.max(0, player.qi - qiLoss);
        console.log(`💥 Breakthrough failed! Lost ${qiLoss} qi.`);
      }
    }
  }

  /**
   * Check for breakthrough from Foundation Establishment to Core Formation
   */
  private checkFoundationEstablishmentBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Foundation Establishment -> Core Formation
    const qiRequirement = 5000;
    const meridianRequirement = 10; // At least 10 meridians open
    const purityRequirement = 60; // Average meridian purity 60%
    const openMeridians = player.meridians.filter(m => m.isOpen);
    const avgPurity = openMeridians.length > 0
      ? openMeridians.reduce((sum, m) => sum + m.purity, 0) / openMeridians.length
      : 0;

    if (player.qi >= qiRequirement && openMeridians.length >= meridianRequirement && avgPurity >= purityRequirement) {
      const breakthroughChance = 0.15 + (player.talent / 700);

      if (this.random.chance(breakthroughChance)) {
        this.performBreakthrough(CultivationRealm.CoreFormation);
      } else {
        const qiLoss = this.random.int(200, 500);
        player.qi = Math.max(0, player.qi - qiLoss);
        console.log(`💥 Breakthrough failed! Lost ${qiLoss} qi.`);
      }
    }
  }

  /**
   * Perform a cultivation realm breakthrough
   */
  private performBreakthrough(newRealm: CultivationRealm): void {
    const player = this.state.player;
    const oldRealm = player.realm;

    player.realm = newRealm;
    player.maxQi *= 2; // Double max qi on breakthrough
    player.qi = Math.max(10, player.qi * 0.1); // Reset qi but keep some

    // Record breakthrough in soul
    this.state.soul.cultivationInsights.realmBreakthroughs.push(oldRealm);
    if (newRealm > this.state.soul.maxRealmAchieved) {
      this.state.soul.maxRealmAchieved = newRealm;
    }

    console.log(`🚀 Breakthrough successful! Advanced to ${this.getRealmName(newRealm)} realm!`);
    console.log(`💎 Max Qi increased to ${player.maxQi}`);
  }

  /**
   * Process random life events
   */
  private processRandomEvent(): void {
    const events = [
      { name: 'Fortuitous Encounter', chance: 0.25, effect: () => this.fortuitousEncounter() },
      { name: 'Tribulation Challenge', chance: 0.25, effect: () => this.tribulationChallenge() },
      { name: 'Karmic Reward', chance: 0.25, effect: () => this.karmicReward() },
      { name: 'Enemy Encounter', chance: 0.25, effect: () => this.enemyEncounter() }
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
    console.log(i18n.t('messages.statusUpdate', { day: Math.floor(this.state.time) }));
    console.log(`${i18n.t('status.player')}: ${player.name}`);
    console.log(`${i18n.t('status.realm')}: ${i18n.getRealmName(player.realm)}`);
    console.log(`${i18n.t('status.qi')}: ${player.qi.toFixed(1)} / ${player.maxQi}`);
    console.log(`${i18n.t('status.talent')}: ${player.talent}/100`);
    console.log(`${i18n.t('status.lifetime')}: ${player.lifetime} ${i18n.t('messages.day')} (${i18n.t('status.reincarnation')}: ${soul.lifetimeCount})`);
    console.log(`${i18n.t('status.karma')}: ${soul.karmicBalance > 0 ? '+' : ''}${soul.karmicBalance}`);
    console.log('─────────────────────────────\n');
  }

  /**
   * Get human-readable realm name (public for UI access)
   */
  public getRealmName(realm: CultivationRealm): string {
    return i18n.getRealmName(realm);
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
   * Auto-save game state (called automatically every 10 days)
   */
  private autoSave(): void {
    this.saveGame();
    this.lastAutoSaveTime = this.state.time;
    console.log(i18n.t('ui.autoSaved'));
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
          // Reset auto-save timer when loading
          this.lastAutoSaveTime = this.state.time;
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
      time: parsed.time ? Math.floor(parsed.time / 86400) : 0, // Convert from seconds to days
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

  /**
   * Calculate current qi gathering speed in qi per day
   */
  public calculateQiGatheringSpeed(): number {
    const player = this.state.player;

    // Basic qi absorption even without meridians (very slow spiritual awareness)
    const basicAbsorption = 0.1; // Noticeable base absorption for mortals
    const talentMultiplier = 1 + (player.talent / 500); // Reduced talent impact for basic absorption
    let dailyQiGain = basicAbsorption * talentMultiplier;

    // Enhanced absorption with open meridians
    const openMeridians = player.meridians.filter(m => m.isOpen).length;
    if (openMeridians > 0) {
      // Get base absorption rate for current realm
      let baseAbsorption = 0;
      switch (player.realm) {
        case CultivationRealm.Mortal:
          baseAbsorption = 0.05;
          break;
        case CultivationRealm.QiCondensation:
          baseAbsorption = 0.2;
          break;
        case CultivationRealm.FoundationEstablishment:
          baseAbsorption = 0.5;
          break;
        default:
          baseAbsorption = 0.1; // Default for unimplemented realms
          break;
      }

      // Apply talent multiplier for enhanced absorption
      const enhancedTalentMultiplier = 1 + (player.talent / (player.realm === CultivationRealm.Mortal ? 200 : 150));
      const meridianBonus = this.calculateMeridianBonus();
      const enhancedGain = baseAbsorption * enhancedTalentMultiplier * meridianBonus;
      dailyQiGain += enhancedGain;
    }

    return dailyQiGain; // Return qi per day
  }
}