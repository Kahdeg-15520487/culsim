#!/usr/bin/env node

/**
 * CULSIM - Chinese Cultivation Mythology-Inspired Incremental Game
 *
 * Main entry point for the game application.
 */

import { Game } from './core/Game';

console.log('🏛️  CULSIM - Cultivation Simulator');
console.log('=====================================\n');

// Initialize and start the game
const game = new Game();
game.start();