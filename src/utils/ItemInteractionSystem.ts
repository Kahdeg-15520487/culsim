/**
 * Item Interaction System
 *
 * Handles all player interactions with items including using, equipping,
 * consuming, combining, and applying effects.
 */

import {
  Item,
  ItemCategory,
  ItemQuality,
  ItemEffect,
  Player,
  EquipmentSlot,
  Element,
  CultivationRealm
} from '../types';
import { InventorySystem } from './InventorySystem';

export class ItemInteractionSystem {
  private inventorySystem: InventorySystem;
  private player: Player;

  constructor(inventorySystem: InventorySystem) {
    this.inventorySystem = inventorySystem;
    this.player = inventorySystem.getPlayer();
  }

  /**
   * Use an item (consume, equip, or activate)
   */
  useItem(itemId: string, actionType?: string): { success: boolean; message: string; effects?: ItemEffect[] } {
    const item = this.findItem(itemId);
    if (!item) {
      return { success: false, message: 'Item not found in inventory' };
    }

    switch (item.category) {
      case ItemCategory.Pill:
      case ItemCategory.Drug:
      case ItemCategory.Herb:
        return this.consumeItem(item);

      case ItemCategory.Weapon:
      case ItemCategory.Armor:
      case ItemCategory.Charm:
        return this.equipItem(item);

      case ItemCategory.Manual:
        return this.studyManual(item);

      case ItemCategory.SpiritStone:
        if (actionType === 'enhance') {
          return this.enhanceSpiritStone(item);
        } else {
          return this.absorbSpiritStone(item);
        }

      default:
        return { success: false, message: 'This item cannot be used directly' };
    }
  }

  /**
   * Consume a consumable item
   */
  private consumeItem(item: Item): { success: boolean; message: string; effects?: ItemEffect[] } {
    // Check realm compatibility
    if (item.realm > this.player.realm) {
      return {
        success: false,
        message: `Your cultivation realm is too low to safely consume this ${item.category.toLowerCase()}`
      };
    }

    // Apply effects
    const appliedEffects = this.applyEffects(item.effects, item);

    // Remove item from inventory
    this.inventorySystem.removeItem(item.id, 1);

    return {
      success: true,
      message: `Consumed ${item.name}`,
      effects: appliedEffects
    };
  }

  /**
   * Equip an equipment item
   */
  private equipItem(item: Item): { success: boolean; message: string; effects?: ItemEffect[] } {
    // Determine equipment slot
    const slot = this.getEquipmentSlotForItem(item);
    if (!slot) {
      return { success: false, message: 'Cannot determine equipment slot for this item' };
    }

    // Check realm compatibility
    if (item.realm > this.player.realm) {
      return {
        success: false,
        message: `Your cultivation realm is too low to equip this ${item.category.toLowerCase()}`
      };
    }

    // Attempt to equip
    const equipped = this.inventorySystem.equipItem(item.id, slot);
    if (!equipped) {
      return { success: false, message: 'Failed to equip item (inventory full or invalid slot)' };
    }

    return {
      success: true,
      message: `Equipped ${item.name} to ${slot}`,
      effects: item.effects
    };
  }

  /**
   * Study a cultivation manual
   */
  private studyManual(item: Item): { success: boolean; message: string; effects?: ItemEffect[] } {
    // Check if already studied (would need additional tracking)
    // For now, just apply knowledge effects

    const appliedEffects = this.applyEffects(item.effects, item);

    // Remove manual after studying (one-time use)
    this.inventorySystem.removeItem(item.id, 1);

    return {
      success: true,
      message: `Studied ${item.name} and gained cultivation insights`,
      effects: appliedEffects
    };
  }

  /**
   * Absorb qi from spirit stone
   */
  private absorbSpiritStone(item: Item): { success: boolean; message: string; effects?: ItemEffect[] } {
    const appliedEffects = this.applyEffects(item.effects, item);

    // Spirit stones can be used multiple times, reduce durability
    if (item.durability) {
      item.durability--;
      if (item.durability <= 0) {
        this.inventorySystem.removeItem(item.id, 1);
        return {
          success: true,
          message: `Absorbed the last qi from ${item.name} - spirit stone depleted`,
          effects: appliedEffects
        };
      }
    }

    return {
      success: true,
      message: `Absorbed qi from ${item.name}`,
      effects: appliedEffects
    };
  }

