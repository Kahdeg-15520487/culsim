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
    manaRegeneration: string;
  };

  // Game Status
  status: {
    player: string;
    realm: string;
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
  };

  // Game Messages
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
  };

  // Item Descriptions
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
}

export const translations: Record<Language, Translations> = {
  en: {
    ui: {
      playerStatus: 'Player Status',
      cultivationInfo: 'Cultivation',
      meridianInfo: 'Meridians',
      meridianControls: 'Meridian Controls',
      timeInfo: 'Time',
      gameOutput: 'Game Output',
      startGame: 'Start Game',
      stopGame: 'Stop Game',
      pauseGame: 'Pause',
      cultivate: 'Cultivate',
      saveGame: 'Save Game',
      loadGame: 'Load Game',
      clearSavedGame: 'Clear Saved Game',
      unlockMeridian: 'Unlock Meridian',
      unlockSelectedMeridian: 'Unlock Selected Meridian',
      allMeridiansOpen: 'All meridians open!',
      meridianReq: 'Req: {qi} qi',
      gameStarted: 'Game started!',
      gameStopped: 'Game stopped.',
      gameLoaded: 'Game loaded successfully!',
      noSavedGame: 'No saved game found.',
      savedGameCleared: 'Saved game cleared!',
      confirmClearSavedGame: 'Are you sure you want to clear the saved game? This action cannot be undone.',
      notEnoughQi: 'Not enough qi! Need {qi} qi to attempt opening {meridian}.',
      meridianOpened: 'Successfully opened {meridian} meridian!',
      loading: 'Loading...',
      gameTitle: '🏮 CULSIM - Cultivation Simulator 🏮',
      maxRealm: 'Max Realm',
      breakthroughs: 'Breakthroughs',
      qiGathering: 'Qi Gathering',
      days: 'days',
      years: 'years',
      months: 'months',
      meridiansOpen: 'open',
      qiPerDay: 'qi/day',
      welcomeMessage: 'Welcome to CULSIM!',
      savedGameDetected: 'Saved game detected. Auto-loading...',
      startingNewGame: 'Starting new cultivation journey...',
      autoLoadingGame: 'Auto-loading saved game...',
      autoSaved: '🔄 Auto-saved game progress!',
      manualCultivationComplete: '✨ Manual cultivation complete! Gained {qi} qi.',
      breakthrough: 'Breakthrough',
      alreadyMaxRealm: 'Already at maximum realm!',
      breakthroughNotAvailable: 'Breakthrough not available for current realm.',
      debugPanel: 'Debug Panel',
      addQi: 'Add 10 Qi',
      debugTitle: 'Debug Panel',
      addCultivation: 'Add Cultivation (10 Qi + 10% Meridians + 10% Elements)',
      addMeridians: 'Add 10% Meridians',
      addElements: 'Add 10% Elements',
      addSpiritStone: 'Add Superior Spirit Stone',
      qiUnit: 'qi',
      attack: 'Attack',
      flee: 'Flee',
      combatArena: 'Combat Arena',
      combatStats: 'Combat Stats',
      lootAndRewards: 'Loot & Rewards',
      overview: 'Overview',
      combat: 'Combat',
      inventory: 'Inventory',
      equipment: 'Equipment',
      inventoryStats: 'Inventory Stats',
      items: 'Items',
      itemDetails: 'Item Details',
      searchItems: 'Search items...',
      allCategories: 'All Categories',
      allQualities: 'All Qualities',
      sortByName: 'Name',
      sortByQuality: 'Quality',
      sortByValue: 'Value',
      sortByQuantity: 'Quantity',
      totalItems: 'Items:',
      uniqueItems: 'Unique:',
      totalValue: 'Value:',
      capacity: 'Capacity:',
      noItemsInInventory: 'No items in inventory',
      noItemsMatchFilters: 'No items match your filters',
      selectItemToViewDetails: 'Select an item to view details',
      empty: 'Empty',
      noSpecialEffects: 'No special effects',
      value: 'Value:',
      durability: 'Durability:',
      quantity: 'Quantity:',
      rarity: 'Rarity',
      category: 'Category',
      use: 'Use',
      equip: 'Equip',
      study: 'Study',
      absorb: 'Absorb',
      enhanceQiGathering: 'Enhance Qi Gathering',
      drop: 'Drop',
      noActionsAvailable: 'No actions available',
    },
    status: {
      player: 'Player',
      realm: 'Realm',
      qi: 'Qi',
      talent: 'Talent',
      lifetime: 'Lifetime',
      reincarnation: 'Reincarnation',
      karma: 'Karma',
      meridians: 'Meridians',
      elements: 'Elements',
      time: 'Time',
      gameSpeed: 'Game Speed',
      running: 'Running',
      paused: 'Paused',
      type: 'Type',
      aggression: 'Aggression',
    },
    combatTypes: {
      melee: 'Melee',
      ranged: 'Ranged',
    },
    realms: {
      mortal: 'Mortal',
      qiCondensation: 'Qi Condensation',
      foundationEstablishment: 'Foundation Establishment',
      coreFormation: 'Core Formation',
      nascentSoul: 'Nascent Soul',
      divineTransformation: 'Divine Transformation',
      voidRefinement: 'Void Refinement',
      immortalAscension: 'Immortal Ascension',
    },
    meridians: {
      governorVessel: 'Governor Vessel',
      conceptionVessel: 'Conception Vessel',
      stomach: 'Stomach',
      spleen: 'Spleen',
      heart: 'Heart',
      smallIntestine: 'Small Intestine',
      bladder: 'Bladder',
      kidney: 'Kidney',
      pericardium: 'Pericardium',
      tripleBurner: 'Triple Burner',
      gallbladder: 'Gallbladder',
      liver: 'Liver',
    },
    elements: {
      metal: 'Metal (金)',
      wood: 'Wood (木)',
      water: 'Water (水)',
      fire: 'Fire (火)',
      earth: 'Earth (土)',
    },
    enemies: {
      wildBeast: 'Wild Beast',
      bandit: 'Bandit',
      spiritBeast: 'Spirit Beast',
      demonCultivator: 'Demon Cultivator',
      heavenlyTribulationRemnant: 'Heavenly Tribulation Remnant',
      ancientGuardian: 'Ancient Guardian',
      chaosSpirit: 'Chaos Spirit'
    },
    loot: {
      spiritStone: 'Spirit Stone',
      spiritStoneDescription: 'A stone containing spiritual energy',
      elementalCrystal: '{element} Crystal',
      elementalCrystalDescription: 'A crystal infused with {element} energy',
      ancientScroll: 'Ancient Scroll',
      ancientScrollDescription: 'Contains insights into cultivation techniques'
    },
    events: {
      fortuitousEncounter: 'Fortuitous Encounter',
      tribulationChallenge: 'Tribulation Challenge',
      karmicReward: 'Karmic Reward',
      enemyEncounter: 'Enemy Encounter',
    },
    messages: {
      startingJourney: '🌅 Starting your cultivation journey...\n',
      cultivationSessionEnded: '🏮 Cultivation session ended.',
      statusUpdate: '📊 Status Update (Day {day})',
      day: 'Day',
      meridianAttemptFailed: '❌ Failed to open {meridian} meridian.',
      meridianPurified: '✨ {meridian} purified to {purity}%',
      meridianOpeningFailed: '❌ Failed to open {meridian} meridian. Success chance: {chance}%. Consumed {qi} qi.',
      meridianBreakthroughAttempt: '🔥 Attempting meridian breakthrough for {meridian}. Cost: {qi} qi. Success chance: {chance}%',
      meridianBreakthroughSuccess: '🎉 Meridian breakthrough successful! {meridian} purity increased from {oldPurity}% to {newPurity}%. Consumed {qi} qi.',
      meridianBreakthroughStageAdvanced: '⭐ {meridian} breakthrough stage advanced from {oldStage} to {newStage}!',
      meridianBreakthroughFailed: '💔 Meridian breakthrough failed. {meridian} purity decreased by {purityLoss}%. Consumed {qi} qi.',
      meridianBreakthroughNotEnoughQi: '❌ Not enough qi for meridian breakthrough. Required: {qi} qi.',
      meridianBreakthroughNotOpen: '❌ Cannot breakthrough {meridian} - meridian is not open.',
      meridianBreakthroughNotReady: '❌ Cannot breakthrough {meridian} - requires {required}% purity first.',
      meridianNotPurified: '❌ Cannot breakthrough {meridian} - requires {required}% purity. Current: {purity}%. Continue cultivating to purify meridians.',
      meridianBreakthroughAlreadyPerfect: '✨ {meridian} is already at perfect purity.',
      meridianBreakthroughInvalidIndex: '❌ Invalid meridian index.',
      breakthroughAttempt: '⚡ Attempting breakthrough to {realm}...',
      breakthroughSuccess: '🎉 Breakthrough successful! Reached {realm}!',
      breakthroughFailed: '💔 Breakthrough failed. Cultivation insights gained.',
      breakthroughRequirements: '📋 Requirements for {realm} breakthrough:',
      breakthroughQiRequirement: '   💎 Qi: {current}/{required} {status}',
      breakthroughMeridianRequirement: '   🫀 Open Meridians: {current}/{required} {status}',
      breakthroughPurifiedMeridianRequirement: '   🫀 Purified Meridians (80%+): {current}/{required} {status}',
      breakthroughHighlyPurifiedMeridianRequirement: '   🫀 Highly Purified Meridians (95%+): {current}/{required} {status}',
      breakthroughPerfectMeridianRequirement: '   🫀 Perfect Meridians (100%): {current}/{required} {status}',
      breakthroughElementRequirement: '   🌟 Fully Cultivated Elements: {current}/{required} {status}',
      breakthroughAllElementsRequirement: '   🌟 All Elements Mastered: {current}/{required} {status}',
      breakthroughDivineElementsRequirement: '   🌟 Divine Elements: {current}/{required} {status}',
      breakthroughRequirementsMet: '🎯 Requirements met! Facing {tribulation} tribulation...',
      breakthroughRequirementsNotMet: '❌ Breakthrough requirements not met. Continue cultivating!',
      reincarnation: '🔄 Reincarnating...',
      lifetimeSummary: '📈 Lifetime Summary:',
      totalQiGathered: 'Total Qi Gathered: {qi}',
      maxRealmAchieved: 'Max Realm Achieved: {realm}',
      karmicBalance: 'Karmic Balance: {karma}',
      cultivationInsights: 'Cultivation Insights: {insights}',
      artifactsPreserved: 'Artifacts Preserved: {artifacts}',
      newLifeBegins: '🌱 New life begins...',
      randomEvent: '🎲 Random Event: {event}',
      fortuitousEncounter: '✨ Met a mysterious master! Talent increased by {talent}.',
      tribulationChallengeSuccess: '⚡ Survived a minor tribulation! Gained {insights} tribulation insights.',
      tribulationChallengeFailure: '💥 Failed tribulation challenge! Lost {qi} qi.',
      karmicReward: '🙏 Performed a good deed! Karmic balance increased by {karma}.',
      enemyEncounter: '👹 Encountered {enemy} (Realm: {realm}, Qi: {qi}/{maxQi})',
      enemyDefeated: '✅ Defeated {enemy}!',
      enemyDefeatedBy: '❌ Defeated by {enemy}! Lost {damage} qi.',
      combatVictory: '🎉 Victory! Defeated {enemy}. Gained {qi} qi and {talent} talent.',
      combatDefeat: '💀 Defeated by {enemy}! Lost {qiLoss} qi.',
      lootArtifact: '📿 Obtained {name} (Value: {value})',
      lootElementalCrystal: '💎 Obtained {element} Crystal! {element} affinity increased by {affinity}%.',
      lootCultivationInsight: '📚 Obtained cultivation insight! Talent increased by {talent} points.',
      meridianDamage: '💥 {meridian} damaged in combat! Purity decreased by {damage}%.',
      criticalHit: '💥 Critical hit! Damage doubled!',
      tribulationStart: '⚡ Heavenly Tribulation: {type}! Success rate: {rate}%',
      tribulationSuccess: '✨ Tribulation overcome! Breakthrough successful!',
      tribulationFailed: '💥 Tribulation failed! Cultivation damaged.',
      tribulationLightningFailure: '⚡ Lightning tribulation failed! Lost {qiLoss} qi.',
      tribulationHeartDemonFailure: '👹 Heart demon tribulation failed! Cultivation regressed by {realms} realm(s).',
      breakthroughAdvanced: '🚀 Breakthrough successful! Advanced to {realm} realm!',
      maxQiIncreased: '💎 Max Qi increased to {maxQi}',
      elementCultivationEnabled: '🌟 New elements available for cultivation: {elements}',
      unlockedElements: '🔓 Unlocked elements: {elements}',
      gameSaved: '💾 Game saved successfully!',
      gameLoaded: '📂 Game loaded successfully!',
      saveError: '❌ Failed to save game:',
      loadError: '❌ Failed to load game:',
      // Combat UI
      noEnemyEncountered: 'No enemy encountered. Click "Find Enemy" to search for opponents.',
      findEnemy: 'Find Enemy',
      noActiveCombat: 'No active combat',
      yourPower: 'Your Power:',
      enemyPower: 'Enemy Power:',
      winChance: 'Win Chance:',
      noLootAvailable: 'No loot available',
      foundEnemy: '🔍 Found enemy: {enemy}',
      victoryGainedLoot: '🎉 Victory! Gained {count} loot items.',
      defeatedBy: '💀 Defeated by {enemy}.',
      successfullyFled: '🏃 Successfully fled from {enemy}.',
      failedToFlee: '❌ Failed to flee! {enemy} attacks!',
      enemyEncounterGeneric: '⚔️ An enemy has been encountered!',
      // Item effect messages
      cultivationSpeedIncreased: 'Cultivation speed increased by {value}% for {duration} days',
      combatPowerIncreased: 'Combat power increased by {value}',
      comprehensionIncreased: 'Comprehension increased by {value}% for {duration} days',
      luckIncreased: 'Luck increased by {value}% for {duration} days',
      effectApplied: 'Applied {effectType} effect: {value}',
      effectExpired: '⚡ {itemName} effect expired: {effectType}',
      itemUsed: '🍽️ Used {itemName}',
      qiGained: '💎 Gained {qiGain} qi from {itemName}',
      talentIncreased: '🎓 Talent increased by {talentGain} from {itemName}',
      elementAffinityBoosted: '🌟 {element} affinity boosted by {boost}% from {itemName}',
    },
    itemCategories: {
      weapon: 'Weapons',
      armor: 'Armor',
      pill: 'Pills',
      herb: 'Herbs',
      spirit_stone: 'Spirit Stones',
      charm: 'Charms',
      manual: 'Manuals',
    },
    equipmentSlots: {
      weapon: 'Weapon',
      armor: 'Armor',
      amulet: 'Amulet',
      charm: 'Charm',
      manual: 'Manual',
      spiritstone: 'Spirit Stone',
    },
    itemQualities: {
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      mythical: 'Mythical',
    },

    // Item Descriptions
    itemDescriptions: {
      basic: 'A {quality} {category} from the {realm} realm.',
      elemental: 'A {quality} {element} {category} from the {realm} realm.',
    },

    // Item Name Components
    itemNames: {
      // Quality prefixes
      qualityCommon: '',
      qualityRefined: 'Refined ',
      qualitySuperior: 'Superior ',
      qualityExquisite: 'Exquisite ',
      qualityLegendary: 'Legendary ',
      qualityMythical: 'Mythical ',
      // Base item names
      baseArmor: 'Daoist Robe',
      baseWeapon: 'Spirit Sword',
      basePill: 'Cultivation Pill',
      baseDrug: 'Spirit Wine',
      basePoison: 'Venom Extract',
      baseSpiritStone: 'Spirit Stone',
      baseHerb: 'Spirit Herb',
      baseBeastPart: 'Beast Core',
      baseCharm: 'Protection Charm',
      baseManual: 'Cultivation Manual',
      // Element names
      elementMetal: 'Metal',
      elementWood: 'Wood',
      elementWater: 'Water',
      elementFire: 'Fire',
      elementEarth: 'Earth',
      // Realm suffixes
      realmMortal: '',
      realmQiCondensation: ' of Qi Condensation',
      realmFoundationEstablishment: ' of Foundation Establishment',
      realmCoreFormation: ' of Core Formation',
      realmNascentSoul: ' of Nascent Soul',
      realmDivineTransformation: ' of Divine Transformation',
      realmVoidRefinement: ' of Void Refinement',
      realmImmortalAscension: ' of Immortal Ascension',
    },

    // Item Name Templates (for proper grammar per category and language)
    itemNameTemplates: {
      armor: '{quality} {element} {base} {realm}',
      weapon: '{quality} {element} {base} {realm}',
      pill: '{quality} {element} {base} {realm}',
      drug: '{quality} {element} {base} {realm}',
      poison: '{quality} {element} {base} {realm}',
      spiritStone: '{quality} {element} {base} {realm}',
      herb: '{quality} {element} {base} {realm}',
      beastPart: '{quality} {element} {base} {realm}',
      charm: '{quality} {element} {base} {realm}',
      manual: '{quality} {element} {base} {realm}',
    },

    effects: {
      qiAbsorption: 'Qi Absorption',
      cultivationSpeed: 'Cultivation Speed',
      elementalAffinity: 'Elemental Affinity',
      meridianEfficiency: 'Meridian Efficiency',
      combatPower: 'Combat Power',
      defense: 'Defense',
      healthRegeneration: 'Health Regeneration',
      manaRegeneration: 'Mana Regeneration'
    }
  },
  vi: {
    ui: {
      playerStatus: 'Trạng Thái Người Chơi',
      cultivationInfo: 'Tu Luyện',
      meridianInfo: 'Kinh Mạch',
      meridianControls: 'Điều Khiển Kinh Mạch',
      timeInfo: 'Thời Gian',
      gameOutput: 'Đầu Ra Trò Chơi',
      startGame: 'Bắt Đầu Trò Chơi',
      stopGame: 'Dừng Trò Chơi',
      pauseGame: 'Tạm Dừng',
      cultivate: 'Tu Luyện',
      saveGame: 'Lưu Trò Chơi',
      loadGame: 'Tải Trò Chơi',
      clearSavedGame: 'Xóa Trò Chơi Đã Lưu',
      unlockMeridian: 'Mở Khóa Kinh Mạch',
      unlockSelectedMeridian: 'Mở Khóa Kinh Mạch Đã Chọn',
      allMeridiansOpen: 'Tất cả kinh mạch đã mở!',
      meridianReq: 'Cần: {qi} khí',
      gameStarted: 'Trò chơi đã bắt đầu!',
      gameStopped: 'Trò chơi đã dừng.',
      gameLoaded: 'Đã tải trò chơi thành công!',
      noSavedGame: 'Không tìm thấy trò chơi đã lưu.',
      savedGameCleared: 'Đã xóa trò chơi đã lưu!',
      confirmClearSavedGame: 'Bạn có chắc chắn muốn xóa trò chơi đã lưu? Hành động này không thể hoàn tác.',
      notEnoughQi: 'Không đủ khí! Cần {qi} khí để thử mở {meridian}.',
      meridianOpened: 'Đã mở thành công kinh mạch {meridian}!',
      loading: 'Đang tải...',
      gameTitle: '🏮 CULSIM - Trò Chơi Tu Luyện 🏮',
      maxRealm: 'Cảnh Giới Cao Nhất',
      breakthroughs: 'Đột Phá',
      qiGathering: 'Thu Thập Khí',
      days: 'ngày',
      years: 'năm',
      months: 'tháng',
      meridiansOpen: 'đã mở',
      qiPerDay: 'khí/ngày',
      welcomeMessage: 'Chào mừng đến với CULSIM!',
      savedGameDetected: 'Phát hiện trò chơi đã lưu. Đang tự động tải...',
      startingNewGame: 'Bắt đầu hành trình tu luyện mới...',
      autoLoadingGame: 'Đang tự động tải trò chơi đã lưu...',
      autoSaved: '🔄 Tự động lưu tiến trình trò chơi!',
      manualCultivationComplete: '✨ Tu luyện thủ công hoàn thành! Nhận được {qi} khí.',
      breakthrough: 'Đột Phá',
      alreadyMaxRealm: 'Đã đạt cảnh giới cao nhất!',
      breakthroughNotAvailable: 'Đột phá không khả dụng cho cảnh giới hiện tại.',
      debugPanel: 'Bảng Gỡ Lỗi',
      addQi: 'Thêm 10 Khí',
      debugTitle: 'Bảng Gỡ Lỗi',
      addCultivation: 'Thêm Tu Luyện (10 Khí + 10% Kinh Mạch + 10% Ngũ Hành)',
      addMeridians: 'Thêm 10% Kinh Mạch',
      addElements: 'Thêm 10% Ngũ Hành',
      addSpiritStone: 'Thêm Linh Thạch Cấp Cao',
      qiUnit: 'khí',
      attack: 'Tấn Công',
      flee: 'Chạy Trốn',
      combatArena: 'Chiến Trường',
      combatStats: 'Thống Kê Chiến Đấu',
      lootAndRewards: 'Chiến Lợi Phần Thưởng',
      overview: 'Tổng Quan',
      combat: 'Chiến Đấu',
      inventory: 'Túi Đồ',
      equipment: 'Trang Bị',
      inventoryStats: 'Thống Kê Túi Đồ',
      items: 'Vật Phẩm',
      itemDetails: 'Chi Tiết Vật Phẩm',
      searchItems: 'Tìm kiếm vật phẩm...',
      allCategories: 'Tất Cả Loại',
      allQualities: 'Tất Cả Chất Lượng',
      sortByName: 'Tên',
      sortByQuality: 'Chất Lượng',
      sortByValue: 'Giá Trị',
      sortByQuantity: 'Số Lượng',
      totalItems: 'Vật Phẩm:',
      uniqueItems: 'Độc Nhất:',
      totalValue: 'Giá Trị:',
      capacity: 'Dung Lượng:',
      noItemsInInventory: 'Không có vật phẩm trong túi đồ',
      noItemsMatchFilters: 'Không có vật phẩm nào khớp với bộ lọc',
      selectItemToViewDetails: 'Chọn một vật phẩm để xem chi tiết',
      empty: 'Trống',
      noSpecialEffects: 'Không có hiệu ứng đặc biệt',
      value: 'Giá Trị:',
      durability: 'Độ Bền:',
      quantity: 'Số Lượng:',
      rarity: 'Độ Hiếm',
      category: 'Loại',
      use: 'Sử Dụng',
      equip: 'Trang Bị',
      study: 'Nghiên Cứu',
      absorb: 'Hấp Thu',
      enhanceQiGathering: 'Tăng Cường Tập Khí',
      drop: 'Vứt Bỏ',
      noActionsAvailable: 'Không có hành động khả dụng',
    },
    status: {
      player: 'Người Chơi',
      realm: 'Cảnh Giới',
      qi: 'Khí',
      talent: 'Tài Năng',
      lifetime: 'Tuổi Thọ',
      reincarnation: 'Tái Sinh',
      karma: 'Nghiệp Lực',
      meridians: 'Kinh Mạch',
      elements: 'Ngũ Hành',
      time: 'Thời Gian',
      gameSpeed: 'Tốc Độ Trò Chơi',
      running: 'Đang Chạy',
      paused: 'Tạm Dừng',
      type: 'Loại',
      aggression: 'Ác ý',
    },
    combatTypes: {
      melee: 'Cận Chiến',
      ranged: 'Tầm Xa',
    },
    realms: {
      mortal: 'Phàm Nhân',
      qiCondensation: 'Luyện Khí',
      foundationEstablishment: 'Trúc Cơ',
      coreFormation: 'Kim Đan',
      nascentSoul: 'Nguyên Anh',
      divineTransformation: 'Hóa Thần',
      voidRefinement: 'Luyện Không',
      immortalAscension: 'Phi Thăng',
    },
    meridians: {
      governorVessel: 'Đốc Mạch',
      conceptionVessel: 'Nhâm Mạch',
      stomach: 'Vị Kinh',
      spleen: 'Tỳ Kinh',
      heart: 'Tâm Kinh',
      smallIntestine: 'Tiểu Trường Kinh',
      bladder: 'Bàng Quang Kinh',
      kidney: 'Thận Kinh',
      pericardium: 'Tâm Bao Kinh',
      tripleBurner: 'Tam Tiêu Kinh',
      gallbladder: 'Đởm Kinh',
      liver: 'Gan Kinh',
    },
    elements: {
      metal: 'Kim (金)',
      wood: 'Mộc (木)',
      water: 'Thủy (水)',
      fire: 'Hỏa (火)',
      earth: 'Thổ (土)',
    },
    enemies: {
      wildBeast: 'Dã Thú',
      bandit: 'Tặc Đồ',
      spiritBeast: 'Thú Linh',
      demonCultivator: 'Ma Tu',
      heavenlyTribulationRemnant: 'Dư Âm Thiên Kiếp',
      ancientGuardian: 'Cổ Vệ',
      chaosSpirit: 'Hỗn Độn Linh'
    },
    loot: {
      spiritStone: 'Thiên Linh Thạch',
      spiritStoneDescription: 'Một viên đá chứa năng lượng linh khí',
      elementalCrystal: 'Tinh Thạch {element}',
      elementalCrystalDescription: 'Một tinh thạch chứa năng lượng {element}',
      ancientScroll: 'Cổ Cuốn',
      ancientScrollDescription: 'Chứa đựng những hiểu biết về kỹ thuật tu luyện'
    },
    events: {
      fortuitousEncounter: 'Hào Ngẫu Chi Kiếp',
      tribulationChallenge: 'Thử Thách Kiếp Nạn',
      karmicReward: 'Thưởng Nghiệp Lực',
      enemyEncounter: 'Gặp Kẻ Thù',
    },
    messages: {
      startingJourney: '🌅 Bắt đầu hành trình tu luyện của bạn...\n',
      cultivationSessionEnded: '🏮 Kỳ tu luyện kết thúc.',
      statusUpdate: '📊 Cập Nhật Trạng Thái (Ngày {day})',
      day: 'Ngày',
      meridianAttemptFailed: '❌ Thất bại khi mở kinh mạch {meridian}.',
      meridianPurified: '✨ Kinh mạch {meridian} tinh lọc đạt {purity}%',
      meridianOpeningFailed: '❌ Thất bại khi mở kinh mạch {meridian}. Tỷ lệ thành công: {chance}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughAttempt: '🔥 Thử đột phá kinh mạch {meridian}. Chi phí: {qi} khí. Tỷ lệ thành công: {chance}%',
      meridianBreakthroughSuccess: '🎉 Đột phá kinh mạch thành công! {meridian} độ tinh khiết tăng từ {oldPurity}% lên {newPurity}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughStageAdvanced: '⭐ {meridian} cấp độ đột phá tăng từ {oldStage} lên {newStage}!',
      meridianBreakthroughFailed: '💔 Đột phá kinh mạch thất bại. {meridian} độ tinh khiết giảm {purityLoss}%. Tiêu thụ {qi} khí.',
      meridianBreakthroughNotEnoughQi: '❌ Không đủ khí để đột phá kinh mạch. Cần: {qi} khí.',
      meridianBreakthroughNotOpen: '❌ Không thể đột phá {meridian} - kinh mạch chưa mở.',
      meridianBreakthroughNotReady: '❌ Không thể đột phá {meridian} - cần đạt {required}% độ tinh khiết trước.',
      meridianNotPurified: '❌ Không thể đột phá {meridian} - cần đạt {required}% độ tinh khiết. Hiện tại: {purity}%. Tiếp tục tu luyện để tinh lọc kinh mạch.',
      meridianBreakthroughAlreadyPerfect: '✨ {meridian} đã đạt độ tinh khiết hoàn hảo.',
      meridianBreakthroughInvalidIndex: '❌ Chỉ số kinh mạch không hợp lệ.',
      breakthroughAttempt: '⚡ Đang thử đột phá lên {realm}...',
      breakthroughSuccess: '🎉 Đột phá thành công! Đạt {realm}!',
      breakthroughFailed: '💔 Đột phá thất bại. Nhận được hiểu biết tu luyện.',
      breakthroughRequirements: '📋 Yêu cầu đột phá {realm}:',
      breakthroughQiRequirement: '   💎 Khí: {current}/{required} {status}',
      breakthroughMeridianRequirement: '   🫀 Kinh Mạch Đã Mở: {current}/{required} {status}',
      breakthroughPurifiedMeridianRequirement: '   🫀 Kinh Mạch Tinh Lọc (80%+): {current}/{required} {status}',
      breakthroughHighlyPurifiedMeridianRequirement: '   🫀 Kinh Mạch Cao Cấp Tinh Lọc (95%+): {current}/{required} {status}',
      breakthroughPerfectMeridianRequirement: '   🫀 Kinh Mạch Hoàn Hảo (100%): {current}/{required} {status}',
      breakthroughElementRequirement: '   🌟 Ngũ Hành Đã Tu Luyện Đầy Đủ: {current}/{required} {status}',
      breakthroughAllElementsRequirement: '   🌟 Toàn Bộ Ngũ Hành Thông Thuợ: {current}/{required} {status}',
      breakthroughDivineElementsRequirement: '   🌟 Ngũ Hành Thần Linh: {current}/{required} {status}',
      breakthroughRequirementsMet: '🎯 Đủ yêu cầu! Đối mặt với kiếp nạn {tribulation}...',
      breakthroughRequirementsNotMet: '❌ Chưa đủ yêu cầu đột phá. Tiếp tục tu luyện!',
      reincarnation: '🔄 Đang tái sinh...',
      lifetimeSummary: '📈 Tóm Tắt Tuổi Thọ:',
      totalQiGathered: 'Tổng Khí Thu Thập: {qi}',
      maxRealmAchieved: 'Cảnh Giới Cao Nhất: {realm}',
      karmicBalance: 'Cân Bằng Nghiệp Lực: {karma}',
      cultivationInsights: 'Hiểu Biết Tu Luyện: {insights}',
      artifactsPreserved: 'Pháp Bảo Giữ Lại: {artifacts}',
      newLifeBegins: '🌱 Cuộc đời mới bắt đầu...',
      randomEvent: '🎲 Sự Kiện Ngẫu Nhiên: {event}',
      fortuitousEncounter: '✨ Gặp gỡ một bậc thầy bí ẩn! Tài năng tăng {talent} điểm.',
      tribulationChallengeSuccess: '⚡ Vượt qua kiếp nạn nhỏ! Nhận được {insights} hiểu biết về kiếp nạn.',
      tribulationChallengeFailure: '💥 Thất bại trong thử thách kiếp nạn! Mất {qi} khí.',
      karmicReward: '🙏 Làm một việc thiện! Cân bằng nghiệp lực tăng {karma} điểm.',
      enemyEncounter: '👹 Gặp {enemy} (Cảnh Giới: {realm}, Khí: {qi}/{maxQi})',
      enemyDefeated: '✅ Đánh bại {enemy}!',
      enemyDefeatedBy: '❌ Bị {enemy} đánh bại! Mất {damage} khí.',
      combatVictory: '🎉 Chiến thắng! Đánh bại {enemy}. Nhận được {qi} khí và {talent} tài năng.',
      combatDefeat: '💀 Bị {enemy} đánh bại! Mất {qiLoss} khí.',
      lootArtifact: '📿 Nhận được {name} (Giá trị: {value})',
      lootElementalCrystal: '💎 Nhận được Tinh Thạch {element}! Độ tương hợp {element} tăng {affinity}%.',
      lootCultivationInsight: '📚 Nhận được hiểu biết tu luyện! Tài năng tăng {talent} điểm.',
      meridianDamage: '💥 Kinh mạch {meridian} bị thương trong chiến đấu! Độ tinh khiết giảm {damage}%.',
      criticalHit: '💥 Đòn chí mạng! Sát thương gấp đôi!',
      tribulationStart: '⚡ Thiên Kiếp: {type}! Tỷ lệ thành công: {rate}%',
      tribulationSuccess: '✨ Vượt qua kiếp nạn! Đột phá thành công!',
      tribulationFailed: '💥 Thất bại trong kiếp nạn! Tu luyện bị tổn thương.',
      tribulationLightningFailure: '⚡ Kiếp nạn sấm sét thất bại! Mất {qiLoss} khí.',
      tribulationHeartDemonFailure: '👹 Kiếp nạn tâm ma thất bại! Tu luyện thoái bộ {realms} cảnh giới.',
      breakthroughAdvanced: '🚀 Đột phá thành công! Tiến lên cảnh giới {realm}!',
      maxQiIncreased: '💎 Khí tối đa tăng lên {maxQi}',
      elementCultivationEnabled: '🌟 Ngũ hành mới có thể tu luyện: {elements}',
      unlockedElements: '🔓 Ngũ hành đã mở khóa: {elements}',
      gameSaved: '💾 Đã lưu trò chơi thành công!',
      gameLoaded: '📂 Đã tải trò chơi thành công!',
      saveError: '❌ Lưu trò chơi thất bại:',
      loadError: '❌ Tải trò chơi thất bại:',
      // Combat UI
      noEnemyEncountered: 'Chưa gặp kẻ thù. Nhấp "Tìm Kẻ Thù" để tìm đối thủ.',
      findEnemy: 'Tìm Kẻ Thù',
      noActiveCombat: 'Không có trận chiến đang diễn ra',
      yourPower: 'Sức Mạnh Của Bạn:',
      enemyPower: 'Sức Mạnh Kẻ Thù:',
      winChance: 'Tỷ Lệ Thắng:',
      noLootAvailable: 'Không có chiến lợi phẩm',
      foundEnemy: '🔍 Tìm thấy kẻ thù: {enemy}',
      victoryGainedLoot: '🎉 Chiến thắng! Nhận được {count} vật phẩm.',
      defeatedBy: '💀 Bị {enemy} đánh bại.',
      successfullyFled: '🏃 Thành công chạy trốn khỏi {enemy}.',
      failedToFlee: '❌ Chạy trốn thất bại! {enemy} tấn công!',
      enemyEncounterGeneric: '⚔️ Đã gặp kẻ thù!',
      // Item effect messages
      cultivationSpeedIncreased: 'Tốc độ tu luyện tăng {value}% trong {duration} ngày',
      combatPowerIncreased: 'Sức chiến đấu tăng {value}',
      comprehensionIncreased: 'Sức lĩnh ngộ tăng {value}% trong {duration} ngày',
      luckIncreased: 'May mắn tăng {value}% trong {duration} ngày',
      effectApplied: 'Áp dụng hiệu ứng {effectType}: {value}',
      effectExpired: '⚡ Hiệu ứng của {itemName} đã hết: {effectType}',
      itemUsed: '🍽️ Đã sử dụng {itemName}',
      qiGained: '💎 Nhận được {qiGain} khí từ {itemName}',
      talentIncreased: '🎓 Tài năng tăng {talentGain} từ {itemName}',
      elementAffinityBoosted: '🌟 Độ tương hợp {element} tăng {boost}% từ {itemName}',
    },
    itemCategories: {
      weapon: 'Vũ Khí',
      armor: 'Giáp Trụ',
      pill: 'Đan Dược',
      herb: 'Dược Thảo',
      spirit_stone: 'Linh Thạch',
      charm: 'Pháp Bảo',
      manual: 'Công Pháp',
    },
    equipmentSlots: {
      weapon: 'Vũ Khí',
      armor: 'Giáp Trụ',
      amulet: 'Phù Ấn',
      charm: 'Pháp Bảo',
      manual: 'Công Pháp',
      spiritstone: 'Linh Thạch',
    },
    itemQualities: {
      common: 'Thường',
      uncommon: 'Hiếm',
      rare: 'Quý',
      epic: 'Truyền Thuyết',
      legendary: 'Thần Thoại',
      mythical: 'Thần Bí',
    },

    // Item Descriptions
    itemDescriptions: {
      basic: 'Một {category} {quality} từ cảnh giới {realm}.',
      elemental: 'Một {category} {element} {quality} từ cảnh giới {realm}.',
    },

    // Item Name Components
    itemNames: {
      // Quality prefixes
      qualityCommon: 'Hạ Phẩm',
      qualityRefined: 'Trung Phẩm',
      qualitySuperior: 'Thượng Phẩm',
      qualityExquisite: 'Tinh Phẩm',
      qualityLegendary: 'Truyền Thuyết',
      qualityMythical: 'Thần Bí',
      // Base item names
      baseArmor: 'Đạo Phục',
      baseWeapon: 'Tiên Kiếm',
      basePill: 'Luyện Đan',
      baseDrug: 'Linh Tửu',
      basePoison: 'Độc Dịch',
      baseSpiritStone: 'Linh Thạch',
      baseHerb: 'Linh Dược',
      baseBeastPart: 'Thú Đan',
      baseCharm: 'Hộ Mệnh Phù',
      baseManual: 'Tu Luyện Bí Kíp',
      // Element names
      elementMetal: 'Kim',
      elementWood: 'Mộc',
      elementWater: 'Thủy',
      elementFire: 'Hỏa',
      elementEarth: 'Thổ',
      // Realm suffixes
      realmMortal: '',
      realmQiCondensation: 'Luyện Khí Kỳ',
      realmFoundationEstablishment: 'Trúc Cơ Kỳ',
      realmCoreFormation: 'Kim Đan Kỳ',
      realmNascentSoul: 'Nguyên Anh Kỳ',
      realmDivineTransformation: 'Hóa Thần Kỳ',
      realmVoidRefinement: 'Luyện Không Kỳ',
      realmImmortalAscension: 'Phi Thăng Kỳ',
    },

    // Item Name Templates (for proper grammar per category and language)
    itemNameTemplates: {
      armor: '{element} {quality} {base} {realm}',
      weapon: '{element} {quality} {base} {realm}',
      pill: '{quality} {element} {base} {realm}',
      drug: '{quality} {element} {base} {realm}',
      poison: '{quality} {element} {base} {realm}',
      spiritStone: '{element} {quality} {base} {realm}',
      herb: '{quality} {element} {base} {realm}',
      beastPart: '{element} {quality} {base} {realm}',
      charm: '{element} {quality} {base} {realm}',
      manual: '{quality} {element} {base} {realm}',
    },

    effects: {
      qiAbsorption: 'Hấp Thụ Linh Khí',
      cultivationSpeed: 'Tốc Độ Tu Luyện',
      elementalAffinity: 'Tương Thích Ngũ Hành',
      meridianEfficiency: 'Hiệu Suất Kinh Mạch',
      combatPower: 'Sức Chiến Đấu',
      defense: 'Phòng Thủ',
      healthRegeneration: 'Hồi Phục Sinh Mệnh',
      manaRegeneration: 'Hồi Phục Linh Lực'
    },
  },
};

/**
 * Translation helper function
 */
export class I18n {
  private currentLanguage: Language = 'en';
  private readonly STORAGE_KEY = 'culsim-language';

  constructor(language?: Language) {
    // Load saved language from localStorage, fallback to parameter or default
    const savedLanguage = this.loadSavedLanguage();
    this.currentLanguage = savedLanguage || language || 'en';
    // Apply translations on initialization
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => this.applyTranslations(), 0);
    }
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

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.saveLanguage(language);
    this.applyTranslations(); // Apply translations to DOM when language changes

    // Regenerate equipment slots to update their labels
    if (typeof window !== 'undefined' && window.generateEquipmentSlots) {
      window.generateEquipmentSlots();
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
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in any language
          }
        }
        break;
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
}

// Global i18n instance
export const i18n = new I18n();