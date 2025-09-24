/**
 * SaveLoadSystem - Handles game persistence and serialization
 *
 * Manages saving and loading game state to/from local storage,
 * with support for multiple save slots and data validation.
 */

import { GameState, Element } from '../../types';

export class SaveLoadSystem {
  private readonly SAVE_KEY_PREFIX = 'culsim-save';
  private readonly MAX_SAVE_SLOTS = 5;

  /**
   * Save game state to local storage
   */
  public saveGame(gameState: GameState, slot: number = 0): boolean {
    try {
      if (slot < 0 || slot >= this.MAX_SAVE_SLOTS) {
        console.error(`Invalid save slot: ${slot}. Must be between 0 and ${this.MAX_SAVE_SLOTS - 1}`);
        return false;
      }

      const saveKey = `${this.SAVE_KEY_PREFIX}-${slot}`;
      const serializedState = this.serializeGameState(gameState);
      const saveData = {
        state: serializedState,
        timestamp: Date.now(),
        version: '1.0.0'
      };

      localStorage.setItem(saveKey, JSON.stringify(saveData));
    //   console.log(`Game saved to slot ${slot}`);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load game state from local storage
   */
  public loadGame(slot: number = 0): GameState | null {
    try {
      if (slot < 0 || slot >= this.MAX_SAVE_SLOTS) {
        console.error(`Invalid save slot: ${slot}. Must be between 0 and ${this.MAX_SAVE_SLOTS - 1}`);
        return null;
      }

      const saveKey = `${this.SAVE_KEY_PREFIX}-${slot}`;
      const savedData = localStorage.getItem(saveKey);

      if (!savedData) {
        console.log(`No save found in slot ${slot}`);
        return null;
      }

      const parsedData = JSON.parse(savedData);

      // Validate save data structure
      if (!this.validateSaveData(parsedData)) {
        console.error('Invalid save data structure');
        return null;
      }

      const gameState = this.deserializeGameState(parsedData.state);
      console.log(`Game loaded from slot ${slot} (saved: ${new Date(parsedData.timestamp).toLocaleString()})`);
      return gameState;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * Get list of available save slots
   */
  public getAvailableSaveSlots(): Array<{ slot: number; timestamp: number; hasData: boolean }> {
    const slots: Array<{ slot: number; timestamp: number; hasData: boolean }> = [];

    for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
      const saveKey = `${this.SAVE_KEY_PREFIX}-${i}`;
      const savedData = localStorage.getItem(saveKey);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (this.validateSaveData(parsedData)) {
            slots.push({
              slot: i,
              timestamp: parsedData.timestamp,
              hasData: true
            });
          } else {
            slots.push({ slot: i, timestamp: 0, hasData: false });
          }
        } catch {
          slots.push({ slot: i, timestamp: 0, hasData: false });
        }
      } else {
        slots.push({ slot: i, timestamp: 0, hasData: false });
      }
    }

    return slots;
  }

  /**
   * Delete a save slot
   */
  public deleteSaveSlot(slot: number): boolean {
    try {
      if (slot < 0 || slot >= this.MAX_SAVE_SLOTS) {
        console.error(`Invalid save slot: ${slot}`);
        return false;
      }

      const saveKey = `${this.SAVE_KEY_PREFIX}-${slot}`;
      localStorage.removeItem(saveKey);
      console.log(`Save slot ${slot} deleted`);
      return true;
    } catch (error) {
      console.error('Failed to delete save slot:', error);
      return false;
    }
  }

  /**
   * Export save data as JSON string
   */
  public exportSaveData(slot: number = 0): string | null {
    try {
      const saveKey = `${this.SAVE_KEY_PREFIX}-${slot}`;
      const savedData = localStorage.getItem(saveKey);

      if (!savedData) {
        return null;
      }

      return savedData;
    } catch (error) {
      console.error('Failed to export save data:', error);
      return null;
    }
  }

  /**
   * Import save data from JSON string
   */
  public importSaveData(jsonData: string, slot: number = 0): boolean {
    try {
      if (slot < 0 || slot >= this.MAX_SAVE_SLOTS) {
        console.error(`Invalid save slot: ${slot}`);
        return false;
      }

      const parsedData = JSON.parse(jsonData);

      if (!this.validateSaveData(parsedData)) {
        console.error('Invalid save data format');
        return false;
      }

      const saveKey = `${this.SAVE_KEY_PREFIX}-${slot}`;
      localStorage.setItem(saveKey, jsonData);
      console.log(`Save data imported to slot ${slot}`);
      return true;
    } catch (error) {
      console.error('Failed to import save data:', error);
      return false;
    }
  }

  /**
   * Auto-save game state (called automatically every few minutes)
   */
  public autoSave(gameState: GameState): boolean {
    return this.saveGame(gameState, 0); // Always use slot 0 for auto-save
  }

  /**
   * Serialize game state to JSON string
   */
  private serializeGameState(gameState: GameState): string {
    return JSON.stringify(gameState, null, 2);
  }

  /**
   * Deserialize game state from JSON string
   */
  private deserializeGameState(jsonString: string): GameState {
    const parsed = JSON.parse(jsonString);

    // Ensure all required properties exist with defaults
    const defaultState: GameState = {
      player: {
        id: 'player-1',
        name: 'Cultivator',
        realm: 0,
        qi: 0,
        maxQi: 100,
        meridians: [],
        elements: {
          metal: 0,
          wood: 0,
          water: 0,
          fire: 0,
          earth: 0
        },
        talent: 50,
        artifacts: [], // Legacy artifacts
        items: [], // New item system
        lifetime: 0
      },
      soul: {
        id: 'soul-1',
        lifetimeCount: 1,
        totalLifetime: 0,
        cultivationInsights: {
          realmBreakthroughs: [],
          techniqueMastery: [],
          elementalUnderstanding: {
            metal: 0,
            wood: 0,
            water: 0,
            fire: 0,
            earth: 0
          },
          tribulationSurvivals: 0
        },
        karmicBalance: 0,
        maxRealmAchieved: 0,
        artifacts: [], // Legacy artifacts
        items: [] // New item system
      },
      time: 0,
      isRunning: false,
      seed: 0
    };

    return {
      player: { ...defaultState.player, ...parsed.player },
      soul: { ...defaultState.soul, ...parsed.soul },
      time: parsed.time || defaultState.time,
      isRunning: false, // Always start stopped
      seed: parsed.seed || defaultState.seed
    };
  }

  /**
   * Validate save data structure
   */
  private validateSaveData(data: any): boolean {
    try {
      return (
        data &&
        typeof data === 'object' &&
        data.state &&
        typeof data.timestamp === 'number' &&
        data.version &&
        data.timestamp > 0
      );
    } catch {
      return false;
    }
  }

  /**
   * Clear all save data (dangerous operation)
   */
  public clearAllSaveData(): boolean {
    try {
      for (let i = 0; i < this.MAX_SAVE_SLOTS; i++) {
        const saveKey = `${this.SAVE_KEY_PREFIX}-${i}`;
        localStorage.removeItem(saveKey);
      }
      console.log('All save data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear save data:', error);
      return false;
    }
  }

  /**
   * Get save data statistics
   */
  public getSaveStatistics(): {
    totalSlots: number;
    usedSlots: number;
    oldestSave: number | null;
    newestSave: number | null;
  } {
    const slots = this.getAvailableSaveSlots();
    const usedSlots = slots.filter(slot => slot.hasData);
    const timestamps = usedSlots.map(slot => slot.timestamp).filter(t => t > 0);

    return {
      totalSlots: this.MAX_SAVE_SLOTS,
      usedSlots: usedSlots.length,
      oldestSave: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestSave: timestamps.length > 0 ? Math.max(...timestamps) : null
    };
  }
}