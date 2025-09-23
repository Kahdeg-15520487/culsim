/**
 * CULSIM - Game Constants
 *
 * Centralized configuration for all game mechanics, breakthrough requirements,
 * and tunable parameters. This file contains all hardcoded numbers that can
 * be easily adjusted for game balancing.
 */

import { CultivationRealm } from '../types';

/**
 * Initial game state values
 */
export const INITIAL_GAME_VALUES = {
  /** Starting maximum qi capacity */
  MAX_QI: 100,
  /** Starting talent level (1-100 scale) */
  TALENT: 50,
  /** Base element affinity range (min-max) */
  ELEMENT_AFFINITY_BASE: { min: 10, max: 20 },
} as const;

/**
 * Auto-save configuration
 */
export const AUTO_SAVE = {
  /** Days between auto-saves */
  INTERVAL_DAYS: 10,
} as const;

/**
 * Breakthrough requirements for each realm advancement
 */
export const BREAKTHROUGH_REQUIREMENTS = {
  [CultivationRealm.Mortal]: {
    /** Qi required to attempt breakthrough */
    qi: 100,
    /** Number of meridians that must be open */
    meridians: 1,
    /** Number of elements that must be fully cultivated (100% affinity) */
    elements: 1,
  },
  [CultivationRealm.QiCondensation]: {
    qi: 10000,
    meridians: 6,
    elements: 2,
  },
  [CultivationRealm.FoundationEstablishment]: {
    qi: 100000,
    meridians: 12,
    elements: 3,
  },
  [CultivationRealm.CoreFormation]: {
    qi: 1000000,
    meridians: 12, // All meridians at 80%+ purity
    elements: 4,
  },
  [CultivationRealm.NascentSoul]: {
    qi: 10000000,
    meridians: 12, // All meridians at 95%+ purity
    elements: 5,
  },
  [CultivationRealm.DivineTransformation]: {
    qi: 100000000,
    meridians: 12, // All meridians at 100% purity
    elements: 5,
  },
  [CultivationRealm.VoidRefinement]: {
    qi: 1000000000,
    meridians: 12, // All meridians at 100% purity
    elements: 5,
  },
} as const;

/**
 * Meridian system constants
 */
export const MERIDIAN_CONSTANTS = {
  /** Total number of major meridians */
  TOTAL_MERIDIANS: 12,
  /** Base qi cost for opening first meridian */
  OPENING_BASE_COST: 50,
  /** Additional qi cost per meridian index */
  OPENING_COST_INCREMENT: 25,
  /** Qi cost fraction consumed per opening attempt */
  OPENING_ATTEMPT_COST_FRACTION: 0.25,
  /** Initial purity when meridian is first opened */
  INITIAL_PURITY: 10,
  /** Maximum purity level */
  MAX_PURITY: 100,
} as const;

/**
 * Purity thresholds for breakthrough requirements
 */
export const PURITY_THRESHOLDS = {
  /** Minimum purity for Core Formation breakthrough */
  PURIFIED: 80,
  /** Minimum purity for Nascent Soul breakthrough */
  HIGHLY_PURIFIED: 95,
  /** Minimum purity for Divine Transformation and above */
  PERFECT: 100,
} as const;

/**
 * Tribulation success rates for each realm breakthrough
 */
export const TRIBULATION_SUCCESS_RATES = {
  [CultivationRealm.Mortal]: 0.8, // Lightning tribulation
  [CultivationRealm.QiCondensation]: 0.7, // Heart demon tribulation
  [CultivationRealm.FoundationEstablishment]: 0.6, // Elemental tribulation
  [CultivationRealm.CoreFormation]: 0.5, // Karmic tribulation
  [CultivationRealm.NascentSoul]: 0.4, // Heavenly lightning tribulation
  [CultivationRealm.DivineTransformation]: 0.3, // Elemental void tribulation
  [CultivationRealm.VoidRefinement]: 0.2, // Final heart demon tribulation
} as const;

/**
 * Breakthrough effects and multipliers
 */
export const BREAKTHROUGH_EFFECTS = {
  /** Max qi multiplier on breakthrough */
  MAX_QI_MULTIPLIER: 100,
  /** Qi retention percentage after breakthrough (as decimal) */
  QI_RETENTION_PERCENTAGE: 0.1,
  /** Minimum qi retained after breakthrough */
  MIN_QI_RETAINED: 10,
} as const;

/**
 * Cultivation and progression rates
 */
export const CULTIVATION_RATES = {
  /** Base qi absorption per day */
  BASE_QI_ABSORPTION: 0.1,
  /** Base meridian purification per day */
  BASE_MERIDIAN_PURIFICATION: 0.1,
  /** Base element cultivation growth per day */
  BASE_ELEMENT_GROWTH: 0.1,
  /** Maximum element affinity */
  MAX_ELEMENT_AFFINITY: 100,
} as const;

/**
 * Talent and karmic influence multipliers
 */
export const MULTIPLIERS = {
  /** Talent divisor for basic qi absorption */
  TALENT_QI_ABSORPTION: 500,
  /** Talent divisor for meridian opening */
  TALENT_MERIDIAN_OPENING: 150,
  /** Talent divisor for meridian purification */
  TALENT_MERIDIAN_PURIFICATION: 120,
  /** Talent divisor for element cultivation */
  TALENT_ELEMENT_CULTIVATION: 250,
  /** Talent divisor for tribulation resistance */
  TALENT_TRIBULATION_RESISTANCE: 150,
  /** Talent divisor for combat effectiveness */
  TALENT_COMBAT: 100,
  /** Karmic balance divisor for weak influence */
  KARMA_WEAK_INFLUENCE: 1000,
  /** Karmic balance divisor for strong influence */
  KARMA_STRONG_INFLUENCE: 500,
} as const;

/**
 * Combat and battle constants
 */
export const COMBAT_CONSTANTS = {
  /** Base bonus per open meridian (as decimal) */
  MERIDIAN_BONUS_PER_MERIDIAN: 0.1,
  /** Purity bonus divisor (0.1% per purity point) */
  PURITY_BONUS_DIVISOR: 1000,
  /** Qi bonus for combat effectiveness */
  QI_COMBAT_BONUS_DIVISOR: 100,
} as const;

/**
 * Random event constants
 */
export const RANDOM_EVENTS = {
  /** Chance of fortuitous encounter */
  FORTUITOUS_ENCOUNTER_CHANCE: 0.25,
  /** Chance of tribulation challenge */
  TRIBULATION_CHALLENGE_CHANCE: 0.25,
  /** Chance of karmic reward */
  KARMIC_REWARD_CHANCE: 0.25,
  /** Chance of enemy encounter */
  ENEMY_ENCOUNTER_CHANCE: 0.25,
  /** Success rate for tribulation challenges */
  TRIBULATION_SUCCESS_RATE: 0.7,
  /** Base qi loss percentage for tribulation failure */
  TRIBULATION_BASE_LOSS_PERCENT: 0.005,
  /** Maximum qi loss percentage for tribulation failure */
  TRIBULATION_MAX_LOSS_PERCENT: 0.03,
  /** Additional loss percentage per realm */
  TRIBULATION_LOSS_PER_REALM: 0.005,
} as const;

/**
 * UI update intervals
 */
export const UI_CONSTANTS = {
  /** UI update interval in milliseconds */
  UPDATE_INTERVAL_MS: 1000,
} as const;