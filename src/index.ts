#!/usr/bin/env node

/**
 * CULSIM - Chinese Cultivation Mythology-Inspired Incremental Game
 *
 * Main entry point for the game application.
 */

import { Game } from './core/Game';
import { InventorySystem } from './utils/InventorySystem';

console.log('🏛️  CULSIM - Cultivation Simulator');
console.log('=====================================\n');

// For CLI mode, create a minimal inventory system
// Create a temporary game to get player reference
const tempGame = new Game(undefined, undefined, null as any); // Pass null to avoid recursion
const player = tempGame.getState().player;
const inventorySystem = new InventorySystem(player);
const game = new Game(undefined, undefined, inventorySystem);
tempGame.stop();
game.start();