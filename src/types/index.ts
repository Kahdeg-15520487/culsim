/**
 * CULSIM - Core Type Definitions
 *
 * This file contains all the fundamental types used throughout the game.
 */

// Cultivation Realms
export enum CultivationRealm {
  Mortal = 0,
  QiCondensation = 1,
  FoundationEstablishment = 2,
  CoreFormation = 3,
  NascentSoul = 4,
  DivineTransformation = 5,
  VoidRefinement = 6,
  ImmortalAscension = 7
}

// Five Elements
export enum Element {
  Metal = 'metal',
  Wood = 'wood',
  Water = 'water',
  Fire = 'fire',
  Earth = 'earth'
}

// Item Quality/Rarity Levels
export enum ItemQuality {
  Common = 0,      // White - Basic items
  Uncommon = 1,    // Green - Slightly enhanced
  Rare = 2,        // Blue - Good items
  Epic = 3,        // Purple - Excellent items
  Legendary = 4,   // Gold - Exceptional items
  Mythical = 5     // Rainbow - God-tier items
}

// Item Categories
export enum ItemCategory {
  Armor = 'armor',
  Weapon = 'weapon',
  Pill = 'pill',
  Drug = 'drug',
  Poison = 'poison',
  Herb = 'herb',
  BeastPart = 'beast_part',
  SpiritStone = 'spirit_stone',
  Charm = 'charm',
  Manual = 'manual'
}

// Combat Types
export enum CombatType {
  Melee = 'melee',
  Ranged = 'ranged'
}

// Equipment Slots
export enum EquipmentSlot {
  Weapon = 'weapon',
  Armor = 'armor',
  Accessory1 = 'accessory1',
  Accessory2 = 'accessory2'
}

// Game State
export interface GameState {
  player: Player;
  soul: Soul;
  time: number;
  isRunning: boolean;
  seed: number; // For reproducible randomization
}

// Player Entity
export interface Player {
  id: string;
  name: string;
  realm: CultivationRealm;
  qi: number;
  maxQi: number;
  meridians: Meridian[];
  elements: ElementAffinities;
  talent: number; // 1-100 scale
  artifacts: Artifact[]; // Legacy artifacts for backward compatibility
  items: Item[]; // New comprehensive item system
  inventory?: Inventory; // Unified inventory system
  lifetime: number; // in days
  enhancedSpiritStoneId?: string; // ID of spirit stone used for qi gathering enhancement
}

// Soul Entity (persistent across reincarnations)
export interface Soul {
  id: string;
  lifetimeCount: number; // Number of reincarnations
  totalLifetime: number; // Total days across all lives
  cultivationInsights: CultivationInsights; // Knowledge carried over
  karmicBalance: number; // Good/bad karma affecting rebirth
  maxRealmAchieved: CultivationRealm;
  artifacts: Artifact[]; // Soul-bound artifacts (legacy)
  items: Item[]; // Soul-bound items (new system)
}

// Cultivation Insights (knowledge carried over)
export interface CultivationInsights {
  realmBreakthroughs: CultivationRealm[];
  techniqueMastery: TechniqueMastery[];
  elementalUnderstanding: ElementAffinities;
  tribulationSurvivals: number;
}

// Technique Mastery
export interface TechniqueMastery {
  name: string;
  level: number; // 1-100
  element?: Element;
}

// Enemy/NPC Entity
export interface Enemy {
  id: string;
  name: string;
  realm: CultivationRealm;
  qi: number;
  maxQi: number;
  elements: ElementAffinities;
  combatType: CombatType;
  aggression: number; // 1-100 (how likely to attack)
  lootTable: LootItem[];
}

// Loot Item (enhanced with quantity)
export interface LootItem {
  item: Item;
  dropRate: number; // 0-1 chance of dropping
  quantity: number; // How many of this item drop
}

// Loot Table (structured loot drops)
export interface LootTable {
  guaranteed: LootItem[]; // Always drops
  chance: LootItem[]; // Has dropRate chance to drop
  rare: LootItem[]; // Rare drops with low dropRate
}

// Basic Resource
export interface Resource {
  type: 'spirit_stone' | 'elemental_crystal' | 'herb';
  element?: Element;
  quality: number; // 1-100
}

// Cultivation Insight (droppable knowledge)
export interface CultivationInsight {
  type: 'realm_knowledge' | 'technique' | 'elemental_affinity';
  realm?: CultivationRealm;
  technique?: string;
  element?: Element;
  value: number; // Knowledge/understanding gained
}

// Meridian System
export interface Meridian {
  id: string;
  name: string;
  isOpen: boolean;
  purity: number; // 0-100
  breakthroughStage: number; // 0 = natural cap (50%), 1 = purified (80%), 2 = highly purified (95%), 3 = perfect (100%)
}

// Element Affinities
export interface ElementAffinities {
  [Element.Metal]: number;
  [Element.Wood]: number;
  [Element.Water]: number;
  [Element.Fire]: number;
  [Element.Earth]: number;
}

// Basic Artifact (legacy - kept for compatibility)
export interface Artifact {
  id: string;
  name: string;
  type: string;
  effects: ArtifactEffect[];
}

