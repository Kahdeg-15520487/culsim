/**
 * Internationalization (i18n) translations for CULSIM
 * Supported languages: English (en) and Vietnamese (vi)
 */

export type Language = 'en' | 'vi';

// Import types
import { ItemQuality, ItemCategory } from '../types';

// Extend window interface for global functions
declare global {
  interface Window {
    generateEquipmentSlots?: () => void;
  }
}

export interface Translations {
  // UI Elements
  ui: {
    playerStatus: string;
    cultivationInfo: string;
    meridianInfo: string;
    meridianControls: string;
    timeInfo: string;
    gameOutput: string;
    startGame: string;
    stopGame: string;
    pauseGame: string;
    cultivate: string;
    saveGame: string;
    loadGame: string;
    clearSavedGame: string;
    unlockMeridian: string;
    unlockSelectedMeridian: string;
    allMeridiansOpen: string;
    meridianReq: string;
    gameStarted: string;
    gameStopped: string;
    gameLoaded: string;
    noSavedGame: string;
    savedGameCleared: string;
    confirmClearSavedGame: string;
    notEnoughQi: string;
    meridianOpened: string;
    loading: string;
    gameTitle: string;
    maxRealm: string;
    breakthroughs: string;
    qiGathering: string;
    days: string;
    years: string;
    months: string;
    meridiansOpen: string;
    qiPerDay: string;
    welcomeMessage: string;
    savedGameDetected: string;
    startingNewGame: string;
    autoLoadingGame: string;
    autoSaved: string;
    manualCultivationComplete: string;
    breakthrough: string;
    alreadyMaxRealm: string;
    breakthroughNotAvailable: string;
    debugPanel: string;
    addQi: string;
    debugTitle: string;
    addCultivation: string;
    addMeridians: string;
    addElements: string;
    addSpiritStone: string;
    qiUnit: string;
    attack: string;
    flee: string;
    combatArena: string;
    combatStats: string;
    lootAndRewards: string;
    overview: string;
    combat: string;
    inventory: string;
    equipment: string;
    inventoryStats: string;
    items: string;
    itemDetails: string;
    searchItems: string;
    allCategories: string;
    allQualities: string;
    sortByName: string;
    sortByQuality: string;
    sortByValue: string;
    sortByQuantity: string;
    totalItems: string;
    uniqueItems: string;
    totalValue: string;
    capacity: string;
    noItemsInInventory: string;
    noItemsMatchFilters: string;
    selectItemToViewDetails: string;
    empty: string;
    noSpecialEffects: string;
    value: string;
    durability: string;
    quantity: string;
    rarity: string;
    category: string;
    use: string;
    equip: string;
    study: string;
    absorb: string;
    enhanceQiGathering: string;
    drop: string;
    noActionsAvailable: string;
  };

  // Travel System
  travel: {
    currentLocation: string;
    worldMap: string;
    availableLocations: string;
    travelControls: string;
    travelTo: string;
    travelTime: string;
    travelCost: string;
    days: string;
    spiritStones: string;
    travel: string;
    cancel: string;
    noLocationsAvailable: string;
    locationNotFound: string;
    travelInProgress: string;
    travelComplete: string;
    insufficientResources: string;
    locationLocked: string;
    locationDescription: string;
    locationLevel: string;
    locationType: string;
    locationEvents: string;
    locationResources: string;
    locationHazards: string;
    locationOpportunities: string;
    travelHistory: string;
    recentTravels: string;
    totalTravels: string;
    favoriteLocations: string;
    markAsFavorite: string;
    removeFavorite: string;
    filterLocations: string;
    searchLocations: string;
    sortBy: string;
    sortByName: string;
    sortByDistance: string;
    sortByLevel: string;
    sortByType: string;
    showAll: string;
    showNearby: string;
    showAccessible: string;
    showFavorites: string;
  };

  // Location Types
  locationTypes: {
    village: string;
    cultivation_site: string;
    dangerous_area: string;
    secret_realm: string;
    ancient_ruin: string;
    spirit_mountain: string;
    demonic_cave: string;
    heavenly_palace: string;
    mortal_city: string;
    immortal_sect: string;
    forbidden_zone: string;
    treasure_ground: string;
    trial_ground: string;
    merchant_town: string;
    alchemy_workshop: string;
    artifact_forge: string;
    library: string;
    training_ground: string;
    meditation_hall: string;
    spirit_spring: string;
    karmic_site: string;
    enlightenment_tree: string;
    tribulation_platform: string;
    ascension_gate: string;
    void_rift: string;
    dao_comprehension_site: string;
    heavenly_tribulation_ground: string;
    immortal_herb_garden: string;
    spirit_beast_forest: string;
    ancient_battlefield: string;
    celestial_observatory: string;
    underworld_entrance: string;
    dragon_lair: string;
    phoenix_nest: string;
    qilin_grove: string;
    turtle_island: string;
    tiger_mountain: string;
  };

