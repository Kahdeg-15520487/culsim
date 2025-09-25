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
   * Find an item by ID across all item collections
   */
  private findItemById(itemId: string): Item | null {
    // Check player inventory
    if (this.gameState.player.inventory?.items) {
      const item = this.gameState.player.inventory.items.find(item => item.id === itemId);
      if (item) return item;
    }

    // Check equipped items
    if (this.gameState.player.inventory?.equippedItems) {
      for (const equippedItem of Object.values(this.gameState.player.inventory.equippedItems)) {
        if (equippedItem && equippedItem.id === itemId) {
          return equippedItem;
        }
      }
    }

    // Check legacy player items
    const legacyItem = this.gameState.player.items.find(item => item.id === itemId);
    if (legacyItem) return legacyItem;

    // Check soul items
    const soulItem = this.gameState.soul.items.find(item => item.id === itemId);
    if (soulItem) return soulItem;

    return null;
  }

  /**
   * Calculate total qi absorption bonus from items
   */
  public calculateQiAbsorptionBonus(): { percentage: number; flat: number } {
    let percentageBonus = 0;
    let flatBonus = 0;
    let enhancedStoneBonus = 0;

    // Check for enhanced spirit stone first
    if (this.gameState.player.enhancedSpiritStoneId) {
      // Find the enhanced spirit stone and get its flat bonus
      const enhancedStone = this.findItemById(this.gameState.player.enhancedSpiritStoneId);
      if (enhancedStone) {
        console.log(enhancedStone.name);
        enhancedStone.effects.forEach(effect => {
          if (effect.type === 'qi_absorption' && !effect.isPercentage) {
            enhancedStoneBonus = effect.value;
          }
        });
      }
    }

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'qi_absorption') {
              if (effect.isPercentage) {
                // Percentage bonus to qi gathering (always applies)
                percentageBonus += effect.value;
              } else if (item.category === 'spirit_stone') {
                // Spirit stone flat bonuses only count if this is the enhanced stone
                if (this.gameState.player.enhancedSpiritStoneId === item.id) {
                  flatBonus += effect.value;
                }
                // If no enhanced stone, allow one spirit stone's bonus
                else if (!this.gameState.player.enhancedSpiritStoneId && enhancedStoneBonus === 0) {
                  flatBonus += effect.value;
                  enhancedStoneBonus = effect.value; // Mark that we've used one stone
                }
              } else {
                // Non-spirit stone flat bonuses always apply
                flatBonus += effect.value;
              }
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'qi_absorption') {
          if (effect.isPercentage) {
            // Percentage bonus to qi gathering
            percentageBonus += effect.value;
          } else if (item.category === 'spirit_stone') {
            // Spirit stone flat bonuses only count if this is the enhanced stone
            if (this.gameState.player.enhancedSpiritStoneId === item.id) {
              flatBonus += effect.value;
            }
          } else {
            // Non-spirit stone flat bonuses always apply
            flatBonus += effect.value;
          }
        }
      });
    });

    return { percentage: percentageBonus, flat: flatBonus };
  }
  
  /**
   * Calculate cultivation speed bonus from items
   */
  public calculateCultivationSpeedBonus(): number {
    let totalBonus = 0;

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'cultivation_speed' && effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'combat_power' && !effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'defense' && !effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'critical_chance' && effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'element_boost' &&
                effect.element === element &&
                effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'elemental_resistance' &&
                effect.element === element &&
                effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'luck' && !effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'comprehension' && effect.isPercentage) {
              totalBonus += effect.value;
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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

    // Only check equipped items (new system)
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.duration && effect.duration > 0) {
              activeEffects.push(effect);
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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
    // Only process equipped items (new system) - effects only apply from equipped items
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
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
        }
      });
    }

    // Also process soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
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

    // Clean up soul items with no effects
    this.gameState.soul.items = this.gameState.soul.items.filter(item =>
      item.effects.length > 0
    );
  }

  /**
   * Use a consumable item (pill, spirit stone, etc.)
   */
  public useConsumableItem(itemId: string): boolean {
    // First try inventory items (new system)
    if (this.gameState.player.inventory?.items) {
      const itemIndex = this.gameState.player.inventory.items.findIndex(item => item.id === itemId);

      if (itemIndex !== -1) {
        const item = this.gameState.player.inventory.items[itemIndex];

        // Apply immediate effects
        item.effects.forEach(effect => {
          this.applyImmediateEffect(effect, item);
        });

        // Remove consumed item or reduce quantity
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          this.gameState.player.inventory.items.splice(itemIndex, 1);
        }

        console.log(`🍽️ Used ${item.name}`);
        return true;
      }
    }

    // Also try legacy player items (for backward compatibility during migration)
    const legacyItemIndex = this.gameState.player.items.findIndex(item => item.id === itemId);

    if (legacyItemIndex !== -1) {
      const item = this.gameState.player.items[legacyItemIndex];

      // Apply immediate effects
      item.effects.forEach(effect => {
        this.applyImmediateEffect(effect, item);
      });

      // Remove consumed item or reduce quantity
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.gameState.player.items.splice(legacyItemIndex, 1);
      }

      console.log(`🍽️ Used ${item.name}`);
      return true;
    }

    return false;
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
    // Check equipped items in inventory
    const equippedItems: Item[] = [];
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          equippedItems.push(item);
        }
      });
    }
    return equippedItems;
  }

  /**
   * Get consumable items
   */
  public getConsumableItems(): Item[] {
    const consumables: Item[] = [];

    // Check inventory items (new system)
    if (this.gameState.player.inventory?.items) {
      consumables.push(...this.gameState.player.inventory.items.filter(item =>
        item.category === ItemCategory.Pill ||
        item.category === ItemCategory.SpiritStone ||
        item.category === ItemCategory.Herb ||
        item.category === ItemCategory.Drug
      ));
    }

    

    // Also check soul items (persistent across reincarnations)
    consumables.push(...this.gameState.soul.items.filter(item =>
      item.category === ItemCategory.Pill ||
      item.category === ItemCategory.SpiritStone ||
      item.category === ItemCategory.Herb ||
      item.category === ItemCategory.Drug
    ));

    return consumables;
  }
}
