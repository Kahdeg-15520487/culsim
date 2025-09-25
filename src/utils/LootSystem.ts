/**
 * Loot System
 *
 * Generates and manages loot drops from combat, exploration, and other sources.
 * Integrates with the unified inventory system for proper item management.
 */

import {
  Item,
  ItemCategory,
  ItemQuality,
  CultivationRealm,
  Element,
  Enemy,
  LootTable,
  LootItem,
  Player
} from '../types';
import { ItemSystem } from './ItemSystem';
import { Random } from './Random';

export class LootSystem {
  private itemSystem: ItemSystem;
  private random: Random;

  constructor(random: Random) {
    this.random = random;
    this.itemSystem = new ItemSystem();
  }

  /**
   * Generate loot table for an enemy based on their realm and characteristics
   */
  generateEnemyLootTable(enemy: Enemy): LootTable {
    const lootTable: LootTable = {
      guaranteed: [],
      chance: [],
      rare: []
    };

    // Base loot chance increases with enemy realm
    const baseLootChance = Math.min(0.3 + (enemy.realm * 0.2), 0.9);

    // Guaranteed drops (always get at least one item)
    if (this.random.chance(baseLootChance)) {
      lootTable.guaranteed.push(this.generateSpiritStone(enemy.realm));
    }

    // Chance drops
    if (this.random.chance(baseLootChance * 0.6)) {
      lootTable.chance.push(this.generateElementalCrystal(enemy.realm, enemy.elements));
    }

    // Rare drops (cultivation insights, special items)
    if (this.random.chance(baseLootChance * 0.2)) {
      lootTable.rare.push(this.generateCultivationInsight(enemy.realm));
    }

    // Special enemy-specific drops
    this.addSpecialEnemyLoot(enemy, lootTable);

    return lootTable;
  }