  // Item Categories
  itemCategories: {
    weapon: string;
    armor: string;
    pill: string;
    herb: string;
    spirit_stone: string;
    charm: string;
    manual: string;
  };

  // Equipment Slots
  equipmentSlots: {
    weapon: string;
    armor: string;
    amulet: string;
    charm: string;
    manual: string;
    spiritstone: string;
  };

  // Item Qualities
  itemQualities: {
    common: string;
    uncommon: string;
    rare: string;
    epic: string;
    legendary: string;
    mythical: string;
  };

  // Item Effects
  effects: {
    qiAbsorption: string;
    cultivationSpeed: string;
    elementalAffinity: string;
    meridianEfficiency: string;
    combatPower: string;
    defense: string;
    healthRegeneration: string;
    healthRecovery: string;
    manaRegeneration: string;
  };

  // Game Status
  status: {
    player: string;
    realm: string;
    health: string;
    qi: string;
    talent: string;
    lifetime: string;
    reincarnation: string;
    karma: string;
    meridians: string;
    elements: string;
    time: string;
    gameSpeed: string;
    running: string;
    paused: string;
    type: string;
    aggression: string;
  };

  // Combat Types
  combatTypes: {
    melee: string;
    ranged: string;
  };

  // Realm Names
  realms: {
    mortal: string;
    qiCondensation: string;
    foundationEstablishment: string;
    coreFormation: string;
    nascentSoul: string;
    divineTransformation: string;
    voidRefinement: string;
    immortalAscension: string;
  };

  // Meridian Names
  meridians: {
    governorVessel: string;
    conceptionVessel: string;
    stomach: string;
    spleen: string;
    heart: string;
    smallIntestine: string;
    bladder: string;
    kidney: string;
    pericardium: string;
    tripleBurner: string;
    gallbladder: string;
    liver: string;
  };

  // Element Names
  elements: {
    metal: string;
    wood: string;
    water: string;
    fire: string;
    earth: string;
  };

  // Enemy Names
  enemies: {
    wildBeast: string;
    bandit: string;
    spiritBeast: string;
    demonCultivator: string;
    heavenlyTribulationRemnant: string;
    ancientGuardian: string;
    chaosSpirit: string;
  };

  // Loot Item Names
  loot: {
    spiritStone: string;
    spiritStoneDescription: string;
    elementalCrystal: string;
    elementalCrystalDescription: string;
    ancientScroll: string;
    ancientScrollDescription: string;
  };

