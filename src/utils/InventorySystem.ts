/**
 * Unified Inventory System
 *
 * Manages all player possessions including items, artifacts, resources, and equipment.
 * Provides comprehensive inventory management with stacking, categorization, and organization.
 */

import {
  Item,
  ItemCategory,
  ItemQuality,
  Resource,
  CultivationInsight,
  Element,
  Player,
  InventorySlot,
  EquipmentSlot,
  InventoryFilter,
  InventorySort
} from '../types';

export class InventorySystem {
  private player: Player;
  private maxSlots: number = 100; // Base inventory capacity
  private storageExpansions: number = 0; // Additional slots from storage items

  constructor(player: Player) {
    this.player = player;
    this.initializeInventory();
  }

  /**
   * Initialize or migrate inventory structure
   */
  private initializeInventory(): void {
    if (!this.player.inventory) {
      this.player.inventory = {
        items: [],
        equippedItems: {
          [EquipmentSlot.Weapon]: undefined,
          [EquipmentSlot.Armor]: undefined,
          [EquipmentSlot.Accessory1]: undefined,
          [EquipmentSlot.Accessory2]: undefined
        },
        storageCapacity: this.maxSlots,
        weight: 0,
        maxWeight: 1000,
        organization: {
          bags: [],
          categories: this.initializeCategories()
        }
      };
    }

    // Migrate legacy artifacts to new system if needed
    // Removed: legacy artifact migration no longer needed
  }

  /**
   * Initialize category structure for organization
   */
  private initializeCategories(): Record<string, Item[]> {
    return {
      [ItemCategory.Weapon]: [],
      [ItemCategory.Armor]: [],
      [ItemCategory.Pill]: [],
      [ItemCategory.Herb]: [],
      [ItemCategory.SpiritStone]: [],
      [ItemCategory.Charm]: [],
      [ItemCategory.Manual]: [],
      [ItemCategory.Drug]: [],
      [ItemCategory.Poison]: [],
      [ItemCategory.BeastPart]: [],
      artifacts: [], // Legacy artifacts
      resources: [], // Raw materials
      insights: [] // Knowledge items
    };
  }

  /**
   * Add item to inventory with stacking logic
   */
  addItem(item: Item): boolean {
    console.log('DEBUG: InventorySystem.addItem called with:', item.name, item.category);
    
    if (this.isInventoryFull()) {
      console.log('DEBUG: Inventory is full');
      return false; // Inventory full
    }

    console.log('DEBUG: Inventory not full, checking if stackable');

    // Check if item can stack
    if (item.stackable) {
      console.log('DEBUG: Item is stackable');
      const existingStack = this.findStackableItem(item);
      if (existingStack) {
        console.log('DEBUG: Found existing stack, updating quantity');
        existingStack.quantity += item.quantity;
        this.updateWeight();
        console.log('DEBUG: Stack updated successfully');
        return true;
      }
    }

    console.log('DEBUG: Adding as new item');
    // Add as new item
    this.player.inventory!.items.push(item);
    console.log('DEBUG: Item pushed to inventory');
    
    this.updateWeight();
    console.log('DEBUG: Weight updated');
    
    this.updateCategories();
    console.log('DEBUG: Categories updated');
    
    console.log('DEBUG: Item added successfully');
    return true;
  }

  /**
   * Remove item from inventory
   */
  removeItem(itemId: string, quantity: number = 1): boolean {
    const itemIndex = this.player.inventory!.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    const item = this.player.inventory!.items[itemIndex];

    if (item.stackable && item.quantity > quantity) {
      item.quantity -= quantity;
    } else {
      this.player.inventory!.items.splice(itemIndex, 1);
    }

    this.updateWeight();
    this.updateCategories();
    return true;
  }

  /**
   * Find existing stackable item
   */
  private findStackableItem(newItem: Item): Item | null {
    return this.player.inventory!.items.find(item =>
      item.stackable &&
      item.name === newItem.name &&
      item.category === newItem.category &&
      item.quality === newItem.quality &&
      item.element === newItem.element
    ) || null;
  }

  /**
   * Check if inventory is full
   */
  isInventoryFull(): boolean {
    return this.player.inventory!.items.length >= this.getMaxCapacity();
  }

  /**
   * Get maximum inventory capacity
   */
  getMaxCapacity(): number {
    return this.maxSlots + (this.storageExpansions * 25); // Each expansion adds 25 slots
  }

  /**
   * Update inventory weight
   */
  private updateWeight(): void {
    this.player.inventory!.weight = this.player.inventory!.items.reduce((total, item) => {
      // Assume each item weighs 1 unit, stackable items weigh per quantity
      return total + (item.stackable ? item.quantity : 1);
    }, 0);
  }

  /**
   * Update category organization
   */
  private updateCategories(): void {
    console.log('DEBUG: updateCategories called');
    
    // Reset categories
    this.player.inventory!.organization.categories = this.initializeCategories();
    console.log('DEBUG: Categories reset');
    
    // Reorganize items
    for (const item of this.player.inventory!.items) {
      console.log('DEBUG: Processing item:', item.name, 'category:', item.category);
      
      if (item.category in this.player.inventory!.organization.categories) {
        console.log('DEBUG: Category exists, pushing item');
        this.player.inventory!.organization.categories[item.category].push(item);
      } else {
        console.log('DEBUG: Category does not exist for item:', item.category);
      }
    }
    
    console.log('DEBUG: updateCategories completed');
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: ItemCategory): Item[] {
    return this.player.inventory!.organization.categories[category] || [];
  }