  /**
   * Generate a spirit stone item
   */
  private generateSpiritStone(realm: CultivationRealm): LootItem {
    const quality = ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) });
    const item = ItemSystem.createItem(ItemCategory.SpiritStone, quality, realm);

    return {
      item,
      dropRate: 1.0, // Guaranteed drop
      quantity: this.random.int(1, 3)
    };
  }

  /**
   * Generate an elemental crystal based on enemy elements
   */
  private generateElementalCrystal(realm: CultivationRealm, enemyElements: Record<Element, number>): LootItem {
    // Find the enemy's strongest element
    let strongestElement: Element = Element.Metal;
    let maxAffinity = 0;

    Object.entries(enemyElements).forEach(([element, affinity]) => {
      if (affinity > maxAffinity) {
        maxAffinity = affinity;
        strongestElement = element as Element;
      }
    });

    const quality = ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) });
    const item = ItemSystem.createItem(ItemCategory.Herb, quality, realm, strongestElement);

    return {
      item,
      dropRate: 0.6,
      quantity: 1
    };
  }

  /**
   * Generate a cultivation insight item
   */
  private generateCultivationInsight(realm: CultivationRealm): LootItem {
    const quality = ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) });
    const item = ItemSystem.createItem(ItemCategory.Manual, quality, realm);

    return {
      item,
      dropRate: 0.2,
      quantity: 1
    };
  }

  /**
   * Add special loot based on enemy characteristics
   */
  private addSpecialEnemyLoot(enemy: Enemy, lootTable: LootTable): void {
    // Boss enemies get better loot
    if (enemy.qi > enemy.maxQi * 0.8) {
      if (this.random.chance(0.3)) {
        lootTable.rare.push(this.generateRareWeapon(enemy.realm, enemy.elements));
      }
    }

    // Elemental enemies drop element-specific items
    const dominantElement = this.getDominantElement(enemy.elements);
    if (dominantElement && this.random.chance(0.25)) {
      lootTable.chance.push(this.generateElementalPill(enemy.realm, dominantElement));
    }
  }

  /**
   * Generate a rare weapon drop
   */
  private generateRareWeapon(realm: CultivationRealm, enemyElements: Record<Element, number>): LootItem {
    const dominantElement = this.getDominantElement(enemyElements);
    const quality = Math.max(ItemQuality.Rare,
      ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) }));

    const item = ItemSystem.createItem(ItemCategory.Weapon, quality, realm, dominantElement || undefined);

    return {
      item,
      dropRate: 0.1,
      quantity: 1
    };
  }

  /**
   * Generate an elemental pill
   */
  private generateElementalPill(realm: CultivationRealm, element: Element): LootItem {
    const quality = ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) });
    const item = ItemSystem.createItem(ItemCategory.Pill, quality, realm, element);

    return {
      item,
      dropRate: 0.4,
      quantity: this.random.int(1, 2)
    };
  }

  /**
   * Get the dominant element from element affinities
   */
  private getDominantElement(elements: Record<Element, number>): Element | null {
    let dominant: Element | null = null;
    let maxAffinity = 0;

    Object.entries(elements).forEach(([element, affinity]) => {
      if (affinity > maxAffinity) {
        maxAffinity = affinity;
        dominant = element as Element;
      }
    });

    return dominant;
  }

  /**
   * Resolve loot drops from a loot table
   */
  resolveLootDrops(lootTable: LootTable): Item[] {
    const droppedItems: Item[] = [];

    // Guaranteed drops
    lootTable.guaranteed.forEach(lootItem => {
      const item = { ...lootItem.item };
      item.quantity = lootItem.quantity;
      droppedItems.push(item);
    });

    // Chance drops
    lootTable.chance.forEach(lootItem => {
      if (this.random.chance(lootItem.dropRate)) {
        const item = { ...lootItem.item };
        item.quantity = lootItem.quantity;
        droppedItems.push(item);
      }
    });

    // Rare drops
    lootTable.rare.forEach(lootItem => {
      if (this.random.chance(lootItem.dropRate)) {
        const item = { ...lootItem.item };
        item.quantity = lootItem.quantity;
        droppedItems.push(item);
      }
    });

    return droppedItems;
  }

  /**
   * Generate exploration loot (chests, hidden areas, etc.)
   */
  generateExplorationLoot(realm: CultivationRealm, explorationType: 'chest' | 'hidden_cache' | 'ancient_ruins'): Item[] {
    const lootTable: LootTable = {
      guaranteed: [],
      chance: [],
      rare: []
    };

    const baseQuality = ItemSystem.determineItemQuality(realm, { chance: (p: number) => this.random.chance(p) });

    switch (explorationType) {
      case 'chest':
        // Chests always have some basic loot
        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.SpiritStone, baseQuality, realm),
          dropRate: 1.0,
          quantity: this.random.int(2, 5)
        });

        if (this.random.chance(0.6)) {
          lootTable.chance.push({
            item: this.itemSystem.createItem(ItemCategory.Pill, baseQuality, realm),
            dropRate: 0.6,
            quantity: 1
          });
        }
        break;

      case 'hidden_cache':
        // Hidden caches have better loot
        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.SpiritStone, Math.max(baseQuality, ItemQuality.Uncommon), realm),
          dropRate: 1.0,
          quantity: this.random.int(3, 8)
        });

        lootTable.chance.push({
          item: this.itemSystem.createItem(ItemCategory.Charm, baseQuality, realm),
          dropRate: 0.4,
          quantity: 1
        });
        break;

      case 'ancient_ruins':
        // Ancient ruins have the best loot
        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.Manual, Math.max(baseQuality, ItemQuality.Rare), realm),
          dropRate: 1.0,
          quantity: 1
        });

        lootTable.rare.push({
          item: this.itemSystem.createItem(ItemCategory.Weapon, Math.max(baseQuality, ItemQuality.Epic), realm),
          dropRate: 0.2,
          quantity: 1
        });
        break;
    }

    return this.resolveLootDrops(lootTable);
  }

  /**
   * Generate quest/completion rewards
   */
  generateQuestRewards(realm: CultivationRealm, questType: 'main' | 'side' | 'daily', completion: 'bronze' | 'silver' | 'gold'): Item[] {
    const lootTable: LootTable = {
      guaranteed: [],
      chance: [],
      rare: []
    };

    let baseQuality = ItemQuality.Common;
    let rewardMultiplier = 1;

    // Adjust quality and quantity based on quest type and completion
    switch (completion) {
      case 'bronze':
        baseQuality = ItemQuality.Uncommon;
        rewardMultiplier = 1;
        break;
      case 'silver':
        baseQuality = ItemQuality.Rare;
        rewardMultiplier = 1.5;
        break;
      case 'gold':
        baseQuality = ItemQuality.Epic;
        rewardMultiplier = 2;
        break;
    }

    switch (questType) {
      case 'main':
        lootTable.guaranteed.push({
          item: ItemSystem.createItem(ItemCategory.SpiritStone, baseQuality, realm),
          dropRate: 1.0,
          quantity: Math.floor(10 * rewardMultiplier)
        });

        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.Manual, baseQuality, realm),
          dropRate: 1.0,
          quantity: 1
        });
        break;

      case 'side':
        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.Pill, baseQuality, realm),
          dropRate: 1.0,
          quantity: Math.floor(3 * rewardMultiplier)
        });
        break;

      case 'daily':
        lootTable.guaranteed.push({
          item: this.itemSystem.createItem(ItemCategory.SpiritStone, baseQuality, realm),
          dropRate: 1.0,
          quantity: Math.floor(5 * rewardMultiplier)
        });
        break;
    }

    return this.resolveLootDrops(lootTable);
  }

  /**
   * Filter and sort loot items for display
   */
  filterAndSortLoot(items: Item[], filter?: { category?: ItemCategory; quality?: ItemQuality; element?: Element },
                     sortBy: 'value' | 'quality' | 'name' = 'value'): Item[] {
    let filtered = items;

    // Apply filters
    if (filter) {
      filtered = items.filter(item => {
        if (filter.category && item.category !== filter.category) return false;
        if (filter.quality && item.quality < filter.quality) return false;
        if (filter.element && item.element !== filter.element) return false;
        return true;
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.value - a.value;
        case 'quality':
          return b.quality - a.quality;
        case 'name':
          return ItemSystem.getTranslatedItemName(a).localeCompare(ItemSystem.getTranslatedItemName(b));
        default:
          return 0;
      }
    });

    return filtered;
  }

  /**
   * Get loot summary statistics
   */
  getLootSummary(items: Item[]): {
    totalValue: number;
    totalItems: number;
    qualityBreakdown: Record<ItemQuality, number>;
    categoryBreakdown: Record<ItemCategory, number>;
  } {
    const summary = {
      totalValue: 0,
      totalItems: 0,
      qualityBreakdown: {} as Record<ItemQuality, number>,
      categoryBreakdown: {} as Record<ItemCategory, number>
    };

    items.forEach(item => {
      summary.totalValue += item.value * item.quantity;
      summary.totalItems += item.quantity;

      // Quality breakdown
      summary.qualityBreakdown[item.quality] = (summary.qualityBreakdown[item.quality] || 0) + item.quantity;

      // Category breakdown
      summary.categoryBreakdown[item.category] = (summary.categoryBreakdown[item.category] || 0) + item.quantity;
    });

    return summary;
  }
}