  // Event Names
  events: {
    fortuitousEncounter: string;
    tribulationChallenge: string;
    karmicReward: string;
    enemyEncounter: string;
    // Travel events
    cultivationMeditation: string;
    cultivationMeditationDesc: string;
    meditate: string;
    continueJourney: string;
    cultivationBreakthrough: string;
    cultivationBreakthroughDesc: string;
    attemptBreakthrough: string;
    cultivationDisturbance: string;
    cultivationDisturbanceDesc: string;
    investigate: string;
    villageQuest: string;
    villageQuestDesc: string;
    acceptQuest: string;
    declineQuest: string;
    merchantEncounter: string;
    merchantEncounterDesc: string;
    trade: string;
    villageTrouble: string;
    villageTroubleDesc: string;
    helpVillagers: string;
    ignore: string;
    dangerEncounter: string;
    dangerEncounterDesc: string;
    fight: string;
    flee: string;
    qiFlow: string;
    qiFlowDesc: string;
    absorbQi: string;
      villageLife: string;
      villageLifeDesc: string;
      rest: string;
      // Secret realm events
      realmInsight: string;
      realmInsightDesc: string;
      studyFormation: string;
      realmTrial: string;
      realmTrialDesc: string;
      faceTrial: string;
      realmOpportunity: string;
      realmOpportunityDesc: string;
      enterRealm: string;
      // Ancient ruin events
      ruinTreasure: string;
      ruinTreasureDesc: string;
      searchTreasure: string;
      ruinArtifact: string;
      ruinArtifactDesc: string;
      examineArtifact: string;
      ruinGuardian: string;
      ruinGuardianDesc: string;
      confrontGuardian: string;
      retreat: string;
      ruinTrap: string;
      ruinTrapDesc: string;
      disarmTrap: string;
    };  // Game Messages
  messages: {
    startingJourney: string;
    cultivationSessionEnded: string;
    statusUpdate: string;
    day: string;
    meridianAttemptFailed: string;
    meridianPurified: string;
    meridianOpeningFailed: string;
    meridianBreakthroughAttempt: string;
    meridianBreakthroughSuccess: string;
    meridianBreakthroughStageAdvanced: string;
    meridianBreakthroughFailed: string;
    meridianBreakthroughNotEnoughQi: string;
    meridianBreakthroughNotOpen: string;
    meridianBreakthroughNotReady: string;
    meridianNotPurified: string;
    meridianBreakthroughAlreadyPerfect: string;
    meridianBreakthroughInvalidIndex: string;
    breakthroughAttempt: string;
    breakthroughSuccess: string;
    breakthroughFailed: string;
    breakthroughRequirements: string;
    breakthroughQiRequirement: string;
    breakthroughMeridianRequirement: string;
    breakthroughPurifiedMeridianRequirement: string;
    breakthroughHighlyPurifiedMeridianRequirement: string;
    breakthroughPerfectMeridianRequirement: string;
    breakthroughElementRequirement: string;
    breakthroughAllElementsRequirement: string;
    breakthroughDivineElementsRequirement: string;
    breakthroughRequirementsMet: string;
    breakthroughRequirementsNotMet: string;
    reincarnation: string;
    lifetimeSummary: string;
    totalQiGathered: string;
    maxRealmAchieved: string;
    karmicBalance: string;
    cultivationInsights: string;
    artifactsPreserved: string;
    newLifeBegins: string;
    randomEvent: string;
    fortuitousEncounter: string;
    tribulationChallengeSuccess: string;
    tribulationChallengeFailure: string;
    karmicReward: string;
    enemyEncounter: string;
    enemyDefeated: string;
    enemyDefeatedBy: string;
    combatVictory: string;
    combatDefeat: string;
    lootArtifact: string;
    lootElementalCrystal: string;
    lootCultivationInsight: string;
    meridianDamage: string;
    healthRecovered: string;
    criticalHit: string;
    tribulationStart: string;
    tribulationSuccess: string;
    tribulationFailed: string;
    tribulationLightningFailure: string;
    tribulationHeartDemonFailure: string;
    breakthroughAdvanced: string;
    maxQiIncreased: string;
    elementCultivationEnabled: string;
    unlockedElements: string;
    // Combat UI
    noEnemyEncountered: string;
    findEnemy: string;
    noActiveCombat: string;
    yourPower: string;
    enemyPower: string;
    winChance: string;
    noLootAvailable: string;
    foundEnemy: string;
    victoryGainedLoot: string;
    defeatedBy: string;
    successfullyFled: string;
    failedToFlee: string;
    gameSaved: string;
    gameLoaded: string;
    saveError: string;
    loadError: string;
    enemyEncounterGeneric: string;
    // Item effect messages
    cultivationSpeedIncreased: string;
    combatPowerIncreased: string;
    comprehensionIncreased: string;
    luckIncreased: string;
    effectApplied: string;
    effectExpired: string;
    itemUsed: string;
    qiGained: string;
    talentIncreased: string;
    elementAffinityBoosted: string;
    // Combat action messages
    playerAttack: string;
    enemyAttack: string;
    combatFlee: string;
    // Travel system messages
    arrivedAtLocation: string;
    locationNotFound: string;
    noPathAvailable: string;
    notEnoughEnergy: string;
    qiAbsorbed: string;
    questAccepted: string;
    merchantGreeting: string;
    villainEncounter: string;
    fledSuccessfully: string;
    fleeFailed: string;
      encounter: string;
      ambush: string;
      // New travel messages
      insightGained: string;
      realmGuardian: string;
      realmEntered: string;
      treasureFound: string;
      trapTriggered: string;
      artifactDiscovered: string;
      guardianAppears: string;
      retreatedSafely: string;
      trapDisarmed: string;
      trapFailed: string;
    };  // Item Descriptions
  itemDescriptions: {
    basic: string;
    elemental: string;
  };