  /**
   * Get all items with optional filtering and sorting
   */
  getItems(filter?: InventoryFilter, sort?: InventorySort): Item[] {
    let items = [...this.player.inventory!.items];

    // Apply filters
    if (filter) {
      items = this.applyFilters(items, filter);
    }

    // Apply sorting
    if (sort) {
      items = this.applySorting(items, sort);
    }

    return items;
  }

  /**
   * Apply filters to item list
   */
  private applyFilters(items: Item[], filter: InventoryFilter): Item[] {
    return items.filter(item => {
      if (filter.category && item.category !== filter.category) return false;
      if (filter.quality && item.quality < filter.quality) return false;
      if (filter.element && item.element !== filter.element) return false;
      if (filter.realm && item.realm > filter.realm) return false; // Items above player realm
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower) &&
            !item.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Apply sorting to item list
   */
  private applySorting(items: Item[], sort: InventorySort): Item[] {
    return items.sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quality':
          comparison = b.quality - a.quality; // Higher quality first
          break;
        case 'value':
          comparison = b.value - a.value; // Higher value first
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'quantity':
          comparison = b.quantity - a.quantity; // Higher quantity first
          break;
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Equip item to equipment slot
   */
  equipItem(itemId: string, slot: EquipmentSlot): boolean {
    const item = this.player.inventory!.items.find(i => i.id === itemId);
    if (!item) return false;

    // Check if item can be equipped to this slot
    if (!this.canEquipToSlot(item, slot)) return false;

    // Unequip current item in slot if any
    if (this.player.inventory!.equippedItems[slot]) {
      this.unequipItem(slot);
    }

    // Remove from inventory and equip
    this.removeItem(itemId);
    this.player.inventory!.equippedItems[slot] = item;

    return true;
  }

  /**
   * Unequip item from equipment slot
   */
  unequipItem(slot: EquipmentSlot): boolean {
    const equippedItem = this.player.inventory!.equippedItems[slot];
    if (!equippedItem) return false;

    // Try to add back to inventory
    if (!this.addItem(equippedItem)) {
      return false; // Inventory full
    }

    delete this.player.inventory!.equippedItems[slot];
    return true;
  }

  /**
   * Check if item can be equipped to specific slot
   */
  private canEquipToSlot(item: Item, slot: EquipmentSlot): boolean {
    switch (slot) {
      case EquipmentSlot.Weapon:
        return item.category === ItemCategory.Weapon;
      case EquipmentSlot.Armor:
        return item.category === ItemCategory.Armor;
      case EquipmentSlot.Accessory1:
      case EquipmentSlot.Accessory2:
        return item.category === ItemCategory.Charm;
      default:
        return false;
    }
  }

  /**
   * Use consumable item
   */
  useItem(itemId: string): boolean {
    const item = this.player.inventory!.items.find(i => i.id === itemId);
    if (!item) return false;

    // Check if item is consumable
    if (!this.isConsumable(item)) return false;

    // Apply item effects
    this.applyItemEffects(item);

    // Remove or reduce quantity
    this.removeItem(itemId, 1);

    return true;
  }

  /**
   * Check if item is consumable
   */
  private isConsumable(item: Item): boolean {
    return [
      ItemCategory.Pill,
      ItemCategory.Drug,
      ItemCategory.Herb
    ].includes(item.category);
  }

  /**
   * Apply item effects to player
   */
  private applyItemEffects(item: Item): void {
    // This would integrate with the effect system
    // For now, just log the effects
    console.log(`Applying effects from ${item.name}:`, item.effects);
  }

  /**
   * Get equipped items
   */
  getEquippedItems(): Record<EquipmentSlot, Item | undefined> {
    return this.player.inventory!.equippedItems;
  }

  /**
   * Get inventory summary
   */
  getInventorySummary(): {
    totalItems: number;
    uniqueItems: number;
    totalValue: number;
    weight: number;
    capacity: number;
    categories: Record<string, number>;
  } {
    const items = this.player.inventory!.items;
    const categories = Object.keys(this.player.inventory!.organization.categories)
      .reduce((acc, cat) => {
        acc[cat] = this.player.inventory!.organization.categories[cat].length;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      uniqueItems: items.length,
      totalValue: items.reduce((sum, item) => sum + (item.value * item.quantity), 0),
      weight: this.player.inventory!.weight,
      capacity: this.getMaxCapacity(),
      categories
    };
  }

  /**
   * Expand inventory capacity
   */
  expandCapacity(amount: number = 25): void {
    this.storageExpansions += Math.ceil(amount / 25);
    this.player.inventory!.storageCapacity = this.getMaxCapacity();
  }

  /**
   * Get player reference (for external access)
   */
  getPlayer(): Player {
    return this.player;
  }
}