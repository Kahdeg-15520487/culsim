/**
 * Item System Utilities
 *
 * Provides functions for item scaling, generation, and management
 * based on quality, rarity, and cultivation realm.
 */

import {
  Item,
  ItemCategory,
  ItemQuality,
  CultivationRealm,
  Element,
  ItemEffect,
  QUALITY_MULTIPLIERS,
  REALM_SCALING_FACTORS,
  BASE_ITEM_STATS,
  QUALITY_DROP_RATES
} from '../types';
import { i18n } from './i18n';

export class ItemSystem {
  /**
   * Calculate scaled stat value based on quality and realm
   */
  static calculateScaledStat(baseValue: number, quality: ItemQuality, realm: CultivationRealm): number {
    const qualityMultiplier = QUALITY_MULTIPLIERS[quality];
    const realmMultiplier = REALM_SCALING_FACTORS[realm];
    return Math.floor(baseValue * qualityMultiplier * realmMultiplier);
  }

  /**
   * Generate item effects based on category, quality, and realm
   */
  static generateItemEffects(
    category: ItemCategory,
    quality: ItemQuality,
    realm: CultivationRealm,
    element?: Element
  ): ItemEffect[] {
    const effects: ItemEffect[] = [];
    const baseStats = BASE_ITEM_STATS[category];

    switch (category) {
      case ItemCategory.Armor:
        effects.push({
          type: 'defense',
          value: this.calculateScaledStat((baseStats as any).defense, quality, realm),
          isPercentage: false
        });
        if (quality >= ItemQuality.Rare) {
          effects.push({
            type: 'elemental_resistance',
            value: quality * 5, // 5% per quality level above Common
            element,
            isPercentage: true
          });
        }
        break;

      case ItemCategory.Weapon:
        effects.push({
          type: 'combat_power',
          value: this.calculateScaledStat((baseStats as any).attack, quality, realm),
          element,
          isPercentage: false
        });
        if (quality >= ItemQuality.Epic) {
          effects.push({
            type: 'critical_chance',
            value: (quality - 2) * 2, // 2% per quality level above Rare
            isPercentage: true
          });
        }
        break;

      case ItemCategory.Pill:
        effects.push({
          type: 'qi_absorption',
          value: this.calculateScaledStat((baseStats as any).effectStrength, quality, realm),
          duration: (baseStats as any).duration * QUALITY_MULTIPLIERS[quality],
          isPercentage: true
        });
        if (quality >= ItemQuality.Uncommon) {
          effects.push({
            type: 'cultivation_speed',
            value: quality * 10, // 10% per quality level
            duration: (baseStats as any).duration,
            isPercentage: true
          });
        }
        break;

      case ItemCategory.SpiritStone:
        effects.push({
          type: 'qi_absorption',
          value: this.calculateScaledStat((baseStats as any).qiStorage, quality, realm),
          isPercentage: false
        });
        break;

      case ItemCategory.Herb:
        effects.push({
          type: 'qi_absorption',
          value: this.calculateScaledStat((baseStats as any).qiContent, quality, realm),
          isPercentage: false
        });
        if (element) {
          effects.push({
            type: 'element_boost',
            value: quality * 5,
            element,
            isPercentage: true
          });
        }
        break;

      case ItemCategory.Charm:
        effects.push({
          type: 'luck',
          value: this.calculateScaledStat((baseStats as any).effectStrength, quality, realm),
          duration: (baseStats as any).duration,
          isPercentage: true
        });
        if (quality >= ItemQuality.Rare) {
          effects.push({
            type: 'comprehension',
            value: quality * 3,
            duration: (baseStats as any).duration * 2,
            isPercentage: true
          });
        }
        break;
    }

    return effects;
  }

