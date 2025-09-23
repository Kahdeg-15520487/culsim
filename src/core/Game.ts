/**
 * CULSIM - Core Game Class
 *
 * Main game controller that manages the game loop, state, and core systems.
 */

import { GameState, Player, Soul, Enemy, TimeTick, CultivationRealm, Element, ElementAffinities, CombatType } from '../types';
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
      elements: this.initializeElementAffinities(),
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
   * Initialize element affinities - assign primary element at birth
   */
  private initializeElementAffinities(): ElementAffinities {
    const elements = [Element.Metal, Element.Wood, Element.Water, Element.Fire, Element.Earth];
    const primaryElement = this.random.choice(elements);

    // Start with base affinity for primary element
    const affinities: ElementAffinities = {
      [Element.Metal]: 0,
      [Element.Wood]: 0,
      [Element.Water]: 0,
      [Element.Fire]: 0,
      [Element.Earth]: 0
    };

    // Primary element gets initial affinity
    affinities[primaryElement] = 10 + this.random.int(0, 10); // 10-20 base affinity

    return affinities;
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
      case CultivationRealm.CoreFormation:
        this.cultivateCoreFormationRealm();
        break;
      case CultivationRealm.NascentSoul:
        this.cultivateNascentSoulRealm();
        break;
      case CultivationRealm.DivineTransformation:
        this.cultivateDivineTransformationRealm();
        break;
      case CultivationRealm.VoidRefinement:
        this.cultivateVoidRefinementRealm();
        break;
      case CultivationRealm.ImmortalAscension:
        this.cultivateImmortalAscensionRealm();
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

    // Element cultivation - basic awareness
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
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

    // Element cultivation - basic awareness
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
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
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
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
   * Core Formation realm cultivation - compressing qi into a solid core
   */
  private cultivateCoreFormationRealm(): void {
    const player = this.state.player;

    // Enhanced qi absorption with core formation techniques
    const baseAbsorption = 1.0; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 300);
    const meridianBonus = this.calculateMeridianBonus();
    const realmMultiplier = 1.5; // Core formation bonus

    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier;
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - core compression
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
  }

  /**
   * Nascent Soul realm cultivation - soul separation and projection
   */
  private cultivateNascentSoulRealm(): void {
    const player = this.state.player;

    // Advanced qi absorption with soul techniques
    const baseAbsorption = 2.0; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 250);
    const meridianBonus = this.calculateMeridianBonus();
    const realmMultiplier = 2.0; // Nascent soul bonus

    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier;
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - soul projection
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
  }

  /**
   * Divine Transformation realm cultivation - divine energies and laws
   */
  private cultivateDivineTransformationRealm(): void {
    const player = this.state.player;

    // Divine qi absorption with heavenly techniques
    const baseAbsorption = 3.0; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 200);
    const meridianBonus = this.calculateMeridianBonus();
    const realmMultiplier = 2.5; // Divine transformation bonus

    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier;
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - divine fusion
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
  }

  /**
   * Void Refinement realm cultivation - void laws and karmic alignment
   */
  private cultivateVoidRefinementRealm(): void {
    const player = this.state.player;

    // Void qi absorption with karmic techniques
    const baseAbsorption = 4.0; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 150);
    const meridianBonus = this.calculateMeridianBonus();
    const realmMultiplier = 3.0; // Void refinement bonus
    const karmicBonus = 1 + (this.state.soul.karmicBalance / 1000); // Karmic influence

    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier * karmicBonus;
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - karmic void
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
  }

  /**
   * Immortal Ascension realm cultivation - transcending mortal limits
   */
  private cultivateImmortalAscensionRealm(): void {
    const player = this.state.player;

    // Immortal qi absorption with Dao techniques
    const baseAbsorption = 5.0; // Base qi per day
    const talentMultiplier = 1 + (player.talent / 100);
    const meridianBonus = this.calculateMeridianBonus();
    const realmMultiplier = 4.0; // Immortal ascension bonus
    const karmicBonus = 1 + (this.state.soul.karmicBalance / 500); // Strong karmic influence

    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * realmMultiplier * karmicBonus;
    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Element cultivation - master all elements
    this.cultivateElements();

    // Manual breakthrough required - no automatic advancement
  }

  /**
   * Cultivate elemental affinities based on current realm and element cycle
   */
  private cultivateElements(): void {
    const player = this.state.player;
    const realm = player.realm;

    // Element progression based on realm and five elements cycle
    // Generating cycle: Wood → Fire → Earth → Metal → Water → Wood
    // Controlling cycle: Wood → Earth → Water → Fire → Metal → Wood

    // Base element growth rate
    const baseGrowth = 0.1 + (player.talent / 1000);

    // Find primary element (highest affinity)
    const primaryElement = this.getPrimaryElement();

    if (primaryElement) {
      // Strengthen primary element
      player.elements[primaryElement] = Math.min(100, player.elements[primaryElement] + baseGrowth);

      // Add complementary elements based on realm progression
      const complementaryElements = this.getComplementaryElements(primaryElement, realm);
      complementaryElements.forEach(element => {
        const growthRate = baseGrowth * 0.5; // Complementary elements grow slower
        player.elements[element] = Math.min(100, player.elements[element] + growthRate);
      });
    }
  }

  /**
   * Get the player's primary element (highest affinity) - public for UI access
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
   * Get complementary elements based on primary element and realm (public for UI access)
   */
  public getComplementaryElements(primaryElement: Element, realm: CultivationRealm): Element[] {
    const complementary: Element[] = [];

    // Five Elements Cycle relationships
    const generatingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Fire,    // Wood generates Fire
      [Element.Fire]: Element.Earth,   // Fire generates Earth
      [Element.Earth]: Element.Metal,  // Earth generates Metal
      [Element.Metal]: Element.Water,  // Metal generates Water
      [Element.Water]: Element.Wood    // Water generates Wood
    };

    const controllingCycle: Record<Element, Element> = {
      [Element.Wood]: Element.Earth,   // Wood controls Earth
      [Element.Earth]: Element.Water,  // Earth controls Water
      [Element.Water]: Element.Fire,   // Water controls Fire
      [Element.Fire]: Element.Metal,   // Fire controls Metal
      [Element.Metal]: Element.Wood    // Metal controls Wood
    };

    // Add generating element (unlocks at Qi Condensation)
    if (realm >= CultivationRealm.QiCondensation) {
      complementary.push(generatingCycle[primaryElement]);
    }

    // Add controlling element (unlocks at Core Formation)
    if (realm >= CultivationRealm.CoreFormation) {
      complementary.push(controllingCycle[primaryElement]);
    }

    // Add counter-controlling element (unlocks at Divine Transformation)
    if (realm >= CultivationRealm.DivineTransformation) {
      // Find element that controls the controller
      const controller = controllingCycle[primaryElement];
      const counterController = Object.entries(controllingCycle).find(([_, controlled]) => controlled === controller)?.[0] as Element;
      if (counterController) {
        complementary.push(counterController);
      }
    }

    return complementary;
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

    // Consume 1/4th of the qi requirement for the attempt
    const qiCost = Math.floor(qiRequirement / 4);
    player.qi = Math.max(0, player.qi - qiCost);

    if (this.random.chance(successChance)) {
      player.meridians[target.index].isOpen = true;
      player.meridians[target.index].purity = 10; // Start with some purity
      console.log(i18n.t('ui.meridianOpened', { meridian: i18n.getMeridianName(target.index) }));
    } else {
      console.log(i18n.t('messages.meridianOpeningFailed', { 
        meridian: i18n.getMeridianName(target.index),
        chance: (successChance * 100).toFixed(1),
        qi: qiCost
      }));
    }
  }

  /**
   * Manual cultivation - allows player to actively cultivate for immediate benefits
   */
  public cultivate(): void {
    const player = this.state.player;

    // Manual cultivation gives a boost to qi absorption
    const manualBoost = 2.0; // 2x normal cultivation rate
    const baseAbsorption = 0.1; // Base qi per manual cultivation
    const talentMultiplier = 1 + (player.talent / 500);
    const meridianBonus = this.calculateMeridianBonus();
    const qiGain = baseAbsorption * talentMultiplier * meridianBonus * manualBoost;

    player.qi = Math.min(player.qi + qiGain, player.maxQi);

    // Manual cultivation also boosts element growth
    this.cultivateElements();

    // Process meridian purification
    this.processMeridianPurification();

    console.log(i18n.t('ui.manualCultivationComplete', { qi: qiGain.toFixed(2) }));
  }

  /**
   * Manual breakthrough attempt - allows player to try advancing to next realm
   */
  public attemptBreakthrough(): void {
    const player = this.state.player;

    console.log(i18n.t('messages.breakthroughAttempt', { realm: this.getRealmName(player.realm) }));

    // Check current realm and validate requirements
    switch (player.realm) {
      case CultivationRealm.Mortal:
        this.attemptMortalBreakthrough();
        break;
      case CultivationRealm.QiCondensation:
        this.attemptQiCondensationBreakthrough();
        break;
      case CultivationRealm.FoundationEstablishment:
        this.attemptFoundationEstablishmentBreakthrough();
        break;
      case CultivationRealm.CoreFormation:
        this.attemptCoreFormationBreakthrough();
        break;
      case CultivationRealm.NascentSoul:
        this.attemptNascentSoulBreakthrough();
        break;
      case CultivationRealm.DivineTransformation:
        this.attemptDivineTransformationBreakthrough();
        break;
      case CultivationRealm.VoidRefinement:
        this.attemptVoidRefinementBreakthrough();
        break;
      case CultivationRealm.ImmortalAscension:
        console.log(`🏆 ${i18n.t('ui.alreadyMaxRealm')}`);
        break;
      default:
        console.log(`❓ ${i18n.t('ui.breakthroughNotAvailable')}`);
    }
  }

  /**
   * Attempt breakthrough from Mortal to Qi Condensation with detailed feedback
   */
  private attemptMortalBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Mortal -> Qi Condensation breakthrough
    const qiRequirement = 100; // 10^2
    const meridianRequirement = 1; // At least 1 meridian open
    const elementRequirement = 1; // 1 element fully cultivated (100% affinity)
    const openMeridians = player.meridians.filter(m => m.isOpen).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.QiCondensation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'heavenly' }));
      // Heavenly tribulation: Minor lightning tribulation
      this.performTribulation('lightning', 0.8, () => {
        this.performBreakthrough(CultivationRealm.QiCondensation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Qi Condensation to Foundation Establishment with detailed feedback
   */
  private attemptQiCondensationBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Qi Condensation -> Foundation Establishment
    const qiRequirement = 10000; // 10^4
    const meridianRequirement = 6; // At least 6 meridians open
    const elementRequirement = 2; // 2 elements fully cultivated (generating or controlling)
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    // Check for fully cultivated elements (must be generating or controlling elements)
    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, player.realm);
      fullyCultivatedElements = Object.entries(player.elements)
        .filter(([element, affinity]) => affinity >= 100 && (element === primaryElement || complementaryElements.includes(element as Element)))
        .length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.FoundationEstablishment) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'heart demon' }));
      // Heart demon tribulation
      this.performTribulation('heart_demon', 0.7, () => {
        this.performBreakthrough(CultivationRealm.FoundationEstablishment);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Foundation Establishment to Core Formation with detailed feedback
   */
  private attemptFoundationEstablishmentBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Foundation Establishment -> Core Formation
    const qiRequirement = 100000; // 10^5
    const meridianRequirement = 12; // All 12 meridians open
    const elementRequirement = 3; // 3 elements fully cultivated
    const openMeridians = player.meridians.filter(m => m.isOpen).length;

    // Check for fully cultivated elements
    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, player.realm);
      fullyCultivatedElements = Object.entries(player.elements)
        .filter(([element, affinity]) => affinity >= 100 && (element === primaryElement || complementaryElements.includes(element as Element)))
        .length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.CoreFormation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'elemental' }));
      // Elemental tribulation
      this.performTribulation('elemental', 0.6, () => {
        this.performBreakthrough(CultivationRealm.CoreFormation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Core Formation to Nascent Soul with detailed feedback
   */
  private attemptCoreFormationBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Core Formation -> Nascent Soul
    const qiRequirement = 1000000; // 10^6
    const meridianRequirement = 12; // All meridians at 80%+ purity
    const elementRequirement = 4; // 4 elements fully cultivated
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= 80).length;

    // Check for fully cultivated elements
    const primaryElement = this.getPrimaryElement();
    let fullyCultivatedElements = 0;
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, player.realm);
      fullyCultivatedElements = Object.entries(player.elements)
        .filter(([element, affinity]) => affinity >= 100 && (element === primaryElement || complementaryElements.includes(element as Element)))
        .length;
    }

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.NascentSoul) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughPurifiedMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughElementRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'karmic' }));
      // Karmic tribulation
      this.performTribulation('karmic', 0.5, () => {
        this.performBreakthrough(CultivationRealm.NascentSoul);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Nascent Soul to Divine Transformation with detailed feedback
   */
  private attemptNascentSoulBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Nascent Soul -> Divine Transformation
    const qiRequirement = 10000000; // 10^7
    const meridianRequirement = 12; // All meridians at 95%+ purity
    const elementRequirement = 5; // All 5 elements fully cultivated
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= 95).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.DivineTransformation) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughHighlyPurifiedMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughAllElementsRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'heavenly lightning' }));
      // Heavenly lightning tribulation
      this.performTribulation('lightning', 0.4, () => {
        this.performBreakthrough(CultivationRealm.DivineTransformation);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Divine Transformation to Void Refinement with detailed feedback
   */
  private attemptDivineTransformationBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Divine Transformation -> Void Refinement
    const qiRequirement = 100000000; // 10^8
    const meridianRequirement = 12; // All meridians at 100% purity
    const elementRequirement = 5; // All 5 elements at divine level
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= 100).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.VoidRefinement) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughPerfectMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughDivineElementsRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'elemental void' }));
      // Elemental void tribulation
      this.performTribulation('elemental', 0.3, () => {
        this.performBreakthrough(CultivationRealm.VoidRefinement);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
    }
  }

  /**
   * Attempt breakthrough from Void Refinement to Immortal Ascension with detailed feedback
   */
  private attemptVoidRefinementBreakthrough(): void {
    const player = this.state.player;

    // Requirements for Void Refinement -> Immortal Ascension
    const qiRequirement = 1000000000; // 10^9
    const meridianRequirement = 12; // All meridians at 100% purity
    const elementRequirement = 5; // All 5 elements at divine level
    const openMeridians = player.meridians.filter(m => m.isOpen && m.purity >= 100).length;
    const fullyCultivatedElements = Object.values(player.elements).filter(affinity => affinity >= 100).length;

    console.log(i18n.t('messages.breakthroughRequirements', { realm: i18n.getRealmName(CultivationRealm.ImmortalAscension) }));
    console.log(i18n.t('messages.breakthroughQiRequirement', { 
      current: player.qi.toFixed(1), 
      required: qiRequirement, 
      status: player.qi >= qiRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughPerfectMeridianRequirement', { 
      current: openMeridians, 
      required: meridianRequirement, 
      status: openMeridians >= meridianRequirement ? '✅' : '❌' 
    }));
    console.log(i18n.t('messages.breakthroughDivineElementsRequirement', { 
      current: fullyCultivatedElements, 
      required: elementRequirement, 
      status: fullyCultivatedElements >= elementRequirement ? '✅' : '❌' 
    }));

    if (player.qi >= qiRequirement && openMeridians >= meridianRequirement && fullyCultivatedElements >= elementRequirement) {
      console.log(i18n.t('messages.breakthroughRequirementsMet', { tribulation: 'final heart demon' }));
      // Final heart demon tribulation
      this.performTribulation('heart_demon', 0.2, () => {
        this.performBreakthrough(CultivationRealm.ImmortalAscension);
      });
    } else {
      console.log(i18n.t('messages.breakthroughRequirementsNotMet'));
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
   * Perform a cultivation realm breakthrough
   */
  private performBreakthrough(newRealm: CultivationRealm): void {
    const player = this.state.player;
    const oldRealm = player.realm;

    player.realm = newRealm;
    player.maxQi *= 100; // 100x max qi on breakthrough to match exponential requirements
    player.qi = Math.max(10, player.qi * 0.1); // Reset qi but keep some

    // Record breakthrough in soul
    this.state.soul.cultivationInsights.realmBreakthroughs.push(oldRealm);
    if (newRealm > this.state.soul.maxRealmAchieved) {
      this.state.soul.maxRealmAchieved = newRealm;
    }

    console.log(i18n.t('messages.breakthroughAdvanced', { realm: this.getRealmName(newRealm) }));
    console.log(i18n.t('messages.maxQiIncreased', { maxQi: player.maxQi }));
  }

  /**
   * Process random life events
   */
  private processRandomEvent(): void {
    const events = [
      { name: i18n.t('events.fortuitousEncounter'), chance: 0.25, effect: () => this.fortuitousEncounter() },
      { name: i18n.t('events.tribulationChallenge'), chance: 0.25, effect: () => this.tribulationChallenge() },
      { name: i18n.t('events.karmicReward'), chance: 0.25, effect: () => this.karmicReward() },
      { name: i18n.t('events.enemyEncounter'), chance: 0.25, effect: () => this.enemyEncounter() }
    ];

    const event = this.random.weightedChoice(events, events.map(e => e.chance));
    console.log(i18n.t('messages.randomEvent', { event: event.name }));
    event.effect();
  }

  /**
   * Fortuitous encounter - increases talent
   */
  private fortuitousEncounter(): void {
    const talentGain = this.random.int(1, 5);
    this.state.player.talent = Math.min(100, this.state.player.talent + talentGain);
    console.log(i18n.t('messages.fortuitousEncounter', { talent: talentGain }));
  }

  /**
   * Tribulation challenge - potential reward or penalty
   */
  private tribulationChallenge(): void {
    if (this.random.chance(0.7)) {
      const insightGain = this.random.int(1, 3);
      this.state.soul.cultivationInsights.tribulationSurvivals += insightGain;
      console.log(i18n.t('messages.tribulationChallengeSuccess', { insights: insightGain }));
    } else {
      // Scale qi loss based on player realm and current qi (0.5-3% of current qi)
      const player = this.state.player;
      const baseLossPercent = 0.005 + (player.realm * 0.005); // 0.5% for Mortal, 1% for Qi Condensation, etc.
      const maxLossPercent = 0.03 + (player.realm * 0.01); // 3% for Mortal, 4% for Qi Condensation, etc.
      const lossPercent = this.random.float(baseLossPercent, maxLossPercent);
      const qiLoss = Math.max(1, Math.floor(player.qi * lossPercent));
      
      player.qi = Math.max(0, player.qi - qiLoss);
      console.log(i18n.t('messages.tribulationChallengeFailure', { qi: qiLoss }));
    }
  }

  /**
   * Karmic reward - increases karmic balance
   */
  private karmicReward(): void {
    const karmaGain = this.random.int(1, 10);
    this.state.soul.karmicBalance += karmaGain;
    console.log(i18n.t('messages.karmicReward', { karma: karmaGain }));
  }

  /**
   * Enemy encounter - combat opportunity
   */
  private enemyEncounter(): void {
    const enemy = this.generateRandomEnemy();
    console.log(i18n.t('messages.enemyEncounter', { 
      enemy: enemy.name, 
      realm: enemy.realm, 
      qi: enemy.qi, 
      maxQi: enemy.maxQi 
    }));

    // Improved combat resolution with realm-scaled damage
    const player = this.state.player;
    const playerPower = player.qi + (player.talent * 2) + (player.realm * 100);
    const enemyPower = enemy.qi + (enemy.realm * 50);

    if (this.random.chance(playerPower / (playerPower + enemyPower))) {
      console.log(i18n.t('messages.enemyDefeated', { enemy: enemy.name }));
      // TODO: Process loot
    } else {
      // Scale damage based on player realm and current qi (1-8% of current qi for Mortal realm, increasing slightly per realm)
      const baseDamagePercent = 0.01 + (player.realm * 0.01); // 1% for Mortal, 2% for Qi Condensation, etc.
      const maxDamagePercent = 0.08 + (player.realm * 0.02); // 8% for Mortal, 10% for Qi Condensation, etc.
      const damagePercent = this.random.float(baseDamagePercent, maxDamagePercent);
      const damage = Math.max(1, Math.floor(player.qi * damagePercent));
      
      player.qi = Math.max(0, player.qi - damage);
      console.log(i18n.t('messages.enemyDefeatedBy', { enemy: enemy.name, damage: damage }));
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

    // Show element cultivation status
    const primaryElement = this.getPrimaryElement();
    if (primaryElement) {
      const complementaryElements = this.getComplementaryElements(primaryElement, player.realm);
      let elementInfo = `${i18n.t('status.elements')}: ${i18n.getElementName(Object.values(Element).indexOf(primaryElement))} (${this.state.player.elements[primaryElement].toFixed(1)}% - Primary)`;
      if (complementaryElements.length > 0) {
        const complementaryInfo = complementaryElements.map(el =>
          `${i18n.getElementName(Object.values(Element).indexOf(el))} (${this.state.player.elements[el].toFixed(1)}%)`
        ).join(', ');
        elementInfo += ` | Complementary: ${complementaryInfo}`;
      }
      console.log(elementInfo);
    }

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

    // Scale enemy qi based on realm for better balance
    let qiMin = 20, qiMax = 80; // Base values for Mortal realm
    let maxQiMin = 50, maxQiMax = 150;
    
    if (realm >= CultivationRealm.QiCondensation) {
      qiMin = 50; qiMax = 150;
      maxQiMin = 100; maxQiMax = 250;
    }
    if (realm >= CultivationRealm.FoundationEstablishment) {
      qiMin = 100; qiMax = 250;
      maxQiMin = 200; maxQiMax = 400;
    }

    const enemy: Enemy = {
      id: `enemy-${Date.now()}-${this.random.int(1000, 9999)}`,
      name: this.random.choice(enemyNames),
      realm,
      qi: this.random.int(qiMin, qiMax),
      maxQi: this.random.int(maxQiMin, maxQiMax),
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

  /**
   * Perform a heavenly tribulation for realm breakthrough
   */
  private performTribulation(type: 'lightning' | 'heart_demon' | 'elemental' | 'karmic', baseSuccessRate: number, onSuccess: () => void): void {
    const player = this.state.player;
    const soul = this.state.soul;

    // Calculate success rate based on cultivation and elements
    let successRate = baseSuccessRate;

    // Elemental bonuses
    const primaryElement = this.getPrimaryElement();
    if (primaryElement) {
      successRate += player.elements[primaryElement] / 1000; // 0-10% bonus from primary element
    }

    // Talent bonus
    successRate += player.talent / 1000; // 0-10% bonus from talent

    // Karmic influence
    if (type === 'karmic' || type === 'heart_demon') {
      successRate += Math.abs(soul.karmicBalance) / 1000; // Karma helps with karmic tribulations
    }

    console.log(i18n.t('messages.tribulationStart', { 
      type: type.toUpperCase(), 
      rate: (successRate * 100).toFixed(1) 
    }));

    if (this.random.chance(successRate)) {
      console.log(i18n.t('messages.tribulationSuccess'));
      onSuccess();
    } else {
      // Tribulation failure - severe consequences
      const qiLoss = Math.floor(player.qi * 0.3); // Lose 30% of current qi
      player.qi = Math.max(0, player.qi - qiLoss);

      // Possible meridian damage
      if (this.random.chance(0.3)) {
        const openMeridians = player.meridians.filter(m => m.isOpen);
        if (openMeridians.length > 0) {
          const damagedMeridian = this.random.choice(openMeridians);
          damagedMeridian.purity = Math.max(0, damagedMeridian.purity - this.random.int(10, 30));
          console.log(`💔 Meridian ${i18n.getMeridianName(player.meridians.indexOf(damagedMeridian))} damaged! Purity reduced.`);
        }
      }

      console.log(`💥 Tribulation failed! Lost ${qiLoss} qi. Cultivation insights gained.`);
      soul.cultivationInsights.tribulationSurvivals += 1;
    }
  }
}