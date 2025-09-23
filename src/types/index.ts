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
  time: number;
  isRunning: boolean;
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

// Meridian System
export interface Meridian {
  id: string;
  name: string;
  isOpen: boolean;
  purity: number; // 0-100
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