  /**
   * Generate item name keys for i18n translation
   */
  static generateItemNameKeys(
    category: ItemCategory,
    quality: ItemQuality,
    realm: CultivationRealm,
    element?: Element
  ): { nameQuality: string; nameBase: string; nameElement?: string; nameRealm: string } {
    const qualityKeys = {
      [ItemQuality.Common]: 'itemNames.qualityCommon',
      [ItemQuality.Uncommon]: 'itemNames.qualityRefined',
      [ItemQuality.Rare]: 'itemNames.qualitySuperior',
      [ItemQuality.Epic]: 'itemNames.qualityExquisite',
      [ItemQuality.Legendary]: 'itemNames.qualityLegendary',
      [ItemQuality.Mythical]: 'itemNames.qualityMythical'
    };

    const realmKeys = {
      [CultivationRealm.Mortal]: 'itemNames.realmMortal',
      [CultivationRealm.QiCondensation]: 'itemNames.realmQiCondensation',
      [CultivationRealm.FoundationEstablishment]: 'itemNames.realmFoundationEstablishment',
      [CultivationRealm.CoreFormation]: 'itemNames.realmCoreFormation',
      [CultivationRealm.NascentSoul]: 'itemNames.realmNascentSoul',
      [CultivationRealm.DivineTransformation]: 'itemNames.realmDivineTransformation',
      [CultivationRealm.VoidRefinement]: 'itemNames.realmVoidRefinement',
      [CultivationRealm.ImmortalAscension]: 'itemNames.realmImmortalAscension'
    };

    const elementKeys = {
      [Element.Metal]: 'itemNames.elementMetal',
      [Element.Wood]: 'itemNames.elementWood',
      [Element.Water]: 'itemNames.elementWater',
      [Element.Fire]: 'itemNames.elementFire',
      [Element.Earth]: 'itemNames.elementEarth'
    };

    const baseKeys = {
      [ItemCategory.Armor]: 'itemNames.baseArmor',
      [ItemCategory.Weapon]: 'itemNames.baseWeapon',
      [ItemCategory.Pill]: 'itemNames.basePill',
      [ItemCategory.Drug]: 'itemNames.baseDrug',
      [ItemCategory.Poison]: 'itemNames.basePoison',
      [ItemCategory.SpiritStone]: 'itemNames.baseSpiritStone',
      [ItemCategory.Herb]: 'itemNames.baseHerb',
      [ItemCategory.BeastPart]: 'itemNames.baseBeastPart',
      [ItemCategory.Charm]: 'itemNames.baseCharm',
      [ItemCategory.Manual]: 'itemNames.baseManual'
    };

    return {
      nameQuality: qualityKeys[quality],
      nameBase: baseKeys[category],
      nameElement: element ? elementKeys[element] : undefined,
      nameRealm: realmKeys[realm]
    };
  }

  /**
   * Generate translated item name from i18n keys
   */
  static getTranslatedItemName(item: Item): string {
    let name = i18n.t(item.nameQuality) + i18n.t(item.nameBase);

    if (item.nameElement) {
      name = `${i18n.t(item.nameElement)} ${name}`;
    }

    if (item.nameRealm) {
      name += i18n.t(item.nameRealm);
    }

    return name;
  }

  /**
   * Calculate item value based on category, quality, and realm
   */
  static calculateItemValue(
    category: ItemCategory,
    quality: ItemQuality,
    realm: CultivationRealm
  ): number {
    const baseValue = BASE_ITEM_STATS[category]?.value || 10;
    return Math.floor(
      baseValue *
      QUALITY_MULTIPLIERS[quality] *
      (REALM_SCALING_FACTORS[realm] * 0.5) // Reduce value scaling compared to stats
    );
  }

  /**
   * Determine quality based on drop chance and realm
   */
  static determineItemQuality(realm: CultivationRealm, random: { chance: (percent: number) => boolean }): ItemQuality {
    // Higher realms have chance for better quality
    const realmBonus = Math.min(realm * 2, 20); // Max 20% bonus

    // Check from highest to lowest quality
    for (let q = ItemQuality.Mythical; q >= ItemQuality.Common; q--) {
      const baseChance = QUALITY_DROP_RATES[q];
      const adjustedChance = Math.min(baseChance + realmBonus, 100);

      if (random.chance(adjustedChance)) {
        return q;
      }
    }

    return ItemQuality.Common; // Fallback
  }

