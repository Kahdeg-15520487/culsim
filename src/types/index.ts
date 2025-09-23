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

// Combat Types
export enum CombatType {
  Melee = 'melee',
  Ranged = 'ranged'
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
  artifacts: Artifact[];
  lifetime: number; // in days
}

// Soul Entity (persistent across reincarnations)
export interface Soul {
  id: string;
  lifetimeCount: number; // Number of reincarnations
  totalLifetime: number; // Total days across all lives
  cultivationInsights: CultivationInsights; // Knowledge carried over
  karmicBalance: number; // Good/bad karma affecting rebirth
  maxRealmAchieved: CultivationRealm;
  artifacts: Artifact[]; // Soul-bound artifacts
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

// Loot Item
export interface LootItem {
  type: 'artifact' | 'resource' | 'insight';
  item: Artifact | Resource | CultivationInsight;
  dropRate: number; // 0-1
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

// Basic Artifact
export interface Artifact {
  id: string;
  name: string;
  type: string;
  effects: ArtifactEffect[];
}

// Artifact Effects
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