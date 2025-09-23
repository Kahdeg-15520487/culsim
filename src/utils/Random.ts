/**
 * CULSIM - Randomization Utilities
 *
 * Provides seeded random number generation for reproducible outcomes.
 */

export class Random {
  private seed: number;

  constructor(seed: number = Math.floor(Math.random() * 1000000)) {
    this.seed = seed;
  }

  /**
   * Generate a random number between 0 and 1
   * Using improved LCG parameters for better randomness
   */
  random(): number {
    // Minimal Standard LCG parameters (Park & Miller, 1988)
    // multiplier: 16807, increment: 0, modulus: 2147483647
    this.seed = (16807 * this.seed) % 2147483647;
    return (this.seed - 1) / 2147483646; // Normalize to [0, 1)
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random float between min and max
   */
  float(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Pick a random item from an array
   */
  choice<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  /**
   * Pick a random item from an array with weights
   */
  weightedChoice<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
      throw new Error('Items and weights arrays must have the same length');
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = this.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    // Fallback (should not reach here normally)
    return items[items.length - 1];
  }

  /**
   * Shuffle an array in place
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Test if a probability check passes (0-1)
   */
  chance(probability: number): boolean {
    return this.random() < probability;
  }

  /**
   * Get the current seed for saving/loading
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Set a new seed
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }
}