  // Item Name Components
  itemNames: {
    // Quality prefixes
    qualityCommon: string;
    qualityRefined: string;
    qualitySuperior: string;
    qualityExquisite: string;
    qualityLegendary: string;
    qualityMythical: string;
    // Base item names
    baseArmor: string;
    baseWeapon: string;
    basePill: string;
    baseDrug: string;
    basePoison: string;
    baseSpiritStone: string;
    baseHerb: string;
    baseBeastPart: string;
    baseCharm: string;
    baseManual: string;
    // Element names
    elementMetal: string;
    elementWood: string;
    elementWater: string;
    elementFire: string;
    elementEarth: string;
    // Realm suffixes
    realmMortal: string;
    realmQiCondensation: string;
    realmFoundationEstablishment: string;
    realmCoreFormation: string;
    realmNascentSoul: string;
    realmDivineTransformation: string;
    realmVoidRefinement: string;
    realmImmortalAscension: string;
  };

  // Item Name Templates (for proper grammar per category and language)
  itemNameTemplates: {
    armor: string;
    weapon: string;
    pill: string;
    drug: string;
    poison: string;
    spiritStone: string;
    herb: string;
    beastPart: string;
    charm: string;
    manual: string;
  };

  // Location Names and Descriptions
  locations: {
    peacefulValleyVillage: {
      name: string;
      description: string;
    };
    bambooGrove: {
      name: string;
      description: string;
    };
    mountainPeak: {
      name: string;
      description: string;
    };
    darkForest: {
      name: string;
      description: string;
    };
    borderTown: {
      name: string;
      description: string;
    };
    abandonedTemple: {
      name: string;
      description: string;
    };
    spiritLake: {
      name: string;
      description: string;
    };
  };
}

/**
 * Translation helper function
 */
export class I18n {
  private currentLanguage: Language = 'en';
  private readonly STORAGE_KEY = 'culsim-language';
  private translations: Record<Language, Translations> = {} as Record<Language, Translations>;
  private loadedLanguages: Set<Language> = new Set();
  private translationReady: Promise<void>;
  private translationReadyResolver?: () => void;
  private onLanguageChange?: () => void;