  /**
   * Create a complete item with all properties
   */
  static createItem(
    category: ItemCategory,
    quality: ItemQuality,
    realm: CultivationRealm,
    element?: Element,
    id?: string
  ): Item {
    const effects = this.generateItemEffects(category, quality, realm, element);
    const nameKeys = this.generateItemNameKeys(category, quality, realm, element);
    const value = this.calculateItemValue(category, quality, realm);

    const baseStats = BASE_ITEM_STATS[category];
    const durability = 'durability' in baseStats ?
      Math.floor(baseStats.durability * QUALITY_MULTIPLIERS[quality]) : undefined;

    return {
      id: id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...nameKeys,
      category,
      quality,
      realm,
      element,
      effects,
      descriptionKey: this.generateItemDescriptionKey(category, quality, realm, element),
      value,
      durability,
      maxDurability: durability,
      stackable: category === ItemCategory.Pill || category === ItemCategory.SpiritStone || category === ItemCategory.Herb,
      maxStack: category === ItemCategory.Pill ? 10 :
               category === ItemCategory.SpiritStone ? 50 :
               category === ItemCategory.Herb ? 20 : 1,
      quantity: 1
    };
  }

  /**
   * Generate item description key for translation
   */
  private static generateItemDescriptionKey(
    category: ItemCategory,
    quality: ItemQuality,
    realm: CultivationRealm,
    element?: Element
  ): string {
    return 'itemDescriptions.generic';
  }

  /**
   * Get translated item description with parameters
   */
  static getTranslatedItemDescription(item: Item): string {
    const qualityWords = {
      [ItemQuality.Common]: 'itemQualities.common',
      [ItemQuality.Uncommon]: 'itemQualities.uncommon',
      [ItemQuality.Rare]: 'itemQualities.rare',
      [ItemQuality.Epic]: 'itemQualities.epic',
      [ItemQuality.Legendary]: 'itemQualities.legendary',
      [ItemQuality.Mythical]: 'itemQualities.mythical'
    };

    const realmNames = {
      0: 'realms.mortal',
      1: 'realms.qiCondensation',
      2: 'realms.foundationEstablishment',
      3: 'realms.coreFormation',
      4: 'realms.nascentSoul',
      5: 'realms.divineTransformation',
      6: 'realms.voidRefinement',
      7: 'realms.immortalAscension'
    };

    const categoryNames = {
      [ItemCategory.Armor]: 'itemCategories.armor',
      [ItemCategory.Weapon]: 'itemCategories.weapon',
      [ItemCategory.Charm]: 'itemCategories.charm',
      [ItemCategory.Manual]: 'itemCategories.manual',
      [ItemCategory.Pill]: 'itemCategories.pill',
      [ItemCategory.Drug]: 'itemCategories.drug',
      [ItemCategory.Herb]: 'itemCategories.herb',
      [ItemCategory.SpiritStone]: 'itemCategories.spirit_stone',
      [ItemCategory.Poison]: 'itemCategories.poison',
      [ItemCategory.BeastPart]: 'itemCategories.beast_part'
    };

    const params: any = {
      quality: i18n.t(qualityWords[item.quality]).toLowerCase(),
      category: i18n.t(categoryNames[item.category as keyof typeof categoryNames]).toLowerCase(),
      realm: i18n.t(realmNames[item.realm as keyof typeof realmNames]).toLowerCase()
    };

    if (item.element !== undefined) {
      const elementIndex = Object.values(Element).indexOf(item.element as any);
      params.element = i18n.getElementName(elementIndex);
      return i18n.t('itemDescriptions.elemental', params);
    } else {
      return i18n.t('itemDescriptions.basic', params);
    }
  }
}