// Enhanced Item System
export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  quality: ItemQuality;
  realm: CultivationRealm; // Minimum realm to use effectively
  element?: Element;
  effects: ItemEffect[];
  description: string;
  value: number; // Base gold/essence value
  durability?: number; // For equipment items
  maxDurability?: number;
  stackable: boolean;
  maxStack?: number;
  quantity: number;
}

// Item Effects (expanded from ArtifactEffect)
export interface ItemEffect {
  type: 'qi_absorption' | 'cultivation_speed' | 'combat_power' | 'element_boost' |
        'defense' | 'health_regen' | 'qi_regen' | 'critical_chance' | 'critical_damage' |
        'elemental_damage' | 'elemental_resistance' | 'meridian_purity' | 'comprehension' |
        'lifespan' | 'talent_boost' | 'luck' | 'experience_boost';
  value: number;
  element?: Element;
  duration?: number; // For temporary effects (in days)
  isPercentage: boolean; // Whether the value is a percentage modifier
}

// Artifact Effects (legacy compatibility)
export interface ArtifactEffect {
  type: 'qi_absorption' | 'cultivation_speed' | 'combat_power' | 'element_boost';
  value: number;
  element?: Element;
}

// Combat Result
export interface CombatResult {
  winner: 'player' | 'enemy';
  damage: number;
  elementalBonus: number;
  criticalHit: boolean;
}

// Time Tick (1 tick = 1 day)
export type TimeTick = number;

// ===== ITEM SCALING SYSTEM =====

// Quality Multipliers (base values multiplied by these)
export const QUALITY_MULTIPLIERS = {
  [ItemQuality.Common]: 1.0,
  [ItemQuality.Uncommon]: 1.5,
  [ItemQuality.Rare]: 2.5,
  [ItemQuality.Epic]: 4.0,
  [ItemQuality.Legendary]: 6.0,
  [ItemQuality.Mythical]: 10.0
};

// Realm Scaling Factors (effects scale with realm difference)
export const REALM_SCALING_FACTORS = {
  [CultivationRealm.Mortal]: 1.0,
  [CultivationRealm.QiCondensation]: 2.0,
  [CultivationRealm.FoundationEstablishment]: 5.0,
  [CultivationRealm.CoreFormation]: 10.0,
  [CultivationRealm.NascentSoul]: 20.0,
  [CultivationRealm.DivineTransformation]: 40.0,
  [CultivationRealm.VoidRefinement]: 80.0,
  [CultivationRealm.ImmortalAscension]: 150.0
};

// Base stats for different item categories at Mortal realm
export const BASE_ITEM_STATS = {
  [ItemCategory.Armor]: {
    defense: 10,
    durability: 100,
    value: 50
  },
  [ItemCategory.Weapon]: {
    attack: 15,
    durability: 80,
    value: 75
  },
  [ItemCategory.Pill]: {
    effectStrength: 25,
    duration: 7, // days
    value: 30
  },
  [ItemCategory.Drug]: {
    effectStrength: 20,
    duration: 3,
    value: 40
  },
  [ItemCategory.Poison]: {
    effectStrength: 30,
    duration: 5,
    value: 60
  },
  [ItemCategory.SpiritStone]: {
    qiStorage: 100,
    value: 20
  },
  [ItemCategory.Herb]: {
    qiContent: 50,
    value: 15
  },
  [ItemCategory.BeastPart]: {
    effectStrength: 35,
    value: 45
  },
  [ItemCategory.Charm]: {
    effectStrength: 10,
    duration: 30, // days
    value: 100
  },
  [ItemCategory.Manual]: {
    knowledge: 25,
    value: 200
  }
} as const;

// Quality-based drop rates (percentage chance)
export const QUALITY_DROP_RATES = {
  [ItemQuality.Common]: 60,
  [ItemQuality.Uncommon]: 25,
  [ItemQuality.Rare]: 10,
  [ItemQuality.Epic]: 4,
  [ItemQuality.Legendary]: 0.9,
  [ItemQuality.Mythical]: 0.1
};

// Inventory Slot (for future expansion)
export interface InventorySlot {
  item: Item | null;
  locked: boolean;
}

// Inventory Filter Options
export interface InventoryFilter {
  category?: ItemCategory;
  quality?: ItemQuality;
  element?: Element;
  realm?: CultivationRealm;
  searchText?: string;
}

// Inventory Sort Options
export interface InventorySort {
  by: 'name' | 'quality' | 'value' | 'category' | 'quantity';
  direction: 'asc' | 'desc';
}

// Comprehensive Inventory Structure
export interface Inventory {
  items: Item[];
  equippedItems: Record<EquipmentSlot, Item | undefined>;
  storageCapacity: number;
  weight: number;
  maxWeight: number;
  organization: {
    bags: InventoryBag[];
    categories: Record<string, Item[]>;
  };
}

// Inventory Bag (for organization)
export interface InventoryBag {
  id: string;
  name: string;
  capacity: number;
  items: Item[];
  category: ItemCategory | 'all';
}