  constructor(language?: Language) {
    // Create a promise that resolves when translations are loaded
    this.translationReady = new Promise((resolve) => {
      this.translationReadyResolver = resolve;
    });

    // Load saved language from localStorage, fallback to parameter or default
    const savedLanguage = this.loadSavedLanguage();
    this.currentLanguage = savedLanguage || language || 'en';

    // Load translations asynchronously
    this.loadTranslations(this.currentLanguage).then(() => {
      // Resolve the ready promise
      if (this.translationReadyResolver) {
        this.translationReadyResolver();
      }

      // Apply translations on initialization
      if (typeof window !== 'undefined') {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => this.applyTranslations(), 0);
      }
    });
  }

  private loadSavedLanguage(): Language | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') {
        return saved as Language;
      }
    }
    return null;
  }

  private saveLanguage(language: Language): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, language);
    }
  }

  private async loadTranslations(language: Language): Promise<void> {
    if (this.loadedLanguages.has(language)) {
      return; // Already loaded
    }

    try {
      let translationData: Translations;

      // Check if we're in a Node.js environment (for tests)
      if (typeof global !== 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Node.js environment - use fs to read files synchronously
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', '..', 'public', 'locales', `${language}.json`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        translationData = JSON.parse(fileContent);
      } else {
        // Browser environment - use fetch
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${language}`);
        }
        translationData = await response.json();
      }

      this.translations[language] = translationData;
      this.loadedLanguages.add(language);
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);
      // Fallback to English if available, otherwise throw
      if (language !== 'en' && this.loadedLanguages.has('en')) {
        console.warn(`Falling back to English translations for ${language}`);
        return;
      }
      throw error;
    }
  }

  async setLanguage(language: Language): Promise<void> {
    // Load translations if not already loaded
    await this.loadTranslations(language);

    this.currentLanguage = language;
    this.saveLanguage(language);
    this.applyTranslations(); // Apply translations to DOM when language changes

    // Regenerate equipment slots to update their labels
    if (typeof window !== 'undefined' && window.generateEquipmentSlots) {
      window.generateEquipmentSlots();
    }

    // Call the language change callback if set
    if (this.onLanguageChange) {
      this.onLanguageChange();
    }
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Apply translations to all DOM elements with data-i18n attributes
   */
  applyTranslations(): void {
    if (typeof document === 'undefined') return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        // For input elements, set placeholder, for others set text content
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
          (element as HTMLInputElement).placeholder = translation;
        } else if (element.tagName === 'OPTION') {
          element.textContent = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Get translated text with optional parameter substitution
   */
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    // If current language not loaded, try English as fallback
    if (!value && this.loadedLanguages.has('en')) {
      value = this.translations.en;
    }

    if (!value) {
      return key; // Return key if no translations loaded
    }

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        if (this.currentLanguage !== 'en' && this.loadedLanguages.has('en')) {
          value = this.translations.en;
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if not found in any language
            }
          }
          break;
        }
        return key; // Return key if not found
      }
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Get realm name
   */
  getRealmName(realm: number): string {
    const realmNames = {
      0: 'realms.mortal',
      1: 'realms.qiCondensation',
      2: 'realms.foundationEstablishment',
      3: 'realms.coreFormation',
      4: 'realms.nascentSoul',
      5: 'realms.divineTransformation',
      6: 'realms.voidRefinement',
      7: 'realms.immortalAscension',
    };

    return this.t(realmNames[realm as keyof typeof realmNames] || 'realms.mortal');
  }

  /**
   * Get meridian name
   */
  getMeridianName(index: number): string {
    const meridianNames = {
      0: 'meridians.governorVessel',
      1: 'meridians.conceptionVessel',
      2: 'meridians.stomach',
      3: 'meridians.spleen',
      4: 'meridians.heart',
      5: 'meridians.smallIntestine',
      6: 'meridians.bladder',
      7: 'meridians.kidney',
      8: 'meridians.pericardium',
      9: 'meridians.tripleBurner',
      10: 'meridians.gallbladder',
      11: 'meridians.liver',
    };

    return this.t(meridianNames[index as keyof typeof meridianNames] || 'meridians.governorVessel');
  }

  /**
   * Get element name
   */
  getElementName(element: number): string {
    const elementNames = {
      0: 'elements.metal',
      1: 'elements.wood',
      2: 'elements.water',
      3: 'elements.fire',
      4: 'elements.earth',
    };

    return this.t(elementNames[element as keyof typeof elementNames] || 'elements.metal');
  }

  /**
   * Get quality name
   */
  getQualityName(quality: ItemQuality): string {
    const qualityNames = {
      [ItemQuality.Common]: 'itemQualities.common',
      [ItemQuality.Uncommon]: 'itemQualities.uncommon',
      [ItemQuality.Rare]: 'itemQualities.rare',
      [ItemQuality.Epic]: 'itemQualities.epic',
      [ItemQuality.Legendary]: 'itemQualities.legendary',
      [ItemQuality.Mythical]: 'itemQualities.mythical'
    };

    return this.t(qualityNames[quality as keyof typeof qualityNames] || 'itemQualities.common');
  }

  /**
   * Get category name
   */
  getCategoryName(category: ItemCategory): string {
    const categoryNames = {
      [ItemCategory.Armor]: 'itemCategories.armor',
      [ItemCategory.Weapon]: 'itemCategories.weapon',
      [ItemCategory.Charm]: 'itemCategories.charm',
      [ItemCategory.Manual]: 'itemCategories.manual',
      [ItemCategory.Pill]: 'itemCategories.pill',
      [ItemCategory.Drug]: 'itemCategories.drug',
      [ItemCategory.Herb]: 'itemCategories.herb',
      [ItemCategory.SpiritStone]: 'itemCategories.spirit_stone',
      [ItemCategory.Poison]: 'itemCategories.poison',
      [ItemCategory.BeastPart]: 'itemCategories.beast_part'
    };

    return this.t(categoryNames[category as keyof typeof categoryNames] || 'categories.misc');
  }

  /**
   * Get effect type name
   */
  getEffectTypeName(effectType: string): string {
    const effectNames: { [key: string]: string } = {
      'qi_absorption': 'effects.qiAbsorption',
      'cultivation_speed': 'effects.cultivationSpeed',
      'elemental_affinity': 'effects.elementalAffinity',
      'meridian_efficiency': 'effects.meridianEfficiency',
      'combat_power': 'effects.combatPower',
      'defense': 'effects.defense',
      'health_regeneration': 'effects.healthRegeneration',
      'health_recovery': 'effects.healthRecovery',
      'mana_regeneration': 'effects.manaRegeneration'
    };

    return this.t(effectNames[effectType] || effectType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()));
  }

  /**
   * Get combat type name
   */
  getCombatTypeName(combatType: string): string {
    switch (combatType) {
      case 'melee':
        return this.t('combatTypes.melee');
      case 'ranged':
        return this.t('combatTypes.ranged');
      default:
        return combatType;
    }
  }

  /**
   * Set callback for language change events
   */
  setLanguageChangeCallback(callback: () => void): void {
    this.onLanguageChange = callback;
  }

  /**
   * Wait for translations to be loaded
   */
  async waitForTranslations(): Promise<void> {
    return this.translationReady;
  }
}

// Global i18n instance
export const i18n = new I18n();
