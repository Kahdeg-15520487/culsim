/**
 * CULSIM - Game Tests
 *
 * Basic tests for the core Game class.
 */

import { Game } from '../core/Game';
import { Element, ItemCategory, ItemQuality, CultivationRealm, EquipmentSlot } from '../types';
import { InventorySystem } from '../utils/InventorySystem';
import { ItemSystem } from '../utils/ItemSystem';
import { ItemInteractionSystem } from '../utils/ItemInteractionSystem';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    // Create a temporary game to get player reference for inventory system
    const tempGame = new Game();
    const player = tempGame.getState().player;
    const inventorySystem = new InventorySystem(player);
    game = new Game(undefined, undefined, inventorySystem);
  });

  afterEach(() => {
    game.stop();
  });

  test('should initialize with correct default state', () => {
    const state = game.getState();

    expect(state.player.name).toBe('Cultivator');
    expect(state.player.realm).toBe(0); // Mortal
    expect(state.player.qi).toBe(0);
    expect(state.player.maxQi).toBe(100);
    expect(state.player.talent).toBe(50);
    expect(state.time).toBe(0);
    expect(state.isRunning).toBe(false);
  });

  test('should have 12 meridians initialized', () => {
    const state = game.getState();

    expect(state.player.meridians).toHaveLength(12);
    state.player.meridians.forEach(meridian => {
      expect(meridian.isOpen).toBe(false);
      expect(meridian.purity).toBe(0);
    });
  });

  test('should have elements initialized with primary element affinity', () => {
    const state = game.getState();
    const elements = state.player.elements;

    // Check that exactly one element has affinity (10-20) and others are 0
    const elementValues = [elements.metal, elements.wood, elements.water, elements.fire, elements.earth];
    const nonZeroElements = elementValues.filter(value => value > 0);
    const zeroElements = elementValues.filter(value => value === 0);

    expect(nonZeroElements).toHaveLength(1); // Exactly one primary element
    expect(zeroElements).toHaveLength(4); // Four elements at 0
    expect(nonZeroElements[0]).toBeGreaterThanOrEqual(10);
    expect(nonZeroElements[0]).toBeLessThanOrEqual(20);
  });

  test('should start game loop when started', () => {
    game.start();
    const state = game.getState();

    expect(state.isRunning).toBe(true);
  });

  test('should display breakthrough requirements with i18n translations', () => {
    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Set up player with minimal requirements for Mortal breakthrough
    const state = game.getState();
    state.player.qi = 50; // Not enough qi yet
    state.player.meridians[0].isOpen = true; // Open one meridian
    state.player.elements.metal = 100; // Fully cultivate primary element

    // Attempt breakthrough - should show requirements but fail
    game.attemptBreakthrough();

    // Verify that translated messages were displayed (not raw i18n keys)
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Attempting breakthrough')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Requirements for')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Qi:')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Meridians:')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Elements:')
    );

    // Restore console.log
    consoleSpy.mockRestore();
  });

  test('should display breakthrough success with i18n translations', () => {
    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Set up player with all requirements for Mortal breakthrough
    const state = game.getState();
    state.player.qi = 100; // Enough qi
    state.player.meridians[0].isOpen = true; // Open one meridian
    
    // Reset all elements to 0, then set metal as primary
    Object.keys(state.player.elements).forEach(element => {
      state.player.elements[element as Element] = 0;
    });
    state.player.elements.metal = 100; // Fully cultivate primary element

    // Attempt breakthrough - should succeed
    game.attemptBreakthrough();

    // Verify that success messages were displayed
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Requirements met')
    );

    // Restore console.log
    consoleSpy.mockRestore();
  });

  test('should display tribulation messages with i18n translations', () => {
    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Set up player with all requirements for Mortal breakthrough
    const state = game.getState();
    state.player.qi = 100; // Enough qi
    state.player.meridians[0].isOpen = true; // Open one meridian
    state.player.elements.metal = 100; // Fully cultivate primary element

    // Attempt breakthrough - should trigger tribulation
    game.attemptBreakthrough();

    // Verify that tribulation messages use i18n keys
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Heavenly Tribulation') // English version
    );
    
    // Check that either tribulation success or failure is logged
    const hasTribulationSuccess = consoleSpy.mock.calls.some(call => 
      call[0] && call[0].includes('Tribulation overcome')
    );
    const hasTribulationFailure = consoleSpy.mock.calls.some(call => 
      call[0] && call[0].includes('Tribulation failed')
    );
    expect(hasTribulationSuccess || hasTribulationFailure).toBe(true);

    // If tribulation succeeded, check for breakthrough success messages
    if (hasTribulationSuccess) {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Breakthrough successful! Advanced to') // English version
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Max Qi increased to') // English version
      );
    }

    // Restore console.log
    consoleSpy.mockRestore();
  });

  test('should consume qi when attempting to open meridians and log failure with chance', () => {
    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Set up player with very low qi to ensure failure
    const state = game.getState();
    const initialQi = 0; // No qi at all
    state.player.qi = initialQi;

    // Attempt to open a meridian (should fail and consume qi)
    game.attemptMeridianOpening(0); // Try to open first meridian

    // Verify qi was consumed (1/4th of requirement: 50/4 = 12.5, but capped at current qi which is 0)
    expect(state.player.qi).toBe(0); // Should remain 0 since initial qi was 0

    // Verify failure message was logged with chance
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to open') // English version
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Success chance:') // English version
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Consumed') // English version
    );

    // Restore console.log
    consoleSpy.mockRestore();
  });

  test('should automatically increase qi over time when game is running', () => {
    const initialState = game.getState();
    const initialQi = initialState.player.qi;

    // Start the game
    game.start();

    // Wait for a few update cycles (game updates every 1 second)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        game.stop();

        const finalState = game.getState();
        const finalQi = finalState.player.qi;

        // Qi should have increased automatically
        expect(finalQi).toBeGreaterThan(initialQi);
        expect(finalQi).toBeGreaterThan(0);
        console.log(`Qi increased from ${initialQi} to ${finalQi} over time.`);
        resolve();
      }, 2500); // Wait 2.5 seconds for multiple update cycles
    });
  });

  test('should equip and unequip spirit stone correctly', () => {
    // Create a separate inventory system for this test
    const player = game.getState().player;
    const inventorySystem = new InventorySystem(player);
    
    // Create a spirit stone
    const spiritStone = ItemSystem.createItem(
      ItemCategory.SpiritStone,
      ItemQuality.Uncommon,
      CultivationRealm.Mortal
    );
    
    // Add it to inventory
    const added = inventorySystem.addItem(spiritStone);
    expect(added).toBe(true);
    
    // Verify it's in inventory
    const inventoryItems = inventorySystem.getItems();
    expect(inventoryItems).toContain(spiritStone);
    
    // Check that no spirit stone is currently equipped
    const equippedItems = inventorySystem.getEquippedItems();
    expect(equippedItems[EquipmentSlot.SpiritStone]).toBeUndefined();
    
    // Equip the spirit stone
    const equipped = inventorySystem.equipItem(spiritStone.id, EquipmentSlot.SpiritStone);
    expect(equipped).toBe(true);
    
    // Verify it's equipped
    const equippedItemsAfter = inventorySystem.getEquippedItems();
    expect(equippedItemsAfter[EquipmentSlot.SpiritStone]).toBe(spiritStone);
    
    // Verify it's removed from inventory
    const inventoryItemsAfterEquip = inventorySystem.getItems();
    expect(inventoryItemsAfterEquip).not.toContain(spiritStone);

    // Verify player's qi gathering speed increased due to equipped spirit stone
    
    // Unequip the spirit stone
    const unequipped = inventorySystem.unequipItem(EquipmentSlot.SpiritStone);
    expect(unequipped).toBe(true);
    
    // Verify it's back in inventory
    const inventoryItemsAfterUnequip = inventorySystem.getItems();
    expect(inventoryItemsAfterUnequip).toContain(spiritStone);
    
    // Verify it's no longer equipped
    const equippedItemsAfterUnequip = inventorySystem.getEquippedItems();
    expect(equippedItemsAfterUnequip[EquipmentSlot.SpiritStone]).toBeUndefined();

    
    // Verify player's qi gathering speed returned to normal due to equipped spirit stone
  });

  test('should enhance spirit stone correctly', () => {
    // Create a separate inventory system and item interaction system for this test
    const player = game.getState().player;
    const inventorySystem = new InventorySystem(player);
    const itemInteractionSystem = new ItemInteractionSystem(inventorySystem);
    
    // Create a spirit stone
    const spiritStone = ItemSystem.createItem(
      ItemCategory.SpiritStone,
      ItemQuality.Rare,
      CultivationRealm.Mortal
    );
    
    // Add it to inventory
    const added = inventorySystem.addItem(spiritStone);
    expect(added).toBe(true);
    
    // Verify it's in inventory
    const inventoryItems = inventorySystem.getItems();
    expect(inventoryItems).toContain(spiritStone);
    
    // Check that no spirit stone is currently equipped
    const equippedItems = inventorySystem.getEquippedItems();
    expect(equippedItems[EquipmentSlot.SpiritStone]).toBeUndefined();
    
    // Enhance the spirit stone
    const result = itemInteractionSystem.useItem(spiritStone.id, 'enhance');
    expect(result.success).toBe(true);
    expect(result.message).toContain('Enhanced qi gathering');
    
    // Verify it's equipped
    const equippedItemsAfter = inventorySystem.getEquippedItems();
    expect(equippedItemsAfter[EquipmentSlot.SpiritStone]).toBe(spiritStone);
    
    // Verify it's removed from inventory
    const inventoryItemsAfterEnhance = inventorySystem.getItems();
    expect(inventoryItemsAfterEnhance).not.toContain(spiritStone);
    
    // Try to enhance a second spirit stone - should fail
    const secondSpiritStone = ItemSystem.createItem(
      ItemCategory.SpiritStone,
      ItemQuality.Uncommon,
      CultivationRealm.Mortal
    );
    
    inventorySystem.addItem(secondSpiritStone);
    const secondResult = itemInteractionSystem.useItem(secondSpiritStone.id, 'enhance');
    expect(secondResult.success).toBe(false);
    expect(secondResult.message).toContain('You already have a spirit stone equipped');
    
    // Verify second stone is still in inventory
    const inventoryItemsAfterSecond = inventorySystem.getItems();
    expect(inventoryItemsAfterSecond).toContain(secondSpiritStone);
  });

});