  /**
   * Use spirit stone to enhance automatic qi gathering
   */
  private enhanceSpiritStone(item: Item): { success: boolean; message: string; effects?: ItemEffect[] } {
    // Check if player already has a spirit stone enhancing qi gathering
    if (this.player.enhancedSpiritStoneId) {
      return {
        success: false,
        message: 'You can only enhance qi gathering with one spirit stone at a time'
      };
    }

    // Set this stone as the enhanced stone
    this.player.enhancedSpiritStoneId = item.id;

    // Remove the stone from inventory (it's now "in use" for enhancement)
    this.inventorySystem.removeItem(item.id, 1);

    return {
      success: true,
      message: `Enhanced qi gathering with ${item.name}. Automatic qi absorption increased!`
    };
  }

  /**
   * Unequip an item
   */
  unequipItem(slot: EquipmentSlot): { success: boolean; message: string } {
    const unequipped = this.inventorySystem.unequipItem(slot);
    if (!unequipped) {
      return { success: false, message: 'No item equipped in this slot' };
    }

    return { success: true, message: `Unequipped item from ${slot}` };
  }

  /**
   * Combine/stack items
   */
  combineItems(itemIds: string[]): { success: boolean; message: string; result?: Item } {
    if (itemIds.length < 2) {
      return { success: false, message: 'Need at least 2 items to combine' };
    }

    const items = itemIds.map(id => this.findItem(id)).filter(item => item !== null) as Item[];

    if (items.length !== itemIds.length) {
      return { success: false, message: 'One or more items not found' };
    }

    // Check if items can be combined
    if (!this.canCombineItems(items)) {
      return { success: false, message: 'These items cannot be combined' };
    }

    // Simple stacking for identical items
    if (this.areItemsIdentical(items)) {
      const baseItem = items[0];
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      // Remove all items
      items.forEach(item => this.inventorySystem.removeItem(item.id, item.quantity));

      // Add combined item
      const combinedItem: Item = {
        ...baseItem,
        quantity: Math.min(totalQuantity, baseItem.maxStack || 99)
      };

      this.inventorySystem.addItem(combinedItem);

      return {
        success: true,
        message: `Combined ${items.length} stacks into ${combinedItem.quantity} ${baseItem.name}`,
        result: combinedItem
      };
    }

    // Advanced combining (alchemy, crafting) - placeholder for future implementation
    return { success: false, message: 'Advanced combining not yet implemented' };
  }

  /**
   * Apply item effects to player
   */
  private applyEffects(effects: ItemEffect[], item: Item): ItemEffect[] {
    const appliedEffects: ItemEffect[] = [];

    for (const effect of effects) {
      try {
        this.applySingleEffect(effect, item);
        appliedEffects.push(effect);
      } catch (error) {
        console.error(`Failed to apply effect ${effect.type}:`, error);
      }
    }

    return appliedEffects;
  }

  /**
   * Apply a single effect to the player
   */
  private applySingleEffect(effect: ItemEffect, item: Item): void {
    const value = effect.isPercentage ?
      (this.getBaseStatForEffect(effect.type) * effect.value / 100) :
      effect.value;

    switch (effect.type) {
      case 'qi_absorption':
        this.player.qi = Math.min(this.player.maxQi, this.player.qi + value);
        break;

      case 'cultivation_speed':
        // Temporary cultivation speed boost (would need timer system)
        console.log(`Cultivation speed increased by ${value}% for ${effect.duration} days`);
        break;

      case 'combat_power':
        // Equipment bonus (tracked separately)
        console.log(`Combat power increased by ${value}`);
        break;

      case 'element_boost':
        if (effect.element && this.player.elements[effect.element] !== undefined) {
          this.player.elements[effect.element] = Math.min(100,
            this.player.elements[effect.element] + value);
        }
        break;

      case 'comprehension':
        // Increase talent temporarily
        console.log(`Comprehension increased by ${value}% for ${effect.duration} days`);
        break;

      case 'luck':
        // Luck effects (would need luck system)
        console.log(`Luck increased by ${value}% for ${effect.duration} days`);
        break;

      default:
        console.log(`Applied ${effect.type} effect: ${value}`);
    }
  }

