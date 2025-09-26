/**
 * Effect Processor
 *
 * Applies all types of effects to game mechanics and calculates bonuses
 * from equipped items, location effects, and other sources.
 */

import { GameState, Item, ItemEffect, ItemCategory, Element } from '../types';
import { ItemSystem } from './ItemSystem';
import { i18n } from './i18n';

export class EffectProcessor {
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
                // Only one spirit stone provides flat bonus (the first equipped one)
                if (flatBonus === 0) {
                  flatBonus += effect.value;
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
            // Only one spirit stone provides flat bonus (the first one)
            if (flatBonus === 0) {
              flatBonus += effect.value;
            }
          } else {
            // Non-spirit stone flat bonuses always apply
            flatBonus += effect.value;
          }
        }
      });
    });

    // Add location effects
    const locationBonus = this.calculateLocationQiAbsorptionBonus();
    percentageBonus += locationBonus.percentage;
    flatBonus += locationBonus.flat;

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

    // Add location effects
    totalBonus += this.calculateLocationCultivationSpeedBonus();

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

    // Add location effects
    totalBonus += this.calculateLocationCombatPowerBonus();

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

    // Add location effects
    totalBonus += this.calculateLocationDefenseBonus();

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

    // Add location effects
    totalBonus += this.calculateLocationCriticalChanceBonus();

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

    // Add location effects
    totalBonus += this.calculateLocationElementBoost(element);

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

    // Add location effects
    totalBonus += this.calculateLocationLuckBonus();

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

    // Add location effects
    totalBonus += this.calculateLocationComprehensionBonus();

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
                console.log(i18n.t('messages.effectExpired', { itemName: ItemSystem.getTranslatedItemName(item), effectType: effect.type }));
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
            console.log(i18n.t('messages.effectExpired', { itemName: ItemSystem.getTranslatedItemName(item), effectType: effect.type }));
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

        console.log(i18n.t('messages.itemUsed', { itemName: ItemSystem.getTranslatedItemName(item) }));
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

      console.log(i18n.t('messages.itemUsed', { itemName: ItemSystem.getTranslatedItemName(item) }));
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
          console.log(i18n.t('messages.qiGained', { qiGain, itemName: ItemSystem.getTranslatedItemName(item) }));
        }
        break;

      case 'talent_boost':
        if (!effect.isPercentage) {
          const talentGain = Math.min(effect.value, 100 - player.talent);
          player.talent += talentGain;
          console.log(i18n.t('messages.talentIncreased', { talentGain, itemName: ItemSystem.getTranslatedItemName(item) }));
        }
        break;

      case 'element_boost':
        if (effect.element && effect.isPercentage) {
          const currentAffinity = player.elements[effect.element];
          const boost = Math.floor(currentAffinity * (effect.value / 100));
          player.elements[effect.element] = Math.min(100, currentAffinity + boost);
          console.log(i18n.t('messages.elementAffinityBoosted', { element: effect.element, boost, itemName: ItemSystem.getTranslatedItemName(item) }));
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

  /**
   * Calculate health regeneration bonus from equipped items
   */
  public calculateHealthRegenerationBonus(): number {
    let totalBonus = 0;

    // Check equipped items
    if (this.gameState.player.inventory?.equippedItems) {
      Object.values(this.gameState.player.inventory.equippedItems).forEach(item => {
        if (item) {
          item.effects.forEach(effect => {
            if (effect.type === 'health_regen') {
              const bonus = effect.isPercentage ?
                (effect.value / 100) * this.getBaseHealthRegen() :
                effect.value;
              totalBonus += bonus;
            }
          });
        }
      });
    }

    // Also check soul items (persistent across reincarnations)
    this.gameState.soul.items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'health_regen') {
          const bonus = effect.isPercentage ?
            (effect.value / 100) * this.getBaseHealthRegen() :
            effect.value;
          totalBonus += bonus;
        }
      });
    });

    // Add location effects
    const locationBonus = this.calculateLocationHealthRegenerationBonus();
    if (locationBonus > 0) {
      totalBonus += (locationBonus / 100) * this.getBaseHealthRegen();
    }

    return totalBonus;
  }

  /**
   * Get base health regeneration rate (for percentage calculations)
   */
  private getBaseHealthRegen(): number {
    // Base regeneration is 1 health per day for mortals
    const player = this.gameState.player;
    let baseRegen = 1.0;

    // Higher realms regenerate faster
    const realmMultiplier = Math.sqrt(player.realm + 1); // +1 to avoid sqrt(0)
    baseRegen *= realmMultiplier;

    // Talent affects regeneration
    baseRegen *= (1 + player.talent / 200); // Up to 50% bonus at max talent

    return baseRegen;
  }

  // ===== LOCATION EFFECT BONUSES =====

  /**
   * Calculate total qi absorption bonus from location effects
   */
  public calculateLocationQiAbsorptionBonus(): { percentage: number; flat: number } {
    let percentageBonus = 0;
    let flatBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'qi_absorption') {
          if (effect.isPercentage) {
            percentageBonus += effect.value;
          } else {
            flatBonus += effect.value;
          }
        }
      });
    }

    return { percentage: percentageBonus, flat: flatBonus };
  }

  /**
   * Calculate cultivation speed bonus from location effects
   */
  public calculateLocationCultivationSpeedBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'cultivation_speed' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate combat power bonus from location effects
   */
  public calculateLocationCombatPowerBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'combat_power' && !effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate element boost from location effects
   */
  public calculateLocationElementBoost(element: Element): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'element_boost' && effect.element === element && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate defense bonus from location effects
   */
  public calculateLocationDefenseBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'defense' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate health regeneration bonus from location effects
   */
  public calculateLocationHealthRegenerationBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'health_regen' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate qi regeneration bonus from location effects
   */
  public calculateLocationQiRegenerationBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'qi_regen' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate critical chance bonus from location effects
   */
  public calculateLocationCriticalChanceBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'critical_chance' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate critical damage bonus from location effects
   */
  public calculateLocationCriticalDamageBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'critical_damage' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate comprehension bonus from location effects
   */
  public calculateLocationComprehensionBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'comprehension' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate luck bonus from location effects
   */
  public calculateLocationLuckBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'luck' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate experience boost from location effects
   */
  public calculateLocationExperienceBoost(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'experience_boost' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate meridian purity bonus from location effects
   */
  public calculateLocationMeridianPurityBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'meridian_purity' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate lifespan bonus from location effects
   */
  public calculateLocationLifespanBonus(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'lifespan' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }

  /**
   * Calculate talent boost from location effects
   */
  public calculateLocationTalentBoost(): number {
    let totalBonus = 0;

    if (this.gameState.player.activeLocationEffects) {
      this.gameState.player.activeLocationEffects.forEach(effect => {
        if (effect.type === 'talent_boost' && effect.isPercentage) {
          totalBonus += effect.value;
        }
      });
    }

    return totalBonus;
  }
}
