/**
 * Item Effect Processor
 *
 * Applies item effects to game mechanics and calculates bonuses
 * from equipped/owned items.
 */

import { GameState, Item, ItemEffect, ItemCategory, Element } from '../types';

export class ItemEffectProcessor {
  constructor(private gameState: GameState) {}

  /**
   * Calculate total qi absorption bonus from items
   */
  public calculateQiAbsorptionBonus(): { percentage: number; flat: number } {
    let percentageBonus = 0;
    let flatBonus = 0;

    // Check all player items
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'qi_absorption') {
          if (effect.isPercentage) {
            // Percentage bonus to qi gathering
            percentageBonus += effect.value;
          } else {
            // Flat qi bonus (for spirit stones)
            flatBonus += effect.value;
          }
        }
      });
    });

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'qi_absorption') {
          if (effect.isPercentage) {
            // Percentage bonus to qi gathering
            percentageBonus += effect.value;
          } else {
            // Flat qi bonus (for spirit stones)
            flatBonus += effect.value;
          }
        }
      });
    });

    return { percentage: percentageBonus, flat: flatBonus };
  }  /**
   * Calculate cultivation speed bonus from items
   */
  public calculateCultivationSpeedBonus(): number {
    let totalBonus = 0;

    // Check player items
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'cultivation_speed' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'cultivation_speed' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate combat power bonus from items
   */
  public calculateCombatPowerBonus(): number {
    let totalBonus = 0;

    // Check player items
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'combat_power' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'combat_power' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate defense bonus from items
   */
  public calculateDefenseBonus(): number {
    let totalBonus = 0;

    // Check player items
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'defense' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'defense' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate critical chance bonus from items
   */
  public calculateCriticalChanceBonus(): number {
    let totalBonus = 0;

    // Check player items
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'critical_chance' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'critical_chance' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate elemental boost for specific element
   */
  public calculateElementalBoost(element: Element): number {
    let totalBonus = 0;

    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'element_boost' &&
            effect.element === element &&
            effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate elemental resistance for specific element
   */
  public calculateElementalResistance(element: Element): number {
    let totalBonus = 0;

    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'elemental_resistance' &&
            effect.element === element &&
            effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate luck bonus from items
   */
  public calculateLuckBonus(): number {
    let totalBonus = 0;

    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'luck' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Calculate comprehension bonus from items
   */
  public calculateComprehensionBonus(): number {
    let totalBonus = 0;

    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'comprehension' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    });

    return totalBonus;
  }

  /**
   * Get all active temporary effects (with duration)
   */
  public getActiveTemporaryEffects(): ItemEffect[] {
    const activeEffects: ItemEffect[] = [];

    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.duration && effect.duration > 0) {
          activeEffects.push(effect);
        }
      });
    });

    return activeEffects;
  }

  /**
   * Process temporary effect duration (called daily)
   */
  public processTemporaryEffects(): void {
    this.gameState.player.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.duration && effect.duration > 0) {
          effect.duration--;

          // Remove effect if duration expires
          if (effect.duration <= 0) {
            console.log(`⚡ ${item.name} effect expired: ${effect.type}`);
          }
        }
      });

      // Remove expired effects
      item.effects = item.effects.filter(effect =>
        !effect.duration || effect.duration > 0
      );
    });

    // Clean up items with no effects
    this.gameState.player.items = this.gameState.player.items.filter(item =>
      item.effects.length > 0
    );
  }

  /**
   * Use a consumable item (pill, spirit stone, etc.)
   */
  public useConsumableItem(itemId: string): boolean {
    const itemIndex = this.gameState.player.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) return false;

    const item = this.gameState.player.items[itemIndex];

    // Apply immediate effects
    item.effects.forEach(effect => {
      this.applyImmediateEffect(effect, item);
    });

    // Remove consumed item or reduce quantity
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.gameState.player.items.splice(itemIndex, 1);
    }

    console.log(`🍽️ Used ${item.name}`);
    return true;
  }

  /**
   * Apply immediate effect from consumable item
   */
  private applyImmediateEffect(effect: ItemEffect, item: Item): void {
    const player = this.gameState.player;

    switch (effect.type) {
      case 'qi_absorption':
        if (!effect.isPercentage) {
          // Flat qi gain
          const qiGain = Math.min(effect.value, player.maxQi - player.qi);
          player.qi += qiGain;
          console.log(`💎 Gained ${qiGain} qi from ${item.name}`);
        }
        break;

      case 'talent_boost':
        if (!effect.isPercentage) {
          const talentGain = Math.min(effect.value, 100 - player.talent);
          player.talent += talentGain;
          console.log(`🎓 Talent increased by ${talentGain} from ${item.name}`);
        }
        break;

      case 'element_boost':
        if (effect.element && effect.isPercentage) {
          const currentAffinity = player.elements[effect.element];
          const boost = Math.floor(currentAffinity * (effect.value / 100));
          player.elements[effect.element] = Math.min(100, currentAffinity + boost);
          console.log(`🌟 ${effect.element} affinity boosted by ${boost}% from ${item.name}`);
        }
        break;
    }
  }

  /**
   * Get equipped items (for future equipment system)
   */
  public getEquippedItems(): Item[] {
    // For now, all items provide passive effects
    // Future: distinguish between inventory and equipped items
    return this.gameState.player.items.filter(item =>
      item.category === ItemCategory.Armor ||
      item.category === ItemCategory.Weapon ||
      item.category === ItemCategory.Charm
    );
  }

  /**
   * Get consumable items
   */
  public getConsumableItems(): Item[] {
    return this.gameState.player.items.filter(item =>
      item.category === ItemCategory.Pill ||
      item.category === ItemCategory.SpiritStone ||
      item.category === ItemCategory.Herb ||
      item.category === ItemCategory.Drug
    );
  }
}