  /**
   * Get base stat value for percentage calculations
   */
  private getBaseStatForEffect(effectType: string): number {
    switch (effectType) {
      case 'qi_absorption':
        return this.player.maxQi;
      case 'cultivation_speed':
        return 100; // Base cultivation speed
      case 'combat_power':
        return 100; // Base combat power
      default:
        return 100;
    }
  }

  /**
   * Get equipment slot for item
   */
  private getEquipmentSlotForItem(item: Item): EquipmentSlot | null {
    switch (item.category) {
      case ItemCategory.Weapon:
        return EquipmentSlot.Weapon;
      case ItemCategory.Armor:
        return EquipmentSlot.Armor;
      case ItemCategory.Charm:
        // Auto-assign to first available accessory slot
        const equipped = this.inventorySystem.getEquippedItems();
        if (!equipped[EquipmentSlot.Accessory1]) return EquipmentSlot.Accessory1;
        if (!equipped[EquipmentSlot.Accessory2]) return EquipmentSlot.Accessory2;
        return EquipmentSlot.Accessory1; // Default to first slot
      default:
        return null;
    }
  }

  /**
   * Find item in inventory
   */
  private findItem(itemId: string): Item | null {
    return this.inventorySystem.getItems().find(item => item.id === itemId) || null;
  }

  /**
   * Check if items can be combined
   */
  private canCombineItems(items: Item[]): boolean {
    // For now, only allow identical items to stack
    return this.areItemsIdentical(items);
  }

  /**
   * Check if all items are identical
   */
  private areItemsIdentical(items: Item[]): boolean {
    if (items.length < 2) return false;

    const first = items[0];
    return items.every(item =>
      item.name === first.name &&
      item.category === first.category &&
      item.quality === first.quality &&
      item.element === first.element &&
      item.realm === first.realm
    );
  }

  /**
   * Get item tooltip/description with current effects
   */
  getItemTooltip(item: Item): string {
    let tooltip = `${item.name}\n`;
    tooltip += `Quality: ${ItemQuality[item.quality]}\n`;
    tooltip += `Category: ${item.category.replace('_', ' ')}\n`;

    if (item.element) {
      tooltip += `Element: ${item.element}\n`;
    }

    tooltip += `Realm: ${CultivationRealm[item.realm]}\n`;
    tooltip += `Value: ${item.value} essence\n`;

    if (item.durability && item.maxDurability) {
      tooltip += `Durability: ${item.durability}/${item.maxDurability}\n`;
    }

    if (item.quantity > 1) {
      tooltip += `Quantity: ${item.quantity}\n`;
    }

    tooltip += `\nEffects:\n`;
    item.effects.forEach(effect => {
      const value = effect.isPercentage ? `${effect.value}%` : effect.value;
      const element = effect.element ? ` (${effect.element})` : '';
      const duration = effect.duration ? ` for ${effect.duration} days` : '';
      tooltip += `• ${effect.type.replace('_', ' ')}: ${value}${element}${duration}\n`;
    });

    tooltip += `\n${item.description}`;

    return tooltip;
  }

  /**
   * Get currently equipped items with their effects
   */
  getEquippedEffects(): Record<EquipmentSlot, ItemEffect[]> {
    const equipped = this.inventorySystem.getEquippedItems();
    const effects: Record<EquipmentSlot, ItemEffect[]> = {
      [EquipmentSlot.Weapon]: [],
      [EquipmentSlot.Armor]: [],
      [EquipmentSlot.Accessory1]: [],
      [EquipmentSlot.Accessory2]: []
    };

    Object.entries(equipped).forEach(([slot, item]) => {
      if (item) {
        effects[slot as EquipmentSlot] = item.effects;
      }
    });

    return effects;
  }
}